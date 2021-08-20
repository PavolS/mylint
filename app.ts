#!/usr/bin/env ts-node
/* eslint-disable camelcase */

import { command, restPositionals, run, binary } from 'cmd-ts'
import { File } from 'cmd-ts/dist/cjs/batteries/fs'
import fs from 'fs'
import { cpus } from 'os'

import { Transform } from 'stream'

const n_cpus = cpus().length
console.log(n_cpus)

const randomSleeper = new Transform({
  async transform (chunk, encoding, callback) {
    // await setTimeout(() => {}, 5)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
    callback(null, chunk)
  }
})

const cat = command({
  name: 'mylint',
  args: {
    paths: restPositionals({ type: File })
  },
  async handler ({ paths }) {
    for (const path of paths) {
      //      fs.createReadStream(path, { highWaterMark: 16 }).pipe(randomSleeper).pipe(process.stdout)
      fs.createReadStream(path, { highWaterMark: 16 }).pipe(process.stdout)
    }
  }
})

run(binary(cat), process.argv)
