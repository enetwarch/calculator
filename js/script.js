window.addEventListener("load", addInputListeners);

const eventConfig = {
    "enterInput": [
        ["1", [["click", "one"], ["keyup", "Numpad1"], ["keyup", "Digit1"]]],
        ["2", [["click", "two"], ["keyup", "Numpad2"], ["keyup", "Digit2"]]],
        ["3", [["click", "three"], ["keyup", "Numpad3"], ["keyup", "Digit3"]]],
        ["4", [["click", "four"], ["keyup", "Numpad4"], ["keyup", "Digit4"]]],
        ["5", [["click", "five"], ["keyup", "Numpad5"], ["keyup", "Digit5"]]],
        ["6", [["click", "six"], ["keyup", "Numpad6"], ["keyup", "Digit6"]]],
        ["7", [["click", "seven"], ["keyup", "Numpad7"], ["keyup", "Digit7"]]],
        ["8", [["click", "eight"], ["keyup", "Numpad8"], ["keyup", "Digit8"]]],
        ["9", [["click", "nine"], ["keyup", "Numpad9"], ["keyup", "Digit9"]]],
        ["0", [["click", "zero"], ["keyup", "Numpad0"], ["keyup", "Digit0"]]],
        [".", [["click", "decimal"], ["keyup", "NumpadDecimal"], ["keyup", "Period"]]],
        ["+", [["click", "add"], ["keyup", "NumpadAdd"]]],
        ["-", [["click", "subtract"], ["keyup", "NumpadSubtract"]]],
        ["×", [["click", "multiply"], ["keyup", "NumpadMultiply"]]],
        ["÷", [["click", "divide"], ["keyup", "NumpadDivide"]]]
    ],
    "displayOutput": [["click", "equals"], ["keyup", "Equal"], ["keyup", "NumpadEnter"]],
    "clearEntry": [["click", "clearEntry"], ["keyup", "Backspace"]],
    "allClear": [["click", "allClear"], ["keyup", "Delete"]]
}

function addInputListeners() {
    addEnterInputListeners();
    addListener(eventConfig.displayOutput, displayOutput);
    addListener(eventConfig.clearEntry, clearEntry);
    addListener(eventConfig.allClear, allClear);
}

function addEnterInputListeners() {
    const enterInputConfig = eventConfig.enterInput;
    enterInputConfig.forEach(config => {
        const input = config[0];
        const listeners = config[1];
        addListener(listeners, () => enterInput(input));
    });
}

function addListener(listeners, func) {
    for (const listener of listeners) {
        const eventType = listener[0];
        if (eventType === "click") {
            const id = listener[1];
            const element = document.getElementById(id);
            element.addEventListener(eventType, func);
        }
        if (eventType === "keyup") {
            const eventCode = listener[1];
            window.addEventListener(eventType, (event) => {
                if (event.code === eventCode) func();
            });
        }
    }
}

const output = document.getElementById("output");

function enterInput(input) {
    output.innerText += input;
}

function displayOutput() {
    console.log("Display output is under development");
}

function clearEntry() {
    if (output.length !== 0) {
        const text = output.innerText;
        output.innerText = text.substring(0, text.length - 1);
    }
}

function allClear() {
    output.innerText = "";
}