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
    arrivalPing:
      "As the caravan halts, ominous figures emerge in the distance.",
    leavePing: "Triumphant, your party emerges victorious from the encounter.",
    inItPing: "The battle rages on as the creatures draw nearer.",
  },
  {
    type: "goblinMarket",
    probability: 0.125,
    combat: false,
    arrivalPing:
      "The caravan comes to a halt before a bustling market. A goblin approaches, offering goods.",
    leavePing: "Satisfied or not, your party departs from the market.",
    inItPing: "You scour the market in search of treasures.",
  },
  {
    type: "fortuneCache",
    probability: 0.125,
    combat: false,
    arrivalPing: "In front of the caravan lies an inconspicuous crate.",
    leavePing:
      "Departing with the newfound goods, the caravan remains oblivious to their origin.",
    inItPing: "Curiosity piqued, you inspect the old crate.",
  },
  {
    type: "wanderingMerchant",
    probability: 0.125,
    combat: false,
    arrivalPing:
      "A mysterious stranger halts before the caravan, proposing a trade.",
    leavePing: "With the trade complete, the caravan resumes its journey.",
    inItPing: "You peruse a selection of intriguing items.",
  },
  {
    type: "samaritansAid",
    probability: 0.125,
    combat: false,
    arrivalPing:
      "In the distance, some individuals beckon for assistance, a mix of worry and relief on their faces.",
    leavePing: "Continuing onward, the caravan lightens its load.",
    inItPing:
      "The weary travelers gaze at the pathfinders with hopeful anticipation.",
  },
];

const specialNodeTypesPool = [
  {
    type: "shrineOfAbyss",
    combat: true,
    arrivalPing:
      "As the caravan halts, you find yourself before an imposing shrine.",
    leavePing: "With your business concluded, you leave the shrine.",
    inItPing:
      "You stand within the solemn halls of the shrine, contemplating your choices.",
  },
  {
    type: "respite",
    combat: false,
    arrivalPing: "The caravan comes to a peaceful stop at a restful oasis.",
    leavePing:
      "Refreshed and reinvigorated, the caravan resumes its journey from the respite.",
    inItPing: "You take a moment to unwind and recover at the restful respite.",
  },
  {
    type: "regionCheck",
    combat: true,
    arrivalPing:
      "As you venture into the new region, the air crackles with tension. infront of you lies the abyss's test",
    leavePing:
      "Leaving behind the trials of the region, the caravan pushes forwards.",
    inItPing:
      "You steel yourself for the trials ahead as you travel further towards the abyss.",
  },
  {
    type: "sinBoss",
    combat: true,
    arrivalPing: "A sinister presence looms as you approach the abyss.",
    leavePing:
      "Victorious, you emerge from the abyss, triumphant over darkness.",
    inItPing: "With resolve, you peer into the abyss.",
  },
  {
    type: "sinMinions",
    combat: true,
    arrivalPing:
      "The creatures of the abyss swarm you, heralding danger and chaos.",
    leavePing:
      "Defeating the creatures of the abyss, you press onward, determined to confront greater evils.",
    inItPing:
      "Surrounded by the creatures of the abyss, you brace yourself for the impending battle.",
  },
];
