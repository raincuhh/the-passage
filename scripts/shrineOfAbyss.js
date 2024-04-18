/**
 * shrine of abyss / metaprogression
 */
const ShrineOfAbyss = {
  name: "ShrineOfAbyss",
  init: function () {
    this.render();
  },
  render: function () {
    createView();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "shrineOfAbyssView");
    const parent = getID("view");
    parent.appendChild(view);
  },
  launch: function () {
    console.log("active module is:");
    console.log(GM.activeModule);
    //console.log("active module is: " + GM.activeModule);
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    if (GM.activeModule == "metaProgression") {
      document.title = "peer into the abyss";
    }
  },
};
