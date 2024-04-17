/**
 * path types,
 * probability needs to accumulate to 1 in total
 *
 * roadEncounter and ambush are different,
 * roadEncounter takes from the regions enemyPool, while ambushes take from the ambush enemy pool.
 * ambush enemy pool are the raiders, which you can meet in any region.
 */
const PathTypesPool = [
  {
    type: "nothing",
    probability: 0.4,
  },
  {
    type: "rocky",
    probability: 0.3,
  },
  {
    type: "roadEncounter",
    probability: 0.1,
  },
  {
    type: "ambush",
    probability: 0.1,
  },
  {
    type: "elite",
    probability: 0.1,
  },
];
