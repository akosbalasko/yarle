#!/usr/bin/env node

// A wrapper to allow starting the index.js in debug mode port is 3000
const { spawn } = require('child_process')
var child = spawn('node', ['./node_modules/@electron-forge/cli/dist/electron-forge.js', 'start'], { stdio: 'inherit' })