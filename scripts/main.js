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
