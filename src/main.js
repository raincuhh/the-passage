// rmemeber using this vid as baseline for saving
// and loading with localstorage https://www.youtube.com/watch?v=ePHfRUIvbbg

/*=====================================================================================
Game Functions
========================================================================================*/
let Game = {};

Game.Ready = 0;

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
          console.log("lang chosen is: " + lang);
          langBox.style.display = "none";
          break;
        case "langNorwegian":
          localStorage.setItem("spaceExplorerLang", buttonLanguageId);
          lang = localStorage.getItem("spaceExplorerLang");
          console.log("lang chosen is: " + lang);
          langBox.style.display = "none";
          break;
        case "langSwedish":
          localStorage.setItem("spaceExplorerLang", buttonLanguageId);
          lang = localStorage.getItem("spaceExplorerLang");
          console.log("lang chosen is: " + lang);
          langBox.style.display = "none";

          break;
        default:
          console.log("unknown id chosen");
      }
    });
  });
};
Game.Launch = function () {
  // just stuff
  Game.VersionPatchNotes = function () {
    console.log(
      "patchnotes V 1.001: ",
      "fixing initial firstlaunch stuff",
      "languagechoosing"
    );
  };
  Game.VersionPatchNotes();
};

Game.Init = function () {
  //console.log("initialized game");
  let firstLaunch = JSON.parse(localStorage.getItem("firstLaunch"));
  Game.ShipName;
  if (firstLaunch) {
    Game.startIntroSequence = function () {
      console.log("starting intro sequence");
    };
    Game.startIntroSequence();
    Game.shipName = Game.createRandomizedShipName();

    localStorage.setItem("firstLaunch", JSON.stringify(false));

    console.log("ship name is: " + Game.shipName);
  }
  console.log(firstLaunch);
};

Game.createRandomizedShipName = function () {
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

  let firstNamesIndex = Math.floor(Math.random() * firstNames.length);
  let lastNamesIndex = Math.floor(Math.random() * lastNames.length);

  let shipName = firstNames[firstNamesIndex] + " " + lastNames[lastNamesIndex];
  localStorage.setItem("shipName", shipName);
  return shipName;
};

/*=====================================================================================
start game
=======================================================================================*/

window.onload = function () {
  //lang = localStorage.getItem("spaceExplorerLang");
  //console.log("lang chosen is: " + lang);
  if (!Game.Ready) {
    // fetching localstorage to check if first time launching game
    let checkIfFirstLaunch = function () {
      let firstLaunch = localStorage.getItem("firstLaunch");
      if (firstLaunch === null) {
        // if firstlaunch === null then set firstlaunch to true, if opposite then true, and then return result
        localStorage.setItem("firstLaunch", JSON.stringify(true));
        return true;
      } else {
        return JSON.parse(firstLaunch);
      }
    };
    let firstLaunch = checkIfFirstLaunch();
    //let firstLaunch = true; //debug stuff
    console.log(firstLaunch);
    if (firstLaunch) {
      Game.showLangChoices();
      Game.Init();
      //console.log("first launch");
    } else {
      var launchingGame = function () {
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
        }
      };
      launchingGame();
    }
  }
};
