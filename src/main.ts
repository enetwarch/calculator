import "@/style.css";

import { Calculator } from "@/ui/calculator";
import { buttonConfigList } from "@/ui/calculator/config";
import type { Output } from "@/utils/logic";

window.addEventListener("load", () => {
  const storageKey: string = "output";
  const output: Output = Calculator.loadOutput(storageKey);

  const calculator: Calculator = new Calculator(output, "output", storageKey);
  calculator.initialize(buttonConfigList);

  window.addEventListener("beforeunload", () => {
    calculator.destroy();
  });
});
