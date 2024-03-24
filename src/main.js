let topbarFunctions = function () {
  let refreshB = document.getElementById("refreshB");
  refreshB.addEventListener("click", () => {
    window.location.reload();
  });
  let topbarSettings = document.getElementById("topbarSettings");
  let settingsB = topbarSettings.querySelector("#settingsB");
  topbarSettings.addEventListener("click", (e) => {
    if (e.target == settingsB) {
      Game.showSettings();
    }
  });
  let settingsIcon = topbarSettings.querySelector("#settingsIcon");
  topbarSettings.addEventListener("mouseover", () => {
    if (settingsIcon.classList.contains("bx-cog")) {
      settingsIcon.classList.remove("bx-cog");
      settingsIcon.classList.add("bxs-cog");
    }
  });
  topbarSettings.addEventListener("mouseleave", () => {
    if (settingsIcon.classList.contains("bxs-cog")) {
      settingsIcon.classList.remove("bxs-cog");
      settingsIcon.classList.add("bx-cog");
    }
  });
};
topbarFunctions();

// future notes
//
// rememeber using this vid as baseline for saving and loading with localstorage:
// https://www.youtube.com/watch?v=ePHfRUIvbbg
//
// make exploration locked until you get your first colonized planet, planets give resources

/*=====================================================================================
Game Functions
========================================================================================*/
let Game = {};

Game.showSettings = function () {
  console.log("settings");
};

Game.showLangChoices = function () {
  let langBox = document.getElementById("langBox");
  langBox.style.display = "flex";
  //console.log("choose your language");
  let langButtons = document.querySelectorAll(".langButton");
  // makes a eventlistener on click and changes localstorage lang
  // for future use if i got time
  langButtons.forEach(function (e) {
    e.addEventListener("click", () => {
      buttonLanguageId = e.id;

      switch (buttonLanguageId) {
        case "langEnglish":
          localStorage.setItem("spaceExplorerLang", buttonLanguageId);
          lang = localStorage.getItem("spaceExplorerLang");
          langBox.style.display = "none";
          break;
        case "langNorwegian":
          localStorage.setItem("spaceExplorerLang", buttonLanguageId);
          lang = localStorage.getItem("spaceExplorerLang");
          langBox.style.display = "none";
          break;
        case "langSwedish":
          localStorage.setItem("spaceExplorerLang", buttonLanguageId);
          lang = localStorage.getItem("spaceExplorerLang");
          langBox.style.display = "none";
          break;
        default:
          localStorage.setItem("spaceExplorerLang", "langEnglish");
          console.log("unknown lang chosen, ", "set EN as default");
      }
    });
  });
};

Game.Launch = function () {
  let currentVersion = document.getElementById("versionNumber");
  currentVersion.innerHTML = "V " + VERSION;
  Game.Version = VERSION;
  //console.log("V: " + Game.Version);

  /*=====================================================================================
  patchnotes
  =======================================================================================*/

  Game.VersionPatchNotes = function () {
    console.log(
      "patchnotes V 1.001: ",
      "fixing initial first launch stuff,",
      "languagechoosing,",
      "",
      "patchnotes V 1.002: ",
      ""
    );
  };
  Game.VersionPatchNotes();

  Game.ready = 0;
};

Game.Init = function () {
  Game.ready = 1;
  // stuff to initialize
  let firstLaunch = JSON.parse(localStorage.getItem("firstLaunch"));
  console.log("firstlaunch check at init :" + firstLaunch);
  if (firstLaunch) {
    //sets firstlaunch to false if firstlaunch,
    //this can be done after introsequence so that if u refresh;
    //while still in introsequence then it is still firstlaunch
    localStorage.setItem("firstLaunch", JSON.stringify(false));
    console.log(JSON.parse(localStorage.getItem("firstLaunch")));
    Game.StartIntroSequence();
    //console.log("ship name is: " + Game.shipName);
  }

  Game.lang = localStorage.getItem("spaceExplorerLang");
  Game.config = [];
  Game.defaultConfig = function () {
    Game.config.autosave = 1; //every min or so
    Game.config.textShadow = 1; //just removes textshadow
    Game.config.fullScreen = 0; //makes game fullscreen
  };
  Game.defaultConfig();

  Game.randomizedShipName = function () {
    let firstNames = [
      "Stellar",
      "Cosmo",
      "Galactic",
      "Celestial",
      "Nebula",
      "Astrum",
      "Astro",
      "Lunar",
      "Orbital",
      "Interstellar",
      "Solar",
      "Vortex",
      "Infinity",
      "Quasar",
      "Cosmic",
      "Supernova",
      "Starlight",
      "Ultraviolet",
      "Spectra",
      "Constellation",
      "Deep Space",
      "Radiant",
      "Eclipse",
      "Comet",
      "Milky Way",
      "Gravity",
      "Nucleus",
      "Orion",
      "Aurora",
    ];
    let lastNames = [
      "Explorer",
      "Voyager",
      "Pioneer",
      "Navigator",
      "Adventurer",
      "Pathfinder",
      "Discoverer",
      "Traveller",
      "Wayfarer",
      "Odyssey",
      "Nomad",
      "Wanderer",
      "Seeker",
      "Journeyman",
      "Roamer",
      "Dreamer",
      "Astrolabe",
      "Quest",
      "Galaxy",
      "Fleet",
      "Starship",
      "Cosmos",
      "Cosmonaut",
      "Astrolander",
      "Spacefarer",
      "Skywalker",
      "Starborn",
      "Stargazer",
      "Skyward",
    ];
    // chooses a random index number from both of the arrays, then makes shipname array[randomindex]
    let firstNamesIndex = Math.floor(Math.random() * firstNames.length);
    let lastNamesIndex = Math.floor(Math.random() * lastNames.length);

    let shipName =
      firstNames[firstNamesIndex] + " " + lastNames[lastNamesIndex];
    //localStorage.setItem("shipName", shipName);
    return shipName;
  };
};
Game.StartIntroSequence = function () {
  console.log("starting intro sequence");
};

/*=====================================================================================
onload
=======================================================================================*/

window.onload = function () {
  //lang = localStorage.getItem("spaceExplorerLang");
  //console.log("lang chosen is: " + lang);
  if (!Game.ready) {
    // checking localstorage to check if first time launching game
    let checkForFirstLaunch = function () {
      let first = localStorage.getItem("firstLaunch");
      console.log("firstlaunch check at cFFL: " + first);
      if (first === null) {
        // if firstlaunch === null then set firstlaunch to true, if opposite then parse the firstlaunch from localstorage, and then return result
        localStorage.setItem("firstLaunch", JSON.stringify(true));
        return true;
      } else {
        console.log(JSON.parse(first));
        return JSON.parse(first);
      }
    };
    let firstLaunch = checkForFirstLaunch();
    //let firstLaunch = localStorage.setItem("firstLaunch", JSON.stringify(true)); //debug stuff
    console.log(
      "firstlaunch check at onload:" +
        JSON.parse(localStorage.getItem("firstLaunch"))
    );
    let launch = function () {
      Game.Launch();
      let root = document.getElementById("root");
      if (!root || !root.parentElement) {
        console.log("error");
      } else {
        console.log(
          "[=== Hello, myself here, dont cheat in any resources will you. ʕ•ᴥ•ʔ",
          "The game has sucessfully loaded. ===]"
        );
        Game.Init();
        if (firstLaunch) {
          Game.showLangChoices();
        }
      }
    };
    launch();
  }
};
