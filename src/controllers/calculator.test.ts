// @vitest-environment happy-dom

import { getElementById, getKeyboardEventListener, getMouseEventListener } from "@/controllers/calculator";

describe(getElementById.name, () => {
  it("should throw an error for ids with non-existing elements", () => {
    expect(() => getElementById("sample")).toThrow();
    expect(() => getElementById("anothersample")).toThrow();
  });

  it("should return an HTMLElement when the element with the id exists", () => {
    const element = document.createElement("div");
    element.id = "sample";
    document.body.appendChild(element);

    expect(() => getElementById("sample")).not.toThrow();
    expect(getElementById("sample")).toBeInstanceOf(HTMLElement);
  });
});

describe(getMouseEventListener.name, () => {
  it("should only trigger the given callback when the event target is the given element", () => {
    const mockCallback: () => void = vi.fn();
    const child: HTMLButtonElement = document.createElement("button");
    const parent: HTMLDivElement = document.createElement("div");

    const listener: EventListener = getMouseEventListener(child, mockCallback);
    parent.addEventListener("click", listener);

    const clickParent: MouseEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(clickParent, "target", { value: parent });
    parent.dispatchEvent(clickParent);
    expect(mockCallback).not.toHaveBeenCalled();

    const clickChild: MouseEvent = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(clickChild, "target", { value: child });
    parent.dispatchEvent(clickChild);
    expect(mockCallback).toHaveBeenCalled();
  });
});

describe(getKeyboardEventListener.name, () => {
  it("should only trigger the given callback if any of the given event keys are pressed", () => {
    const mockCallback: () => void = vi.fn();
    const keys: KeyboardEvent["key"][] = ["1", "2", "3"];

    const listener: EventListener = getKeyboardEventListener(keys, mockCallback);
    document.addEventListener("keyup", listener);

    const wrongKeyEvent: KeyboardEvent = new KeyboardEvent("keyup", { key: "0" });
    document.dispatchEvent(wrongKeyEvent);
    expect(mockCallback).not.toHaveBeenCalled();

    for (const key of keys) {
      const correctKeyEvent: KeyboardEvent = new KeyboardEvent("keyup", { key: key });
      document.dispatchEvent(correctKeyEvent);
      expect(mockCallback).toHaveBeenCalled();
    }
  });
});
