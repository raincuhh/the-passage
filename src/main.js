// helper functions
function getID(id) {
  return document.getElementById(id);
}
function getQuerySelector(what) {
  return document.querySelector(what);
}
function createEl(elem) {
  return document.createElement(elem);
}
function floorRandom(thing) {
  return Math.floor(Math.random() * thing);
}
function random(thing) {
  return Math.random() * thing;
}
function uppercaseifyString(str) {
  let PARTS = str.split(" ");
  PARTS.forEach((part, index) => {
    PARTS[index] = uppercaseify(part);
  });

  return PARTS.join(" ");
}
function uppercaseify(str) {
  let firstChar = str.charAt(0);
  if (firstChar !== firstChar.toUpperCase()) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
}
function periodify(str) {
  if (str.slice(-1) != ".") {
    str += ".";
  }
  return str;
}
// for localization if needbe in the future
function loc(str) {
  return str;
}
/**
 * main manager,
 * handles general things, like initiating the different objects
 * and their methods
 */
let MM = {
  version: 1.0,
  beta: true,
  autoSaveDelay: 60000,

  init: function () {
    MM.ready = true;
    this.createView(); // makes view
    this.loadGame(); // loads game by localstorage
    PM.init(); // starts the pings component
    SM.init(); // starts the statemanager component
    GM.init(); // starts the GM component

    if (SM.get("prefs.autosave")) {
      //console.log("autosave is on");
      setInterval(() => {
        MM.saveGame();
      }, this.autoSaveDelay);
    } else {
      //console.log("autosave is off");
      PM.ping(
        "autosave is off, remember to save your progress manually, or turn on autosave in settings"
      );
    }

    /*
    console.log(PathfinderCharLib);
    console.log(PathfinderTraitsLib);
    */
  },
  createView: function () {
    let view = createEl("div");
    view.id = "view";
    const CONTAINER = getID("container");
    CONTAINER.appendChild(view);

    this.createNavbar();
    this.createSaved();
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
    function createLinks(id, text) {
      let link = createEl("span");
      link.setAttribute("id", id);
      link.className = "link";
      link.textContent = text;
      return link;
    }

    let navbarInfo = [
      { id: "navbarDelete", text: "delete." },
      { id: "navbarGithub", text: "github." },
      { id: "navbarPortfolio", text: "portfolio." },
      { id: "navbarAchievements", text: "achievements." },
      { id: "navbarSettings", text: "settings." },
    ];

    let navbar = createEl("div");
    navbar.id = "navbar";
    const ROOT = getID("root");
    ROOT.appendChild(navbar);

    let navbarLinks = createEl("div");
    navbarLinks.id = "navbarLinks";
    navbar.appendChild(navbarLinks);
    // makes a link for each of the navbarInfo[indexes]
    navbarInfo.forEach((e) => {
      let link = createLinks(e.id, e.text);
      navbarLinks.appendChild(link);
    });

    const LINKGITHUB = getID("navbarGithub");
    LINKGITHUB.addEventListener("click", () => {
      window.open("https://github.com/raincuhh");
    });
    const LINKPORTFOLIO = getID("navbarPortfolio");
    LINKPORTFOLIO.addEventListener("click", () => {
      window.open("https://raincuhh.github.io/portfolio/");
    });
    const LINKACHIEVEMENTS = getID("navbarAchievements");
    LINKACHIEVEMENTS.addEventListener("click", () => {
      console.log("achievements");
    });
    const LINKSETTINGS = getID("navbarSettings");
    let open = false;
    LINKSETTINGS.addEventListener("click", () => {
      const settings = getID("settings");
      if (!open) {
        settings.style.display = "block";
        open = true;
      } else {
        settings.style.display = "none";
        open = false;
      }
    });
    const DELETE = getID("navbarDelete");
    DELETE.addEventListener("click", () => {
      MM.deleteGame();
    });

    function createSettings() {
      let settings = createEl("div");
      settings.setAttribute("id", "settings");

      const MAIN = getID("main");
      MAIN.insertAdjacentElement("afterend", settings);
    }
    createSettings();
    function createAchievements() {
      let achievements = createEl("div");
      achievements.setAttribute("id", "achievements");

      const MAIN = getID("main");
      MAIN.insertAdjacentElement("afterend", achievements);
    }
    createAchievements();
  },
  error: function () {
    console.log("error");
  },
  createSaved: function () {
    let elem = createEl("div");
    elem.setAttribute("id", "saved");
    elem.textContent = "saved";
    elem.style.opacity = 0;
    const MAIN = getID("main");
    MAIN.insertBefore(elem, MAIN.firstChild);
  },
  saveNotif: function () {
    const ELEM = getID("saved");
    ELEM.style.opacity = 1;
    setTimeout(function () {
      ELEM.style.transition = "opacity 1.5s";
      ELEM.style.opacity = 0;
    }, 10);
  },
  saveGame: function () {
    try {
      //console.log(SM.components);
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
    //console.log("statemanager components:");
    console.log(SM.components);
    if (string) {
      try {
        let save = JSON.parse(string);
        //console.log(save);
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
    //SM.components = {};
    //localStorage.setItem("save", {});
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
    const IMPORTDIV = getID("changethiswhenyoumaketheimportDiv");
    let string = IMPORTDIV.textContent;
    try {
      let save = atob(string);
      save = JSON.parse(save);
      localStorage.setItem("save", save);
      this.saveGame(); // saves the new 'save'
      this.loadGame(); // then loads it to SM.components
      console.log("loaded complete");
    } catch (error) {
      console.error(error);
      alert("error: please try re-importing");
    }
  },
};

/**
 * gameManager module
 * handles starting runs, resetting runs, unlocking locations,
 * and the beforeJourney actions such as choosing which cardinal sin,
 * and choosing party layout.
 */
let GM = {
  activeModule: null,
  init: function () {
    //SelectSin.init();
    FormParty.init();
    if (SM.get("features.locations.formParty")) {
      metaProgression.init();
    }
    if (metaProgression.finished) {
    }

    this.changeModule(FormParty);
  },

  reset: function () {},

  changeModule: function (module) {
    if (GM.activeModule === module) {
      return;
    }
    GM.activeModule = module;
    module.launch();
    //console.log("active module is:");
    //console.log(this.activeModule);
  },
};

let SelectSin = {
  init: function () {
    /*
    if (SM.get("features.locations.SelectSin") == undefined) {
      SM.set("features.locations.SelectSin", true);
    }
    */
    this.makeView();
  },
  launch: function () {
    console.log("active module is: " + GM.activeModule);
    this.setDocumentTitle();
  },
  makeView: function () {
    let sinView = createEl("div");
    sinView.setAttribute("id", "sinSelectorView");
  },
  setDocumentTitle: function () {
    document.title = "invocation of sin";
  },
};

/**
 * formParty
 * handles the creation of the party selection view
 * and selecting the pathfinders for the current run.
 */
let FormParty = {
  finished: false,
  party: ["the pugilist", "the faceless", "the occultist", "the paragon"],

  init: function () {
    if (SM.get("features.locations.formParty") === undefined) {
      console.log("formparty is new");
      SM.set("features.locations.formParty", true);
    } else {
      console.log("formparty is not new");
      SM.get("features.locations.formParty");
    }

    /*
    for (let pathfinder of this.party) {
      console.log("party has: " + pathfinder);
    }
    */

    this.createViewElements(); // makes the view
  },
  launch: function () {
    this.setDocumentTitle();
    PM.ping(
      "choose your allies carefully, for they will determine the course of your journey"
    );
  },
  createViewElements: function () {
    let pathfinderView = createEl("div");
    pathfinderView.setAttribute("id", "pathfinderView");
    const VIEW = getID("view"); // the parent that all "views" will get appended to
    VIEW.appendChild(pathfinderView);

    // make the content
    this.createPathfinderListContent(); // makes patfinder list, locked/locked
    this.createPathfinderDetails(); // makes the content when you click on a hero in the list
    this.createHeaderView(); // makes the header of the content
    this.createPathfinderPosEffectPreview(); // makes the pathfinder pos effectiveness preview
    this.createPathfinderInfoSection(); // makes pathfinder info, quote/desc, etc
    this.createPathfinderSkillsSection(); // makes the skill display
    this.createLockedInLayout(); // makes the locked in layout display,
  },
  createPathfinderListContent: function () {
    // make pathfinderList
    let pathfinderList = createEl("div");
    pathfinderList.setAttribute("id", "pathfinderList");
    pathfinderView.appendChild(pathfinderList);

    let pathfinderContainer = createEl("div");
    pathfinderContainer.setAttribute("class", "container");
    pathfinderList.appendChild(pathfinderContainer);

    PathfinderCharLib.forEach((pathfinder, index) => {
      let elem = this.createPathfinderListItem(pathfinder, index);
      pathfinderContainer.appendChild(elem);
    });
    this.checkPathfindersInListItems();
  },
  createPathfinderListItem: function (char, index) {
    let elem = createEl("span");
    elem.setAttribute("id", char.id);
    elem.setAttribute("class", "pathfinder");
    elem.addEventListener("click", () => {
      FormParty.changeActive(char, index);
      //console.log(index);
    });

    let isUnlocked = char.available();
    if (!isUnlocked) {
      elem.classList.add("locked");
    }
    let pfName = createEl("div");
    pfName.setAttribute("class", "name");
    let formattedName = uppercaseifyString(char.name);
    pfName.textContent = formattedName;
    elem.appendChild(pfName);

    return elem;
  },
  checkPathfindersInListItems: function () {
    const PATHFINDERCONTAINER = getQuerySelector("#pathfinderList .container");
    let PathfinderCharLib =
      PATHFINDERCONTAINER.getElementsByClassName("pathfinder");
    let unlockedPathfinders = [];
    let lockedPathfinders = [];

    for (let i = 0; i < PathfinderCharLib.length; i++) {
      let currentPathfinder = PathfinderCharLib[i];
      if (currentPathfinder.classList.contains("locked")) {
        // and get sm.get char.locked, so it is a && statement when i implement that
        lockedPathfinders.push(currentPathfinder);
      } else {
        unlockedPathfinders.push(currentPathfinder);
      }
    }
    PATHFINDERCONTAINER.innerHTML = "";
    unlockedPathfinders.forEach((pathfinder) => {
      PATHFINDERCONTAINER.appendChild(pathfinder);
    });
    lockedPathfinders.forEach((pathfinder) => {
      PATHFINDERCONTAINER.appendChild(pathfinder);
    });
  },
  createPathfinderDetails: function () {
    // root
    let details = createEl("div");
    details.setAttribute("id", "pathfinderContent");
    pathfinderView.appendChild(details);
  },
  createHeaderView: function () {
    const PARENT = getID("pathfinderContent");

    let header = createEl("div");
    header.setAttribute("id", "pathfinderHeader");
    PARENT.appendChild(header);

    let container = createEl("div");
    container.setAttribute("class", "container");
    header.appendChild(container);

    let title = createEl("span");
    title.setAttribute("id", "pathfinderTitle");
    let formattedTitle = uppercaseifyString(PathfinderCharLib[0].name);
    title.textContent = formattedTitle;
    container.appendChild(title);

    let innerWrapper = createEl("div");
    innerWrapper.setAttribute("class", "wrapper");
    container.appendChild(innerWrapper);

    let classIcon = createEl("img");
    classIcon.setAttribute("id", "pathfinderClassIcon");
    classIcon.src = PathfinderCharLib[0].icon;
    innerWrapper.appendChild(classIcon);

    let classText = createEl("span");
    classText.setAttribute("id", "pathfinderClassText");
    let formattedClassText = uppercaseifyString(PathfinderCharLib[0].class);
    classText.textContent = formattedClassText;
    innerWrapper.appendChild(classText);
  },
  createPathfinderPosEffectPreview: function () {
    const PARENT = getID("pathfinderContent");

    let effectivenessPreview = createEl("div");
    effectivenessPreview.setAttribute("id", "pathfinderEffectivenessPreview");
    PARENT.appendChild(effectivenessPreview);

    let container = createEl("div");
    container.setAttribute("class", "container");
    effectivenessPreview.appendChild(container);
    // making the 2 types
    let types = ["allyEffPreview", "enemyEffPreview"];
    types.forEach((type) => {
      let elem = createEl("div");
      elem.setAttribute("id", type);
      elem.setAttribute("class", "effPreview");
      container.appendChild(elem);
    });

    const allyEffPreview = getID("allyEffPreview");
    const enemyEffPreview = getID("enemyEffPreview");

    let headers = ["allyEffPreviewHeader", "enemyEffPreviewHeader"];
    headers.forEach((header, index) => {
      let elem = createEl("span");
      elem.setAttribute("id", header);
      elem.setAttribute("class", "effPreviewHeader");
      if (index === 0) {
        allyEffPreview.appendChild(elem);
      } else {
        enemyEffPreview.appendChild(elem);
      }
    });

    const allyEffPreviewHeader = getID("allyEffPreviewHeader");
    const enemyEffPreviewHeader = getID("enemyEffPreviewHeader");
    allyEffPreviewHeader.textContent = "recommended";
    enemyEffPreviewHeader.textContent = "targets";

    // making the layout effectiveness previews for ally/pathfinder and enemy.
    createTiles(allyEffPreview, "allyPreviewTile", 4);
    createTiles(enemyEffPreview, "enemyPreviewTile", 4);

    function createTiles(container, id, count) {
      for (let i = 1; i <= count; i++) {
        let elem = createEl("span");
        elem.setAttribute("id", `${id}${i}`);
        elem.setAttribute("class", "tile");
        elem.textContent = "#";
        container.appendChild(elem);
        //console.log("tile" + i);
      }
    }

    const pathfinderEffectivenessPreview = getID(
      "pathfinderEffectivenessPreview"
    );
    let pfEffPreviewHr = createEl("hr");
    pfEffPreviewHr.setAttribute("class", "hr");
    pathfinderEffectivenessPreview.appendChild(pfEffPreviewHr);
  },
  createPathfinderInfoSection: function () {
    const PARENT = getID("pathfinderContent");

    let info = createEl("div");
    info.setAttribute("id", "pathfinderInfo");
    PARENT.appendChild(info);

    let container = createEl("div");
    container.setAttribute("class", "container");
    info.appendChild(container);

    let quote = createEl("div");
    quote.setAttribute("id", "pathfinderQuote");
    quote.textContent = PathfinderCharLib[0].quote; // default
    container.appendChild(quote);

    /*
    let desc = createEl("p");
    desc.setAttribute("id", "pathfinderDescription");
    desc.textContent = PathfinderCharLib[0].desc; // default
    container.appendChild(desc);
    */
  },
  createPathfinderSkillsSection: function () {
    const PARENT = getID("pathfinderContent");

    let pathfinderSkills = createEl("div");
    pathfinderSkills.setAttribute("id", "pathfinderSkills");
    PARENT.appendChild(pathfinderSkills);

    let skillsContainer = createEl("div");
    skillsContainer.setAttribute("class", "container");
    pathfinderSkills.appendChild(skillsContainer);

    // create default skills, gets changed when u click specific pathfinder
    this.createSkillList(0);
  },
  createSkillList: function (index) {
    // make the skillsContainer modular in the future by adding param that takes container
    const CONTAINER = getQuerySelector("#pathfinderSkills .container");
    CONTAINER.innerHTML = "";
    PathfinderCharLib[index].skills.forEach((skill) => {
      let elem = createEl("div");
      elem.setAttribute("id", skill.id);
      elem.setAttribute("class", "skill");
      CONTAINER.appendChild(elem);

      let container = createEl("div");
      container.setAttribute("class", "iconContainer");
      elem.appendChild(container);

      let icon = createEl("img");
      icon.setAttribute("class", "skillIcon");
      icon.src = skill.icon;
      container.appendChild(icon);
      /*
      let name = createEl("span");
      name.setAttribute("class", "name");
      name.textContent = skill.name;
      elem.appendChild(name);
      */
    });
  },
  createLockedInLayout: function () {
    const PARENT = getID("pathfinderContent");

    let layout = createEl("div");
    layout.setAttribute("id", "pathfinderParty");
    PARENT.appendChild(layout);

    let container = createEl("div");
    container.setAttribute("class", "container");
    layout.appendChild(container);

    let preview = createEl("div");
    preview.setAttribute("id", "pathfinderPartyLayout");
    container.appendChild(preview);

    let wrapper = createEl("div");
    wrapper.setAttribute("class", "wrapper");
    preview.appendChild(wrapper);

    let partySlots = ["E", "E", "E", "E"];
    partySlots.forEach((slot, index) => {
      let elem = createEl("span");
      elem.setAttribute("id", "partySlot_" + `${slot}${index}`);
      elem.setAttribute("class", "slot");
      wrapper.appendChild(elem);

      // making the inner where the icon will be changed dynamically
      // depending on the pathfinder screen youre on. layoutslots will be dynamically changed aswell
      let icon = createEl("span");
      icon.setAttribute("class", "pathfinderPosIcon");
      elem.appendChild(icon);
    });

    let bfLayoutFinalize = createEl("div");
    bfLayoutFinalize.setAttribute("id", "pathfinderBfLayoutFinalize");
    container.appendChild(bfLayoutFinalize);
  },
  changeActive: function (char, index) {
    const HEADERTITLE = getQuerySelector(
      "#pathfinderHeader .container #pathfinderTitle"
    );
    const CLASSICON = getQuerySelector(
      "#pathfinderHeader .container .wrapper #pathfinderClassIcon"
    );
    const CLASSTEXT = getQuerySelector(
      "#pathfinderHeader .container .wrapper #pathfinderClassText"
    );
    const QUOTE = getQuerySelector(
      "#pathfinderInfo .container #pathfinderQuote"
    );
    //const ALLYEFFPREVIEWHEADER = getID("allyEffPreviewHeader");
    //const ENEMYEFFPREVIEWHEADER = getID("enemyEffPreviewHeader");

    // sets values
    let formattedTitle = uppercaseifyString(char.name);
    let formattedClassText = uppercaseifyString(char.class);
    let formattedQuote = uppercaseifyString(char.quote);

    HEADERTITLE.textContent = formattedTitle;
    CLASSICON.src = char.icon;
    CLASSTEXT.textContent = formattedClassText;
    QUOTE.textContent = formattedQuote;
    //DESC.textContent = char.desc;
    this.createSkillList(index);

    /**
     * https://stackoverflow.com/questions/7176908/how-can-i-get-the-index-of-an-object-by-its-property-in-javascript/22864817#22864817
     *
     * theoretically would fetch the info from an array about the heroes effectiveness
     * on specific positions in the battleformation layout.
     * weighing values on the 4 different slots a hero can be in,
     * depending on what pathfinder it is, like for example the paragon
     * should be more effective on the rightmost slot/ first slot because he is a tank.
     * but he should also be slightly less effective on the 2nd slot.
     */
  },
  getEffectivePosition: function (string) {
    const PARTS = string.split(/[,]+/);
    for (let i = 0; i < PARTS.length; i++) {
      let part = PARTS[i];
      console.log(part);
    }
  },
  setDocumentTitle: function () {
    document.title = "choose your party...";
  },
  finishParty: function () {
    for (let pathfinder of this.party) {
      if (!SM.get("character." + pathfinder)) {
        SM.set("character." + pathfinder, {});
        PFM.createPathfinder(pathfinder);
      }
    }
  },
};

/**
 * shrine of abyss / metaprogression
 */
let metaProgression = {
  init: function () {
    this.createViewElements();
  },
  createViewElements: function () {},
  launch: function () {
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    if (GM.activeModule == "metaProgression") {
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
        //MM.changeView(location);
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
 * im gonna change the available functions
 * to return a SM.get skill and available value later
 *
 * ally layout
 * 1-br, 2-br, 3-fr, 4-fr
 *
 * enemy layout
 * 1-fr, 2-fr, 3-br, 4-br
 *
 * base stats that get made for each char.
 * name is name of stat
 * value is base % or number of that stat
 * stats can be either % or a number.
 */
let PathfinderCharLib = [
  {
    name: "the pugilist",
    id: "thePugilist",
    icon: "img/thePugilist.png",
    class: "lost",
    quote:
      '"In the heat of battle, every blow tells a story of resilience and determination."',
    desc: "A seasoned fighter, the Pugilist thrives in combat, his fists weaving tales of triumph and overcoming adversity with every strike.",
    effectiveAllyPos: "3,4",
    effectiveEnemyPos: "1,2",
    available: function () {
      return true;
    },
    skills: [
      {
        name: "leg breaker",
        id: "legBreaker",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // 40% chance of disabling enemy for 1 turn + low-lowmedium dmg
      },
      {
        name: "fire fist",
        id: "fireFist",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hit enemy 1 time with a fire fist, low-medium dmg
      },
      {
        name: "crushing uppercut",
        id: "crushingUppercut",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hit enemy 1 time with a uppercut,
        // 25% chance of concussion which gives the "confused" buff on target
      },
      {
        name: "burst combo",
        id: "burstCombo",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hits enemy 2-5 times, low damage
      },
      {
        name: "meteor strike",
        id: "meteorStrike",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // hits 1 time heavy damage
      },
      {
        name: "demon assault",
        id: "demonAssault",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // hits 3-5 times low-medium damage
      },
    ],
    stat: [
      {
        name: "hp",
        fullName: "healthpoints",
        value: "27",
        type: "number",
      },
      {
        name: "spd",
        fullName: "speed",
        value: "4",
        type: "number",
      },
      // resistances/res
      {
        name: "phys res",
        fullName: "physical resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "rang res",
        fullName: "ranged resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "bld res",
        fullName: "bleed resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "psn res",
        fullName: "poison resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "cld res",
        fullName: "cold resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "fire res",
        fullName: "fire resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "stun res",
        fullName: "stun resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "mov res",
        fullName: "move resistance",
        value: "20%",
        type: "percent",
      },
    ],
  },
  {
    name: "the faceless",
    id: "theFaceless",
    icon: "img/theFaceless.png",
    class: "lost",
    quote: '"Discard your identity, peer into the depths of the abyss."',
    desc: "Mysterious and agile, the Faceless strikes swiftly from the shadows, wielding deadly precision and cunning tactics.",
    effectiveAllyPos: "1,2", // backrow
    effectiveEnemyPos: "2,3,4", // backrow
    available: function () {
      return true;
    },
    skills: [
      {
        name: "blade flurry",
        id: "bladeFlurry",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hits an enemy 3-5 times, low dmg
      },
      {
        name: "set your sights",
        id: "setYourSights",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // sets a sight on an enemy, increasing hit accuracy by +80% for that enemy for 1 turn
      },
      {
        name: "vanishing strike",
        id: "vanishingStrike",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // you disappear for 1 round charging up and attacking in the 2nd round
      },
      {
        name: "blinding dagger",
        id: "blindingDagger",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // 45% chance of target reciving the "blind" buff.
      },
      {
        name: "mirage step",
        id: "mirageStep",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // makes you invunerable for 1 turn
      },
      {
        name: "eviscerate",
        id: "eviscerate",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // strikes an enemy in the neck with a heavily damaging attack.
      },
    ],
    stats: [
      {
        name: "hp",
        fullName: "healthpoints",
        value: "24",
        type: "number",
      },
      {
        name: "spd",
        fullName: "speed",
        value: "5",
        type: "number",
      },
      // resistances/res
      {
        name: "phys res",
        fullName: "physical resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "rang res",
        fullName: "ranged resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "bld res",
        fullName: "bleed resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "psn res",
        fullName: "poison resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "cld res",
        fullName: "cold resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "fire res",
        fullName: "fire resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "stun res",
        fullName: "stun resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "mov res",
        fullName: "move resistance",
        value: "20%",
        type: "percent",
      },
    ],
  },
  {
    name: "the occultist",
    id: "theOccultist",
    icon: "img/theOccultist.png",
    class: "lost",
    quote:
      '"Knowledge is power, but forbidden knowledge is a double-edged sword."',
    desc: "Delving into the darkest arts, the Occultist harnesses forbidden powers to manipulate and drain the essence of their foes.",
    effectiveAllyPos: "1,2", // backrow ally side
    effectiveEnemyPos: "3,4", // backrow enemy side
    available: function () {
      return true;
    },
    skills: [
      {
        name: "soul siphon",
        id: "soulSiphon",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "essence drain",
        id: "essenceDrain",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "curse of darkness",
        id: "curseOfDarkness",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "forbidden knowledge",
        id: "forbiddenKnowledge",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
      },
      /*
      {
        name: "Eldritch Shield",
        id: "eldritchShield",
        icon: "img/placeholderSkillIcon.png",
      },
      */
      {
        name: "eldritch reckoning",
        id: "eldritchReckoning",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // base dmg 15
        // for each cursestack applied.,
        // base dmg will increase incrementally by 0.15x
      },
    ],
    stat: [
      {
        name: "hp",
        fullName: "healthpoints",
        value: "21",
        type: "number",
      },
      {
        name: "spd",
        fullName: "speed",
        value: "3",
        type: "number",
      },
      // resistances/res
      {
        name: "phys res",
        fullName: "physical resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "rang res",
        fullName: "ranged resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "bld res",
        fullName: "bleed resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "psn res",
        fullName: "poison resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "cld res",
        fullName: "cold resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "fire res",
        fullName: "fire resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "stun res",
        fullName: "stun resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "mov res",
        fullName: "move resistance",
        value: "20%",
        type: "percent",
      },
    ],
  },
  {
    name: "the paragon",
    id: "theParagon",
    icon: "img/theParagon.png",
    class: "lost",
    quote: '"Stand proud, for valor and honor are our shields."',
    desc: "A bastion of strength and resilience, the Paragon defends allies with unwavering courage and unmatched determination.",
    effectiveAllyPos: "3,4",
    effectiveEnemyPos: "1,2",
    available: function () {
      return true;
    },
    skills: [
      {
        name: "shield bash",
        id: "shieldBash",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hits designated enemy with a shield
      },
      {
        name: "bulwark slam",
        id: "bulkwarkSlam",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // slams an enemy
      },
      {
        name: "shield wall",
        id: "shieldWall",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // choose an ally to protect 1 attack from an enemy
      },
      {
        name: "paragons resolve",
        id: "paragonsResolve",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // buffs defence for the ally behind you and yourself
      },
      {
        name: "titans fury",
        id: "titansFury",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // attack the enemy with a titan's fury, hitting 2-3 times.
      },
    ],
    stat: [
      {
        name: "hp",
        fullName: "healthpoints",
        value: "37",
        type: "number",
      },
      {
        name: "spd",
        fullName: "speed",
        value: "2",
        type: "number",
      },
      // resistances/res
      {
        name: "phys res",
        fullName: "physical resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "rang res",
        fullName: "ranged resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "bld res",
        fullName: "bleed resistance",
        value: "35%",
        type: "percent",
      },
      {
        name: "psn res",
        fullName: "poison resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "cld res",
        fullName: "cold resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "fire res",
        fullName: "fire resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "stun res",
        fullName: "stun resistance",
        value: "35%",
        type: "percent",
      },
      {
        name: "mov res",
        fullName: "move resistance",
        value: "30%",
        type: "percent",
      },
    ],
  },
  {
    name: "the blatherer",
    id: "theBlatherer",
    icon: "img/theBlatherer.png",
    class: "lost",
    quote: '"fillThisInWithQuoteLater"',
    desc: "fillThisInWithDescLater",
    effectiveAllyPos: "3,4",
    effectiveEnemyPos: "1,2",
    available: function () {
      return false;
    },
    skills: [
      {
        name: "crushing blows",
        id: "crushingBlows",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hits 2 crushing blows on an enemy
      },
      {
        name: "head splitter",
        id: "headSplitter",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hit 1 heavily damaging move on an enemy
      },
      {
        name: "war cry",
        id: "warCry",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // increases dmg for 2 turns
      },
      {
        name: "mighty swing",
        id: "mightySwing",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // mighty swing
      },
      {
        name: "earthquake",
        id: "earthquake",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // do damage to 3 the front 3 enemies
      },
    ],
    stat: [
      {
        name: "hp",
        fullName: "healthpoints",
        value: "31",
        type: "number",
      },
      {
        name: "spd",
        fullName: "speed",
        value: "3",
        type: "number",
      },
      // resistances/res
      {
        name: "phys res",
        fullName: "physical resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "rang res",
        fullName: "ranged resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "bld res",
        fullName: "bleed resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "psn res",
        fullName: "poison resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "cld res",
        fullName: "cold resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "fire res",
        fullName: "fire resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "stun res",
        fullName: "stun resistance",
        value: "25%",
        type: "percent",
      },
      {
        name: "mov res",
        fullName: "move resistance",
        value: "20%",
        type: "percent",
      },
    ],
  },
  {
    name: "the knight",
    id: "theKnight",
    icon: "img/theKnight.png",
    class: "lost",
    quote: '"Faith is our shield, and righteousness our sword."',
    desc: "An embodiment of righteousness, the Knight wields the divine power of faith to dispel darkness and protect the innocent from the forces of evil.",
    effectiveAllyPos: "3,4",
    effectiveEnemyPos: "1,2",
    available: function () {
      return false;
    },
    skills: [
      {
        name: "valiant strike",
        id: "valiantStrike",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "holy retribution",
        id: "holyRetribution",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "strike to the head",
        id: "strikeToTheHead",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "a holy blessing",
        id: "aHolyBlessing",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "surge of action",
        id: "surgeOfAction",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
      },
      {
        name: "crusade",
        id: "crusade",
        icon: "img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
      },
    ],
    stat: [
      {
        name: "hp",
        fullName: "healthpoints",
        value: "34",
        type: "number",
      },
      {
        name: "spd",
        fullName: "speed",
        value: "4",
        type: "number",
      },
      // resistances/res
      {
        name: "phys res",
        fullName: "physical resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "rang res",
        fullName: "ranged resistance",
        value: "5%",
        type: "percent",
      },
      {
        name: "bld res",
        fullName: "bleed resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "psn res",
        fullName: "poison resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "cld res",
        fullName: "cold resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "fire res",
        fullName: "fire resistance",
        value: "20%",
        type: "percent",
      },
      {
        name: "stun res",
        fullName: "stun resistance",
        value: "30%",
        type: "percent",
      },
      {
        name: "mov res",
        fullName: "move resistance",
        value: "30%",
        type: "percent",
      },
    ],
  },
];

/**
 * each pathfinder has 2 default traits,
 * each pathfinder will get 1 positive and 1 negative trait that has a small, or slighty more noticable
 * change based on rarity, that influences different things.
 * the player can remove or get more traits based on stuff like items, nodeEvents, pathEvents and such.
 *
 * the traits can manipulate resistances, max hp, speed, positive and negative marks, and other niches such as inventoryspace and etc.
 */
let PathfinderTraitsLib = [
  // index 0, boons
  [
    {
      name: "packmule",
      rarity: "common",
      toolTip: "you somehow find ways to carry more",
      pingMsg:
        "you feel lighter on your feet as you manage to carry more without strain",
      // +3 inventory space
    },
    {
      name: "nimble footed",
      rarity: "common",
      toolTip: "You move with unmatched agility",
      pingMsg: "Your movements become swifter and more agile",
      // speed +3
    },
    {
      name: "evasive",
      rarity: "common",
      toolTip: "you have a knack for avoiding attacks",
      pingMsg:
        "you become more elusive, making it harder for enemies to land hits on you",
      // +10% dodge chance
    },
    {
      name: "precise",
      rarity: "common",
      toolTip: "You have a steady hand and keen eye",
      pingMsg:
        "your accurancy has increased, increasing your lethality in combat",
      // +5% accuracy
    },
    {
      name: "precise*",
      rarity: "rare",
      toolTip: "allows for precise and critical attacks",
      pingMsg: "You see your strikes becoming more precise and deadly",
      // +8% crit, +10% accuracy
    },
    {
      name: "iron will",
      rarity: "common",
      toolTip: "strengthens your resolve against negative effects",
      pingMsg:
        "your will strengthens, making it harder for negative effects to affect you",
      // +5% stun res, +5% mov res
    },
    {
      name: "stalwart",
      rarity: "common",
      toolTip: "boosts your physical endurance",
      pingMsg:
        "you feel sturdier and more resilient, ready to withstand physical challenges",
      // +4 max hp, +4% physical res
    },
    {
      name: "swift reflexes",
      rarity: "common",
      toolTip: "Heightens your agility and reaction time",
      pingMsg:
        "you feel lighter on your feet, ready to dodge incoming attacks with ease",
      // +2 speed, +5% dodge chance
    },
  ],
  // index 1, flaws
  [
    {
      name: "anemic",
      rarity: "common",
      toolTip: "you lack vitality and vigor",
      pingMsg:
        "you feel weak and fatigued, making it harder to endure physical exertion",
      // -2% max hp
    },
    {
      name: "fumbler",
      rarity: "common",
      toolTip: "you tend to fumble actions more often",
      pingMsg:
        "your coordination seems to suffer, leading to more frequent fumbles in your actions",
      // 40% chance of gaining the idk yet but the mark makes you have a % chance of failing your move
    },
    {
      name: "lethargic",
      rarity: "common",
      toolTip: "you lack energy and enthusiasm",
      pingMsg:
        "you feel drained of energy and motivation, making it difficult to muster enthusiasm for tasks or activities",
      // -1 speed, -5% dodge chance
    },
    {
      name: "frail",
      rarity: "common",
      toolTip: "your constitution is weak",
      pingMsg:
        "you feel physically fragile, making you more susceptible to injuries and ailments",
      // -2 max hp
    },
    {
      name: "restless*",
      rarity: "rare",
      toolTip: "you find it harder to rest properly",
      pingMsg:
        "rest eludes you, making it difficult to fully recover during rest periods",
      // -10% heal (every source)
    },
    {
      name: "shaky hands",
      rarity: "common",
      toolTip: "your hands tremble uncontrollably",
      pingMsg:
        "your hands shake uncontrollably, affecting your ability to aim steadily",
      // -5% accuracy
    },
    {
      name: "hemophilia*",
      rarity: "rare",
      toolTip: "You bleed more.",
      pingMsg:
        "your blood seems to flow more freely, making you more susceptible to bleeding wounds",
      // -10% bleed res
    },
    {
      name: "brittle bones*",
      rarity: "rare",
      toolTip: "your bones are more prone to fractures",
      pingMsg:
        "your bones feel fragile, making you more susceptible to fractures and injuries",
      // -10% max HP, -5% mov res
    },
    {
      name: "toxin susceptible*",
      rarity: "rare",
      toolTip: "your body reacts strongly to toxins",
      pingMsg:
        "toxins affect you more severely, leading to heightened vulnerability to poisoning and other toxin-based attacks",
      // -10% poison resistance
    },
    {
      name: "vulnerable",
      rarity: "common",
      toolTip: "You are prone to vulnerabilities",
      pingMsg:
        "you feel exposed and vulnerable, making you more susceptible to various negative effects",
      // -3% to all resistances
    },
    {
      name: "scorched",
      rarity: "common",
      toolTip: "you are susceptible to burns",
      pingMsg:
        "your skin feels sensitive to heat, making you more prone to burns and scalds",
      // -5% burn resistance
    },
  ],
];

/**
 * pathfinderManager
 * handles pathfinders, their stats and traits, etc.
 */
let PFM = {
  init: function () {},
  createPathfinder: function (pathfinder) {
    let charList = PathfinderCharLib;
    let pathfinderIndex = charList.findIndex((e) => e.name === pathfinder);
    this.randomizeTraits(pathfinder, 2);
    this.setBaseSkills(pathfinder, pathfinderIndex);
    this.setBaseStats(pathfinder, pathfinderIndex);
  },
  randomizeTraits: function (pathfinder, numberOfTraits) {
    let positiveTraitList = PathfinderTraitsLib[0];
    let negativeTraitList = PathfinderTraitsLib[1];

    for (let i = 0; i < Math.floor(numberOfTraits / 2); i++) {
      let randomTrait = this.getRandPositiveTrait();
      let traitIndex = positiveTraitList[randomTrait];
      let trait = traitIndex.name;
      SM.setTrait(pathfinder, trait, true, false);
      //console.log("trait added: " + trait);
    }
    for (let i = 0; i < Math.floor(numberOfTraits / 2); i++) {
      let randomTrait = this.getRandNegativeTrait();
      let traitIndex = negativeTraitList[randomTrait];
      let trait = traitIndex.name;
      SM.setTrait(pathfinder, trait, true, false);
      //console.log("trait added: " + trait);
    }
  },
  getRandPositiveTrait: function () {
    let positiveTraitList = PathfinderTraitsLib[0];
    let trait = this.getTraitPool(positiveTraitList);
    return trait;
  },
  getRandNegativeTrait: function () {
    let negativeTraitList = PathfinderTraitsLib[1];
    let trait = this.getTraitPool(negativeTraitList);
    return trait;
  },
  getTraitPool: function (traitList) {
    let rareTreshold = 0.3;
    let commonTraits = traitList.filter((e) => e.rarity === "common");
    let rareTraits = traitList.filter((e) => e.rarity === "rare");

    let selectedTrait;
    let randomValue = Math.random();
    //console.log(randomValue);

    if (randomValue > rareTreshold) {
      selectedTrait = Math.floor(Math.random() * commonTraits.length);
    } else {
      selectedTrait = Math.floor(Math.random() * rareTraits.length);
    }

    return selectedTrait;
  },
  includeTraitPing: function (trait, bool) {
    let matchedTrait;
    for (let i = 0; i < PathfinderTraitsLib.length; i++) {
      let traitList = PathfinderTraitsLib[i];
      let foundTrait = traitList.find((e) => e.name === trait);
      if (foundTrait) {
        matchedTrait = foundTrait;
        break;
      }
    }
    if (!bool) {
      return;
    }
    if (matchedTrait) {
      PM.ping(matchedTrait.pingMsg);
    } else {
      console.error();
    }
  },
  setBaseStats: function (pathfinder, index) {},
  setBaseSkills: function (pathfinder, index) {
    let charList = PathfinderCharLib;
    let charListSkills = charList[index].skills;

    // Check if charListSkills is undefined
    if (!charListSkills) {
      console.error("Skills not found for the given index.");
      return;
    }
    //console.log(charListSkills);

    // every available skill will have their SM.set available to true,
    // opposite for unavailable, then will do stuff in turnbased based on this, and etc.
    let unlockedSkills = charListSkills.filter((skill) => !skill.locked());
    let lockedSkills = charListSkills.filter((skill) => skill.locked());

    //console.log(unlockedSkills);
    //console.log(lockedSkills);

    unlockedSkills.forEach((skill) => {
      SM.setSkill(pathfinder, skill, true);
    });
    lockedSkills.forEach((skill) => {
      SM.setSkill(pathfinder, skill, false);
    });
  },
  includeSkillPing: function (skill, bool) {},
};

/**
 * pings object
 * handles all ping(s) related methods. messaging, pinging, deleting.
 */
let PM = {
  init: function () {
    let elem = createEl("div");
    elem.setAttribute("id", "pings");
    const CONTAINER = getID("container");
    CONTAINER.insertBefore(elem, CONTAINER.firstChild);

    let fade = createEl("div");
    fade.setAttribute("id", "fade");
    //elem.appendChild(fade);
  },
  ping: function (string) {
    if (typeof string == "undefined") {
      return;
    }
    string = periodify(string);
    string = uppercaseify(string);
    this.send(string);
  },
  send: function (e) {
    // outputs the finalized message to the pings node
    let ping = createEl("div");
    ping.className = "ping";
    ping.textContent = e;
    const PINGS = getID("pings");
    PINGS.insertBefore(ping, PINGS.firstChild);
    this.deleteCheck();
  },
  deleteCheck: function () {
    // checking if there are any overflowing pings to delete, cause memoryleak.
    const PINGS = getID("pings");
    let viewportHeight = window.innerHeight;
    let pingList = PINGS.getElementsByClassName("ping");
    for (let i = 0; i < pingList.length; i++) {
      let ping = pingList[i];
      let pingRect = ping.getBoundingClientRect();
      if (pingRect.bottom < 0 || pingRect.top > viewportHeight) {
        PINGS.removeChild(ping);
      }
    }
  },
  clear: function () {
    const PINGS = getID("pings");
    let pingList = PINGS.getElementsByClassName("ping");

    let pingListArray = Array.from(pingList);
    pingListArray.forEach((e) => {
      PINGS.removeChild(e);
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
      typeof param.id !== "undefined" ? param.id : "EVENT_" + MM.createGuid()
    );
    elem.className = "event";
    // eventtype
    let eventType;
    if (typeof param.type !== "undefined") eventType = param.type;
    console.log(eventType);

    const MAIN = getID("main");
    MAIN.appendChild(elem);
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
      typeof param.id !== "undefined" ? param.id : "BTN_" + MM.createGuid()
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

    const VIEW = getID("view");
    VIEW.appendChild(elem);
    return elem;
  },
  disabled: function (btn, param) {
    // i will do later
  },
  onCooldown: function (btn, cd) {},
};

/**
 * handles most if not all values ingame; setter and getter methods
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
  components: {},
  init: function () {
    let categories = [
      "features", // locations, etc.
      "game", // more specific stuff. candles in purgatory lit, etc.
      "entities", // generated enemies will be instantiated inside the entities category
      "character", // PathfinderCharLib, boons, flaws, perks, health, stats and such.
      "inventory", // inventory handling,
      "prefs", // gamepreferences, stuff like exitWarning, lightmode, autosave, etc.
      "meta", // meta-progression, kept between runs.
      "cooldown", // cooldown on different situations handling
    ];
    // checks through iterating over values, and creates a category if category undefined
    for (let category of categories) {
      if (!this.get(category)) {
        this.set(category, {});
        console.log("category: " + category + " initialized");
      }
    }
    this.set("ver", MM.version);
  },
  // gets a single value
  get: function (stateName) {
    let currentState = this.components;
    const PARTS = stateName.split(/[.\[\]'"]+/);
    // checks for nesteds
    for (let thing of PARTS) {
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
    const PARTS = stateName.split(/[.\[\]'"]+/);
    for (let i = 0; i < PARTS.length - 1; i++) {
      if (!currentState.hasOwnProperty(PARTS[i])) {
        currentState[PARTS[i]] = {};
      }
      currentState = currentState[PARTS[i]];
    }
    currentState[PARTS[PARTS.length - 1]] = value;
    MM.saveGame();
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
    const PARTS = stateName.split(/[.\[\]'"]+/);
    for (let i = 0; i < PARTS.length - 1; i++) {
      if (currentState && currentState.hasOwnProperty(PARTS[i])) {
        currentState = currentState[PARTS[i]];
      } else {
        console.log("state not found");
        return;
      }
    }
    if (currentState && currentState.hasOwnProperty(PARTS[PARTS.length - 1])) {
      delete currentState[PARTS[PARTS.length - 1]];
      console.log("state deleted");
    } else {
      console.log("state not found");
    }
    MM.saveGame();
  },

  // specific setter and getters and other methods
  setTrait: function (pathfinder, trait, bool, includePing) {
    this.set("character." + pathfinder + ".traits." + trait, bool);
    PFM.includeTraitPing(trait, includePing);
  },
  getTrait: function (pathfinder, trait) {
    try {
      return SM.get("character." + pathfinder + ".traits." + trait);
    } catch (error) {
      console.error("trait not found" + error);
    }
  },
  setSkill: function (pathfinder, skill, bool, includePing) {
    SM.set(
      "character." + pathfinder + ".skills." + skill.name + ".locked",
      bool
    );
    PFM.includeSkillPing(skill, includePing);
  },
};

/**
 * onload
 */
window.onload = function () {
  if (!MM.ready) {
    const ROOT = getID("root");
    if (!ROOT || !ROOT.parentElement) {
      MM.error();
    } else {
      console.log(
        "[=== " + "Hello, myself here, dont change the save will you ʕ•ᴥ•ʔ",
        ", the game has loaded." + " ===]"
      );
      MM.init();
    }
  }
};

/**
 * Notes
 *
 * metaprogression currency = stygian lanterns
 * money currency = Denarii
 * special currency =
 *
 * rememeber using this vid as baseline for saving and loading with localstorage:
 * https://www.youtube.com/watch?v=ePHfRUIvbbg
 *
 * note to self, oop everything cuh
 * https://medium.com/@crohacz_86666/basics-of-modular-javascript-2395c82dd93a
 * remember thisshit
 *
 * the encounter system has a kind of pokemon/darkestdungeon(turnbased) esque battlesystem.
 * take inspo from roguelineage permadeath.
 *
 * // first time in purgatory text, for later
 * PM.ping(
 * "you find yourself in a dimly lit chamber, disoriented and unsure of where you are"
 * );
 * PM.ping(
 * "shadows cling to the walls like specters, and the faint flicker of candles offers little solace in this unfamiliar enviornment"
 * );
 *
 * source(s):
 * https://playcode.io/javascript/object,
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects
 *
 *
 * todo  4/9/2024
 * finish pathfinder selection screen, meaning adding the changeActive method
 * to change info of pathfinder depending on which pathfinder ur selected on.
 *
 * fix the available return function on each pathfinder,
 * make it like the SM.get("prefs.autosave"), maybe a tertiary?
 */
