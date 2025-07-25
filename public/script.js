function copyToClipboard() {
  const code = document.getElementById("git-clone-code").textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector(".copy-btn");
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 2000);
  });
}

const date = (document.getElementById("year").textContent =
  new Date().getFullYear());
const themeButtons = document.querySelectorAll(".theme-btn");
const html = document.documentElement;

const savedTheme = localStorage.getItem("theme") || "system";
setTheme(savedTheme);

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    setTheme(theme);
    localStorage.setItem("theme", theme);
  });
});

function setTheme(theme) {
  themeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });

  if (theme === "system") {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    html.dataset.theme = systemPrefersDark ? "dark" : "light";

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (localStorage.getItem("theme") === "system") {
          html.dataset.theme = e.matches ? "dark" : "light";
        }
      });
  } else {
    html.dataset.theme = theme;
  }
}
