
import * as fs from 'fs';
import url from 'url';
import path from 'path';
import electron from 'electron';

import * as yarle from '../yarle';
import { loggerInfo } from '../utils/loggerInfo';

import { store } from './store';
import { mapSettingsToYarleOptions } from './settingsMapper';
import { OutputFormat } from './../output-format';

// handle setupevents as quickly as possible
// tslint:disable-next-line:no-require-imports
const setupEvents = require('./installers/setupEvents');
/*if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}*/

// Module to control application life.
const app = electron.app;
// tslint:disable-next-line:no-require-imports
require('./dialog/dialog');

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
// Adds the main Menu to our app

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;
let secondWindow: any;
const defaultTemplate = fs.readFileSync(`${__dirname}/../../sampleTemplate.tmpl`, 'utf-8');

// tslint:disable-next-line:typedef
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({titleBarStyle: 'hidden',
    width: 1281,
    height: 800,
    minWidth: 1281,
    minHeight: 800,
    backgroundColor: '#312450',
    show: false,
    icon: path.join(__dirname, 'assets/icons/png/192x192.png'),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '../../src/ui/index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {

    store.onDidChange('outputFormat', (newValue: any, oldValue: any) => {
      const logSeqConfig = fs.readFileSync(`${__dirname}/../../config.logseq.json`, 'utf-8');
      if (newValue === OutputFormat.LogSeqMD) {
        const logSeqTemplate = fs.readFileSync(`${__dirname}/../../sampleTemplate_logseq.tmpl`, 'utf-8');
        mainWindow.webContents.send('logSeqModeSelected', logSeqConfig, logSeqTemplate);
      } else {
        const defaultConfig = fs.readFileSync(`${__dirname}/../../config.json`, 'utf-8');

        mainWindow.webContents.send('logSeqModeDeselected', defaultConfig, defaultTemplate);
      }
    });
    mainWindow.show();
    const defaultConfig = fs.readFileSync(`${__dirname}/../../config.json`, 'utf-8');

    mainWindow.webContents.send('logSeqModeDeselected', defaultConfig, defaultTemplate);

  });

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

electron.ipcMain.on('openEnexSource', () => {
  electron.dialog.showOpenDialog(

    {
      properties: ['openFile', 'multiSelections'],
      filters: [

        { name: 'Enex files', extensions: ['enex']},
      ],

    }).then((result: any) => {
       // fileNames is an array that contains all the selected
      if (result.filePaths === undefined) {
        loggerInfo('No file selected');

        return;
    }
      const filePath = result.filePaths;
      store.set('enexSources', result.filePaths);
      mainWindow.webContents.send('enexSources', result.filePaths.join('\n'));
    }).catch((err: any) => {
      loggerInfo(err);
    });
 });

electron.ipcMain.on('selectOutputFolder', () => {
  electron.dialog.showOpenDialog(
    {
      properties: ['openDirectory'],
    }).then((result: any) => {
       // fileNames is an array that contains all the selected
      if (result.filePaths === undefined) {
        loggerInfo('No file selected');

        return;
    }
      const outputPath = result.filePaths[0];
      store.set('outputDir', outputPath);
      // tslint:disable-next-line:no-console
      console.log(`outputDir: ${outputPath}`);
      mainWindow.webContents.send('outputDirectorySelected', outputPath);
    }).catch((err: any) => {
      loggerInfo(err);
    });

});

electron.ipcMain.on('configurationUpdated', (event: any, data: any) => {

  // console.log("this is the firstname from the form ->", data)
  store.set(data.id, data.value);
  loggerInfo(`config: ${data.id}: ${JSON.stringify(store.get(data.id))}`);

});

electron.ipcMain.on('startConversion', async (event: any, data: any) => {
  const settings = mapSettingsToYarleOptions();
  await yarle.dropTheRope(settings);

});

electron.ipcMain.on('saveTemplate', async (event: any, data: any) => {
  store.set(data.id, data.value);
  // tslint:disable-next-line:no-console
  console.log(`Template : ${data.value}`);
});
