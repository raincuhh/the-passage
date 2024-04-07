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

    Run.init();
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
      { id: "navbarDelete", text: "delete." },
      { id: "navbarLoad", text: "load." },
      { id: "navbarSave", text: "save." },

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

    const navbarDelete = getID("navbarDelete");
    navbarDelete.addEventListener("click", () => {
      Main.deleteGame();
    });
    const navbarLoad = getID("navbarLoad");
    navbarLoad.addEventListener("click", () => {
      Main.loadGame();
    });
    const navbarSave = getID("navbarSave");
    navbarSave.addEventListener("click", () => {
      Main.saveGame();
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
    elem.style.opacity = 0;
    elem.textContent = "saved";
    const main = getID("main");
    main.insertBefore(elem, main.firstChild);
  },
  saveNotif: function () {
    const saveDiv = getID("saved");
    saveDiv.style.opacity = 1;

    setTimeout(function () {
      console.log("making opacity 0");
      saveDiv.style.transition = "opacity 1.5s";
      saveDiv.style.opacity = 0;
    }, 10);
  },
  saveGame: function () {
    try {
      console.log("statemanager states ========================0");
      console.log(SM.components);
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
    this.saveGame();
    localStorage.removeItem("save");
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

let Run = {
  init: function () {
    Journey.init();
  },
};

let Journey = {
  activeStage: null,
  init: function () {
    invocationOfSin.init();
    if (PathfinderSelection.finished) {
      metaProgression.init();
    }
    if (metaProgression.finished) {
    }
  },

  reset: function () {},
};
let invocationOfSin = {
  init: function () {
    /*
    if (SM.get("features.locations.invocationOfSin") == undefined) {
      SM.set("features.locations.invocationOfSin", true);
    }
    */

    this.makeView();
    Journey.activeStage = "invocationOfSin";
    this.launch();
  },
  launch: function () {
    this.setDocumentTitle();
  },
  makeView: function () {},
  setDocumentTitle: function () {
    if (Journey.activeStage == "invocationOfSin") {
      document.title = "invocation of sin";
    }
  },
};

/**
 * picks pathfinders
 */
let PathfinderSelection = {
  finished: false,
  selectedPathfinders: [],

  init: function () {
    /*
    if (SM.get("features.locations.pathfinderSelection") == undefined) {
      SM.set("features.locations.pathfinderSelection", true);
    }
    */
    // making the screen
    this.makeView();

    Journey.activeStage = "PathfinderSelection";
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
    pathfinderPreview.forEach((e) => {
      let pathfinder = makePathfinderPreview(e.id, e.name, e.unlocked);
      pathfinders.appendChild(pathfinder);
    });
    checkPfList();
    makePathfinderContent();

    function makePathfinderPreview(id, name, unlocked) {
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
    function checkPfList() {
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
    function makePathfinderContent() {
      // pathfinder content
      let pathfinderContent = createEl("div");
      pathfinderContent.setAttribute("id", "pathfinderContent");
      pathfinderView.appendChild(pathfinderContent);
      // header
      let pathfinderHeader = createEl("header");
      pathfinderHeader.setAttribute("id", "pathfinderHeader");
      pathfinderContent.appendChild(pathfinderHeader);
      // title
      let pathfinderTitle = createEl("span");
      pathfinderTitle.setAttribute("id", "pathfinderTitle");
      pathfinderTitle.textContent = "The Pugilist"; // changeable
      pathfinderHeader.appendChild(pathfinderTitle);
      // class
      let pathfinderClassC = createEl("span");
      pathfinderClassC.setAttribute("id", "pathfinderClassC");
      pathfinderHeader.appendChild(pathfinderClassC);
      // class icon
      let pathfinderClassIcon = createEl("img");
      pathfinderClassIcon.setAttribute("id", "pathfinderClassIcon");
      pathfinderClassIcon.src = "img/thePugilist.png"; // changeable
      pathfinderClassC.appendChild(pathfinderClassIcon);
      // class text
      let pathfinderClassText = createEl("span");
      pathfinderClassText.textContent = "fists"; // changeable
      pathfinderClassText.setAttribute("id", "pathfinderClassText");
      pathfinderClassC.appendChild(pathfinderClassText);
      // recommended layout preview
      let pathfinderLayoutPreview = createEl("div");
      pathfinderLayoutPreview.setAttribute("id", "pathfinderLayoutPreview");
      pathfinderContent.appendChild(pathfinderLayoutPreview);
      // container
      let layoutContainer = createEl("div");
      layoutContainer.setAttribute("class", "layoutContainer");
      pathfinderLayoutPreview.appendChild(layoutContainer);
      // layout
      let layout = createEl("div");
      layout.setAttribute("class", "layout");
      layoutContainer.appendChild(layout);
      // layout hr
      let hr = createEl("hr");
      hr.setAttribute("class", "hr");
      layoutContainer.appendChild(hr);
      // recommended
      let recPosC = createEl("div");
      recPosC.setAttribute("id", "recPosC");
      layout.appendChild(recPosC);

      let recTitle = createEl("span");
      recTitle.setAttribute("class", "recTitle");
      recTitle.textContent = "rcmd";
      recPosC.appendChild(recTitle);

      let reccTileNum = 1;
      for (let i = 0; i < 4; i++) {
        let reccTile = createEl("span");
        reccTile.setAttribute("id", "reccTile_" + reccTileNum++);
        reccTile.setAttribute("class", "reccTile");
        reccTile.textContent = "#"; // changeable
        recPosC.appendChild(reccTile);
      }

      let targetC = createEl("div");
      targetC.setAttribute("id", "targetPosC");
      layout.appendChild(targetC);

      let targetTitle = createEl("span");
      targetTitle.setAttribute("class", "targetTitle");
      targetTitle.textContent = "target";
      targetC.appendChild(targetTitle);

      let targetTileNum = 1;
      for (let i = 0; i < 4; i++) {
        let targetTile = createEl("span");
        targetTile.setAttribute("id", "targetTile_" + targetTileNum++);
        targetTile.setAttribute("class", "targetTile");
        targetTile.textContent = "#"; // changeable
        targetC.appendChild(targetTile);
      }
      // info
      // container
      let pathfinderInfo = createEl("div");
      pathfinderInfo.setAttribute("id", "pathfinderInfo");
      pathfinderContent.appendChild(pathfinderInfo);
      // info container
      let infoC = createEl("div");
      infoC.setAttribute("id", "infoC");
      pathfinderInfo.appendChild(infoC);
      // quote
      let quote = createEl("p");
      quote.setAttribute("id", "pathfinderQuote");
      infoC.appendChild(quote);
      // description
      let desc = createEl("p");
      desc.setAttribute("id", "pathfinderDescription");
      infoC.appendChild(desc);
      // skills
      // container
      let pathfinderSkills = createEl("div");
      pathfinderSkills.setAttribute("id", "pathfinderSkills");
      pathfinderContent.appendChild(pathfinderSkills);
      //skills container
      let skillsC = createEl("div");
      skillsC.setAttribute("id", "skillsC");
      pathfinderSkills.appendChild(skillsC);

      /*
        pathfinderPreview.skillsPreview.forEach((skill) => {
          let elem = makeSkillPreview(
            skill.skillId,
            skill.skillName,
            skill.unlocked
          );
          skillsC.appendChild(elem);
        });

        function makeSkillPreview(id, name, unlocked) {
          let elem = createEl("div");
          elem.setAttribute("id", id);

          let skillName = createEl("div");
        }
        */
    }
    function changeContent() {}
  },
  setDocumentTitle: function () {
    if (Journey.activeStage == "PathfinderSelection") {
      Journey.title = "choose your pathfinders";
    }
  },
  finalizeChosenPathfinders: function () {
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
    Journey.activeStage = "metaProgression";
  },
  launch: function () {
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    if (Journey.activeStage == "metaProgression") {
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
 * before the start of the game.
 * im gonna change the unlocked functions
 * to return a SM.get skill and unlocked value later
 */
let pathfinderPreview = [
  {
    name: "The Pugilist",
    id: "thePugilistPreview",
    icon: "img/thePugilist.png",
    class: "light",
    description: "fists",
    unlocked: function () {
      return true;
    },
    skillsPreview: [
      {
        skillName: "Leg Breaker",
        skillId: "lbPreview",
        // 40% chance of disabling enemy for 1 turn
      },
      {
        skillName: "Fire Fist",
        skillId: "ffPreview",
        // hit enemy 1 time with a fire fist
      },
      {
        skillName: "Crushing Uppercut",
        skillId: "cuPreview",
        // hit enemy 1 time with a uppercut,
        // 20% chance of concussion which gives the "confused" buff on target
      },
      {
        skillName: "Burst Combo",
        skillId: "bcPreview",
        // hits enemy 2-5 times, low damage
      },
      {
        skillName: "Meteor Strike",
        skillId: "msPreview",
      },
      {
        skillName: "Demon Assault",
        skillId: "daPreview",
        // hits 3-5 times low-medium damage
      },
    ],
  },
  {
    name: "The Faceless",
    id: "theFacelessPreview",
    icon: "img/theFaceless.png",
    class: "light",
    description: "daggers",
    unlocked: function () {
      return true;
    },
    skillsPreview: [
      {
        skillName: "Blade Flurry",
        skillId: "bfPreview",
        // hits an enemy 3-5 times
      },
      {},
      {
        skillName: "Poison fan",
        skillId: "pfPreview",
        // hits all 4 enemies with kunais', %chance of gaining "Poisoned"
      },
      {
        skillName: "Vanishing Strike",
        skillId: "vsPreview",
        // you disappear for 1 round charging up and attacking in the 2nd round
      },
      {
        skillName: "Blinding dagger",
        skillId: "bdPreview",
        // 45% chance of target reciving the "blind" buff.
      },
      {
        skillName: "Mirage Step",
        skillId: "msPreview",
        // makes you invunerable for 1 turn
      },
      {
        skillName: "Eviscerate",
        skillId: "ePreview",
        // strikes an enemy with a heavily damaging attack.
      },
    ],
  },
  {
    name: "The Blatherer",
    id: "theBlathererPreview",
    icon: "img/theBlatherer.png",

    class: "heavy",
    description: "greatsword",
    unlocked: function () {
      return true;
    },
    skillsPreview: [
      {
        skillName: "Crushing Blows",
        id: "cbPreview",
        // hits 2 crushing blows on an enemy
      },
      {
        skillName: "Head Splitter",
        id: "hsPreview",
        // hit 1 heavily damaging move on an enemy
      },
      {
        skillName: "War Cry",
        id: "wcPreview",
        // increases dmg for 2 turns
      },
      {
        skillName: "Mighty Swing",
        skillId: "msPreview",
        // hit 1 mighty swing
      },
      {
        skillName: "",
        skillId: "",
      },
      {
        skillName: "Earthquake",
        skillId: "eqPreview",
        // do damage to 3 the front 3 enemies
      },
    ],
  },
  {
    name: "The Occultist",
    id: "theOccultistPreview",
    icon: "img/theOccultist.png",
    class: "light",
    description: "sickles",
    unlocked: function () {
      return false;
    },
    skillsPreview: [
      {
        skillName: "Soul Siphon",
        skillId: "ssPreview",
      },
      {
        skillName: "Essence Drain",
        skillId: "edPreview",
      },
      {
        skillName: "Curse of Darkness",
        skillId: "codPreview",
      },
      {
        skillName: "Forbidden Knowledge",
        skillId: "fkPreview",
      },
      {
        skillName: "Eldritch Shield",
        skillId: "esPreview",
      },
      {
        skillName: "Eldritch Reckoning",
        skillId: "erPreview",
      },
    ],
  },
  {
    name: "The Knight",
    id: "theKnightPreview",
    icon: "img/theKnight.png",
    class: "medium",
    description: "sword",
    unlocked: function () {
      return true;
    },
    skillsPreview: [
      {
        skillName: "Valiant Strike",
        skillId: "vsPreview",
      },
      {
        skillName: "Holy Retribution",
        skillId: "hrPreview",
      },
      {
        skillName: "Pommel Strike",
        skillId: "psPreview",
      },
      {
        skillName: "Holy Blessing",
        skillId: "hbPreview",
      },
      {
        skillName: "",
        skillId: "",
      },
      {
        skillName: "crusade",
        skillId: "cPreview",
      },
    ],
  },
  {
    name: "The Paragon",
    id: "theParagonPreview",
    icon: "img/theParagon.png",
    class: "heavy",
    description: "shield",
    unlocked: function () {
      return false;
    },
    skillsPreview: [
      {
        skillName: "shield bash",
        skillId: "sbPreview",
        // hits designated enemy with a shield
      },
      {
        skillName: "Bulwark Slam",
        skillId: "bsPreview",
        // slams an enemy
      },
      {
        skillName: "Shield Wall",
        skillId: "swPreview",
        // choose an ally to protect 1 attack from an enemy
      },
      {
        skillName: "Paragon's Resolve",
        skillId: "prPreview",
        // buffs defence for the ally behind you and yourself
      },
      {
        skillName: "Titan's Fury",
        skillId: "tfPreview",
        // attack the enemy with a titan's fury, hitting 2-3 times.
      },
    ],
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
      return Journey.activeStage == "PathfinderSelection";
    },
    // you have a slightly higher chance of getting good pathEvents or nodeEvents
  },
  {
    name: "hoarder",
    desc: "you somehow find ways to carry more",
    condition: function () {
      return Journey.activeStage == "PathfinderSelection";
    },
    // increases inventory space by a small amount
  },
  {
    name: "individualist",
    desc: "doing things alone yields greater experience",
    condition: function () {
      return Journey.activeStage == "PathfinderSelection";
    },
  },
  // start of negatives
  {
    name: "restless",
    desc: "you find it harder to rest properly",
    condition: function () {
      return Journey.activeStage == "PathfinderSelection";
    },
    // you will heal slightly less with potions
  },
  {
    name: "blighted",
    desc: "fortune frowns, your luck goes down",
    condition: function () {
      return Journey.activeStage == "PathfinderSelection";
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
  autoSaveDelay: 10000,
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
    //this.updatePrefs();
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
    console.log("checking prefs");
    console.log(SM.get("prefs.autosave"));
    if (this.get("prefs.autosave")) {
      console.log("fake autosave is on");

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
