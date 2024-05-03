/**
 * eventsManager
 * handles ui + nodeEvents, pathEvents, randomEvents,
 */
let EM = {
  activeEvent: null,
  eventId: null,

  eventStatesEnum: {
    arrived: "arrived",
    executing: "executing",
    finished: "finished",
  },

  init: function () {
    this.render();
  },

  render: function () {
    let event = createEl("div");
    event.setAttribute("id", "event");
    const parent = getQuerySelector("#regionView .wrapper .topView");
    parent.appendChild(event);
  },

  startEvent: function (event) {
    if (!event) {
      return;
    }
    if (event === EM.activeEvent) {
      console.log("duplicate event");
      return;
    }
    if (!SM.get("event.eventId")) {
      let id = Main.createGuid();
      let fullId = "event_" + id;
      SM.set("event.eventId", fullId);
    }
    this.eventId = SM.get("event.eventId");

    const parent = getID("event");
    let view = createEl("div");
    view.setAttribute("id", this.eventId);
    view.setAttribute("class", "eventView");
    parent.appendChild(view);

    //let exploreButton = getID("exploreButton");
    //let continueButton = getID("continueButton");
    //exploreButton.style.display = "none";
    //continueButton.style.display = "block";

    this.loadEvent(event);
  },

  loadEvent: function (event) {
    EM.activeEvent = event;
    SM.set("event.activeEvent", event);
    if (!SM.get("event.state")) {
      SM.set("event.state", this.eventStatesEnum.arrived);
    }
    this.pingEventState();

    if (event.combat) {
      this.enterCombat(event);
    } else {
      this.enterNonCombat(event);
    }
  },

  pingEventState: function () {
    let e = EM.activeEvent;
    switch (SM.get("event.state")) {
      case this.eventStatesEnum.executing:
        PM.ping(e.inItPing);
        break;
      case this.eventStatesEnum.finished:
        PM.ping(e.leavePing);
        break;
      default:
        PM.ping(e.arrivalPing);
        break;
    }
  },

  getEnumFromEvent: function (name) {
    let nodeTypeEnums = this.nodeTypeEnums;
    let type = nodeTypeEnums.find((e) => Object.values(e)[0] === name.type);
    return type ? Object.keys(type) : null;
  },

  isActiveEvent: function () {
    if (this.activeEvent && this.activeEvent !== null) {
      return true;
    } else {
      return false;
    }
  },

  endEvent: function () {
    SM.set("event.state", EM.eventStatesEnum.finished);
    EM.pingEventState();
    EM.activeEvent = null;

    Main.changeLocationHeader("The Caravan");

    let view = getID(EM.eventId);
    if (view) {
      view.remove();
    }

    EM.eventId = null;

    let eventProperties = Object.entries(SM.get("event"));
    for (let i = 0; i < eventProperties.length; i++) {
      let toDelete = eventProperties[i][0];
      //console.log("toDelete:", toDelete);
      SM.delete("event." + toDelete);
    }

    Button.disabled(Region.exploreButton.element, false);
    Region.exploreButton.updateListener();
  },

  performed: null,
  won: null,
  enemyActors: [],
  partyActors: [],

  turnBasedGameState: {
    playerTurn: "playerTurn",
    enemyTurn: "enemyTurn",
    won: "won",
    lost: "lost",
  },

  enterCombat: function (event) {
    const parent = getID(this.eventId);

    Button.disabled(Region.exploreButton.element, true);
    Region.exploreButton.updateListener();
    //console.log(event);
    this.performed = false;
    this.won = false;

    this.enemyActors = [];
    this.partyActors = [];

    // defining enemy pool from which enemies are picked from
    let regionPool = Region.currentRegionPool;
    console.log("region poooooooooooool:", regionPool);
    let worldPool = NonRegionEnemyPool;

    let enemyScopeEnum = {
      regionScope: "regionScope",
      worldScope: "worldScope",
      regionCheckScope: "regionCheckScope",
      sinMinionsScope: "sinMinionsScope",
      sinBossScope: "sinBossScope",
    };

    let scope;

    // getting enemy scope
    switch (event.type) {
      case "ambush":
        scope === enemyScopeEnum.worldScope;
        Main.changeLocationHeader("The Ambush");
        console.log("ambush scope");
        break;
      case "regionCheck":
        scope === enemyScopeEnum.regionCheckScope;
        Main.changeLocationHeader("The Test");
        console.log("regioncheck scope");
        break;
      case "sinMinions":
        scope === enemyScopeEnum.sinMinionsScope;
        Main.changeLocationHeader("The Minions");
        console.log("sin minions scope");
        break;
      case "sinBoss":
        scope === enemyScopeEnum.sinBossScope;
        Main.changeLocationHeader("The Sin");
        console.log("sinboss scope");
        break;
      default:
        scope === enemyScopeEnum.regionScope;
        Main.changeLocationHeader("The Fight");
        console.log("region scope");
        break;
    }

    // getting random amountof enemy actors
    if (!SM.get("event.enemyActors")) {
      let temp = [];
      let enemiesAmount = EM.randRange(1, 4);

      if (scope !== enemyScopeEnum.sinBossScope) {
        for (let i = 0; i < enemiesAmount; i++) {
          let chosen;
          switch (scope) {
            case enemyScopeEnum.worldScope:
              chosen = this.weightedEnemySelection(worldPool);
              console.log("worldPool", chosen);
              break;
            case enemyScopeEnum.regionCheckScope:
              chosen = this.weightedEnemySelection(regionCheckPool);
              console.log("regionCheckPool", chosen);
              break;
            case enemyScopeEnum.sinMinionsScope:
              chosen = this.weightedEnemySelection(abyssMinionsPool);
              console.log("abyss minions", chosen);
              break;
            default:
              chosen = this.weightedEnemySelection(regionPool);
              console.log("regionPool", chosen);
              break;
          }
          temp.push(chosen);
          //console.log(chosen);
        }
      } else {
        let sinBoss = SM.get("run.activeSin");
        let chosen;
        for (const boss of sinBossPool) {
          if (boss.name === sinBoss) {
            chosen = boss;
            console.log("bossPool", chosen);
            break;
          }
        }
        temp.push(chosen);
      }
      SM.set("event.enemyActors", temp);
    }
    // putting enemies in the events enemyactor pool
    let enemies = Object.entries(SM.get("event.enemyActors"));
    for (const i of enemies) {
      this.enemyActors.push(i);
    }

    // same with the pathfinders
    let pathfinders = Object.entries(SM.get("char.characters"));
    for (const i of pathfinders) {
      this.partyActors.push(i);
    }

    SM.set("event.state", this.eventStatesEnum.executing);

    console.log("party:", this.partyActors);
    console.log("enemies:", this.enemyActors);
  },

  weightedEnemySelection(pool) {
    const totalProbabilty = pool.reduce(
      (acc, enemy) => acc + enemy.probability,
      0
    );
    const randomNum = Math.random() * totalProbabilty;

    let culminativeProbability = 0;
    for (const enemy of pool) {
      culminativeProbability += enemy.probability;
      if (randomNum <= culminativeProbability) {
        return enemy;
      }
    }
  },

  randRange: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Active non combat mobule doesnt really need
   * to be saved in sm cause when i
   * make the module view, its gonna create the different
   * values if it hasnt already been created.
   *
   * So like in the goblinmarket for example, if first time then
   * its gonna create a list of random items. But if not first time
   * then its just gonna load the list of items that were created.
   */

  activeNonCombatModule: null,

  nonCombatModuleEnums: {
    FortuneCache: "FortuneCache",
    Respite: "Respite",
    SamaritansAid: "SamaritansAid",
    ShrineOfAbyss: "ShrineOfAbyss",
    WanderingMerchant: "WanderingMerchant",
  },

  enterNonCombat: function (event) {
    //const parent = getID(this.eventId);
    SM.set("event.state", this.eventStatesEnum.executing);

    this.clearEventView();
    let name;
    name = event.type;
    name = uppercaseify(name);
    this.activeNonCombatModule = name;
    this.updateNonCombatView();

    //console.log(this.activeNonCombatModule);
  },

  clearEventView: function () {
    const parent = getID(this.eventId);
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  },

  updateNonCombatView: function () {
    switch (this.activeNonCombatModule) {
      case this.nonCombatModuleEnums.FortuneCache:
        FortuneCache.init();
        break;
      case this.nonCombatModuleEnums.Respite:
        Respite.init();
        break;
      case this.nonCombatModuleEnums.SamaritansAid:
        SamaritansAid.init();
        break;
      case this.nonCombatModuleEnums.ShrineOfAbyss:
        ShrineOfAbyss.init();
        break;
      case this.nonCombatModuleEnums.WanderingMerchant:
        WanderingMerchant.init();
      default:
        console.log("tried to update non combat view, failed");
        break;
    }
  },
};
