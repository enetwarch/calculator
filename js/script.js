window.addEventListener("load", addListeners);

const listenerConfig = [
    [() => enterNumberInput("1"), [["click", "one"], ["keyup", "Numpad1"], ["keyup", "Digit1"]]],
    [() => enterNumberInput("2"), [["click", "two"], ["keyup", "Numpad2"], ["keyup", "Digit2"]]],
    [() => enterNumberInput("3"), [["click", "three"], ["keyup", "Numpad3"], ["keyup", "Digit3"]]],
    [() => enterNumberInput("4"), [["click", "four"], ["keyup", "Numpad4"], ["keyup", "Digit4"]]],
    [() => enterNumberInput("5"), [["click", "five"], ["keyup", "Numpad5"], ["keyup", "Digit5"]]],
    [() => enterNumberInput("6"), [["click", "six"], ["keyup", "Numpad6"], ["keyup", "Digit6"]]],
    [() => enterNumberInput("7"), [["click", "seven"], ["keyup", "Numpad7"], ["keyup", "Digit7"]]],
    [() => enterNumberInput("8"), [["click", "eight"], ["keyup", "Numpad8"], ["keyup", "Digit8"]]],
    [() => enterNumberInput("9"), [["click", "nine"], ["keyup", "Numpad9"], ["keyup", "Digit9"]]],
    [() => enterNumberInput("0"), [["click", "zero"], ["keyup", "Numpad0"], ["keyup", "Digit0"]]],
    [() => enterNumberInput("."), [["click", "decimal"], ["keyup", "NumpadDecimal"], ["keyup", "Period"]]],
    [() => enterOperationInput("+"), [["click", "add"], ["keyup", "NumpadAdd"]]],
    [() => enterOperationInput("-"), [["click", "subtract"], ["keyup", "NumpadSubtract"]]],
    [() => enterOperationInput("×"), [["click", "multiply"], ["keyup", "NumpadMultiply"]]],
    [() => enterOperationInput("÷"), [["click", "divide"], ["keyup", "NumpadDivide"]]],
    [() => displayOutput(), [["click", "equals"], ["keyup", "Equal"], ["keyup", "NumpadEnter"]]],
    [() => clearEntry(), [["click", "clearEntry"], ["keyup", "Backspace"]]],
    [() => allClear(), [["click", "allClear"], ["keyup", "Delete"]]]
];

function addListeners() {
    listenerConfig.forEach(config => {
        const func = config[0];
        const listeners = config[1];
        listeners.forEach(listener => {
            const eventType = listener[0];
            if (eventType === "click") {
                const id = listener[1];
                const element = document.getElementById(id);
                element.addEventListener(eventType, func);
            }
            if (eventType === "keyup") {
                const eventCode = listener[1];
                window.addEventListener(eventType, event => {
                    if (event.code === eventCode) func();
                });
            }    
        });
    });
}

const output = document.getElementById("output");
const operators = ["+", "-", "×", "÷"];
const operations = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "×": (x, y) => x * y,
    "÷": (x, y) => x / y
};

let x = undefined;
let y = undefined;
let operator = undefined;

function enterNumberInput(input) {
    output.innerText += input;
}

function enterOperationInput(input) {
    const text = output.innerText;
    const recentEntryChar = text.charAt(text.length - 1);
    const recentEntryIsEmpty = recentEntryChar === "";
    if (input === recentEntryChar) return;
    if (input === "-") {
        const forNegativeNumber = operators.includes(recentEntryChar);
        if (recentEntryIsEmpty || forNegativeNumber) {
            output.innerText += input;
            return;
        }
    }
    if (recentEntryIsEmpty) return;
    if (operators.includes(recentEntryChar)) return;
    if (x === undefined) {
        x = parseInt(text);
    } else {
        displayOutput();
    }
    operator = input;
    output.innerText += input;
}

function displayOutput() {
    if (operator !== undefined) {
        if (y === undefined) {
            const text = output.innerText;
            const variables = text.split(operator);
            const lastVariable = variables[variables.length - 1];
            y = parseInt(lastVariable);
        }
        const operation = operations[operator];
        const result = operation(x, y);
        x = result;
        y = operator = undefined;
        output.innerText = `${result}`;
    }
}

function clearEntry() {
    if (output.length !== 0) {
        const text = output.innerText;
        const recentEntryIndex = text.length -1;
        const recentEntryChar = text.charAt(recentEntryIndex);
        if (recentEntryChar === operator) {
            operator = undefined;
        }
        output.innerText = text.substring(0, recentEntryIndex);
    }
}

function allClear() {
    x = y = operator = undefined;
    output.innerText = "";
}