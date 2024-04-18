/**
 * onload
 */
window.onload = function () {
  if (!Main.ready) {
    const ROOT = getID("root");
    if (!ROOT || !ROOT.parentElement) {
      Main.error();
    } else {
      console.log(
        "[=== " + "Heya, the game has loaded, dont cheat thanks." + " ===]"
      );
      Main.init();
    }
  }
};
