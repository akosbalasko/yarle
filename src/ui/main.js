const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const fs = require('fs');
const {loggerInfo}  = require('../utils/loggerInfo')
const store = require('./store');
const { initialize, enable } = require("@electron/remote/main")
const { mapSettingsToYarleOptions } = require('./settingsMapper')
const yarle = require('../yarle')
const {OutputFormat} = require('./../output-format')
const { applyLinks } = require('./../utils/apply-links');

initialize();
// tslint:disable-next-line:no-require-imports variable-name
const Store = require('electron-store');

const path = require('path');
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
      const outputNotebookFolders = await yarle.dropTheRope(settings);
      // apply internal links
      applyLinks(settings, outputNotebookFolders);
    
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
  

  
  ipcMain.handle('saveTemplate', async (event, data) => {
    store.set(data.id, data.value);
    // tslint:disable-next-line:no-console
    console.log(`Template : ${data.value}`);
  });
  
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })});

  

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

