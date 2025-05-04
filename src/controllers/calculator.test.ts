// @vitest-environment happy-dom

import { getElementById } from "@/controllers/calculator";

describe(getElementById.name, () => {
  const ids: string[] = ["idOne", "idTwo", "idThree"];

  it("should throw an error for ids with non-existing elements", () => {
    for (const id of ids) {
      assert.throws(() => getElementById(id));
    }
  });

  it("should return an HTMLElement when the element with the id exists", () => {
    for (const id of ids) {
      const element = document.createElement("div");
      element.id = id;

      document.body.appendChild(element);
    }

    for (const id of ids) {
      expect(getElementById(id)).toBeInstanceOf(HTMLElement);
    }
  });
});
