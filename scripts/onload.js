/**
 * onload
 */
window.onload = function () {
  if (!MM.ready) {
    const ROOT = getID("root");
    if (!ROOT || !ROOT.parentElement) {
      MM.error();
    } else {
      console.log(
        "[=== " + "Hello, myself here, dont change the save will you ʕ•ᴥ•ʔ",
        ", the game has loaded." + " ===]"
      );
      MM.init();
    }
  }
};
