var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CanvasExportPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/converters.ts
var PAD = 80;
function prepare(raw) {
  const canvas = JSON.parse(JSON.stringify(raw));
  canvas.nodes.forEach((n) => {
    if (n.type === "text" && n.text) {
      n.text = n.text.replace(/^---\n[\s\S]*?\n---\n*/m, "").trim();
    }
  });
  const nodeMap = {};
  canvas.nodes.forEach((n) => {
    nodeMap[n.id] = n;
  });
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  canvas.nodes.forEach((n) => {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + n.width);
    maxY = Math.max(maxY, n.y + n.height);
  });
  const OX = -minX + PAD;
  const OY = -minY + PAD;
  const W = maxX - minX + PAD * 2;
  const H = maxY - minY + PAD * 2;
  return { canvas, nodeMap, bounds: { minX, minY, maxX, maxY, OX, OY, W, H } };
}
function stripMd(text) {
  return text.replace(/^#{1,3}\s+/gm, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*([^*\n]+)\*/g, "$1").replace(/_([^_\n]+)_/g, "$1").replace(/\t> /g, "  ").trim();
}
function stripMdKeepUrls(text) {
  return text.replace(/^#{1,3}\s+/gm, "").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*([^*\n]+)\*/g, "$1").replace(/_([^_\n]+)_/g, "$1").replace(/\t> /g, "  ").trim();
}
function extractAllLinks(text) {
  const links = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    links.push({ label: m[1], url: m[2] });
  }
  const bareRe = /(?<!\()(?<!")(https?:\/\/[^\s)]+)/g;
  const linkedUrls = new Set(links.map((l) => l.url));
  while ((m = bareRe.exec(text)) !== null) {
    if (!linkedUrls.has(m[1])) {
      const url = m[1];
      const parts = url.replace(/\/+$/, "").split("/");
      const label = decodeURIComponent(parts[parts.length - 1] || url).substring(0, 40);
      links.push({ label, url });
    }
  }
  return links;
}
var darkColorMap = {
  "1": { bg: "#4a2020", border: "#c44" },
  "2": { bg: "#4a3520", border: "#c84" },
  "3": { bg: "#2d2040", border: "#9775d4" },
  "4": { bg: "#1a3a2a", border: "#4a8" },
  "5": { bg: "#1a2a3a", border: "#48a" },
  "6": { bg: "#3a1a3a", border: "#a48" }
};
var lightColorMap = {
  "1": { bg: "#ffc9c9", border: "#e03131" },
  "2": { bg: "#ffe8cc", border: "#e8590c" },
  "3": { bg: "#e5dbff", border: "#7950f2" },
  "4": { bg: "#b2f2bb", border: "#2f9e44" },
  "5": { bg: "#d0ebff", border: "#1c7ed6" },
  "6": { bg: "#fcc2d7", border: "#c2255c" }
};
function buildHTML(raw, theme, opts) {
  const { canvas, bounds } = prepare(raw);
  const { OX, OY, W, H } = bounds;
  const { baseName, groupTitleSize } = opts;
  const isDark = theme === "dark";
  const cmap = isDark ? darkColorMap : lightColorMap;
  const bodyBg = isDark ? "#1e1e1e" : "#ffffff";
  const textColor = isDark ? "#dcdcdc" : "#1e1e1e";
  const linkColor = isDark ? "#7eb8da" : "#1971c2";
  const linkHover = isDark ? "#a0d4f0" : "#1864ab";
  const nodeBg = isDark ? "#2a2a2a" : "#e7f5ff";
  const nodeBorder = isDark ? "#444" : "#1971c2";
  const groupBorder = isDark ? "#667" : "#868e96";
  const groupLabelColor = isDark ? "#aab" : "#868e96";
  const edgeColor = isDark ? "#667" : "#868e96";
  const headerColor = isDark ? "#f0c060" : "#e67700";
  const emColor = isDark ? "#aaa" : "#666";
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${baseName}</title>
<style>
  @page { size: landscape; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: ${bodyBg}; color: ${textColor}; }
  .canvas { position: relative; width: ${W}px; height: ${H}px; }
  .node { position: absolute; padding: 8px 10px; border-radius: 6px; font-size: 12px; line-height: 1.4; }
  .node-text { overflow: hidden; background: ${nodeBg}; border: 1px solid ${nodeBorder}; }
  .node a { color: ${linkColor}; text-decoration: none; }
  .node a:hover { text-decoration: underline; color: ${linkHover}; }
  ${Object.entries(cmap).map(([k, v]) => `.node-text.color-${k} { background: ${v.bg}; border-color: ${v.border}; }`).join("\n  ")}
  .node-group { background: ${isDark ? "rgba(80,80,120,0.12)" : "rgba(134,142,150,0.06)"}; border: 1.5px dashed ${groupBorder}; border-radius: 10px; padding: 0; overflow: visible; }
  .group-label { position: absolute; top: -${Math.round(12 * groupTitleSize / 100) + 6}px; left: 12px; font-size: ${Math.round(12 * groupTitleSize / 100)}px; font-weight: 600; color: ${groupLabelColor}; background: ${bodyBg}; padding: 0 6px; white-space: nowrap; }
  .node h1, .node h2 { font-size: 13px; margin-bottom: 4px; color: ${headerColor}; }
  .node em { color: ${emColor}; font-style: italic; }
  .node strong { color: ${isDark ? "#eee" : "#333"}; }
  .node ul { margin-left: 14px; font-size: 11px; }
  .node ul li { margin-bottom: 2px; }
  svg.edges { position: absolute; top: 0; left: 0; width: ${W}px; height: ${H}px; pointer-events: none; }
</style>
</head>
<body>
<div class="canvas" id="canvas">
<svg class="edges" id="edges"></svg>
</div>
<script>
const OX = ${OX};
const OY = ${OY};
const canvasData = ${JSON.stringify(canvas)};
const nodeMap = {};
canvasData.nodes.forEach(n => { nodeMap[n.id] = n; });

function md(text) {
  return text
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/\\*([^*\\n]+)\\*/g, '<em>$1</em>')
    .replace(/_([^_\\n]+)_/g, '<em>$1</em>')
    .replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/(?<!href=")(https?:\\/\\/[^\\s<]+)/g, '<a href="$1" target="_blank">$1</a>')
    .replace(/^\\* (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\\/li>)/gs, '<ul>$1</ul>')
    .replace(/<\\/ul>\\s*<ul>/g, '')
    .replace(/\\n/g, '<br>')
    .replace(/<br>\\s*(<\\/?[uo]l>|<li>)/g, '$1')
    .replace(/(<\\/?[uo]l>|<\\/li>)\\s*<br>/g, '$1');
}

const canvas = document.getElementById('canvas');

canvasData.nodes.filter(n => n.type === 'group').forEach(n => {
  const div = document.createElement('div');
  div.className = 'node node-group';
  if (n.color && n.color.startsWith('#')) { div.style.borderColor = n.color; }
  div.style.left = (n.x + OX) + 'px';
  div.style.top = (n.y + OY) + 'px';
  div.style.width = n.width + 'px';
  div.style.height = n.height + 'px';
  if (n.label) { const lbl = document.createElement('span'); lbl.className = 'group-label'; lbl.textContent = n.label; div.appendChild(lbl); }
  canvas.appendChild(div);
});

canvasData.nodes.filter(n => n.type !== 'group').forEach(n => {
  const div = document.createElement('div');
  const isHex = n.color && n.color.startsWith('#');
  div.className = 'node node-text' + (n.color && !isHex ? ' color-' + n.color : '');
  if (isHex) { div.style.borderColor = n.color; }
  div.style.left = (n.x + OX) + 'px';
  div.style.top = (n.y + OY) + 'px';
  div.style.width = n.width + 'px';
  div.style.height = n.height + 'px';
  if (n.type === 'text') {
    div.innerHTML = md(n.text);
  } else if (n.type === 'file') {
    const fname = n.file.split('/').pop();
    div.innerHTML = '\\ud83d\\udcc4 ' + fname + (n.subpath ? ' ' + n.subpath : '');
  } else if (n.type === 'link') {
    div.innerHTML = '<div style="font-size:10px;opacity:0.5;margin-bottom:2px">[embedded URL]</div>' +
      '<a href="' + n.url + '" target="_blank">' + n.url + '</a>';
  }
  canvas.appendChild(div);
});

const svg = document.getElementById('edges');
canvasData.edges.forEach(e => {
  const from = nodeMap[e.fromNode];
  const to = nodeMap[e.toNode];
  if (!from || !to) return;
  function anchor(node, side) {
    const x = node.x + OX, y = node.y + OY;
    switch(side) {
      case 'top': return {x: x+node.width/2, y};
      case 'bottom': return {x: x+node.width/2, y: y+node.height};
      case 'left': return {x, y: y+node.height/2};
      case 'right': return {x: x+node.width, y: y+node.height/2};
      default: return {x: x+node.width/2, y: y+node.height/2};
    }
  }
  const p1 = anchor(from, e.fromSide);
  const p2 = anchor(to, e.toSide);
  let cp1, cp2;
  if (e.fromSide === 'bottom' && e.toSide === 'top') {
    const off = Math.min(Math.abs(p2.y-p1.y)*0.5, 60);
    cp1 = {x:p1.x, y:p1.y+off}; cp2 = {x:p2.x, y:p2.y-off};
  } else if (e.fromSide === 'right' && e.toSide === 'left') {
    const off = Math.min(Math.abs(p2.x-p1.x)*0.4, 80);
    cp1 = {x:p1.x+off, y:p1.y}; cp2 = {x:p2.x-off, y:p2.y};
  } else {
    const dx=p2.x-p1.x, dy=p2.y-p1.y;
    cp1 = {x:p1.x+dx*0.3, y:p1.y+dy*0.3}; cp2 = {x:p1.x+dx*0.7, y:p1.y+dy*0.7};
  }
  const path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d','M '+p1.x+' '+p1.y+' C '+cp1.x+' '+cp1.y+', '+cp2.x+' '+cp2.y+', '+p2.x+' '+p2.y);
  path.setAttribute('stroke','${edgeColor}');
  path.setAttribute('stroke-width','1.5');
  path.setAttribute('fill','none');
  path.setAttribute('opacity','0.6');
  const angle = Math.atan2(p2.y-cp2.y, p2.x-cp2.x);
  const al=8;
  const arrow = document.createElementNS('http://www.w3.org/2000/svg','polygon');
  arrow.setAttribute('points', p2.x+','+p2.y+' '+(p2.x-al*Math.cos(angle-0.4))+','+(p2.y-al*Math.sin(angle-0.4))+' '+(p2.x-al*Math.cos(angle+0.4))+','+(p2.y-al*Math.sin(angle+0.4)));
  arrow.setAttribute('fill','${edgeColor}');
  arrow.setAttribute('opacity','0.6');
  svg.appendChild(path);
  svg.appendChild(arrow);
});
<\/script>
</body>
</html>`;
}
var excalColorMap = {
  "1": { bg: "#ffc9c9", stroke: "#e03131", text: "#c92a2a" },
  "2": { bg: "#ffe8cc", stroke: "#e8590c", text: "#d9480f" },
  "3": { bg: "#e5dbff", stroke: "#7950f2", text: "#6741d9" },
  "4": { bg: "#b2f2bb", stroke: "#2f9e44", text: "#2b8a3e" },
  "5": { bg: "#d0ebff", stroke: "#1c7ed6", text: "#1864ab" },
  "6": { bg: "#fcc2d7", stroke: "#c2255c", text: "#a61e4d" }
};
var excalDefault = { bg: "#e7f5ff", stroke: "#1971c2", text: "#1e1e1e" };
function seed() {
  return Math.floor(Math.random() * 2e9);
}
var idCounter = 1;
function genId() {
  return "elem_" + idCounter++;
}
function makeRect(id, x, y, w, h, colors, link, boundElements) {
  return {
    id,
    type: "rectangle",
    x,
    y,
    width: w,
    height: h,
    angle: 0,
    strokeColor: colors.stroke,
    backgroundColor: colors.bg,
    fillStyle: "solid",
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: { type: 3 },
    seed: seed(),
    version: 1,
    versionNonce: seed(),
    isDeleted: false,
    boundElements: boundElements || null,
    updated: Date.now(),
    link,
    locked: false
  };
}
function makeText(id, x, y, w, h, text, colors, containerId) {
  return {
    id,
    type: "text",
    x,
    y,
    width: w,
    height: h,
    angle: 0,
    strokeColor: colors.text,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    seed: seed(),
    version: 1,
    versionNonce: seed(),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    text,
    fontSize: 12,
    fontFamily: 1,
    textAlign: "center",
    verticalAlign: "middle",
    containerId,
    originalText: text,
    autoResize: true,
    lineHeight: 1.25
  };
}
function buildExcalidraw(raw, opts) {
  const { canvas, nodeMap } = prepare(raw);
  const { groupTitleSize } = opts;
  idCounter = 1;
  const elements = [];
  canvas.nodes.filter((n) => n.type === "group").forEach((n) => {
    const rectId = genId();
    elements.push({
      id: rectId,
      type: "rectangle",
      x: n.x,
      y: n.y,
      width: n.width,
      height: n.height,
      angle: 0,
      strokeColor: "#868e96",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 1,
      strokeStyle: "dashed",
      roughness: 0,
      opacity: 30,
      groupIds: [],
      frameId: null,
      roundness: { type: 3 },
      seed: seed(),
      version: 1,
      versionNonce: seed(),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false
    });
    if (n.label) {
      const fontSize = Math.round(12 * groupTitleSize / 100);
      elements.push({
        id: genId(),
        type: "text",
        x: n.x + 12,
        y: n.y - fontSize - 6,
        width: n.label.length * Math.round(fontSize * 0.6),
        height: fontSize + 4,
        angle: 0,
        strokeColor: "#868e96",
        backgroundColor: "transparent",
        fillStyle: "solid",
        strokeWidth: 1,
        strokeStyle: "solid",
        roughness: 0,
        opacity: 100,
        groupIds: [],
        frameId: null,
        roundness: null,
        seed: seed(),
        version: 1,
        versionNonce: seed(),
        isDeleted: false,
        boundElements: null,
        updated: Date.now(),
        link: null,
        locked: false,
        text: n.label,
        fontSize,
        fontFamily: 1,
        textAlign: "left",
        verticalAlign: "top",
        containerId: null,
        originalText: n.label,
        autoResize: true,
        lineHeight: 1.25
      });
    }
    n._excalId = rectId;
  });
  canvas.nodes.filter((n) => n.type !== "group").forEach((n) => {
    let colors;
    if (n.color && n.color.startsWith("#")) {
      colors = { bg: n.color + "33", stroke: n.color, text: "#1e1e1e" };
    } else {
      colors = n.color && excalColorMap[n.color] ? excalColorMap[n.color] : excalDefault;
    }
    const rectId = genId();
    const textId = genId();
    let plainText, allLinks, primaryLink;
    if (n.type === "text" && n.text) {
      allLinks = extractAllLinks(n.text);
      plainText = allLinks.length > 1 ? stripMdKeepUrls(n.text) : stripMd(n.text);
      primaryLink = allLinks.length >= 1 ? allLinks[0].url : null;
    } else if (n.type === "file") {
      const fname = (n.file || "").split("/").pop() || "";
      plainText = "\u{1F4C4} " + fname + (n.subpath ? " " + n.subpath : "");
      allLinks = [];
      primaryLink = null;
    } else if (n.type === "link") {
      plainText = "[embedded URL]\n" + (n.url || "");
      allLinks = [];
      primaryLink = n.url || null;
    } else {
      plainText = n.type;
      allLinks = [];
      primaryLink = null;
    }
    elements.push(makeRect(rectId, n.x, n.y, n.width, n.height, colors, primaryLink, [{ id: textId, type: "text" }]));
    elements.push(makeText(textId, n.x + 8, n.y + 4, n.width - 16, n.height - 8, plainText, colors, rectId));
    n._excalId = rectId;
  });
  canvas.edges.forEach((e) => {
    const from = nodeMap[e.fromNode];
    const to = nodeMap[e.toNode];
    if (!from || !to)
      return;
    function anchor(node, side) {
      switch (side) {
        case "top":
          return { x: node.x + node.width / 2, y: node.y };
        case "bottom":
          return { x: node.x + node.width / 2, y: node.y + node.height };
        case "left":
          return { x: node.x, y: node.y + node.height / 2 };
        case "right":
          return { x: node.x + node.width, y: node.y + node.height / 2 };
        default:
          return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
      }
    }
    const p1 = anchor(from, e.fromSide);
    const p2 = anchor(to, e.toSide);
    const arrowId = genId();
    if (from._excalId) {
      const rect = elements.find((el) => el.id === from._excalId);
      if (rect) {
        if (!rect.boundElements)
          rect.boundElements = [];
        rect.boundElements.push({ id: arrowId, type: "arrow" });
      }
    }
    if (to._excalId) {
      const rect = elements.find((el) => el.id === to._excalId);
      if (rect) {
        if (!rect.boundElements)
          rect.boundElements = [];
        rect.boundElements.push({ id: arrowId, type: "arrow" });
      }
    }
    elements.push({
      id: arrowId,
      type: "arrow",
      x: p1.x,
      y: p1.y,
      width: p2.x - p1.x,
      height: p2.y - p1.y,
      angle: 0,
      strokeColor: "#868e96",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 0,
      opacity: 60,
      groupIds: [],
      frameId: null,
      roundness: { type: 2 },
      seed: seed(),
      version: 1,
      versionNonce: seed(),
      isDeleted: false,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
      points: [[0, 0], [p2.x - p1.x, p2.y - p1.y]],
      lastCommittedPoint: null,
      startBinding: from._excalId ? { elementId: from._excalId, focus: 0, gap: 4, fixedPoint: null } : null,
      endBinding: to._excalId ? { elementId: to._excalId, focus: 0, gap: 4, fixedPoint: null } : null,
      startArrowhead: null,
      endArrowhead: "arrow"
    });
  });
  return {
    type: "excalidraw",
    version: 2,
    source: "canvas-export",
    elements,
    appState: { gridSize: null, viewBackgroundColor: "#ffffff" },
    files: {}
  };
}
var mermaidColorMap = {
  "1": { fill: "#ffc9c9", stroke: "#e03131" },
  "2": { fill: "#ffe8cc", stroke: "#e8590c" },
  "3": { fill: "#e5dbff", stroke: "#7950f2" },
  "4": { fill: "#b2f2bb", stroke: "#2f9e44" },
  "5": { fill: "#d0ebff", stroke: "#1c7ed6" },
  "6": { fill: "#fcc2d7", stroke: "#c2255c" }
};
function mermaidEscape(text) {
  return text.replace(/"/g, "#quot;").replace(/\n/g, "<br>");
}
function mermaidId(id) {
  return id.replace(/[^a-zA-Z0-9_]/g, "_");
}
function mermaidNodeLabel(n) {
  if (n.type === "text" && n.text)
    return mermaidEscape(stripMdKeepUrls(n.text));
  if (n.type === "file")
    return mermaidEscape((n.file || "").split("/").pop() + (n.subpath || ""));
  if (n.type === "link")
    return mermaidEscape("[embedded URL] " + (n.url || ""));
  return n.type;
}
function getNodeColor(n) {
  if (!n.color)
    return null;
  if (n.color.startsWith("#"))
    return { fill: n.color + "33", stroke: n.color };
  return mermaidColorMap[n.color] || null;
}
function getGroupColor(g) {
  if (!g.color)
    return null;
  if (g.color.startsWith("#"))
    return { fill: g.color + "22", stroke: g.color };
  return mermaidColorMap[g.color] ? { fill: mermaidColorMap[g.color].fill + "44", stroke: mermaidColorMap[g.color].stroke } : null;
}
function isInside(node, group) {
  return node.x >= group.x && node.y >= group.y && node.x + node.width <= group.x + group.width && node.y + node.height <= group.y + group.height;
}
function buildMermaid(raw, _opts) {
  const { canvas } = prepare(raw);
  const lines = ["flowchart TD"];
  const styles = [];
  const groups = canvas.nodes.filter((n) => n.type === "group");
  const nonGroups = canvas.nodes.filter((n) => n.type !== "group");
  const grouped = /* @__PURE__ */ new Set();
  groups.forEach((g) => {
    const mid = mermaidId(g.id);
    const children = nonGroups.filter((n) => isInside(n, g));
    if (!g.label || children.length === 0)
      return;
    lines.push(`  subgraph ${mid}["${mermaidEscape(g.label)}"]`);
    children.forEach((n) => {
      const nid = mermaidId(n.id);
      lines.push(`    ${nid}["${mermaidNodeLabel(n)}"]`);
      grouped.add(n.id);
      const color = getNodeColor(n);
      if (color)
        styles.push(`  style ${nid} fill:${color.fill},stroke:${color.stroke},color:#000`);
    });
    lines.push("  end");
    const gColor = getGroupColor(g);
    if (gColor)
      styles.push(`  style ${mid} fill:${gColor.fill},stroke:${gColor.stroke}`);
  });
  nonGroups.filter((n) => !grouped.has(n.id)).forEach((n) => {
    const nid = mermaidId(n.id);
    lines.push(`  ${nid}["${mermaidNodeLabel(n)}"]`);
    const color = getNodeColor(n);
    if (color)
      styles.push(`  style ${nid} fill:${color.fill},stroke:${color.stroke},color:#000`);
  });
  canvas.edges.forEach((e) => {
    const from = mermaidId(e.fromNode);
    const to = mermaidId(e.toNode);
    if (e.label) {
      lines.push(`  ${from} -->|"${mermaidEscape(e.label)}"| ${to}`);
    } else {
      lines.push(`  ${from} --> ${to}`);
    }
  });
  lines.push(...styles);
  return lines.join("\n") + "\n";
}
var d2ColorMap = {
  "1": { fill: '"#ffc9c9"', stroke: '"#e03131"' },
  "2": { fill: '"#ffe8cc"', stroke: '"#e8590c"' },
  "3": { fill: '"#e5dbff"', stroke: '"#7950f2"' },
  "4": { fill: '"#b2f2bb"', stroke: '"#2f9e44"' },
  "5": { fill: '"#d0ebff"', stroke: '"#1c7ed6"' },
  "6": { fill: '"#fcc2d7"', stroke: '"#c2255c"' }
};
function d2Escape(text) {
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}
function d2Id(id) {
  return id.replace(/[^a-zA-Z0-9_]/g, "_");
}
function d2Label(n) {
  if (n.type === "text" && n.text)
    return d2Escape(stripMdKeepUrls(n.text));
  if (n.type === "file")
    return d2Escape((n.file || "").split("/").pop() + (n.subpath || ""));
  if (n.type === "link")
    return d2Escape("[embedded URL] " + (n.url || ""));
  return n.type;
}
function getD2NodeColor(n) {
  if (!n.color)
    return null;
  if (n.color.startsWith("#"))
    return { fill: `"${n.color}"`, stroke: `"${n.color}"` };
  return d2ColorMap[n.color] || null;
}
function d2QualifyId(nid, groups, nonGroups) {
  const node = nonGroups.find((n) => d2Id(n.id) === nid);
  if (!node)
    return nid;
  for (const g of groups) {
    if (isInside(node, g)) {
      return d2Id(g.id) + "." + nid;
    }
  }
  return nid;
}
function buildD2(raw, _opts) {
  const { canvas } = prepare(raw);
  const lines = ["direction: down", ""];
  const groups = canvas.nodes.filter((n) => n.type === "group");
  const nonGroups = canvas.nodes.filter((n) => n.type !== "group");
  const grouped = /* @__PURE__ */ new Set();
  groups.forEach((g) => {
    const children = nonGroups.filter((n) => isInside(n, g));
    if (!g.label || children.length === 0)
      return;
    const gid = d2Id(g.id);
    lines.push(`${gid}: "${d2Escape(g.label)}" {`);
    const gColor = g.color && g.color.startsWith("#") ? { fill: `"${g.color}"`, stroke: `"${g.color}"` } : g.color && d2ColorMap[g.color] ? d2ColorMap[g.color] : null;
    if (gColor) {
      lines.push(`  style: {`);
      lines.push(`    fill: ${gColor.fill}`);
      lines.push(`    stroke: ${gColor.stroke}`);
      lines.push(`    stroke-dash: 5`);
      lines.push(`  }`);
    }
    children.forEach((n) => {
      const nid = d2Id(n.id);
      lines.push(`  ${nid}: "${d2Label(n)}"`);
      const nColor = getD2NodeColor(n);
      if (nColor) {
        lines.push(`  ${nid}.style: {`);
        lines.push(`    fill: ${nColor.fill}`);
        lines.push(`    stroke: ${nColor.stroke}`);
        lines.push(`  }`);
      }
      if (n.type === "link") {
        lines.push(`  ${nid}.link: ${n.url}`);
      }
      grouped.add(n.id);
    });
    lines.push("}");
    lines.push("");
  });
  nonGroups.filter((n) => !grouped.has(n.id)).forEach((n) => {
    const nid = d2Id(n.id);
    lines.push(`${nid}: "${d2Label(n)}"`);
    const nColor = getD2NodeColor(n);
    if (nColor) {
      lines.push(`${nid}.style: {`);
      lines.push(`  fill: ${nColor.fill}`);
      lines.push(`  stroke: ${nColor.stroke}`);
      lines.push(`}`);
    }
    if (n.type === "link") {
      lines.push(`${nid}.link: ${n.url}`);
    }
  });
  lines.push("");
  canvas.edges.forEach((e) => {
    const from = d2Id(e.fromNode);
    const to = d2Id(e.toNode);
    const fromQual = d2QualifyId(from, groups, nonGroups);
    const toQual = d2QualifyId(to, groups, nonGroups);
    if (e.label) {
      lines.push(`${fromQual} -> ${toQual}: "${d2Escape(e.label)}"`);
    } else {
      lines.push(`${fromQual} -> ${toQual}`);
    }
  });
  return lines.join("\n") + "\n";
}
function getCanvasDimensions(raw) {
  const { bounds } = prepare(raw);
  return { W: bounds.W, H: bounds.H };
}

// src/pdf.ts
async function generatePDF(html, width, height) {
  var _a, _b;
  let BrowserWindow;
  try {
    const electron = require("electron");
    BrowserWindow = (_b = (_a = electron.remote) == null ? void 0 : _a.BrowserWindow) != null ? _b : electron.BrowserWindow;
  } catch (e) {
  }
  if (!BrowserWindow) {
    try {
      const remote = require("@electron/remote");
      BrowserWindow = remote.BrowserWindow;
    } catch (e) {
    }
  }
  if (!BrowserWindow) {
    throw new Error("PDF export requires Electron BrowserWindow which is not available in this environment.");
  }
  const win = new BrowserWindow({
    show: false,
    width: Math.min(width, 16384),
    height: Math.min(height, 16384),
    webPreferences: { offscreen: true }
  });
  try {
    const dataUrl = "data:text/html;charset=utf-8," + encodeURIComponent(html);
    await win.loadURL(dataUrl);
    await new Promise((resolve) => window.setTimeout(() => resolve(), 500));
    const pdf = await win.webContents.printToPDF({
      printBackground: true,
      landscape: width > height,
      pageSize: { width: width / 96, height: height / 96 },
      // inches
      margins: { top: 0, bottom: 0, left: 0, right: 0 }
    });
    return pdf.buffer;
  } finally {
    win.close();
  }
}

// src/export-modal.ts
var import_obsidian2 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var VALID_FORMATS = ["html-light", "html-dark", "excalidraw", "pdf", "mermaid", "d2"];
var FORMAT_LABELS = {
  "html-light": "HTML (light)",
  "html-dark": "HTML (dark)",
  "excalidraw": "Excalidraw",
  "pdf": "PDF",
  "mermaid": "Mermaid (.mmd)",
  "d2": "D2 (.d2)"
};
var DEFAULT_SETTINGS = {
  defaultFormats: ["html-light"],
  groupTitleSize: 150,
  outputSubfolder: "",
  lastFormats: []
};
var CanvasExportSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new import_obsidian.Setting(containerEl).setName("Group title size (%)").setDesc("Font size of group labels as a percentage of body text (default: 150)").addText((text) => text.setPlaceholder("150").setValue(String(this.plugin.settings.groupTitleSize)).onChange(async (value) => {
      const num = parseInt(value);
      if (!isNaN(num) && num > 0) {
        this.plugin.settings.groupTitleSize = num;
        await this.plugin.saveSettings();
      }
    }));
    new import_obsidian.Setting(containerEl).setName("Output subfolder").setDesc("Leave empty to export alongside the canvas file, or enter a subfolder name.").addText((text) => text.setPlaceholder("Exports").setValue(this.plugin.settings.outputSubfolder).onChange(async (value) => {
      this.plugin.settings.outputSubfolder = value.trim();
      await this.plugin.saveSettings();
    }));
  }
};

// src/export-modal.ts
var ExportModal = class extends import_obsidian2.Modal {
  constructor(plugin, onExport) {
    super(plugin.app);
    this.plugin = plugin;
    this.onExport = onExport;
    const initial = this.plugin.settings.lastFormats.length > 0 ? this.plugin.settings.lastFormats : this.plugin.settings.defaultFormats;
    this.selectedFormats = new Set(initial);
    this.groupTitleSize = this.plugin.settings.groupTitleSize;
    this.outputSubfolder = this.plugin.settings.outputSubfolder;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("canvas-export-modal");
    this.setTitle("Export canvas");
    new import_obsidian2.Setting(contentEl).setName("Formats").setHeading();
    const formatGrid = contentEl.createDiv({ cls: "format-grid" });
    for (const fmt of VALID_FORMATS) {
      const label = formatGrid.createEl("label");
      const checkbox = label.createEl("input", { type: "checkbox" });
      checkbox.checked = this.selectedFormats.has(fmt);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          this.selectedFormats.add(fmt);
        } else {
          this.selectedFormats.delete(fmt);
        }
      });
      label.appendText(FORMAT_LABELS[fmt]);
    }
    const sizeRow = contentEl.createDiv({ cls: "setting-row" });
    sizeRow.createEl("label", { text: "Group title size" });
    const sizeInput = sizeRow.createEl("input", { type: "number" });
    sizeInput.value = String(this.groupTitleSize);
    sizeInput.min = "50";
    sizeInput.max = "500";
    sizeRow.createSpan({ text: "%" });
    sizeInput.addEventListener("change", () => {
      const val = parseInt(sizeInput.value);
      if (!isNaN(val) && val > 0)
        this.groupTitleSize = val;
    });
    new import_obsidian2.Setting(contentEl).setName("Output folder").setHeading();
    const outputDiv = contentEl.createDiv({ cls: "output-options" });
    const sameLabel = outputDiv.createEl("label");
    const sameRadio = sameLabel.createEl("input", { type: "radio" });
    sameRadio.name = "output-location";
    sameRadio.checked = !this.outputSubfolder;
    sameLabel.appendText("Same as canvas file");
    const subLabel = outputDiv.createEl("label");
    const subRadio = subLabel.createEl("input", { type: "radio" });
    subRadio.name = "output-location";
    subRadio.checked = this.outputSubfolder.length > 0;
    subLabel.appendText("Subfolder:");
    const subInput = outputDiv.createEl("input", {
      cls: "subfolder-input",
      type: "text",
      placeholder: "exports"
    });
    subInput.value = this.outputSubfolder;
    sameRadio.addEventListener("change", () => {
      if (sameRadio.checked)
        this.outputSubfolder = "";
    });
    subRadio.addEventListener("change", () => {
      if (subRadio.checked)
        this.outputSubfolder = subInput.value || "exports";
    });
    subInput.addEventListener("input", () => {
      if (subRadio.checked)
        this.outputSubfolder = subInput.value;
    });
    subInput.addEventListener("focus", () => {
      subRadio.checked = true;
      this.outputSubfolder = subInput.value || "exports";
    });
    const btnContainer = contentEl.createDiv({ cls: "export-btn-container" });
    const exportBtn = new import_obsidian2.ButtonComponent(btnContainer);
    exportBtn.setButtonText("Export");
    exportBtn.setCta();
    exportBtn.onClick(() => {
      const formats = Array.from(this.selectedFormats);
      if (formats.length === 0) {
        return;
      }
      this.close();
      this.onExport(formats, this.groupTitleSize, this.outputSubfolder);
    });
  }
  onClose() {
    this.contentEl.empty();
  }
};

// src/overwrite-modal.ts
var import_obsidian3 = require("obsidian");
var OverwriteModal = class extends import_obsidian3.Modal {
  constructor(plugin, filePath, newPath, resolve) {
    super(plugin.app);
    this.filePath = filePath;
    this.newPath = newPath;
    this.resolve = resolve;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.setTitle("File already exists");
    contentEl.createEl("p", { text: this.filePath.split("/").pop() || this.filePath });
    const btnRow = contentEl.createDiv({ cls: "canvas-export-overwrite-buttons" });
    new import_obsidian3.ButtonComponent(btnRow).setButtonText("Overwrite").setCta().onClick(() => {
      this.close();
      this.resolve("overwrite");
    });
    new import_obsidian3.ButtonComponent(btnRow).setButtonText(`Save as ${this.newPath.split("/").pop()}`).onClick(() => {
      this.close();
      this.resolve("rename");
    });
    new import_obsidian3.ButtonComponent(btnRow).setButtonText("Skip").onClick(() => {
      this.close();
      this.resolve("skip");
    });
  }
  onClose() {
    this.contentEl.empty();
    this.resolve("skip");
  }
};

// main.ts
var CanvasExportPlugin = class extends import_obsidian4.Plugin {
  constructor() {
    super(...arguments);
    this.settings = DEFAULT_SETTINGS;
  }
  async onload() {
    await this.loadSettings();
    this.addSettingTab(new CanvasExportSettingTab(this.app, this));
    for (const fmt of VALID_FORMATS) {
      this.addCommand({
        id: `export-canvas-${fmt}`,
        name: `Export to ${FORMAT_LABELS[fmt]}`,
        checkCallback: (checking) => {
          const file = this.app.workspace.getActiveFile();
          if ((file == null ? void 0 : file.extension) === "canvas") {
            if (!checking) {
              void this.exportCanvas(
                file,
                [fmt],
                this.settings.groupTitleSize,
                this.settings.outputSubfolder
              );
            }
            return true;
          }
          return false;
        }
      });
    }
    this.addCommand({
      id: "export-canvas",
      name: "Export current canvas...",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if ((file == null ? void 0 : file.extension) === "canvas") {
          if (!checking) {
            this.openExportModal(file);
          }
          return true;
        }
        return false;
      }
    });
    this.addCommand({
      id: "re-export-canvas",
      name: "Re-export with last settings",
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if ((file == null ? void 0 : file.extension) === "canvas" && this.settings.lastFormats.length > 0) {
          if (!checking) {
            void this.exportCanvas(
              file,
              this.settings.lastFormats,
              this.settings.groupTitleSize,
              this.settings.outputSubfolder
            );
          }
          return true;
        }
        return false;
      }
    });
    this.registerEvent(
      this.app.workspace.on("file-menu", (menu, file) => {
        if (file instanceof import_obsidian4.TFile && file.extension === "canvas") {
          menu.addItem((item) => {
            item.setTitle("Export canvas...").setIcon("download").onClick(() => {
              this.openExportModal(file);
            });
          });
        }
      })
    );
  }
  async loadSettings() {
    const loaded = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded);
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  openExportModal(file) {
    new ExportModal(this, (formats, groupTitleSize, subfolder) => {
      void this.exportCanvas(file, formats, groupTitleSize, subfolder);
    }).open();
  }
  async exportCanvas(file, formats, groupTitleSize, subfolder) {
    var _a;
    try {
      const raw = await this.app.vault.read(file);
      const canvas = JSON.parse(raw);
      const baseName = file.basename;
      const opts = { baseName, groupTitleSize };
      const fileDir = ((_a = file.parent) == null ? void 0 : _a.path) || "";
      const outputDir = subfolder ? fileDir ? fileDir + "/" + subfolder : subfolder : fileDir;
      if (subfolder && !await this.app.vault.adapter.exists(outputDir)) {
        await this.app.vault.createFolder(outputDir);
      }
      const outputs = [];
      const errors = [];
      for (const fmt of formats) {
        try {
          let filePath = this.getOutputPath(outputDir, baseName, fmt, formats);
          if (await this.app.vault.adapter.exists(filePath)) {
            const numberedPath = await this.getNumberedPath(filePath);
            const choice = await this.promptOverwrite(filePath, numberedPath);
            if (choice === "skip")
              continue;
            if (choice === "rename")
              filePath = numberedPath;
          }
          switch (fmt) {
            case "html-light": {
              await this.writeFile(filePath, buildHTML(canvas, "light", opts));
              outputs.push(filePath.split("/").pop() || filePath);
              break;
            }
            case "html-dark": {
              await this.writeFile(filePath, buildHTML(canvas, "dark", opts));
              outputs.push(filePath.split("/").pop() || filePath);
              break;
            }
            case "excalidraw": {
              await this.writeFile(filePath, JSON.stringify(buildExcalidraw(canvas, opts), null, 2));
              outputs.push(filePath.split("/").pop() || filePath);
              break;
            }
            case "mermaid": {
              await this.writeFile(filePath, buildMermaid(canvas, opts));
              outputs.push(filePath.split("/").pop() || filePath);
              break;
            }
            case "d2": {
              await this.writeFile(filePath, buildD2(canvas, opts));
              outputs.push(filePath.split("/").pop() || filePath);
              break;
            }
            case "pdf": {
              try {
                const html = buildHTML(canvas, "light", opts);
                const dims = getCanvasDimensions(canvas);
                const pdfBuf = await generatePDF(html, dims.W, dims.H);
                await this.writeBinaryFile(filePath, pdfBuf);
                outputs.push(filePath.split("/").pop() || filePath);
              } catch (e) {
                const msg = e instanceof Error ? e.message : String(e);
                errors.push(`PDF: ${msg}`);
              }
              break;
            }
          }
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          errors.push(`${fmt}: ${msg}`);
        }
      }
      this.settings.lastFormats = [...formats];
      await this.saveSettings();
      if (outputs.length > 0) {
        new import_obsidian4.Notice(`Canvas exported: ${outputs.length} file${outputs.length > 1 ? "s" : ""} written
${outputs.join(", ")}`);
      }
      if (errors.length > 0) {
        new import_obsidian4.Notice(`Export warnings:
${errors.join("\n")}`, 8e3);
      }
      if (outputs.length === 0 && errors.length === 0) {
        new import_obsidian4.Notice("No formats selected.");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      new import_obsidian4.Notice(`Export failed: ${msg}`);
    }
  }
  async writeFile(filePath, content) {
    const existing = this.app.vault.getAbstractFileByPath(filePath);
    if (existing instanceof import_obsidian4.TFile) {
      await this.app.vault.modify(existing, content);
    } else if (await this.app.vault.adapter.exists(filePath)) {
      await this.app.vault.adapter.write(filePath, content);
    } else {
      await this.app.vault.create(filePath, content);
    }
  }
  async writeBinaryFile(filePath, content) {
    const existing = this.app.vault.getAbstractFileByPath(filePath);
    if (existing instanceof import_obsidian4.TFile) {
      await this.app.vault.modifyBinary(existing, content);
    } else if (await this.app.vault.adapter.exists(filePath)) {
      await this.app.vault.adapter.writeBinary(filePath, content);
    } else {
      await this.app.vault.createBinary(filePath, content);
    }
  }
  promptOverwrite(filePath, numberedPath) {
    return new Promise((resolve) => {
      let resolved = false;
      new OverwriteModal(this, filePath, numberedPath, (choice) => {
        if (!resolved) {
          resolved = true;
          resolve(choice);
        }
      }).open();
    });
  }
  async getNumberedPath(filePath) {
    const lastSlash = filePath.lastIndexOf("/");
    const dir = lastSlash >= 0 ? filePath.substring(0, lastSlash + 1) : "";
    const filename = lastSlash >= 0 ? filePath.substring(lastSlash + 1) : filePath;
    let name, ext;
    const excalMatch = filename.match(/^(.+)(\.excalidraw\.md)$/);
    if (excalMatch) {
      name = excalMatch[1];
      ext = excalMatch[2];
    } else {
      const dotIdx = filename.lastIndexOf(".");
      name = dotIdx >= 0 ? filename.substring(0, dotIdx) : filename;
      ext = dotIdx >= 0 ? filename.substring(dotIdx) : "";
    }
    let n = 1;
    let candidate = `${dir}${name} ${n}${ext}`;
    while (await this.app.vault.adapter.exists(candidate)) {
      n++;
      candidate = `${dir}${name} ${n}${ext}`;
    }
    return candidate;
  }
  getOutputPath(dir, baseName, fmt, allFormats) {
    const prefix = dir ? dir + "/" : "";
    switch (fmt) {
      case "html-light":
        return `${prefix}${baseName}.html`;
      case "html-dark":
        if (allFormats.includes("html-light")) {
          return `${prefix}${baseName} (dark).html`;
        }
        return `${prefix}${baseName}.html`;
      case "excalidraw":
        return `${prefix}${baseName}.excalidraw`;
      case "pdf":
        return `${prefix}${baseName}.pdf`;
      case "mermaid":
        return `${prefix}${baseName}.mmd`;
      case "d2":
        return `${prefix}${baseName}.d2`;
    }
  }
};

/* nosourcemap */