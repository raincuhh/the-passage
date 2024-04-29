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

    Main.changeLocationHeader("the caravan");

    let view = getID(EM.eventId);
    view.remove();
    EM.eventId = null;

    let eventProperties = Object.entries(SM.get("event"));
    for (let i = 0; i < eventProperties.length; i++) {
      let toDelete = eventProperties[i][0];
      //console.log("toDelete:", toDelete);
      SM.delete("event." + toDelete);
    }
    //eventProperties.forEach((property) => SM.delete("event." + property));

    //let exploreButton = getID("exploreButton");
    //let continueButton = getID("continueButton");
    //exploreButton.style.display = "block";
    //continueButton.style.display = "none";

    Button.disabled(Region.exploreButton.element, false);
    Region.exploreButton.updateListener();
  },
  performed: null,
  won: null,
  enemyActors: [],
  partyActors: [],
  enterCombat: function (event) {
    const parent = getID(this.eventId);
    console.log(event);
    this.performed = false;
    this.won = false;
    this.enemyActors = [];
    this.partyActors = [];
    let regionPool = Region.currentRegionPool;
    let worldPool = NonRegionEnemyPool;
    let enemyScopeEnum = {
      regionScope: "regionScope",
      worldScope: "worldScope",
    };
    let scope;

    if (event.type === "ambush") {
      scope === enemyScopeEnum.worldScope;
    } else {
      scope === enemyScopeEnum.regionScope;
    }

    if (!SM.get("event.enemyActors")) {
      let temp = [];
      for (let i = 0; i < 4; i++) {
        let chosen;
        if (scope === enemyScopeEnum.regionScope) {
          chosen = this.weightedEnemySelection(regionPool);
        } else {
          chosen = this.weightedEnemySelection(worldPool);
        }
        temp.push(chosen);
        console.log(chosen);
      }
      SM.set("event.enemyActors", temp);
    }

    let enemies = Object.entries(SM.get("event.enemyActors"));
    for (const i of enemies) {
      this.enemyActors.push(i);
    }

    let pathfinders = Object.entries(SM.get("char.characters"));
    for (const i of pathfinders) {
      this.partyActors.push(i);
    }
    console.log("party:", this.partyActors);
    SM.set("event.state", this.eventStatesEnum.executing);
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
  /**
   * Active non combat mobule doesnt really need
   * to be saved in the sm cause when i
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
