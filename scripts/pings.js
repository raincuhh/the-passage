/**
 * pings object
 * handles all ping(s) related methods. messaging, pinging, deleting.
 */
let PM = {
  init: function () {
    let elem = createEl("div");
    elem.setAttribute("id", "pings");
    const CONTAINER = getID("container");
    CONTAINER.insertBefore(elem, CONTAINER.firstChild);

    let fade = createEl("div");
    fade.setAttribute("id", "fade");
    //elem.appendChild(fade);
  },
  ping: function (string) {
    if (typeof string == "undefined") {
      return;
    }
    string = periodify(string);
    string = uppercaseify(string);
    this.send(string);
  },
  send: function (e) {
    // outputs the finalized message to the pings node
    let ping = createEl("div");
    ping.className = "ping";
    ping.textContent = e;
    const PINGS = getID("pings");
    PINGS.insertBefore(ping, PINGS.firstChild);
    this.deleteCheck();
  },
  deleteCheck: function () {
    // checking if there are any overflowing pings to delete, cause memoryleak.
    const PINGS = getID("pings");
    let viewportHeight = window.innerHeight;
    let pingList = PINGS.getElementsByClassName("ping");
    for (let i = 0; i < pingList.length; i++) {
      let ping = pingList[i];
      let pingRect = ping.getBoundingClientRect();
      if (pingRect.bottom < 0 || pingRect.top > viewportHeight) {
        PINGS.removeChild(ping);
      }
    }
  },
  clear: function () {
    const PINGS = getID("pings");
    let pingList = PINGS.getElementsByClassName("ping");

    let pingListArray = Array.from(pingList);
    pingListArray.forEach((e) => {
      PINGS.removeChild(e);
    });
  },
};
