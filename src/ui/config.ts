import type { CalculatorButtonConfig } from "@/ui/calculator";

export const buttonConfigList: CalculatorButtonConfig[] = [
  {
    elementId: "zero",
    calculatorAction: "0",
    eventTypes: ["click", "keydown"],
    eventKeys: ["0"],
  },
  {
    elementId: "one",
    calculatorAction: "1",
    eventTypes: ["click", "keydown"],
    eventKeys: ["1"],
  },
  {
    elementId: "two",
    calculatorAction: "2",
    eventTypes: ["click", "keydown"],
    eventKeys: ["2"],
  },
  {
    elementId: "three",
    calculatorAction: "3",
    eventTypes: ["click", "keydown"],
    eventKeys: ["3"],
  },
  {
    elementId: "four",
    calculatorAction: "4",
    eventTypes: ["click", "keydown"],
    eventKeys: ["4"],
  },
  {
    elementId: "five",
    calculatorAction: "5",
    eventTypes: ["click", "keydown"],
    eventKeys: ["5"],
  },
  {
    elementId: "six",
    calculatorAction: "6",
    eventTypes: ["click", "keydown"],
    eventKeys: ["6"],
  },
  {
    elementId: "seven",
    calculatorAction: "7",
    eventTypes: ["click", "keydown"],
    eventKeys: ["7"],
  },
  {
    elementId: "eight",
    calculatorAction: "8",
    eventTypes: ["click", "keydown"],
    eventKeys: ["8"],
  },
  {
    elementId: "nine",
    calculatorAction: "9",
    eventTypes: ["click", "keydown"],
    eventKeys: ["9"],
  },
  {
    elementId: "decimal",
    calculatorAction: ".",
    eventTypes: ["click", "keydown"],
    eventKeys: ["."],
  },
  {
    elementId: "add",
    calculatorAction: "plus",
    eventTypes: ["click", "keydown"],
    eventKeys: ["+"],
  },
  {
    elementId: "subtract",
    calculatorAction: "minus",
    eventTypes: ["click", "keydown"],
    eventKeys: ["-"],
  },
  {
    elementId: "multiply",
    calculatorAction: "times",
    eventTypes: ["click", "keydown"],
    eventKeys: ["*"],
  },
  {
    elementId: "divide",
    calculatorAction: "dividedBy",
    eventTypes: ["click", "keydown"],
    eventKeys: ["/"],
  },
  {
    elementId: "equals",
    calculatorAction: "equals",
    eventTypes: ["click", "keydown"],
    eventKeys: ["=", "Enter"],
  },
  {
    elementId: "clearEntry",
    calculatorAction: "clearEntry",
    eventTypes: ["click", "keydown"],
    eventKeys: ["Backspace"],
  },
  {
    elementId: "allClear",
    calculatorAction: "allClear",
    eventTypes: ["click", "keydown"],
    eventKeys: ["Escape"],
  },
] as const;
