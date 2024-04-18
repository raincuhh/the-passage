/**
 * main
 * handles general things
 */
let Main = {
  version: 1.0,
  beta: true,
  autoSaveDelay: 60000,

  init: function () {
    Main.ready = true;
    this.render(); // makes view
    SaveManager.loadGame(); // load game
    PM.init(); // pingsManager
    SM.init(); // stateManager
    GM.init();

    // settings preferences
    if (SM.get("prefs.autosave")) {
      setInterval(() => {
        SaveManager.saveGame();
      }, this.autoSaveDelay);
    } else {
      PM.ping(
        "autosave is off, remember to save your progress manually, or turn on autosave in settings"
      );
    }

    /*
     console.log(PathfinderCharLib);
     console.log(PathfinderTraitsLib);
     */
  },
  render: function () {
    let view = createEl("div");
    view.id = "view";
    const CONTAINER = getID("container");
    CONTAINER.appendChild(view);

    this.createNavbar();
    SaveManager.createSaved();
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
    let navbarInfo = [
      { id: "navbarDelete", text: "delete." },
      { id: "navbarGithub", text: "github." },
      { id: "navbarAchievements", text: "achievements." },
      { id: "navbarSettings", text: "settings." },
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
};
