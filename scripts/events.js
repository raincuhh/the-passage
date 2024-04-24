/**
 * eventsManager
 * handles ui + nodeEvents, pathEvents, randomEvents,
 */
let EM = {
  activeEvent: null,
  states: {
    noEvent: "noEvent",
    inEvent: "inEvent",
  },
  state: null,
  eventId: null,
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
    let view = createEl("div");
    this.eventId = null;
    this.eventId = Main.createGuid();
    view.setAttribute("id", "event_" + this.eventId);
    let parent = getID("event");
    parent.appendChild(view);
    this.loadEvent(event);
  },
  loadEvent: function (event) {
    EM.activeEvent = event;
    PM.ping(event.arrivalPing);
    SM.set("run.activeEvent", event);
    //console.log("events: active:", EM.activeEvent);

    if (event.combat) {
      this.enterCombat(event);
    } else {
      this.enterNonCombat(event);
    }
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
  enterNonCombat: function (event) {
    let parent = getID("event");
  },
};
