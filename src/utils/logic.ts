export const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."] as const;
export const operations = ["plus", "minus", "times", "dividedBy"] as const;
export const signs = ["negative"] as const;
export const inputs = [...digits, ...operations, ...signs, undefined] as const;
export const controls = ["allClear", "clearEntry", "equals"] as const;

export type Digit = (typeof digits)[number];
export type Operation = (typeof operations)[number];
export type Sign = (typeof signs)[number];
export type Control = (typeof controls)[number];
export type Input = (typeof inputs)[number];

export const infinity = [["Infinity"], ["-Infinity"]] as const;
export type Infinity = (typeof infinity)[number];
export type Output = Input[];

type OperationLiteral = "+" | "-" | "×" | "÷";
type SignLiteral = "-";

const operationMap: Record<Operation, OperationLiteral> = Object.freeze({
  plus: "+",
  minus: "-",
  times: "×",
  dividedBy: "÷",
});

const signMap: Record<Sign, SignLiteral> = Object.freeze({
  negative: "-",
});

export function controlOutput(control: Control, output: Output): Output {
  if (control === "allClear") return [];
  if (control === "clearEntry") return output.slice(0, -1);

  throw Error(`Invalid control and output: ${control}, ${output}`);
}

export function stringifyOutput(output: Output): string {
  const outputStrings: string[] = [];

  for (const character of output) {
    const characterString: string = ((): string => {
      if (isOperation(character)) return operationMap[character];
      if (isSign(character)) return signMap[character];
      if (isDigit(character)) return character;

      throw Error(`Invalid character: ${character}`);
    })();

    outputStrings.push(characterString);
  }

  return outputStrings.join("");
}

export function validateInput(input: Input, output: Output): boolean {
  if (isOperation(input)) return validateOperationInput(input, output);
  if (isDigit(input)) return validateDigitInput(input, output);

  throw Error(`Invalid input and output: ${input}, ${output}`);
}

export function validateDigitInput(digit: Digit, output: Output): boolean {
  if (digit === ".") return validateDecimalInput(digit, output);
  return true;
}

export function validateOperationInput(operation: Operation, output: Output): boolean {
  const lastCharacter: Input = getLastCharacter(output);

  if (lastCharacter === ".") return false;
  if (isSign(lastCharacter)) return false;

  if (output.length === 0 && operation !== "minus") return false;
  if (isOperation(lastCharacter) && operation !== "minus") return false;
  if (lastCharacter === "minus" && operation === "minus") return false;

  if (output.length === 0 && operation === "minus") return true;
  if (isOperation(lastCharacter) && operation === "minus") return true;
  if (isDigit(lastCharacter)) return true;

  throw Error(`Invalid operation and last character: ${operation}, ${lastCharacter}`);
}

export function validateDecimalInput(decimal: ".", output: Output): boolean {
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

export function isDigit(input: Input): input is Digit {
  return digits.includes(input as Digit);
}

export function isOperation(input: Input): input is Operation {
  return operations.includes(input as Operation);
}

export function isSign(input: Input): input is Sign {
  return signs.includes(input as Sign);
}
