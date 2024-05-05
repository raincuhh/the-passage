/**
 * eventsManager
 * handles ui + nodeEvents, pathEvents, randomEvents,
 */
let EM = {
  activeEvent: null,
  eventId: null,

  eventStatesEnum: {
    arrived: "arrived",
    executing: "executing",
    finished: "finished",
  },

  init: function () {
    this.render();
  },

  render: function () {
    let event = createEl("div");
    event.setAttribute("id", "event");
    const parent = getQuerySelector("#regionView .wrapper .topView");
    parent.appendChild(event);
  },

  startEvent: function (event) {
    if (!event) {
      return;
    }
    if (event === EM.activeEvent) {
      console.log("duplicate event");
      return;
    }
    if (!SM.get("event.eventId")) {
      let id = Main.createGuid();
      let fullId = "event_" + id;
      SM.set("event.eventId", fullId);
    }
    this.eventId = SM.get("event.eventId");

    const parent = getID("event");
    let view = createEl("div");
    view.setAttribute("id", this.eventId);
    view.setAttribute("class", "eventView");
    parent.appendChild(view);

    //let exploreButton = getID("exploreButton");
    //let continueButton = getID("continueButton");
    //exploreButton.style.display = "none";
    //continueButton.style.display = "block";

    this.loadEvent(event);
  },

  loadEvent: function (event) {
    EM.activeEvent = event;
    SM.set("event.activeEvent", event);
    if (!SM.get("event.state")) {
      SM.set("event.state", this.eventStatesEnum.arrived);
    }
    this.pingEventState();

    if (event.combat) {
      this.enterCombat(event);
    } else {
      this.enterNonCombat(event);
    }
  },

  pingEventState: function () {
    let e = EM.activeEvent;
    switch (SM.get("event.state")) {
      case this.eventStatesEnum.executing:
        PM.ping(e.inItPing);
        break;
      case this.eventStatesEnum.finished:
        PM.ping(e.leavePing);
        break;
      default:
        PM.ping(e.arrivalPing);
        break;
    }
  },

  /*
  getEnumFromEvent: function (name) {
    let nodeTypeEnums = this.nodeTypeEnums;
    let type = nodeTypeEnums.find((e) => Object.values(e)[0] === name.type);
    return type ? Object.keys(type) : null;
  },
  */

  isActiveEvent: function () {
    if (this.activeEvent && this.activeEvent !== null) {
      return true;
    } else {
      return false;
    }
  },

  endEvent: function () {
    let exploreButton = getID("exploreButton");
    exploreButton.style.display = "block";

    SM.set("event.state", EM.eventStatesEnum.finished);
    EM.pingEventState();
    EM.activeEvent = null;

    Main.changeLocationHeader("The Caravan");

    let view = getID(EM.eventId);
    if (view) {
      view.remove();
    }

    EM.eventId = null;

    let eventProperties = Object.entries(SM.get("event"));
    for (let i = 0; i < eventProperties.length; i++) {
      let toDelete = eventProperties[i][0];
      //console.log("toDelete:", toDelete);
      SM.delete("event." + toDelete);
    }

    Button.disabled(Region.exploreButton.element, false);
    Region.exploreButton.updateListener();
  },

  performed: null,
  won: null,

  enterCombat: function (event) {
    const parent = getID(this.eventId);

    let exploreButton = getID("exploreButton");
    exploreButton.style.display = "none";
    Region.exploreButton.updateListener();
    //console.log(event);

    // setting up and getting actors
    this.performed = false;
    this.won = false;

    //this.enemyActors = [];
    //this.partyActors = [];

    // defining enemy pool from which enemies are picked from
    let regionPool = Region.currentRegionPool;
    //console.log("region poooooooooooool:", regionPool);
    let worldPool = NonRegionEnemyPool;

    let enemyScopeEnum = {
      regionScope: "regionScope",
      worldScope: "worldScope",
      regionCheckScope: "regionCheckScope",
      sinMinionsScope: "sinMinionsScope",
      sinBossScope: "sinBossScope",
    };

    let scope;

    switch (event.type) {
      case "ambush":
        scope = enemyScopeEnum.worldScope;
        Main.changeLocationHeader("The Ambush");
        //console.log("ambush scope");
        break;
      case "regionCheck":
        scope = enemyScopeEnum.regionCheckScope;
        Main.changeLocationHeader("The Test");
        //console.log("regioncheck scope");
        break;
      case "sinMinions":
        scope = enemyScopeEnum.sinMinionsScope;
        Main.changeLocationHeader("The Minions");
        //console.log("sin minions scope");
        break;
      case "sinBoss":
        scope = enemyScopeEnum.sinBossScope;
        Main.changeLocationHeader("The Sin");
        //console.log("sinboss scope");
        break;
      default:
        scope = enemyScopeEnum.regionScope;
        Main.changeLocationHeader("The Fight");
        //console.log("region scope");
        break;
    }

    if (!SM.get("event.enemies")) {
      let temp = [];
      let enemiesAmount = EM.randRange(1, 4);

      if (scope !== enemyScopeEnum.sinBossScope) {
        for (let i = 0; i < enemiesAmount; i++) {
          let chosen;
          switch (scope) {
            case enemyScopeEnum.worldScope:
              chosen = this.weightedEnemySelection(worldPool);
              //console.log("worldPool", chosen);
              break;
            case enemyScopeEnum.regionCheckScope:
              chosen = this.weightedEnemySelection(regionCheckPool);
              //console.log("regionCheckPool", chosen);
              break;
            case enemyScopeEnum.sinMinionsScope:
              chosen = this.weightedEnemySelection(abyssMinionsPool);
              //console.log("abyss minions", chosen);
              break;
            default:
              chosen = this.weightedEnemySelection(regionPool);
              //console.log("regionPool", chosen);
              break;
          }
          temp.push(chosen);
          //console.log(chosen);
        }
      } else {
        let sinBoss = SM.get("run.activeSin");
        let chosen;
        for (const boss of sinBossPool) {
          if (boss.name === sinBoss) {
            chosen = boss;
            console.log("bossPool", chosen);
            break;
          }
        }
        temp.push(chosen);
      }
      SM.set("event.enemies", temp);
    }

    SM.set("event.state", this.eventStatesEnum.executing);

    // setting inactive enemies
    if (!SM.get("event.inactiveEnemies")) {
      let enemies = Object.values(SM.get("event.enemies"));
      let temp = [];
      enemies.forEach((enemy) => {
        //console.log(enemy.name);
        temp.push(enemy);
      });
      SM.set("event.inactiveEnemies", temp);
    }

    // setting active enemy
    if (!SM.get("event.activeEnemy")) {
      let inactiveEnemies = SM.get("event.inactiveEnemies");

      let randomIndex = Math.floor(Math.random() * inactiveEnemies.length);
      let chosen = inactiveEnemies[randomIndex];

      SM.set("event.activeEnemy", chosen);

      // mdoifying the original inactiveEnemies
      inactiveEnemies.splice(randomIndex, 1);
      SM.set("event.inactiveEnemies", inactiveEnemies);
    }

    // setting inactive characters
    if (!SM.get("event.inactiveChars")) {
      let chars = Object.entries(SM.get("char.characters"));
      let temp = [];
      chars.forEach((char) => {
        temp.push(char);
      });
      console.log(temp);
      SM.set("event.inactiveChars", temp);
    }

    // setting active character
    if (!SM.get("event.activeChar")) {
      let inactiveChars = SM.get("event.inactiveChars");

      console.log("inactiveChars:", inactiveChars);

      let chosen = inactiveChars[0];
      console.log(chosen);

      SM.set("event.activeChar", chosen);

      inactiveChars.splice(0, 1);
      SM.set("event.inactiveChars", inactiveChars);
    }

    // getting turn
    if (!SM.get("event.turnState")) {
      // finding first attacker
      let activeChar = SM.get("event.activeChar");
      let activeEnemy = SM.get("event.activeEnemy");

      let charSpeed = activeChar[1].stats.speed;
      let enemySpeed = activeEnemy.stats.speed;

      if (charSpeed > enemySpeed) {
        EM.changeTurn(EM.turnStates.playerTurn);
      } else {
        EM.changeTurn(EM.turnStates.enemyTurn);
      }
    }

    // creating the fighting panel
    let fightPanel = createEl("div");
    fightPanel.setAttribute("id", "fightPanel");
    parent.appendChild(fightPanel);

    // creating the battleDisplay ( has the sprite, health and stuff)
    let battleDisplay = EM.createbattleDisplay();
    fightPanel.appendChild(battleDisplay);

    // creating the battle menu ( holds attack, guard, items and switch stuff)
    let battleMenu = EM.createBattleMenu();
    fightPanel.appendChild(battleMenu);

    // finding out who has turn first (speed)

    this.hidePanels();
    this.updateAll();
    this.changePanel(EM.panelEnums.mainPanel);
  },

  changeTurn: function (turnState) {
    SM.set("event.turnState", turnState);
    EM.updateTurnState();
  },

  updateTurnState: function () {
    switch (SM.get("event.turnState")) {
      case EM.turnStates.playerTurn:
        EM.playerTurn();
        break;
      case EM.turnStates.enemyTurn:
        EM.enemyTurn();
        break;
    }
  },

  playerTurn: function () {
    console.log("player turn");
    let activeChar = SM.get("event.activeChar");
    let activeEnemy = SM.get("event.activeEnemy");
    let dmg = EM.getEnemyAttackValue(activeEnemy);

    EM.attack(activeChar, activeEnemy, dmg);
  },
  enemyTurn: function () {
    console.log("enemy turn");
    let activeChar = SM.get("event.activeChar");
    let activeEnemy = SM.get("event.activeEnemy");
    let dmg = EM.getEnemyAttackValue(activeEnemy);
    setTimeout(() => {
      PM.ping("...");
    }, 750);

    setTimeout(() => {
      EM.attack(activeEnemy, activeChar, dmg);
    }, 1500);
  },

  attack: function (attacker, defendant, value) {
    console.log(attacker, defendant);
    let attackerName = "";
    let defendantName = "";

    if (typeof attacker === "object" && attacker.hasOwnProperty("name")) {
      attackerName = attacker.name;
    } else if (Array.isArray(attacker) && attacker.length > 0) {
      attackerName = attacker[0];
    }

    if (typeof defendant === "object" && defendant.hasOwnProperty("name")) {
      defendantName = defendant.name;
    } else if (Array.isArray(defendant) && defendant.length > 0) {
      defendantName = defendant[0];
    }
    PM.ping(attackerName + " attacks " + defendantName + " for " + value);
  },

  deathCheck: function () {},

  getEnemyAttackValue: function (entity) {
    let highRange = EM.randRange(7, 15);
    let lowRange = EM.randRange(1, 6);

    let attackValue = EM.randRange(lowRange, highRange);
    return attackValue;
  },

  turnStates: {
    playerTurn: "playerTurn",
    enemyTurn: "enemyTurn",
    lost: "lost",
    won: "won",
  },

  createbattleDisplay: function () {
    let placeholderValue = 0;

    let elem = createEl("div");
    elem.setAttribute("id", "battleDisplay");

    // making the visual elements for the character side (health, sprite, name)

    // enemy side
    let enemySide = createEl("div");
    enemySide.setAttribute("id", "enemySide");
    elem.appendChild(enemySide);

    let enemySprite = createEl("div");
    enemySprite.setAttribute("id", "enemySprite");
    enemySide.appendChild(enemySprite);
    // placeholder
    enemySprite.textContent = "E";

    // info panel
    let enemyInfoPanel = createEl("div");
    enemyInfoPanel.setAttribute("id", "enemyInfoPanel");

    // used to display total enemies (dead: X, alive: E)
    let enemyPreview = createEl("div");
    enemyPreview.setAttribute("id", "enemyPreview");
    enemyInfoPanel.appendChild(enemyPreview);

    let enemyInfo = createEl("div");
    enemyInfo.setAttribute("id", "enemyInfo");
    enemyInfoPanel.appendChild(enemyInfo);

    let enemyInfoName = createEl("div");
    enemyInfoName.setAttribute("id", "enemyInfoName");
    enemyInfoName.textContent = "placeholder";
    enemyInfo.appendChild(enemyInfoName);

    let enemyInfoHpWrapper = createEl("div");
    enemyInfoHpWrapper.setAttribute("id", "enemyInfoHpWrapper");
    enemyInfo.appendChild(enemyInfoHpWrapper);

    let enemyInfoHpCurrent = createEl("div");
    enemyInfoHpCurrent.setAttribute("id", "enemyInfoHpCurrent");
    // placeholder value
    enemyInfoHpCurrent.textContent = placeholderValue;
    enemyInfoHpWrapper.appendChild(enemyInfoHpCurrent);

    let enemyInfoHpSeperator = createEl("span");
    enemyInfoHpSeperator.textContent = " / ";
    enemyInfoHpWrapper.appendChild(enemyInfoHpSeperator);

    let enemyInfoHpMax = createEl("span");
    enemyInfoHpMax.setAttribute("id", "enemyInfoHpMax");
    // placeholder value
    enemyInfoHpMax.textContent = placeholderValue;
    enemyInfoHpWrapper.appendChild(enemyInfoHpMax);

    enemySide.appendChild(enemyInfoPanel);
    enemySide.appendChild(enemySprite);

    // character side
    let characterSide = createEl("div");
    characterSide.setAttribute("id", "characterSide");
    elem.appendChild(characterSide);

    let characterSprite = createEl("div");
    characterSprite.setAttribute("id", "characterSprite");

    // placeholder
    characterSprite.textContent = "@";

    // info panel
    let characterInfoPanel = createEl("div");
    characterInfoPanel.setAttribute("id", "characterInfoPanel");

    // used to display total characters (dead: X, alive: @)
    let characterPreview = createEl("div");
    characterPreview.setAttribute("id", "characterPreview");
    characterInfoPanel.appendChild(characterPreview);

    let characterInfo = createEl("div");
    characterInfo.setAttribute("id", "characterInfo");
    characterInfoPanel.appendChild(characterInfo);

    let characterInfoName = createEl("div");
    characterInfoName.setAttribute("id", "characterInfoName");
    characterInfoName.textContent = "placeholder";
    characterInfo.appendChild(characterInfoName);

    // hp stuff for character
    let characterInfoHpWrapper = createEl("div");
    characterInfoHpWrapper.setAttribute("id", "characterInfoHpWrapper");
    characterInfo.appendChild(characterInfoHpWrapper);

    let characterInfoHpCurrent = createEl("span");
    characterInfoHpCurrent.setAttribute("id", "characterInfoHpCurrent");
    // placeholder value
    characterInfoHpCurrent.textContent = placeholderValue;
    characterInfoHpWrapper.appendChild(characterInfoHpCurrent);

    let characterInfoHpSeperator = createEl("span");
    characterInfoHpSeperator.textContent = " / ";
    characterInfoHpWrapper.appendChild(characterInfoHpSeperator);

    let characterInfoHpMax = createEl("span");
    characterInfoHpMax.setAttribute("id", "characterInfoHpMax");
    // placeholder value
    characterInfoHpMax.textContent = placeholderValue;
    characterInfoHpWrapper.appendChild(characterInfoHpMax);

    characterSide.appendChild(characterSprite);
    characterSide.appendChild(characterInfoPanel);

    return elem;
  },

  createBattleMenu: function () {
    let elem = createEl("div");
    elem.setAttribute("id", "battleMenu");

    let mainPanel = EM.createMainPanel();
    elem.appendChild(mainPanel);

    let attackPanel = EM.createAttackPanel();
    elem.appendChild(attackPanel);

    let itemsPanel = EM.createItemsPanel();
    elem.appendChild(itemsPanel);

    let switchPanel = EM.createSwitchpanel();
    elem.appendChild(switchPanel);

    return elem;
  },

  hidePanels: function () {
    let mainPanel = getQuerySelector("#fightPanel #battleMenu #mainPanel");
    let attackPanel = getQuerySelector("#fightPanel #battleMenu #attackPanel");
    let itemsPanel = getQuerySelector("#fightPanel #battleMenu #itemsPanel");
    let switchPanel = getQuerySelector("#fightPanel #battleMenu #switchPanel");

    mainPanel.style.display = "none";
    attackPanel.style.display = "none";
    itemsPanel.style.display = "none";
    switchPanel.style.display = "none";
  },

  updateAll: function () {
    EM.updateAttackPanel();
    EM.updateSwitchPanel();
    EM.updateItemsPanel();
    EM.updateBattleDisplay();
  },

  updateBattleDisplay: function () {
    // character display and info
    let characterPreview = getQuerySelector(
      "#fightPanel #battleDisplay #characterSide #characterInfoPanel #characterPreview"
    );
    let characterName = getQuerySelector(
      "#fightPanel #battleDisplay #characterSide #characterInfoPanel #characterInfo #characterInfoName"
    );
    let characterHpCurrent = getQuerySelector(
      "#fightPanel #battleDisplay #characterSide #characterInfoPanel #characterInfo #characterInfoHpWrapper #characterInfoHpCurrent"
    );
    let characterHpMax = getQuerySelector(
      "#fightPanel #battleDisplay #characterSide #characterInfoPanel #characterInfo #characterInfoHpWrapper #characterInfoHpMax"
    );

    characterPreview.innerHTML = "";

    let characters = Object.values(SM.get("event.inactiveChars"));
    characters.forEach((char, index) => {
      let charName = char[0];

      let elem = createEl("div");
      elem.setAttribute("id", "char" + index);
      elem.textContent = "@";
      characterPreview.appendChild(elem);
    });

    let activeChar = SM.get("event.activeChar");

    characterName.textContent = activeChar[0];
    characterHpCurrent.textContent = activeChar[1].stats.hp;
    characterHpMax.textContent = activeChar[1].stats.maxHp;

    // enemy display and info
    let enemyPreview = getQuerySelector(
      "#fightPanel #battleDisplay #enemySide #enemyInfoPanel #enemyPreview"
    );
    let enemyName = getQuerySelector(
      "#fightPanel #battleDisplay #enemySide #enemyInfoPanel #enemyInfo #enemyInfoName"
    );
    let enemyHpCurrent = getQuerySelector(
      "#fightPanel #battleDisplay #enemySide #enemyInfoPanel #enemyInfo #enemyInfoHpWrapper #enemyInfoHpCurrent"
    );
    let enemyHpMax = getQuerySelector(
      "#fightPanel #battleDisplay #enemySide #enemyInfoPanel #enemyInfo #enemyInfoHpWrapper #enemyInfoHpMax"
    );

    enemyPreview.innerHTML = "";

    let enemies = SM.get("event.inactiveEnemies");

    enemies.forEach((enemy) => {
      //console.log(enemy);
      let elem = createEl("div");
      elem.setAttribute("id", "placeholder");
      elem.textContent = "E";
      enemyPreview.appendChild(elem);
    });

    let activeEnemy = SM.get("event.activeEnemy");

    enemyName.textContent = activeEnemy.name;
    enemyHpCurrent.textContent = activeEnemy.stats.hp;
    enemyHpMax.textContent = activeEnemy.stats.maxHp;
  },

  updateAttackPanel: function () {
    let attackPanelWrapper = getQuerySelector(
      "#fightPanel #battleMenu #attackPanel #optionsPanel #wrapper"
    );
    attackPanelWrapper.innerHTML = "";

    let activeChar = SM.get("event.activeChar");
    let activeCharSkills = activeChar[1].skills;

    if (activeCharSkills && typeof activeCharSkills === "object") {
      for (const skill in activeCharSkills) {
        if (activeCharSkills.hasOwnProperty(skill) && activeCharSkills[skill]) {
          let fullName = EM.getSkillProperty(skill, "name");
          let elem = new Button.custom({
            id: skill,
            text: fullName,
          });
          elem.element.addEventListener("click", () => {
            console.log(fullName);
          });
          attackPanelWrapper.appendChild(elem.element);
        }
      }
    }
  },

  updateSwitchPanel: function () {
    let switchPanelWrapper = getQuerySelector(
      "#fightPanel #battleMenu #switchPanel #optionsPanel #wrapper"
    );
    switchPanelWrapper.innerHTML = "";
    // updating the characters you can switch
    //switchPanelWrapper.textContent = "hello world!";

    let inactiveChars = SM.get("event.inactiveChars");

    inactiveChars.forEach((char) => {
      let charName = char[0];
      let elem = new Button.custom({
        id: "character",
        text: charName,
      });
      elem.element.addEventListener("click", () => {
        EM.switchActiveCharacter(char);
      });
      switchPanelWrapper.appendChild(elem.element);
    });
  },

  updateItemsPanel: function () {
    let itemsPanelWrapper = getQuerySelector(
      "#fightPanel #battleMenu #switchPanel #optionsPanel #wrapper"
    );

    let combatItems = Object.entries(SM.get("resources.inventory.combatItems"));
    combatItems.forEach((item) => {
      let elem = createEl("div");
      elem.setAttribute("class", "item");

      elem.addEventListener("click", () => {
        console.log(item);
      });
      itemsPanelWrapper.appendChild(elem);
    });
    console.log("combatItems:", combatItems);
  },

  switchActiveCharacter: function (character) {
    let activeChar = SM.get("event.activeChar");
    let inactiveChars = SM.get("event.inactiveChars");

    if (inactiveChars.includes(character)) {
      inactiveChars.push(activeChar);
      SM.set("event.activeChar", character);

      let index = inactiveChars.findIndex((char) => char === character);
      if (index !== -1) {
        inactiveChars.splice(index, 1);
        SM.set("event.inactiveChars", inactiveChars);
        PM.ping("you switch to " + character[0]);
        this.updateAll();
        this.changePanel(EM.panelEnums.mainPanel);
      } else {
        console.log("char to switch not found");
      }
    } else {
      console.log("character to switch not among the inactive character list");
    }
  },
  shiftToNextEnemy: function () {
    let inactiveEnemies = SM.get("event.inactiveEnemies");
  },

  getSkillProperty: function (id, property) {
    for (const char of PathfinderCharLib) {
      for (const skill of char.skills) {
        if (skill.id === id) {
          if (skill[property]) {
            return skill[property];
          } else {
            console.log("skill property:", property, " is undefined");
            return undefined;
          }
        }
      }
    }
  },

  panelEnums: {
    mainPanel: "mainPanel",
    attackPanel: "attackPanel",
    itemsPanel: "itemsPanel",
    switchPanel: "switchPanel",
  },

  changePanel: function (panel) {
    EM.hidePanels();

    let mainPanel = getQuerySelector("#fightPanel #battleMenu #mainPanel");
    let attackPanel = getQuerySelector("#fightPanel #battleMenu #attackPanel");
    let itemsPanel = getQuerySelector("#fightPanel #battleMenu #itemsPanel");
    let switchPanel = getQuerySelector("#fightPanel #battleMenu #switchPanel");

    switch (panel) {
      case EM.panelEnums.mainPanel:
        mainPanel.style.display = "flex";
        break;
      case EM.panelEnums.attackPanel:
        attackPanel.style.display = "flex";
        break;
      case EM.panelEnums.itemsPanel:
        itemsPanel.style.display = "flex";
        break;
      case EM.panelEnums.switchPanel:
        switchPanel.style.display = "flex";
        break;
    }
  },

  attackButton: null,
  guardButton: null,
  itemsButton: null,
  switchButton: null,

  createMainPanel: function () {
    let mainPanel = createEl("div");
    mainPanel.setAttribute("id", "mainPanel");

    let descriptionPanel = createEl("div");
    descriptionPanel.setAttribute("id", "descriptionPanel");
    descriptionPanel.textContent = "what will you do?";
    mainPanel.appendChild(descriptionPanel);

    let optionsPanel = createEl("div");
    optionsPanel.setAttribute("id", "optionsPanel");
    mainPanel.appendChild(optionsPanel);

    let wrapper = createEl("div");
    wrapper.setAttribute("id", "wrapper");
    optionsPanel.appendChild(wrapper);

    EM.attackButton = new Button.custom({
      id: "attackButton",
      text: "attack.",
    });
    EM.attackButton.element.addEventListener("click", () => {
      EM.changePanel(EM.panelEnums.attackPanel);
    });
    wrapper.appendChild(EM.attackButton.element);

    EM.guardButton = new Button.custom({
      id: "guardButton",
      text: "guard.",
    });
    EM.guardButton.element.addEventListener("click", () => {
      console.log("guarding turn");
    });
    wrapper.appendChild(EM.guardButton.element);

    EM.itemsButton = new Button.custom({
      id: "itemsButton",
      text: "items.",
    });
    EM.itemsButton.element.addEventListener("click", () => {
      EM.changePanel(EM.panelEnums.itemsPanel);
    });
    wrapper.appendChild(EM.itemsButton.element);

    EM.switchButton = new Button.custom({
      id: "switchButton",
      text: "switch.",
    });
    EM.switchButton.element.addEventListener("click", () => {
      EM.changePanel(EM.panelEnums.switchPanel);
    });
    wrapper.appendChild(EM.switchButton.element);

    return mainPanel;
  },

  createAttackPanel: function () {
    let attackPanel = createEl("div");
    attackPanel.setAttribute("id", "attackPanel");
    attackPanel.setAttribute("class", "panel");

    let optionsPanel = createEl("div");
    optionsPanel.setAttribute("id", "optionsPanel");
    attackPanel.appendChild(optionsPanel);

    let wrapper = createEl("div");
    wrapper.setAttribute("id", "wrapper");
    optionsPanel.appendChild(wrapper);

    // return button for attackpanel
    let returnPanel = createEl("div");
    returnPanel.setAttribute("id", "returnPanel");
    attackPanel.appendChild(returnPanel);

    let returnButton = new Button.custom({
      id: "returnButton",
      text: "back",
    });
    returnButton.element.addEventListener("click", () => {
      EM.changePanel(EM.panelEnums.mainPanel);
    });
    returnPanel.appendChild(returnButton.element);

    return attackPanel;
  },

  createItemsPanel: function () {
    let itemsPanel = createEl("div");
    itemsPanel.setAttribute("id", "itemsPanel");
    itemsPanel.setAttribute("class", "panel");

    let optionsPanel = createEl("div");
    optionsPanel.setAttribute("id", "optionsPanel");
    itemsPanel.appendChild(optionsPanel);

    let wrapper = createEl("div");
    wrapper.setAttribute("id", "wrapper");
    optionsPanel.appendChild(wrapper);

    // return
    let returnPanel = createEl("div");
    returnPanel.setAttribute("id", "returnPanel");
    itemsPanel.appendChild(returnPanel);

    let returnButton = new Button.custom({
      id: "returnButton",
      text: "back",
    });
    returnButton.element.addEventListener("click", () => {
      EM.changePanel(EM.panelEnums.mainPanel);
    });
    returnPanel.appendChild(returnButton.element);

    return itemsPanel;
  },

  createSwitchpanel: function () {
    let switchPanel = createEl("div");
    switchPanel.setAttribute("id", "switchPanel");
    switchPanel.setAttribute("class", "panel");

    let optionsPanel = createEl("div");
    optionsPanel.setAttribute("id", "optionsPanel");
    switchPanel.appendChild(optionsPanel);

    let wrapper = createEl("div");
    wrapper.setAttribute("id", "wrapper");
    optionsPanel.appendChild(wrapper);

    // return
    let returnPanel = createEl("div");
    returnPanel.setAttribute("id", "returnPanel");
    switchPanel.appendChild(returnPanel);

    let returnButton = new Button.custom({
      id: "returnButton",
      text: "back",
    });
    returnButton.element.addEventListener("click", () => {
      EM.changePanel(EM.panelEnums.mainPanel);
    });
    returnPanel.appendChild(returnButton.element);
    return switchPanel;
  },

  weightedEnemySelection(pool) {
    const totalProbabilty = pool.reduce(
      (acc, enemy) => acc + enemy.probability,
      0
    );
    const randomNum = Math.random() * totalProbabilty;

    let culminativeProbability = 0;
    for (const enemy of pool) {
      culminativeProbability += enemy.probability;
      if (randomNum <= culminativeProbability) {
        return enemy;
      }
    }
  },

  randRange: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  nonCombatModuleEnums: {
    FortuneCache: "FortuneCache",
    Respite: "Respite",
    SamaritansAid: "SamaritansAid",
    ShrineOfAbyss: "ShrineOfAbyss",
    WanderingMerchant: "WanderingMerchant",
  },

  activeNonCombatModule: null,

  enterNonCombat: function (event) {
    //const parent = getID(this.eventId);
    SM.set("event.state", this.eventStatesEnum.executing);

    this.clearEventView();
    let name;
    name = event.type;
    name = uppercaseify(name);
    this.activeNonCombatModule = name;
    this.updateNonCombatView();

    //console.log(this.activeNonCombatModule);
  },

  clearEventView: function () {
    const parent = getID(this.eventId);
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  },

  updateNonCombatView: function () {
    switch (this.activeNonCombatModule) {
      case this.nonCombatModuleEnums.FortuneCache:
        FortuneCache.init();
        break;
      case this.nonCombatModuleEnums.Respite:
        Respite.init();
        break;
      case this.nonCombatModuleEnums.SamaritansAid:
        SamaritansAid.init();
        break;
      case this.nonCombatModuleEnums.ShrineOfAbyss:
        ShrineOfAbyss.init();
        break;
      case this.nonCombatModuleEnums.WanderingMerchant:
        WanderingMerchant.init();
      default:
        console.log("tried to update non combat view, failed");
        break;
    }
  },
};
