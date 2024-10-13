window.addEventListener("load", function () {
    const loadingBar = document.getElementById("loading-bar");
    const loadingText = document.getElementById("loading-text");
    const loadingScreen = document.getElementById("loading-screen");
    const content = document.getElementById("stage-select");

    let progress = 0;
    const interval = setInterval(function() {
        if (progress >= 100) {
            clearInterval(interval);
            loadingScreen.style.display = "none";
            content.style.display = "block";
        } else {
            progress += 1;
            loadingBar.style.width = progress + "%";
            loadingText.innerText = progress + "%";
        }
    }, 30);
});
