/**
 * sin selection
 * this is where you will pick your sin boss, each sin corresponds to a different finale boss,
 * for the beta ig only the first will be made
 *
 * order from easiest to hardest
 * sloth > gluttony > lust > greed > envy > pride > wrath
 *
 * boss name gonna be like "the sin of ..., prefix+suffix", in the turnbased part
 */
let SinSelection = {
  name: "SinSelection",
  confessButton: null,

  init: function () {
    this.render();
  },
  launch: function () {
    this.setDocumentTitle();
    PM.ping("confess your sins, this will greatly influence the run");
  },
  render: function () {
    this.createView();
    this.createHeader();
    this.createSins();
    this.createButtons();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "sinSelectionView");
    const parent = getID("view");
    parent.appendChild(view);

    let elem = createEl("div");
    elem.setAttribute("class", "wrapper");
    view.appendChild(elem);
  },
  createHeader: function () {
    const parent = getQuerySelector("#sinSelectionView .wrapper");

    let header = createEl("header");
    header.setAttribute("class", "header");
    parent.appendChild(header);

    let headerTitle = createEl("div");
    headerTitle.setAttribute("class", "title");
    headerTitle.textContent = "confess your sins";
    header.appendChild(headerTitle);

    let seperator = createEl("div");
    seperator.setAttribute("class", "seperator");
    parent.appendChild(seperator);
  },
  createSins: function () {
    const parent = getQuerySelector("#sinSelectionView .wrapper");

    let sinsWrapper = createEl("div");
    sinsWrapper.setAttribute("id", "sinsWrapper");
    parent.appendChild(sinsWrapper);

    this.unlockSin("sloth");
    this.updateUnlockedSins();
  },
  createButtons: function () {
    const parent = getQuerySelector("#sinSelectionView .wrapper");
    let buttonsWrapper = createEl("div");
    buttonsWrapper.setAttribute("id", "buttonsWrapper");
    parent.appendChild(buttonsWrapper);

    this.confessButton = new Button.custom({
      id: "confessButton",
      text: "continue.",
      click: this.confess,
      disabled: true,
      width: "100%",
    });

    buttonsWrapper.appendChild(this.confessButton.element);
    this.confessButton.listener();
  },
  confess: function () {
    console.log("clicking");
    Main.changeModule(Region);
  },
  updateUnlockedSins: function () {
    let persistentStorageSin = SM.get("meta.sinsUnlocked");
    let sins = Object.entries(persistentStorageSin);

    for (const i of sins) {
      if (i[1] === true) {
        let elem = createEl("div");
        elem.setAttribute("id", i[0]);
        elem.setAttribute("class", "sin");
        elem.textContent = "The sin of " + i[0] + ".";
        elem.addEventListener("click", () => {
          this.selectSin(i[0]);
        });
        sinsWrapper.appendChild(elem);
      }
    }
  },
  selectSin: function (sin) {
    this.clearSelected();
    let sinText = getQuerySelector("#sinsWrapper #" + sin);
    sinText.style.textDecoration = "underline";
    Button.disabled(this.confessButton.element, false);
    this.confessButton.listener();
    //SM.set("run.sin." + sin, true);
    // calc sin stuff later, gonna change enemy hp and stuff "slightly", as in like a 1.05x boost
    // increases incrementally with each sin, 1.05x > 1.1x > 1.15x > 1.2x > 1.25x > 1.3x > 1.35x
  },
  clearSelected: function () {
    let sinsWrapper = getID("sinsWrapper");
    let sins = sinsWrapper.querySelectorAll(".sin");
    sins.forEach((sin) => {
      sin.style.textDecoration = "none";
    });
  },
  unlockSin: function (sin) {
    SM.set("meta.sinsUnlocked." + sin, true);
  },
  getSinStatus: function (sin) {
    return SM.get("meta.sinsUnlocked." + sin);
  },
  setDocumentTitle: function () {
    document.title = "a sin?";
  },
};
