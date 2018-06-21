// @flow
import path from "path";

import meta from "./meta";
import beautify from "./beautifier";

import compiler from "./compiler";
import writeFile from "./default-exporter";
import getStdin from "get-stdin";

import { readFileSync } from "fs";

type RunnerOptions = {
  version: string,
  out: string,
  compileTests: boolean,
};

export default (options: RunnerOptions) => {
  const compile = (compiler, sourcePath = null) => {
    const sourcePathDesc = sourcePath || "<stdin>";

    try {
      const intro = meta(sourcePathDesc, options.version);
      const flowDefinitions = compiler();

      // Write the output to disk
      writeFile(options.out, beautify(intro + flowDefinitions));
    } catch (e) {
      console.error("Parsing", sourcePathDesc, "failed");
      console.error(e);
    }
  };

  // No real reason to return an object here instead of combining
  // the compile function into the wrapper, but I like the API it produces.
  return {
    compileStdin: () => {
      return getStdin().then(source => {
        if (source) {
          compile(() => compiler.compileDefinitionString(source));
        }
      });
    },
    compile: (files: Array<string>) => {
      // Iterate all the files the user has passed in
      files.forEach((file, index) => {
        // Get the module name from the file name
        const moduleName = getModuleNameFromFile(file);

        // Let the user know what's going on
        if (files.length > 3) {
          // If we're compiling a lot of files, show more stats
          const progress = Math.round((index / files.length) * 100);
          process.stderr.write("\r\x1b[K");
          process.stderr.write(progress + "% | " + moduleName);
        } else {
          process.stderr.write(`Parsing ${moduleName}\n`);
        }

        // Produce the flow library content
        compile(() => compiler.compileDefinitionFile(file), file);
      });
    },
  };
};

function getModuleNameFromFile(fileName: string): string {
  return path.basename(fileName);
}
