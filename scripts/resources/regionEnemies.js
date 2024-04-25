/**
 * resource with all region based enemies. gets region enemies on map generation
 */
const RegionEnemyPool = {
  theWasteland: [
    {
      //type: Region.enemyTypes.toxic,
      name: "wanderer",
      probability: 0.2,
    },
    {
      //type: Region.enemyTypes.toxic,
      name: "scavenger",
      probability: 0.4,
    },
    {
      //type: Region.enemyTypes.toxic,
      name: "creeper",
      probability: 0.1,
    },
    {
      //type: Region.enemyTypes.toxic,
      name: "waste",
      probability: 0.3,
    },
  ],
  theTundra: [
    {
      //type: Region.enemyTypes.ice,
      name: "revenant",
      probability: 0.2,
    },
    {
      //type: Region.enemyTypes.ice,
      name: "frostbittenLurker",
      probability: 0.4,
    },
    {
      //type: Region.enemyTypes.ice,
      name: "shiveringSpectre",
      probability: 0.2,
    },
    {
      //type: Region.enemyTypes.ice,
      name: "lich",
      probability: 0.2,
    },
  ],
  theForest: [
    {
      //type: Region.enemyTypes.toxic,
      name: "thornedAbomination",
      probability: 0.2,
    },
    {
      //type: Region.enemyTypes.toxic,
      name: "wraithNymph",
      probability: 0.2,
    },
    {
      //type: Region.enemyTypes.toxic,
      name: "forestCreature",
      probability: 0.3,
    },
    {
      //type: Region.enemyTypes.toxic,
      name: "swamper",
      probability: 0.3,
    },
  ],
  theLowlands: [
    {
      //type: Region.enemyTypes.undead,
      name: "sentinel",
      probability: 0.1,
    },
    {
      //type: Region.enemyTypes.undead,
      name: "abberation",
      probability: 0.2,
    },
    {
      //type: Region.enemyTypes.undead,
      name: "wraith",
      probability: 0.4,
    },
    {
      //type: Region.enemyTypes.undead,
      name: "apparition",
      probability: 0.3,
    },
  ],
  theForgottenValley: [
    {
      //type: Region.enemyTypes.undead,
      name: "emissary",
      probability: 0.1,
    },
    {
      //type: Region.enemyTypes.undead,
      name: "vagabond",
      probability: 0.3,
    },
    {
      //type: Region.enemyTypes.undead,
      name: "banshee",
      probability: 0.2,
    },
    {
      //type: Region.enemyTypes.undead,
      name: "ghoul",
      probability: 0.4,
    },
  ],
  theAbyss: [
    {
      //type: Region.enemyTypes.dark,
      name: "kraken",
      probability: 0.1,
    },
    {
      //type: Region.enemyTypes.dark,
      name: "voidWalker",
      probability: 0.4,
    },
    {
      //type: Region.enemyTypes.dark,
      name: "lurker",
      probability: 0.4,
    },
    {
      //type: Region.enemyTypes.dark,
      name: "abomination",
      probability: 0.1,
    },
  ],
};
