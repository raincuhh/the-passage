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

    let header = createEl("div");
    header.setAttribute("class", "header");
    const wrapper = getQuerySelector("#introView .wrapper");
    wrapper.appendChild(header);

    let title = createEl("div");
    title.setAttribute("class", "title");
    title.textContent = "the passage";
    header.appendChild(title);

    let seperator = createEl("div");
    seperator.setAttribute("class", "seperator");
    wrapper.appendChild(seperator);

    let description = createEl("div");
    description.setAttribute("class", "description");
    description.textContent =
      ">> A roguelike textbased rpg with little to no hand holding. <<";
    wrapper.appendChild(description);

    let introButton = new Button.custom({
      id: "intro",
      text: "continue",
      click: Intro.begin,
    });

    wrapper.appendChild(introButton.element);
  },

  setDocumentTitle: function () {
    document.title = "???";
  },
};
