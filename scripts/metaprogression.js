/**
 * shrine of abyss / metaprogression
 */
let metaProgression = {
  init: function () {
    this.createViewElements();
  },
  createViewElements: function () {},
  launch: function () {
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    if (GM.activeModule == "metaProgression") {
      document.title = "Shrine of the Abyss";
    }
  },
};
