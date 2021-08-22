#!/usr/bin/env ts-node
/* eslint-disable camelcase */

import { command, restPositionals, run, binary } from 'cmd-ts'
import { File } from 'cmd-ts/dist/cjs/batteries/fs'
import fs from 'fs'
import { cpus } from 'os'

import { Writable } from 'stream'

import { StaticPool } from 'node-worker-threads-pool'

import { EventEmitter } from 'events'

import { extract_cls_names, extract_vars, NamesVerifier } from './NamesVerifier'

const verifier = new NamesVerifier()
const n_cpus = cpus().length

const ee = new EventEmitter()
let pending_execs = 0

const var_parser = new StaticPool({
  size: Math.ceil(n_cpus / 2.0),
  task: extract_vars
})

const cls_parser = new StaticPool({
  size: Math.ceil(n_cpus / 6.0),
  task: extract_cls_names
})

function destroy_parsers () {
  var_parser.destroy()
  cls_parser.destroy()
}

let writer_done = false
const writer = new Writable({
  write (chunk, _, next) {
    const locs = chunk.toString().split(/;|{|}/).filter((w: string) => w.length > 2)
    // console.debug(`Delegate ${locs.length} locs`)
    for (const loc of locs) {
      pending_execs += 2
      var_parser.exec(loc).then((result: any) => { verifier.add_vars(result); ee.emit('exec_done') })
      cls_parser.exec(loc).then((result: any) => { verifier.add_class_names(result); ee.emit('exec_done') })
      // console.debug(`Delegated ${loc.length} bytes, pending execs: ${pending_execs}`)
    }
    next()
  }
})

writer.on('finish', () => {
  writer_done = true
  console.log('All writes are now complete.')
  if (!pending_execs) {
    destroy_parsers()
  }
})

ee.on('exec_done', () => {
  pending_execs--
  // console.debug(`An exec task finshed, pending execs: ${pending_execs}`)
  if (!pending_execs && writer_done) {
    destroy_parsers()
    verifier.verify_names()
  }
})

const lint = command({
  name: 'mylint',
  args: {
    paths: restPositionals({ type: File })
  },
  async handler ({ paths }) {
    for (const path of paths) {
      fs.createReadStream(path).pipe(writer)
    }
  }
})

run(binary(lint), process.argv)
