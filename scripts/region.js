const Region = {
  name: "Region",
  init: function () {
    this.render();
  },
  render: function () {
    createView();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "regionView");
    const parent = getID("view"); // the parent that all "views" will get appended to
    parent.appendChild(view);
  },
  launch: function () {
    console.log("active module is:");
    console.log(GM.activeModule);
    //console.log("active module is: " + GM.activeModule);
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    //this will get currentRegions name
    document.title = "placeholder region";
  },
};
