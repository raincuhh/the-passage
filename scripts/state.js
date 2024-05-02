/**
 * stateManager
 * generally everything gets run through here so that it can get made into a saveable state.
 *
 */
let SM = {
  maxValue: 99999999,
  components: {},
  init: function () {
    let categories = [
      "location", // locations, regions explored etc.
      "char", // PathfinderCharLib, boons, flaws, perks, health, stats and such.
      "resources", // will have inventory, and currencies made in it
      "prefs", // gamepreferences, stuff like exitWarning, lightmode, autosave, etc.
      "meta", // meta-progression, kept between runs.
      "run", // run specific stuff
      "event", // battle related stuff, specifically enemies made and their stats,
      "features", //rewards for battle, etc.
      "engine",
    ];
    for (const category of categories) {
      if (!this.get(category)) {
        this.set(category, {});
        console.log("category made: " + category);
      }
    }
    this.set("ver", Main.version);
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
    if (typeof value === "num" && value > this.maxValue) {
      value = this.maxValue;
    }
    let currentState = this.components;
    // regexp to check for ".", "[", "]", ", and '.
    const PARTS = stateName.split(/[.\[\]'"]+/);
    for (let i = 0; i < PARTS.length - 1; i++) {
      if (!currentState.hasOwnProperty(PARTS[i])) {
        currentState[PARTS[i]] = {};
      }
      currentState = currentState[PARTS[i]];
    }
    currentState[PARTS[PARTS.length - 1]] = value;
    SaveManager.saveGame();
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
      //console.log("state deleted");
    } else {
      console.log("state not found");
    }
    SaveManager.saveGame();
  },

  // specific setter and getters and other methods
  setTrait: function (pathfinder, trait, bool, includePing) {
    this.set("char.characters." + pathfinder + ".traits." + trait, bool);
    PFM.includeTraitPing(trait, includePing);
  },
  getTrait: function (pathfinder, trait) {
    try {
      return SM.get("char.characters." + pathfinder + ".traits." + trait);
    } catch (error) {
      console.error("trait not found" + error);
    }
  },
  setSkill: function (pathfinder, skill, bool, includePing) {
    this.set(
      "char.characters." + pathfinder + ".skills." + skill.name + ".locked",
      bool
    );
    PFM.includeSkillPing(skill, includePing);
  },
  setStats: function (pathfinder, stats) {
    stats.forEach((stat) => {
      this.setStat(pathfinder, stat.id, stat.value);
    });
  },
  setStat: function (pathfinder, stat, value) {
    this.set("char.characters." + pathfinder + ".stats." + stat, value);
  },
  setRegionAttr: function (region, attribute, value) {
    this.set("location.regions." + region + "." + attribute, value);
  },
};
