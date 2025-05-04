import "@/style.css";
import { initializeCalculator } from "@/controllers/calculator";
import type { Output } from "@/utils/logic";

window.addEventListener("load", () => {
  const storageKey: string = "output";

  const output: Output = ((): Output => {
    const storedOutput: string | null = localStorage.getItem(storageKey);
    if (!storedOutput) return { parsed: [], stringified: "" };
    return JSON.parse(storedOutput) as Output;
  })();

  initializeCalculator(output, storageKey);
});
