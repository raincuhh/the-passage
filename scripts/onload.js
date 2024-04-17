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
        "[=== " + "Heya, the game has loaded, dont cheat thanks." + " ===]"
      );
      MM.init();
    }
  }
};
