#! /usr/bin/env node
/* @flow */
import runner from "./runner";
import { version } from "../../package.json";
import yargs from 'yargs'

const fail = (e) => {
  console.error(e)
  process.exitCode = 1
}

process.on('uncaughtException', fail)
process.on('unhandledRejection', fail)

const desc = `Generates and prints flow definition of corresponding typescript files. \
Also tries to read ts source from stdin and process it as well`

const argv = yargs
  .version(version)
  .usage('$0 [-o outputFile] [files]', desc)
  .option('o', {
    alias: 'output-file',
    demandOption: false,
    describe: 'path to output file, if not specified writes to stdout',
    type: 'string'
  })
  .help()
  .example('$0 foo.ts', 'prints result flow definitions to stdout')
  .argv

console.error(JSON.stringify(argv))

function main() {
  const compiler = runner({
    out: argv.o,
    version,
  });

  compiler.compileStdin().then(() => {
    compiler.compile(argv._)
  })
}

main()
