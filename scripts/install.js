/**
 * Configure the path of the sources
 * adding a symlink in node_modules/app for typescript files
 * and a symlink in dist/node_modules/app for javascript generated files
 */
'use strict '

const fs = require('fs')
const join = require('path').join
const mkdirp = require('mkdirp-promise')
const utils = require('./utils')

let pathList = []
pathList.push(join(__dirname, '../log'))
pathList.push(join(__dirname, '../doc'))
pathList.push(join(__dirname, '../doc/tutorials'))

// create log, doc directories
for (let path of pathList) {
  fs.access(path, fs.R_OK, (err) => {
    if (err) {
      mkdirp(path)
    }
  })
}
