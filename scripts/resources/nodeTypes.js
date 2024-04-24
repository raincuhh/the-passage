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
    arrivalPing: "the caravan stops, some creatures are lurking",
    leavePing: "your party prevails against the creatures.",
    inItPing: "the battle continues, the creatures are getting closer",
  },
  {
    type: "goblinMarket",
    probability: 0.125,
    combat: false,
    arrivalPing:
      "the caravan stops, infront is a market, a goblin walks up and offers goods",
    leavePing:
      "your party leaves the market, content with or without your goods",
    inItPing: "you look around in the market, hoping to find something",
  },
  {
    type: "fortuneCache",
    probability: 0.125,
    combat: false,
    arrivalPing: "the caravan stops infront of a inconspicuous crate",
    leavePing:
      "the caravan leaves with the goods, not knowing where it came from or who placed it there",
    inItPing: "you look towards the old crate",
  },
  {
    type: "wanderingMerchant",
    probability: 0.125,
    combat: false,
    arrivalPing: "",
    leavePing: "",
    inItPing: "",
  },
  {
    type: "samaritansAid",
    probability: 0.125,
    combat: false,
    arrivalPing: "",
    leavePing: "",
    inItPing: "",
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
    arrivalPing: "",
    leavePing: "",
    inItPing: "",
  },
  {
    type: "respite",
    combat: false,
    arrivalPing: "",
    leavePing: "",
    inItPing: "",
  },
  {
    type: "regionCheck",
    combat: true,
    arrivalPing: "",
    leavePing: "",
    inItPing: "",
  },
  {
    type: "sinBoss",
    combat: true,
    arrivalPing: "",
    leavePing: "",
    inItPing: "",
  },
  {
    type: "sinMinions",
    combat: true,
    arrivalPing: "",
    leavePing: "",
    inItPing: "",
  },
];
