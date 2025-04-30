const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."] as const;
type Digit = (typeof digits)[number];

const signs = ["negative"] as const;
type Sign = (typeof signs)[number];

const operations = ["plus", "minus", "times", "dividedBy"] as const;
type Operation = (typeof operations)[number];

const controls = ["allClear", "clearEntry", "equals"] as const;
type Control = (typeof controls)[number];

type Input = Digit | Operation | Sign;
type Value = Input | "Infinity" | "Error";
type Output = Value[];

const signLiterals = ["-"] as const;
type SignLiteral = (typeof signLiterals)[number];
const signLiteralMap: Record<Sign, SignLiteral> = Object.freeze({
  negative: "-",
});

const operationLiterals = ["+", "-", "×", "÷"] as const;
type OperationLiteral = (typeof operationLiterals)[number];
const operationLiteralMap: Record<Operation, OperationLiteral> = Object.freeze({
  plus: "+",
  minus: "-",
  times: "×",
  dividedBy: "÷",
});

type OperationFunction = (x: number, y: number) => number;
const operationFunctionMap: Record<Operation, OperationFunction> = Object.freeze({
  plus: (x: number, y: number) => x + y,
  minus: (x: number, y: number) => x - y,
  times: (x: number, y: number) => x * y,
  dividedBy: (x: number, y: number) => x / y,
});

export function controlOutput(control: Control, output: Output): Output {
  if (control === "allClear") return [];
  if (control === "clearEntry") return output.slice(0, -1);
  if (control === "equals") return [];

  throw Error(`Invalid control or output: ${control}, ${output}`);
}

export function stringifyOutput(output: Output): string {
  return output.map((value) => stringifyValue(value)).join("");
}

export function stringifyValue(value: Value): string {
  if (isDigit(value)) return value;
  if (isOperation(value)) return operationLiteralMap[value];
  if (isSign(value)) return signLiteralMap[value];

  throw Error(`Invalid value: ${value}`);
}

export function validateInput(input: Input, output: Output): boolean {
  if (isOperation(input)) return validateOperationInput(input, output);
  if (isDigit(input)) return validateDigitInput(input, output);

  throw Error(`Invalid input and output: ${input}, ${output}`);
}

function validateDigitInput(digit: Digit, output: Output): boolean {
  if (isDecimal(digit)) return validateDecimalInput(digit, output);
  if (isDigit(digit)) return true;

  throw Error(`Invalid digit and output: ${digit}, ${output}`);
}

function validateOperationInput(operation: Operation, output: Output): boolean {
  const lastValue: Value = getLastValue(output);

  if (isDecimal(lastValue)) return false;
  if (isSign(lastValue)) return false;

  if (output.length === 0 && operation !== "minus") return false;
  if (isOperation(lastValue) && operation !== "minus") return false;
  if (lastValue === "minus" && operation === "minus") return false;

  if (output.length === 0 && operation === "minus") return true;
  if (isOperation(lastValue) && operation === "minus") return true;
  if (isDigit(lastValue)) return true;

  throw Error(`Invalid operation and last value: ${operation}, ${lastValue}`);
}

function validateDecimalInput(decimal: ".", output: Output): boolean {
  if (output.length < 1) return false;

  const lastTerm: Output = getLastTerm(output);
  for (const value of lastTerm) {
    if (value === decimal) return false;
  }

  const lastValue: Value = getLastValue(output);
  if (!lastValue) return false;
  if (isOperation(lastValue)) return false;
  if (isSign(lastValue)) return false;

  if (isDigit(lastValue)) return true;
  throw Error(`Invalid last value: ${lastValue}`);
}

export function getLastTerm(output: Output): Output {
  const lastOperationIndex: number = output.findLastIndex((value) => {
    return isOperation(value);
  });

  if (lastOperationIndex === -1) return output;
  return output.slice(lastOperationIndex + 1);
}

export function getLastValue(output: Output): Value {
  return output.slice(-1)[0];
}

function isDigit(value: string): value is Digit {
  return digits.includes(value as Digit);
}

function isDecimal(value: string): value is "." {
  return value === ".";
}

function isSign(value: string): value is Sign {
  return signs.includes(value as Sign);
}

function isOperation(value: string): value is Operation {
  return operations.includes(value as Operation);
}
