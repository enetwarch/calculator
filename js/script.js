window.addEventListener("load", () => {
    addInputListeners();
});

function addInputListeners() {
    const inputs = [
        [1, "one", "Numpad1", "Digit1"],
        [2, "two", "Numpad2", "Digit2"],
        [3, "three", "Numpad3", "Digit3"],
        [4, "four", "Numpad4", "Digit4"],
        [5, "five", "Numpad5", "Digit5"],
        [6, "six", "Numpad6", "Digit6"],
        [7, "seven", "Numpad7", "Digit7"],
        [8, "eight", "Numpad8", "Digit8"],
        [9, "nine", "Numpad9", "Digit9"],
        [0, "zero", "Numpad0", "Digit0"],
        [".", "decimal", "NumpadDecimal", "Period"],
        ["+", "add", "NumpadAdd"],
        ["-", "subtract", "NumpadSubtract"],
        ["×", "multiply", "NumpadMultiply"],
        ["÷", "divide", "NumpadDivide"],
        ["%", "modulo", "NumLock"]
    ];
    inputs.forEach(element => {
        const input = element[0];
        const elementId = element[1];
        const numpadKey = element[2];
        const digitKey = element[3];
        addClickInputListener(elementId, input);
        addKeyInputListener(numpadKey, input);
        if (digitKey !== "undefined") {
            addKeyInputListener(digitKey, input);
        }
    });
}

function addClickInputListener(elementId, input) {
    const element = document.getElementById(elementId);
    element.addEventListener("click", () => {
        inputToCalculator(input);
    });
}

function addKeyInputListener(eventCode, input) {
    window.addEventListener("keyup", event => {
        if (event.code === eventCode) {
            inputToCalculator(input);
        }
    });
}

function inputToCalculator(input) {
    const output = document.getElementById("output");
    output.innerText += input;
}