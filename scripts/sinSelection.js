let SinSelection = {
  init: function () {
    /*
     if (SM.get("features.locations.sinSelection") == undefined) {
       SM.set("features.locations.sinSelection", true);
     }
     */
    this.render();
  },
  launch: function () {
    console.log("active module is: " + GM.activeModule);
    this.setDocumentTitle();
  },
  render: function () {
    let sinView = createEl("div");
    sinView.setAttribute("id", "sinSelectorView");
  },
  setDocumentTitle: function () {
    document.title = "invocation of sin";
  },
};
