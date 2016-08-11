'use strict'
const os = require('os')
const fork = require('child_process')
const join = require('path').join

// create app symlink
exports.createSymLink = function (path) {
  let command = ''
  if (os.type() === 'Windows_NT') {
    let appdir = join(path, '..\\..\\app')
    command = `mklink /j ${path} ${appdir}`
  } else {
    command = `ln -s ../app ${path}`
  }

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
