#!/usr/bin/env ts-node
/* eslint-disable camelcase */

import { command, restPositionals, flag, run, binary, boolean, option, optional, positional } from 'cmd-ts'
import { File } from 'cmd-ts/dist/cjs/batteries/fs'
import fs from 'fs'
import { cpus } from 'os'

import { Transform } from 'stream'

const n_cpus = cpus().length
console.log(n_cpus)

const randomSleeper = new Transform({
  transform (chunk, encoding, callback) {
    // await setTimeout(() => {}, 5)
    // await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
    callback(null, chunk)
  }
})

const x: number = 6
console.log(x)

const cat = command({
  name: 'mylint',
  args: {
    path: positional({ type: File })
  },
  async handler ({ path }) {
    const in_stream = fs.createReadStream(path, { highWaterMark: 3 })
    in_stream.pipe(process.stdout)
    in_stream.pipe(process.stdout)
    in_stream.pipe(process.stdout)
  }
})

run(binary(cat), process.argv)
