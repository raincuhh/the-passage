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

const NonRegionEnemyPool = [
  {
    name: "brawler",
    probability: 0.4,
  },
  {
    name: "wanderer",
    probability: 0.3,
  },
  {
    name: "vagrant",
    probability: 0.2,
  },
  {
    name: "lost",
    probability: 0.1,
  },
];

const regionCheckPool = [
  {
    name: "chasmalHowler",
    probability: 0.2,
  },
  {
    name: "eldritchOoze",
    probability: 0.3,
  },
  {
    name: "shadowedStalker",
    probability: 0.2,
  },
  {
    name: "corruptedGuardian",
    probability: 0.3,
  },
];

const abyssMinionsPool = [
  {
    name: "abyssalCrawler",
    probability: 0.25,
  },
  {
    name: "dreadWretch",
    probability: 0.2,
  },
  {
    name: "spectralLasher",
    probability: 0.3,
  },
  {
    name: "abyssalWraith",
    probability: 0.25,
  },
];

const sinBossPool = [
  {
    name: "sloth",
    fullName: "Belial, The Demon of Sloth",
  },
  {
    name: "gluttony",
    fullName: "Beelzebub, The Lord of Gluttony",
  },
  {
    name: "lust",
    fullName: "Lilith, The Temptress of Desires",
  },
  {
    name: "greed",
    fullName: "Plutus, The Prince of Greed",
  },
  {
    name: "envy",
    fullName: "Leviathan, The Serpent of Envy",
  },
  {
    name: "pride",
    fullName: "Lucifer, The Angel of Pride",
  },
  {
    name: "wrath",
    fullName: "Satan, The Bringer of Wrath",
  },
];
