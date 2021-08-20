#!/usr/bin/env ts-node
/* eslint-disable camelcase */

import { command, positional, run, binary, number } from 'cmd-ts'
import { Directory } from 'cmd-ts/dist/cjs/batteries/fs'
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
  name: 'dump',
  args: {
    path: positional({ type: Directory }),
    n: positional({ type: number })
  },
  async handler ({ path, n }) {
    for (const char of 'ABC') {
      const to = fs.createWriteStream(path + '/' + char)
      for (let i = 0; i < n; i++) {
        to.write(char + i + '\n')
      }
    }
  }
})

run(binary(cat), process.argv)
