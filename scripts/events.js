/**
 * eventsManager
 * handles ui + nodeEvents, pathEvents, randomEvents,
 */
let EM = {
  activeEvent: null,
  init: function () {
    this.render();
  },
  render: function () {
    let event = createEl("div");
    event.setAttribute("id", "eventView");
    const parent = getID("main");
    parent.appendChild(event);
  },
  startEvent: function (event) {
    if (!event) {
      return;
    }
    let view = createEl("div");
    view.setAttribute("id", "event");
    let parent = getID("eventView");
    parent.appendChild(view);
    console.log("event started:", event);

    this.loadEvent(event);
  },
  loadEvent: function (event) {
    EM.activeEvent = event;
    console.log("EM active event:", EM.activeEvent);

    if (event.combat) {
      this.enterCombat(event);
    } else {
      this.enterNonCombat(event);
    }
  },
  isActiveEvent: function () {
    if (this.activeEvent && this.activeEvent !== null) {
      return this.activeEvent;
    }
    return null;
  },
  endEvent: function () {
    let view = getID("event");
    view.remove();
  },
  battled: null,
  won: null,
  enterCombat: function (event) {
    let parent = getID("event");

    this.battled = false;
    this.won = false;
    let enemyActors = [];
    let partyActors = [];
  },
  enterNonCombat: function (event) {
    let parent = getID("event");
  },
};
