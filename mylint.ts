#!/usr/bin/env ts-node
/* eslint-disable camelcase */

import { command, restPositionals, flag, run, binary, boolean } from 'cmd-ts'
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
    //console.log("--- ", chunk)
    if (Math.random() < 0.5) {
      callback(null, chunk)
    } else { callback(null, '') }
  }
})

const cat = command({
  name: 'mylint',
  args: {
    paths: restPositionals({ type: File }),
    sleeper: flag({ type: boolean, long: 'sleeper', short: 's' })
  },
  async handler ({ paths, sleeper }) {
    for (const path of paths) {
      if (sleeper) {
        fs.createReadStream(path, { highWaterMark: 4 }).pipe(randomSleeper).pipe(process.stdout)
      } else {
        fs.createReadStream(path, { highWaterMark: 4 }).pipe(process.stdout)
      }
    }
  }
})

run(binary(cat), process.argv)
