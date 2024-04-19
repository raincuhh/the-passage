/**
 * button object
 *
 * new Button.customButton({
 *  id: string,
 *  text: placeholder,
 *  click: function,
 *  width: num,
 * })
 */
const Button = {
  custom: function (param) {
    let elem = createEl("div");
    elem.setAttribute(
      "id",
      typeof param.id !== "undefined" ? param.id : "BTN_" + Main.createGuid()
    );
    elem.setAttribute("class", "button");
    elem.textContent =
      typeof param.text !== "undefined" ? param.text : "button";
    // el.classList.toggle("disabled", typeof param.cd !== "undefined");
    if (typeof param.disabled !== "undefined" && param.disabled) {
      elem.setAttribute("data-disabled", "true");
      elem.classList.add("disabled");
    }
    if (
      typeof param.click !== "undefined" &&
      typeof param.click === "function"
    ) {
      if (!elem.classList.contains("disabled")) {
        elem.addEventListener("click", function (event) {
          param.click(event);
        });
      }
    }
    if (typeof param.width !== "undefined") {
      elem.style.width = param.width;
    }
    return elem;
  },
  disabled: function (btn, param) {
    if (param.dsabled) {
      btn.setAttribute("data-disabled", "true");
      btn.classList.add("disabled");
    } else {
      btn.setAttribute("data-disabled", "false");
      btn.classList.remove("disabled");
    }
  },
  onCooldown: function (btn, cd) {},
};
