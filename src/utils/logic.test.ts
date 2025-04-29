import {
  controlOutput,
  getLastCharacter,
  getLastTerm,
  stringifyCharacter,
  stringifyOutput,
  validateInput,
} from "@/utils/logic";

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

describe(validateInput.name, () => {
  describe("digit input", () => {
    describe("decimal input", () => {
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

  describe("operation input", () => {
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

describe(stringifyCharacter.name, () => {
  it(`should correctly convert "negative" to "-"`, () => {
    expect(stringifyCharacter("negative")).toBe("-");
  });

  it(`should correctly convert "plus" to "+"`, () => {
    expect(stringifyCharacter("plus")).toBe("+");
  });

  it(`should correctly convert "minus" to "-"`, () => {
    expect(stringifyCharacter("minus")).toBe("-");
  });

  it(`should correctly convert "times" to "×"`, () => {
    expect(stringifyCharacter("times")).toBe("×");
  });

  it(`should correctly convert "dividedBy" to "÷"`, () => {
    expect(stringifyCharacter("dividedBy")).toBe("÷");
  });
});

describe(stringifyOutput.name, () => {
  it("should convert an empty output to an empty string", () => {
    expect(stringifyOutput([])).toBe("");
  });

  it("should correctly convert signs", () => {
    expect(stringifyOutput(["negative"])).toBe("-");
    expect(stringifyOutput(["negative", "1", "0"])).toBe("-10");
  });

  it("should correctly convert operations", () => {
    expect(stringifyOutput(["1", "plus", "1"])).toBe("1+1");
    expect(stringifyOutput(["6", "9", "minus", "4", "2", "0"])).toBe("69-420");
    expect(stringifyOutput(["1", "times", "2", "7"])).toBe("1×27");
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
  describe(`"allClear" control`, () => {
    it("should return an empty array", () => {
      expect(controlOutput("allClear", ["1", "2", "3"])).toEqual([]);
      expect(controlOutput("allClear", ["6", "times", "9"])).toEqual([]);
    });
  });

  describe(`"clearEntry" control`, () => {
    it("should return an output without the previous last character", () => {
      expect(controlOutput("clearEntry", ["1", "2", "3"])).toEqual(["1", "2"]);
      expect(controlOutput("clearEntry", ["6", "times", "9"])).toEqual(["6", "times"]);
    });
  });
});
