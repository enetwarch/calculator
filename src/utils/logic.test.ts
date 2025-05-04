import {
  type Output,
  type ParsedOutput,
  calculateOperation,
  controlOutput,
  getLastTerm,
  getLastValue,
  getOperationEndingIndex,
  getOperationStartingIndex,
  insertInput,
  parseOutput,
  parseTerm,
  roundTerm,
  stringifyOutput,
  stringifyValue,
  updateCalculator,
  validateInput,
} from "@/utils/logic";

describe(updateCalculator.name, () => {
  it("should throw an error if parsed and stringified are not equal", () => {
    const output: Output = { parsed: ["6", "9"], stringified: "420" };
    expect(() => updateCalculator(".", output)).toThrow();
  });

  describe("digit", () => {
    it("should correctly insert a digit unconditionally", () => {
      const output: Output = { parsed: ["6", "9", ".", "4", "2"], stringified: "69.42" };
      const result: Output = updateCalculator("0", output);

      expect(result.parsed).toEqual(["6", "9", ".", "4", "2", "0"]);
      expect(result.stringified).toBe("69.420");
    });

    it("should insert a decimal when valid", () => {
      const output: Output = { parsed: ["6", "9"], stringified: "69" };
      const result: Output = updateCalculator(".", output);

      expect(result.parsed).toEqual(["6", "9", "."]);
      expect(result.stringified).toBe("69.");
    });

    it("should not insert a decimal when invalid", () => {
      const output: Output = { parsed: ["6", "9", ".", "4", "2"], stringified: "69.42" };
      const result: Output = updateCalculator(".", output);

      expect(result.parsed).toEqual(["6", "9", ".", "4", "2"]);
      expect(result.stringified).toBe("69.42");
    });
  });

  describe("operation", () => {
    it("should correctly insert a plus operation", () => {
      const output: Output = { parsed: ["1", "2", "3"], stringified: "123" };
      const result: Output = updateCalculator("plus", output);

      expect(result.parsed).toEqual(["1", "2", "3", "plus"]);
      expect(result.stringified).toBe("123+");
    });

    it("should correctly insert a minus operation", () => {
      const output: Output = { parsed: ["5", "7", "1"], stringified: "571" };
      const result: Output = updateCalculator("minus", output);

      expect(result.parsed).toEqual(["5", "7", "1", "minus"]);
      expect(result.stringified).toBe("571-");
    });

    it("should correctly insert a times operation", () => {
      const output: Output = { parsed: ["8", "2", "7"], stringified: "827" };
      const result: Output = updateCalculator("times", output);

      expect(result.parsed).toEqual(["8", "2", "7", "times"]);
      expect(result.stringified).toBe("827×");
    });

    it("should correctly insert a dividedBy operation", () => {
      const output: Output = { parsed: ["9", "1", "3"], stringified: "913" };
      const result: Output = updateCalculator("dividedBy", output);

      expect(result.parsed).toEqual(["9", "1", "3", "dividedBy"]);
      expect(result.stringified).toBe("913÷");
    });

    it("should correctly insert a negative sign", () => {
      const output: Output = { parsed: ["2", "4", "5", "plus"], stringified: "245+" };
      const result: Output = updateCalculator("minus", output);

      expect(result.parsed).toEqual(["2", "4", "5", "plus", "negative"]);
      expect(result.stringified).toBe("245+-");
    });

    it("should not insert an operation if it is invalid", () => {
      const output: Output = { parsed: ["3", "2", "1", "plus"], stringified: "321+" };
      const result: Output = updateCalculator("plus", output);

      expect(result.parsed).toEqual(["3", "2", "1", "plus"]);
      expect(result.stringified).toBe("321+");
    });
  });

  describe("control", () => {
    it("should correctly perform all clear which clears the entire output", () => {
      const output: Output = { parsed: ["1", "2", "3"], stringified: "123" };
      const result: Output = updateCalculator("allClear", output);

      expect(result.parsed).toEqual([]);
      expect(result.stringified).toBe("");
    });

    it("should correctly perform clear entry which clears the last character of the output", () => {
      const output: Output = { parsed: ["1", "2", "3"], stringified: "123" };
      const result: Output = updateCalculator("clearEntry", output);

      expect(result.parsed).toEqual(["1", "2"]);
      expect(result.stringified).toBe("12");
    });

    it("should correctly calculate the output with the equals control", () => {
      const output: Output = {
        parsed: ["1", "2", "3", "plus", "4", "minus", "2", "dividedBy", "7", "times", "8"],
        stringified: "123+4-2÷7×8",
      };

      const result: Output = updateCalculator("equals", output);
      expect(result.parsed).toEqual(["1", "2", "4", ".", "7", "1"]);
      expect(result.stringified).toBe("124.71");
    });

    it("should return the same output if there are no operations with the equals control", () => {
      const output: Output = { parsed: ["1", "2", "3"], stringified: "123" };
      const result: Output = updateCalculator("equals", output);

      expect(result.parsed).toEqual(["1", "2", "3"]);
      expect(result.stringified).toBe("123");
    });

    it("should do a clear all on the output if there is an Infinity value before processing the action", () => {
      const output: Output = { parsed: ["negative", "Infinity"], stringified: "-Infinity" };
      const result: Output = updateCalculator("1", output);

      expect(result.parsed).toEqual(["1"]);
      expect(result.stringified).toBe("1");
    });

    it("should do a clear all on the output if there is an Error value before processing the action", () => {
      const output: Output = { parsed: ["Error", "4", "0", "4"], stringified: "Error404" };
      const result: Output = updateCalculator("minus", output);

      expect(result.parsed).toEqual(["negative"]);
      expect(result.stringified).toBe("-");
    });

    it("should perform a clear entry first if the last value is an operation before doing equals control", () => {
      const output: Output = { parsed: ["1", "plus", "1", "times"], stringified: "1+1×" };
      const result: Output = updateCalculator("equals", output);

      expect(result.parsed).toEqual(["2"]);
      expect(result.stringified).toBe("2");
    });

    it("should perform a clear entry first if the last value is a sign before doing equals control", () => {
      const output: Output = { parsed: ["1", "plus", "1", "dividedBy", "negative"], stringified: "1+1÷-" };
      const result: Output = updateCalculator("equals", output);

      expect(result.parsed).toEqual(["2"]);
      expect(result.stringified).toBe("2");
    });

    it("should disregard the decimal point if it is the last value in an equals control", () => {
      const output: Output = { parsed: ["1", "plus", "1", "."], stringified: "1+1." };
      const result: Output = updateCalculator("equals", output);

      expect(result.parsed).toEqual(["2"]);
      expect(result.stringified).toBe("2");
    });
  });
});

describe(getLastValue.name, () => {
  it("should return undefined if the output is empty", () => {
    expect(getLastValue([])).toBe(undefined);
  });

  it("should return the last element in the output array", () => {
    expect(getLastValue(["2", "0"])).toBe("0");
    expect(getLastValue(["3", "2", "1"])).toBe("1");
    expect(getLastValue(["1", "."])).toBe(".");
  });

  it("should return an expression if that is the last element in the array", () => {
    expect(getLastValue(["negative"])).toBe("negative");
    expect(getLastValue(["1", "times"])).toBe("times");
  });

  it("should return any value type as long as it is the last element", () => {
    expect(getLastValue(["negative", "Infinity"])).toBe("Infinity");
    expect(getLastValue(["1", "Error"])).toBe("Error");
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

describe(getOperationStartingIndex.name, () => {
  it("should get the first inclusive index of the left hand term based on the operation index", () => {
    expect(getOperationStartingIndex(3, ["1", "plus", "2", "times", "3"])).toBe(2);
  });
});

describe(getOperationEndingIndex.name, () => {
  it("should get the last exclusive index of the right hand term based on the operation index", () => {
    expect(getOperationEndingIndex(3, ["1", "plus", "2", "times", "3"])).toBe(5);
  });
});

describe(validateInput.name, () => {
  describe("digit", () => {
    describe("decimal", () => {
      it("should return false if the first input is a decimal", () => {
        expect(validateInput(".", [])).toBe(false);
      });

      it("should return false if the last character is an operation", () => {
        expect(validateInput(".", ["1", "plus"])).toBe(false);
        expect(validateInput(".", ["1", "2", "3", "dividedBy"])).toBe(false);
      });

      it("should return false if the last character of the output is a sign", () => {
        expect(validateInput(".", ["negative"])).toBe(false);
        expect(validateInput(".", ["1", "plus", "negative"])).toBe(false);
      });

      it("should return false if the last character of the output is already a decimal", () => {
        expect(validateInput(".", ["1", "."])).toBe(false);
        expect(validateInput(".", ["0", "1", "plus", "9", "."])).toBe(false);
      });

      it("should return false if there is already a decimal point in the last term of the output", () => {
        expect(validateInput(".", ["1", "2", ".", "3"])).toBe(false);
        expect(validateInput(".", ["1", "plus", "3", "1", ".", "5"])).toBe(false);
      });

      it("should return true if the last character of the output is a digit and there are no decimals in the current term yet", () => {
        expect(validateInput(".", ["6", "9"])).toBe(true);
        expect(validateInput(".", ["1", "plus", "2"])).toBe(true);
      });
    });

    it("should return true if the input is a number no matter the condition", () => {
      expect(validateInput("2", [])).toBe(true);
      expect(validateInput("7", ["negative"])).toBe(true);
      expect(validateInput("9", ["0", ".", "2", "plus"])).toBe(true);
    });
  });

  describe("operation", () => {
    it("should return false if the last character is a decimal", () => {
      expect(validateInput("plus", ["1", "."])).toBe(false);
      expect(validateInput("times", ["6", "9", "."])).toBe(false);
    });

    it("should return false if the last character is a sign", () => {
      expect(validateInput("minus", ["negative"])).toBe(false);
    });

    it("should return false if the last character is already an operation and the input is not a minus", () => {
      expect(validateInput("plus", ["1", "plus"])).toBe(false);
      expect(validateInput("dividedBy", ["negative", "1", "minus"])).toBe(false);
    });

    it("should return false if the input is a minus and the last character is already a minus", () => {
      expect(validateInput("minus", ["1", "minus"])).toBe(false);
    });

    it("should return false if the output is empty and the operation is not minus", () => {
      expect(validateInput("plus", [])).toBe(false);
      expect(validateInput("times", [])).toBe(false);
      expect(validateInput("dividedBy", [])).toBe(false);
    });

    it("should return true if the input is a minus and the last character is another operation", () => {
      expect(validateInput("minus", ["1", "plus"])).toBe(true);
      expect(validateInput("minus", ["3", "2", "1", "dividedBy"])).toBe(true);
    });

    it("should return true if the input is a minus and the output is empty", () => {
      expect(validateInput("minus", [])).toBe(true);
    });

    it("should return true if the last character is a digit", () => {
      expect(validateInput("plus", ["1"])).toBe(true);
      expect(validateInput("minus", ["1", "9"])).toBe(true);
    });
  });
});

describe(insertInput.name, () => {
  it("should return the same output if the input is not valid", () => {
    expect(insertInput("plus", ["negative", "1", "plus"])).toEqual(["negative", "1", "plus"]);
  });

  it("should correctly insert digits", () => {
    expect(insertInput("3", ["1", "2"])).toEqual(["1", "2", "3"]);
    expect(insertInput("0", ["6", "9", ".", "4", "2"])).toEqual(["6", "9", ".", "4", "2", "0"]);
  });

  it("should not insert decimals if it is the first character of the term", () => {
    expect(insertInput(".", [])).toEqual([]);
    expect(insertInput(".", ["1", "plus"])).toEqual(["1", "plus"]);
  });

  it("should only insert decimals if the current term doesn't have one", () => {
    expect(insertInput(".", ["1"])).toEqual(["1", "."]);
    expect(insertInput(".", ["1", ".", "3"])).toEqual(["1", ".", "3"]);
    expect(insertInput(".", ["1", "plus", "0", ".", "2"])).toEqual(["1", "plus", "0", ".", "2"]);
  });

  it("should return negative if the output is empty", () => {
    expect(insertInput("minus", [])).toEqual(["negative"]);
  });

  it("should insert negative to the output if it is pointed towards the number", () => {
    expect(insertInput("minus", ["1", "plus"])).toEqual(["1", "plus", "negative"]);
  });

  it("should not insert operations if there is last character is already an operation", () => {
    expect(insertInput("plus", ["1", "plus"])).toEqual(["1", "plus"]);
  });

  it("should skip validation if the third argument is passed as true", () => {
    expect(insertInput("plus", ["1", "plus"], true)).toEqual(["1", "plus", "plus"]);
    expect(insertInput("plus", ["1", "plus"])).toEqual(["1", "plus"]);
  });
});

describe(stringifyValue.name, () => {
  it(`should correctly stringify "negative" to "-"`, () => {
    expect(stringifyValue("negative")).toBe("-");
  });

  it(`should correctly stringify "plus" to "+"`, () => {
    expect(stringifyValue("plus")).toBe("+");
  });

  it(`should correctly stringify "minus" to "-"`, () => {
    expect(stringifyValue("minus")).toBe("-");
  });

  it(`should correctly stringify "times" to "×"`, () => {
    expect(stringifyValue("times")).toBe("×");
  });

  it(`should correctly stringify "dividedBy" to "÷"`, () => {
    expect(stringifyValue("dividedBy")).toBe("÷");
  });

  it(`should correctly stringify "Infinity" to "Infinity"`, () => {
    expect(stringifyValue("Infinity")).toBe("Infinity");
  });

  it(`should correctly stringify "Error" to "Error"`, () => {
    expect(stringifyValue("Error")).toBe("Error");
  });
});

describe(stringifyOutput.name, () => {
  it("should stringify an empty output to an empty string", () => {
    expect(stringifyOutput([])).toBe("");
  });

  it("should correctly stringify signs", () => {
    expect(stringifyOutput(["negative"])).toBe("-");
    expect(stringifyOutput(["negative", "1", "0"])).toBe("-10");
  });

  it("should correctly stringify operations", () => {
    expect(stringifyOutput(["1", "plus", "1"])).toBe("1+1");
    expect(stringifyOutput(["6", "9", "minus", "4", "2", "0"])).toBe("69-420");
    expect(stringifyOutput(["1", "times", "2", "7"])).toBe("1×27");
    expect(stringifyOutput(["1", "2", "dividedBy", "2", "4"])).toBe("12÷24");
  });

  it("should correctly stringify numbers", () => {
    expect(stringifyOutput(["6", "9", "4", "2", "0"])).toBe("69420");
    expect(stringifyOutput(["0"])).toBe("0");
  });

  it("should correctly stringify numbers with decimals", () => {
    expect(stringifyOutput(["6", "9", ".", "4", "2", "0"])).toBe("69.420");
    expect(stringifyOutput(["0", ".", "1"])).toBe("0.1");
  });

  it("should correctly stringify Infinity", () => {
    expect(stringifyOutput(["negative", "Infinity", "plus", "6", "9"])).toBe("-Infinity+69");
  });

  it("should correctly stringify Error", () => {
    expect(stringifyOutput(["Error", "dividedBy", "0"])).toBe("Error÷0");
  });
});

describe(parseOutput.name, () => {
  it("should parse an empty string to an empty array", () => {
    expect(parseOutput("")).toEqual([]);
  });

  it("should correctly parse signs", () => {
    expect(parseOutput("-")).toEqual(["negative"]);
    expect(parseOutput("-10")).toEqual(["negative", "1", "0"]);
  });

  it("should correctly parse operations", () => {
    expect(parseOutput("1+1")).toEqual(["1", "plus", "1"]);
    expect(parseOutput("69-420")).toEqual(["6", "9", "minus", "4", "2", "0"]);
    expect(parseOutput("1×27")).toEqual(["1", "times", "2", "7"]);
    expect(parseOutput("12÷24")).toEqual(["1", "2", "dividedBy", "2", "4"]);
  });

  it("should correctly distinguish signs from operations", () => {
    expect(parseOutput("-1+-1")).toEqual(["negative", "1", "plus", "negative", "1"]);
    expect(parseOutput("-1-1")).toEqual(["negative", "1", "minus", "1"]);
  });

  it("should correctly parse numbers", () => {
    expect(parseOutput("69420")).toEqual(["6", "9", "4", "2", "0"]);
    expect(parseOutput("0")).toEqual(["0"]);
  });

  it("should correctly parse numbers with decimals", () => {
    expect(parseOutput("69.420")).toEqual(["6", "9", ".", "4", "2", "0"]);
    expect(parseOutput("0.1")).toEqual(["0", ".", "1"]);
  });

  it("should throw an error if there are duplicate signs", () => {
    expect(() => parseOutput("--1")).toThrow();
    expect(() => parseOutput("-1--1")).toThrow();
  });

  it("should throw an error if there is an unrecognized character", () => {
    expect(() => parseOutput("yes")).toThrow();
    expect(() => parseOutput("69plus420")).toThrow();
  });

  it("should correctly parse Infinity", () => {
    expect(parseOutput("Infinity")).toEqual(["Infinity"]);
  });

  it("should correctly parse -Infinity", () => {
    expect(parseOutput("-Infinity")).toEqual(["negative", "Infinity"]);
  });

  it("should correctly parse Error", () => {
    expect(parseOutput("Error")).toEqual(["Error"]);
  });

  it("should correctly parse a combination of Infinity and Error", () => {
    expect(parseOutput("ErrorInfinity")).toEqual(["Error", "Infinity"]);
  });

  it("should correctly parse a combination of numbers and Infinity", () => {
    expect(parseOutput("69420-Infinity")).toEqual(["6", "9", "4", "2", "0", "minus", "Infinity"]);
  });

  it("should correctly parse a combination of numbers and Error", () => {
    expect(parseOutput("69420+Error")).toEqual(["6", "9", "4", "2", "0", "plus", "Error"]);
  });
});

describe(parseTerm.name, () => {
  it("should automatically parse the entire output if no start and end arguments are given", () => {
    expect(parseTerm(["1", "2", "3"])).toBe(123);
    expect(parseTerm(["6", "9", ".", "4", "2", "0"])).toBe(69.42);
  });

  it("should parse from start to the last element of the array if no end argument is given", () => {
    expect(parseTerm(["1", "2", "3"], 1)).toBe(23);
    expect(parseTerm(["6", "9", ".", "4", "2", "0"], 3)).toBe(420);
  });

  it("should parse from start to the last element of the array if the end argument is undefined", () => {
    expect(parseTerm(["1", "2", "3"], 1, undefined)).toBe(23);
    expect(parseTerm(["6", "9", ".", "4", "2", "0"], 3, undefined)).toBe(420);
  });

  it("should parse the specified start and end indexes of both arguments are given", () => {
    expect(parseTerm(["1", "2", "3"], 1, 2)).toBe(2);
    expect(parseTerm(["6", "9", ".", "4", "2", "0"], 1, 5)).toBe(9.42);
  });

  it("should throw an error if the given output is an empty array", () => {
    expect(() => parseTerm([])).toThrow();
  });

  it("should throw an error if the parsed term is NaN", () => {
    expect(() => parseTerm(["plus"])).toThrow();
    expect(() => parseTerm(["negative", "2", "plus", "3"])).toThrow();
  });

  it("should parse infinity values", () => {
    expect(parseTerm(["Infinity"])).toBe(Number.POSITIVE_INFINITY);
    expect(parseTerm(["negative", "Infinity"])).toBe(Number.NEGATIVE_INFINITY);
  });
});

describe(roundTerm.name, () => {
  it("should not throw if the output has a sign type", () => {
    expect(() => roundTerm(["negative", "3"])).not.toThrow();
  });

  it("should throw an error if the output has a non-digit or non-sign type", () => {
    expect(() => roundTerm(["6", "plus"])).toThrow();
    expect(() => roundTerm(["4", "2", "0", "dividedBy"])).toThrow();
  });

  it("should return the same digits if there are no decimals", () => {
    expect(roundTerm(["6", "9"])).toBe(69);
    expect(roundTerm(["4", "2", "0"])).toBe(420);
  });

  it("should return 2 decimal places at most if applicable", () => {
    expect(roundTerm(["negative", "4", "2", ".", "0", "6", "9"])).toBe(-42.07);
  });

  it("can return more decimal places based on the optional second argument", () => {
    expect(roundTerm(["negative", "4", "2", ".", "0", "6", "9"], 1)).toBe(-42.1);
    expect(roundTerm(["negative", "4", "2", ".", "0", "6", "9"], 3)).toBe(-42.069);
  });
});

describe(calculateOperation.name, () => {
  it("should reduce the operation based on the operation index given", () => {
    expect(calculateOperation(["1", "plus", "6", "dividedBy", "3"], 3)).toEqual(["1", "plus", "2"]);
  });

  it("should return Error when there is at least one error value in the output", () => {
    expect(calculateOperation(["Error", "1", "2", "plus", "3", "4"], 3)).toEqual(["Error"]);
  });
});

describe(controlOutput.name, () => {
  describe("allClear", () => {
    it("should return an empty array", () => {
      expect(controlOutput("allClear", ["1", "2", "3"])).toEqual([]);
      expect(controlOutput("allClear", ["6", "times", "9"])).toEqual([]);
    });
  });

  describe("clearEntry", () => {
    it("should return an output without the previous last character", () => {
      expect(controlOutput("clearEntry", ["1", "2", "3"])).toEqual(["1", "2"]);
      expect(controlOutput("clearEntry", ["6", "times", "9"])).toEqual(["6", "times"]);
    });

    it("should be able to clear an Infinity value", () => {
      expect(controlOutput("clearEntry", ["negative", "Infinity"])).toEqual(["negative"]);
      expect(controlOutput("clearEntry", ["2", "7", "dividedBy", "Infinity"])).toEqual(["2", "7", "dividedBy"]);
    });

    it("should be able to clear an Error value", () => {
      expect(controlOutput("clearEntry", ["1", "plus", "Error"])).toEqual(["1", "plus"]);
    });
  });

  describe("equals", () => {
    it("should return the same output if there are no operations", () => {
      expect(controlOutput("equals", ["1"])).toEqual(["1"]);
      expect(controlOutput("equals", ["negative", "6", "9"])).toEqual(["negative", "6", "9"]);
    });

    it(`should return a sum if there is a "plus" operator`, () => {
      expect(controlOutput("equals", ["1", "plus", "1"])).toEqual(["2"]);
      expect(controlOutput("equals", ["negative", "2", "0", "plus", "6", "9"])).toEqual(["4", "9"]);
    });

    it(`should return a difference if there is a "minus" operator`, () => {
      expect(controlOutput("equals", ["1", "0", "minus", "1"])).toEqual(["9"]);
      expect(controlOutput("equals", ["negative", "3", "0", "minus", "6"])).toEqual(["negative", "3", "6"]);
    });

    it(`should return a product if there is a "times" operator`, () => {
      expect(controlOutput("equals", ["6", "times", "6"])).toEqual(["3", "6"]);
      expect(controlOutput("equals", ["negative", "1", "0", "times", "9"])).toEqual(["negative", "9", "0"]);
    });

    it(`should return a quotient if there is a "dividedBy" operator`, () => {
      expect(controlOutput("equals", ["2", "0", "dividedBy", "1", "0"])).toEqual(["2"]);
      expect(controlOutput("equals", ["5", "0", "dividedBy", "8"])).toEqual(["6", ".", "2", "5"]);
    });

    it(`should correctly return 2 decimal places at most if there are remainders using the "dividedBy" operator`, () => {
      expect(controlOutput("equals", ["4", "2", "0", "dividedBy", "6", "9"])).toEqual(["6", ".", "0", "9"]);
    });

    it(`should return Error if 0 "dividedBy" 0`, () => {
      expect(controlOutput("equals", ["0", "dividedBy", "0"])).toEqual(["Error"]);
    });

    it(`should return negative Infinity if a negative number is "dividedBy" zero`, () => {
      expect(controlOutput("equals", ["negative", "1", "dividedBy", "0"])).toEqual(["negative", "Infinity"]);
      expect(controlOutput("equals", ["negative", "9", "9", "dividedBy", "0"])).toEqual(["negative", "Infinity"]);
    });

    it(`should return Infinity if a number is "dividedBy" zero`, () => {
      expect(controlOutput("equals", ["1", "dividedBy", "0"])).toEqual(["Infinity"]);
      expect(controlOutput("equals", ["9", "9", "dividedBy", "0"])).toEqual(["Infinity"]);
    });

    it("should work on multiple plus and minus operations", () => {
      expect(controlOutput("equals", ["2", "0", "plus", "6", "minus", "7", "1"])).toEqual(["negative", "4", "5"]);
    });

    it("should work on multiple times and dividedBy operrations", () => {
      expect(controlOutput("equals", ["4", "times", "3", "dividedBy", "9"])).toEqual(["1", ".", "3", "3"]);
    });

    describe("precedence", () => {
      it("should correctly evaluate multiplication before addition", () => {
        const output: ParsedOutput = ["2", "plus", "3", "times", "4"];
        expect(controlOutput("equals", output)).toEqual(["1", "4"]);
      });

      it("should correctly evaluate multiplication before subtraction", () => {
        const output: ParsedOutput = ["6", "2", "minus", "3", "times", "4"];
        expect(controlOutput("equals", output)).toEqual(["5", "0"]);
      });

      it("should correctly evaluate division before addition", () => {
        const output: ParsedOutput = ["8", "plus", "6", "dividedBy", "2"];
        expect(controlOutput("equals", output)).toEqual(["1", "1"]);
      });

      it("should correctly evaluate division before subtraction", () => {
        const output: ParsedOutput = ["8", "minus", "6", "dividedBy", "2"];
        expect(controlOutput("equals", output)).toEqual(["5"]);
      });

      it("should be able to return a negative result when required", () => {
        const output: ParsedOutput = ["2", "minus", "5", "times", "2"];
        expect(controlOutput("equals", output)).toEqual(["negative", "8"]);
      });

      it("should be able to return a float result when required", () => {
        const output: ParsedOutput = ["5", "dividedBy", "2"];
        expect(controlOutput("equals", output)).toEqual(["2", ".", "5"]);
      });

      it("should correctly compute multiple operations with precedence", () => {
        const output: ParsedOutput = ["6", "plus", "3", "times", "2", "minus", "4"];
        expect(controlOutput("equals", output)).toEqual(["8"]);
      });

      it("should correctly evaluate all combinations of arithmetic expressions", () => {
        const output: ParsedOutput = ["4", "times", "3", "plus", "7", "dividedBy", "2", "minus", "8"];
        expect(controlOutput("equals", output)).toEqual(["7", ".", "5"]);
      });
    });
  });
});
