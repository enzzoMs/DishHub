import { RoundToFivePipe } from "./round-to-five.pipe";

describe("RoundToFivePipe", () => {
  const roundToFivePipe = new RoundToFivePipe();

  it("should round numbers to the lowest multiple of five", () => {
    [
      { value: 0, expectedResult: 0 },
      { value: 3, expectedResult: 0 },
      { value: 23, expectedResult: 20 },
      { value: 25, expectedResult: 25 },
      { value: 33, expectedResult: 30 },
      { value: -23, expectedResult: -25 },
      { value: -21, expectedResult: -25 },
      { value: 12.3, expectedResult: 10 },
      { value: 18.9, expectedResult: 15 },
      { value: -12.3, expectedResult: -15 },
    ].forEach(({ value, expectedResult }) => {
      const transformResult = roundToFivePipe.transform(value);
      expect(transformResult).toBe(expectedResult);
    });
  });
});
