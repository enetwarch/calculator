import { type ListenerConfig, getElementById, getListenerConfig, processListenerConfig } from "@/utils/dom";
import { type Action, type Output, updateCalculator } from "@/utils/logic";

interface CalculatorInterface {
  initialize(buttonConfigList: CalculatorButtonConfig[]): void;
  destroy(): void;
}

export type CalculatorButtonConfig = {
  elementId: string;
  calculatorAction: Action;
  eventTypes: (keyof HTMLElementEventMap)[];
  eventKeys: KeyboardEvent["key"][];
};

export class Calculator implements CalculatorInterface {
  private _output: Output;
  private _outputElement: HTMLElement;
  private _storageKey: string;
  private _buttons?: CalculatorButton[];

  public constructor(output: Output, outputId: string, storageKey: string) {
    this._output = output;
    this._outputElement = getElementById(outputId);
    this._storageKey = storageKey;
    this._buttons = undefined;
  }

  /** @public */
  public initialize(buttonConfigList: CalculatorButtonConfig[]): void {
    this._buttons = buttonConfigList.map((config) => new CalculatorButton(config));

    // biome-ignore lint/complexity/noForEach: One-liner side effect loop
    this._buttons.forEach((button) => button.initialize(this.handleAction.bind(this)));
    this.updateOutputElement();
  }

  /** @public */
  public destroy(): void {
    if (!this._buttons) throw Error("Cannot destroy an uninitialized calculator");

    // biome-ignore lint/complexity/noForEach: One-liner side effect loop
    this._buttons.forEach((button) => button.destroy());
    this._outputElement.innerText = "";
  }

  private set output(value: Output) {
    this._output = value;
    this.saveOutput();
    this.updateOutputElement();
  }

  /** @internal */
  public handleAction(action: Action): void {
    this.output = updateCalculator(action, this._output, true);
  }

  /** @internal */
  public updateOutputElement(): void {
    this._outputElement.innerText = this._output.stringified;
  }

  /** @internal */
  public saveOutput(): void {
    const stringifiedOutput: string = JSON.stringify(this._output);
    localStorage.setItem(this._storageKey, stringifiedOutput);
  }

  /** @public */
  public static loadOutput(storageKey: string): Output {
    const storedOutput: string | null = localStorage.getItem(storageKey);
    if (!storedOutput) return { parsed: [], stringified: "" };

    return JSON.parse(storedOutput) as Output;
  }
}

type ActionHandler = (action: Action) => void;
interface CalculatorButtonInterface {
  initialize(actionHandler: ActionHandler): void;
  destroy(): void;
}

type CalculatorButtonProps = {
  elementId: string;
  calculatorAction: Action;
  eventTypes: (keyof HTMLElementEventMap)[];
  eventKeys?: KeyboardEvent["key"][];
};

class CalculatorButton implements CalculatorButtonInterface {
  private _elementId: string;
  private _calculatorAction: Action;
  private _eventTypes: (keyof HTMLElementEventMap)[];
  private _eventKeys: KeyboardEvent["key"][];
  private _listenerConfigList?: ListenerConfig[];

  public constructor({ elementId, calculatorAction, eventTypes, eventKeys }: CalculatorButtonProps) {
    this._elementId = elementId;
    this._calculatorAction = calculatorAction;
    this._eventTypes = eventTypes;
    this._eventKeys = eventKeys || [];
    this._listenerConfigList = undefined;
  }

  /** @public */
  public initialize(actionHandler: ActionHandler): void {
    const element: HTMLElement = getElementById(this._elementId);
    const callback: () => void = () => actionHandler(this._calculatorAction);
    const eventKeys: KeyboardEvent["key"][] = this._eventKeys;

    this._listenerConfigList = this._eventTypes.map((eventType) => {
      const parentElement: HTMLElement = element;
      return getListenerConfig({ element, eventType, callback, eventKeys, parentElement });
    });

    for (const listenerConfig of this._listenerConfigList) {
      processListenerConfig({ listenerConfig, eventAction: "add" });
    }
  }

  /** @public */
  public destroy(): void {
    if (!this._listenerConfigList) {
      throw Error(`No listeners for calculator button: "#${this._elementId}"`);
    }

    for (const listenerConfig of this._listenerConfigList) {
      processListenerConfig({ listenerConfig, eventAction: "remove" });
    }
  }
}
