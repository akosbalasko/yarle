const { app, BrowserWindow, dialog, session, ipcMain } = require('electron')
const YARLE_COOKIE_NAME = 'YARLE-COOKIE';
const fs = require('fs');
const {loggerInfo}  = require('../utils/loggerInfo')
const store = require('./store');
const { initialize, enable } = require("@electron/remote/main")
const { mapSettingsToYarleOptions } = require('./settingsMapper')
const yarle = require('../yarle')
const {OutputFormat} = require('./../output-format')
const { applyLinks } = require('./../utils/apply-links');
const { isTanaOutput } = require('./../utils/tana/is-tana-output');
const {createTanaOutput } = require('./../utils/tana/create-tana-output');
// tslint:disable-next-line:no-require-imports variable-name
const Store = require('electron-store');

const path = require('path');

const postStatistics = async (token, stats) => {
  const { net } = require('electron')
  const request = net.request({
    method: 'POST',
    url: 'https://europe-west4-yarle-391407.cloudfunctions.net/yarle-stats-function'
  })
  request.setHeader('Authorization', token)
  request.setHeader('Content-type', 'application/json')
  request.write(JSON.stringify(stats))
  request.end()
}

const calculateStatistics = (config, stats) => {
  const statisticsObj = {
    config,
    
  }
  delete statistics.config.template;
  
  statisticsObj.notebooks = stats.length
  statisticsObj.statistics = stats.reduce((acc, curr) => {
    return  {
      notes: {
        total: acc.notes.total + curr.notes.total,
        success: acc.notes.success + curr.notes.success,
        failed: acc.notes.failed+ curr.notes.failed,
        skipped: acc.notes.skipped + curr.notes.skipped,
    }
  }
  }, {
    notes: {
      total: 0,
      success: 0,
      failed: 0,
      skipped: 0}})
  console.log(statisticsObj)
  return statisticsObj
}

initialize();

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('yarle-fiddle', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('yarle-fiddle')
}


Store.initRenderer();
// handle setupevents as quickly as possible
// tslint:disable-next-line:no-require-imports
// const setupEvents = require('./installers/setupEvents');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const defaultTemplate = fs.readFileSync(`${__dirname}/../../sampleTemplate.tmpl`, 'utf-8');
const width  = 1280;
const height = 960;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width    : width,
    height   : height,
    minWidth : width/2,
    minHeight: height/2,
    maxWidth : width,
    maxHeight: height,
    resizable: true,
    show: true,
    backgroundColor: '#FFA534',
    icon: path.join(__dirname, 'assets/icons/png/192x192.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  enable(mainWindow.webContents)
  mainWindow.loadFile(path.join(__dirname, 'index.html'))


const cookies = session.defaultSession.cookies;
cookies.on('changed', function(event, cookie, cause, removed) {
  if (cookie.name === YARLE_COOKIE_NAME){
    console.log("Cookie in main", cookie.value)
    console.log("json: ", cookie.value)

    store.set('magicToken', cookie.value)
  }
})
     // IPC listener
    ipcMain.on('electron-store-get', async (event, val) => {
      console.log('getting value of key: ' + val)
      event.returnValue = store.get(val);
    });
    ipcMain.on('electron-store-set', async (event, key, val) => {
      store.set(key, val);
    });

    ipcMain.on('configurationUpdated', (event, data) => {
        store.set(data.id, data.value);
      loggerInfo(`config: ${data.id}: ${JSON.stringify(store.get(data.id))}`);
    
    });

    ipcMain.on('updateLogArea', (event, data) => {
      console.log('updateLogArea in ipcMain reached')
      mainWindow.webContents.send('updateLogArea', data)
    });


    ipcMain.on('startConversion', async (event, data) => {
      const settings = mapSettingsToYarleOptions();
      const results = await yarle.dropTheRope(settings);
      // apply internal links
      applyLinks(settings, results.map(result => result.outputFolders))
    
      if (isTanaOutput()){
        createTanaOutput(settings, results.map(result => result.outputFolders))
    }

    // send statistics
    const didToken = store.get('magicToken')
    console.log("statistics: ", results.map(result => result.statistics))
    await postStatistics(
      didToken,
      calculateStatistics(mapSettingsToYarleOptions(), results.map(result => result.statistics)))
    });


  mainWindow.once('ready-to-show', () => {
    console.log(('ready-to-show'))
/*
    store.onDidChange('outputFormat', (newValue, oldValue) => {
      console.log(('output format changed, newValue' + newValue))
      console.log(OutputFormat.LogSeqMD)
      const logSeqConfig = fs.readFileSync(`${__dirname}/../../config.logseq.json`, 'utf-8');
      if (newValue === OutputFormat.LogSeqMD) {
        const logSeqTemplate = fs.readFileSync(`${__dirname}/../../sampleTemplate_logseq.tmpl`, 'utf-8');
        console.log(('logSeqModeSelected'))

        mainWindo.webContents.send('onLogSeqModeSelected', logSeqConfig, logSeqTemplate);
      } else {
        const defaultConfig = fs.readFileSync(`${__dirname}/../../config.json`, 'utf-8');
        console.log(('logSeqModeDeselected'))

        mainWindow.webContents.send('logSeqModeDeSelected', defaultConfig, defaultTemplate);
      }
    });*/
    store.set('outputFormat', OutputFormat.ObsidianMD);

    const defaultConfig = fs.readFileSync(`${__dirname}/../../config.json`, 'utf-8');

    mainWindow.show();
    mainWindow.webContents.send('logSeqModeDeSelected');


  });
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  

}
//TODO: CONFIG VEZÉRLŐ SZABÁLYOK NEM JÓK MÉG(NESTED TAGS NEM AKTIVÁLÓDIK)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
    // the commandLine is array of strings in which last element is deep link url
    // the url str ends with /
    dialog.showErrorBox('Welcome Back', `You arrived from: ${commandLine.pop().slice(0, -1)}`)
  })

app.whenReady().then(() => {

  createWindow() 

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and import them here.
  ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(
  
      {
        properties: ['openFile', 'multiSelections'],
        filters: [
  
          { name: 'Enex files', extensions: ['enex']},
        ],
  
      })
      if (canceled) {
        return
      } else if (filePaths) {
        store.set('enexSources', filePaths);
        return filePaths.join('\n')
      }
   });
  
  ipcMain.handle('dialog:selectOutputFolder', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(
      {
        properties: ['openDirectory'],
      });
      if (canceled) {
        return
      } else if (filePaths) {
        const outputPath = filePaths[0];
        store.set('outputDir', outputPath);
        // tslint:disable-next-line:no-console
        console.log(`outputDir: ${outputPath}`);
        return outputPath;

      }

  });

  ipcMain.handle('perform:magicLogin', async ()=> {
    console.log(' ipcMain.handle - magicLogin')
    const authWindow = new BrowserWindow({
      width    : width,
      height   : height,
      minWidth : width/2,
      minHeight: height/2,
      maxWidth : width,
      maxHeight: height,
      resizable: true,
      show: true,
      backgroundColor: '#FFA534',
      icon: path.join(__dirname, 'assets/icons/png/192x192.png'),
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    })
    authWindow.on('session-end', function (){
      console.log("session end")
      authWindow.webContents.session.cookies.get({}, async (error, cookies) => {
        if (error){
          console.log('Error getting cookies:', error);
          return;
        }
        console.log('cookies:', cookies)
    })
  })

    /*authWindow.on('closed', function() {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      console.log("it is closed!")
      authWindow.webContents.session.cookies.get({}, async (error, cookies) => {
        if (error){
          console.error('Error getting cookies:', error);
          return;
        }
        console.log('cookies:', cookies)
      })
    })*/
    authWindow.loadURL('http://localhost:3000');

/*    const magic = new Magic("pk_live_153366AD0DA03DE9");

    const login = await magic.auth.loginWithMagicLink({
      email,
    });
    console.log(" ipcMain.handle - done: ", login)*/
  })
  
  ipcMain.handle('saveTemplate', async (event, data) => {
    store.set(data.id, data.value);
    // tslint:disable-next-line:no-console
    console.log(`Template : ${data.value}`);
  });
  
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});
}
  

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle the protocol. In this case, we choose to show an Error Box.
app.on('open-url', (event, url) => {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
