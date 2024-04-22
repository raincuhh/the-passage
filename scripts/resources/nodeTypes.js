/**
 * nodeTypesPool
 * all probabilties needs to have a cumulative probability of 1
 */
const NodeTypesPool = [
  {
    type: "encounter",
    probability: 0.4,
    combat: true,
  },
  {
    type: "market",
    probability: 0.1,
    combat: false,
  },
  {
    type: "theFortuneCache",
    probability: 0.1,
    combat: false,
  },
  {
    type: "theWanderingMerchant",
    probability: 0.05,
    combat: false,
  },
  {
    type: "dungeon",
    probability: 0.05,
    combat: true,
  },
  {
    type: "sanctum",
    probability: 0.05,
    combat: false,
  },
  {
    type: "cryptOfTheUndead",
    probability: 0.05,
    combat: true,
  },
  {
    type: "theObservatory",
    probability: 0.05,
    combat: false,
  },
  {
    type: "theLibrary",
    probability: 0.05,
    combat: false,
  },
  {
    type: "theSamaritansAid",
    probability: 0.1,
    combat: false,
  },
];
const specialNodeTypesPool = [
  {
    type: "shrineOfAbyss",
    combat: false,
  },
  {
    type: "respite",
    combat: false,
  },
  {
    type: "regionCheck",
    combat: true,
  },
  {
    type: "sinBoss",
    combat: true,
  },
  {
    type: "sinMinions",
    combat: true,
  },
];
