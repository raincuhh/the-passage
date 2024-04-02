function getID(id) {
  return document.getElementById(id);
}
/**
 * main
 * handles general things, like initiating the different objects
 * and their methods
 */
let Main = {
  version: VERSION,
  beta: true,
  autoSaveDelay: 60000,
  init: function () {
    Main.ready = true;

    this.createNavbar(); // makes navbar
    this.createView(); // makes view
    SM.init(); // starts the statemanager
    Pings.init(); // starts the pings
    this.setDefaultPrefs(); // sets game default prefs
    this.loadGame(); // loads if there is anything to load, should update defaultprefs

    // not fixed
    if (SM.get("game.new")) {
      SM.set("game.lang", "EN");
      console.log("set loc to " + SM.get("game.lang"));
    }
    // autosave check
    if (SM.get("prefs.autosave")) {
      console.log("autosave is on");
      setInterval(() => {
        this.saveGame();
      }, this.autoSaveDelay);
    } else {
      console.log("autosave is off");
      Pings.ping(
        "autosave is off, remember to save your progress manually through settings, or turn on autosave"
      );
    }
    // fullscreen check can only be done with user gesture ig..
    // il get back to it when i got a event module ready
    // to gesture fs if option is there
    /*
    if (SM.get("prefs.fullScreen")) {
      let elem = getID("root");
      if (!document.fullscreenElement) {
        // Enter fullscreen mode
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        }
      } else {
        // Exit fullscreen mode
        if (document.exitFullscreen) {
          document.exitFullscreen(); // Corrected typo here
        }
      }
    }
    */

    World.init(); // starts world
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
  createNavbar: function () {
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
    let root = getID("root");
    root.appendChild(navbar);
    let navbarLinks = document.createElement("div");
    navbarLinks.id = "navbarLinks";
    navbar.appendChild(navbarLinks);
    // makes a link for each of the navbarInfo[indexes]
    navbarInfo.forEach((e) => {
      let link = createLinks(e.id, e.text);
      navbarLinks.appendChild(link);
    });

    let navbarLinkGithub = document.getElementById("navbarGithub");
    navbarLinkGithub.addEventListener("click", () => {
      window.open("https://github.com/raincuhh");
    });
    let navbarlinkPortfolio = document.getElementById("navbarPortfolio");
    navbarlinkPortfolio.addEventListener("click", () => {
      window.open("https://raincuhh.github.io/portfolio/");
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
  },
  createView: function () {
    let view = document.createElement("div");
    view.id = "view";
    let container = document.getElementById("container");
    container.appendChild(view);
  },
  error: function () {
    console.log("error");
  },
  setDefaultPrefs: function () {
    // sets first time default prefs, will get overrided on this.loadGame()
    SM.setMany({
      prefs: {
        autosave: true, // if you wanna have game autosave every 60s
        fullScreen: true, // fullscreen.. yes or no
        exitWarning: false, // warns on exit, cause it can cause bugs maybe
        light: false, // darkmode or lightmode
        showBackupWarning: false, // shows "backup save" ping
      },
    });
  },
  saveNotif: function () {
    let saveDiv = getID("saved");
    saveDiv.textContent = "saved";
    tl = gsap.timeline();
    tl.to(saveDiv, {
      duration: 0,
      opacity: 1,
    });
    tl.to(saveDiv, {
      duration: 1,
      opacity: 0,
    });
  },
  saveGame: function () {
    try {
      let string = JSON.stringify(SM.components);
      localStorage.setItem("save", string);
      this.saveNotif();
    } catch (error) {
      console.error("error occured: ", error);
      alert("tried to save, attempt failed, view error in console");
    }
  },
  loadGame: function () {
    let string = localStorage.getItem("save");
    if (string) {
      try {
        let save = JSON.parse(string);
        SM.components = save;
        console.log("save loaded");
        this.saveGame();
      } catch (error) {
        console.error("error occured: ", error);
        alert("tried to load save, attempt failed, view error in console");
      }
    } else {
      console.log("no save found");
    }
  },
  deleteGame: function (reload) {
    localStorage.clear();
    this.saveGame();
    if (reload) {
      location.reload();
    }
  },
  export: function () {
    this.saveGame();
    let string = this.gen64();
    // gives export in console.log if game isnt loading // bruteforce
    console.log("copy save: " + string);
    return string;
  },
  gen64: function () {
    let save = StateManager.components;
    save = JSON.stringify(save);
    save = btoa(save);
    return save;
  },
  import: function () {
    let importDiv = getID("view");
    let string = importDiv.textContent;
    try {
      let save = atob(string);
      save = JSON.parse(save);
      localStorage.setItem("save", save);
      this.saveGame(); // saves the new 'save'
      this.loadGame(); // then loads it to SM.components
      console.log("save imported");
    } catch (error) {
      console.error(error);
      alert("error: please try re-importing");
    }
  },
};

/**
 * world
 */

let World = {
  init: function () {},
};

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
 * handles all ping(s) related methods. messaging, pinging, deleting.
 */
let Pings = {
  init: function () {
    // making wrapper
    let elem = document.createElement("div");
    elem.id = "pings";
    let container = getID("container");
    container.insertBefore(elem, container.firstChild);
  },
  ping: function (text) {
    // the check
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
    Pings.send(text);
  },
  send: function (e) {
    // outputs the finalized message to the pings(parent)node
    let ping = document.createElement("div");
    ping.className = "ping";
    ping.textContent = e;
    let pings = getID("pings");
    pings.insertBefore(ping, pings.firstChild);
    Pings.delete();
  },
  delete: function () {
    // checking if there are any overflowing ping(s) to delete, cause memoryleak
    let pings = getID("pings");
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
 * handles ui + nodeEvents, pathEvents, randomEvents,
 */

/**
 * button object
 *
 * example new button
 * new Button.customButton({
 *  id: string,
 *  text: placeholder,
 *  click: function,
 *  width: num,
 * })
 */
let Button = {
  custom: function (param) {
    let el = document.createElement("div");
    el.setAttribute(
      "id",
      typeof param.id !== "undefined" ? param.id : "BTN_" + Main.createGuid()
    );
    el.className = "button";
    el.textContent = typeof param.text !== "undefined" ? param.text : "button";
    // el.classList.toggle("disabled", typeof param.cd !== "undefined");
    if (typeof param.click === "function") {
      if (!el.classList.contains("disabled")) {
        el.addEventListener("click", function (event) {
          param.click(event);
        });
      }
    }
    return el;
  },
  disabled: function (btn, param) {
    // i will do later
  },
  onCooldown: function (btn, cd) {},
};

/**
 * sm
 * handles most if not all values ingame; sets and gets values.
 * also used for saving and loading the game state.
 * components object gets saved then loaded onload
 * link(s):
 * https://playcode.io/javascript/object,
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
 *
 */
let StateManager = {
  maxValue: 99999999,
  components: {},
  init: function () {
    this.set("ver", Main.version);

    let categories = [
      "features", // locations, etc.
      "game", // more specific stuff. candles in purgatory lit, etc.
      "entities", // generated enemies will be instantiated inside the entities category
      "character", // pathfinders, boons, flaws, perks, health, stats and such.
      "inventory", // inventory handling,
      "prefs", // preferences on stuff like exitWarning, lightmode, autosave, etc.
      "meta", // meta-progression
      "cooldown", // cooldown on different situations handling
    ];
    // checks through iterating over values, and creates a category if category undefined
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
    // checks for nesteds
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
  getMany: function (stateNames) {
    let values = {};
    for (let stateName of stateNames) {
      values[stateName] = this.get(stateName);
    }
    return values;
  },
  // sets a single state value
  set: function (stateName, value) {
    if (typeof value === "number" && value > this.maxValue) {
      value = this.maxValue;
    }
    let currentState = this.components;
    // regular expression to check for ".", "[", "]", """, and ', then removes if match
    const parts = stateName.split(/[.\[\]'"]+/);
    for (let i = 0; i < parts.length - 1; i++) {
      if (!currentState.hasOwnProperty(parts[i])) {
        currentState[parts[i]] = {};
      }
      currentState = currentState[parts[i]];
    }
    currentState[parts[parts.length - 1]] = value;

    Main.saveGame();
  },
  // sets multiple values if needed. for example setting prefs
  setMany: function (listObjects) {
    for (let stateName in listObjects) {
      let value = listObjects[stateName];
      if (typeof value === "number" && value > this.maxValue) {
        value = this.maxValue;
      }
      this.set(stateName, value);
    }
  },

  // just updates the gamesave if needed during an "update"
  /*
  update: function () {
    let vers = Main.version;

    if (vers == 1.1) {
      console.log("version 1.1");
    }
  },
  */
  // boon refers to both positive and negatives unless explicitly said,
  // though i might change this to a boons and flaws system to specify between them
  addBoon: function (char, boon) {
    SM.set("character." + char + "." + boon, true);
  },
  removeBoon: function (char, boon) {
    SM.set("character." + char + "." + boon, false);
  },
};

/**
 * syntax
 * get("object"),
 * getMany(["object.object.value", "object.value", "object"]),
 * set("candlesLit", value),
 * setMany(
 *  {object: {example: value, example: value}
 *  {object2: {example2: value, example2: value}
 * )
 *
 * categories: features, game, character, inventory, prefs, meta
 */
let SM = StateManager;

/**
 * onload
 */

window.onload = function () {
  if (!Main.ready) {
    let root = document.getElementById("root");
    if (!root || !root.parentElement) {
      Main.error();
    } else {
      console.log(
        "[=== " + "Hello, myself here, dont change the save will you ʕ•ᴥ•ʔ",
        ", the game has loaded." + " ===]"
      );
      Main.init();
    }
  }
};

/**
 * Notes
 *
 * rememeber using this vid as baseline for saving and loading with localstorage:
 * https://www.youtube.com/watch?v=ePHfRUIvbbg
 *
 * note to self, modulate shit cuh
 * https://medium.com/@crohacz_86666/basics-of-modular-javascript-2395c82dd93a
 * remember thisshit
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
