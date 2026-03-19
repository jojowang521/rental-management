#!/usr/bin/env node
/**
 * figma-sync.js
 * 从 Figma REST API 同步颜色 token 到 design-tokens.json
 *
 * 用法：
 *   FIGMA_TOKEN=<your_token> node scripts/figma-sync.js <fileKey>
 *
 * 示例：
 *   FIGMA_TOKEN=figd_xxx node scripts/figma-sync.js HQFmiqvsbukzAAKbiB1sla
 *
 * 说明：
 *   - 只同步颜色（FILL 类型的 style）
 *   - spacing/radius/typography 按 4px 网格手工维护，不覆盖
 *   - 同步结果写入 tokens/design-tokens.json 的 color 块
 *   - 遇到无法匹配的颜色名时，打印警告并跳过（不写入）
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

// ─── 配置 ───────────────────────────────────────────────
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY    = process.argv[2];
const TOKENS_PATH = path.join(__dirname, '..', 'tokens', 'design-tokens.json');

if (!FIGMA_TOKEN) {
  console.error('[figma-sync] 错误：请设置环境变量 FIGMA_TOKEN');
  console.error('  export FIGMA_TOKEN=figd_xxxxxxxxxxxxxxxx');
  process.exit(1);
}
if (!FILE_KEY) {
  console.error('[figma-sync] 错误：请传入 Figma fileKey');
  console.error('  node scripts/figma-sync.js <fileKey>');
  process.exit(1);
}

// ─── 工具函数 ─────────────────────────────────────────────
function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON 解析失败：' + data.slice(0, 200))); }
      });
    }).on('error', reject);
  });
}

/** RGBA(0-1) → HEX */
function rgbaToHex({ r, g, b, a = 1 }) {
  const hex = [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
  if (Math.round(a * 255) < 255) {
    return `rgba(${Math.round(r*255)},${Math.round(g*255)},${Math.round(b*255)},${parseFloat(a.toFixed(2))}) /* #${hex} */`;
  }
  return `#${hex}`;
}

/**
 * 将 Figma style name 映射到 token 路径
 * 例："color/text/primary" → ["text", "primary"]
 * 支持 / 和空格两种分隔符
 */
function nameToPath(name) {
  return name.toLowerCase().replace(/^color[/ ]/i, '').split(/[\/\s]+/).filter(Boolean);
}

// ─── 主流程 ───────────────────────────────────────────────
async function main() {
  console.log(`[figma-sync] 开始同步 fileKey=${FILE_KEY}`);

  // 1. 获取文件中所有 styles
  const stylesRes = await get(`https://api.figma.com/v1/files/${FILE_KEY}/styles`);
  if (stylesRes.status !== 200) {
    console.error('[figma-sync] API 返回错误：', stylesRes);
    process.exit(1);
  }

  const colorStyles = stylesRes.meta.styles.filter(s => s.style_type === 'FILL');
  console.log(`[figma-sync] 找到 ${colorStyles.length} 个颜色 style`);

  if (colorStyles.length === 0) {
    console.warn('[figma-sync] 警告：未找到颜色 style，请确认 Figma 文件有 FILL 类型的 style');
    process.exit(0);
  }

  // 2. 批量获取 style 节点的颜色值（每批 50 个）
  const nodeIds = colorStyles.map(s => s.node_id);
  const batches = [];
  for (let i = 0; i < nodeIds.length; i += 50) {
    batches.push(nodeIds.slice(i, i + 50));
  }

  const colorMap = {}; // nodeId → hex
  for (const batch of batches) {
    const ids = batch.join(',');
    const nodesRes = await get(`https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${ids}`);
    for (const [id, nodeData] of Object.entries(nodesRes.nodes || {})) {
      const doc = nodeData?.document;
      const fill = doc?.fills?.[0];
      if (fill?.type === 'SOLID' && fill.color) {
        colorMap[id] = rgbaToHex(fill.color);
      }
    }
  }

  // 3. 读取当前 design-tokens.json
  const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));
  const newColors = {};
  let synced = 0;
  let skipped = 0;

  // 4. 写入颜色 token
  for (const style of colorStyles) {
    const hex = colorMap[style.node_id];
    if (!hex) { skipped++; continue; }

    const segments = nameToPath(style.name);
    if (segments.length < 2) {
      console.warn(`[figma-sync] 跳过（路径过短）：${style.name}`);
      skipped++; continue;
    }

    // 写入到 newColors 的嵌套路径
    let node = newColors;
    for (let i = 0; i < segments.length - 1; i++) {
      if (!node[segments[i]]) node[segments[i]] = {};
      node = node[segments[i]];
    }
    const leaf = segments[segments.length - 1];
    // 保留原有的 var 字段（若存在）
    const existingVar = tokens.color?.[segments[0]]?.[segments[1]]?.var || '';
    node[leaf] = { value: hex, ...(existingVar ? { var: existingVar } : {}) };
    synced++;
  }

  // 5. 合并（只替换 color 块，保留 spacing/radius/typography/shadow/size）
  tokens.color = newColors;
  tokens._syncedAt = new Date().toISOString();
  tokens._syncedFrom = `https://www.figma.com/design/${FILE_KEY}`;

  fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2), 'utf-8');

  console.log(`[figma-sync] 完成：同步 ${synced} 个颜色，跳过 ${skipped} 个`);
  console.log(`[figma-sync] 已写入 ${TOKENS_PATH}`);
}

main().catch(err => {
  console.error('[figma-sync] 异常：', err.message);
  process.exit(1);
});
