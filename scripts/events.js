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
      console.log("duplicate event. returning");
      return;
    }
    let view = createEl("div");
    this.eventId = null;
    this.eventId = Main.createGuid();
    view.setAttribute("id", "event_" + this.eventId);
    let parent = getID("event");
    parent.appendChild(view);
    this.loadEvent(event);
  },
  loadEvent: function (event) {
    PM.ping(event.arrivalPing);
    //let temp = getEnumFromEvent(event);
    //console.log("tempEvent:", temp);
    EM.activeEvent = event;
    SM.set("run.activeEvent", event);
    console.log("activeEvent:", event);
    //console.log("events: active:", EM.activeEvent);

    if (event.combat) {
      this.enterCombat(event);
    } else {
      this.enterNonCombat(event);
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
    let type = nodeTypeEnums.find((e) => Object.values(e)[0] === name);
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
    PM.ping(EM.activeEvent.leavePing);
    EM.activeEvent = null;
    SM.delete("run.activeEvent");
    let view = getID("event_" + this.eventId);
    view.remove();
    Button.disabled(Region.exploreButton.element, false);
    Region.exploreButton.updateListener();
  },
  performed: null,
  won: null,
  enterCombat: function (event) {
    let parent = getID("event_" + this.eventId);

    this.performed = false;
    this.won = false;
    let enemyActors = [];
    let partyActors = [];
  },

  nonCombatEnum: {},

  enterNonCombat: function (event) {
    let parent = getID("event");
  },
};
