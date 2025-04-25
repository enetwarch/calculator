import {
  type Digit,
  type Input,
  type Operation,
  type Output,
  type Sign,
  digits,
  getLastTerm,
  inputs,
  isDigit,
  isOperation,
  isSign,
  operations,
  signs,
  validateDecimalInput,
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

describe("getLastTerm", () => {
  it("should return the same output back if there are no operations", () => {
    const outputs: Output[] = [
      ["1", "2", "3", ".", "4", "5", "6"],
      ["negative", "6", "7", "8", "9", "1"],
      ["negative"],
    ];

    for (const output of outputs) {
      expect(getLastTerm(output)).toEqual(output);
    }
  });

  it("should return the last term if there is an operation", () => {
    const inputAndOutput: [Output, Output][] = [
      [["1", "plus", "2"], ["2"]],
      [
        ["negative", "2", "minus", "4", "7"],
        ["4", "7"],
      ],
      [
        ["4", "7", "plus", "negative", "2"],
        ["negative", "2"],
      ],
      [["1", "plus", "negative"], ["negative"]],
    ];

    for (const [input, output] of inputAndOutput) {
      expect(getLastTerm(input)).toEqual(output);
    }
  });

  it("should return an empty array if the output is empty", () => {
    expect(getLastTerm([])).toEqual([]);
  });

  it("should return an empty array if the last term is empty", () => {
    const inputs: Output[] = [
      ["1", "plus"],
      ["6", "9", "4", "2", "0", "dividedBy"],
    ];

    for (const input of inputs) {
      expect(getLastTerm(input)).toEqual([]);
    }
  });
});

describe("validateDecimalInput", () => {
  it("should return false if the first input is a decimal", () => {
    expect(validateDecimalInput([])).toBe(false);
  });

  it("should return false if the last character is an operation", () => {
    expect(validateDecimalInput(["1", "plus"])).toBe(false);
    expect(validateDecimalInput(["1", "2", "3", "dividedBy"])).toBe(false);
  });

  it("should return false if the last character of the output is a sign", () => {
    expect(validateDecimalInput(["negative"])).toBe(false);
    expect(validateDecimalInput(["1", "plus", "negative"])).toBe(false);
  });

  it("should return false if the last character of the output is already a decimal", () => {
    expect(validateDecimalInput(["1", "."])).toBe(false);
    expect(validateDecimalInput(["0", "1", "plus", "9", "."])).toBe(false);
  });

  it("should return false if there is already a decimal point in the last term of the output", () => {
    expect(validateDecimalInput(["1", "2", ".", "3"])).toBe(false);
    expect(validateDecimalInput(["1", "plus", "3", "1", ".", "5"])).toBe(false);
  });

  it("should return true if the last character of the output is a digit", () => {
    expect(validateDecimalInput(["6", "9"])).toBe(true);
    expect(validateDecimalInput(["1", "plus", "2"])).toBe(true);
  });
});
