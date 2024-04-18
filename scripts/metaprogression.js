/**
 * shrine of abyss / metaprogression
 */
const ShrineOfAbyss = {
  init: function () {
    this.render();
  },
  render: function () {},
  launch: function () {
    console.log("active module is: " + GM.activeModule);
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    if (GM.activeModule == "metaProgression") {
      document.title = "Shrine of the Abyss";
    }
  },
};
