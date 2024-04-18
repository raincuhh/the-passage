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
  init: function () {
    //SinSelection.init();
    if (!SM.get("gameState.activeModule")) {
      SM.set("gameState.activeModule", "Intro");
      console.log("set base State Intro");
    }
    let moduleName = SM.get("gameState.activeModule");
    let module = eval(moduleName);
    if (typeof module !== "undefined") {
      this.changeModule(module);
    } else {
      console.error("module undefined:", moduleName);
    }
    /*
    PartySelection.init();
    if (SM.get("locations.formParty")) {
      metaProgression.init();
    }
    if (metaProgression.finished) {
    }
    */

    //this.changeModule(PartySelection);
  },
  update: function () {
    switch (this.activeModule) {
      case PartySelection:
        this.changeModule(PartySelection);
        break;
      default:
        this.changeModule(Intro);
        break;
    }
  },

  reset: function () {},
  startRun: function () {
    SinSelection.init();
  },

  changeModule: function (module) {
    /*
    if (!Modules.hasOwnProperty(module)) {
      console.error("module not found: ", module);
      return;
    }
    */
    if (GM.activeModule === module) {
      return;
    }
    GM.activeModule = module;
    //this.Modules[module].launch();
    module.launch();
    //console.log("active module is:");
    //console.log(this.activeModule);
  },
};
