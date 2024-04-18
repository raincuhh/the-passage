const Intro = {
  init: function () {
    this.render();
  },

  launch: function () {
    console.log("active module is: " + GM.activeModule);
    this.setDocumentTitle();
    console.log("worked ig?");
  },
  render: function () {
    let introView = createEl("div");
    introView.setAttribute("id", "introView");
    const VIEW = getID("view"); // the parent that all "views" will get appended to
    VIEW.appendChild(introView);
  },
  setDocumentTitle: function () {
    document.title = "???";
  },
};
