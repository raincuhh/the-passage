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
    this.createNavbar(); // makes navbar and its settings/achievements
    this.createSaved(); // making the saved div
    this.createView(); // makes view
    this.loadGame(); // gets and loads localstorage save
    Pings.init(); // starts the pings
    SM.init(); // starts the statemanager

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
    const root = getID("root");
    root.appendChild(navbar);

    let navbarLinks = createEl("div");
    navbarLinks.id = "navbarLinks";
    navbar.appendChild(navbarLinks);
    // makes a link for each of the navbarInfo[indexes]
    navbarInfo.forEach((e) => {
      let link = createLinks(e.id, e.text);
      navbarLinks.appendChild(link);
    });

    const navbarLinkGithub = getID("navbarGithub");
    navbarLinkGithub.addEventListener("click", () => {
      window.open("https://github.com/raincuhh");
    });
    const navbarlinkPortfolio = getID("navbarPortfolio");
    navbarlinkPortfolio.addEventListener("click", () => {
      window.open("https://raincuhh.github.io/portfolio/");
    });
    const navbarlinkAchievement = getID("navbarAchievements");
    navbarlinkAchievement.addEventListener("click", () => {
      console.log("achievements");
    });
    const navbarlinkSettings = getID("navbarSettings");
    let open = false;
    navbarlinkSettings.addEventListener("click", () => {
      const settings = getID("settings");
      if (!open) {
        settings.style.display = "block";
        open = true;
      } else {
        settings.style.display = "none";
        open = false;
      }
    });

    function createSettings() {
      let settings = createEl("div");
      settings.setAttribute("id", "settings");

      const main = getID("main");
      main.insertAdjacentElement("afterend", settings);
    }
    createSettings();
    function createAchievements() {
      let achievements = createEl("div");
      achievements.setAttribute("id", "achievements");

      const main = getID("main");
      main.insertAdjacentElement("afterend", achievements);
    }
    createAchievements();
  },
  createView: function () {
    let view = createEl("div");
    view.id = "view";
    const container = getID("container");
    container.appendChild(view);
  },
  error: function () {
    console.log("error");
  },
  createSaved: function () {
    let elem = createEl("div");
    elem.setAttribute("id", "saved");
    elem.textContent = "saved";
    const main = getID("main");
    main.insertBefore(elem, main.firstChild);
  },
  saveNotif: function () {
    const saveDiv = getID("saved");
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
    /*
    if (reload){
      location.reload()
    }
    */
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
    const importDiv = getID("changethiswhenyoumaketheimportDiv");
    let string = importDiv.textContent;
    try {
      let save = atob(string);
      save = JSON.parse(save);
      localStorage.setItem("save", save);
      this.saveGame(); // saves the new 'save'
      console.log("save imported");
      this.loadGame(); // then loads it to SM.components
      console.log("loaded complete");
    } catch (error) {
      console.error(error);
      alert("error: please try re-importing");
    }
  },
};

/**
 * handles starting runs and resetting runs
 */

let Journey = {
  init: function () {
    Run.init();
  },
};

let Run = {
  activeLocation: null,
  init: function () {
    PathfinderSelection.init();
    if (PathfinderSelection.finished) {
      metaProgression.init();
    }
    if (metaProgression.finished) {
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
    this.makeView();

    Run.activeLocation = "PathfinderSelection";
    this.launch();
  },
  launch: function () {
    this.setDocumentTitle();
  },
  makeView: function () {
    // make elem
    let pathfinderView = createEl("div");
    pathfinderView.setAttribute("id", "pathfinderView");
    // append to view
    const view = getID("view");
    view.appendChild(pathfinderView);
    // make pathfinderList
    let pathfinderList = createEl("div");
    pathfinderList.setAttribute("id", "pathfinderList");
    pathfinderView.appendChild(pathfinderList);
    // make pathfinder container
    let pathfinders = createEl("div");
    pathfinders.setAttribute("id", "pathfinders");
    pathfinderList.appendChild(pathfinders);
    // make each pathfinder by iterating over pathfinder list
    function makePathfinder(id, name, unlocked) {
      let elem = createEl("span");
      elem.setAttribute("id", id);
      elem.setAttribute("class", "pathfinder");
      elem.addEventListener("click", changeContent());

      let isUnlocked = unlocked();
      if (!isUnlocked) {
        elem.classList.add("locked");
      }
      let nameC = createEl("div");
      nameC.setAttribute("class", "name");
      nameC.textContent = name;
      elem.appendChild(nameC);

      return elem;
    }
    function changeContent() {}
    function checkLockedAndPlaceLast() {
      const pathfindersC = getID("pathfinders");
      let pathfinders = pathfindersC.getElementsByClassName("pathfinder");
      let unlockedPathfinders = [];
      let lockedPathfinders = [];

      for (let i = 0; i < pathfinders.length; i++) {
        let currentPathfinder = pathfinders[i];
        if (currentPathfinder.classList.contains("locked")) {
          lockedPathfinders.push(currentPathfinder);
        } else {
          unlockedPathfinders.push(currentPathfinder);
        }
      }
      pathfindersC.innerHTML = "";
      unlockedPathfinders.forEach((pathfinder) => {
        pathfindersC.appendChild(pathfinder);
      });
      lockedPathfinders.forEach((pathfinder) => {
        pathfindersC.appendChild(pathfinder);
      });
    }
    pathFinders.forEach((e) => {
      let pathfinder = makePathfinder(e.id, e.name, e.unlocked);
      pathfinders.appendChild(pathfinder);
    });
    checkLockedAndPlaceLast();

    function makePathfinderContent() {
      let pathfinderContent = createEl("div");
      pathfinderContent.setAttribute("id", "pathfinderContent");
      pathfinderView.appendChild(pathfinderContent);

      function header() {
        let pathfinderHeader = createEl("header");
        pathfinderHeader.setAttribute("id", "pathfinderHeader");
        pathfinderContent.appendChild(pathfinderHeader);

        let pathfinderTitle = createEl("span");
        pathfinderTitle.setAttribute("id", "pathfinderTitle");
        pathfinderTitle.textContent = "The Pugilist";
        pathfinderHeader.appendChild(pathfinderTitle);

        let pathfinderClassC = createEl("span");
        pathfinderClassC.setAttribute("id", "pathfinderClassC");
        pathfinderHeader.appendChild(pathfinderClassC);

        let pathfinderClassText = createEl("span");
        pathfinderClassText.setAttribute("id", "pathfinderClassText");

        let pathfinderClassIcon = createEl("img");
        pathfinderClassIcon;
      }
      function pathfinderPosPreview() {
        // making pathfinder info
        let posLayout = createEl("div");
        posLayout.setAttribute("id", "pathfinderPosLayout");
        pathfinderContent.appendChild(posLayout);

        // making the layout container
        let layoutContainer = createEl("div");
        layoutContainer.setAttribute("class", "layoutContainer");
        posLayout.appendChild(layoutContainer);

        // making the recommended and target positions
        let recPosC = createEl("div");
        recPosC.setAttribute("id", "recPosC");
        layoutContainer.appendChild(recPosC);
        // making the text
        let recPosTitle = createEl("span");
        recPosTitle.setAttribute("class", "recPosTitle");
        recPosTitle.textContent = "rcmd";
        recPosC.appendChild(recPosTitle);

        let reccTileNum = 1;
        for (let i = 0; i < 4; i++) {
          let reccTile = createEl("span");
          reccTile.setAttribute("id", "reccTile_" + reccTileNum++);
          reccTile.setAttribute("class", "reccTile");
          reccTile.textContent = "#";
          recPosC.appendChild(reccTile);
        }

        let targetC = createEl("div");
        targetC.setAttribute("id", "targetPosC");
        layoutContainer.appendChild(targetC);

        let targetPosTitle = createEl("span");
        targetPosTitle.setAttribute("class", "targetPosTitle");
        targetPosTitle.textContent = "target";
        targetC.appendChild(targetPosTitle);

        let targetTileNum = 1;
        for (let i = 0; i < 4; i++) {
          let targetTile = createEl("span");
          targetTile.setAttribute("id", "targetTile_" + targetTileNum++);
          targetTile.setAttribute("class", "targetTile");
          targetTile.textContent = "#";
          targetC.appendChild(targetTile);
        }
      }

      header(); // title and customName
      pathfinderPosPreview(); // recommended and target layout preview
    }
    makePathfinderContent();
  },
  setDocumentTitle: function () {
    if (Run.activeLocation == "PathfinderSelection") {
      document.title = "choose your pathfinders";
    }
  },
  createPathfinders: function () {
    for (let pathfinder in this.selectedPathfinders) {
      if (!SM.get(pathfinder)) {
        SM.set("character. " + pathfinder);
        console.log("creating pathfinder: " + pathfinder + " in character cat");
        this.createTraits(pathfinder);
      }
    }
  },
  createTraits: function (pathfinder) {
    for (let i = 0; i < 4; i++) {
      let trait = Traits[random(Traits.length) + 1];
      if (trait.condition()) {
        SM.addTrait(pathfinder, trait.name);
      }
    }
  },
};

/**
 * shrine of abyss / metaprogression
 */
let metaProgression = {
  init: function () {
    Run.activeLocation = "metaProgression";
  },
  launch: function () {
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    if (Run.activeLocation == "metaProgression") {
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
 * pathfinder are the selectable characters you can choose 4 of
 * before the start of the game
 */
let pathFinders = [
  {
    name: "The Pugilist",
    id: "thePugilist",
    icon: "img/thePugilist.png",
    unlocked: function () {
      return true;
    },
    class: "light",
    description: "fists",
  },
  {
    name: "The Faceless",
    id: "theFaceless",
    icon: "img/theFaceless.png",
    unlocked: function () {
      return true;
    },
    class: "light",
    description: "daggers",
  },
  {
    name: "The Blatherer",
    id: "theBlatherer",
    icon: "img/theBlatherer.png",
    unlocked: function () {
      return true;
    },
    class: "heavy",
    description: "greatsword",
  },
  {
    name: "The Occultist",
    id: "theOccultist",
    icon: "img/theOccultist.png",
    unlocked: function () {
      return false;
    },
    class: "light",

    description: "sickles",
  },
  {
    name: "The Knight",
    id: "theKnight",
    icon: "img/theKnight.png",
    unlocked: function () {
      return true;
    },
    class: "medium",
    description: "sword",
  },
  {
    name: "The Paragon",
    id: "theParagon",
    icon: "img/theParagon.png",
    unlocked: function () {
      return false;
    },
    class: "heavy",
    description: "shield",
  },
];

/**
 * traits are small boosts or decreases in power that each pathfinder has 4 of,
 * each pathfinder will get 2 positive and 2 negative boons that have a small
 * effect on gameplay and the character, your character will display the
 */
let Traits = [
  // positives
  {
    name: "lucky",
    desc: "bask in luck's glow, for blessings' overflow.",
    condition: function () {
      return Run.activeLocation == "PathfinderSelection";
    },
    // you have a slightly higher chance of getting good pathEvents or nodeEvents
  },
  {
    name: "hoarder",
    desc: "you somehow find ways to carry more",
    condition: function () {
      return Run.activeLocation == "PathfinderSelection";
    },
    // increases inventory space by a small amount
  },
  {
    name: "individualist",
    desc: "doing things alone yields greater experience",
    condition: function () {
      return Run.activeLocation == "PathfinderSelection";
    },
  },
  // start of negatives
  {
    name: "restless",
    desc: "you find it harder to rest properly",
    condition: function () {
      return Run.activeLocation == "PathfinderSelection";
    },
    // you will heal slightly less with potions
  },
  {
    name: "blighted",
    desc: "fortune frowns, your luck goes down",
    condition: function () {
      return Run.activeLocation == "PathfinderSelection";
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
    const container = getID("container");
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
    const pings = getID("pings");
    pings.insertBefore(ping, pings.firstChild);
    Pings.delete();
  },
  delete: function () {
    // checking if there are any overflowing ping(s) to delete, cause memoryleak
    const pings = getID("pings");
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
  clear: function () {
    const pings = getID("pings");
    let pingList = pings.getElementsByClassName("ping");

    let pingListArray = Array.from(pingList);
    pingListArray.forEach((e) => {
      pings.removeChild(e);
    });
  },
};

/**
 * event object
 * handles ui + nodeEvents, pathEvents, randomEvents,
 */

let Events = {
  eventList: [],
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

    const main = getID("main");
    main.appendChild(elem);
  },
};

/**
 * button object
 *
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

    const view = getID("view");
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
  // gets multiple state values if needed
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
    // regExp to check for ".", "[", "]", ", and '.
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
  // trait refers to both positive and negative ones
  addTrait: function (char, trait) {
    this.set("character." + char + "." + "traits." + trait, true);
    // zzzz
    const matchedTrait = Traits.find((e) => e.name === trait);
    if (matchedTrait) {
      Pings.ping(matchedTrait.desc);
    } else {
      console.error("Trait not found:", trait);
    }
  },
  removeTrait: function (char, trait) {
    this.set("character." + char + "." + "traits" + "." + trait, false);
  },
  getTrait: function (char, trait) {
    try {
      return this.get("character." + char + "." + "traits" + "." + trait);
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
    const root = getID("root");
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
