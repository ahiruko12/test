document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");
  const body = document.body;

  // ページ読み込み時に状態を復元
  if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    toggle.checked = true;
  }

  toggle.addEventListener("change", () => {
    body.classList.toggle("dark-mode", toggle.checked);
    localStorage.setItem("dark-mode", toggle.checked ? "enabled" : "disabled");

    // 必要に応じてセレクトボックスの色も更新
    const filterIds = ["filter1","filter2","filter3","filter4","filter5","filter6","filter7"];
    filterIds.forEach(id => {
      const select = document.getElementById(id);
      if(select){
        select.classList.toggle("defaultOption", !select.value);
        select.style.color = toggle.checked ? "#eee" : "#000";
      }
    });
  });
});
