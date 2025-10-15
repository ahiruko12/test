document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("copy-container");
  const searchContainer = document.getElementById("search-container");
  let currentData = [];
  let currentRender = null;
  let currentFilters = [];

  // ---------------------------
  // スクリプトロード
  // ---------------------------
  function loadScript(file, callback) {
    const script = document.createElement("script");
    script.src = file;
    script.onload = callback;
    document.body.appendChild(script);
  }

  // ---------------------------
  // 検索窓セットアップ
  // ---------------------------
  function setupSearch(data, renderFunc) {
    searchContainer.innerHTML = "";
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.id = "searchBox";
    searchBox.placeholder = "🔎名称を入力";
    searchBox.style.marginBottom = "10px";
    searchContainer.appendChild(searchBox);

    searchBox.addEventListener("input", () => {
      const query = searchBox.value.trim().toLowerCase();
    if (!query) {
      renderFunc(container, data);
      return;
    }

    // 空白で分割して複数ワードに
    const words = query.split(/\s+/);

    const filteredData = data.filter(d => {
      // チェックする対象フィールド
      const fields = [
        d.name || "",
        d.タグ2 || "",
        d.効果2 || ""
      ].map(f => f.toLowerCase());

      // すべてのワードがどれかのフィールドに含まれるか
      return words.every(word => fields.some(f => f.includes(word)));
    });

    renderFunc(container, filteredData);
  });
}
  // ---------------------------
  // 全フィルター反映
  // ---------------------------
function applyAllFilters() {
  const container = document.getElementById("copy-container"); // 明示的に取得
  let filtered = [...currentData];

  // フィルターを順に適用
  if (currentFilters) {
    currentFilters.forEach(f => {
      const selected = $(`#${f.id}`).multipleSelect("getSelects") || [];
      if (selected.length === 0) return;

      filtered = filtered.filter(item => {
        const values = f.getter(item) || [];
        const selectedTrimmed = selected.map(s => s.trim());
        return values.some(v => 
          selectedTrimmed.some(sel => String(v).trim().includes(sel))
        );
      });
    });
  }

  // 検索キーワード適用
  const searchBox = document.getElementById("searchBox");
  const keyword = searchBox ? searchBox.value.trim().toLowerCase() : "";
  if (keyword) {
    filtered = filtered.filter(item => item.name.toLowerCase().includes(keyword));
  }

  // 描画
  if (currentRender) currentRender(container, filtered);
}


  // ---------------------------
  // フィルターUI構築
  // ---------------------------
  function buildFilterUI(filters) {
    const filterContainer = document.getElementById("detailedFilters");
    filterContainer.innerHTML = "";

    filters.forEach(f => {
      const wrapper = document.createElement("div");
      wrapper.className = "selectbox-3";
      const select = document.createElement("select");
      select.id = f.id;
      select.multiple = true;
      wrapper.appendChild(select);
      filterContainer.appendChild(wrapper);

    // option追加
    f.options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });

      // multiple-select初期化
      $(select).multipleSelect({
        width: 180,
        filter: true,
        placeholder: f.label,       // ←ここで「種別」などを表示
        formatSelectAll: () => "すべて",
        formatAllSelected: () => "全て選択されています",
        onClose: applyAllFilters
      });
    });

    filterContainer.classList.remove("hidden");
  }

  // ---------------------------
  // 切替ボタン
  // ---------------------------
  const buttons = document.querySelectorAll("button[data-target]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const target = btn.dataset.target;
      const container = document.getElementById("copy-container");

      // 各ターゲットのスクリプトをロードして描画
      loadScript(`js-data_${target}.js`, () => {
        loadScript(`js-script_${target}.js`, () => {
          currentData = window[`data${capitalize(target)}`];
          currentRender = window[`render${capitalize(target)}`];
          currentFilters = window[`${target}Filters`] || [];

        setupSearch(currentData, currentRender);
        buildFilterUI(currentFilters);
        applyAllFilters();
        });
      }); 
    });
  });
});

// ---------------------------
// ヘルパー
// ---------------------------
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ---------------------------
// 初期ロード
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const firstButton = document.querySelector("button[data-target]");
  if (firstButton) firstButton.click();
});

// ---------------------------
// コードコピー機能（ページ上の独立ボタン用）
// ---------------------------
const codeToCopy = document.getElementById("code-to-copy");
const copyBtn = document.getElementById("button-book");

if (codeToCopy && copyBtn) {
  copyBtn.addEventListener("click", () => {
    const text = codeToCopy.innerText;
    navigator.clipboard.writeText(text)
      .then(() => alert("コードをコピーしました！ブックマークに追加してください。"))
      .catch(err => alert("コピー失敗: " + err));
  });
}
