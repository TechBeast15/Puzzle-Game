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
  const loadingText = document.getElementById("loadingText");

  // Create the Enter button (initially hidden)
  const enterButton = document.createElement("button");
  enterButton.id = "enterButton";
  enterButton.textContent = "Play";
  enterButton.style.display = "none"; // Hide initially
  preloader.appendChild(enterButton);

  // Show the Play button after a short delay and remove Loading text
  setTimeout(() => {
    loadingText.style.display = "none";
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

      // backgroundMusic
      //   .play()
      //   .then(() => {
      //     isMusicPlaying = true;
      //     const musicButton = document.querySelector(".musicButton");
      //     updateMusicButtonUI(musicButton);
      //   })
      //   .catch((err) => {
      //     console.warn("Autoplay blocked:", err);
      //     isMusicPlaying = false;
      //   });

      // isSoundEnabled = true;
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
    this.stageContainer.style.backgroundImage = `url(${
      StageBGImages[stageNumber - 1]
    })`;

    // Update full image preview for the selected stage
    this.fullImageHere.forEach((img) => {
      img.src = FullImages[stageNumber - 1];
    });

    const stageImages = this.stages[stageNumber - 1];

    this.stageLabel.textContent = `STAGES - ${stageNumber}`;

    // Hide the main page and show the stage container with the play notice
    this.mainPage.classList.add("fade-out");
    this.playNotice.style.display = "flex"; // Show play notice
    this.stINQ.textContent = `STAGE - ${stageNumber}`;
    setTimeout(() => {
      this.mainPage.style.display = "none";
      this.stageContainer.style.display = "block";
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

  // --- DESKTOP SUPPORT ---
  images.forEach((img) => {
    img.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", img.id);
      img.style.opacity = "0.4";
      playSound(pickSound);
    });

    img.addEventListener("dragend", () => {
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
        playSound(dropSound);
      }
    });
  });

  // --- MOBILE TOUCH SUPPORT WITH VISUAL DRAGGING ---
  let touchImg = null;
  let floatingImg = null;

  images.forEach((img) => {
    img.addEventListener("touchstart", (e) => {
      e.preventDefault();
      touchImg = img;

      // Clone image for visual feedback
      floatingImg = img.cloneNode(true);
      floatingImg.style.position = "fixed";
      floatingImg.style.pointerEvents = "none";
      floatingImg.style.opacity = "0.7";
      floatingImg.style.zIndex = "9999";
      floatingImg.classList.add("floating-drag-img");

      document.body.appendChild(floatingImg);

      const touch = e.touches[0];
      floatingImg.style.left = touch.clientX + "px";
      floatingImg.style.top = touch.clientY + "px";

      playSound(pickSound);
    });
  });

  boxes.forEach((box) => {
    box.addEventListener("touchmove", (e) => {
      if (!touchImg || !floatingImg) return;

      const touch = e.touches[0];
      floatingImg.style.left = touch.clientX + "px";
      floatingImg.style.top = touch.clientY + "px";

      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      boxes.forEach((b) => b.classList.remove("highlight-drop"));
      if (el && el.classList.contains("boxImg") && el.children.length === 0) {
        el.classList.add("highlight-drop");
      }

      e.preventDefault(); // Prevent scroll
    });

    box.addEventListener("touchend", (e) => {
      if (!touchImg || !floatingImg) return;

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

      boxes.forEach((b) => b.classList.remove("highlight-drop"));

      document.body.removeChild(floatingImg);
      floatingImg = null;
      touchImg = null;
    });
  });

  // Cleanup on global touchend (in case of drop outside box)
  document.addEventListener("touchend", () => {
    if (floatingImg) {
      document.body.removeChild(floatingImg);
      floatingImg = null;
    }
    touchImg = null;
    boxes.forEach((b) => b.classList.remove("highlight-drop"));
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

  {
    1: "Stages/PuzzleSet6/1.jpeg",
    2: "Stages/PuzzleSet6/2.jpeg",
    3: "Stages/PuzzleSet6/3.jpeg",
    4: "Stages/PuzzleSet6/4.jpeg",
    5: "Stages/PuzzleSet6/5.jpeg",
    6: "Stages/PuzzleSet6/6.jpeg",
    7: "Stages/PuzzleSet6/7.jpeg",
    8: "Stages/PuzzleSet6/8.jpeg",
    9: "Stages/PuzzleSet6/9.jpeg",
    10: "Stages/PuzzleSet6/10.jpeg",
    11: "Stages/PuzzleSet6/11.jpeg",
    12: "Stages/PuzzleSet6/12.jpeg",
    13: "Stages/PuzzleSet6/13.jpeg",
    14: "Stages/PuzzleSet6/14.jpeg",
    15: "Stages/PuzzleSet6/15.jpeg",
    16: "Stages/PuzzleSet6/16.jpeg",
  },

  {
    1: "Stages/PuzzleSet7/1.jpeg",
    2: "Stages/PuzzleSet7/2.jpeg",
    3: "Stages/PuzzleSet7/3.jpeg",
    4: "Stages/PuzzleSet7/4.jpeg",
    5: "Stages/PuzzleSet7/5.jpeg",
    6: "Stages/PuzzleSet7/6.jpeg",
    7: "Stages/PuzzleSet7/7.jpeg",
    8: "Stages/PuzzleSet7/8.jpeg",
    9: "Stages/PuzzleSet7/9.jpeg",
    10: "Stages/PuzzleSet7/10.jpeg",
    11: "Stages/PuzzleSet7/11.jpeg",
    12: "Stages/PuzzleSet7/12.jpeg",
    13: "Stages/PuzzleSet7/13.jpeg",
    14: "Stages/PuzzleSet7/14.jpeg",
    15: "Stages/PuzzleSet7/15.jpeg",
    16: "Stages/PuzzleSet7/16.jpeg",
    17: "Stages/PuzzleSet7/17.jpeg",
    18: "Stages/PuzzleSet7/18.jpeg",
    19: "Stages/PuzzleSet7/19.jpeg",
    20: "Stages/PuzzleSet7/20.jpeg",
    21: "Stages/PuzzleSet7/21.jpeg",
    22: "Stages/PuzzleSet7/22.jpeg",
    23: "Stages/PuzzleSet7/23.jpeg",
    24: "Stages/PuzzleSet7/24.jpeg",
    25: "Stages/PuzzleSet7/25.jpeg",
  },

  {
    1: "Stages/PuzzleSet8/1.jpeg",
    2: "Stages/PuzzleSet8/2.jpeg",
    3: "Stages/PuzzleSet8/3.jpeg",
    4: "Stages/PuzzleSet8/4.jpeg",
    5: "Stages/PuzzleSet8/5.jpeg",
    6: "Stages/PuzzleSet8/6.jpeg",
    7: "Stages/PuzzleSet8/7.jpeg",
    8: "Stages/PuzzleSet8/8.jpeg",
    9: "Stages/PuzzleSet8/9.jpeg",
    10: "Stages/PuzzleSet8/10.jpeg",
    11: "Stages/PuzzleSet8/11.jpeg",
    12: "Stages/PuzzleSet8/12.jpeg",
    13: "Stages/PuzzleSet8/13.jpeg",
    14: "Stages/PuzzleSet8/14.jpeg",
    15: "Stages/PuzzleSet8/15.jpeg",
    16: "Stages/PuzzleSet8/16.jpeg",
    17: "Stages/PuzzleSet8/17.jpeg",
    18: "Stages/PuzzleSet8/18.jpeg",
    19: "Stages/PuzzleSet8/19.jpeg",
    20: "Stages/PuzzleSet8/20.jpeg",
    21: "Stages/PuzzleSet8/21.jpeg",
    22: "Stages/PuzzleSet8/22.jpeg",
    23: "Stages/PuzzleSet8/23.jpeg",
    24: "Stages/PuzzleSet8/24.jpeg",
    25: "Stages/PuzzleSet8/25.jpeg",
  },

  {
    1: "Stages/PuzzleSet9/1.jpeg",
    2: "Stages/PuzzleSet9/2.jpeg",
    3: "Stages/PuzzleSet9/3.jpeg",
    4: "Stages/PuzzleSet9/4.jpeg",
    5: "Stages/PuzzleSet9/5.jpeg",
    6: "Stages/PuzzleSet9/6.jpeg",
    7: "Stages/PuzzleSet9/7.jpeg",
    8: "Stages/PuzzleSet9/8.jpeg",
    9: "Stages/PuzzleSet9/9.jpeg",
    10: "Stages/PuzzleSet9/10.jpeg",
    11: "Stages/PuzzleSet9/11.jpeg",
    12: "Stages/PuzzleSet9/12.jpeg",
    13: "Stages/PuzzleSet9/13.jpeg",
    14: "Stages/PuzzleSet9/14.jpeg",
    15: "Stages/PuzzleSet9/15.jpeg",
    16: "Stages/PuzzleSet9/16.jpeg",
    17: "Stages/PuzzleSet9/17.jpeg",
    18: "Stages/PuzzleSet9/18.jpeg",
    19: "Stages/PuzzleSet9/19.jpeg",
    20: "Stages/PuzzleSet9/20.jpeg",
    21: "Stages/PuzzleSet9/21.jpeg",
    22: "Stages/PuzzleSet9/22.jpeg",
    23: "Stages/PuzzleSet9/23.jpeg",
    24: "Stages/PuzzleSet9/24.jpeg",
    25: "Stages/PuzzleSet9/25.jpeg",
  },

  {
    1: "Stages/PuzzleSet10/1.jpeg",
    2: "Stages/PuzzleSet10/2.jpeg",
    3: "Stages/PuzzleSet10/3.jpeg",
    4: "Stages/PuzzleSet10/4.jpeg",
    5: "Stages/PuzzleSet10/5.jpeg",
    6: "Stages/PuzzleSet10/6.jpeg",
    7: "Stages/PuzzleSet10/7.jpeg",
    8: "Stages/PuzzleSet10/8.jpeg",
    9: "Stages/PuzzleSet10/9.jpeg",
    10: "Stages/PuzzleSet10/10.jpeg",
    11: "Stages/PuzzleSet10/11.jpeg",
    12: "Stages/PuzzleSet10/12.jpeg",
    13: "Stages/PuzzleSet10/13.jpeg",
    14: "Stages/PuzzleSet10/14.jpeg",
    15: "Stages/PuzzleSet10/15.jpeg",
    16: "Stages/PuzzleSet10/16.jpeg",
    17: "Stages/PuzzleSet10/17.jpeg",
    18: "Stages/PuzzleSet10/18.jpeg",
    19: "Stages/PuzzleSet10/19.jpeg",
    20: "Stages/PuzzleSet10/20.jpeg",
    21: "Stages/PuzzleSet10/21.jpeg",
    22: "Stages/PuzzleSet10/22.jpeg",
    23: "Stages/PuzzleSet10/23.jpeg",
    24: "Stages/PuzzleSet10/24.jpeg",
    25: "Stages/PuzzleSet10/25.jpeg",
  },
  // repeat more stages as needed
];

const FullImages = [
  "Assets/Img/Stages/PuzzleSet1/fullImage.png",
  "Assets/Img/Stages/PuzzleSet2/fullImage.png",
  "Assets/Img/Stages/PuzzleSet3/fullImage.png",
  "Assets/Img/Stages/PuzzleSet4/fullImage.png",
  "Assets/Img/Stages/PuzzleSet5/fullImage.png",
  "Assets/Img/Stages/PuzzleSet6/fullImage.jpeg",
  "Assets/Img/Stages/PuzzleSet7/fullImage.jpeg",
  "Assets/Img/Stages/PuzzleSet8/fullImage.jpeg",
  "Assets/Img/Stages/PuzzleSet9/fullImage.jpeg",
  "Assets/Img/Stages/PuzzleSet10/fullImage.jpeg",
];

const StageBGImages = [
  `https://i.pinimg.com/736x/80/27/c6/8027c6c615900bf009b322294b61fcb2.jpg`,
  `https://i.pinimg.com/736x/a5/3c/59/a53c59346cd25f1cb3b1f3d177972815.jpg`,
  `https://i.pinimg.com/736x/82/5a/8b/825a8b332cd24f3d4695b22887ba49d6.jpg`,
  `https://i.pinimg.com/736x/cb/38/c2/cb38c2061d676926ba0cae7fd727e161.jpg`,
  `https://i.pinimg.com/736x/e2/39/09/e23909efedbb8db827b676d00e9393a7.jpg`,
  `https://i.pinimg.com/736x/52/ea/15/52ea151ca15da4415e30547d3b745aab.jpg`,
  `https://i.pinimg.com/736x/39/10/0c/39100c809e8e390b117feb268bb3c0fa.jpg`,
  `https://i.pinimg.com/736x/b2/39/38/b23938911980848ff8a0863d76adc18d.jpg`,
  `https://i.pinimg.com/736x/4a/bd/c1/4abdc1f3e1e8f68e2a87c3cb7744bd38.jpg`,
   `https://i.pinimg.com/736x/1e/42/be/1e42beccb7cc14b10feb87dfe7beb5e8.jpg`,
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
  const cards = Array.from(document.querySelectorAll(".card"));
  const openCards = cards.filter((card) => card.classList.contains("open"));

  const currentIndex = openCards.findIndex(
    (card) => parseInt(card.dataset.numberAccess, 10) === game.currentStage
  );

  const nextIndex = currentIndex + num;

  if (nextIndex >= 0 && nextIndex < openCards.length) {
    const nextCard = openCards[nextIndex];
    game.loadStage(nextCard);
    document.querySelector(".DORPIMG").innerHTML = "";
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
