/**
 * gameManager module
 * handles starting runs, resetting runs, unlocking locations,
 * and the beforeJourney actions such as choosing which cardinal sin,
 * and choosing party layout.
 */
let GM = {
  activeModule: null,
  init: function () {
    //sinSelection.init();
    partySelection.init();
    if (SM.get("features.locations.formParty")) {
      metaProgression.init();
    }
    if (metaProgression.finished) {
    }

    this.changeModule(partySelection);
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
