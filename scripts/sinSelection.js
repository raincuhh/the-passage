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
  init: function () {
    this.render();
  },
  launch: function () {
    console.log(Main.activeModule);
    this.setDocumentTitle();
  },
  render: function () {
    this.createView();
    this.createContent();
    this.createHeader();
    this.createSins();
    this.createButtons();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "sinSelectionView");
    const parent = getID("view");
    parent.appendChild(view);
  },
  createContent: function () {
    let elem = createEl("div");
    elem.setAttribute("class", "wrapper");
    const parent = getID("sinSelectionView");
    parent.appendChild(elem);
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

    let confessButton = new Button.custom({
      id: "confessButton",
      text: "confess",
      click: this.selectParty,
      width: "100%",
    });
    Button.disabled(confessButton, { disabled: false });
    buttonsWrapper.appendChild(confessButton);
  },
  selectParty: function () {
    console.log("clicking");
    Main.changeModule(PartySelection);
  },
  updateUnlockedSins: function () {
    let persistentStorageSin = SM.get("meta.sinsUnlocked");
    let arr = Object.entries(persistentStorageSin);
    for (const i of arr) {
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
    let confessButton = getID("confessButton");
    this.clearSelected();
    let sinText = getQuerySelector("#sinsWrapper #" + sin);
    sinText.style.color = "var(--text-base)";
    Button.disabled(confessButton, { disabled: false });
    //SM.set("run.sin." + sin, true);
    // calc sin stuff later, gonna change enemy hp and stuff "slightly", as in like a 1.05x boost
    // increases incrementally with each sin, 1.05x > 1.1x > 1.15x > 1.2x > 1.25x > 1.3x > 1.35x
  },
  clearSelected: function () {
    let sinsWrapper = getID("sinsWrapper");
    let sins = sinsWrapper.querySelectorAll(".sin");
    sins.forEach((sin) => {
      sin.style.color = "var(--text-subdued)";
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
