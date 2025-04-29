const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."] as const;
const operations = ["plus", "minus", "times", "dividedBy"] as const;
const signs = ["negative"] as const;
const controls = ["allClear", "clearEntry", "equals"] as const;
const inputs = [...digits, ...operations, ...signs] as const;

type Digit = (typeof digits)[number];
type Digits = string & { __brand: "Digits" };
type Operation = (typeof operations)[number];
type Sign = (typeof signs)[number];
type Control = (typeof controls)[number];

type Input = (typeof inputs)[number];
type Output = Input[];

type OperationLiteral = "+" | "-" | "×" | "÷";
const operationLiteralMap: Record<Operation, OperationLiteral> = Object.freeze({
  plus: "+",
  minus: "-",
  times: "×",
  dividedBy: "÷",
});

type SignLiteral = "-";
const signLiteralMap: Record<Sign, SignLiteral> = Object.freeze({
  negative: "-",
});

type OperationFunction = (x: number, y: number) => number;
const operationFunctionMap: Record<Operation, OperationFunction> = Object.freeze({
  plus: (x: number, y: number) => x + y,
  minus: (x: number, y: number) => x - y,
  times: (x: number, y: number) => x * y,
  dividedBy: (x: number, y: number) => x / y,
});

export function controlOutput(control: Control, output: Output): Output {
  switch (control) {
    case "allClear":
      return [];
    case "clearEntry":
      return output.slice(0, -1);
    case "equals":
      return []; // Todo

    default:
      throw Error(`Invalid control or output: ${control}, ${output}`);
  }
}

export function stringifyOutput(output: Output): string {
  const outputStrings: string[] = [];

  for (const character of output) {
    const characterString: string = stringifyCharacter(character);
    outputStrings.push(characterString);
  }

  return outputStrings.join("");
}

export function stringifyCharacter(character: Input): string {
  if (isDigit(character)) return character;
  if (isOperation(character)) return operationLiteralMap[character];
  if (isSign(character)) return signLiteralMap[character];

  throw Error(`Invalid character: ${character}`);
}

export function validateInput(input: Input, output: Output): boolean {
  if (isOperation(input)) return validateOperationInput(input, output);
  if (isDigit(input)) return validateDigitInput(input, output);

  throw Error(`Invalid input and output: ${input}, ${output}`);
}

function validateDigitInput(digit: Digit, output: Output): boolean {
  if (isDecimal(digit)) return validateDecimalInput(digit, output);
  return true;
}

function validateOperationInput(operation: Operation, output: Output): boolean {
  const lastCharacter: Input = getLastCharacter(output);

  if (isDecimal(lastCharacter)) return false;
  if (isSign(lastCharacter)) return false;

  if (output.length === 0 && operation !== "minus") return false;
  if (isOperation(lastCharacter) && operation !== "minus") return false;
  if (lastCharacter === "minus" && operation === "minus") return false;

  if (output.length === 0 && operation === "minus") return true;
  if (isOperation(lastCharacter) && operation === "minus") return true;
  if (isDigit(lastCharacter)) return true;

  throw Error(`Invalid operation and last character: ${operation}, ${lastCharacter}`);
}

function validateDecimalInput(decimal: ".", output: Output): boolean {
  if (output.length < 1) return false;

  const lastTerm: Output = getLastTerm(output);
  for (const character of lastTerm) {
    if (character === decimal) return false;
  }

  const lastCharacter: Input = getLastCharacter(output);
  if (!lastCharacter) return false;
  if (isOperation(lastCharacter)) return false;
  if (isSign(lastCharacter)) return false;

  if (isDigit(lastCharacter)) return true;
  throw Error(`Invalid last character: ${lastCharacter}`);
}

export function getLastTerm(output: Output): Output {
  const lastOperationIndex: number = output.findLastIndex((character: Input) => {
    return isOperation(character);
  });

  if (lastOperationIndex === -1) return output;
  return output.slice(lastOperationIndex + 1);
}

export function getLastCharacter(output: Output): Input {
  return output.slice(-1)[0];
}

function isDigit(input: Input): input is Digit {
  return digits.includes(input as Digit);
}

function isDecimal(input: Input): input is "." {
  return input === ".";
}

function isOperation(input: Input): input is Operation {
  return operations.includes(input as Operation);
}

function isSign(input: Input): input is Sign {
  return signs.includes(input as Sign);
}
