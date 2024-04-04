// just shortens process
function getID(id) {
  return document.getElementById(id);
}
function createEl(elem) {
  return document.createElement(elem);
}
function random(thing) {
  return Math.floor(Math.random() * thing);
}
/**
 * main
 * handles general things, like initiating the different objects
 * and their methods
 */
let Main = {
  version: 1.0,
  beta: true,

  init: function () {
    Main.ready = true;
    this.createNavbar(); // makes navbar
    this.createSaved(); // making the saved div
    this.createView(); // makes view
    this.loadGame(); // load, should update defaultprefs
    Pings.init(); // starts the pings
    SM.init(); // starts the statemanager

    this.createSettings(); // makes the settings
    this.createAchievements(); // makes the achievements

    Journey.init();
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
      let link = createEl("span");
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

    let navbar = createEl("div");
    navbar.id = "navbar";
    let root = getID("root");
    root.appendChild(navbar);

    let navbarLinks = createEl("div");
    navbarLinks.id = "navbarLinks";
    navbar.appendChild(navbarLinks);
    // makes a link for each of the navbarInfo[indexes]
    navbarInfo.forEach((e) => {
      let link = createLinks(e.id, e.text);
      navbarLinks.appendChild(link);
    });

    let navbarLinkGithub = getID("navbarGithub");
    navbarLinkGithub.addEventListener("click", () => {
      window.open("https://github.com/raincuhh");
    });
    let navbarlinkPortfolio = getID("navbarPortfolio");
    navbarlinkPortfolio.addEventListener("click", () => {
      window.open("https://raincuhh.github.io/portfolio/");
    });
    let navbarlinkAchievement = getID("navbarAchievements");
    navbarlinkAchievement.addEventListener("click", () => {
      console.log("achievements");
    });
    let navbarlinkSettings = getID("navbarSettings");
    let open = false;
    navbarlinkSettings.addEventListener("click", () => {
      let settings = getID("settings");
      if (!open) {
        settings.style.display = "block";
        open = true;
      } else {
        settings.style.display = "none";
        open = false;
      }
    });
  },
  createSettings: function () {
    let settings = createEl("div");
    settings.setAttribute("id", "settings");

    let main = getID("main");
    main.insertAdjacentElement("afterend", settings);
  },
  createAchievements: function () {
    let achievements = createEl("div");
    achievements.setAttribute("id", "achievements");

    let main = getID("main");
    main.insertAdjacentElement("afterend", achievements);
  },
  createView: function () {
    let view = createEl("div");
    view.id = "view";
    let container = getID("container");
    container.appendChild(view);
  },
  error: function () {
    console.log("error");
  },
  createSaved: function () {
    let elem = createEl("div");
    elem.setAttribute("id", "saved");
    elem.textContent = "saved";
    let main = getID("main");
    main.insertBefore(elem, main.firstChild);
  },
  saveNotif: function () {
    let saveDiv = getID("saved");
    tl = gsap.timeline();
    tl.to(saveDiv, {
      duration: 0,
      opacity: 1,
    });
    tl.to(saveDiv, {
      duration: 1.5,
      opacity: 0,
    });
  },
  saveGame: function () {
    try {
      let string = JSON.stringify(SM.components);
      //console.log(string);
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
        console.log(save);
        SM.components = save;
        // SM.components = { ...SM.components, ...save };
        //console.log("save loaded");
      } catch (error) {
        console.error("error occured: ", error);
        alert("tried to load save, attempt failed, view error in console");
      }
    } else {
      console.log("no save found");
    }
  },
  deleteGame: function (/*reload*/) {
    // overkill but its sometimes buggy and doesnt delete gamestate
    SM.components = {};
    localStorage.setItem("save", {});
    localStorage.clear();
    location.reload();
  },
  export: function () {
    this.saveGame();
    let string = this.gen64();
    // gives export in console.log if game isnt loading / bruteforce
    console.log(
      "[=== " +
        "this is you savefile, copy it to transfer to other devices" +
        " ===]"
    );
    console.log(string);
    return string;
  },
  gen64: function () {
    let save = SM.components;
    save = JSON.stringify(save);
    save = btoa(save);
    return save;
  },
  import: function () {
    let importDiv = getID("changethiswhenyoumaketheimportDiv");
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
 *
 */

let Journey = {
  init: function () {
    Run.init(); // starting the selection
  },
};

let Run = {
  currentLocation: null,
  init: function () {
    PathfinderSelection.init();
    if (PathfinderSelection.finished) {
      metaProgression.init();
    }
  },

  reset: function () {},
};
/**
 * picks pathfinders
 */
let PathfinderSelection = {
  finished: false,
  selectedPathfinders: [],

  init: function () {
    if (SM.get("features.locations.pathfinderSelection") == undefined) {
      SM.set("features.locations.pathfinderSelection", true);
    }

    // making the screen
    let elem = createEl("div");
    elem.setAttribute("id", "pathfinderSelection");
    let view = getID("view");
    view.appendChild(elem);

    Run.currentLocation = "PathfinderSelection";
    this.launch();
  },
  launch: function () {
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    if (Run.currentLocation == "PathfinderSelection") {
      document.title = "select your pathfinders";
    }
  },
  createPathfinders: function () {
    for (let pathfinder in this.selectedPathfinders) {
      if (!SM.get(pathfinder)) {
        SM.set("character. " + pathfinder);
        console.log("creating pathfinder: " + pathfinder + " in character cat");
        this.createPathfinderBoons(pathfinder);
      }
    }
  },
  createPathfinderBoons: function (pathfinder) {
    for (let i = 0; i < 4; i++) {
      let boon = Boons[random(Boons.length) + 1];
      if (boon.condition()) {
        SM.addBoon(pathfinder, boon.name);
      }
    }
  },
};

/**
 * shrine of abyss / metaprogression
 */
let metaProgression = {
  init: function () {
    Run.currentLocation = "metaProgression";
  },
  launch: function () {
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    if (Run.currentLocation == "metaProgression") {
      document.title = "Shrine of the Abyss";
    }
  },
};

/*
let Header = {
  init: function () {
    let elem = createEl("div");
    elem.id = "header";

    let mainView = document.getElementById("mainView");
    mainView.appendChild(elem);
  },
  addAct: function (containerId, nameId, text, innerWrapperId) {
    //creates current actContainer (outside)
    let actContainer = createEl("div");
    actContainer.id = containerId;
    actContainer.className = "actContainer";
    //appends actContainer to header
    let header = document.getElementById("header");
    header.appendChild(actContainer);
    //creates actName and appends to actContainer (name)
    let actName = createEl("span");
    actName.id = nameId;
    actName.className = "actTitle";
    actName.textContent = text;
    actContainer.appendChild(actName);
    //creates actInnerWrapper (beside actName) and appends to actContainer
    let actInnerWrapper = createEl("div");
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
    let chapter = createEl("span");
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
 * player
 */
let pathFinders = [
  {
    name: "The Pugilist",
  },
  {
    name: "The Faceless",
  },
  {
    name: "The Blatherer",
  },
  {
    name: "The Occultist",
  },
  {
    name: "The Knight",
  },
  {
    name: "The Sovereign",
  },
  {
    name: "The Paragon",
  },
];

/**
 * boons are small boosts or decreases in power that each pathfinder has 4 of,
 * each pathfinder will get 2 positive and 2 negative boons that have a small
 * effect on gameplay and the character, your character will display the
 */
let Boons = [
  // positives
  {
    name: "lucky",
    desc: "bask in luck's glow, for blessings' overflow.",
    condition: function () {
      return Run.currentLocation == "PathfinderSelection";
    },
    // you have a higher chance of getting good pathEvents or nodeEvents
  },
  {
    name: "hoarder",
    desc: "you somehow find ways to carry more",
    condition: function () {
      return Run.currentLocation == "PathfinderSelection";
    },
    // increases inventory space by a small amount
  },
  {
    name: "individualist",
    desc: "doing things alone yields greater experience",
    condition: function () {
      return Run.currentLocation == "PathfinderSelection";
    },
  },
  // start of negatives
  {
    name: "restless",
    desc: "you find it harder to rest properly",
    condition: function () {
      return Run.currentLocation == "PathfinderSelection";
    },
    // you will heal slightly less with potions
  },
  {
    name: "blighted",
    desc: "fortune frowns, your luck goes down",
    condition: function () {
      return Run.currentLocation == "PathfinderSelection";
    },
    // you have a higher chance of getting bad pathEvents or nodeEvents
  },
];

/**
 * pings object
 * handles all ping(s) related methods. messaging, pinging, deleting.
 */
let Pings = {
  init: function () {
    let elem = createEl("div");
    elem.id = "pings";
    let container = getID("container");
    container.insertBefore(elem, container.firstChild);
  },
  ping: function (text) {
    if (typeof text == "undefined") {
      return; // if no text then dont do stuff
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
    let ping = createEl("div");
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

let Events = {
  eventStack: [],
  init: function () {},

  newEvent: function (param /*event*/) {
    let elem = createEl("event");
    elem.setAttribute(
      "id",
      typeof param.id !== "undefined" ? param.id : "EVENT_" + Main.createGuid()
    );
    elem.className = "event";
    // eventtype
    let eventType;
    if (typeof param.type !== "undefined") eventType = param.type;
    console.log(eventType);

    let main = getID("main");
    main.appendChild(elem);
  },
};

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
    let elem = createEl("div");
    elem.setAttribute(
      "id",
      typeof param.id !== "undefined" ? param.id : "BTN_" + Main.createGuid()
    );
    elem.className = "button";
    elem.textContent =
      typeof param.text !== "undefined" ? param.text : "button";
    // el.classList.toggle("disabled", typeof param.cd !== "undefined");
    if (typeof param.click === "function") {
      if (!elem.classList.contains("disabled")) {
        elem.addEventListener("click", function (event) {
          param.click(event);
        });
      }
    }

    let view = getID("view");
    view.appendChild(elem);
    return elem;
  },
  disabled: function (btn, param) {
    // i will do later
  },
  onCooldown: function (btn, cd) {},
};

/**
 * handles most if not all values ingame; sets and gets values.
 * also used for saving and loading the game state,
 * components object gets saved then loaded.
 * get("object"),
 * getMany(["object.object.value", "object.value", "object"]),
 * set("candlesLit", value),
 * setMany(
 *  {object: {example: value, example: value}
 *  {object2: {example2: value, example2: value}
 * )
 * categories: features, game, character, inventory, prefs, meta
 */
let SM = {
  maxValue: 99999999,
  autoSaveDelay: 60000,
  components: {},
  init: function () {
    this.set("ver", Main.version);
    let categories = [
      "features", // locations, etc.
      "game", // more specific stuff. candles in purgatory lit, etc.
      "entities", // generated enemies will be instantiated inside the entities category
      "character", // pathfinders, boons, flaws, perks, health, stats and such.
      "inventory", // inventory handling,
      "prefs", // gamepreferences, stuff like exitWarning, lightmode, autosave, etc.
      "meta", // meta-progression
      "cooldown", // cooldown on different situations handling
    ];
    // checks through iterating over values, and creates a category if category undefined
    for (let category of categories) {
      if (!this.get(category)) {
        this.set(category, {});
        console.log("category: " + category + " initialized");
      }
    }
    this.updatePrefs();
  },
  // gets a single value
  get: function (stateName) {
    let currentState = this.components;
    const parts = stateName.split(/[.\[\]'"]+/);
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
    // regExp to check for ".", "[", "]", """, and ', then removes if match
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
      this.set(stateName, value);
    }
  },
  delete: function (stateName) {
    let currentState = this.components;
    const parts = stateName.split(/[.\[\]'"]+/);
    for (let i = 0; i < parts.length - 1; i++) {
      if (currentState && currentState.hasOwnProperty(parts[i])) {
        currentState = currentState[parts[i]];
      } else {
        console.log("state not found");
        return;
      }
    }
    if (currentState && currentState.hasOwnProperty(parts[parts.length - 1])) {
      delete currentState[parts[parts.length - 1]];
      console.log("state deleted");
    } else {
      console.log("state not found");
    }
    Main.saveGame();
  },
  updatePrefs: function () {
    // autosave check
    if (this.get("prefs.autosave")) {
      //console.log("autosave is on");
      setInterval(() => {
        Main.saveGame();
      }, this.autoSaveDelay);
    } else {
      //console.log("autosave is off");
      Pings.ping(
        "autosave is off, remember to save your progress manually through settings, or turn on autosave"
      );
    }
  },
  // boon refers to both positive and negative ones
  addBoon: function (char, boon) {
    this.set("character." + char + "." + "boons." + boon, true);
    Pings.ping(Boons.find((boon) => boon.name === boonName).desc);
  },
  removeBoon: function (char, boon) {
    this.set("character." + char + "." + "boons" + "." + boon, false);
  },
  getBoon: function (char, boon) {
    try {
      return this.get("character." + char + "." + "boons" + "." + boon);
    } catch (error) {
      console.error(error);
    }
  },
};

/**
 * onload
 */

window.onload = function () {
  if (!Main.ready) {
    let root = getID("root");
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
 * the encounter system has a kind of pokemon/darkestdungeon(turnbased) esque battlesystem.
 * take inspo from roguelineage permadeath.
 *
 * // first time in purgatory text, for later
 * Pings.ping(
 * "you find yourself in a dimly lit chamber, disoriented and unsure of where you are"
 * );
 * Pings.ping(
 * "shadows cling to the walls like specters, and the faint flicker of candles offers little solace in this unfamiliar enviornment"
 * );
 *
 * source(s):
 * https://playcode.io/javascript/object,
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
 *
 */
