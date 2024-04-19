/**
 * shrine of abyss / metaprogression
 */
const ShrineOfAbyss = {
  name: "ShrineOfAbyss",
  init: function () {
    this.render();
  },
  render: function () {
    this.createView();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "shrineOfAbyssView");
    const parent = getID("view");
    parent.appendChild(view);
  },
  launch: function () {
    console.log(Main.activeModule);
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    document.title = "peer into the abyss";
  },
};
