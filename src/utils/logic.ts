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
export type Output = Input[];

export function validateDecimalInput(output: Output): boolean {
  if (output.length < 1) return false;

  const lastTerm: Output = getLastTerm(output);
  for (const character of lastTerm) {
    if (character === ".") return false;
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
