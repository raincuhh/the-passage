/*
let Header = {
  init: function () {
    let elem = document.createElement("div");
    elem.id = "header";

    let mainView = document.getElementById("mainView");
    mainView.appendChild(elem);
  },
  addAct: function (containerId, nameId, text, innerWrapperId) {
    //creates current actContainer (outside)
    let actContainer = document.createElement("div");
    actContainer.id = containerId;
    actContainer.className = "actContainer";
    //appends actContainer to header
    let header = document.getElementById("header");
    header.appendChild(actContainer);
    //creates actName and appends to actContainer (name)
    let actName = document.createElement("span");
    actName.id = nameId;
    actName.className = "actTitle";
    actName.textContent = text;
    actContainer.appendChild(actName);
    //creates actInnerWrapper (beside actName) and appends to actContainer
    let actInnerWrapper = document.createElement("div");
    actInnerWrapper.id = innerWrapperId;
    actInnerWrapper.className = "actInnerWrapper";
    actContainer.appendChild(actInnerWrapper);
  },
  canTravel: function (actInnerWrapperId) {
    //checks if a actWrapper has more then one chapters, if so, lets your travel. (returns true)
    let actWrapper = document.getElementById(actInnerWrapperId);
    let chapters = actWrapper.getElementsByClassName("chapter");
    return chapters.length > 1;
  },

  createChapter: function (text, id, actInnerWrapperId) {
    //reminder: add location back to function param after testing

    //creates chapter
    let chapter = document.createElement("span");
    chapter.className = "chapter";
    chapter.id = id;
    chapter.textContent = text;
    chapter.addEventListener("click", () => {
      if (canTravel(actInnerWrapperId)) {
        console.log("traveling");
        //Main.changeView(location);
      } else {
        console.log("chapters in currentAct not over 1");
      }
    });
    let actWrapper = document.getElementById(actInnerWrapperId);
    actWrapper.appendChild(chapter);
  },
};
*/

/**
 * pings object
 * handles all ping(s) related functions. messaging, pinging, deleting.
 */
let Pings = {
  init: function () {
    //making the pingsParent/wrapper
    let elem = document.createElement("div");
    elem.id = "pings";

    let container = document.getElementById("container");
    container.appendChild(elem);
  },
  ping: function (text) {
    // takes the string/(text) and makes it go through a few checks
    if (typeof text == "undefined") {
      return;
    }
    if (text.slice(-1) != ".") {
      text += ".";
    }
    let firstChar = text.charAt(0);
    if (firstChar !== firstChar.toUpperCase()) {
      text = text.charAt(0).toUpperCase() + text.slice(1);
    }
    Pings.message(text);
  },
  message: function (e) {
    // outputs the finalized message to the pings(parent)node
    let ping = document.createElement("div");
    ping.className = "ping";
    ping.textContent = e;
    let pings = document.getElementById("pings");
    pings.insertBefore(ping, pings.firstChild);
    Pings.delete();
  },
  delete: function () {
    // checking if there are any overflowing ping(s) to delete
    // cause it can cause memoryleak if there arent any methods of removing overflowing pings
    let pings = document.getElementById("pings");
    let viewportHeight = window.innerHeight;
    let pingList = pings.getElementsByClassName("ping");

    for (let i = 0; i < pingList.length; i++) {
      let ping = pingList[i];
      let pingRect = ping.getBoundingClientRect();

      if (pingRect.bottom < 0 || pingRect.top > viewportHeight) {
        pings.removeChild(ping);
      }
    }
  },
};

/**
 * event object
 * handles events, randomevents, battles, comment
 */

let Events = {};

/**
 * Purgatory object - location
 * handles resetting run if player dies, ??? gives snarky remark regarding how your run went.
 */

let Purgatory = {
  init: function () {},

  setTitle: function () {},
};

/**
 * button object
 * handles the creation of buttons catoring to different situations
 *
 * example new button
 * new Button.button({
 *  id: string,
 *  text: placeholder,
 *  click: function,
 *  width: num,
 * })
 */

let Button = {
  button: function (param) {
    let el = document.createElement("div");
    el.setAttribute(
      "id",
      typeof param.id !== "undefined" ? param.id : "BTN_" + Main.createGuid()
    );
    el.className = "button";
    el.textContent = typeof param.text !== "undefined" ? param.text : "button";

    //el.classList.toggle("disabled", typeof param.cd !== "undefined");

    if (typeof param.click === "function") {
      if (!el.classList.contains("disabled")) {
        el.addEventListener("click", function (event) {
          param.click(event);
        });
      }
    }
    return el;
  },
  setCd: function (btn, cd) {},

  disabled: function () {},
};

/**
 * stateManager
 * handles most if not all values ingame; sets and gets values.
 *
 * link(s):
 * https://playcode.io/javascript/object (great source)
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
 *
 * syntax examples
 * get("object"),
 * getMultiple(["object.object", "object", "object"]),
 * set("candlesLit", value),
 * setMultiple({object: {example: num, example: boolean}})
 *
 */

let StateManager = {
  maxValue: 99999999,
  components: {},
  init: function () {
    let categories = [
      "features", //locations, unlocked locations, characters etc.
      "game", // more specific stuff. candles in purgatory lit, etc.
      "character", // boons, flaws, perks, health, etc, different characters
      "inventory", // inventory handling,
      "prefs", // preferences on stuff like exitWarning, lightmode, autosave, etc.
      "meta", //metaProgression
    ];

    for (let category of categories) {
      if (!this.get(category)) {
        this.set(category, {});
      }
    }
  },
  // gets a single value
  get: function (stateName) {
    let currentState = this.components;
    const parts = stateName.split(".");
    // splits stateName called if it has nested properties
    for (let thing of parts) {
      if (currentState && currentState.hasOwnProperty(thing)) {
        currentState = currentState[thing];
      } else {
        currentState = undefined;
        break;
      }
    }
    return currentState;
  },
  // gets multiple values if needed
  getMultiple: function (stateNames) {
    let values = {};
    for (let stateName of stateNames) {
      values[stateName] = this.get(stateName);
    }
    return values;
  },
  // sets a single state value
  set: function (stateName, value) {
    if (typeof value === "number" && value > StateManager.maxValue) {
      value = StateManager.maxValue;
    }
    //this.components[stateName] = value;
    let currentState = this.components;
    const parts = stateName.split(".");
    for (let i = 0; i < parts.length - 1; i++) {
      if (!currentState.hasOwnProperty(parts[i])) {
        currentState[parts[i]] = {};
      }
      currentState = currentState[parts[i]];
    }
    currentState[parts[parts.length - 1]] = value;
  },
  // sets multiple values if needed. fexample getting prefs and stuff.
  setMultiple: function (valuesObject) {
    for (let stateName in valuesObject) {
      let value = valuesObject[stateName];
      if (typeof value === "number" && value > StateManager.maxValue) {
        value = StateManager.maxValue;
      }
      this.set(stateName, value);
    }
  },
};
let SM = StateManager;

/**
 * game component, handles the creation of the different ui,
 */

let Main = {
  version: VERSION,
  beta: true,

  launch: function () {
    let currentVersion = document.getElementById("versionNumber");
    currentVersion.innerHTML = "v" + this.version;
    Main.prefs = {}; //default preferences
    Main.defaultPrefs = function () {
      Main.prefs.autoSave = 1; //every min or so
      Main.prefs.fullScreen = 0; //makes game fullscreen
      Main.prefs.exitWarning = 1; //warns before unload
      Main.prefs.lightSwitch = 1; //1 = darkmode, 0 = lightmode, default = 1.
    };
    Main.defaultPrefs();

    window.BeforeUnloadEvent = function (event) {
      if (Main.prefs && Main.prefs.exitWarning) {
        event.returnValue = "are you sure you want to leave?";
      }
    };
    Main.ready = 0;
  },

  init: function () {
    Main.ready = 1;

    // navbar
    function initNavbar() {
      let createLinks = function (id, text) {
        let link = document.createElement("span");
        link.setAttribute("id", id);
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
        let settings = document.getElementById("settings");
        gsap.to(settings, {
          duration: 0.5,
          translateY: 1,
        });
      });
    }
    // mainview
    let initMainView = function () {
      let view = document.createElement("div");
      view.id = "view";
      let container = document.getElementById("container");
      container.appendChild(view);
    };

    initNavbar(); // initiates navbar and its links
    StateManager.init(); // initiates statemanager
    Pings.init(); // initiates pings container and utilities
    initMainView(); // initiates mainview
  },

  createGuid: function () {
    var pattern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    var result = "";
    for (var i = 0; i < pattern.length; i++) {
      var c = pattern[i];
      if (c === "x" || c === "y") {
        var r = Math.floor(Math.random() * 16);
        var v = c === "x" ? r : (r & 0x3) | 0x8;
        result += v.toString(16);
      } else {
        result += c;
      }
    }
    return result;
  },

  error: function () {
    console.log("error");
  },
};

/* legacy language changing system
Main.showLangChoices = function () {
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
*/

/**
 * onload stuff
 */

window.onload = function () {
  if (!Main.ready) {
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
      Main.launch();
      let root = document.getElementById("root");
      if (!root || !root.parentElement) {
        Main.error();
      } else {
        console.log(
          "[=== Hello, myself here, dont cheat in any resources will you. ʕ•ᴥ•ʔ",
          "The game has sucessfully loaded. ===]"
        );
        Main.init();

        if (firstLaunch) {
          Main.lang = localStorage.setItem("gameLang", "EN");
          console.log("set loc to " + localStorage.getItem("gameLang"));
        }
      }
    };
    launch();
  }
};

/**
 * Notes
 *
 * rememeber using this vid as baseline for saving and loading with localstorage:
 * https://www.youtube.com/watch?v=ePHfRUIvbbg
 *
 * modulate/component(isize) stuff
 * https://medium.com/@crohacz_86666/basics-of-modular-javascript-2395c82dd93a
 * remember thisshit
 *
 *
 * the encounter system has a kind of pokemon(turnbased) esque battlesystem.
 * take inspo from roguelineage permadeath.
 *
 * Pings.ping(
 * "you find yourself in a dimly lit chamber, disoriented and unsure of where you are"
 * );
 * Pings.ping(
 * "shadows cling to the walls like specters, and the faint flicker of candles offers little solace in this unfamiliar enviornment"
 * );
 */
