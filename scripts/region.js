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
  timeUntilDim: 500, //2500,
  timeUntilCandleSeen: 500, //4500,
  timeUntilCharactersSeen: 500, //2500,
  timeUntilCandleChange: 500, //4500,
  timeUntilEventBegin: 100,

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
  continueButton: null,

  init: function () {
    this.render();
    EM.init();

    // getting sin (for sinboss) otherwise set default
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

    if (!persistentStorageChars || this.currentParty.length === 0) {
      this.choosePathfinders();
      this.createPathfinders();
    }

    if (persistentStorageChars) {
      let chars = Object.entries(persistentStorageChars);
      chars.forEach((char) => {
        this.currentParty.push(char);
      });
    }

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

    if (SM.get("features.caravan.state") === this.caravanEnum.warm) {
      Main.changeLocationHeader("the caravan");
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

    Main.changeLocationHeader("???");

    let topView = createEl("div");
    topView.setAttribute("class", "topView");

    let botView = createEl("div");
    botView.setAttribute("class", "botView");
    elem.appendChild(topView);
    elem.appendChild(botView);
  },

  createButtons: function () {
    const parent = getQuerySelector("#regionView .wrapper .topView");
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
      text: "continue.",
      click: this.explore.bind(this),
    });
    buttonsWrapper.appendChild(this.exploreButton.element);

    this.continueButton = new Button.custom({
      id: "continueButton",
      text: "continue.",
      click: EM.endEvent,
      disabled: false,
    });
    //buttonsWrapper.appendChild(this.continueButton.element);
    this.updateButtons();
  },

  updateButtons: function () {
    let lookAroundButton = getID("lookAroundButton");
    let lightCandleButton = getID("lightCandleButton");
    let exploreButton = getID("exploreButton");
    //let continueButton = getID("continueButton");

    if (SM.get("features.caravan.state") === this.caravanEnum.dark) {
      lookAroundButton.style.display = "block";
      lightCandleButton.style.display = "none";
      exploreButton.style.display = "none";
      //continueButton.style.display = "none";
    }

    if (SM.get("features.caravan.state") === this.caravanEnum.dim) {
      lookAroundButton.style.display = "none";
      lightCandleButton.style.display = "block";
      exploreButton.style.display = "none";
      //continueButton.style.display = "none";
    }

    if (SM.get("features.caravan.state") === this.caravanEnum.warm) {
      lookAroundButton.style.display = "none";
      lightCandleButton.style.display = "none";
      exploreButton.style.display = "block";
      //continueButton.style.display = "none";
    }

    // exploration button and continue button will get hidden and unhidden in eventManager
    // scratch that
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
    }, Region.timeUntilCharactersSeen);
    setTimeout(() => {
      Region.onCandleChange();
    }, Region.timeUntilCandleChange);
  },

  onCandleChange: function () {
    PM.ping("the caravan is " + SM.get("features.caravan.state"));
    Main.changeLocationHeader("the caravan");
    this.updateButtons();
  },

  explore: function () {
    Button.disabled(Region.exploreButton.element, true);
    //console.log("event:", EM.activeEvent);

    if (EM.isActiveEvent()) {
      EM.endEvent();
      this.moveToRandomNextNode();
      Button.disabled(Region.exploreButton.element, false);
    } else {
      setTimeout(() => {
        Region.beginExploring();
        Button.disabled(Region.exploreButton.element, false);
        if (!SM.get("run.currentNode")) {
          Button.disabled(Region.exploreButton.element, false);
          Region.exploreButton.updateListener();
        }
      }, Region.timeUntilEventBegin);
    }

    //console.log("exploring");
  },
  moveToRandomNextNode: function () {
    //console.log("moving to next random node");

    // Check if the current node is a "respite" node
    if (this.currentNode.type === "respite") {
      this.generateNewMap();
    } else {
      // If not at a respite node, proceed as before
      let nextDepth = this.currentNode.depth + 1;

      let nodesAtNextDepth = this.currentMap.nodes.filter(
        (node) => node.depth === nextDepth
      );

      let randIndex = Math.floor(Math.random() * nodesAtNextDepth.length);
      let nextNode = nodesAtNextDepth[randIndex];

      if (!nextNode) {
        console.log("no next nodeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
        SM.set("engine.hasWon", true);
        this.resetRun();
      } else {
        SM.set("run.currentNode", nextNode);
        //console.log(nextNode);
      }
    }
  },

  generateNewMap: function () {
    console.log("reached the respite, generating a new map");

    let region = RegionGen.newReg();
    SM.set("run.currentMap", region.map);
    SM.set("run.currentName", region.name);
    this.currentMap = region.map;

    SM.set("run.currentNode", this.currentMap.nodes[0]);
    this.currentNode = this.currentMap.nodes[0];

    this.currentFormattedName = this.formatRegionName(
      SM.get("run.currentName")
    );

    let regionName = SM.get("run.currentName");
    let pool = RegionEnemyPool[regionName];
    pool.forEach((enemy) => {
      this.currentRegionPool.push(enemy);
    });

    this.setDocumentTitle();
  },

  resetRun: function () {
    function iterOverToDeleteList(properties, state) {
      if (!Array.isArray(properties)) {
        console.error("Properties must be an array.");
        return;
      }

      for (let i = 0; i < properties.length; i++) {
        let property = properties[i];
        if (typeof property !== "string") {
          console.error("Property names must be strings.");
          continue;
        }

        let stateValue = SM.get(state + "." + property);

        // if an object then use recursion
        if (typeof stateValue === "object" && stateValue !== null) {
          let nestedProperties = Object.keys(stateValue);
          iterOverToDeleteList(nestedProperties, state + "." + property);
        }

        SM.delete(state + "." + property);
      }
    }

    // resetting everything except metaprogress
    SM.delete("features.caravan");
    SM.delete("location.regions");
    SM.delete("char.characters");

    let charactersCreated = 0;
    Region.choosePathfinders();
    for (const character of Region.currentParty) {
      if (charactersCreated < 4) {
        if (!SM.get("char.characters." + character)) {
          SM.set("char.characters." + character, {});
          PFM.createPathfinder(character);
          charactersCreated++;
        }
      } else {
        console.log("above 4 characters, breaking");
        break;
      }
    }
    //console.log("party before > 4 check:", Region.currentParty);

    let currentCharacters = Object.keys(SM.get("char.characters"));
    if (currentCharacters.length > 4) {
      let charactersToDelete = currentCharacters.slice(4);
      for (const character of charactersToDelete) {
        SM.delete("char.characters." + character);
      }
    }
    // then deleting inventory and non metaprogress resources(like currency)
    let resourcesProperties = Object.keys(SM.get("resources"));
    iterOverToDeleteList(resourcesProperties, "resources");

    // depending on if you have won or died, will send to different modules
    if (SM.get("engine.hasWon")) {
      // unlocking next sin before deleting run properties (Includes run sin)
      let currentSin = SM.get("run.activeSin");
      let currentSinIndex = Object.values(SinSelection.sinsEnum).indexOf(
        currentSin
      );
      let nextSinIndex = currentSinIndex + 1;
      let nextSin = Object.values(SinSelection.sinsEnum)[nextSinIndex];

      if (nextSin && !SM.get("meta.sinsUnlocked." + nextSin)) {
        SM.set("meta.sinsUnlocked." + nextSin, true);
      }
      PM.ping("you complete your journey");
      PM.ping("...");
      Main.changeModule(Main.modules.SinSelection);
    } else {
      PM.ping("the world fades");
      PM.ping("...");
      Main.changeModule(Main.modules.Interstice);
    }

    // deleting the current runs' properties
    let runProperties = Object.keys(SM.get("run"));
    iterOverToDeleteList(runProperties, "run");
  },

  beginExploring: function () {
    let TempCurrentNode = SM.get("run.currentNode");

    // first of all checking if no current node
    if (!TempCurrentNode) {
      SM.set("run.currentNode", this.currentMap.nodes[0]);
      this.currentNode = this.currentMap.nodes[0];
    }

    this.currentNode = SM.get("run.currentNode");

    this.updateNodeView();
  },

  /*
  // having paths inlcuded made exploring way more weird, i could probably figure it out but its a pain
  // + it includes new "types" i gotta make
  handlePathOptions: function () {
    const availablePaths = this.currentMap.paths.filter(
      (path) => path.fromId === this.currentNode.id
    );

    if (availablePaths.length === 0) {
      console.log("No available paths");
      return;
    }

    if (availablePaths.length === 1) {
      console.log("Only one available path");
      return;
    }

    const pathsByDirection = {};
    availablePaths.forEach((path) => {
      let fromNode = this.currentMap.nodes.find(
        (node) => node.id === path.fromId
      );
      let toNode = this.currentMap.nodes.find((node) => node.id === path.toId);
      let direction = this.getPathDirection(fromNode, toNode);

      if (!pathsByDirection[direction]) {
        pathsByDirection[direction] = [];
      }
      pathsByDirection[direction].push(path);
    });

    for (const direction in pathsByDirection) {
      console.log(direction);
    }
    console.log(pathsByDirection);
  },
  */

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
    //console.log("currentNode:", node);

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
      Button.disabled(Region.exploreButton.element, true);
    }

    /*
    if (nextPaths.length === 0) {
      Button.disabled(Region.exploreButton.element, false);
      Region.exploreButton.updateListener();
    }
    */
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
    let maxCharacters = 4;
    let charactersChosen = 0;

    pathfinderList.sort(() => Math.random() - 0.5);

    for (
      let i = 0;
      i < pathfinderList.length && charactersChosen < maxCharacters;
      i++
    ) {
      let pathfinder = pathfinderList[i].name;
      let characterExists = !!SM.get("char.characters." + pathfinder);

      if (!characterExists) {
        this.currentParty.push(pathfinder);
        charactersChosen++;
      }
    }

    if (charactersChosen > maxCharacters) {
      let overflow = charactersChosen - maxCharacters;
      this.currentParty.splice(-overflow);
    }
  },

  createPathfinders: function () {
    for (const pathfinder of this.currentParty) {
      if (!SM.get("char.characters." + pathfinder)) {
        SM.set("char.characters." + pathfinder, {});
        PFM.createPathfinder(pathfinder);
      }
    }
  },
  randRange: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};
