/**
 * gameManager module
 * handles starting runs, resetting runs, unlocking locations,
 * and the beforeJourney actions such as choosing which cardinal sin,
 * and choosing party layout.
 */
/*
const Modules = {
  Intro: Intro,
  SinSelection: SinSelection,
  PartySelection: PartySelection,
  ShrineOfAbyss: ShrineOfAbyss,
};
*/

let GM = {
  activeModule: null,

  modules: {
    Intro: Intro,
    SinSelection: SinSelection,
    PartySelection: PartySelection,
    ShrineOfAbyss: ShrineOfAbyss,
  },
  init: function () {
    if (!SM.get("gameState.activeModule")) {
      SM.set("gameState.activeModule", "Intro");
      console.log("set base State Intro");
    }
    let moduleName = SM.get("gameState.activeModule");
    console.log(moduleName);
    let module;
    if (typeof moduleName === "string") {
      module = moduleName.split(".").reduce(this.indexModule, this.modules);
      console.log("module is a string");
    } else {
      module = moduleName;
      console.log("module is not a string");
    }
    if (typeof module !== "undefined") {
      try {
        this.changeModule(module);
      } catch (err) {
        console.error("error loading module: " + err);
      }
    } else {
      console.error("module undefined:", moduleName);
    }
  },
  update: function () {
    switch (this.activeModule) {
      case SinSelection:
        SinSelection.init();
        break;
      case PartySelection:
        PartySelection.init();
        break;
      case ShrineOfAbyss:
        ShrineOfAbyss.init();
        break;
      case Region:
        Region.init();
      case Interstice:
        Interstice.init();
      default:
        Intro.init();
        break;
    }
  },
  indexModule: function (obj, i) {
    return obj[i];
  },
  changeModule: function (module) {
    if (GM.activeModule === module) {
      return;
    }
    GM.activeModule = module;
    this.update();
    module.launch();
    //console.log("switched to module:", module.name);
    SM.set("gameState.activeModule", module.name);
  },
};
