// @vitest-environment happy-dom

import { type ListenerConfig, getElementById, getListenerConfig, processListenerConfig } from "@/utils/dom";

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

describe(`${getListenerConfig.name} and ${processListenerConfig.name}`, () => {
  let element: HTMLElement;
  let eventType: keyof HTMLElementEventMap;
  let callback: () => void;
  let eventKeys: KeyboardEvent["key"][];
  let parentElement: HTMLDivElement;
  let listenerConfig: ListenerConfig;

  describe("mouse events", () => {
    beforeEach(() => {
      element = document.createElement("button");
      eventType = "click";
      callback = vi.fn();
      parentElement = document.createElement("div");
      listenerConfig = getListenerConfig({ element, eventType, callback, parentElement });
    });

    it("should create a listener config with the parent element as the node", () => {
      expect(listenerConfig.node).toEqual(parentElement);
    });

    it("should correctly delegate event listeners from parent to element based on the config", () => {
      processListenerConfig({ listenerConfig, eventAction: "add" });

      const clickParentElement: MouseEvent = new MouseEvent("click", { bubbles: true });
      Object.defineProperty(clickParentElement, "target", { value: parentElement });
      parent.dispatchEvent(clickParentElement);
      expect(callback).not.toHaveBeenCalled();

      const clickElement: MouseEvent = new MouseEvent("click", { bubbles: true });
      Object.defineProperty(clickElement, "target", { value: element });
      parent.dispatchEvent(clickElement);
      expect(callback).toHaveBeenCalled();
    });

    it("should be able to remove the event listeners", () => {
      processListenerConfig({ listenerConfig, eventAction: "add" });
      processListenerConfig({ listenerConfig, eventAction: "remove" });

      const clickElement: MouseEvent = new MouseEvent("click", { bubbles: true });
      Object.defineProperty(clickElement, "target", { value: element });
      parent.dispatchEvent(clickElement);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("keyboard events", () => {
    beforeEach(() => {
      element = document.createElement("div");
      eventType = "keydown";
      callback = vi.fn();
      eventKeys = ["1", "2", "3"];
      listenerConfig = getListenerConfig({ element, eventType, callback, eventKeys });
    });

    it("should create a listener config with window as the node", () => {
      expect(listenerConfig.node).toEqual(window);
    });

    it("should correctly attach event listeners to the window based on the config", () => {
      processListenerConfig({ listenerConfig, eventAction: "add" });

      const wrongKeyEvent: KeyboardEvent = new KeyboardEvent("keydown", { key: "0" });
      window.dispatchEvent(wrongKeyEvent);
      expect(callback).not.toHaveBeenCalled();

      for (const key of eventKeys) {
        const correctKeyEvent: KeyboardEvent = new KeyboardEvent("keydown", { key: key });
        window.dispatchEvent(correctKeyEvent);
        expect(callback).toHaveBeenCalled();
      }
    });

    it("should be able to remove the event listeners", () => {
      processListenerConfig({ listenerConfig, eventAction: "add" });
      processListenerConfig({ listenerConfig, eventAction: "remove" });

      for (const key of eventKeys) {
        const correctKeyEvent: KeyboardEvent = new KeyboardEvent("keydown", { key: key });
        window.dispatchEvent(correctKeyEvent);
        expect(callback).not.toHaveBeenCalled();
      }
    });
  });
});
