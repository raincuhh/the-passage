/**
 * resource with all region based enemies. gets region enemies on map generation
 */
const RegionEnemies = {
  theLowlands: [
    {
      type: "",
      name: "corrodedSentinel",
    },
    {
      type: "",
      name: "abberation",
    },
  ],
  theEnamelZone: [
    {
      type: "",
      name: "",
    },
    {
      type: "",
      name: "",
    },
  ],
  theTundra: [
    {
      type: function () {
        let types = Region.enemyEnumTypes();
        let type = types.ice;
        return type;
      },
      name: "frozenRevenant",
    },
    {
      type: function () {
        let types = Region.enemyEnumTypes();
        let type = types.ice;
        return type;
      },
      name: "frostbittenLurker",
    },
    {
      type: function () {
        let types = Region.enemyEnumTypes();
        let type = types.ice;
        return type;
      },
      name: "shiveringSpectre",
    },
    {
      type: function () {
        let types = Region.enemyEnumTypes();
        let type = types.ice;
        return type;
      },
      name: "lich",
    },
  ],
  theFlickeringForest: [
    {
      type: "grass",
      name: "thorned abomination",
    },
    {
      type: "grass",
      name: "wraithwood",
    },
  ],
  theAbyss: [
    {
      type: function () {
        let types = Region.enemyEnumTypes();
        let type = types.dark;
        return type;
      },
      name: "abyssalSpawn",
    },
    {
      type: function () {
        let types = Region.enemyEnumTypes();
        let type = types.dark;
        return type;
      },
      name: "voidWalker",
    },
    {
      type: function () {
        let types = Region.enemyEnumTypes();
        let type = types.dark;
        return type;
      },
      name: "lurker",
    },
    {
      type: function () {
        let types = Region.enemyEnumTypes();
        let type = types.dark;
        return type;
      },
      name: "crawler",
    },
  ],
};
