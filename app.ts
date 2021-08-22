#!/usr/bin/env ts-node
/* eslint-disable camelcase */

import { command, restPositionals, flag, run, binary, boolean, option, optional } from 'cmd-ts'
import { File } from 'cmd-ts/dist/cjs/batteries/fs'
import fs from 'fs'
import { cpus } from 'os'

import { Transform } from 'stream'

const n_cpus = cpus().length
console.log(n_cpus)

let randomSleeper = new Transform({
  transform (chunk, encoding, callback) {
    // await setTimeout(() => {}, 5)
    // await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
    callback(null, chunk)
  }
})

const cat = command({
  name: 'mylint',
  args: {
    paths: restPositionals({ type: File }),
    sleeper: flag({ type: boolean, long: 'sleeper', short: 's' }),
    new_sleeper: flag({ type: boolean, long: 'new_sleeper', short: 'n' })
  },
  async handler ({ paths, sleeper, new_sleeper }) {
    for (const path of paths) {
      if (sleeper || new_sleeper) {
        if (new_sleeper) {
          randomSleeper = new Transform({
            async transform (chunk, encoding, callback) {
              await new Promise(resolve => setTimeout(resolve, Math.random() * 100))
              callback(null, chunk)
            }
          })
        }
        fs.createReadStream(path, { highWaterMark: 3 }).pipe(randomSleeper).pipe(process.stdout)
      } else {
        fs.createReadStream(path, { highWaterMark: 3 }).pipe(process.stdout)
      }
    }
  }
})

run(binary(cat), process.argv)
