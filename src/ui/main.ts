

import * as fs from 'fs';
const url = require("url");
const path = require("path");
import { store } from './store';
import * as yarle from '../yarle';

import { mapSettingsToYarleOptions } from './settingsMapper';
import { logger } from '../utils/logger';

//handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents')
/*if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}*/

const electron = require('electron')
// Module to control application life.
const app = electron.app
const {ipcMain} = require('electron')
require('./dialog/dialog')

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
//Adds the main Menu to our app

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;
let secondWindow: any;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({titleBarStyle: 'hidden',
    width: 1281,
    height: 800,
    minWidth: 1281,
    minHeight: 800,
    backgroundColor: '#312450',
    show: false,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()


  // Show the mainwindow when it is loaded and ready to show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  secondWindow = new BrowserWindow({frame: false,
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#312450',
    show: false,
    icon: path.join(__dirname, 'assets/icons/png/64x64.png'),
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  })

  secondWindow.loadURL(`file://${__dirname}/windows/ipcwindow.html`)

  require('./menu/mainmenu')


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
    console.log(`${__dirname}/../../sampleTemplate.tmpl`);
    const defaultTemplate = fs.readFileSync(`${__dirname}/../../sampleTemplate.tmpl`, 'utf-8');
    mainWindow.webContents.send('defaultTemplateLoaded', defaultTemplate);
    mainWindow.webContents.send('storedSettingsLoaded', store.store )
    mainWindow.show()
  
  });
  
}

ipcMain.on('open-second-window', (event: any, arg: any)=> {
    secondWindow.show()
})

ipcMain.on('close-second-window', (event: any, arg: any)=> {
    secondWindow.hide()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


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
      logger.info(result.canceled)
      logger.info(result.filePaths)
       // fileNames is an array that contains all the selected
      if(result.filePaths === undefined){
        logger.info("No file selected");
        return;
    }
    const filePath = result.filePaths[0];
    logger.info('path: ' + filePath);
    store.set('enexSource', filePath);
    //const currentEnexFiles = fs.readdirSync(filePath).filter(fileName => fileName.match(/enex$/g)).join('\n');
    logger.info('enex files: ' + filePath);
    mainWindow.webContents.send('currentEnexFiles', filePath);
    mainWindow.webContents.send('enexSource', filePath);
    }).catch((err: any) => {
      logger.info(err)
    })
 })


ipcMain.on('selectOutputFolder', () => {
  var { dialog } = require('electron');
  dialog.showOpenDialog(
    { 
      properties: ['openDirectory'],
    }).then((result: any) => {
      logger.info(result.canceled)
      logger.info(result.filePaths)
       // fileNames is an array that contains all the selected
      if(result.filePaths === undefined){
        logger.info("No file selected");
        return;
    }
    const outputPath = result.filePaths[0];
    store.set('outputDir', outputPath);
    console.log('outputDir:' + outputPath);
    mainWindow.webContents.send('outputDirectorySelected', outputPath);
    }).catch((err: any) => {
      logger.info(err)
    })
 
})

ipcMain.on('configurationUpdated', (event: any, data: any) => {
  logger.info("this is the firstname from the form ->", data)

  console.log("this is the firstname from the form ->", data)
  store.set(data.id, data.value);
  logger.info(store.get(data.id));

});

ipcMain.on('startConversion', async(event: any, data: any) => {
  const settings = mapSettingsToYarleOptions();
  await yarle.dropTheRope(settings);

});

ipcMain.on('saveTemplate', async(event: any, data: any) => {
  store.set(data.id, data.value);
  console.log(`Template : ${data.value}`);
  logger.info(store.get(data.id));
})