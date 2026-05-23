const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const errors = [];

function fail(message) {
  errors.push(message);
}

function read(relativePath) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    fail(`Missing file: ${relativePath}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

function existsAsset(relativePath) {
  const cleanPath = relativePath.split('?')[0].split('#')[0];
  return fs.existsSync(path.join(root, 'assets', cleanPath));
}

function checkScripts(relativePath, html) {
  const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
  scripts.forEach((match, index) => {
    try {
      new Function(match[1]);
    } catch (error) {
      fail(`${relativePath} script #${index + 1} syntax error: ${error.message}`);
    }
  });
}

const requiredFiles = [
  'index.html',
  'assets/site-pages.html',
  'DESIGN.md',
  'PROJECT.md',
  'README.md'
];

requiredFiles.forEach(relativePath => {
  if (!fs.existsSync(path.join(root, relativePath))) {
    fail(`Missing required project file: ${relativePath}`);
  }
});

const indexHtml = read('index.html');
const sitePagesHtml = read('assets/site-pages.html');

checkScripts('index.html', indexHtml);
checkScripts('assets/site-pages.html', sitePagesHtml);

if (!indexHtml.includes('AI产品设计系统')) {
  fail('index.html should keep the site name: AI产品设计系统');
}

if (!sitePagesHtml.includes('body.case-preview .topbar')) {
  fail('assets/site-pages.html should keep the case-preview topbar rule.');
}

if (!sitePagesHtml.includes("toggleGroup('g-case')") || !sitePagesHtml.includes('id="g-case"')) {
  fail('Scene cases should stay inside a collapsible navigation group: g-case.');
}

if (!sitePagesHtml.includes("topbarTitle.textContent = page.querySelector('.page-title')?.textContent.trim()")) {
  fail('Case preview topbar should use the current page title only.');
}

if (!sitePagesHtml.includes('body.case-preview .topbar-chip') || !sitePagesHtml.includes('display: none')) {
  fail('Case preview should hide extra topbar chip/description content.');
}

if (/打开完整\s*demo|打开原图/.test(sitePagesHtml)) {
  fail('Scene cases should stay embedded in the current page; remove full-demo/open-original buttons.');
}

const cases = [
  ['查询', 'p-case-query', 'asset-query-demo/index.html'],
  ['录入', 'p-case-entry', 'cost-contract-native-demo/index.html'],
  ['审核', 'p-case-audit', 'contract-audit-demo/index.html'],
  ['分析', 'p-case-analysis', 'cost-analysis-demo/index.html'],
  ['报告', 'p-case-report', 'sales-daily-demo/index.html'],
  ['组合场景', 'p-case-combo', 'cost-advisor-control-price-demo/index.html?phase=auditing']
];

cases.forEach(([label, pageId, source]) => {
  if (!sitePagesHtml.includes(`id="${pageId}"`)) {
    fail(`Missing scene case page: ${label} (${pageId})`);
  }
  if (!sitePagesHtml.includes(`showCase('${label}', '${pageId}'`)) {
    fail(`Missing scene case navigation action: ${label} -> ${pageId}`);
  }
  if (!sitePagesHtml.includes(`data-case-src="${source}"`)) {
    fail(`Missing scene case source reference: ${label} -> ${source}`);
  }
  if (!existsAsset(source)) {
    fail(`Scene case asset does not exist: assets/${source}`);
  }
});

const auditTabSources = [
  ['合同审核', 'contract-audit-demo/index.html'],
  ['合规审查', 'tender-review-demo/ai-audit/task-P-2025-DEMO/index.html']
];

auditTabSources.forEach(([label, source]) => {
  if (!sitePagesHtml.includes(label)) {
    fail(`Missing audit tab label: ${label}`);
  }
  if (!sitePagesHtml.includes(`data-case-src="${source}"`)) {
    fail(`Missing audit tab source reference: ${label} -> ${source}`);
  }
  if (!existsAsset(source)) {
    fail(`Audit tab asset does not exist: assets/${source}`);
  }
});

const frameDemoSources = [
  ['全屏 Agent 工作台 / AI 原生模式', 'ai-native-mode-demo/index.html']
];

frameDemoSources.forEach(([label, source]) => {
  if (!sitePagesHtml.includes('AI 原生模式')) {
    fail('Missing frame tab label: AI 原生模式');
  }
  if (!sitePagesHtml.includes(`data-case-src="${source}"`)) {
    fail(`Missing frame demo source reference: ${label} -> ${source}`);
  }
  if (!existsAsset(source)) {
    fail(`Frame demo asset does not exist: assets/${source}`);
  }
});

const navIconMatches = [...sitePagesHtml.matchAll(/src="(icons\/navigation\/svg\/[^"]+)"/g)];
navIconMatches.forEach(match => {
  if (!fs.existsSync(path.join(root, 'assets', match[1]))) {
    fail(`Navigation icon does not exist: assets/${match[1]}`);
  }
});

if (errors.length) {
  console.error('Project validation failed:\n');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Project validation passed.');
