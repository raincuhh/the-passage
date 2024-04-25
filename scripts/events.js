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
    const parent = getQuerySelector("#regionView .wrapper");
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
    this.eventId = null;
    if (!SM.get("event.eventId")) {
      let id = Main.createGuid();
      SM.set("event.eventId", "event_" + id);
    }
    this.eventId = SM.get("event.eventId");

    let view = createEl("div");
    view.setAttribute("id", "event_" + this.eventId);
    const parent = getID("event");
    parent.appendChild(view);
    this.loadEvent(event);
  },
  loadEvent: function (event) {
    //let temp = getEnumFromEvent(event);
    //console.log("tempEvent:", temp);
    EM.activeEvent = event;
    SM.set("event.activeEvent", event);
    if (!SM.get("event.state")) {
      SM.set("event.state", this.eventStatesEnum.arrived);
    }
    this.pingEventState();
    //console.log("activeEvent:", event);
    //console.log("events: active:", EM.activeEvent);

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
  nodeTypeEnums: [
    { encounter: "encounter" },
    { goblinMarket: "goblinMarket" },
    { fortuneCache: "fortuneCache" },
    { wanderingMerchant: "wanderingMerchant" },
    { samaritansAid: "samaritansAid" },
    { shrineOfAbyss: "shrineOfAbyss" },
    { respite: "respite" },
    { regionCheck: "regionCheck" },
    { sinBoss: "sinBoss" },
    { sinMinions: "sinMinions" },
  ],
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
    SM.set("event.state", this.eventStatesEnum.finished);
    PM.ping(EM.activeEvent.leavePing);
    EM.activeEvent = null;

    SM.delete("event.activeEvent");
    SM.delete("event.enemyActors");
    SM.delete("event.eventId");
    SM.delete("event.state");

    let view = getID("event_" + this.eventId);
    view.remove();
    Button.disabled(Region.exploreButton.element, false);
    Region.exploreButton.updateListener();
  },
  performed: null,
  won: null,
  enemyActors: [],
  partyActors: [],
  enterCombat: function (event) {
    const parent = getID("event_" + this.eventId);

    this.performed = false;
    this.won = false;
    this.enemyActors = [];
    this.partyActors = [];
    let enemyPool = Region.currentRegionPool;

    if (!SM.get("event.enemyActors")) {
      let temp = [];
      for (let i = 0; i < 4; i++) {
        let chosen = this.weightedEnemySelection(enemyPool);
        temp.push(chosen);
        console.log(chosen);
      }
      SM.set("event.enemyActors", temp);
    }
    let enemies = SM.get("event.enemyActors");
    let enems = Object.entries(enemies);
    for (const i of enems) {
      this.enemyActors.push(i);
    }

    let party = SM.get("char.characters");
    let chars = Object.entries(party);
    for (const i of chars) {
      this.partyActors.push(i);
    }
    console.log("party:", this.partyActors);
    SM.set("event.state", this.eventStatesEnum.executing);
  },
  getEnemy: function () {
    let random = Math.random();
    let enemyPool = Region.currentRegionPool;
    let culmination = 0;
    for (const enemy of enemyPool) {
      culmination += enemy.probability;
      if (random < culmination) {
        return enemy;
      }
    }
    //console.log(enemyPool);
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

  enterNonCombat: function (event) {
    const parent = getID("event_" + this.eventId);

    SM.set("event.state", this.eventStatesEnum.executing);
  },
};
