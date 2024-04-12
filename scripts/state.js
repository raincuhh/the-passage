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
    if (typeof value === "num" && value > this.maxValue) {
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
    this.set(
      "character." + pathfinder + ".skills." + skill.name + ".locked",
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
    this.set("character." + pathfinder + ".stats." + stat, value);
  },
};
