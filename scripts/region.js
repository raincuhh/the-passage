const Region = {
  name: "Region",
  currentNode: null,
  currentMap: null,
  currentFormattedName: null,
  currentParty: [],
  currentState: null,
  states: {
    beforeJourney: "beforeJourney",
    exploring: "exploring",
    inEvent: "inEvent",
    partyDead: "partyDead",
  },

  currentRegionPool: [],
  timeUntilDim: 2500,
  timeUntilCandleSeen: 4500,
  timeUntilCharactersSeen: 2500,
  timeUntilEventBegin: 2500,

  caravanEnum: {
    dark: "dark",
    dim: "dim",
    warm: "warm",
  },
  enemyTypes: {
    ice: "ice",
    dark: "dark",
    undead: "undead",
    toxic: "toxic",
  },

  //btns
  lookAroundButton: null,
  lightCandleButton: null,
  exploreButton: null,

  init: function () {
    this.render();
    EM.init();

    // getting sin (for sinboss)
    if (!SM.get("run.activeSin")) {
      SM.set("run.activeSin", "sloth");
    }

    // checking if no active region map, if so then generates one
    RegionGen.init();
    if (!SM.get("run.currentMap")) {
      //console.log("no active region, making one");
      let region = RegionGen.newReg();
      SM.set("run.currentMap", region.map);
      SM.set("run.currentName", region.name);
      this.currentMap = region.map;
      this.currentFormattedName = region.name;
    }

    this.currentFormattedName = this.formatRegionName(
      SM.get("run.currentName")
    );
    this.currentMap = SM.get("run.currentMap");
    //console.log("map:", this.currentMap);

    // getting the regions enemypool for combat purposes
    let regionName = SM.get("run.currentName");
    let pool = RegionEnemyPool[regionName];
    pool.forEach((enemy) => {
      this.currentRegionPool.push(enemy);
    });

    //console.log("regionPool:", this.currentRegionPool);

    // checking characters, if none then makes them.
    let persistentStorageChars = SM.get("char.characters");
    if (persistentStorageChars) {
      let chars = Object.entries(persistentStorageChars);
      chars.forEach((char) => {
        this.currentParty.push(char);
      });
    }
    if (!persistentStorageChars || this.currentParty.length === 0) {
      this.choosePathfinders();
      this.createPathfinders();
    }

    // before exploring > exploring > in event > ...
    SM.set(
      "run.activeState",
      SM.get("run.activeState") === undefined
        ? this.states.beforeJourney
        : SM.get("run.activeState")
    );
    SM.set(
      "features.caravan.state",
      SM.get("features.caravan.state") === undefined
        ? this.caravanEnum.dark
        : SM.get("features.caravan.state")
    );

    this.updateButtons();

    if (
      SM.get("features.caravan.state") === this.caravanEnum.dim ||
      SM.get("features.caravan.state") === this.caravanEnum.warm
    ) {
      PM.ping("the candles are " + SM.get("features.caravan.state"));
    } else {
      PM.ping("the room is " + SM.get("features.caravan.state"));
    }
    //PM.ping("you find yourself in a caravan" + afterFirstDeath);
  },
  launch: function () {
    this.setDocumentTitle();
  },
  render: function () {
    this.createView();
    this.createButtons();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "regionView");
    const parent = getID("view");
    parent.appendChild(view);

    let elem = createEl("div");
    elem.setAttribute("class", "wrapper");
    view.appendChild(elem);
  },
  createButtons: function () {
    const parent = getQuerySelector("#regionView .wrapper");
    let buttonsWrapper = createEl("div");
    buttonsWrapper.setAttribute("id", "buttonsWrapper");
    parent.appendChild(buttonsWrapper);

    this.lookAroundButton = new Button.custom({
      id: "lookAroundButton",
      text: "look around.",
      click: this.lookAround.bind(this),
      //width: "max-content",
    });
    buttonsWrapper.appendChild(this.lookAroundButton.element);

    this.lightCandleButton = new Button.custom({
      id: "lightCandleButton",
      text: "light candle.",
      click: this.lightCandle.bind(this),
    });
    buttonsWrapper.appendChild(this.lightCandleButton.element);

    this.exploreButton = new Button.custom({
      id: "exploreButton",
      text: "explore.",
      click: this.explore.bind(this),
    });
    buttonsWrapper.appendChild(this.exploreButton.element);

    this.updateButtons();
  },
  updateButtons: function () {
    let lookAroundButton = getID("lookAroundButton");
    let lightCandleButton = getID("lightCandleButton");
    let exploreButton = getID("exploreButton");

    if (SM.get("features.caravan.state") === this.caravanEnum.dark) {
      lookAroundButton.style.display = "block";
      lightCandleButton.style.display = "none";
      exploreButton.style.display = "none";
    }

    if (SM.get("features.caravan.state") === this.caravanEnum.dim) {
      lookAroundButton.style.display = "none";
      lightCandleButton.style.display = "block";
      exploreButton.style.display = "none";
    }

    if (SM.get("features.caravan.state") === this.caravanEnum.warm) {
      lookAroundButton.style.display = "none";
      lightCandleButton.style.display = "none";
      exploreButton.style.display = "block";
    }
  },
  lookAround: function () {
    Button.disabled(Region.lookAroundButton.element, true);
    Region.lookAroundButton.updateListener();
    PM.ping("You find an old lighter nearby, its metal casing worn with age.");
    setTimeout(() => {
      PM.ping("through the blinds, the moonlight reflects along the walls");
    }, Region.timeUntilDim);
    setTimeout(() => {
      PM.ping("you see a candle close to you, its wick untouched by flame");
      SM.set("features.caravan.state", Region.caravanEnum.dim);
      Button.disabled(Region.lookAroundButton.element, false);
      Region.lookAroundButton.updateListener();
      Region.updateButtons();
    }, Region.timeUntilCandleSeen);
  },
  lightCandle: function () {
    Button.disabled(Region.lightCandleButton.element, true);
    Region.lightCandleButton.updateListener();
    SM.set("features.caravan.state", Region.caravanEnum.warm);
    setTimeout(() => {
      PM.ping(
        "as the candlelight fills the space, you notice three strangers nearby, their faces partially obscured in the shadows."
      );
      Region.onCandleChange();
    }, Region.timeUntilCharactersSeen);
  },
  onCandleChange: function () {
    PM.ping("the caravan is " + SM.get("features.caravan.state"));
    this.updateButtons();
  },
  explore: function () {
    Button.disabled(Region.exploreButton.element, true);
    //console.log("event:", EM.activeEvent);
    setTimeout(() => {
      Region.beginExploring();
      if (!SM.get("run.currentNode")) {
        Button.disabled(Region.exploreButton.element, false);
        Region.exploreButton.updateListener();
      }
    }, Region.timeUntilEventBegin);
    //console.log("exploring");
  },
  beginExploring: function () {
    //this.currentNode = SM.get("run.currentNode");
    if (!SM.get("run.currentNode")) {
      SM.set("run.currentNode", this.currentMap.nodes[0]);
      this.currentNode = this.currentMap.nodes[0];
    }
    this.currentNode = SM.get("run.currentNode");
    this.updateNodeView();
  },
  setDocumentTitle: function () {
    document.title = this.currentFormattedName;
  },
  formatRegionName: function (name) {
    let words = name.match(/[A-Z]*[^A-Z]+/g);
    if (words) {
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i].toLowerCase();
      }
    }
    let formattedName = words ? words.join(" ") : name;
    return formattedName;
  },

  updateNodeView: function () {
    if (this.currentNode === null) {
      return;
    }
    let node = this.currentNode;

    console.log("currentNode:", node);
    //console.log(this.nodeArrivalMsg, this.nodeLeaveMsg, this.nodeInItMsg);
    let toBeLoaded;
    if (specialNodeTypesPool.some((e) => e.type === node.type)) {
      index = specialNodeTypesPool.findIndex((e) => e.type === node.type);
      toBeLoaded = specialNodeTypesPool[index];
      EM.startEvent(toBeLoaded);
      Button.disabled(Region.exploreButton.element, true);
    } else {
      index = NodeTypesPool.findIndex((e) => e.type === node.type);
      toBeLoaded = NodeTypesPool[index];
      EM.startEvent(toBeLoaded);
    }
    //console.log(this.nodeArrivalMsg, this.nodeLeaveMsg, this.nodeInItMsg);
    let nextPaths = this.getNextPaths();
    console.log("next paths:", nextPaths);
  },
  getNextPaths: function () {
    let nextPaths = this.currentMap.paths.filter(
      (path) => path.fromId === this.currentNode.id
    );
    return nextPaths;
  },
  moveToNode: function (nodeId) {
    this.currentNode = this.currentMap.nodes.find((node) => node.id === nodeId);
    this.updateNodeView();
  },
  choosePathfinders: function () {
    let pathfinderList = PathfinderCharLib;
    let unseen = [];
    let seen = [];
    // first of all putting all characters in the unseen arr
    for (let i = 0; i < pathfinderList.length; i++) {
      let pathfinder = pathfinderList[i];
      unseen.push(pathfinder);
    }
    // then choosing based on the unseen list, chosen gets pushed to seen
    for (let i = 0; i < 4; i++) {
      let rng = Math.floor(Math.random() * unseen.length);
      let chosen = unseen.splice(rng, 1)[0];
      let pathfinder = chosen.name;
      seen.push(pathfinder);
      this.currentParty.push(pathfinder);
    }
    //console.log(this.currentParty);
  },
  createPathfinders: function () {
    for (const pathfinder of this.currentParty) {
      if (!SM.get("char.characters." + pathfinder)) {
        SM.set("char.characters." + pathfinder, {});
        PFM.createPathfinder(pathfinder);
      }
    }
  },
};
