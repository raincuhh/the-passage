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
    // checking if there is no active region currently
    if (!SM.get("run.currentMap")) {
      console.log("no active region, making one");
      // generating one
      let region = RegionGen.newReg();
      SM.set("run.currentMap", region.map);
      SM.set("run.currentName", region.name);
      this.currentMap = region.map;
      this.currentName = region.name;
    }
    this.currentMap = SM.get("run.currentMap");
    this.currentName = SM.get("run.currentName");

    console.log(this.currentMap);
    console.log(this.currentName);
    /*
    let region = RegionGen.newReg();
    this.currentRegion = region.map;
    this.currentName = region.name;
    console.log(region.map.nodes[region.map.nodes.length - 1]);
    console.log(this.currentRegion);
    console.log(this.currentName);
    */
  },
  launch: function () {
    this.setDocumentTitle();
  },
  render: function () {
    this.createView();
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
    document.title = this.currentNode;
  },
};
