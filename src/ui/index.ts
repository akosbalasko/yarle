const {app, BrowserWindow, ipcMain} = require('electron');
import * as fs from 'fs';
const url = require("url");
const path = require("path");
import { store } from './store';
import * as yarle from './../yarle';

import { mapSettingsToYarleOptions } from './settingsMapper';
import { loggerInfo } from './../utils/loggerInfo';

let mainWindow: any;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1296,
    height: 768,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `../../src/ui/index.html`),
      protocol: "file:",
      slashes: true
    })
  );
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
  mainWindow.webContents.on('did-finish-load', ()=> {
    const defaultTemplate = fs.readFileSync(`${__dirname}/../../sampleTemplate.tmpl`, 'utf-8');
    mainWindow.webContents.send('defaultTemplateLoaded', defaultTemplate);
    mainWindow.webContents.send('storedSettingsLoaded', store.store )
    mainWindow.show()
  
  });
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('openEnexSource', () => {
  var { dialog } = require('electron');
  dialog.showOpenDialog(
    { 
      properties: ['openFile'],
      
    }).then((result: any) => {
       // fileNames is an array that contains all the selected
      if(result.filePaths === undefined){
        loggerInfo("No file selected");
        return;
    }
    const filePath = result.filePaths[0];
    store.set('enexSource', filePath);
    //const currentEnexFiles = fs.readdirSync(filePath).filter(fileName => fileName.match(/enex$/g)).join('\n');
    loggerInfo('enex files: ' + filePath);
    mainWindow.webContents.send('currentEnexFiles', filePath);
    mainWindow.webContents.send('enexSource', filePath);
    }).catch((err: any) => {
      loggerInfo(err)
    })
 })


ipcMain.on('selectOutputFolder', () => {
  var { dialog } = require('electron');
  dialog.showOpenDialog(
    { 
      properties: ['openDirectory'],
    }).then((result: any) => {
      loggerInfo(result.canceled)
      loggerInfo(result.filePaths)
       // fileNames is an array that contains all the selected
      if(result.filePaths === undefined){
        loggerInfo("No file selected");
        return;
    }
    const outputPath = result.filePaths[0];
    store.set('outputDir', outputPath);
    mainWindow.webContents.send('outputDirectorySelected', outputPath);
    }).catch((err: any) => {
      loggerInfo(err)
    })
 
})

ipcMain.on('configurationUpdated', (event: any, data: any) => {
  loggerInfo(`this is the firstname from the form -> ${JSON.stringify(data)}`);
  store.set(data.id, data.value);
  loggerInfo(JSON.stringify(store.get(data.id)));

});

ipcMain.on('startConversion', async(event: any, data: any) => {
  const settings = mapSettingsToYarleOptions();
  loggerInfo(`config to be applied: ${settings}`);
  await yarle.dropTheRope(settings);

});