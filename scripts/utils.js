'use strict'
const os = require('os')
const fork = require('child_process')
const join = require('path').join
const fs = require('fs')

// create app symlink
exports.createSymLink = function (path) {
  let command = ''

  if (os.type() === 'Windows_NT') {
    let appdir = join(path, '..\\..\\app')
    execCommand(`mklink /j ${path} ${appdir}`)
  } else {
    let todoPath = join(path, '/app')
    fs.access(todoPath, fs.R_OK, (err) => {
      if (err) {
        execCommand(`ln -s ../app ${path}`)
      } else {
        console.log(`path ${todoPath} already exists`)
      }
    })
  }
}

function execCommand (command) {
  fork.exec(command, (err, stdout, stderr) => {
    if (err) {
      if (!/existant/ig.test(err.message) || !/exists/ig.test(err.message)) {
        console.log(`symlink in ${path} already exists`)
        console.log(err)
      }
    }
    console.log(stdout)
  })
}
