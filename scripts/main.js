/**
 * main
 * handles gameloop
 */
const Main = {
  version: 0.29,
  beta: true,
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
    PM.init(); // pingsManager
    SM.init(); // outer stateManager

    if (!SM.get("run.activeModule")) {
      SM.set("run.activeModule", "Intro");
    }
    let moduleName = SM.get("run.activeModule");
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
      PM.ping(
        "autosave is off, remember to save your progress manually, or turn on autosave in settings"
      );
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
    SM.set("run.activeModule", module.name);
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
      { id: "navbarDelete", text: "delete." },
      { id: "navbarGithub", text: "github." },
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

    const LINKGITHUB = getID("navbarGithub");
    LINKGITHUB.addEventListener("click", () => {
      window.open("https://github.com/raincuhh");
    });
    const LINKACHIEVEMENTS = getID("navbarAchievements");
    if (LINKACHIEVEMENTS) {
      LINKACHIEVEMENTS.addEventListener("click", () => {
        console.log("achievements");
      });
    }

    const LINKSETTINGS = getID("navbarSettings");
    if (LINKSETTINGS) {
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
    }

    const DELETE = getID("navbarDelete");
    DELETE.addEventListener("click", () => {
      SaveManager.deleteGame();
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
  setDefaultPreferences: function () {
    SM.setMany({
      "prefs.autosave": true,
      "prefs.darkmode": true,
    });
  },
};
