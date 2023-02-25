const { contextBridge, ipcRenderer } = require('electron')
const path = require('path');
const fs = require('fs');
const { OutputFormat } = require("../output-format")

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),

  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('electronAPI', {

  openFile: async () => {
    console.log('ipcRendere invoking dialog:openFile')

    return ipcRenderer.invoke('dialog:openFile')
  },
  selectOutputFolder: async () => {
    return ipcRenderer.invoke('dialog:selectOutputFolder')
  },
  readFileSync: fs.readFileSync,
  getConfigByType: (type) => {
    return fs.readFileSync(
      (type === OutputFormat.LogSeqMD)
        ? `${__dirname}/../../config.logseq.json`
        : `${__dirname}/../../config.json`
      , 'utf-8');
    
  },
  getTemplateByType: (type) => {
    return fs.readFileSync(
      (type === OutputFormat.LogSeqMD)
        ? `${__dirname}/../../sampleTemplate_logseq.tmpl`
        : `${__dirname}/../../sampleTemplate.tmpl`
      , 'utf-8');
    
  },  
  outputFormat: OutputFormat,
  currentDir: __dirname,
  store: {
    get(key) {
      return ipcRenderer.send('electron-store-get', key);
    },
    set(property, val) {
      ipcRenderer.send('configurationUpdated', {id: property, value: val});
    },
  },

  startLogWatcher: (logArea) => {
    const LOGFILE =  path.join(getAppDataPath(),'conversion.log');

    var chokidar = require("chokidar");
    console.log('watching: ' + LOGFILE);
    var watcher = chokidar.watch(LOGFILE, {
    ignored: /[\/\\]\./,
    persistent: true,
    usePolling: true
    });
  
    function onWatcherReady() {
      console.info('From here can you check for real changes, the initial scan has been completed.');
  
    }
  
    // Declare the listeners of the watcher
    watcher.on('change', function (path) {
      console.log(`${path} changed`);
      logArea.innerHTML = fs.readFileSync(path, 'UTF-8')
      //ipcRenderer.send('updateLogArea', fs.readFileSync(path, 'UTF-8'));
    }).on('ready', onWatcherReady)
  },
  onLogSeqModeSelected: (callback) => {
    console.log('onLogSeqModeSelected triggered')
    ipcRenderer.on('logSeqModeSelected', callback)
  },
  onLogSeqModeDeSelected: (callback) => ipcRenderer.on('logSeqModeDeSelected', callback),

  startConversion: () => {
    ipcRenderer.send('startConversion')
  }
})

const getAppDataPath = () => {
  switch (process.platform) {
    case "darwin": {
      return path.join(process.env.HOME, "Library", "Application Support", "yarle-evernote-to-md");
    }
    case "win32": {
      return path.join(process.env.APPDATA, "yarle-evernote-to-md");
    }
    case "linux": {
      return path.join(process.env.HOME, ".yarle-evernote-to-md");
    }
    default: {
      console.log("Unsupported platform!");
      process.exit(1);
    }
  }
}