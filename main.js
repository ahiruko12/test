document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("darkModeToggle");
  const body = document.body;

  // ページ読み込み時に状態を復元
  if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    toggle.checked = true;
  }

  // トグル変更で切り替え
  toggle.addEventListener("change", () => {
    body.classList.toggle("dark-mode", toggle.checked);
    localStorage.setItem("dark-mode", toggle.checked ? "enabled" : "disabled");
  });
});
