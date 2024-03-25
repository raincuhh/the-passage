/**
 * views
 */

/**
 * desolus (Starter planet)
 */

let Desolus = {};

/**
 * ping stuff
 */

let Pings = {
  init: function () {
    //making the pingWrapper
    let elem = document.createElement("div");
    elem.id = "pings";

    let container = document.getElementById("container");
    container.appendChild(elem);
  },
  ping: function (text) {
    if (typeof text == "undefined") {
      return;
    }
    if (text.slice(-1) != ".") {
      text += ".";
    }
    //checks if firstchar is upper or lower, if lower, change it to upper
    let firstChar = text.charAt(0);
    if (firstChar !== firstChar.toUpperCase()) {
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }
    Pings.message(text);
  },
  message: function (e) {
    let ping = document.createElement("div");
    ping.className = "ping";
    ping.textContent = e;
    let pings = document.getElementById("pings");
    pings.appendChild(ping);
  },
};

/**
 * event stuff
 */

/**
 * Notes
 *
 * rememeber using this vid as baseline for saving and loading with localstorage:
 * https://www.youtube.com/watch?v=ePHfRUIvbbg
 *
 * in Game.Init > if (firstlaunch)
 * sets firstlaunch to false if firstlaunch,
 * this can be done after introsequence so that if u refresh;
 * while still in introsequence then it is still firstlaunch
 * make exploration locked until you get your first colonized planet, planets give resources
 */

/**
 * game stuff
 */

let Game = {
  launch: function () {
    let currentVersion = document.getElementById("versionNumber");
    //currentVersion.innerHTML = "v " + VERSION;
    Game.version = VERSION;
    Game.beta = 1;
    Game.lang = localStorage.getItem("spaceExplorerLang");
    Game.prefs = {}; //default preferences
    Game.defaultPrefs = function () {
      Game.prefs.autoSave = 1; //every min or so
      Game.prefs.fullScreen = 0; //makes game fullscreen
    };
    Game.defaultPrefs();
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
    //Game.VersionPatchNotes();

    Game.ready = 0;
  },

  init: function () {
    Game.ready = 1;

    function makeNavbar() {
      let createLinks = function (id, text) {
        let link = document.createElement("span");
        link.id = id;
        link.className = "link";
        link.textContent = text;
        return link;
      };

      let navbarInfo = [
        { id: "navbarGithub", text: "github." },
        { id: "navbarPortfolio", text: "portfolio." },
        { id: "navbarAchievements", text: "achievements." },
        { id: "navbarSettings", text: "settings." },
      ];

      let navbar = document.createElement("div");
      navbar.id = "navbar";

      let root = document.getElementById("root");
      root.appendChild(navbar);

      let navbarLinks = document.createElement("div");
      navbarLinks.id = "navbarLinks";
      navbar.appendChild(navbarLinks);

      //makes a link for each of the navbarInfo[indexes]
      navbarInfo.forEach((e) => {
        let link = createLinks(e.id, e.text);
        navbarLinks.appendChild(link);
      });

      let navbarLinkGithub = document.getElementById("navbarGithub");
      navbarLinkGithub.addEventListener("click", () => {
        window.location = "https://github.com/raincuhh";
      });
      let navbarlinkPortfolio = document.getElementById("navbarPortfolio");
      navbarlinkPortfolio.addEventListener("click", () => {
        window.location = "https://raincuhh.github.io/portfolio/";
      });
      let navbarlinkAchievement = document.getElementById("navbarAchievements");
      navbarlinkAchievement.addEventListener("click", () => {
        console.log("achievements");
      });
      let navbarlinkSettings = document.getElementById("navbarSettings");
      navbarlinkSettings.addEventListener("click", () => {
        console.log("settings");
      });
    }
    makeNavbar();

    Pings.init();

    let firstLaunch = JSON.parse(localStorage.getItem("firstLaunch"));
    if (firstLaunch) {
      Game.intro();
      //localStorage.setItem("firstLaunch", JSON.stringify(false));
      //console.log(JSON.parse(localStorage.getItem("firstLaunch")));
    }
  },

  intro: function () {
    Pings.ping("wake up.");
  },
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

/**
 * onload stuff
 */

window.onload = function () {
  if (!Game.ready) {
    let checkForFirstLaunch = function () {
      let first = localStorage.getItem("firstLaunch");

      if (first === null) {
        // if firstlaunch === null then set firstlaunch to true, if opposite then parse the firstlaunch from localstorage, and then return result
        localStorage.setItem("firstLaunch", JSON.stringify(true));
        return true;
      } else {
        //console.log(JSON.parse(first));
        return JSON.parse(first);
      }
    };
    let firstLaunch = checkForFirstLaunch();
    //let firstLaunch = localStorage.setItem("firstLaunch", JSON.stringify(true)); //debug stuff
    let launch = function () {
      Game.launch();
      let root = document.getElementById("root");
      if (!root || !root.parentElement) {
        console.log("error");
      } else {
        console.log(
          "[=== Hello, myself here, dont cheat in any resources will you. ʕ•ᴥ•ʔ",
          "The game has sucessfully loaded. ===]"
        );
        Game.init();

        if (firstLaunch) {
          Game.lang = localStorage.setItem("spaceExplorerLang", "EN");
        }
      }
    };
    launch();
  }
};
