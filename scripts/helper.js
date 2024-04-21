// helper functions
function getID(id) {
  return document.getElementById(id);
}
function getQuerySelector(what) {
  return document.querySelector(what);
}
function createEl(elem) {
  return document.createElement(elem);
}
function floorRandom(thing) {
  return Math.floor(Math.random() * thing);
}
function random(thing) {
  return Math.random() * thing;
}
function uppercaseifyString(str) {
  let PARTS = str.split(" ");
  PARTS.forEach((part, index) => {
    PARTS[index] = uppercaseify(part);
  });

  return PARTS.join(" ");
}
function uppercaseify(str) {
  let firstChar = str.charAt(0);
  if (firstChar !== firstChar.toUpperCase()) {
    str = str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str;
}
function undercaseifyString(str) {
  let PARTS = str.split(" ");
  PARTS.forEach((part, index) => {
    PARTS[index] = undercaseify(part);
  });
}
function undercaseify(str) {
  let firstChar = str.charAt(0);
  if (firstChar !== firstChar.toLowerCase()) {
    str = str.charAt(0).toLowerCase() + str.slice(1);
  }
  return str;
}
function uppercaseToArray(str) {
  let result = str.replace(/([A-Z]+)/g, ",$1").replace(/^,/, "");
  return result.split(",");
}
function periodify(str) {
  if (str.slice(-1) != ".") {
    str += ".";
  }
  return str;
}
// for localization if needbe in the future
function loc(str) {
  return str;
}
function randomNumberBetween2Values(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
