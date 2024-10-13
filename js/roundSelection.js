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

const city = document.getElementById("city");
const myAudio = document.getElementById("myAudio");

function openWindowWithDelay() {
    setTimeout(function() {
      window.location.href = "city.html";
    }, 3000); // Delay of 3000 milliseconds (3 seconds)
  }

city.addEventListener("click", function() {
    myAudio.play();
    town.style.opacity = -0.5;
    road.style.opacity = -0.5;
    openWindowWithDelay();
    
});

const town = document.getElementById("town");
town.addEventListener("click", function() {
    alert("Town(MEDIUM LEVEL) is not available yet.");
});

const road = document.getElementById("road");
road.addEventListener("click", function () {
  alert("Road(EXPERT LEVEL) is not available yet.");
});

const showButton = document.getElementById('showButton');
const hideButton = document.getElementById('hideButton');
const instructionPage = document.getElementById('instructionPage');

showButton.addEventListener('click', () => {
    instructionPage.style.display = 'block'; 
    showButton.style.display = 'none'; 
});

hideButton.addEventListener('click', () => {
    instructionPage.style.display = 'none'; 
    showButton.style.display = 'inline-block'; 
});