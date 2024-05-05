/**
 * resource with all region based enemies. gets region enemies on map generation
 */
const RegionEnemyPool = {
  theWasteland: [
    {
      name: "wanderer",
      probability: 0.2,
      stats: { hp: 25, maxHp: 25, speed: 4 },
    },
    {
      name: "scavenger",
      probability: 0.4,
      stats: { hp: 30, maxHp: 30, speed: 3 },
    },
    {
      name: "creeper",
      probability: 0.1,
      stats: { hp: 20, maxHp: 20, speed: 5 },
    },
    {
      name: "waste",
      probability: 0.3,
      stats: { hp: 22, maxHp: 22, speed: 4 },
    },
  ],
  theTundra: [
    {
      name: "revenant",
      probability: 0.2,
      stats: { hp: 24, maxHp: 24, speed: 4 },
    },
    {
      name: "Frostwyrm",
      probability: 0.4,
      stats: { hp: 28, maxHp: 28, speed: 3 },
    },
    {
      name: "spectre",
      probability: 0.2,
      stats: { hp: 22, maxHp: 22, speed: 5 },
    },
    {
      name: "lich",
      probability: 0.2,
      stats: { hp: 26, maxHp: 26, speed: 2 },
    },
  ],
  theForest: [
    {
      name: "thornedAbomination",
      probability: 0.2,
      stats: { hp: 23, maxHp: 23, speed: 4 },
    },
    {
      name: "wraithNymph",
      probability: 0.2,
      stats: { hp: 25, maxHp: 25, speed: 3 },
    },
    {
      name: "forestCreature",
      probability: 0.3,
      stats: { hp: 27, maxHp: 27, speed: 3 },
    },
    {
      name: "swamper",
      probability: 0.3,
      stats: { hp: 29, maxHp: 29, speed: 2 },
    },
  ],
  theLowlands: [
    {
      name: "sentinel",
      probability: 0.1,
      stats: { hp: 21, maxHp: 21, speed: 5 },
    },
    {
      name: "abberation",
      probability: 0.2,
      stats: { hp: 24, maxHp: 24, speed: 4 },
    },
    {
      name: "wraith",
      probability: 0.4,
      stats: { hp: 28, maxHp: 28, speed: 3 },
    },
    {
      name: "apparition",
      probability: 0.3,
      stats: { hp: 26, maxHp: 26, speed: 4 },
    },
  ],
  theForgottenValley: [
    {
      name: "emissary",
      probability: 0.1,
      stats: { hp: 20, maxHp: 20, speed: 6 },
    },
    {
      name: "vagabond",
      probability: 0.3,
      stats: { hp: 26, maxHp: 26, speed: 4 },
    },
    {
      name: "banshee",
      probability: 0.2,
      stats: { hp: 24, maxHp: 24, speed: 5 },
    },
    {
      name: "ghoul",
      probability: 0.4,
      stats: { hp: 30, maxHp: 30, speed: 3 },
    },
  ],
  theAbyss: [
    {
      name: "kraken",
      probability: 0.1,
      stats: { hp: 20, maxHp: 20, speed: 6 },
    },
    {
      name: "voidWalker",
      probability: 0.4,
      stats: { hp: 27, maxHp: 27, speed: 3 },
    },
    {
      name: "lurker",
      probability: 0.4,
      stats: { hp: 28, maxHp: 28, speed: 2 },
    },
    {
      name: "abomination",
      probability: 0.1,
      stats: { hp: 22, maxHp: 22, speed: 5 },
    },
  ],
};

const NonRegionEnemyPool = [
  {
    name: "brawler",
    probability: 0.4,
    stats: { hp: 28, maxHp: 28, speed: 4 },
  },
  {
    name: "wanderer",
    probability: 0.3,
    stats: { hp: 25, maxHp: 25, speed: 5 },
  },
  {
    name: "vagrant",
    probability: 0.2,
    stats: { hp: 22, maxHp: 22, speed: 6 },
  },
  {
    name: "lost",
    probability: 0.1,
    stats: { hp: 20, maxHp: 20, speed: 7 },
  },
];

const regionCheckPool = [
  {
    name: "howler",
    probability: 0.2,
    stats: { hp: 26, maxHp: 26, speed: 4 },
  },
  {
    name: "voidslime",
    probability: 0.3,
    stats: { hp: 28, maxHp: 28, speed: 3 },
  },
  {
    name: "stalker",
    probability: 0.2,
    stats: { hp: 24, maxHp: 24, speed: 5 },
  },
  {
    name: "darkwarden",
    probability: 0.3,
    stats: { hp: 30, maxHp: 30, speed: 3 },
  },
];

const abyssMinionsPool = [
  {
    name: "abyssalCrawler",
    probability: 0.25,
    stats: { hp: 23, maxHp: 23, speed: 5 },
  },
  {
    name: "dreadWretch",
    probability: 0.2,
    stats: { hp: 20, maxHp: 20, speed: 6 },
  },
  {
    name: "spectralLasher",
    probability: 0.3,
    stats: { hp: 26, maxHp: 26, speed: 4 },
  },
  {
    name: "abyssalWraith",
    probability: 0.25,
    stats: { hp: 24, maxHp: 24, speed: 5 },
  },
];

const sinBossPool = [
  {
    name: "sloth",
    fullName: "Belial, The Demon of Sloth",
    stats: { hp: 175, maxHp: 175, speed: 2 },
  },
  {
    name: "gluttony",
    fullName: "Beelzebub, The Lord of Gluttony",
    stats: { hp: 245, maxHp: 245, speed: 3 },
  },
  {
    name: "lust",
    fullName: "Lilith, The Temptress of Desires",
    stats: { hp: 250, maxHp: 250, speed: 4 },
  },
  {
    name: "greed",
    fullName: "Plutus, The Prince of Greed",
    stats: { hp: 320, maxHp: 320, speed: 2 },
  },
  {
    name: "envy",
    fullName: "Leviathan, The Serpent of Envy",
    stats: { hp: 352, maxHp: 352, speed: 4 },
  },
  {
    name: "pride",
    fullName: "Lucifer, The Angel of Pride",
    stats: { hp: 411, maxHp: 411, speed: 1 },
  },
  {
    name: "wrath",
    fullName: "Satan, The Bringer of Wrath",
    stats: { hp: 461, maxHp: 461, speed: 3 },
  },
];
