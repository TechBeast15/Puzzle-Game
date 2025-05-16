function ResetGameFunction() {
  if (confirm("🎉 Want to reset the game? This will clear all progress.")) {
    localStorage.removeItem("unlockedStage");
    location.reload(); // Reloads to apply reset
  }
}

const backgroundMusic = new Audio("Assets/Audio/GamingTheme.mp3");

let isMusicPlaying = false;

// Helper function to update the music button UI
function updateMusicButtonUI(musicButton) {
  if (!musicButton) return;

  musicButton.classList.toggle("colorBtn", isMusicPlaying);
  musicButton.innerHTML = isMusicPlaying
    ? '<i class="bi bi-volume-up"></i>'
    : '<i class="bi bi-volume-mute"></i>';
}

// Music toggle function
function musicFunction(musicButton) {
  if (isMusicPlaying) {
    backgroundMusic.pause();
  } else {
    backgroundMusic
      .play()
      .catch((err) => console.warn("Autoplay blocked:", err));
  }

  isMusicPlaying = !isMusicPlaying;
  updateMusicButtonUI(musicButton);
}

const pickSound = new Audio("Assets/Audio/pick.mp3");
const dropSound = new Audio("Assets/Audio/drop.mp3");
const levelComplete = new Audio("Assets/Audio/levelComplete.mp3");
pickSound.currentTime = 1;

let isSoundEnabled = true; // Flag to keep track of sound status

// Sound Toggle Function
function soundFunction(btn) {
  isSoundEnabled = !isSoundEnabled;
  btn.classList.toggle("colorBtn", isSoundEnabled);
  btn.innerHTML = isSoundEnabled
    ? '<i class="bi bi-volume-up"></i>'
    : '<i class="bi bi-volume-mute"></i>';
}

// Helper function to play sound if enabled
function playSound(sound) {
  if (isSoundEnabled) {
    sound.cloneNode().play();
  }
}

window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  const fullUI = document.getElementById("fullUI");

  // Create and show Loading text
  const loadingText = document.createElement("p");
  loadingText.id = "loadingText";
  loadingText.textContent = "Loading...";
  preloader.appendChild(loadingText);

  // Create the Enter button (initially hidden)
  const enterButton = document.createElement("button");
  enterButton.id = "enterButton";
  enterButton.textContent = "Play";
  enterButton.style.display = "none"; // Hide initially
  preloader.appendChild(enterButton);

  // Show the Play button after a short delay and remove Loading text
  setTimeout(() => {
    loadingText.remove();
    enterButton.style.display = "inline-block";
  }, 1000); // Adjust delay if needed

  let hasEntered = false;

  enterButton.addEventListener("click", function () {
    if (hasEntered) return;
    hasEntered = true;
    enterButton.disabled = true;
    enterButton.style.pointerEvents = "none";

    preloader.classList.add("fade-out");
    fullUI.style.display = "block";

    setTimeout(() => {
      preloader.style.display = "none";
      fullUI.classList.add("fade-in");

      backgroundMusic
        .play()
        .then(() => {
          isMusicPlaying = true;
          const musicButton = document.querySelector(".musicButton");
          updateMusicButtonUI(musicButton);
        })
        .catch((err) => {
          console.warn("Autoplay blocked:", err);
          isMusicPlaying = false;
        });

      isSoundEnabled = true;
    }, 1000);
  });

  // Arrow icon adjustment based on window size
  const arrowIcon = document.getElementById("arrow");
  if (arrowIcon) {
    if (window.innerWidth < 576) {
      arrowIcon.classList.add("bi-arrow-90deg-right");
    } else {
      arrowIcon.classList.add("bi-arrow-90deg-down");
    }
  }
});

// Adjust arrow icon on window resize
window.addEventListener("resize", () => {
  const arrowIcon = document.getElementById("arrow");
  if (window.innerWidth < 576) {
    arrowIcon.classList.add("bi-arrow-90deg-right");
    arrowIcon.classList.remove("bi-arrow-90deg-down");
  } else {
    arrowIcon.classList.add("bi-arrow-90deg-down");
    arrowIcon.classList.remove("bi-arrow-90deg-right");
  }
});

const stagesCard = document.querySelector(".stagesCard");
let horizontalScroll = 0;
let verticalScroll = 0;

function scrollFunction(xPosition) {
  if (window.innerWidth > 576) {
    const maxScrollLeft = stagesCard.scrollWidth - stagesCard.clientWidth;
    horizontalScroll = Math.min(
      Math.max(horizontalScroll + xPosition, 0),
      maxScrollLeft
    );

    stagesCard.scrollTo({
      left: horizontalScroll,
      behavior: "smooth",
    });
  } else {
    const maxScrollTop = stagesCard.scrollHeight - stagesCard.clientHeight;
    verticalScroll = Math.min(
      Math.max(verticalScroll + xPosition, 0),
      maxScrollTop
    );

    stagesCard.scrollTo({
      top: verticalScroll,
      behavior: "smooth",
    });

    //
  }
}

// Puzzle Game Class

class PuzzleGame {
  constructor(stages) {
    this.stages = stages;
    this.stageContainer = document.querySelector(".STAGE");
    this.mainPage = document.querySelector(".mainPage");
    this.stageLabel = document.querySelector("#WHOSESTAGE");
    this.puzzleContainer = document.querySelector(".PUZZLEDIV");
    this.playNotice = document.querySelector(".playNotice");
    this.stINQ = document.querySelector("#stINQ");
    this.currentStage = 0;
    this.fullImageHere = document.querySelectorAll(".fullImageHere");
    this.initUnlockedStages();
  }

  shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  initUnlockedStages() {
    const savedStage = parseInt(localStorage.getItem("unlockedStage"), 10) || 1;
    document.querySelectorAll(".card").forEach((btn) => {
      const stage = parseInt(btn.dataset.numberAccess, 10);
      if (stage <= savedStage) {
        btn.classList.add("open");
      }
    });
  }

  // loadStage(button) {
  //   if (!button.classList.contains("open")) {
  //     alert("🔒 Stage is locked.");
  //     return;
  //   }

  //   const stageNumber = parseInt(button.dataset.numberAccess, 10);
  //   if (
  //     isNaN(stageNumber) ||
  //     stageNumber < 1 ||
  //     stageNumber > this.stages.length
  //   ) {
  //     alert("Invalid stage.");
  //     return;
  //   }

  //   this.currentStage = stageNumber;

  //   this.fullImageHere.forEach((img) => {
  //     img.src = FullImages[stageNumber - 1];
  //   });

  //   const stageImages = this.stages[stageNumber - 1];

  //   this.stageLabel.textContent = `STAGES - ${stageNumber}`;

  //   this.mainPage.classList.add("fade-out");
  //   // setTimeout(() => {
  //   this.mainPage.style.display = "none";
  //   this.stageContainer.style.display = "block";
  //   this.playNotice.style.display = "flex";
  //   this.stINQ.textContent = `STAGE - ${stageNumber}`;
  //   this.renderPuzzle(stageImages);
  //   // }, 1000);
  // }

  // renderPuzzle(images) {
  //   this.puzzleContainer.innerHTML = "";

  //   const entries = this.shuffle(Object.entries(images));
  //   const length = entries.length;
  //   const size = Math.sqrt(length);
  //   const percent = 100 / size;

  //   for (let [key, value] of entries) {
  //     const box = document.createElement("div");
  //     const img = document.createElement("img");

  //     box.className = "boxImg";
  //     img.className = "puzzleImage";
  //     img.id = `img${key}`;
  //     img.src = `./Assets/Img/${value}`;
  //     img.setAttribute("draggable", true);

  //     box.appendChild(img);
  //     box.style.width = percent + "%";
  //     box.style.height = percent + "%";
  //     this.puzzleContainer.appendChild(box);
  //   }

  //   this.enableDragDrop();
  // }

  // Function to load the selected stage
  loadStage(button) {
    if (!button.classList.contains("open")) {
      alert("🔒 Stage is locked.");
      return;
    }

    const stageNumber = parseInt(button.dataset.numberAccess, 10);
    if (
      isNaN(stageNumber) ||
      stageNumber < 1 ||
      stageNumber > this.stages.length
    ) {
      alert("Invalid stage.");
      return;
    }

    this.currentStage = stageNumber;

    // Update full image preview for the selected stage
    this.fullImageHere.forEach((img) => {
      img.src = FullImages[stageNumber - 1];
    });

    const stageImages = this.stages[stageNumber - 1];

    this.stageLabel.textContent = `STAGES - ${stageNumber}`;

    // Hide the main page and show the stage container with the play notice
    this.mainPage.classList.add("fade-out");
    setTimeout(() => {
      this.mainPage.style.display = "none";
      this.stageContainer.style.display = "block";
      this.playNotice.style.display = "flex"; // Show play notice
      this.stINQ.textContent = `STAGE - ${stageNumber}`;

      // Start loading the puzzle images, then enable play button when done
      this.renderPuzzle(stageImages);
    }, 500);
  }

  // Method to render the puzzle pieces based on the given images
  renderPuzzle(images) {
    this.puzzleContainer.innerHTML = ""; // Clear existing puzzle

    const entries = this.shuffle(Object.entries(images));
    const length = entries.length;
    const size = Math.sqrt(length);
    const percent = 100 / size;

    let loadedImagesCount = 0; // Track the number of loaded images

    // Create puzzle pieces (divs with images)
    for (let [key, value] of entries) {
      const box = document.createElement("div");
      const img = document.createElement("img");

      box.className = "boxImg";
      img.className = "puzzleImage";
      img.id = `img${key}`;
      img.src = `./Assets/Img/${value}`;
      img.setAttribute("draggable", true);

      box.appendChild(img);
      box.style.width = percent + "%";
      box.style.height = percent + "%";
      this.puzzleContainer.appendChild(box);

      // Check when the image has fully loaded
      img.onload = () => {
        loadedImagesCount++;
        // Once all images are loaded, enable the play button
        if (loadedImagesCount === entries.length) {
          this.enablePlayButton(); // Enable play button when all images are loaded
        }
      };
    }

    this.enableDragDrop(); // Enable drag-and-drop functionality (but not until images are fully loaded)
  }

  // Enable the play button after all images are loaded
  enablePlayButton() {
    const playButton = this.playNotice.querySelector(".play-button");
    playButton.disabled = false; // Enable the play button
    playButton.addEventListener("click", () => {
      this.startStage(); // Start the game when play button is clicked
    });
  }

  startStage() {
    if (!this.currentStage) return;

    this.stageContainer.style.display = "block";
    this.playNotice.style.display = "none";
     this.renderPuzzle(this.stages[this.currentStage - 1]); // Ensure puzzle is rendered
  }

  enableDragDrop() {
    const images = document.querySelectorAll(".puzzleImage");
    const boxes = document.querySelectorAll(".boxImg");

    images.forEach((img) => {
      img.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", img.id);
        img.style.opacity = "0.4";

        playSound(pickSound);
      });

      img.addEventListener("dragend", (e) => {
        img.style.opacity = "1";
      });
    });

    boxes.forEach((box) => {
      box.addEventListener("dragover", (e) => {
        if (box.children.length === 0) {
          e.preventDefault();
        }
      });

      box.addEventListener("drop", (e) => {
        e.preventDefault();

        const id = e.dataTransfer.getData("text/plain");
        const draggedImg = document.getElementById(id);

        if (draggedImg && box.children.length === 0) {
          box.appendChild(draggedImg);
          this.checkSequence();
        }

        playSound(dropSound);
      });
    });

    // Touch support for mobile devices
    let touchImg = null;

    images.forEach((img) => {
      img.addEventListener("touchstart", (e) => {
        touchImg = img;
        touchImg.classList.add("dragging");
        playSound(pickSound);
      });
    });

    boxes.forEach((box) => {
      box.addEventListener("touchmove", (e) => {
        if (!touchImg) return;

        const touch = e.touches[0];
        const el = document.elementFromPoint(touch.clientX, touch.clientY);

        // Optional visual feedback
        boxes.forEach((b) => b.classList.remove("highlight-drop"));
        if (el && el.classList.contains("boxImg") && el.children.length === 0) {
          el.classList.add("highlight-drop");
        }

        e.preventDefault(); // Prevent page scroll
      });

      box.addEventListener("touchend", (e) => {
        if (!touchImg) return;

        const touch = e.changedTouches[0];
        const dropTarget = document.elementFromPoint(
          touch.clientX,
          touch.clientY
        );

        if (
          dropTarget &&
          dropTarget.classList.contains("boxImg") &&
          dropTarget.children.length === 0
        ) {
          dropTarget.appendChild(touchImg);
          this.checkSequence();
          playSound(dropSound);
        }

        touchImg.classList.remove("dragging");
        boxes.forEach((b) => b.classList.remove("highlight-drop"));
        touchImg = null;
      });
    });
  }

  checkSequence() {
    const boxes = document.querySelectorAll(".boxImg");
    const stageImages = this.stages[this.currentStage - 1];

    let currentOrder = "";
    let correctOrder = "";

    for (let key in stageImages) {
      correctOrder += stageImages[key];
    }

    boxes.forEach((box, index) => {
      if (index === 0) return; // Skip the first box
      const img = box.querySelector("img");
      if (img) {
        const filename = img.src.split("/Img/")[1];
        currentOrder += filename;
      }
    });

    if (currentOrder === correctOrder) {
      playSound(levelComplete);

      setTimeout(() => {
        alert("🎉 Stage Complete!");

        const nextStage = this.currentStage + 1;
        const buttons = document.querySelectorAll(".card");

        if (buttons[nextStage - 1]) {
          buttons[nextStage - 1].classList.add("open");
          localStorage.setItem("unlockedStage", nextStage);

          nextStageOpen();
        } else {
          // All stages are complete
          console.log("All stages completed!");
          alert("🎉 All stages completed!");
        }
      }, 2000);
    }
  }

  exitStage() {
    this.mainPage.classList.remove("fade-out");
    this.stageContainer.style.display = "none";
    this.playNotice.style.display = "none";
    this.mainPage.style.display = "flex";
    this.puzzleContainer.innerHTML = "";
    this.currentStage = 0;
  }
}
// Stage Data

const STAGES = [
  {
    1: "Stages/PuzzleSet1/1.png",
    2: "Stages/PuzzleSet1/2.png",
    3: "Stages/PuzzleSet1/3.png",
    4: "Stages/PuzzleSet1/4.png",
    5: "Stages/PuzzleSet1/5.png",
    6: "Stages/PuzzleSet1/6.png",
    7: "Stages/PuzzleSet1/7.png",
    8: "Stages/PuzzleSet1/8.png",
    9: "Stages/PuzzleSet1/9.png",
  },
  {
    1: "Stages/PuzzleSet2/1.png",
    2: "Stages/PuzzleSet2/2.png",
    3: "Stages/PuzzleSet2/3.png",
    4: "Stages/PuzzleSet2/4.png",
    5: "Stages/PuzzleSet2/5.png",
    6: "Stages/PuzzleSet2/6.png",
    7: "Stages/PuzzleSet2/7.png",
    8: "Stages/PuzzleSet2/8.png",
    9: "Stages/PuzzleSet2/9.png",
    10: "Stages/PuzzleSet2/10.png",
    11: "Stages/PuzzleSet2/11.png",
    12: "Stages/PuzzleSet2/12.png",
    13: "Stages/PuzzleSet2/13.png",
    14: "Stages/PuzzleSet2/14.png",
    15: "Stages/PuzzleSet2/15.png",
    16: "Stages/PuzzleSet2/16.png",
  },

  {
    1: "Stages/PuzzleSet3/1.png",
    2: "Stages/PuzzleSet3/2.png",
    3: "Stages/PuzzleSet3/3.png",
    4: "Stages/PuzzleSet3/4.png",
    5: "Stages/PuzzleSet3/5.png",
    6: "Stages/PuzzleSet3/6.png",
    7: "Stages/PuzzleSet3/7.png",
    8: "Stages/PuzzleSet3/8.png",
    9: "Stages/PuzzleSet3/9.png",
    10: "Stages/PuzzleSet3/10.png",
    11: "Stages/PuzzleSet3/11.png",
    12: "Stages/PuzzleSet3/12.png",
    13: "Stages/PuzzleSet3/13.png",
    14: "Stages/PuzzleSet3/14.png",
    15: "Stages/PuzzleSet3/15.png",
    16: "Stages/PuzzleSet3/16.png",
  },

  {
    1: "Stages/PuzzleSet4/1.png",
    2: "Stages/PuzzleSet4/2.png",
    3: "Stages/PuzzleSet4/3.png",
    4: "Stages/PuzzleSet4/4.png",
    5: "Stages/PuzzleSet4/5.png",
    6: "Stages/PuzzleSet4/6.png",
    7: "Stages/PuzzleSet4/7.png",
    8: "Stages/PuzzleSet4/8.png",
    9: "Stages/PuzzleSet4/9.png",
    10: "Stages/PuzzleSet4/10.png",
    11: "Stages/PuzzleSet4/11.png",
    12: "Stages/PuzzleSet4/12.png",
    13: "Stages/PuzzleSet4/13.png",
    14: "Stages/PuzzleSet4/14.png",
    15: "Stages/PuzzleSet4/15.png",
    16: "Stages/PuzzleSet4/16.png",
    17: "Stages/PuzzleSet4/17.png",
    18: "Stages/PuzzleSet4/18.png",
    19: "Stages/PuzzleSet4/19.png",
    20: "Stages/PuzzleSet4/20.png",
    21: "Stages/PuzzleSet4/21.png",
    22: "Stages/PuzzleSet4/22.png",
    23: "Stages/PuzzleSet4/23.png",
    24: "Stages/PuzzleSet4/24.png",
    25: "Stages/PuzzleSet4/25.png",
  },

  {
    1: "Stages/PuzzleSet5/1.png",
    2: "Stages/PuzzleSet5/2.png",
    3: "Stages/PuzzleSet5/3.png",
    4: "Stages/PuzzleSet5/4.png",
    5: "Stages/PuzzleSet5/5.png",
    6: "Stages/PuzzleSet5/6.png",
    7: "Stages/PuzzleSet5/7.png",
    8: "Stages/PuzzleSet5/8.png",
    9: "Stages/PuzzleSet5/9.png",
    10: "Stages/PuzzleSet5/10.png",
    11: "Stages/PuzzleSet5/11.png",
    12: "Stages/PuzzleSet5/12.png",
    13: "Stages/PuzzleSet5/13.png",
    14: "Stages/PuzzleSet5/14.png",
    15: "Stages/PuzzleSet5/15.png",
    16: "Stages/PuzzleSet5/16.png",
    17: "Stages/PuzzleSet5/17.png",
    18: "Stages/PuzzleSet5/18.png",
    19: "Stages/PuzzleSet5/19.png",
    20: "Stages/PuzzleSet5/20.png",
    21: "Stages/PuzzleSet5/21.png",
    22: "Stages/PuzzleSet5/22.png",
    23: "Stages/PuzzleSet5/23.png",
    24: "Stages/PuzzleSet5/24.png",
    25: "Stages/PuzzleSet5/25.png",
    26: "Stages/PuzzleSet5/26.png",
    27: "Stages/PuzzleSet5/27.png",
    28: "Stages/PuzzleSet5/28.png",
    29: "Stages/PuzzleSet5/29.png",
    30: "Stages/PuzzleSet5/30.png",
    31: "Stages/PuzzleSet5/31.png",
    32: "Stages/PuzzleSet5/32.png",
    33: "Stages/PuzzleSet5/33.png",
    34: "Stages/PuzzleSet5/34.png",
    35: "Stages/PuzzleSet5/35.png",
    36: "Stages/PuzzleSet5/36.png",
  },
  // repeat more stages as needed
];

const FullImages = [
  "Assets/Img/Stages/PuzzleSet1/fullImage.png",
  "Assets/Img/Stages/PuzzleSet2/fullImage.png",
  "Assets/Img/Stages/PuzzleSet3/fullImage.png",
  "Assets/Img/Stages/PuzzleSet4/fullImage.png",
  "Assets/Img/Stages/PuzzleSet5/fullImage.png",
];

const cards = document.querySelectorAll(".card img");

cards.forEach((img, index) => {
  img.src = FullImages[index];
});

// Initialize
const game = new PuzzleGame(STAGES);

// Global functions for buttons
function STAGEFUNCTION(button) {
  game.loadStage(button);
}
function GameFunction() {
  game.startStage();
}
function exitFunction() {
  game.exitStage();
}

function nextStageOpen() {
  const nextStage = game.currentStage + 1; // Increment the current stage
  const buttons = document.querySelectorAll(".card");

  const nextButton = buttons[nextStage - 1]; // Get the next button based on the stage
  console.log("Next stage:", nextStage);
  console.log("Total stages:", game.stages.length);

  if (nextButton) {
    nextButton.classList.add("open");
    localStorage.setItem("unlockedStage", nextStage);

    // If there's a next stage, ask if the player wants to continue
    if (nextStage <= game.stages.length) {
      console.log("Stage is not the last one.");
      if (
        confirm("🎉 Stage complete! Do you want to continue to the next stage?")
      ) {
        game.loadStage(nextButton);
      }
    } else {
      // All stages are complete
      console.log("All stages completed!");
      alert("🎉 All stages completed!");
    }
  } else {
    console.log("No next button found.");
  }
}

function stagePageMoveFunction(num) {
  document.querySelector(".DORPIMG").innerHTML = "";

  const cards = Array.from(document.querySelectorAll(".card"));
  const openCards = cards.filter((card) => card.classList.contains("open"));

  const currentIndex = openCards.findIndex(
    (card) => parseInt(card.dataset.numberAccess, 10) === game.currentStage
  );

  const nextIndex = currentIndex + num;

  if (nextIndex >= 0 && nextIndex < openCards.length) {
    const nextCard = openCards[nextIndex];
    game.loadStage(nextCard);
  } else {
    alert(num === -1 ? "🚫 No previous stage." : "🚫 No next unlocked stage.");
  }
}

function homePageFunction() {
  if (confirm("🏠 Return to Home Page?")) {
    game.exitStage(); // This already resets puzzle, stage UI, etc.

    // If you want to manually clear any extra elements, do it carefully:
    const DORPIMG = document.querySelector(".DORPIMG");
    if (DORPIMG) {
      DORPIMG.innerHTML = "";
    }
  }
}

function restartStage() {
  if (!game.currentStage) return;

  const confirmReset = confirm("🔄 Do you want to restart this stage?");
  if (confirmReset) {
    const stageImages = game.stages[game.currentStage - 1];
    game.renderPuzzle(stageImages);
  }
}

function toggleVisibility(selector, show = true) {
  const element = document.querySelector(selector);
  if (element) {
    element.classList.toggle("visible", show);
  } else {
    console.warn(`Element ${selector} not found!`);
  }
}

function fullScreenImageView() {
  toggleVisibility(".fullScreenSection", true);
}

function closeFullScreenFunction() {
  toggleVisibility(".fullScreenSection", false);
}

function fullScreenSettingView() {
  toggleVisibility(".settingSection", true);
}

function fullScreenSettingViewClose() {
  toggleVisibility(".settingSection", false);
}
