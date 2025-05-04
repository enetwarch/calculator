import { type Action, type Output, updateCalculator } from "@/utils/logic";

type ListenerConfig = {
  id: string;
  action: Action;
  events: (keyof HTMLElementEventMap)[];
  keys: KeyboardEvent["key"][];
};

const listenerConfig: ListenerConfig[] = [
  { id: "zero", action: "0", events: ["click", "keydown"], keys: ["0"] },
  { id: "one", action: "1", events: ["click", "keydown"], keys: ["1"] },
  { id: "two", action: "2", events: ["click", "keydown"], keys: ["2"] },
  { id: "three", action: "3", events: ["click", "keydown"], keys: ["3"] },
  { id: "four", action: "4", events: ["click", "keydown"], keys: ["4"] },
  { id: "five", action: "5", events: ["click", "keydown"], keys: ["5"] },
  { id: "six", action: "6", events: ["click", "keydown"], keys: ["6"] },
  { id: "seven", action: "7", events: ["click", "keydown"], keys: ["7"] },
  { id: "eight", action: "8", events: ["click", "keydown"], keys: ["8"] },
  { id: "nine", action: "9", events: ["click", "keydown"], keys: ["9"] },
  { id: "decimal", action: ".", events: ["click", "keydown"], keys: ["."] },
  { id: "add", action: "plus", events: ["click", "keydown"], keys: ["+"] },
  { id: "subtract", action: "minus", events: ["click", "keydown"], keys: ["-"] },
  { id: "multiply", action: "times", events: ["click", "keydown"], keys: ["*"] },
  { id: "divide", action: "dividedBy", events: ["click", "keydown"], keys: ["/"] },
  { id: "equals", action: "equals", events: ["click", "keydown"], keys: ["=", "Enter"] },
  { id: "clearEntry", action: "clearEntry", events: ["click", "keydown"], keys: ["Backspace"] },
  { id: "allClear", action: "allClear", events: ["click", "keydown"], keys: ["Escape"] },
] as const;

type MouseEventName = {
  [K in keyof HTMLElementEventMap]: HTMLElementEventMap[K] extends MouseEvent ? K : never;
}[keyof HTMLElementEventMap];

type KeyboardEventName = {
  [K in keyof HTMLElementEventMap]: HTMLElementEventMap[K] extends KeyboardEvent ? K : never;
}[keyof HTMLElementEventMap];

// Add more relevant events in the arrays if they exist in the config
const mouseEvents: MouseEventName[] = ["click"] as const;
const keyboardEvents: KeyboardEventName[] = ["keydown"] as const;

function isMouseEventName(value: keyof HTMLElementEventMap): value is MouseEventName {
  return mouseEvents.includes(value as MouseEventName);
}

function isKeyboardEventName(value: keyof HTMLElementEventMap): value is KeyboardEventName {
  return keyboardEvents.includes(value as KeyboardEventName);
}

/** @public */
export function initializeCalculator(savedOutput: Output, storageKey = "output"): void {
  let output: Output = savedOutput;
  const outputElement: HTMLElement = getElementById("output");

  const setOutput = (newOutput: Output): void => {
    output = newOutput;
    localStorage.setItem(storageKey, JSON.stringify(output));

    outputElement.innerText = output.stringified;
  };

  const handleAction = (action: Action): void => {
    const newOutput: Output = updateCalculator(action, output, true);
    setOutput(newOutput);
  };

  const processListenerConfig = (config: ListenerConfig): void => {
    const { id, action, events, keys }: ListenerConfig = config;
    const element: HTMLElement = getElementById(id);
    const callback = (): void => handleAction(action);

    for (const event of events) {
      const node: Node = ((): Node => {
        if (isMouseEventName(event)) return element;
        if (isKeyboardEventName(event)) return document;

        throw Error(`Unknown event: ${event}`);
      })();

      const eventListener: EventListener = ((): EventListener => {
        if (isMouseEventName(event)) return getMouseEventListener(element, callback);
        if (isKeyboardEventName(event)) return getKeyboardEventListener(keys, callback);

        throw Error(`Unknown event: ${event}`);
      })();

      node.addEventListener(event, eventListener);
    }
  };

  for (const config of listenerConfig) {
    processListenerConfig(config);
  }

  setOutput(output);
}

type Void = () => void;
type Key = KeyboardEvent["key"];

/** @internal */
export function getMouseEventListener(element: HTMLElement, callback: Void): EventListener {
  return (event: Event): void => {
    if (!(event instanceof MouseEvent)) return;
    if (!(event.target instanceof HTMLElement)) return;
    if (event.target !== element) return;

    callback();
  };
}

/** @internal */
export function getKeyboardEventListener(keys: Key[], callback: Void): EventListener {
  return (event: Event): void => {
    if (!(event instanceof KeyboardEvent)) return;
    if (!keys.includes(event.key)) return;

    callback();
  };
}

/** @internal */
export function getElementById(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw Error(`Element with this id does not exist: ${id}`);
  }

  return element;
}
