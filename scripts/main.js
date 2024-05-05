/**
 * main
 * gameloop shit, handles changing from different modules
 */
const Main = {
  version: 0.72,
  demo: true,
  autoSaveDelay: 60000,
  ready: false,
  activeModule: null,

  modules: {
    Intro: Intro,
    SinSelection: SinSelection,
    Region: Region,
    Interstice: Interstice,
  },

  init: function () {
    this.ready = true;
    this.render();
    SaveManager.loadGame();
    PM.init();
    SM.init();

    PM.ping("beware of bugs");

    if (!SM.get("engine.activeModule")) {
      SM.set("engine.activeModule", this.modules.Intro);
    }

    let moduleName = SM.get("engine.activeModule");
    let module;

    if (typeof moduleName === "string") {
      module = moduleName.split(".").reduce(this.indexModule, this.modules);
    } else {
      module = moduleName;
    }

    if (typeof module !== "undefined") {
      try {
        this.changeModule(module);
      } catch (err) {
        console.error("error loading module:", err);
      }
    } else {
      console.error("module undefined:", moduleName);
    }

    this.setDefaultPreferences();

    // preferences
    if (SM.get("prefs.autosave")) {
      setInterval(() => {
        SaveManager.saveGame();
      }, this.autoSaveDelay);
    } else {
      PM.ping("autosave is off");
    }
  },
  render: function () {
    const container = getID("container");

    let content = createEl("div");
    content.setAttribute("id", "content");
    container.appendChild(content);

    let locationHeader = createEl("div");
    locationHeader.setAttribute("id", "locationHeader");
    content.appendChild(locationHeader);

    let view = createEl("div");
    view.id = "view";
    content.appendChild(view);

    this.createNavbar();
    SaveManager.createSaved();
  },
  changeLocationHeader: function (string) {
    let locationHeader = getID("locationHeader");
    string = uppercaseify(string);
    locationHeader.textContent = string;
  },
  clearModuleView: function () {
    const parent = getID("view");
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  },
  update: function () {
    switch (this.activeModule) {
      case SinSelection:
        SinSelection.init();
        break;
      case Region:
        Region.init();
        break;
      case Interstice:
        Interstice.init();
        break;
      default:
        Intro.init();
        break;
    }
  },
  indexModule: function (obj, i) {
    return obj[i];
  },
  changeModule: function (module) {
    if (this.activeModule === module) {
      return;
    }
    //console.log(module);
    this.clearModuleView();
    this.activeModule = module;
    this.update();
    module.launch();
    SM.set("engine.activeModule", module.name);
  },
  createGuid: function () {
    let pattern = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    let result = "";
    for (let i = 0; i < pattern.length; i++) {
      let c = pattern[i];
      if (c === "x" || c === "y") {
        let r = Math.floor(Math.random() * 16);
        let v = c === "x" ? r : (r & 0x3) | 0x8;
        result += v.toString(16);
      } else {
        result += c;
      }
    }
    return result;
  },
  createNavbar: function () {
    let navbarInfo = [
      { id: "navbarGithub", text: "github." },
      { id: "navbarDelete", text: "(warning) erase save." },
      { id: "navbarResetRun", text: "reset run." },
      { id: "navbarCheatExplore", text: "(cheat) explore." },
      //{ id: "navbarAchievements", text: "achievements." },
      //{ id: "navbarSettings", text: "settings." },
    ];

    function createLinks(id, text) {
      let link = createEl("span");
      link.setAttribute("id", id);
      link.className = "link";
      link.textContent = text;
      return link;
    }

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

    const github = getID("navbarGithub");
    github.addEventListener("click", () => {
      window.open("https://github.com/raincuhh");
    });

    const deleteSave = getID("navbarDelete");
    deleteSave.addEventListener("click", () => {
      SaveManager.deleteGame();
    });
    const resetRun = getID("navbarResetRun");
    resetRun.addEventListener("click", () => {
      Region.resetRun();
    });
    const cheatExplore = getID("navbarCheatExplore");
    cheatExplore.addEventListener("click", () => {
      Region.explore();
    });
  },
  error: function () {
    console.log("error");
  },
  setDefaultPreferences: function () {
    SM.setMany({
      "prefs.autosave": true,
      "prefs.darkmode": true,
    });
  },
};
