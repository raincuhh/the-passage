let sinSelection = {
  init: function () {
    /*
     if (SM.get("features.locations.sinSelection") == undefined) {
       SM.set("features.locations.sinSelection", true);
     }
     */
    this.makeView();
  },
  launch: function () {
    console.log("active module is: " + GM.activeModule);
    this.setDocumentTitle();
  },
  makeView: function () {
    let sinView = createEl("div");
    sinView.setAttribute("id", "sinSelectorView");
  },
  setDocumentTitle: function () {
    document.title = "invocation of sin";
  },
};
