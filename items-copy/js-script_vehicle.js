// ==============================
// 描画スクリプト（vehicle）
// ==============================

// フィルタ―設定
window.vehicleFilters = [
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
    options: ["運転:二輪","運転:四輪","運転:船舶","運転:航空機","運転:馬","運転:多脚戦車","運転:宇宙船"],
    match: "partial",
  },
  {
    id: "filter-tag3",
    key: "タグ3",
    label: "制限",
    getter: d => d.タグ3 ? [d.タグ3] : ["なし"],
    options: ["なし","搭載火器✕","特殊環境のみ"],
    match: "partial"
  }
];


// ==============================
// レンダリング関数
// ==============================
window.renderVehicle = function(container, data) {
  container.innerHTML = "";

  data.forEach(d => {
    const div = document.createElement("div");
    div.className = "item itemz-card";

    // -----------------------------
    // 1行目: 名称 + コピーアイコン + タグ1~3
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

      const fields = [
        ["名称", d.name],
        ["常備化", d.常備化],
        ["購入", d.購入],
        ["経験点", d.経験点],
        ["種別", d.種別],
        ["技能", d.技能],
        ["行動", d.行動],
        ["攻撃力", d.攻撃力],
        ["装甲値", d.装甲値],
        ["全力移動", d.全力移動]
      ];

      const textParts = fields
        .filter(([_, v]) => v && v !== "")
        .map(([k, v]) => `${k}:${v}`);

      const effects = [d.効果1, d.効果2].filter(v => v && v.trim() !== "").join("｜");
      if (effects) textParts.push(`効果:${effects}`);

      const copyText = `[ヴィークル]` + textParts.join(" ");
      try {
        await navigator.clipboard.writeText(copyText);
        alert(`コピーしました！\n「${copyText}」`);
      } catch (err) {
        console.error("コピーに失敗しました:", err);
      }
    };
    header.appendChild(copyIconWrapper);

    // タグ1〜3
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
    // 2行目: 効果1 + データ項目（3分割）
    // -----------------------------
    const dataLine = document.createElement("div");
    dataLine.className = "data-line";

    let lineContent = "";

    if (d.効果1) {
      lineContent += `<span class="data-label">${d.効果1}</span>`;
    }

    // フィールドグループ
    const firstGroupFields = [
      ["常備化", d.常備化],
      ["購入", d.購入],
      ["経験点", d.経験点]
    ];

    const secondGroupFields = [
      ["技能", d.技能]
    ];

    const thirdGroupFields = [
      ["行動", d.行動],
      ["攻撃力", d.攻撃力],
      ["装甲値", d.装甲値],
      ["全力移動", d.全力移動]
    ];

    // テキスト生成
    function buildGroupText(fields) {
      return fields
        .filter(([_, v]) => v && v !== "")
        .map(([label, value]) =>
          `<span class="data-label">${label}:</span><span class="data-value">${value}</span>`
        );
    }

    const firstGroupTexts = buildGroupText(firstGroupFields);
    const secondGroupTexts = buildGroupText(secondGroupFields);
    const thirdGroupTexts = buildGroupText(thirdGroupFields);

    if (firstGroupTexts.length > 0) {
      lineContent += (lineContent ? ' <span class="data-label">｜</span> ' : "") + firstGroupTexts.join("　");
    }
    if (secondGroupTexts.length > 0) {
      lineContent += ' <span class="data-label">｜</span> ' + secondGroupTexts.join("　");
    }
    if (thirdGroupTexts.length > 0) {
      lineContent += ' <span class="data-label">｜</span> ' + thirdGroupTexts.join("　");
    }

    dataLine.innerHTML = lineContent;
    div.appendChild(dataLine);

    // -----------------------------
    // 効果2（灰色・小文字）
    // -----------------------------
    if (d.効果2) {
      const effect2 = document.createElement("div");
      effect2.className = "effect2";
      effect2.textContent = d.効果2;
      div.appendChild(effect2);
    }

    container.appendChild(div);
  });
};
