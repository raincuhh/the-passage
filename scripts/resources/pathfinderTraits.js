/**
 * each pathfinder has 2 default traits,
 * each pathfinder will get 1 positive and 1 negative trait that has a small, or slighty more noticable
 * change based on rarity, that influences different things.
 * the player can remove or get more traits based on stuff like items, nodeEvents, pathEvents and such.
 *
 * the traits can manipulate resistances, max hp, speed, positive and negative marks, and other niches such as inventoryspace and etc.
 */
let PathfinderTraitsLib = [
  // index 0, boons
  [
    {
      name: "packmule",
      rarity: "common",
      toolTip: "you somehow find ways to carry more",
      ping: "you feel lighter on your feet as you manage to carry more without strain",
      // +3 inventory space
    },
    {
      name: "nimble footed",
      rarity: "common",
      toolTip: "You move with unmatched agility",
      ping: "Your movements become swifter and more agile",
      // speed +3
    },
    {
      name: "evasive",
      rarity: "common",
      toolTip: "you have a knack for avoiding attacks",
      ping: "you become more elusive, making it harder for enemies to land hits on you",
      // +10% dodge chance
    },
    {
      name: "precise",
      rarity: "common",
      toolTip: "You have a steady hand and keen eye",
      ping: "your accurancy has increased, increasing your lethality in combat",
      // +5% accuracy
    },
    {
      name: "precise*",
      rarity: "rare",
      toolTip: "allows for precise and critical attacks",
      ping: "You see your strikes becoming more precise and deadly",
      // +8% crit, +10% accuracy
    },
    {
      name: "iron will",
      rarity: "common",
      toolTip: "strengthens your resolve against negative effects",
      ping: "your will strengthens, making it harder for negative effects to affect you",
      // +5% stun res, +5% mov res
    },
    {
      name: "stalwart",
      rarity: "common",
      toolTip: "boosts your physical endurance",
      ping: "you feel sturdier and more resilient, ready to withstand physical challenges",
      // +4 max hp, +4% physical res
    },
    {
      name: "swift reflexes",
      rarity: "common",
      toolTip: "Heightens your agility and reaction time",
      ping: "you feel lighter on your feet, ready to dodge incoming attacks with ease",
      // +2 speed, +5% dodge chance
    },
  ],
  // index 1, flaws
  [
    {
      name: "anemic",
      rarity: "common",
      toolTip: "you lack vitality and vigor",
      ping: "you feel weak and fatigued, making it harder to endure physical exertion",
      // -2% max hp
    },
    {
      name: "fumbler",
      rarity: "common",
      toolTip: "you tend to fumble actions more often",
      ping: "your coordination seems to suffer, leading to more frequent fumbles in your actions",
      // 40% chance of gaining the idk yet but the mark makes you have a % chance of failing your move
    },
    {
      name: "lethargic",
      rarity: "common",
      toolTip: "you lack energy and enthusiasm",
      ping: "you feel drained of energy and motivation, making it difficult to muster enthusiasm for tasks or activities",
      // -1 speed, -5% dodge chance
    },
    {
      name: "frail",
      rarity: "common",
      toolTip: "your constitution is weak",
      ping: "you feel physically fragile, making you more susceptible to injuries and ailments",
      // -2 max hp
    },
    {
      name: "restless*",
      rarity: "rare",
      toolTip: "you find it harder to rest properly",
      ping: "rest eludes you, making it difficult to fully recover during rest periods",
      // -10% heal (every source)
    },
    {
      name: "shaky hands",
      rarity: "common",
      toolTip: "your hands tremble uncontrollably",
      ping: "your hands shake uncontrollably, affecting your ability to aim steadily",
      // -5% accuracy
    },
    {
      name: "hemophilia*",
      rarity: "rare",
      toolTip: "You bleed more.",
      ping: "your blood seems to flow more freely, making you more susceptible to bleeding wounds",
      // -10% bleed res
    },
    {
      name: "brittle bones*",
      rarity: "rare",
      toolTip: "your bones are more prone to fractures",
      ping: "your bones feel fragile, making you more susceptible to fractures and injuries",
      // -10% max HP, -5% mov res
    },
    {
      name: "toxin susceptible*",
      rarity: "rare",
      toolTip: "your body reacts strongly to toxins",
      ping: "toxins affect you more severely, leading to heightened vulnerability to poisoning and other toxin-based attacks",
      // -10% poisonResistance
    },
    {
      name: "vulnerable",
      rarity: "common",
      toolTip: "You are prone to vulnerabilities",
      ping: "you feel exposed and vulnerable, making you more susceptible to various negative effects",
      // -3% to all resistances
    },
    {
      name: "scorched",
      rarity: "common",
      toolTip: "you are susceptible to burns",
      ping: "your skin feels sensitive to heat, making you more prone to burns and scalds",
      // -5% burn resistance
    },
  ],
];
