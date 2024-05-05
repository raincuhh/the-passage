/**
 * eventsManager
 * handles ui + nodeEvents, pathEvents, randomEvents,
 *
 */

/* known bugs
  - no errorhandling on some stuff
  - weird bug with characters dying, next event
    will still have those characters but their hp is 0 and they instadie.
  - deathcheck sometimes does some weird stuff
  - sometimes you cant do an attack and it just freezes at userturn
    if you attack enemy and it dies.
    ui basically doesnt update for some reason
  - bug with enemies keeping their hp through different events - FIXED (probably)
  - attacking sometimes doesnt update ui
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
      PM.ping("NOTE - if you get stuck in combat try refreshing");
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

    // setting up and getting actors
    this.performed = false;
    this.won = false;

    // defining enemy pool from which enemies are picked from
    let regionPool = Region.currentRegionPool;
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
              chosen = this.weightedEnemySelection([...worldPool]);
              break;
            case enemyScopeEnum.regionCheckScope:
              chosen = this.weightedEnemySelection([...regionCheckPool]);
              break;
            case enemyScopeEnum.sinMinionsScope:
              chosen = this.weightedEnemySelection([...abyssMinionsPool]);
              break;
            default:
              chosen = this.weightedEnemySelection([...regionPool]);
              break;
          }
          temp.push(chosen);
        }
      } else {
        let sinBoss = SM.get("run.activeSin");
        let chosen;
        for (const boss of [...sinBossPool]) {
          if (boss.name === sinBoss) {
            chosen = boss;
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
        let copiedEnemy = { ...enemy }; // Create a copy using spread operator
        let enemyHp = EM.lookupEnemyHp(copiedEnemy);
        //console.log("copied enemy hp:", enemyHp);
        copiedEnemy.stats.hp = enemyHp;
        temp.push(copiedEnemy);
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
      //console.log(temp);
      SM.set("event.inactiveChars", temp);
    }

    // setting active character
    if (!SM.get("event.activeChar")) {
      let inactiveChars = SM.get("event.inactiveChars");

      //console.log("inactiveChars:", inactiveChars);

      let chosen = inactiveChars[0];
      //console.log(chosen);

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
        EM.changeBattleState(EM.turnStates.playerTurn);
      } else {
        EM.changeBattleState(EM.turnStates.enemyTurn);
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

    this.hidePanels();
    this.updateAll();

    if (SM.get("event.turnState") === EM.turnStates.playerTurn) {
      this.changePanel(EM.panelEnums.mainPanel);
    } else if (SM.get("event.turnState") === EM.turnStates.enemyTurn) {
      this.changePanel(EM.panelEnums.enemyTurnPanel);
    }

    /*
    console.log("activeChar", SM.get("event.activeChar"));
    console.log("inactiveChars", SM.get("event.inactiveChars"));
    console.log("activeEnemy", SM.get("event.activeEnemy"));
    console.log("inactiveEnemies", SM.get("event.inactiveEnemies"));
    */
    EM.deathCheck();
  },

  lookupEnemyHp: function (enemyCopy) {
    return hpLookup[enemyCopy.name] || 0;
  },

  testNum: 100,

  changeBattleState: function (state) {
    SM.set("event.turnState", state);
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
      case EM.turnStates.lost:
        Region.resetRun();
        break;
      case EM.turnStates.won:
        EM.endEvent();
        break;
    }
  },

  playerTurn: function () {
    //console.log("player turn");

    EM.deathCheck();
    EM.hidePanels();
    EM.changePanel(EM.panelEnums.mainPanel);
    //EM.enableMainPanelButtons();
  },
  isEnemyTurn: null,

  enemyTurn: function () {
    //console.log("enemy turn");

    EM.deathCheck();
    EM.isEnemyTurn = true;

    setTimeout(() => {
      if (EM.isEnemyTurn) {
        EM.changeBattleState(EM.turnStates.playerTurn);
      }
    }, 3000);

    EM.hidePanels();
    EM.changePanel(EM.panelEnums.enemyTurnPanel);
    //EM.disableMainPanelButtons();

    let activeChar = SM.get("event.activeChar");
    let activeEnemy = SM.get("event.activeEnemy");
    let dmg = EM.getComputerAttackDmg();
    setTimeout(() => {
      PM.ping("...");
    }, 750);

    setTimeout(() => {
      EM.isEnemyTurn = false;
      EM.computerAttack(activeEnemy, activeChar, dmg);
    }, 1500);
  },

  computerAttack: function (attacker, defendant, value) {
    let attackerName = attacker ? attacker.name : null;
    let defendantName = defendant ? defendant[0] : null;

    if (!attackerName) {
      console.log(" attacker is dead or missing, returning");
      return;
    }

    let oldHp = SM.get("event.activeChar[1].stats.hp");
    //console.log("oldHp:", oldHp);

    let newHp = Math.max(oldHp - value, 0);

    SM.set("event.activeChar[1].stats.hp", newHp);
    //console.log("newHp:", SM.get("event.activeChar[1].stats.hp"));

    PM.ping(attackerName + " attacks " + defendantName + " for " + value);
    EM.deathCheck();

    let inactiveChars = SM.get("event.inactiveChars");
    let inactiveEnemies = SM.get("event.inactiveEnemies");

    if (inactiveChars || inactiveEnemies) {
      if (inactiveChars.length > 0 || inactiveEnemies.length > 0) {
        EM.changeBattleState(EM.turnStates.playerTurn);
        EM.updateBattleDisplay();
        EM.updateAttackPanel();
      }
    }
  },

  playerAttack: function (attacker, defendant, value) {
    let attackerName = attacker[0];
    let defendantName = defendant.name;

    let oldHp = SM.get("event.activeEnemy.stats.hp");
    //console.log("oldHp:", oldHp);

    let newHp = Math.max(oldHp - value, 0);

    SM.set("event.activeEnemy.stats.hp", newHp);
    //console.log("newHp:", newHp);

    PM.ping(attackerName + " attacks " + defendantName + " for " + value);
    EM.deathCheck();

    let inactiveChars = SM.get("event.inactiveChars");
    let inactiveEnemies = SM.get("event.inactiveEnemies");

    if (inactiveChars || inactiveEnemies) {
      if (inactiveChars.length > 0 || inactiveEnemies.length > 0) {
        EM.changeBattleState(EM.turnStates.enemyTurn);
        EM.updateBattleDisplay();
        EM.updateAttackPanel();
      }
    }
  },

  deathCheck: function () {
    let activeChar = SM.get("event.activeChar");
    let activeEnemy = SM.get("event.activeEnemy");

    let activeCharHp = SM.get("event.activeChar[1].stats.hp");
    let activeEnemyHp = SM.get("event.activeEnemy.stats.hp");

    if (activeCharHp <= 0) {
      PM.ping(activeChar[0] + " died");
      SM.delete("event.activeChar");
      this.shiftToNextChar();
    }

    if (activeEnemyHp <= 0) {
      PM.ping(activeEnemy.name + " died");
      SM.delete("event.activeEnemy");
      this.shiftToNextEnemy();
    }
  },

  getComputerAttackDmg: function () {
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

    let enemyTurnPanel = EM.createEnemyTurnPanel();
    elem.appendChild(enemyTurnPanel);

    return elem;
  },

  hidePanels: function () {
    let mainPanel = getQuerySelector("#fightPanel #battleMenu #mainPanel");
    let attackPanel = getQuerySelector("#fightPanel #battleMenu #attackPanel");
    let itemsPanel = getQuerySelector("#fightPanel #battleMenu #itemsPanel");
    let switchPanel = getQuerySelector("#fightPanel #battleMenu #switchPanel");
    let enemyTurnPanel = getQuerySelector(
      "#fightPanel #battleMenu #enemyTurnPanel"
    );

    const setDisplayStyle = (element, displayValue) => {
      if (element) {
        element.style.display = displayValue;
      }
    };

    setDisplayStyle(mainPanel, "none");
    setDisplayStyle(attackPanel, "none");
    setDisplayStyle(itemsPanel, "none");
    setDisplayStyle(switchPanel, "none");
    setDisplayStyle(enemyTurnPanel, "none");
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

    try {
      if (characterPreview) {
        characterPreview.innerHTML = "";
      }
    } catch (error) {
      console.error("Error setting innerHTML for characterPreview:", error);
    }

    let activeChar = SM.get("event.activeChar");
    if (activeChar) {
      let inactiveChars = Object.values(SM.get("event.inactiveChars"));
      inactiveChars.forEach((char, index) => {
        let charName = char[0];

        let elem = createEl("div");
        elem.setAttribute("id", "char" + index);
        elem.textContent = "@";
        try {
          if (characterPreview) {
            characterPreview.appendChild(elem);
          }
        } catch (error) {
          console.error("Error appending child to characterPreview:", error);
        }
      });

      characterName.textContent = activeChar[0];
      characterHpCurrent.textContent = activeChar[1].stats.hp;
      characterHpMax.textContent = activeChar[1].stats.maxHp;
    }

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

    try {
      if (enemyPreview) {
        enemyPreview.innerHTML = "";
      }
    } catch (error) {
      console.error("Error setting innerHTML for enemyPreview:", error);
    }

    let activeEnemy = SM.get("event.activeEnemy");
    if (activeEnemy) {
      let inactiveEnemies = SM.get("event.inactiveEnemies");

      inactiveEnemies.forEach((enemy) => {
        let elem = createEl("div");
        elem.setAttribute("id", "placeholder");
        elem.textContent = "E";
        try {
          if (enemyPreview) {
            enemyPreview.appendChild(elem);
          }
        } catch (error) {
          console.error("Error appending child to enemyPreview:", error);
        }
      });

      enemyName.textContent = activeEnemy.name;
      enemyHpCurrent.textContent = activeEnemy.stats.hp;
      enemyHpMax.textContent = activeEnemy.stats.maxHp;
    }
  },

  updateAttackPanel: function () {
    let attackPanelWrapper = getQuerySelector(
      "#fightPanel #battleMenu #attackPanel #optionsPanel #wrapper"
    );
    if (attackPanelWrapper) attackPanelWrapper.innerHTML = "";

    let activeChar = SM.get("event.activeChar");
    let activeEnemy = SM.get("event.activeEnemy");

    if (
      activeChar &&
      activeChar[1] &&
      activeChar[1].skills &&
      typeof activeChar[1].skills === "object"
    ) {
      let activeCharSkills = activeChar[1].skills;

      for (const skill in activeCharSkills) {
        if (activeCharSkills.hasOwnProperty(skill) && activeCharSkills[skill]) {
          let fullName = EM.getSkillProperty(skill, "name");
          let dmg = EM.getSkillProperty(skill, "dmg");
          let elem = new Button.custom({
            id: skill,
            text: fullName,
          });
          elem.element.addEventListener("click", () => {
            EM.playerAttack(activeChar, activeEnemy, dmg);
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
    if (switchPanelWrapper) switchPanelWrapper.innerHTML = "";

    let inactiveChars = SM.get("event.inactiveChars");

    if (Array.isArray(inactiveChars) && inactiveChars.length > 0) {
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
    }
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
    //console.log("combatItems:", combatItems);
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
        console.log("changing panel from switchActiveChar function");
        this.changePanel(EM.panelEnums.mainPanel);
      } else {
        console.log("char to switch not found");
      }
    } else {
      console.log("character to switch not among the inactive character list");
    }
  },

  shiftToNextChar: function () {
    let inactiveChars = SM.get("event.inactiveChars");

    if (inactiveChars.length > 0) {
      let nextChar = inactiveChars.shift();
      SM.set("event.activeChar", nextChar);
      SM.set("event.inactiveChars", inactiveChars);
    } else {
      //console.log("no characters to shift to");
      EM.changeBattleState(EM.turnStates.lost);
    }
  },

  shiftToNextEnemy: function () {
    let inactiveEnemies = SM.get("event.inactiveEnemies");

    if (inactiveEnemies.length > 0) {
      let nextEnemy = inactiveEnemies.shift();
      SM.set("event.activeEnemy", nextEnemy);
      SM.set("event.inactiveEnemies", inactiveEnemies);
      //EM.changeBattleState(EM.turnStates.playerTurn);
    } else {
      //console.log("no enemies to shift to");
      EM.changeBattleState(EM.turnStates.won);
    }
  },

  getSkillProperty: function (id, property) {
    for (const char of PathfinderCharLib) {
      for (const skill of char.skills) {
        if (skill.id === id) {
          if (skill[property]) {
            return skill[property];
          } else {
            console.error("skill property:", property, " is undefined");
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
    enemyTurnPanel: "enemyTurnPanel",
  },

  changePanel: function (panel) {
    EM.hidePanels();

    let mainPanel = getQuerySelector("#fightPanel #battleMenu #mainPanel");
    let attackPanel = getQuerySelector("#fightPanel #battleMenu #attackPanel");
    let itemsPanel = getQuerySelector("#fightPanel #battleMenu #itemsPanel");
    let switchPanel = getQuerySelector("#fightPanel #battleMenu #switchPanel");
    let enemyTurnPanel = getQuerySelector(
      "#fightPanel #battleMenu #enemyTurnPanel"
    );

    const setDisplayStyle = (element, displayValue) => {
      if (element) {
        element.style.display = displayValue;
      }
    };

    switch (panel) {
      case EM.panelEnums.mainPanel:
        setDisplayStyle(mainPanel, "flex");
        break;
      case EM.panelEnums.attackPanel:
        setDisplayStyle(attackPanel, "flex");
        break;
      case EM.panelEnums.itemsPanel:
        setDisplayStyle(itemsPanel, "flex");
        break;
      case EM.panelEnums.switchPanel:
        setDisplayStyle(switchPanel, "flex");
        break;
      case EM.panelEnums.enemyTurnPanel:
        setDisplayStyle(enemyTurnPanel, "flex");
        break;
    }
  },

  disableMainPanelButtons: function () {
    Button.disabled(EM.attackButton.element, true);
    Button.disabled(EM.guardButton.element, true);
    Button.disabled(EM.itemsButton.element, true);
    Button.disabled(EM.switchButton.element, true);
    EM.attackButton.updateListener();
    EM.guardButton.updateListener();
    EM.itemsButton.updateListener();
    EM.switchButton.updateListener();
  },
  enableMainPanelButtons: function () {
    Button.disabled(EM.attackButton.element, false);
    Button.disabled(EM.guardButton.element, true); // disabled for now cause weird
    Button.disabled(EM.itemsButton.element, false);
    Button.disabled(EM.switchButton.element, false);
    EM.attackButton.updateListener();
    EM.guardButton.updateListener();
    EM.itemsButton.updateListener();
    EM.switchButton.updateListener();
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
    Button.disabled(EM.guardButton.element, true);
    EM.guardButton.element.addEventListener("click", () => {
      console.log("guarding turn");
    });
    wrapper.appendChild(EM.guardButton.element);

    EM.itemsButton = new Button.custom({
      id: "itemsButton",
      text: "items.",
    });
    Button.disabled(EM.itemsButton.element, true);
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

  createEnemyTurnPanel: function () {
    let enemyTurnPanel = createEl("div");
    enemyTurnPanel.setAttribute("id", "enemyTurnPanel");
    enemyTurnPanel.setAttribute("class", "panel");
    enemyTurnPanel.textContent = "enemy turn";

    return enemyTurnPanel;
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
