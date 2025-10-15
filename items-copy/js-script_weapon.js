// 描画スクリプト（weapon）

// フィルタ―設定
window.weaponFilters = [
  {
    id: "filter-tag1",
    key: "タグ1",
    label: "分類",
    getter: d => d.タグ1 ? [d.タグ1] : [],
    options: ["ジェネラル", "ユニーク", "エフェクト", "Dロイス", "FH専用", "エンブレム", "トレイル"],
    match: "partial"  // partial: 部分一致, full: 完全一致
  },
  {
    id: "filter-type",
    key: "種別",
    label: "種別",
    getter: d => d.種別 ? [d.種別] : [], // 単一値でも配列にする
    options: ["白兵", "射撃"],  // 必要に応じて追加
    match: "partial" // partial: 部分一致, full: 完全一致
  },
  {
    id: "filter-range",
    key: "射程",
    label: "射程",
    getter: d => d.射程 ? [d.射程] : [],
    options: ["至近", "視界", "10m", "100m"],
    match: "partial"
  },
  {
    id: "filter-tag3",
    key: "タグ3",
    label: "制限",
    getter: d => {
      // タグ3が空の場合は「―」を返す
      return d.タグ3 && d.タグ3.trim() ? d.タグ3.split(/\s*,\s*/) : ["なし"];
    },
    options: ["なし","両手持ち", "搭載火器", "至近不可", "レアアイテム"], // 「なし」を追加
    match: "partial"
  }
];


// 検索窓は main.js で生成

window.renderWeapon = function(container, data) {
  container.innerHTML = "";

  data.forEach(d => {
    const div = document.createElement("div");
    div.className = "item itemz-card"; // itemz-cardクラスを付与してコピーアイコンCSSに対応

// -----------------------------
// 1行目: name + コピーアイコン + タグ1~3
// -----------------------------
const header = document.createElement("div");
header.className = "item-header";  // ← CSSで装飾

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

  // コピー用テキストを生成
  const fields = [
    ["名称", d.name],
    ["常備化", d.常備化],
    ["購入", d.購入],
    ["経験点", d.経験点],
    ["種別", d.種別],
    ["技能", d.技能],
    ["命中", d.命中],
    ["攻撃力", d.攻撃力],
    ["ガード値", d.ガード値],
    ["射程", d.射程]
  ];

 // 未入力を除外して key:value 形式に変換
  const textParts = fields
    .filter(([key, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}:${value}`);

  // 効果1と効果2を連結（効果2がある場合のみ｜でつなぐ）
  const effects = [d.効果1, d.効果2].filter(v => v && v.trim() !== "").join("｜");
  if (effects) textParts.push(`効果:${effects}`);

  const copyText = `[武器]` + textParts.join(" ");

  // クリップボードにコピー
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
  if(tag){
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

// 効果1はラベル扱い（表示は文字列のみ）
if (d.効果1) {
  lineContent += `<span class="data-label">${d.効果1}</span>`;
}

// valueにするフィールド名のセット
const valueFields = new Set([
  "常備化","購入","経験点","種別","技能","命中","攻撃力","ガード値","射程"
]);

// フィールドグループ
const firstGroupFields = [
  ["常備化", d.常備化],
  ["購入", d.購入],
  ["経験点", d.経験点]
];

const secondGroupFields = [
  ["種別", d.種別],
  ["技能", d.技能]
];

const thirdGroupFields = [
  ["命中", d.命中],
  ["攻撃力", d.攻撃力],
  ["ガード値", d.ガード値],
  ["射程", d.射程]
];

// 各グループのテキスト生成関数
function buildGroupText(fields) {
  return fields
    .filter(([label, value]) => value !== undefined && value !== null && value !== "")
    .map(([label, value]) => 
      `<span class="data-label">${label}:</span><span class="data-value">${value}</span>`
    );
}

// 各グループのテキスト
const firstGroupTexts = buildGroupText(firstGroupFields);
const secondGroupTexts = buildGroupText(secondGroupFields);
const thirdGroupTexts = buildGroupText(thirdGroupFields);

// lineContent に組み立て
if (firstGroupTexts.length > 0) {
  lineContent += (lineContent ? ' <span class="data-label">｜</span> ' : "") + firstGroupTexts.join("　");
}

if (secondGroupTexts.length > 0) {
  lineContent += (lineContent ? ' <span class="data-label">｜</span> ' : "") + secondGroupTexts.join("　");
}

if (thirdGroupTexts.length > 0) {
  lineContent += (lineContent ? ' <span class="data-label">｜</span> ' : "") + thirdGroupTexts.join("　");
}

// データ行に反映
dataLine.innerHTML = lineContent;
div.appendChild(dataLine);



// -----------------------------
// 効果2（灰色・小文字）
if (d.効果2) {
  const effect2 = document.createElement("div");
  effect2.className = "effect2";
  effect2.textContent = d.効果2;
  div.appendChild(effect2);
}

    container.appendChild(div);
  });
};


