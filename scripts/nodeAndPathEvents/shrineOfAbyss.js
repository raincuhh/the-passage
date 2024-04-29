const ShrineOfAbyss = {
  tokens: null,

  init: function () {
    this.render();
    Main.changeLocationHeader("shrine of the abyss");

    // setting default values and states of metaprogression

    if (!SM.get("meta.tokens")) {
      this.tokens = 0;
      SM.set("meta.tokens", this.tokens);
    }
    this.tokens = SM.get("meta.tokens");
    console.log("tokens:", this.tokens);
  },
  render: function () {
    this.createContent();
  },
  createContent: function () {
    const parent = getID(EM.eventId);

    let header = createEl("div");
    header.setAttribute("id", "shrineHeader");
    parent.appendChild(header);

    let sections = [{ title: "Skills" }, { title: "Items" }];
    sections.forEach((section, index) => {
      let seperator = createEl("div");
      seperator.setAttribute("class", "seperator");
      seperator.textContent = "<";
      header.appendChild(seperator);

      section = createHeaderSection(section.title, index);
      header.appendChild(section);
    });
    function createHeaderSection(title, index) {
      let elem = createEl("div");
      elem.setAttribute("id", "shrineHeader" + title);
      elem.setAttribute("class", "shrineSectionHeader");
      elem.textContent = title.toLowerCase();
      elem.addEventListener("click", () => {
        ShrineOfAbyss.changePanel(index);
      });

      return elem;
    }

    // then add the metaprogression stuff, make you sacrifice tokens to unlock different items
    // and unlock skills on different characters for example.
    // have characters not yet unlocked as "???"

    let body = createEl("div");
    body.setAttribute("id", "shrineView");
    parent.appendChild(body);

    let itemsPanel = createEl("div");
    itemsPanel.setAttribute("id", "itemsPanel");
    itemsPanel.setAttribute("class", "shrinePanel");
    body.appendChild(itemsPanel);

    let skillsPanel = createEl("div");
    skillsPanel.setAttribute("id", "skillsPanel");
    skillsPanel.setAttribute("class", "shrinePanel");
    body.appendChild(skillsPanel);

    // hiding both panels at first
    // then setting default panel
    ShrineOfAbyss.hidePanel();
    this.changePanel(1);
  },
  changePanel: function (index) {
    // hiding panels
    ShrineOfAbyss.hidePanel();
    console.log("changing panel to" + index);
    const itemsPanel = getQuerySelector("#shrineView #itemsPanel");
    const skillsPanel = getQuerySelector("#shrineView #skillsPanel");

    const itemsPanelHeader = getQuerySelector(
      "#shrineHeader #shrineHeaderSkills"
    );
    const skillsPanelHeader = getQuerySelector(
      "#shrineHeader #shrineHeaderItems"
    );

    if (index === 0) {
      skillsPanel.style.display = "flex";
      skillsPanelHeader.classList.add("selected");
    } else if (index === 1) {
      itemsPanel.style.display = "flex";
      itemsPanelHeader.classList.add("selected");
    } else {
      console.warn("index not defined");
    }
  },
  hidePanel: function () {
    const itemsPanel = getQuerySelector("#shrineView #itemsPanel");
    const skillsPanel = getQuerySelector("#shrineView #skillsPanel");

    const itemPanelHeader = getQuerySelector(
      "#shrineHeader #shrineHeaderSkills"
    );
    const skillsPanelHeader = getQuerySelector(
      "#shrineHeader #shrineHeaderItems"
    );

    itemsPanel.style.display = "none";
    skillsPanel.style.display = "none";
    itemPanelHeader.classList.remove("selected");
    skillsPanelHeader.classList.remove("selected");
  },
};
