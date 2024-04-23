/**
 * pathfinder are the selectable characters you can choose 4 of
 * before the start of the game.
 * im gonna change the available functions
 * to return a SM.get skill and available value later
 *
 * ally layout
 * 1-br, 2-br, 3-fr, 4-fr
 *
 * enemy layout
 * 1-fr, 2-fr, 3-br, 4-br
 *
 * base stats that get made for each char.
 * name is name of stat
 * value is base % or num of that stat
 * stats can be either % or a number.
 */
let PathfinderCharLib = [
  {
    name: "the pugilist",
    id: "thePugilist",
    icon: "./img/thePugilist.png",
    class: "lost",
    quote:
      '"In the heat of battle, every blow tells a story of resilience and determination."',
    desc: "A seasoned fighter, the Pugilist thrives in combat, his fists weaving tales of triumph and overcoming adversity with every strike.",
    available: function () {
      return true;
    },
    skills: [
      {
        name: "leg breaker",
        id: "legBreaker",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // 40% chance of disabling enemy for 1 turn + low-lowmedium dmg
      },
      {
        name: "fire fist",
        id: "fireFist",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hit enemy 1 time with a fire fist, low-medium dmg
      },
      {
        name: "crushing uppercut",
        id: "crushingUppercut",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hit enemy 1 time with a uppercut,
        // 25% chance of concussion which gives the "confused" buff on target
      },
      {
        name: "burst combo",
        id: "burstCombo",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hits enemy 2-5 times, low damage
      },
      {
        name: "meteor strike",
        id: "meteorStrike",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // hits 1 time heavy damage
      },
      {
        name: "demon assault",
        id: "demonAssault",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // hits 3-5 times low-medium damage
      },
    ],
    stats: [
      {
        name: "hp",
        id: "healthpoints",
        value: 27,
        type: "num",
      },
      {
        name: "spd",
        id: "speed",
        value: 4,
        type: "num",
      },
      // resistances/res
      {
        name: "phys res",
        id: "physicalResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "rang res",
        id: "rangedResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "bld res",
        id: "bleedResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "psn res",
        id: "poisonResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "cld res",
        id: "coldResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "fire res",
        id: "fireResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "stun res",
        id: "stunResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "mov res",
        id: "moveResistance",
        value: 0.2,
        type: "percent",
      },
    ],
  },
  {
    name: "the faceless",
    id: "theFaceless",
    icon: "./img/theFaceless.png",
    class: "lost",
    quote: '"Discard your identity, peer into the depths of the abyss."',
    desc: "Mysterious and agile, the Faceless strikes swiftly from the shadows, wielding deadly precision and cunning tactics.",
    available: function () {
      return true;
    },
    skills: [
      {
        name: "blade flurry",
        id: "bladeFlurry",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hits an enemy 3-5 times, low dmg
      },
      {
        name: "set your sights",
        id: "setYourSights",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // sets a sight on an enemy, increasing hit accuracy by +80% for that enemy for 1 turn
      },
      {
        name: "vanishing strike",
        id: "vanishingStrike",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // you disappear for 1 round charging up and attacking in the 2nd round
      },
      {
        name: "blinding dagger",
        id: "blindingDagger",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // 45% chance of target reciving the "blind" buff.
      },
      {
        name: "mirage step",
        id: "mirageStep",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // makes you invunerable for 1 turn
      },
      {
        name: "eviscerate",
        id: "eviscerate",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // strikes an enemy in the neck with a heavily damaging attack.
      },
    ],
    stats: [
      {
        name: "hp",
        id: "healthpoints",
        value: 24,
        type: "num",
      },
      {
        name: "spd",
        id: "speed",
        value: 5,
        type: "num",
      },
      // resistances/res
      {
        name: "phys res",
        id: "physicalResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "rang res",
        id: "rangedResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "bld res",
        id: "bleedResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "psn res",
        id: "poisonResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "cld res",
        id: "coldResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "fire res",
        id: "fireResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "stun res",
        id: "stunResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "mov res",
        id: "moveResistance",
        value: 0.2,
        type: "percent",
      },
    ],
  },
  {
    name: "the occultist",
    id: "theOccultist",
    icon: "./img/theOccultist.png",
    class: "lost",
    quote:
      '"Knowledge is power, but forbidden knowledge is a double-edged sword."',
    desc: "Delving into the darkest arts, the Occultist harnesses forbidden powers to manipulate and drain the essence of their foes.",
    available: function () {
      return true;
    },
    skills: [
      {
        name: "soul siphon",
        id: "soulSiphon",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "essence drain",
        id: "essenceDrain",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "curse of darkness",
        id: "curseOfDarkness",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "forbidden knowledge",
        id: "forbiddenKnowledge",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
      },
      /*
       {
         name: "Eldritch Shield",
         id: "eldritchShield",
         icon: "./img/placeholderSkillIcon.png",
       },
       */
      {
        name: "eldritch reckoning",
        id: "eldritchReckoning",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // base dmg 15
        // for each cursestack applied.,
        // base dmg will increase incrementally by 0.15x
      },
    ],
    stats: [
      {
        name: "hp",
        id: "healthpoints",
        value: 21,
        type: "num",
      },
      {
        name: "spd",
        id: "speed",
        value: 3,
        type: "num",
      },
      // resistances/res
      {
        name: "phys res",
        id: "physicalResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "rang res",
        id: "rangedResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "bld res",
        id: "bleedResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "psn res",
        id: "poisonResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "cld res",
        id: "coldResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "fire res",
        id: "fireResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "stun res",
        id: "stunResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "mov res",
        id: "moveResistance",
        value: 0.2,
        type: "percent",
      },
    ],
  },
  {
    name: "the paragon",
    id: "theParagon",
    icon: "./img/theParagon.png",
    class: "lost",
    quote: '"Stand proud, for valor and honor are our shields."',
    desc: "A bastion of strength and resilience, the Paragon defends allies with unwavering courage and unmatched determination.",
    available: function () {
      return true;
    },
    skills: [
      {
        name: "shield bash",
        id: "shieldBash",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hits designated enemy with a shield
      },
      {
        name: "bulwark slam",
        id: "bulkwarkSlam",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // slams an enemy
      },
      {
        name: "shield wall",
        id: "shieldWall",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // choose an ally to protect 1 attack from an enemy
      },
      {
        name: "paragons resolve",
        id: "paragonsResolve",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // buffs defence for the ally behind you and yourself
      },
      {
        name: "titans fury",
        id: "titansFury",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // attack the enemy with a titan's fury, hitting 2-3 times.
      },
    ],
    stats: [
      {
        name: "hp",
        id: "healthpoints",
        value: 37,
        type: "num",
      },
      {
        name: "spd",
        id: "speed",
        value: 2,
        type: "num",
      },
      // resistances/res
      {
        name: "phys res",
        id: "physicalResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "rang res",
        id: "rangedResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "bld res",
        id: "bleedResistance",
        value: "35%",
        type: "percent",
      },
      {
        name: "psn res",
        id: "poisonResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "cld res",
        id: "coldResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "fire res",
        id: "fireResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "stun res",
        id: "stunResistance",
        value: "35%",
        type: "percent",
      },
      {
        name: "mov res",
        id: "moveResistance",
        value: 0.3,
        type: "percent",
      },
    ],
  },
  {
    name: "the blatherer",
    id: "theBlatherer",
    icon: "./img/theBlatherer.png",
    class: "lost",
    quote: '"fillThisInWithQuoteLater"',
    desc: "fillThisInWithDescLater",
    available: function () {
      return false;
    },
    skills: [
      {
        name: "crushing blows",
        id: "crushingBlows",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hits 2 crushing blows on an enemy
      },
      {
        name: "head splitter",
        id: "headSplitter",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // hit 1 heavily damaging move on an enemy
      },
      {
        name: "war cry",
        id: "warCry",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
        // increases dmg for 2 turns
      },
      {
        name: "mighty swing",
        id: "mightySwing",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // mighty swing
      },
      {
        name: "earthquake",
        id: "earthquake",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
        // do damage to 3 the front 3 enemies
      },
    ],
    stats: [
      {
        name: "hp",
        id: "healthpoints",
        value: 31,
        type: "num",
      },
      {
        name: "spd",
        id: "speed",
        value: 3,
        type: "num",
      },
      // resistances/res
      {
        name: "phys res",
        id: "physicalResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "rang res",
        id: "rangedResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "bld res",
        id: "bleedResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "psn res",
        id: "poisonResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "cld res",
        id: "coldResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "fire res",
        id: "fireResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "stun res",
        id: "stunResistance",
        value: "25%",
        type: "percent",
      },
      {
        name: "mov res",
        id: "moveResistance",
        value: 0.2,
        type: "percent",
      },
    ],
  },
  {
    name: "the knight",
    id: "theKnight",
    icon: "./img/theKnight.png",
    class: "lost",
    quote: '"Faith is our shield, and righteousness our sword."',
    desc: "An embodiment of righteousness, the Knight wields the divine power of faith to dispel darkness and protect the innocent from the forces of evil.",
    available: function () {
      return false;
    },
    // skills and stats refers to both skills and stats
    skills: [
      {
        name: "valiant strike",
        id: "valiantStrike",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "holy retribution",
        id: "holyRetribution",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "strike to the head",
        id: "strikeToTheHead",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "a holy blessing",
        id: "aHolyBlessing",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return true;
        },
      },
      {
        name: "surge of action",
        id: "surgeOfAction",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
      },
      {
        name: "crusade",
        id: "crusade",
        icon: "./img/placeholderSkillIcon.png",
        locked: function () {
          return false;
        },
      },
    ],
    stats: [
      {
        name: "hp",
        id: "healthpoints",
        value: 34,
        type: "num",
      },
      {
        name: "spd",
        id: "speed",
        value: 4,
        type: "num",
      },
      // resistances/res
      {
        name: "phys res",
        id: "physicalResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "rang res",
        id: "rangedResistance",
        value: 0.05,
        type: "percent",
      },
      {
        name: "bld res",
        id: "bleedResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "psn res",
        id: "poisonResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "cld res",
        id: "coldResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "fire res",
        id: "fireResistance",
        value: 0.2,
        type: "percent",
      },
      {
        name: "stun res",
        id: "stunResistance",
        value: 0.3,
        type: "percent",
      },
      {
        name: "mov res",
        id: "moveResistance",
        value: 0.3,
        type: "percent",
      },
    ],
  },
];
