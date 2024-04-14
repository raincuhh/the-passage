/**
 * formParty
 * handles the creation of the party selection view
 * and selecting the pathfinders for the current run.
 */
let partySelection = {
  finished: false,
  party: ["the pugilist", "the faceless", "the occultist", "the paragon"],

  init: function () {
    if (SM.get("features.locations.formParty") === undefined) {
      console.log("formparty is new");
      SM.set("features.locations.formParty", true);
    } else {
      console.log("formparty is not new");
      SM.get("features.locations.formParty");
    }

    /*
     for (let pathfinder of this.party) {
       console.log("party has: " + pathfinder);
     }
     */

    this.createViewElements(); // makes the view
  },
  launch: function () {
    this.setDocumentTitle();
    PM.ping(
      "choose your allies carefully, for they will determine the course of your journey"
    );
  },
  createViewElements: function () {
    let pathfinderView = createEl("div");
    pathfinderView.setAttribute("id", "pathfinderView");
    const VIEW = getID("view"); // the parent that all "views" will get appended to
    VIEW.appendChild(pathfinderView);

    // make the content
    this.createPathfinderListContent(); // makes patfinder list, locked/locked
    this.createPathfinderDetails(); // makes the content when you click on a hero in the list
    this.createHeaderView(); // makes the header of the content
    this.createPathfinderPosEffectPreview(); // makes the pathfinder pos effectiveness preview
    this.createPathfinderInfoSection(); // makes pathfinder info, quote/desc, etc
    this.createPathfinderSkillsSection(); // makes the skill display
    this.createLockedInLayout(); // makes the locked in layout display,
  },
  createPathfinderListContent: function () {
    // make pathfinderList
    let pathfinderList = createEl("div");
    pathfinderList.setAttribute("id", "pathfinderList");
    pathfinderView.appendChild(pathfinderList);

    let pathfinderContainer = createEl("div");
    pathfinderContainer.setAttribute("class", "container");
    pathfinderList.appendChild(pathfinderContainer);

    PathfinderCharLib.forEach((pathfinder, index) => {
      let elem = this.createPathfinderListItem(pathfinder, index);
      pathfinderContainer.appendChild(elem);
    });
    this.checkPathfindersInListItems();
  },
  createPathfinderListItem: function (char, index) {
    let elem = createEl("span");
    elem.setAttribute("id", char.id);
    elem.setAttribute("class", "pathfinder");
    elem.addEventListener("click", () => {
      partySelection.changeActive(char, index);
      //console.log(index);
    });

    let isUnlocked = char.available();
    if (!isUnlocked) {
      elem.classList.add("locked");
    }
    let pfName = createEl("div");
    pfName.setAttribute("class", "name");
    let formattedName = uppercaseifyString(char.name);
    pfName.textContent = formattedName;
    elem.appendChild(pfName);

    return elem;
  },
  checkPathfindersInListItems: function () {
    const PATHFINDERCONTAINER = getQuerySelector("#pathfinderList .container");
    let PathfinderCharLib =
      PATHFINDERCONTAINER.getElementsByClassName("pathfinder");
    let unlockedPathfinders = [];
    let lockedPathfinders = [];

    for (let i = 0; i < PathfinderCharLib.length; i++) {
      let currentPathfinder = PathfinderCharLib[i];
      if (currentPathfinder.classList.contains("locked")) {
        // and get sm.get char.locked, so it is a && statement when i implement that
        lockedPathfinders.push(currentPathfinder);
      } else {
        unlockedPathfinders.push(currentPathfinder);
      }
    }
    PATHFINDERCONTAINER.innerHTML = "";
    unlockedPathfinders.forEach((pathfinder) => {
      PATHFINDERCONTAINER.appendChild(pathfinder);
    });
    lockedPathfinders.forEach((pathfinder) => {
      PATHFINDERCONTAINER.appendChild(pathfinder);
    });
  },
  createPathfinderDetails: function () {
    // root
    let details = createEl("div");
    details.setAttribute("id", "pathfinderContent");
    pathfinderView.appendChild(details);
  },
  createHeaderView: function () {
    const PARENT = getID("pathfinderContent");

    let header = createEl("div");
    header.setAttribute("id", "pathfinderHeader");
    PARENT.appendChild(header);

    let container = createEl("div");
    container.setAttribute("class", "container");
    header.appendChild(container);

    let title = createEl("span");
    title.setAttribute("id", "pathfinderTitle");
    let formattedTitle = uppercaseifyString(PathfinderCharLib[0].name);
    title.textContent = formattedTitle;
    container.appendChild(title);

    let innerWrapper = createEl("div");
    innerWrapper.setAttribute("class", "wrapper");
    container.appendChild(innerWrapper);

    let classIcon = createEl("img");
    classIcon.setAttribute("id", "pathfinderClassIcon");
    classIcon.src = PathfinderCharLib[0].icon;
    innerWrapper.appendChild(classIcon);

    let classText = createEl("span");
    classText.setAttribute("id", "pathfinderClassText");
    let formattedClassText = uppercaseifyString(PathfinderCharLib[0].class);
    classText.textContent = formattedClassText;
    innerWrapper.appendChild(classText);
  },
  createPathfinderPosEffectPreview: function () {
    const PARENT = getID("pathfinderContent");

    let effectivenessPreview = createEl("div");
    effectivenessPreview.setAttribute("id", "pathfinderEffectivenessPreview");
    PARENT.appendChild(effectivenessPreview);

    let container = createEl("div");
    container.setAttribute("class", "container");
    effectivenessPreview.appendChild(container);
    // making the 2 types
    let types = ["allyEffPreview", "enemyEffPreview"];
    types.forEach((type) => {
      let elem = createEl("div");
      elem.setAttribute("id", type);
      elem.setAttribute("class", "effPreview");
      container.appendChild(elem);
    });

    const allyEffPreview = getID("allyEffPreview");
    const enemyEffPreview = getID("enemyEffPreview");

    let headers = ["allyEffPreviewHeader", "enemyEffPreviewHeader"];
    headers.forEach((header, index) => {
      let elem = createEl("span");
      elem.setAttribute("id", header);
      elem.setAttribute("class", "effPreviewHeader");
      if (index === 0) {
        allyEffPreview.appendChild(elem);
      } else {
        enemyEffPreview.appendChild(elem);
      }
    });

    const allyEffPreviewHeader = getID("allyEffPreviewHeader");
    const enemyEffPreviewHeader = getID("enemyEffPreviewHeader");
    allyEffPreviewHeader.textContent = "recommended";
    enemyEffPreviewHeader.textContent = "targets";

    // making the layout effectiveness previews for ally/pathfinder and enemy.
    createTiles(allyEffPreview, "allyPreviewTile", 4);
    createTiles(enemyEffPreview, "enemyPreviewTile", 4);

    function createTiles(container, id, count) {
      for (let i = 1; i <= count; i++) {
        let elem = createEl("span");
        elem.setAttribute("id", `${id}${i}`);
        elem.setAttribute("class", "tile");
        elem.textContent = "#";
        container.appendChild(elem);
        //console.log("tile" + i);
      }
    }

    const pathfinderEffectivenessPreview = getID(
      "pathfinderEffectivenessPreview"
    );
    let pfEffPreviewHr = createEl("hr");
    pfEffPreviewHr.setAttribute("class", "hr");
    pathfinderEffectivenessPreview.appendChild(pfEffPreviewHr);
  },
  createPathfinderInfoSection: function () {
    const PARENT = getID("pathfinderContent");

    let info = createEl("div");
    info.setAttribute("id", "pathfinderInfo");
    PARENT.appendChild(info);

    let container = createEl("div");
    container.setAttribute("class", "container");
    info.appendChild(container);

    let quote = createEl("div");
    quote.setAttribute("id", "pathfinderQuote");
    quote.textContent = PathfinderCharLib[0].quote; // default
    container.appendChild(quote);

    /*
     let desc = createEl("p");
     desc.setAttribute("id", "pathfinderDescription");
     desc.textContent = PathfinderCharLib[0].desc; // default
     container.appendChild(desc);
     */
  },
  createPathfinderSkillsSection: function () {
    const PARENT = getID("pathfinderContent");

    let pathfinderSkills = createEl("div");
    pathfinderSkills.setAttribute("id", "pathfinderSkills");
    PARENT.appendChild(pathfinderSkills);

    let skillsContainer = createEl("div");
    skillsContainer.setAttribute("class", "container");
    pathfinderSkills.appendChild(skillsContainer);

    // create default skills, gets changed when u click specific pathfinder
    this.createSkillList(0);
  },
  createSkillList: function (index) {
    // make the skillsContainer modular in the future by adding param that takes container
    const CONTAINER = getQuerySelector("#pathfinderSkills .container");
    CONTAINER.innerHTML = "";
    PathfinderCharLib[index].skills.forEach((skill) => {
      let elem = createEl("div");
      elem.setAttribute("id", skill.id);
      elem.setAttribute("class", "skill");
      CONTAINER.appendChild(elem);

      let container = createEl("div");
      container.setAttribute("class", "iconContainer");
      elem.appendChild(container);

      let icon = createEl("img");
      icon.setAttribute("class", "skillIcon");
      icon.src = skill.icon;
      container.appendChild(icon);
      /*
       let name = createEl("span");
       name.setAttribute("class", "name");
       name.textContent = skill.name;
       elem.appendChild(name);
       */
    });
  },
  createLockedInLayout: function () {
    const PARENT = getID("pathfinderContent");

    let layout = createEl("div");
    layout.setAttribute("id", "pathfinderParty");
    PARENT.appendChild(layout);

    let container = createEl("div");
    container.setAttribute("class", "container");
    layout.appendChild(container);

    let preview = createEl("div");
    preview.setAttribute("id", "pathfinderPartySlots");
    container.appendChild(preview);

    let previewWrapper = createEl("div");
    previewWrapper.setAttribute("class", "wrapper");
    preview.appendChild(previewWrapper);

    let partySlots = [];
    for (let i = 0; i < 4; i++) {
      partySlots.push("slot");
    }

    partySlots.forEach((slot, index) => {
      let elem = createEl("div");
      elem.setAttribute("id", "party" + `${slot}${index}`);
      elem.setAttribute("class", "slot");
      previewWrapper.appendChild(elem);
      elem.addEventListener("click", () => {
        console.log(index);
      });

      let diamond = createEl("div");
      diamond.setAttribute("class", "diamond");
      elem.appendChild(diamond);
      // making the inner where the icon will be changed dynamically
      // depending on the pathfinder screen youre on. layoutslots will be dynamically changed aswell
      let icon = createEl("div");
      icon.setAttribute("id", "icon" + `${slot}${index}`);
      icon.setAttribute("class", "icon");
      diamond.appendChild(icon);
    });

    let pathfinderSelectAndFinish = createEl("div");
    pathfinderSelectAndFinish.setAttribute("id", "pathfinderSelectAndFinish");
    container.appendChild(pathfinderSelectAndFinish);

    let splitLine = createEl("div");
    splitLine.setAttribute("class", "line");
    pathfinderSelectAndFinish.appendChild(splitLine);

    let buttons = createEl("div");
    buttons.textContent = "buttons";
    buttons.setAttribute("id", "buttons");
    pathfinderSelectAndFinish.appendChild(buttons);
  },
  changeActive: function (char, index) {
    const HEADERTITLE = getQuerySelector(
      "#pathfinderHeader .container #pathfinderTitle"
    );
    const CLASSICON = getQuerySelector(
      "#pathfinderHeader .container .wrapper #pathfinderClassIcon"
    );
    const CLASSTEXT = getQuerySelector(
      "#pathfinderHeader .container .wrapper #pathfinderClassText"
    );
    const QUOTE = getQuerySelector(
      "#pathfinderInfo .container #pathfinderQuote"
    );
    //const ALLYEFFPREVIEWHEADER = getID("allyEffPreviewHeader");
    //const ENEMYEFFPREVIEWHEADER = getID("enemyEffPreviewHeader");

    // sets values
    let formattedTitle = uppercaseifyString(char.name);
    let formattedClassText = uppercaseifyString(char.class);
    let formattedQuote = uppercaseify(char.quote);

    HEADERTITLE.textContent = formattedTitle;
    CLASSICON.src = char.icon;
    CLASSTEXT.textContent = formattedClassText;
    QUOTE.textContent = formattedQuote;
    //DESC.textContent = char.desc;
    this.createSkillList(index);

    /**
     * https://stackoverflow.com/questions/7176908/how-can-i-get-the-index-of-an-object-by-its-property-in-javascript/22864817#22864817
     *
     * theoretically would fetch the info from an array about the heroes effectiveness
     * on specific positions in the battleformation layout.
     * weighing values on the 4 different slots a hero can be in,
     * depending on what pathfinder it is, like for example the paragon
     * should be more effective on the rightmost slot/ first slot because he is a tank.
     * but he should also be slightly less effective on the 2nd slot.
     */
  },
  getEffectivePosition: function (string) {
    const PARTS = string.split(/[,]+/);
    for (let i = 0; i < PARTS.length; i++) {
      let part = PARTS[i];
      console.log(part);
    }
  },
  setDocumentTitle: function () {
    document.title = "choose your party...";
  },
  finishParty: function () {
    for (let pathfinder of this.party) {
      if (!SM.get("character." + pathfinder)) {
        SM.set("character." + pathfinder, {});
        PFM.createPathfinder(pathfinder);
      }
    }
  },
};
