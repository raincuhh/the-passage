let SinSelection = {
  name: "SinSelection",
  init: function () {
    /*
     if (SM.get("features.locations.sinSelection") == undefined) {
       SM.set("features.locations.sinSelection", true);
     }
     */
    this.render();
  },
  launch: function () {
    console.log("active module is:");
    console.log(GM.activeModule);
    //console.log("active module is: " + GM.activeModule);
    this.setDocumentTitle();
  },
  render: function () {
    createView();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "sinSelection");
    const parent = getID("view"); // the parent that all "views" will get appended to
    parent.appendChild(view);
  },
  setDocumentTitle: function () {
    document.title = "invoke your sin";
  },
};
