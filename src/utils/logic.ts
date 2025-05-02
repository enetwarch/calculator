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
export type Output = Value[];

const signLiterals = ["-"] as const;
type SignLiteral = (typeof signLiterals)[number];
const signLiteralMap: Record<Sign, SignLiteral> = Object.freeze({
  negative: "-",
});
const signSemanticMap: Record<SignLiteral, Sign> = Object.freeze({
  "-": "negative",
});

const operationLiterals = ["+", "-", "×", "÷"] as const;
type OperationLiteral = (typeof operationLiterals)[number];
const operationLiteralMap: Record<Operation, OperationLiteral> = Object.freeze({
  plus: "+",
  minus: "-",
  times: "×",
  dividedBy: "÷",
});
const operationSemanticMap: Record<OperationLiteral, Operation> = Object.freeze({
  "+": "plus",
  "-": "minus",
  "×": "times",
  "÷": "dividedBy",
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
  if (control === "equals") return calculateOutput(output);

  throw Error(`Invalid control or output: ${control}, ${output}`);
}

function calculateOutput(output: Output): Output {
  if (output.every((value) => !isOperation(value))) return output;

  const calculated: Output = ((): Output => {
    // PEMDAS Precedence (Parentheses, Exponents, Multiplication, Division, Addition, and Subtraction)
    const MD: Operation[] = ["times", "dividedBy"];
    const AS: Operation[] = ["plus", "minus"];

    const calculator = (precedence: Operation[], output: Output): Output => {
      const operationIndex: number = output.findIndex((value) => {
        if (!isOperation(value)) return false;
        return precedence.includes(value);
      });

      if (operationIndex === -1) return output;

      const calculated: Output = calculateOperation(output, operationIndex);
      return calculator(precedence, calculated);
    };

    const reducedMD: Output = calculator(MD, output);
    const reducedAD: Output = calculator(AS, reducedMD);

    return reducedAD;
  })();

  if (calculated.includes("Infinity") || calculated.includes("Error")) return calculated;

  const roundedCalculated: number = roundTerm(calculated);
  return parseOutput(roundedCalculated.toString());
}

/** @internal */
export function calculateOperation(output: Output, operationIndex: number): Output {
  if (output.includes("Error")) return ["Error"];

  const operationStartingIndex: number =
    ((): number | undefined => {
      for (let i = operationIndex - 1; i > 0; i--) {
        const value: Value = output[i];
        if (isOperation(value)) return i + 1;
      }
    })() || 0;

  const operationEndingIndex: number =
    ((): number | undefined => {
      for (let i = operationIndex + 1; i < output.length; i++) {
        const value: Value = output[i];
        if (isOperation(value)) return i;
      }
    })() || output.length;

  const x: number = ((): number => {
    const start: number = operationStartingIndex;
    const end: number = operationIndex;
    return parseTerm(output, start, end);
  })();

  const y: number = ((): number => {
    const start: number = operationIndex + 1;
    const end: number = operationEndingIndex;
    return parseTerm(output, start, end);
  })();

  const operation: Value = output[operationIndex];
  const operationFunction: OperationFunction = ((): OperationFunction => {
    if (isOperation(operation)) return operationFunctionMap[operation];
    throw Error(`Not an operation: ${operation}`);
  })();

  const calculated: Output = ((): Output => {
    const result: number = operationFunction(x, y);
    if (operation !== "dividedBy" || !Number.isNaN(result)) {
      return parseOutput(result.toString());
    }

    return ["Error"];
  })();

  return output.flatMap((value, index) => {
    if (!(index >= operationStartingIndex && index < operationEndingIndex)) return value;
    if (index !== operationStartingIndex) return [];
    return calculated;
  });
}

/** @internal */
export function roundTerm(output: Output, decimalPlaces = 2): number {
  if (!output.every((value) => isDigit(value) || isSign(value))) {
    throw Error(`Not a term: ${output}`);
  }

  const parsedTerm: number = parseTerm(output);
  return Number.parseFloat(parsedTerm.toFixed(decimalPlaces));
}

/** @internal */
export function parseTerm(output: Output, start = 0, end = output.length): number {
  const stringifiedTerm: string = stringifyOutput(output.slice(start, end));
  const parsedTerm: number = Number.parseFloat(stringifiedTerm);

  if (Number.isNaN(parsedTerm)) {
    throw Error(`Term is parsed into NaN: ${stringifiedTerm}`);
  }

  if (parsedTerm.toString() !== Number(stringifiedTerm).toString()) {
    throw Error(`Parsed and stringified term are not equal: ${parsedTerm}, ${stringifiedTerm}`);
  }

  return parsedTerm;
}

/** @internal */
export function parseOutput(output: string): Output {
  return [...output].flatMap((value, index, array) => {
    if (isDigit(value)) return value;
    if (isSignLiteral(value)) {
      if (index === 0) return signSemanticMap[value];

      const previousValue: string = array[index - 1];
      if (isSignLiteral(previousValue)) throw Error(`Duplicate signs: ${output}`);
      if (isOperationLiteral(previousValue)) return signSemanticMap[value];
    }

    if (isOperationLiteral(value)) return operationSemanticMap[value];
    if ("Infinity".includes(value)) return value === "I" ? "Infinity" : [];
    if ("Error".includes(value)) return value === "E" ? "Error" : [];

    throw Error(`Invalid value: ${value}`);
  });
}

export function stringifyOutput(output: Output): string {
  return output.map((value) => stringifyValue(value)).join("");
}

export function stringifyValue(value: Value): string {
  if (isDigit(value)) return value;
  if (isSign(value)) return signLiteralMap[value];
  if (isOperation(value)) return operationLiteralMap[value];
  if (value === "Infinity" || value === "Error") return value;

  throw Error(`Invalid value: ${value}`);
}

/** @internal */
export function insertInput(input: Input, output: Output, isValid = false): Output {
  if (!isValid && !validateInput(input, output)) return output;

  const insert: Input = ((): Input => {
    if (input !== "minus") return input;

    const lastValue: Value = getLastValue(output);
    if (!lastValue || isOperation(lastValue)) return "negative";
    return "minus";
  })();

  return [...output, insert];
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

/** @internal */
export function getLastTerm(output: Output): Output {
  const lastOperationIndex: number = output.findLastIndex((value) => {
    return isOperation(value);
  });

  if (lastOperationIndex === -1) return output;
  return output.slice(lastOperationIndex + 1);
}

/** @internal */
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

function isSignLiteral(value: string): value is SignLiteral {
  return signLiterals.includes(value as SignLiteral);
}

function isOperationLiteral(value: string): value is OperationLiteral {
  return operationLiterals.includes(value as OperationLiteral);
}
