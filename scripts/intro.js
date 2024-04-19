const Intro = {
  name: "Intro",
  init: function () {
    this.render();
  },

  launch: function () {
    console.log("active module is:");
    console.log(Main.activeModule);
    //console.log("active module is: " + Main.activeModule);
    this.setDocumentTitle();
  },
  render: function () {
    this.createView();

    let introButton = new Button.custom({
      id: "intro",
      text: "begin.",
      click: Intro.begin,
    });

    let parent = getID("introView");
    parent.appendChild(introButton);
  },
  begin: function () {
    Main.changeModule(SinSelection);
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
