'use strict'

module.exports = {  
  exit: true,
  bail: true,
  slow: 1000,
  recursive: true,
  require: [
    'ts-node/register/type-check',
    'source-map-support/register'
  ],
  'full-trace': true,
  bail: true,
  ui: 'bdd',
  color: true,
  spec: ['test/**/*.spec.ts'],
}