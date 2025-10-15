

// フィルター設定（custom）
window.customFilters = [
  {
    id: "filter-tag1",
    key: "タグ1",
    label: "分類",
    getter: d => d.タグ1 ? [d.タグ1] : [],
    options: ["ジェネラル"],
    match: "partial"
  },
  {
    id: "filter-type",
    key: "種別",
    label: "種別",
    getter: d => d.種別 ? [d.種別] : [],
    options: ["武器", "防具", "ヴィークル", "一般", "コネ"],
    match: "partial"
  }
];


// 描画スクリプト（custom）
window.renderCustom = function(container, data) {
  container.innerHTML = "";

  data.forEach(d => {
    const div = document.createElement("div");
    div.className = "item itemz-card"; // ← scar-card → itemz-card に変更

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
      // コピー用テキストを生成
      const fields = [
        ["名称", d.name],
        ["種別", d.種別],
        ["経験点", d.経験点]
      ];

      // 未入力除外して key:value に整形
      const textParts = fields
        .filter(([k, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${k}:${v}`);

      // 効果1と効果2を｜で連結
      const effects = [d.効果1, d.効果2].filter(v => v && v.trim() !== "").join("｜");
      if (effects) textParts.push(`効果:${effects}`);

      const copyText = `[一般]` + textParts.join(" ");

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
    // 2行目: 効果1 + データ項目（経験点など）
    // -----------------------------
    const dataLine = document.createElement("div");
    dataLine.className = "data-line";
    let lineContent = "";

    // 効果1を先に
    if (d.効果1) {
      lineContent += `<span class="data-label">${d.効果1}</span>`;
    }

    // グループ1：基本情報
    const firstGroupFields = [
      ["経験点", d.経験点],
      ["種別", d.種別]
    ];

    // 各グループを成形
    function buildGroupText(fields) {
      return fields
        .filter(([label, value]) => value !== undefined && value !== null && value !== "")
        .map(([label, value]) =>
          `<span class="data-label">${label}:</span><span class="data-value">${value}</span>`
        );
    }

    const firstGroupTexts = buildGroupText(firstGroupFields);

    if (firstGroupTexts.length > 0) {
      lineContent += (lineContent ? ' <span class="data-label">｜</span> ' : "") + firstGroupTexts.join("　");
    }

    dataLine.innerHTML = lineContent;
    div.appendChild(dataLine);


    // -----------------------------
    // 3行目: 効果2（灰色・小文字）
    // -----------------------------
if (d.効果2) {
  const effect2 = document.createElement("div");
  effect2.className = "effect2 effect2-readable"; // 新しいクラス追加
  effect2.textContent = d.効果2;
  div.appendChild(effect2);
}

    container.appendChild(div);
  });
};
