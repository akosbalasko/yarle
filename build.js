var fs = require('fs')
var resolve = require('path').resolve
var join = require('path').join
var cp = require('child_process')
var os = require('os')

// get library path
var lib = resolve(__dirname, 'node_modules', 'turndown');

// ensure path has package.json
if (!fs.existsSync(join(lib, 'package.json'))) return

// npm binary based on OS
var npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm'

// install folder
cp.execSync(`${npmCmd} i`, { cwd: lib, stdio: 'inherit' })
cp.execSync(`${npmCmd} run build`, { cwd: lib, stdio: 'inherit' })

