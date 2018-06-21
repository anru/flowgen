/* @flow */

import fs from "fs";

/**
 * Takes a path and some content and performs a write call. Simple.
 */
export default function exportDefault(fileName: ?string, output: string) {
  if (fileName) {
    fs.writeSync(fs.openSync(fileName, 'a'), output);
  } else {
    process.stdout.write(output)
    process.stdout.write('\n')
  }
}
