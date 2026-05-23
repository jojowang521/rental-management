#!/usr/bin/env node
/**
 * Export Honeycomb navigation icons from Figma.
 *
 * Source:
 *   fileKey: HQFmiqvsbukzAAKbiB1sla
 *   nodeId:  46:418
 *
 * Usage:
 *   FIGMA_TOKEN=<token> node scripts/figma-export-nav-icons.js
 *
 * Output:
 *   icons/navigation/svg/*.svg
 *   icons/navigation/exported-icons.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY || 'HQFmiqvsbukzAAKbiB1sla';
const NODE_ID = process.env.FIGMA_NODE_ID || '46:418';
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'icons', 'navigation', 'svg');
const OUT_MANIFEST = path.join(ROOT, 'icons', 'navigation', 'exported-icons.json');

if (!FIGMA_TOKEN) {
  console.error('[figma-export-nav-icons] 请先设置 FIGMA_TOKEN');
  process.exit(1);
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (err) { reject(new Error(`JSON parse failed: ${data.slice(0, 200)}`)); }
      });
    }).on('error', reject);
  });
}

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function sanitizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[\\/:*?"<>|#]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'icon';
}

function collectExportableNodes(node, result = []) {
  if (!node) return result;
  const exportable = new Set(['COMPONENT', 'INSTANCE', 'FRAME', 'GROUP', 'VECTOR', 'BOOLEAN_OPERATION']);
  if (exportable.has(node.type) && node.id !== NODE_ID) {
    const hasVectorChild = (node.children || []).some(child =>
      ['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'LINE', 'ELLIPSE', 'RECTANGLE'].includes(child.type)
    );
    const looksLikeIcon = /icon|图标|导航|nav/i.test(node.name) || hasVectorChild;
    if (looksLikeIcon) result.push({ id: node.id, name: node.name, type: node.type });
  }
  (node.children || []).forEach(child => collectExportableNodes(child, result));
  return result;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const encodedNodeId = encodeURIComponent(NODE_ID);
  const nodesUrl = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodedNodeId}`;
  const nodeRes = await requestJson(nodesUrl);
  const root = nodeRes.nodes?.[NODE_ID]?.document;
  if (!root) {
    console.error('[figma-export-nav-icons] 未找到节点，请确认 fileKey/nodeId 是否正确');
    process.exit(1);
  }

  const candidates = collectExportableNodes(root);
  if (!candidates.length) {
    console.warn('[figma-export-nav-icons] 未发现可导出的图标节点');
    return;
  }

  const ids = candidates.map(item => item.id).join(',');
  const imageUrl = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&format=svg`;
  const imageRes = await requestJson(imageUrl);
  const images = imageRes.images || {};
  const exported = [];
  const usedNames = new Map();

  for (const item of candidates) {
    const url = images[item.id];
    if (!url) continue;
    let baseName = sanitizeName(item.name);
    const count = usedNames.get(baseName) || 0;
    usedNames.set(baseName, count + 1);
    if (count > 0) baseName = `${baseName}-${count + 1}`;
    const fileName = `${baseName}.svg`;
    const svg = await download(url);
    fs.writeFileSync(path.join(OUT_DIR, fileName), svg, 'utf8');
    exported.push({ id: item.id, name: item.name, type: item.type, file: `svg/${fileName}` });
  }

  fs.writeFileSync(OUT_MANIFEST, JSON.stringify({
    source: { fileKey: FILE_KEY, nodeId: NODE_ID },
    exportedAt: new Date().toISOString(),
    icons: exported
  }, null, 2), 'utf8');

  console.log(`[figma-export-nav-icons] exported ${exported.length} icons to ${OUT_DIR}`);
}

main().catch(err => {
  console.error('[figma-export-nav-icons] failed:', err.message);
  process.exit(1);
});
