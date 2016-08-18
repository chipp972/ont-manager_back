/**
 * Configure the path of the sources
 * adding a symlink in node_modules/app for typescript files
 * and a symlink in dist/node_modules/app for javascript generated files
 */
'use strict '

const os = require('os')
const fs = require('fs')
const join = require('path').join
const mkdirp = require('mkdirp-promise')
const utils = require('./utils')

let pathList = []
let neededPathList = []
neededPathList.push(join(__dirname, '../log'))
neededPathList.push(join(__dirname, '../dist/node_modules'))
neededPathList.push(join(__dirname, '../node_modules'))

if (os.type() === 'Windows_NT') {
  pathList.push(join(__dirname, '..\\node_modules\\app'))
  pathList.push(join(__dirname, '..\\dist\\node_modules\\app'))
} else {
  pathList.push(join(__dirname, '../node_modules/'))
  pathList.push(join(__dirname, '../dist/node_modules/'))
}

// create log, dist/node_modules and node_modules directories
for (let path of neededPathList) {
  fs.access(path, fs.R_OK, (err) => {
    if (err) {
      mkdirp(path)
    }
  })
}

// create symlink for app in node_modules and dist/node_modules
// for (let path of pathList) {
//   fs.access(path, fs.R_OK, (err) => {
//     if (err && os.type() !== 'Windows_NT') {
//       mkdirp(path)
//       .then(() => utils.createSymLink(path))
//     } else {
//       utils.createSymLink(path)
//     }
//   })
// }
