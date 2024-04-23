/**
 * nodeTypesPool
 * all probabilties needs to have a cumulative probability of 1
 *
 */
const NodeTypesPool = [
  {
    type: "encounter",
    probability: 0.5,
    combat: true,
  },
  {
    type: "goblinMarket",
    probability: 0.125,
    combat: false,
  },
  {
    type: "fortuneCache",
    probability: 0.125,
    combat: false,
  },
  {
    type: "wanderingMerchant",
    probability: 0.125,
    combat: false,
  },
  {
    type: "samaritansAid",
    probability: 0.125,
    combat: false,
  },
  /*
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
  */
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
