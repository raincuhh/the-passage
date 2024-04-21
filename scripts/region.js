const Region = {
  name: "Region",

  currentNode: null,
  currentMap: null,
  currentName: null,
  init: function () {
    this.render();

    if (!SM.get("run.activeSin")) {
      SM.set("run.activeSin", "sloth");
    }
    RegionGen.init();
    // checking if there is no active region currently, if so then generates one
    if (!SM.get("run.currentMap")) {
      console.log("no active region, making one");
      let region = RegionGen.newReg();
      SM.set("run.currentMap", region.map);
      SM.set("run.currentName", region.name);
      this.currentMap = region.map;
      this.currentName = region.name;
    }
    this.currentName = this.formatRegionName(SM.get("run.currentName"));
    this.currentMap = SM.get("run.currentMap");
    console.log(this.currentMap);
  },
  launch: function () {
    this.setDocumentTitle();
    this.startExploration();
  },
  render: function () {
    this.createView();
    this.createButtons();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "regionView");
    const parent = getID("view"); // the parent that all "views" will get appended to
    parent.appendChild(view);

    let elem = createEl("div");
    elem.setAttribute("class", "wrapper");
    view.appendChild(elem);
  },
  setDocumentTitle: function () {
    //this will get currentRegions name
    document.title = this.currentName;
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
  startExploration: function () {
    if (!SM.get("run.currentNode")) {
      SM.set("run.currentNode", this.currentMap.nodes[0]);
      this.currentNode = this.currentMap.nodes[0];
    }
    this.currentNode = SM.get("run.currentNode");
    this.updateNodeView();
  },
  updateNodeView: function () {
    let node = this.currentNode;
    //console.log("current node:", node);

    let nodeProperties = NodeTypesPool.find(
      (properties) => properties.type === node.type
    );
    //console.log(nodeProperties);
  },
};
