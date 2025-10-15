// 描画スクリプト（conne）

// フィルター設定
window.conneFilters = [
  {
    id: "filter-tag1",
    key: "タグ1",
    label: "分類",
    getter: d => d.タグ1 ? [d.タグ1] : [],
    options: ["ジェネラル", "ユニーク", "エフェクト", "Dロイス", "FH専用", "エンブレム", "トレイル"],
    match: "partial"
  },
  {
    id: "filter-type",
    key: "技能",
    label: "技能",
    getter: d => d.技能 ? [d.技能] : [],
    options: ["情報:UGN","情報:FH"],
    match: "partial"
  },
  {
    id: "filter-tag3",
    key: "タグ3",
    label: "制限",
    getter: d => d.タグ3 && d.タグ3.trim() ? d.タグ3.split(/\s*,\s*/) : ["なし"],
    options: ["なし", "レアアイテム"],
    match: "partial"
  }
];

// 検索窓は main.js で生成

window.renderConne = function(container, data) {
  container.innerHTML = "";

  data.forEach(d => {
    const div = document.createElement("div");
    div.className = "item itemz-card"; // ← ここ変更済み

// -----------------------------
// 1行目: name + コピーアイコン + タグ1~3
// -----------------------------
const header = document.createElement("div");
header.className = "item-header";

const nameSpan = document.createElement("span");
nameSpan.className = "name";
nameSpan.textContent = d.name;
header.appendChild(nameSpan);

// コピーアイコン
const copyIconWrapper = document.createElement("span");
copyIconWrapper.className = "copy-icon-wrapper";
copyIconWrapper.innerHTML = `<i class="fa-solid fa-copy"></i>`;
copyIconWrapper.title = "クリックでコピー";
copyIconWrapper.onclick = async () => {
  // コピー用テキスト生成
  const fields = [
    ["名称", d.name],
    ["常備化", d.常備化],
    ["購入", d.購入],
    ["経験点", d.経験点],
    ["種別", d.種別],
    ["技能", d.技能]
  ];

  const textParts = fields
    .filter(([key, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}:${value}`);

  // 効果1と効果2を結合（効果2がある場合のみ「｜」でつなぐ）
  const effects = [d.効果1, d.効果2].filter(v => v && v.trim() !== "").join("｜");
  if (effects) textParts.push(`効果:${effects}`);

  const copyText = `[一般]` + textParts.join(" ");

  // コピー処理
  try {
    await navigator.clipboard.writeText(copyText);
    alert(`コピーしました！\n「${copyText}」`);
  } catch (err) {
    console.error("コピーに失敗しました:", err);
  }
};
header.appendChild(copyIconWrapper);

// タグ1~3
[d.タグ1, d.タグ2, d.タグ3].forEach(tag => {
  if (tag) {
    const tagSpan = document.createElement("span");
    tagSpan.className = "typeTag";
    tagSpan.textContent = tag;
    header.appendChild(tagSpan);
  }
});

div.appendChild(header);

// -----------------------------
// 2行目: 効果1 + データ項目
// -----------------------------
const dataLine = document.createElement("div");
dataLine.className = "data-line";

let lineContent = "";

// 効果1ラベル
if (d.効果1) {
  lineContent += `<span class="data-label">${d.効果1}</span>`;
}

// フィールドグループを3つに分ける
const firstGroupFields = [
  ["常備化", d.常備化],
  ["購入", d.購入],
  ["経験点", d.経験点]
];

const secondGroupFields = [
  ["技能", d.技能]
];

// グループのテキスト生成関数
function buildGroupText(fields) {
  return fields
    .filter(([label, value]) => value !== undefined && value !== null && value !== "")
    .map(([label, value]) =>
      `<span class="data-label">${label}:</span><span class="data-value">${value}</span>`
    );
}

const firstGroupTexts = buildGroupText(firstGroupFields);
const secondGroupTexts = buildGroupText(secondGroupFields);

// lineContentに組み立て
if (firstGroupTexts.length > 0) {
  lineContent += (lineContent ? ' <span class="data-label">｜</span> ' : "") + firstGroupTexts.join("　");
}
if (secondGroupTexts.length > 0) {
  lineContent += (lineContent ? ' <span class="data-label">｜</span> ' : "") + secondGroupTexts.join("　");
}

dataLine.innerHTML = lineContent;
div.appendChild(dataLine);

// -----------------------------
// 効果2（灰色・小文字）
// -----------------------------
if (d.効果2) {
  const effect2 = document.createElement("div");
  effect2.className = "effect2 effect2-readable";
  effect2.textContent = d.効果2;
  div.appendChild(effect2);
}

container.appendChild(div);
  });
};
