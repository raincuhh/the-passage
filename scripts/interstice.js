/**
 * not sure if i should name it purgatory or interstice, interstice for now
 */
const Interstice = {
  name: "Interstice",
  init: function () {
    this.render();
  },
  render: function () {
    createView();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "intersticeView");
    console.log("making view");
    const parent = getID("view"); // the parent that all "views" will get appended to
    parent.appendChild(view);
  },
  launch: function () {
    console.log("active module is:");
    console.log(GM.activeModule);
    //console.log("active module is: " + GM.activeModule);
    this.setDocumentTitle();
  },
  setDocumentTitle: function () {
    document.title = "the Interstice";
  },
};
