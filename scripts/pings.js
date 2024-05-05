/**
 * pings object
 * handles all ping(s) related methods. messaging, pinging, deleting.
 */
let PM = {
  init: function () {
    let elem = createEl("div");
    elem.setAttribute("id", "pings");
    const container = getID("container");
    container.insertBefore(elem, container.firstChild);

    let fade = createEl("div");
    fade.setAttribute("id", "fade");
    elem.appendChild(fade);
  },
  ping: function (data) {
    if (typeof data == "undefined") {
      return;
    }
    if (typeof data !== "string") {
      data = data.toString();
    }
    data = periodify(data);
    data = uppercaseify(data);
    this.send(data);
  },
  send: function (e) {
    // outputs the finalized message to the pings node
    let ping = createEl("div");
    ping.className = "ping";
    ping.textContent = e;
    const pings = getID("pings");
    pings.insertBefore(ping, pings.firstChild);
    this.deleteCheck();
  },
  deleteCheck: function () {
    // checking if there are any overflowing pings
    const pings = getID("pings");
    let viewportHeight = window.innerHeight;
    let pingList = pings.getElementsByClassName("ping");
    for (let i = 0; i < pingList.length; i++) {
      let ping = pingList[i];
      let pingRect = ping.getBoundingClientRect();
      if (pingRect.bottom < 0 || pingRect.top > viewportHeight) {
        pings.removeChild(ping);
      }
    }
  },
  clear: function () {
    const pings = getID("pings");
    let pingList = pings.getElementsByClassName("ping");

    let pingListArray = Array.from(pingList);
    pingListArray.forEach((e) => {
      pings.removeChild(e);
    });
  },
};
