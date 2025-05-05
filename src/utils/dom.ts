/** @public */
export function getElementById(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) throw Error(`Element with this id does not exist: ${id}`);

  return element;
}

export type ListenerConfig = {
  node: Window | HTMLElement;
  eventType: keyof HTMLElementEventMap;
  eventListener: EventListener;
};

type ProcessListenerConfigArgs = {
  listenerConfig: ListenerConfig;
  eventAction: EventListenerAction;
  options?: boolean | AddEventListenerOptions;
};

/** @public */
export function processListenerConfig(args: ProcessListenerConfigArgs): void {
  const { listenerConfig, eventAction, options } = args;
  const { node, eventType, eventListener } = listenerConfig;

  const processEventListener: EventListenerMethod = eventListenerMethodMap[eventAction].bind(node);
  processEventListener(eventType, eventListener, options);
}

type EventListenerAction = "add" | "remove";
type EventListenerMethod = typeof addEventListener | typeof removeEventListener;
const eventListenerMethodMap: Record<EventListenerAction, EventListenerMethod> = Object.freeze({
  add: addEventListener,
  remove: removeEventListener,
});

type GetListenerConfigArgs = {
  element: HTMLElement;
  eventType: keyof HTMLElementEventMap;
  callback: () => void;
  eventKeys?: KeyboardEvent["key"][];
  parentElement?: HTMLElement;
};

/** @public */
export function getListenerConfig(args: GetListenerConfigArgs): ListenerConfig {
  const { element, eventType, callback, eventKeys = [], parentElement = element } = args;

  const node: Window | HTMLElement = getNode(parentElement, eventType);
  const eventListener: EventListener = getEventListener({ eventType, callback, element, eventKeys });

  return { node, eventType, eventListener };
}

// Add more relevant types if needed
const mouseEventTypes: MouseEventType[] = ["click"] as const;
const keyboardEventTypes: KeyboardEventType[] = ["keydown"] as const;

type MouseEventType = {
  [K in keyof HTMLElementEventMap]: HTMLElementEventMap[K] extends MouseEvent ? K : never;
}[keyof HTMLElementEventMap];

type KeyboardEventType = {
  [K in keyof HTMLElementEventMap]: HTMLElementEventMap[K] extends KeyboardEvent ? K : never;
}[keyof HTMLElementEventMap];

function isMouseEventType(value: keyof HTMLElementEventMap): value is MouseEventType {
  return mouseEventTypes.includes(value as MouseEventType);
}

function isKeyboardEventType(value: keyof HTMLElementEventMap): value is KeyboardEventType {
  return keyboardEventTypes.includes(value as KeyboardEventType);
}

function getNode(element: HTMLElement, eventType: keyof HTMLElementEventMap): Window | HTMLElement {
  if (isMouseEventType(eventType)) return element;
  if (isKeyboardEventType(eventType)) return window;

  throw Error(`Unknown event type: ${eventType}`);
}

type GetEventListenerArgs = {
  eventType: keyof HTMLElementEventMap;
  callback: () => void;
  element: HTMLElement;
  eventKeys: KeyboardEvent["key"][];
};

function getEventListener({ callback, element, eventKeys, eventType }: GetEventListenerArgs): EventListener {
  if (isMouseEventType(eventType)) return getMouseEventListener(callback, element);
  if (isKeyboardEventType(eventType)) return getKeyboardEventListener(callback, eventKeys);

  throw Error(`Unknown event type: ${eventType}`);
}

function getMouseEventListener(callback: () => void, element: HTMLElement): EventListener {
  return (event: Event): void => {
    if (!(event instanceof MouseEvent)) return;
    if (!(event.target instanceof HTMLElement)) return;
    if (event.target !== element) return;

    callback();
  };
}

function getKeyboardEventListener(callback: () => void, eventKeys: KeyboardEvent["key"][]): EventListener {
  if (eventKeys.length === 0) {
    throw Error(`Event key cannot be empty if keyboard event listener is used: ${eventKeys}`);
  }

  return (event: Event): void => {
    if (!(event instanceof KeyboardEvent)) return;
    if (!eventKeys.includes(event.key)) return;

    callback();
  };
}
