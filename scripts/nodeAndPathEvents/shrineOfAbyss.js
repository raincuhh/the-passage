const ShrineOfAbyss = {
  tokens: null,

  init: function () {
    this.render();
    Main.changeLocationHeader("shrine of the abyss");

    // setting default values and states of metaprogression

    this.tokens =
      SM.get("meta.tokens") !== undefined ? SM.get("meta.tokens") : 0;

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

    // todo, add the different views like the locationHeader
    // so it kinda looks like
    // items < skills < etc... < etc...
    //
    // then add the metaprogression stuff, make you sacrifice tokens to unlock different items
    // and unlock skills on different characters for example.
    // have characters not yet unlocked as "???"

    let body = createEl("div");
    body.setAttribute("id", "shrinePanel");
    parent.appendChild(body);

    let unlockItemView = createEl("div");
    unlockItemView.setAttribute("id", "unlockItemsView");
    body.appendChild(unlockItemView);

    let unlockCharacterSkillView = createEl("div");
    unlockCharacterSkillView.setAttribute("id", "unlockSkillsView");
    body.appendChild(unlockCharacterSkillView);
  },
};
