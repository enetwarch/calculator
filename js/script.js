window.addEventListener("load", addListeners);

function addListeners() {
    const listenerConfig = [
        [() => enterInput("1"), [["click", "one"], ["keyup", "Numpad1"], ["keyup", "Digit1"]]],
        [() => enterInput("2"), [["click", "two"], ["keyup", "Numpad2"], ["keyup", "Digit2"]]],
        [() => enterInput("3"), [["click", "three"], ["keyup", "Numpad3"], ["keyup", "Digit3"]]],
        [() => enterInput("4"), [["click", "four"], ["keyup", "Numpad4"], ["keyup", "Digit4"]]],
        [() => enterInput("5"), [["click", "five"], ["keyup", "Numpad5"], ["keyup", "Digit5"]]],
        [() => enterInput("6"), [["click", "six"], ["keyup", "Numpad6"], ["keyup", "Digit6"]]],
        [() => enterInput("7"), [["click", "seven"], ["keyup", "Numpad7"], ["keyup", "Digit7"]]],
        [() => enterInput("8"), [["click", "eight"], ["keyup", "Numpad8"], ["keyup", "Digit8"]]],
        [() => enterInput("9"), [["click", "nine"], ["keyup", "Numpad9"], ["keyup", "Digit9"]]],
        [() => enterInput("0"), [["click", "zero"], ["keyup", "Numpad0"], ["keyup", "Digit0"]]],
        [() => enterInput("."), [["click", "decimal"], ["keyup", "NumpadDecimal"], ["keyup", "Period"]]],
        [() => enterInput("+"), [["click", "add"], ["keyup", "NumpadAdd"]]],
        [() => enterInput("-"), [["click", "subtract"], ["keyup", "NumpadSubtract"]]],
        [() => enterInput("×"), [["click", "multiply"], ["keyup", "NumpadMultiply"]]],
        [() => enterInput("÷"), [["click", "divide"], ["keyup", "NumpadDivide"]]],
        [() => displayOutput(), [["click", "equals"], ["keyup", "Equal"], ["keyup", "NumpadEnter"]]],
        [() => clearEntry(), [["click", "clearEntry"], ["keyup", "Backspace"]]],
        [() => allClear(), [["click", "allClear"], ["keyup", "Delete"]]]
    ];
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