/**
 * Configure the path of the sources
 * adding a symlink in node_modules/app/
 */
import * as os from 'os'
import * as fs from 'fs'
import * as fork from 'child_process'
import * as path from 'path'

let command : string
if (os.type() === 'Windows_NT')
  command = 'mklink /j node_modules\\app app'
else
  command = 'ln -s ../app node_modules/app/'

fork.exec(command, (err, stdout, stderr) => {
  if (err) {
    if (! /existant/.test(err.message)) {
      console.log(err.message)
      throw err
    }
  }
  console.log(stdout)
})
