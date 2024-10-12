const homeText = document.querySelector(".bg_home");

let fontSize = 7;
let increasing = true;

//udating font
function updateFontSize() {
  homeText.style.setProperty("--font-size", `${fontSize}rem`);
}

function animateText() {
  setTimeout(() => {
    if (increasing) {
      fontSize += 0.1;
      if (fontSize >= 3) {
        increasing = false;
      }
    } else {
      fontSize -= 0.1;
      if (fontSize <= 2.5) {
        increasing = true;
      }
    }
    updateFontSize();
    animateText();
  }, 100);
}

animateText();

homeText.addEventListener("click", () => {
  window.location.href = "html/roundSelection.html";
});
