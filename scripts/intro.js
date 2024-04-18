const Intro = {
  name: "Intro",
  init: function () {
    this.render();
  },

  launch: function () {
    console.log("active module is:");
    console.log(GM.activeModule);
    //console.log("active module is: " + GM.activeModule);
    this.setDocumentTitle();
  },
  render: function () {
    this.createView();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "introView");
    const parent = getID("view"); // the parent that all "views" will get appended to
    parent.appendChild(view);
  },
  setDocumentTitle: function () {
    document.title = "???";
  },
};
