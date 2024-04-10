// just shortens process
function getID(id) {
  return document.getElementById(id);
}
function getQuerySelector(what) {
  return document.querySelector(what);
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
  autoSaveDelay: 60000,

  init: function () {
    Main.ready = true;

    this.createView(); // makes view
    this.loadGame(); // loads game by localstorage
    Pings.init(); // starts the pings component
    SM.init(); // starts the statemanager component
    Run.init(); // starts the run component

    if (SM.get("prefs.autosave")) {
      console.log("autosave is on");
      setInterval(() => {
        Main.saveGame();
      }, this.autoSaveDelay);
    } else {
      console.log("autosave is off");
      Pings.ping(
        "autosave is off, remember to save your progress manually through settings, or turn on autosave"
      );
    }
  },
  createView: function () {
    let view = createEl("div");
    view.id = "view";
    const container = getID("container");
    container.appendChild(view);

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

  error: function () {
    console.log("error");
  },
  createSaved: function () {
    let elem = createEl("div");
    elem.setAttribute("id", "saved");
    elem.textContent = "saved";
    elem.style.opacity = 0;
    const main = getID("main");
    main.insertBefore(elem, main.firstChild);
  },
  saveNotif: function () {
    const elem = getID("saved");
    elem.style.opacity = 1;
    setTimeout(function () {
      elem.style.transition = "opacity 1.5s";
      elem.style.opacity = 0;
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
    console.log("statemanager components:");
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
  activeModule: null,
  init: function () {
    //invocationOfSin.init();
    PathfinderSelector.init();
    if (PathfinderSelector.finished) {
      metaProgression.init();
    }
    if (metaProgression.finished) {
    }

    this.changeModule(PathfinderSelector);
  },

  reset: function () {},

  changeModule: function (module) {
    if (Journey.activeModule === module) {
      return;
    }
    Journey.activeModule = module;
    module.launch();
    //console.log("active module is:");
    //console.log(this.activeModule);
  },
};
let invocationOfSin = {
  init: function () {
    /*
    if (SM.get("features.locations.invocationOfSin") == undefined) {
      SM.set("features.locations.invocationOfSin", true);
    }
    */

    this.makeView();
  },
  launch: function () {
    console.log("active module is: " + Journey.activeModule);
    this.setDocumentTitle();
  },
  makeView: function () {},
  setDocumentTitle: function () {
    document.title = "invocation of sin";
  },
};

/**
 * picks characters
 */
let PathfinderSelector = {
  finished: false,
  chosenPathfinders: [],

  init: function () {
    /*
    if (SM.get("features.locations.pathfinderSelection") == undefined) {
      SM.set("features.locations.pathfinderSelection", true);
    }
    */
    this.makeView(); // makes the view
  },
  launch: function () {
    this.setDocumentTitle();
  },
  makeView: function () {
    // make root
    let pathfinderView = createEl("div");
    pathfinderView.setAttribute("id", "pathfinderView");
    // append to view
    const view = getID("view");
    view.appendChild(pathfinderView);

    this.makePathfinderView();
    this.makePathfinderContent();
  },
  makePathfinderView: function () {
    // make pathfinderList
    let pathfinderList = createEl("div");
    pathfinderList.setAttribute("id", "pathfinderList");
    pathfinderView.appendChild(pathfinderList);
    // make pathfinder container
    let pathfinderContainer = createEl("div");
    pathfinderContainer.setAttribute("class", "container");
    pathfinderList.appendChild(pathfinderContainer);
    // make each pathfinder by iterating over pathfinder list
    characters.forEach((e, index) => {
      let elem = makePathfinderPreview(e, index); // e.id, e.name, e.available
      pathfinderContainer.appendChild(elem);
    });
    checkPathfinderPreview();
    function makePathfinderPreview(char, index) {
      // id, name, available
      let elem = createEl("span");
      elem.setAttribute("id", char.id);
      elem.setAttribute("class", "pathfinder");
      elem.addEventListener("click", () => {
        PathfinderSelector.changeActive(char, index);
        console.log(index);
      });

      let isUnlocked = char.available();
      if (!isUnlocked) {
        elem.classList.add("locked");
      }
      let nameC = createEl("div");
      nameC.setAttribute("class", "name");
      nameC.textContent = char.name;
      elem.appendChild(nameC);

      return elem;
    }
    function checkPathfinderPreview() {
      const pathfinderContainer = getQuerySelector(
        "#pathfinderList .container"
      );
      let characters = pathfinderContainer.getElementsByClassName("pathfinder");
      let unlockedPathfinders = [];
      let lockedPathfinders = [];

      for (let i = 0; i < characters.length; i++) {
        let currentPathfinder = characters[i];
        if (currentPathfinder.classList.contains("locked")) {
          // and get sm.get char.locked, so it is a && statement
          lockedPathfinders.push(currentPathfinder);
        } else {
          unlockedPathfinders.push(currentPathfinder);
        }
      }
      pathfinderContainer.innerHTML = "";
      unlockedPathfinders.forEach((pathfinder) => {
        pathfinderContainer.appendChild(pathfinder);
      });
      lockedPathfinders.forEach((pathfinder) => {
        pathfinderContainer.appendChild(pathfinder);
      });
    }
  },
  makePathfinderContent: function () {
    // root
    let pfContent = createEl("div");
    pfContent.setAttribute("id", "pathfinderContent");
    pathfinderView.appendChild(pfContent);

    // header
    let pfHeader = createEl("div");
    pfHeader.setAttribute("id", "pathfinderHeader");
    pfContent.appendChild(pfHeader);
    // container
    let headerContainer = createEl("div");
    headerContainer.setAttribute("class", "container");
    pfHeader.appendChild(headerContainer);
    // title // the pugilist, the faceless, etc
    let headerTitle = createEl("span");
    headerTitle.setAttribute("id", "pathfinderTitle");
    headerTitle.textContent = "The Pugilist"; // changeable
    headerContainer.appendChild(headerTitle);
    // wrapper
    let pfClassWrapper = createEl("div");
    pfClassWrapper.setAttribute("class", "wrapper");
    headerContainer.appendChild(pfClassWrapper);
    // class icon
    let headerClassIcon = createEl("img");
    headerClassIcon.setAttribute("id", "pathfinderClassIcon");
    headerClassIcon.src = characters[0].icon; // changeable

    pfClassWrapper.appendChild(headerClassIcon);
    // class text
    let headerClassText = createEl("span");
    headerClassText.setAttribute("id", "pathfinderClassText");
    headerClassText.textContent = characters[0].class; // changeable
    pfClassWrapper.appendChild(headerClassText);

    // effectiveness preview
    let pfEffPreview = createEl("div");
    pfEffPreview.setAttribute("id", "pathfinderEffectivenessPreview");
    pfContent.appendChild(pfEffPreview);
    // container
    let effPreviewContainer = createEl("div");
    effPreviewContainer.setAttribute("class", "container");
    pfEffPreview.appendChild(effPreviewContainer);
    // making the 2 types
    let effTypes = ["allyEffPreview", "enemyEffPreview"];
    effTypes.forEach((type) => {
      let elem = createEl("div");
      elem.setAttribute("id", type);
      elem.setAttribute("class", "effPreview");
      effPreviewContainer.appendChild(elem);
    });

    const allyEffPreview = getID("allyEffPreview");
    const enemyEffPreview = getID("enemyEffPreview");
    // making the headers
    let previewHeaders = ["allyEffPreviewHeader", "enemyEffPreviewHeader"];
    previewHeaders.forEach((header, index) => {
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
    // adding hr line
    const pathfinderEffectivenessPreview = getID(
      "pathfinderEffectivenessPreview"
    );
    let pfEffPreviewHr = createEl("hr");
    pfEffPreviewHr.setAttribute("class", "hr");
    pathfinderEffectivenessPreview.appendChild(pfEffPreviewHr);
    // info
    let pathfinderInfo = createEl("div");
    pathfinderInfo.setAttribute("id", "pathfinderInfo");
    pfContent.appendChild(pathfinderInfo);
    // container
    let infoContainer = createEl("div");
    infoContainer.setAttribute("class", "container");
    pathfinderInfo.appendChild(infoContainer);
    // quote
    let infoQuote = createEl("p");
    infoQuote.setAttribute("id", "pathfinderQuote");
    infoQuote.textContent = characters[0].quote; // default
    infoContainer.appendChild(infoQuote);
    // desc
    let infoDesc = createEl("p");
    infoDesc.setAttribute("id", "pathfinderDescription");
    infoDesc.textContent = characters[0].desc; // default
    infoContainer.appendChild(infoDesc);

    // skills
    let pathfinderSkills = createEl("div");
    pathfinderSkills.setAttribute("id", "pathfinderSkills");
    pfContent.appendChild(pathfinderSkills);
    // skills container
    let skillsContainer = createEl("div");
    skillsContainer.setAttribute("class", "container");
    pathfinderSkills.appendChild(skillsContainer);

    // create skills
    this.displaySkills(0);

    // battleformation layout
    let pathfinderBfLayout = createEl("div");
    pathfinderBfLayout.setAttribute("id", "pathfinderBfLayout");
    pfContent.appendChild(pathfinderBfLayout);
    // container
    let bfLayoutContainer = createEl("div");
    bfLayoutContainer.setAttribute("class", "container");
    pathfinderBfLayout.appendChild(bfLayoutContainer);
    // preview
    let bfLayoutPreview = createEl("div");
    bfLayoutPreview.setAttribute("id", "pathfinderBfLayoutPreview");
    bfLayoutContainer.appendChild(bfLayoutPreview);
    // preview wrapper
    let bfLayoutPreviewWrapper = createEl("div");
    bfLayoutPreviewWrapper.setAttribute("class", "wrapper");
    bfLayoutPreview.appendChild(bfLayoutPreviewWrapper);

    let layoutSlots = ["E", "E", "E", "E"];
    layoutSlots.forEach((slot, index) => {
      let elem = createEl("span");
      elem.setAttribute("id", "previewSlot" + `${slot}${index}`);
      elem.setAttribute("class", "slot");
      bfLayoutPreviewWrapper.appendChild(elem);

      // making the inner where the icon will be changed dynamically
      // depending on the pathfinder screen youre on. layoutslots will be dynamically changed aswell
      let elemInner = createEl("span");
      elemInner.setAttribute("class", "pathfinderSlotIcon");
      elem.appendChild(elemInner);
    });

    // finalize
    let bfLayoutFinalize = createEl("div");
    bfLayoutFinalize.setAttribute("id", "pathfinderBfLayoutFinalize");
    bfLayoutContainer.appendChild(bfLayoutFinalize);

    /*
    let finalizeButton = new Button.custom({
      id: "pick",
    });
    */

    /*
      characters.skills.forEach((skill) => {
        let elem = makeSkillPreview(
          skill.id,
          skill.name,
          skill.available
        );
        skillsContainer.appendChild(elem);
      });

      function makeSkillPreview(id, name, available) {
        let elem = createEl("div");
        elem.setAttribute("id", id);

        let name = createEl("div");
      }
      */
  },
  displaySkills: function (i) {
    const skillsContainer = getQuerySelector("#pathfinderSkills .container");
    skillsContainer.innerHTML = "";
    characters[i].skills.forEach((skill) => {
      let elem = createEl("div");
      elem.setAttribute("id", skill.id);
      elem.setAttribute("class", "skill");
      skillsContainer.appendChild(elem);

      let iconContainer = createEl("div");
      iconContainer.setAttribute("class", "iconContainer");
      elem.appendChild(iconContainer);

      let elemIcon = createEl("img");
      elemIcon.setAttribute("id", "skillIcon");
      elemIcon.src = skill.icon;
      iconContainer.appendChild(elemIcon);

      let name = createEl("span");
      name.setAttribute("class", "name");
      name.textContent = skill.name;
      elem.appendChild(name);
    });
  },
  changeActive: function (char, index) {
    const headerTitle = getQuerySelector(
        "#pathfinderHeader .container #pathfinderTitle"
      ),
      classIcon = getQuerySelector(
        "#pathfinderHeader .container .wrapper #pathfinderClassIcon"
      ),
      classText = getQuerySelector(
        "#pathfinderHeader .container .wrapper #pathfinderClassText"
      ),
      quote = getQuerySelector("#pathfinderInfo .container #pathfinderQuote"),
      desc = getQuerySelector(
        "#pathfinderInfo .container #pathfinderDescription"
      );
    const allyEffPreviewHeader = getID("allyEffPreviewHeader");
    const enemyEffPreviewHeader = getID("enemyEffPreviewHeader");

    // sets values
    headerTitle.textContent = char.name;
    classIcon.src = char.icon;
    classText.textContent = char.class;
    quote.textContent = char.quote;
    desc.textContent = char.desc;
    this.displaySkills(index);

    // todo, get object index inside arrray thing here::::
    // https://stackoverflow.com/questions/7176908/how-can-i-get-the-index-of-an-object-by-its-property-in-javascript/22864817#22864817
    // theoretically would fetch the info from an array about the heroes effectiveness
    // on specific positions in the battleformation layout.
    // weighing values on the 4 different slots a hero can be in,
    // depending on what pathfinder it is, like for example the paragon
    // should be more effective on the rightmost slot/ first slot because he is a tank.
    // but he should also be slightly less effective on the 2nd slot.
  },
  getEffectivePosition: function (num) {
    const things = num.split(/[,]/);
    for (let i = 0; i < things.length; i++) {
      let splitNum = things[i];
      console.log(splitNum);
    }
  },
  setDocumentTitle: function () {
    document.title = "choose your characters";
  },
  finalizeChosenPathfinders: function () {
    for (let pathfinder in this.chosenPathfinders) {
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
        // trait.condition() is just getting the condition from the object
        SM.addTrait(pathfinder, trait.name);
      }
    }
  },
};

/**
 * shrine of abyss / metaprogression
 */
let metaProgression = {
  init: function () {},
  launch: function () {
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    if (Journey.activeModule == "metaProgression") {
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
 * im gonna change the available functions
 * to return a SM.get skill and available value later
 *
 * ally layout
 * 1-br, 2-br, 3-fr, 4-fr
 *
 * enemy layout
 * 1-fr, 2-fr, 3-br, 4-br
 */
let characters = [
  {
    name: "The Pugilist",
    id: "thePugilistPreview",
    icon: "img/thePugilist.png",
    class: "fist",
    quote: '"fillThisInWithQuoteLater"',
    desc: "fillThisInWithDescLater",
    effectiveAllyPos: "3,4",
    effectiveEnemyPos: "1,2",
    available: function () {
      return true;
    },
    skills: [
      {
        name: "Leg Breaker",
        id: "lbPreview",
        icon: "img/placeholderSkillIcon.png",

        // 40% chance of disabling enemy for 1 turn + low-lowmedium dmg
      },
      {
        name: "Fire Fist",
        id: "ffPreview",
        icon: "img/placeholderSkillIcon.png",
        // hit enemy 1 time with a fire fist, low-medium dmg
      },
      {
        name: "Crushing Uppercut",
        id: "cuPreview",
        icon: "img/placeholderSkillIcon.png",
        // hit enemy 1 time with a uppercut,
        // 25% chance of concussion which gives the "confused" buff on target
      },
      {
        name: "Burst Combo",
        id: "bcPreview",
        icon: "img/placeholderSkillIcon.png",
        // hits enemy 2-5 times, low damage
      },
      {
        name: "Meteor Strike",
        id: "msPreview",
        icon: "img/placeholderSkillIcon.png",
        // hits 1 time heavy damage
      },
      {
        name: "Demon Assault",
        id: "daPreview",
        icon: "img/placeholderSkillIcon.png",
        // hits 3-5 times low-medium damage
      },
    ],
  },
  {
    name: "The Faceless",
    id: "theFacelessPreview",
    icon: "img/theFaceless.png",
    class: "light",
    quote: '"fillThisInWithQuoteLater"',
    desc: "fillThisInWithDescLater",
    available: function () {
      return true;
    },
    skills: [
      {
        name: "Blade Flurry",
        id: "bladeFlurry",
        icon: "img/placeholderSkillIcon.png",
        // hits an enemy 3-5 times, low dmg
      },
      {
        name: "Poison fan",
        id: "poisonFan",
        icon: "img/placeholderSkillIcon.png",
        // hits all 4 enemies with kunais', %chance of gaining "Poisoned"
      },
      {
        name: "Vanishing Strike",
        id: "vanishingStrike",
        icon: "img/placeholderSkillIcon.png",
        // you disappear for 1 round charging up and attacking in the 2nd round
      },
      {
        name: "Blinding dagger",
        id: "blindingDagger",
        icon: "img/placeholderSkillIcon.png",
        // 45% chance of target reciving the "blind" buff.
      },
      {
        name: "Mirage Step",
        id: "mirageStep",
        icon: "img/placeholderSkillIcon.png",
        // makes you invunerable for 1 turn
      },
      {
        name: "Eviscerate",
        id: "eviscerate",
        icon: "img/placeholderSkillIcon.png",
        // strikes an enemy in the neck with a heavily damaging attack.
      },
    ],
  },
  {
    name: "The Occultist",
    id: "theOccultistPreview",
    icon: "img/theOccultist.png",
    class: "light",
    quote: '"fillThisInWithQuoteLater"',
    desc: "fillThisInWithDescLater",
    available: function () {
      return true;
    },
    skills: [
      {
        name: "Soul Siphon",
        id: "soulSiphon",
        icon: "img/placeholderSkillIcon.png",
      },
      {
        name: "Essence Drain",
        id: "essenceDrain",
        icon: "img/placeholderSkillIcon.png",
      },
      {
        name: "Curse of Darkness",
        id: "curseOfDarkness",
        icon: "img/placeholderSkillIcon.png",
      },
      {
        name: "Forbidden Knowledge",
        id: "forbiddenKnowledge",
        icon: "img/placeholderSkillIcon.png",
      },
      /*
      {
        name: "Eldritch Shield",
        id: "eldritchShield",
        icon: "img/placeholderSkillIcon.png",
      },
      */
      {
        name: "Eldritch Reckoning",
        id: "eldritchReckoning",
        icon: "img/placeholderSkillIcon.png",
        // base dmg 15
        // for each cursestack applied.,
        // base dmg will increase incrementally by 0.15x
      },
    ],
  },
  {
    name: "The Paragon",
    id: "theParagonPreview",
    icon: "img/theParagon.png",
    class: "heavy",
    quote: '"fillThisInWithQuoteLater"',
    desc: "fillThisInWithDescLater",
    available: function () {
      return true;
    },
    skills: [
      {
        name: "shield bash",
        id: "shieldBash",
        icon: "img/placeholderSkillIcon.png",
        // hits designated enemy with a shield
      },
      {
        name: "Bulwark Slam",
        id: "bulkwarkSlam",
        icon: "img/placeholderSkillIcon.png",
        // slams an enemy
      },
      {
        name: "Shield Wall",
        id: "shieldWall",
        icon: "img/placeholderSkillIcon.png",
        // choose an ally to protect 1 attack from an enemy
      },
      {
        name: "Paragon's Resolve",
        id: "paragonsResolve",
        icon: "img/placeholderSkillIcon.png",
        // buffs defence for the ally behind you and yourself
      },
      {
        name: "Titan's Fury",
        id: "titansFury",
        icon: "img/placeholderSkillIcon.png",
        // attack the enemy with a titan's fury, hitting 2-3 times.
      },
    ],
  },
  {
    name: "The Blatherer",
    id: "theBlathererPreview",
    icon: "img/theBlatherer.png",
    class: "heavy",
    quote: '"fillThisInWithQuoteLater"',
    desc: "fillThisInWithDescLater",
    available: function () {
      return false;
    },
    skills: [
      {
        name: "Crushing Blows",
        id: "crushingBlows",
        icon: "img/placeholderSkillIcon.png",
        // hits 2 crushing blows on an enemy
      },
      {
        name: "Head Splitter",
        id: "headSplitter",
        icon: "img/placeholderSkillIcon.png",
        // hit 1 heavily damaging move on an enemy
      },
      {
        name: "War Cry",
        id: "warCry",
        icon: "img/placeholderSkillIcon.png",
        // increases dmg for 2 turns
      },
      {
        name: "Mighty Swing",
        id: "mightySwing",
        icon: "img/placeholderSkillIcon.png",
        // mighty swing
      },
      {
        name: "Earthquake",
        id: "earthquake",
        icon: "img/placeholderSkillIcon.png",
        // do damage to 3 the front 3 enemies
      },
    ],
  },
  {
    name: "The Knight",
    id: "theKnightPreview",
    icon: "img/theKnight.png",
    class: "medium",
    quote: '"fillThisInWithQuoteLater"',
    desc: "fillThisInWithDescLater",
    available: function () {
      return false;
    },
    skills: [
      {
        name: "Valiant Strike",
        id: "valiantStrike",
        icon: "img/placeholderSkillIcon.png",
      },
      {
        name: "Holy Retribution",
        id: "holyRetribution",
        icon: "img/placeholderSkillIcon.png",
      },
      {
        name: "Pommel Strike",
        id: "pommelStrike",
        icon: "img/placeholderSkillIcon.png",
      },
      {
        name: "Holy Blessing",
        id: "holyBlessing",
        icon: "img/placeholderSkillIcon.png",
      },
      {
        name: "Surge of Action",
        id: "surgeOfAction",
        icon: "img/placeholderSkillIcon.png",
      },
      {
        name: "crusade",
        id: "crusade",
        icon: "img/placeholderSkillIcon.png",
      },
    ],
  },
];

/**
 * traits are small boosts or decreases in power that each pathfinder has 4 of,
 * each pathfinder will get 1 positive and 1 negative trait that have a small
 * effect on gameplay and the character, your character will display the
 */
let Traits = [
  // positives
  {
    name: "lucky",
    desc: "bask in luck's glow, for blessings' overflow.",
    condition: function () {
      return Journey.activeModule == PathfinderSelector;
    },
    // you have a slightly higher chance of getting good pathEvents or nodeEvents
  },
  {
    name: "hoarder",
    desc: "you somehow find ways to carry more",
    condition: function () {
      return Journey.activeModule == PathfinderSelector;
    },
    // increases inventory space by a small amount
  },
  {
    name: "individualist",
    desc: "doing things alone yields greater experience",
    condition: function () {
      return Journey.activeModule == PathfinderSelector;
    },
  },
  // start of negatives
  {
    name: "restless",
    desc: "you find it harder to rest properly",
    condition: function () {
      return Journey.activeModule == PathfinderSelector;
    },
    // you will heal slightly less with potions
  },
  {
    name: "blighted",
    desc: "fortune frowns, your luck goes down",
    condition: function () {
      return Journey.activeModule == PathfinderSelector;
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
    elem.setAttribute("id", "pings");
    const container = getID("container");
    container.insertBefore(elem, container.firstChild);

    let fade = createEl("div");
    fade.setAttribute("id", "fade");
    //elem.appendChild(fade);
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
  components: {},
  init: function () {
    let categories = [
      "features", // locations, etc.
      "game", // more specific stuff. candles in purgatory lit, etc.
      "entities", // generated enemies will be instantiated inside the entities category
      "character", // characters, boons, flaws, perks, health, stats and such.
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
    this.set("ver", Main.version);
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
  // custom methods for adding specific things
  addTrait: function (char, trait) {
    this.set("character." + char + "." + "traits." + trait, true);
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
 * note to self, oop everything cuh
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
 *
 * todo  4/9/2024
 * finish pathfinder selection screen, meaning adding the changeActive method
 * to change info of pathfinder depending on which pathfinder ur selected on.
 *
 * fix the available return function on each pathfinder,
 * make it like the SM.get("prefs.autosave"), maybe a tertiary?
 */
