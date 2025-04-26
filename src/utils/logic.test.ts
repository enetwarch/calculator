import {
  type Digit,
  type Input,
  type Operation,
  type Sign,
  controlOutput,
  digits,
  getLastCharacter,
  getLastTerm,
  inputs,
  isDigit,
  isOperation,
  isSign,
  operations,
  signs,
  stringifyOutput,
  validateDecimalInput,
  validateOperationInput,
} from "@/utils/logic";

type testIsTypeFnArgs<Parent, Child extends Parent> = {
  isChildTypeFn: (arg: Parent) => arg is Child;
  childTypeName: string;
  parentTypeName: string;
  childTypes: readonly Child[];
  parentTypes: readonly Parent[];
};

function testIsTypeFn<Parent, Child extends Parent>(args: testIsTypeFnArgs<Parent, Child>): void {
  const { isChildTypeFn, childTypeName, parentTypeName, childTypes, parentTypes } = args;

  describe(isChildTypeFn.name, () => {
    it(`should return true for all <${childTypeName}> types`, () => {
      for (const type of childTypes) {
        expect(isChildTypeFn(type)).toBe(true);
      }
    });

    it(`should return false for every other sibling types from <${parentTypeName}> parent type`, () => {
      const siblingTypes = parentTypes.filter((type: Parent) => {
        return !isChildTypeFn(type);
      });

      for (const type of siblingTypes) {
        expect(isChildTypeFn(type)).toBe(false);
      }
    });
  });
}

testIsTypeFn<Input, Digit>({
  isChildTypeFn: isDigit,
  childTypeName: "Digit",
  parentTypeName: "Input",
  childTypes: digits,
  parentTypes: inputs,
});

testIsTypeFn<Input, Operation>({
  isChildTypeFn: isOperation,
  childTypeName: "Operation",
  parentTypeName: "Input",
  childTypes: operations,
  parentTypes: inputs,
});

testIsTypeFn<Input, Sign>({
  isChildTypeFn: isSign,
  childTypeName: "Sign",
  parentTypeName: "Input",
  childTypes: signs,
  parentTypes: inputs,
});

describe(getLastCharacter.name, () => {
  it("should return undefined if the output is empty", () => {
    expect(getLastCharacter([])).toBe(undefined);
  });

  it("should return the last element in the output array", () => {
    expect(getLastCharacter(["2", "0"])).toBe("0");
    expect(getLastCharacter(["3", "2", "1"])).toBe("1");
  });

  it("should return an expression if that is the last element in the array", () => {
    expect(getLastCharacter(["negative"])).toBe("negative");
    expect(getLastCharacter(["1", "times"])).toBe("times");
  });
});

describe(getLastTerm.name, () => {
  it("should return the same output back if there are no operations", () => {
    expect(getLastTerm(["negative"])).toEqual(["negative"]);
    expect(getLastTerm(["1", "2", ".", "3"])).toEqual(["1", "2", ".", "3"]);
  });

  it("should return the last term if there is an operation", () => {
    expect(getLastTerm(["4", "7", "plus", "negative", "2"])).toEqual(["negative", "2"]);
    expect(getLastTerm(["1", "plus", "negative"])).toEqual(["negative"]);
  });

  it("should return an empty array if the output is empty", () => {
    expect(getLastTerm([])).toEqual([]);
  });

  it("should return an empty array if the last term is empty", () => {
    expect(getLastTerm(["1", "plus"])).toEqual([]);
    expect(getLastTerm(["6", "9", "4", "2", "0", "dividedBy"])).toEqual([]);
  });
});

describe(validateDecimalInput.name, () => {
  it("should return false if the first input is a decimal", () => {
    expect(validateDecimalInput(".", [])).toBe(false);
  });

  it("should return false if the last character is an operation", () => {
    expect(validateDecimalInput(".", ["1", "plus"])).toBe(false);
    expect(validateDecimalInput(".", ["1", "2", "3", "dividedBy"])).toBe(false);
  });

  it("should return false if the last character of the output is a sign", () => {
    expect(validateDecimalInput(".", ["negative"])).toBe(false);
    expect(validateDecimalInput(".", ["1", "plus", "negative"])).toBe(false);
  });

  it("should return false if the last character of the output is already a decimal", () => {
    expect(validateDecimalInput(".", ["1", "."])).toBe(false);
    expect(validateDecimalInput(".", ["0", "1", "plus", "9", "."])).toBe(false);
  });

  it("should return false if there is already a decimal point in the last term of the output", () => {
    expect(validateDecimalInput(".", ["1", "2", ".", "3"])).toBe(false);
    expect(validateDecimalInput(".", ["1", "plus", "3", "1", ".", "5"])).toBe(false);
  });

  it("should return true if the last character of the output is a digit and it passes every false", () => {
    expect(validateDecimalInput(".", ["6", "9"])).toBe(true);
    expect(validateDecimalInput(".", ["1", "plus", "2"])).toBe(true);
  });
});

describe(validateOperationInput.name, () => {
  it("should return false if the last character is a decimal", () => {
    expect(validateOperationInput("plus", ["1", "."])).toBe(false);
    expect(validateOperationInput("times", ["6", "9", "."])).toBe(false);
  });

  it("should return false if the last character is a sign", () => {
    expect(validateOperationInput("minus", ["negative"])).toBe(false);
  });

  it("should return false if the last character is already an operation and the input is not a minus", () => {
    expect(validateOperationInput("plus", ["1", "plus"])).toBe(false);
    expect(validateOperationInput("dividedBy", ["negative", "1", "minus"])).toBe(false);
  });

  it("should return false if the input is a minus and the last character is already a minus", () => {
    expect(validateOperationInput("minus", ["1", "minus"])).toBe(false);
  });

  it("should return false if the output is empty and the operation is not minus", () => {
    const nonMinusOperations: Operation[] = ["plus", "times", "dividedBy"];
    for (const operation of nonMinusOperations) {
      expect(validateOperationInput(operation, [])).toBe(false);
    }
  });

  it("should return true if the input is a minus and the last character is another operation", () => {
    expect(validateOperationInput("minus", ["1", "plus"])).toBe(true);
    expect(validateOperationInput("minus", ["3", "2", "1", "dividedBy"])).toBe(true);
  });

  it("should return true if the input is a minus and the output is empty", () => {
    expect(validateOperationInput("minus", [])).toBe(true);
  });

  it("should return true if the last character is a digit", () => {
    expect(validateOperationInput("plus", ["1"])).toBe(true);
    expect(validateOperationInput("minus", ["1", "9"])).toBe(true);
  });
});

describe(stringifyOutput.name, () => {
  it("should convert an empty output to an empty string", () => {
    expect(stringifyOutput([])).toBe("");
  });

  it(`should correctly convert "negative" to "-"`, () => {
    expect(stringifyOutput(["negative"])).toBe("-");
    expect(stringifyOutput(["negative", "1", "0"])).toBe("-10");
  });

  it(`should correctly convert "plus" to "+"`, () => {
    expect(stringifyOutput(["1", "plus", "1"])).toBe("1+1");
    expect(stringifyOutput(["2", "plus"])).toBe("2+");
  });

  it(`should correctly convert "minus" to "-"`, () => {
    expect(stringifyOutput(["1", "minus", "1"])).toBe("1-1");
    expect(stringifyOutput(["6", "9", "minus", "4", "2", "0"])).toBe("69-420");
  });

  it(`should correctly convert "times" to "×"`, () => {
    expect(stringifyOutput(["6", "times", "9"])).toBe("6×9");
    expect(stringifyOutput(["1", "times", "2", "7"])).toBe("1×27");
  });

  it(`should correctly convert "dividedBy" to "÷"`, () => {
    expect(stringifyOutput(["6", "dividedBy", "9"])).toBe("6÷9");
    expect(stringifyOutput(["1", "2", "dividedBy", "2", "4"])).toBe("12÷24");
  });

  it("should correctly display numbers", () => {
    expect(stringifyOutput(["6", "9", "4", "2", "0"])).toBe("69420");
    expect(stringifyOutput(["0"])).toBe("0");
  });

  it("should correctly display numbers with decimals", () => {
    expect(stringifyOutput(["6", "9", ".", "4", "2", "0"])).toBe("69.420");
    expect(stringifyOutput(["0", ".", "1"])).toBe("0.1");
  });
});

describe(controlOutput.name, () => {
  it(`should return an empty array with the "allClear" control`, () => {
    expect(controlOutput("allClear", ["1", "2", "3"])).toEqual([]);
    expect(controlOutput("allClear", ["6", "times", "9"])).toEqual([]);
  });

  it(`should return an output without the previous last character with the "clearEntry" control`, () => {
    expect(controlOutput("clearEntry", ["1", "2", "3"])).toEqual(["1", "2"]);
    expect(controlOutput("clearEntry", ["6", "times", "9"])).toEqual(["6", "times"]);
  });
});
