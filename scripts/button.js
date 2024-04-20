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

    if (typeof param.id !== "undefined") {
      elem.setAttribute("id", param.id);
    } else {
      elem.setAttribute("id", "BTN_" + Main.createGuid());
    }
    elem.setAttribute("class", "button");

    if (typeof param.text !== "undefined") {
      elem.textContent = param.text;
    } else {
      elem.textContent = "button";
    }

    if (typeof param.disabled !== "undefined" && param.disabled === true) {
      elem.classList.add("disabled");
    }

    const updateListener = () => {
      if (
        typeof param.click !== "undefined" &&
        typeof param.click === "function"
      ) {
        if (!elem.classList.contains("disabled")) {
          elem.addEventListener("click", (event) => {
            param.click(event);
          });
        }
      }
    };
    //this.updateListener(elem, param);
    if (typeof param.width !== "undefined") {
      elem.style.width = param.width;
    }

    updateListener();

    return { element: elem, listener: updateListener };
  },
  disabled: function (btn, disabled) {
    if (btn) {
      console.log("disabledButton");
      if (disabled) {
        btn.classList.add("disabled");
      } else {
        btn.classList.remove("disabled");
      }
      btn.setAttribute("data-disabled", disabled);
    }
  },
  isDisabled: function (btn) {
    if (btn.getAttribute("data-disabled") === "true") {
      return true;
    } else {
      return false;
    }
  },
  onCooldown: function (btn, cd) {},
};
