/**
 * save module
 * handles saving, loading, exporting and importing.
 */
let SaveManager = {
  createSaved: function () {
    let elem = createEl("div");
    elem.setAttribute("id", "saved");
    elem.textContent = "saved";
    elem.style.opacity = 0;
    const MAIN = getID("main");
    MAIN.insertBefore(elem, MAIN.firstChild);
  },

  saveNotif: function () {
    const ELEM = getID("saved");
    ELEM.style.opacity = 1;
    setTimeout(function () {
      ELEM.style.transition = "opacity 1.5s";
      ELEM.style.opacity = 0;
    }, 10);
  },

  saveGame: function () {
    try {
      let string = JSON.stringify(SM.components);
      //let encodedString = btoa(string);
      localStorage.setItem("save", string);
      //localStorage.setItem("save", encodedString);

      this.saveNotif();
    } catch (error) {
      if (error === DOMException.QUOTA_EXCEEDED_ERR) {
        console.log(
          "Quota exceeded err. Tried to save data through localstorage but not enough space to save all data."
        );
      }
      console.error("error occured: ", error);
      alert("tried to save, attempt failed, view error in console");
    }
  },

  loadGame: function () {
    let encodedString = localStorage.getItem("save");
    if (encodedString) {
      try {
        //let decodedString = atob(encodedString);
        //let save = JSON.parse(decodedString);
        let save = JSON.parse(encodedString);
        SM.components = save;
      } catch (error) {
        console.error("error occured: ", error);
        alert("tried to load save, attempt failed, view error in console");
      }
    } else {
      console.log("no save found");
    }
  },

  deleteGame: function (/*reload*/) {
    this.saveGame();
    localStorage.removeItem("save");
    localStorage.clear();
    location.reload();
    /*
    if (reload){
      location.reload()
    }
    */
  },

  export: function () {
    this.saveGame();
    let string = this.gen64();

    // bruteforce
    console.log(
      "[=== " +
        "this is your savefile, copy it to transfer to other devices" +
        " ===]"
    );
    console.log(string);
    return string;
  },

  gen64: function () {
    let save = SM.components;
    save = JSON.stringify(save);
    save = btoa(save);
    return save;
  },

  import: function () {
    const IMPORTDIV = getID("changethiswhenyoumaketheimportdiv");
    let string = IMPORTDIV.textContent;
    try {
      let save = atob(string);
      save = JSON.parse(save);
      localStorage.setItem("save", save);
      this.saveGame();
      this.loadGame();
      console.log("loaded complete");
    } catch (error) {
      console.error(error);
      alert("error: please try re-importing");
    }
  },
};
