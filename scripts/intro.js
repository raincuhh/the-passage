const Intro = {
  name: "Intro",
  init: function () {
    this.render();
  },
  launch: function () {
    this.setDocumentTitle();
  },
  render: function () {
    this.createView();
    this.createContent();
    this.createButtons();
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
  createContent: function () {
    let elem = createEl("div");
    elem.setAttribute("class", "wrapper");
    const parent = getID("introView");
    parent.appendChild(elem);

    Main.changeLocationHeader("the passage");

    let description = createEl("div");
    description.setAttribute("class", "description");
    description.textContent =
      ">> Experience this minimalist text-based roguelike with little to no hand holding. <<";
    elem.appendChild(description);
  },
  createButtons: function () {
    const parent = getQuerySelector("#introView .wrapper");
    let buttonsWrapper = createEl("div");
    buttonsWrapper.setAttribute("id", "buttonsWrapper");
    parent.appendChild(buttonsWrapper);

    let introButton = new Button.custom({
      id: "intro",
      text: "continue",
      click: Intro.begin,
    });

    buttonsWrapper.appendChild(introButton.element);
  },

  setDocumentTitle: function () {
    document.title = "the passage";
  },
};
