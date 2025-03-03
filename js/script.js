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

const outputElement = document.getElementById("output");
const operators = ["+", "-", "×", "÷"];
const operations = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "×": (x, y) => x * y,
    "÷": (x, y) => x / y
};

let operator;
let x;
let y;

function enterNumberInput(input) {
    const recentEntry = outputElement.innerText;
    const recentEntryChar = recentEntry.charAt(recentEntry.length - 1);
    const updatedEntry = recentEntry + input;
    if (input === ".") {
        if (recentEntryChar === input) return;
        const recentEntryIsEmpty = recentEntryChar === "";
        const recentEntryIsOperator = operators.includes(recentEntryChar);
        if (recentEntryIsEmpty || recentEntryIsOperator) return;
    }
    if (operator === undefined) {
        x = updatedEntry;
    } else {
        const variables = updatedEntry.split(operator);
        const lastVariable = variables[variables.length - 1];
        y = lastVariable;
    }
    outputElement.innerText = updatedEntry;
}

function enterOperationInput(input) {
    const recentEntry = outputElement.innerText;
    const recentEntryChar = recentEntry.charAt(recentEntry.length - 1);
    if (input === recentEntryChar) return;
    const recentEntryIsEmpty = recentEntryChar === "";
    const recentEntryIsOperator = operators.includes(recentEntryChar);
    if (input === "-") {
        if (recentEntryIsEmpty || recentEntryIsOperator) {
            outputElement.innerText += input;
            return;
        }
    }
    if (recentEntryIsEmpty) return;
    if (recentEntryIsOperator) return;
    displayOutput();
    operator = input;
    outputElement.innerText += input;
}

function displayOutput() {
    if (operator !== undefined) {
        x = parseFloat(x);
        y = parseFloat(y);
        const operation = operations[operator];
        const result = `${operation(x, y)}`;
        x = result;
        y = operator = undefined;
        outputElement.innerText = result;
    }
}

function clearEntry() {
    const recentEntry = outputElement.innerText;
    if (recentEntry.length !== 0) {
        const recentEntryIndex = recentEntry.length - 1;
        const updatedOutput = recentEntry.substring(0, recentEntryIndex);
        if (operator === undefined) {
            x = updatedOutput;
        } else if (operator !== undefined) {
            const variables = recentEntry.split(operator);
            const lastVariable = variables[variables.length - 1];
            y = lastVariable;
        } else {
            operator = undefined;
        }
        outputElement.innerText = updatedOutput;
    }
}

function allClear() {
    x = y = operator = undefined;
    outputElement.innerText = "";
}