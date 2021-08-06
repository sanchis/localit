import { localit as store } from "../dist/localit";

describe("Saving and retrieving objects", () => {
  store.config({ domain: "object_tests" });
  store.bust();

  const simpleObject = {
    key: "simple_object",
    value: {
      one: 1,
      two: "two",
      three: false,
      css: ["display", "font-size"],
      html: {
        div: true,
        span: false,
      },
    },
  };
  const complexObject = {
    key: "complex_object",
    value: {
      js: {
        one: true,
        two: "test",
        other: [1, 2, 3, 4, 5],
      },
      ts: [true, false, false, true],
      css: ["display", "font-size"],
      html: {
        div: true,
        span: false,
      },
    },
  };

  test("Object is stored", () => {
    store.set(simpleObject.key, simpleObject.value);
    expect(localStorage.length).toBe(1);
  });

  test("Array is encoded properly", () => {
    const { css } = store.get(simpleObject.key);
    expect(css).toEqual(simpleObject.value.css);
  });

  test("Object is encoded properly", () => {
    const { html } = store.get(simpleObject.key);
    expect(html.div).toBeTruthy();
    expect(html.span).toBeFalsy();
  });

  store.bust();

  test("Two different objects do not equal", () => {
    store.set(simpleObject.key, simpleObject.value);
    store.set(complexObject.key, complexObject.value);

    expect(store.get(simpleObject.key)).not.toEqual(store.get(complexObject.key));
  });
});
