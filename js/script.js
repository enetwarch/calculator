window.addEventListener("load", addListeners);

const listenerConfig = [
    [() => enterNumber("1"), [["click", "one"], ["keyup", "Numpad1"], ["keyup", "Digit1"]]],
    [() => enterNumber("2"), [["click", "two"], ["keyup", "Numpad2"], ["keyup", "Digit2"]]],
    [() => enterNumber("3"), [["click", "three"], ["keyup", "Numpad3"], ["keyup", "Digit3"]]],
    [() => enterNumber("4"), [["click", "four"], ["keyup", "Numpad4"], ["keyup", "Digit4"]]],
    [() => enterNumber("5"), [["click", "five"], ["keyup", "Numpad5"], ["keyup", "Digit5"]]],
    [() => enterNumber("6"), [["click", "six"], ["keyup", "Numpad6"], ["keyup", "Digit6"]]],
    [() => enterNumber("7"), [["click", "seven"], ["keyup", "Numpad7"], ["keyup", "Digit7"]]],
    [() => enterNumber("8"), [["click", "eight"], ["keyup", "Numpad8"], ["keyup", "Digit8"]]],
    [() => enterNumber("9"), [["click", "nine"], ["keyup", "Numpad9"], ["keyup", "Digit9"]]],
    [() => enterNumber("0"), [["click", "zero"], ["keyup", "Numpad0"], ["keyup", "Digit0"]]],
    [() => enterNumber("."), [["click", "decimal"], ["keyup", "NumpadDecimal"], ["keyup", "Period"]]],
    [() => enterOperation("+"), [["click", "add"], ["keyup", "NumpadAdd"]]],
    [() => enterOperation("-"), [["click", "subtract"], ["keyup", "NumpadSubtract"]]],
    [() => enterOperation("×"), [["click", "multiply"], ["keyup", "NumpadMultiply"]]],
    [() => enterOperation("÷"), [["click", "divide"], ["keyup", "NumpadDivide"]]],
    [() => displayOutput(), [["click", "equals"], ["keyup", "Equal"], ["keyup", "NumpadEnter"]]],
    [() => clearEntry(), [["click", "clearEntry"], ["keyup", "Backspace"]]],
    [() => allClear(), [["click", "allClear"], ["keyup", "Delete"]]]
];

function addListeners() {
    listenerConfig.forEach(config => {
        const func = config[0];
        const listeners = config[1];
        listeners.forEach(listener => {
            addListener(listener, func);
        });
    });
}

function addListener(listener, func) {
    const eventType = listener[0];
    if (eventType === "click") {
        const id = listener[1];
        const element = document.getElementById(id);
        element.addEventListener(eventType, func);
    } else if (eventType === "keyup") {
        const eventCode = listener[1];
        window.addEventListener(eventType, event => {
            if (event.code === eventCode) func();
        });
    }    
}

const outputElement = document.getElementById("output");
const operators = ["+", "-", "×", "÷"];
const operations = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "×": (x, y) => x * y,
    "÷": (x, y) => x / y
};

const infinity = /^-?I/i;
let x, operator, y = undefined;

function enterNumber(input) {
    if (infinity.test(outputElement.innerText)) allClear();

    const recentEntry = outputElement.innerText;
    const recentEntryIndex = recentEntry.length - 1
    const recentEntryChar = recentEntry.charAt(recentEntryIndex);
    const updatedEntry = recentEntry + input;

    if (input === ".") {
        if (recentEntryChar === input) return;

        const recentEntryIsEmpty = recentEntryChar === "";
        const recentEntryIsOperator = operators.includes(recentEntryChar);

        if (recentEntryIsEmpty || recentEntryIsOperator) return;
        if (!operator && x.includes(input)) return;
        if (operator && y.includes(input)) return;
    }

    if (!operator) {
        x = updatedEntry;
    } else {
        const variables = updatedEntry.split(operator);
        const lastVariable = variables[variables.length - 1];

        y = lastVariable;
    }

    outputElement.innerText = updatedEntry;
}

function enterOperation(input) {
    if (infinity.test(outputElement.innerText)) allClear();

    const recentEntry = outputElement.innerText;
    const recentEntryIndex = recentEntry.length - 1;
    const recentEntryChar = recentEntry.charAt(recentEntryIndex);

    if (input === recentEntryChar) return;
    if (recentEntryChar === ".") clearEntry();

    const recentEntryIsEmpty = recentEntryChar === "";
    const recentEntryIsOperator = operators.includes(recentEntryChar);

    if (input === "-") {
        if (recentEntryIsEmpty || recentEntryIsOperator) {
            outputElement.innerText += input;
            return;
        }
    }

    if (recentEntryIsEmpty || recentEntryIsOperator) return;
    displayOutput();
    if (infinity.test(outputElement.innerText)) return;

    operator = input;
    outputElement.innerText += input;
}

function displayOutput() {
    if (!y || !operator) return;

    x = parseFloat(x);
    y = parseFloat(y);

    const operation = operations[operator];
    const result = operation(x, y);

    let formattedResult;
    if (result.toString() === result.toFixed()) {
        formattedResult = result.toFixed();
    } else if (result.toString() === result.toFixed(1)) {
        formattedResult = result.toFixed(1);
    } else {
        formattedResult = result.toFixed(2);
    }

    if (infinity.test(formattedResult)) {
        x = undefined;
    } else {
        x = formattedResult;
    }

    y = operator = undefined;
    outputElement.innerText = formattedResult;
}

function clearEntry() {
    const recentEntry = outputElement.innerText;
    if (recentEntry.length === 0) return;

    const recentEntryIndex = recentEntry.length - 1;
    const recentEntryChar = recentEntry.charAt(recentEntryIndex);
    const updatedOutput = recentEntry.substring(0, recentEntryIndex);

    if (recentEntryChar === operator) {
        operator = undefined;
    } else if (!operator) {
        x = updatedOutput;
        if (x === "") x = undefined;
    } else if (operator) {
        const variables = recentEntry.split(operator);
        const lastVariable = variables[variables.length - 1];
        
        y = lastVariable;
        if (y === "") y = undefined;
    } else {
        return;
    }

    outputElement.innerText = updatedOutput;
}

function allClear() {
    x = y = operator = undefined;
    outputElement.innerText = "";
}