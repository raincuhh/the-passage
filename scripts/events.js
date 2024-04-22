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
    event.setAttribute("id", "eventContainer");
    const parent = getID("main");
    parent.appendChild(event);
  },
  startEvent: function (event) {
    if (!event) {
      return;
    }
    let eventView = createEl("div");
    eventView.setAttribute("id", "event");
    console.log("event started:", event);

    this.loadEvent(event);
  },
  loadEvent: function (event) {
    EM.activeEvent = event;
    console.log("loading event");
  },
  endEvent: function () {
    let eventView = getID("event");
    eventView.remove();
  },
};
