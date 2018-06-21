import compiler from "../cli/compiler";
import beautify from "../cli/beautifier";

it("should handle export interface construction", () => {
  const ts = `
  export interface MyObj {
    state?: string
  }
`;

  const result = compiler.compileDefinitionString(ts);

  expect(beautify(result)).toMatchSnapshot();
});
