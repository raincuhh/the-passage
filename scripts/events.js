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

  getEnumFromEvent: function (name) {
    let nodeTypeEnums = this.nodeTypeEnums;
    let type = nodeTypeEnums.find((e) => Object.values(e)[0] === name.type);
    return type ? Object.keys(type) : null;
  },

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
  enemyActors: [],
  partyActors: [],

  turnbasedStates: {
    playerTurn: "playerTurn",
    enemyTurn: "enemyTurn",
    won: "won",
    lost: "lost",
  },

  enterCombat: function (event) {
    const parent = getID(this.eventId);

    let exploreButton = getID("exploreButton");
    exploreButton.style.display = "none";
    Region.exploreButton.updateListener();
    //console.log(event);

    // setting up and getting actors
    this.performed = false;
    this.won = false;

    this.enemyActors = [];
    this.partyActors = [];

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

    // getting enemy scope

    console.log("event type:", event.type);
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
    //console.log("scope:", scope);

    // getting random amount of enemy actors
    if (!SM.get("event.enemyActors")) {
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
      SM.set("event.enemyActors", temp);
    }

    // putting enemies in the events enemyactor pool
    let enemies = Object.entries(SM.get("event.enemyActors"));
    for (const i of enemies) {
      this.enemyActors.push(i);
    }

    // same with the pathfinders
    let pathfinders = Object.entries(SM.get("char.characters"));
    for (const i of pathfinders) {
      this.partyActors.push(i);
    }

    SM.set("event.state", this.eventStatesEnum.executing);

    console.log("party:", this.partyActors);
    console.log("enemies:", this.enemyActors);

    // after setting up, deciding the first 2 characters
    // active character will always be the just shifting the 0th index from partyActors
    // active enemy will be randomly gotten through the enemies

    let activeCharacter = [];
    let activeEnemy = [];
    let inactiveCharacters = [];
    let inactiveEnemies = [];

    activeCharacter.push(this.partyActors.shift());

    // creating the fighting panel
    let fightPanel = createEl("div");
    fightPanel.setAttribute("id", "fightPanel");
    parent.appendChild(fightPanel);

    // creating the battleDisplay ( has the sprite images, health and stuff)
    let battleDisplay = EM.createbattleDisplay();
    fightPanel.appendChild(battleDisplay);

    // creating the battle menu ( holds attack, guard, items and switch stuff)
    let battleMenu = EM.createBattleMenu();
    fightPanel.appendChild(battleMenu);

    this.hidePanels();
    this.updatePanels(activeCharacter);
    this.changePanel(EM.panelEnums.mainPanel);
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
    enemyPreview.textContent = "E E E";
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
    characterPreview.textContent = "@ @ @";
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

  createMainPanel: function () {
    let mainPanel = createEl("div");
    mainPanel.setAttribute("id", "mainPanel");

    let descriptionPanel = createEl("div");
    descriptionPanel.setAttribute("id", "descriptionPanel");
    descriptionPanel.textContent = "what will you do?";
    mainPanel.appendChild(descriptionPanel);

    let optionsPanel = EM.createOptionsPanel();
    mainPanel.appendChild(optionsPanel);

    return mainPanel;
  },

  attackButton: null,
  guardButton: null,
  itemsButton: null,
  switchButton: null,

  createOptionsPanel: function () {
    let elem = createEl("div");
    elem.setAttribute("id", "optionsPanel");

    // holds options
    let wrapper = createEl("div");
    wrapper.setAttribute("id", "wrapper");
    elem.appendChild(wrapper);

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

  updatePanels: function (character) {
    let mainPanel = getQuerySelector("#fightPanel #battleMenu #mainPanel");
    let attackPanel = getQuerySelector("#fightPanel #battleMenu #attackPanel");
    let itemsPanel = getQuerySelector("#fightPanel #battleMenu #itemsPanel");
    let switchPanel = getQuerySelector("#fightPanel #battleMenu #switchPanel");

    console.log("characterInfo:", character[0][1].skills);
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

  attack1Button: null,
  attack2Button: null,
  attack3Button: null,
  attack4Button: null,

  createAttackPanel: function () {
    let attackPanel = createEl("div");
    attackPanel.setAttribute("id", "attackPanel");
    attackPanel.setAttribute("class", "panel");

    let attacksWrapper = createEl("div");
    attacksWrapper.setAttribute("id", "attacksWrapper");
    attackPanel.appendChild(attacksWrapper);

    let returnButton = new Button.custom({
      id: "returnButton",
      text: "back",
    });
    returnButton.element.addEventListener("click", () => {
      EM.changePanel(EM.panelEnums.mainPanel);
    });
    attackPanel.appendChild(returnButton.element);

    return attackPanel;
  },

  createItemsPanel: function () {
    let itemsPanel = createEl("div");
    itemsPanel.setAttribute("id", "itemsPanel");
    itemsPanel.setAttribute("class", "panel");
    return itemsPanel;
  },

  createSwitchpanel: function () {
    let switchPanel = createEl("div");
    switchPanel.setAttribute("id", "switchPanel");
    switchPanel.setAttribute("class", "panel");
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

  /**
   * Active non combat mobule doesnt really need
   * to be saved in sm cause when i
   * make the module view, its gonna create the different
   * values if it hasnt already been created.
   *
   * So like in the goblinmarket for example, if first time then
   * its gonna create a list of random items. But if not first time
   * then its just gonna load the list of items that were created.
   */

  activeNonCombatModule: null,

  nonCombatModuleEnums: {
    FortuneCache: "FortuneCache",
    Respite: "Respite",
    SamaritansAid: "SamaritansAid",
    ShrineOfAbyss: "ShrineOfAbyss",
    WanderingMerchant: "WanderingMerchant",
  },

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
