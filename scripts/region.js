const Region = {
  name: "Region",

  currentNode: null,
  init: function () {
    this.render();
  },
  launch: function () {
    this.setDocumentTitle();
  },
  render: function () {
    this.createView();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "regionView");
    const parent = getID("view"); // the parent that all "views" will get appended to
    parent.appendChild(view);

    let elem = createEl("div");
    elem.setAttribute("class", "wrapper");
    view.appendChild(elem);
  },
  setDocumentTitle: function () {
    //this will get currentRegions name
    document.title = this.currentNode;
  },
};
