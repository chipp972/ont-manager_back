/**
 * Configure the path of the sources
 * adding a symlink in node_modules/app/
 */
import * as os from 'os'
import * as fork from 'child_process'
import {access, R_OK, mkdir} from 'fs'
import {join} from 'path'

let command: string
let path: string

if (os.type() === 'Windows_NT') {
  path = 'node_modules\\app'
  command = `mklink /j ${path} app`
} else {
  path = join(__dirname, '../node_modules/app')
  command = `ln -s ../app ${path}`
}
console.log(path)

access(path, R_OK, (err) => {
  if (! err) {
    process.exit(0)
  } else {
    console.log(err)
  }
})

fork.exec(command, (err, stdout, stderr) => {
  if (err) {
    if (! /existant/ig.test(err.message) || ! /exists/ig.test(err.message)) {
      console.log('message: ' + err.message)
      throw err
    }
  }
  console.log(stdout)
})

// log directory
access('log', R_OK, (err) => {
  if (err) {
    mkdir(join(__dirname, '../log'))
  }
})
