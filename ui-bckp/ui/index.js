"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = __importStar(require("fs"));
const url = require("url");
const path = require("path");
const store_1 = require("./store");
const yarle = __importStar(require("./../yarle"));
const settingsMapper_1 = require("./settingsMapper");
const logger_1 = require("./../utils/logger");
let mainWindow;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1296,
        height: 768,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, `../../src/ui/index.html`),
        protocol: "file:",
        slashes: true
    }));
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    mainWindow.webContents.on('did-finish-load', () => {
        const defaultTemplate = fs.readFileSync(`${__dirname}/../../sampleTemplate.tmpl`, 'utf-8');
        mainWindow.webContents.send('defaultTemplateLoaded', defaultTemplate);
        mainWindow.webContents.send('storedSettingsLoaded', store_1.store.store);
        mainWindow.show();
    });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
    app.quit();
});
app.on('activate', function () {
    if (mainWindow === null)
        createWindow();
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.on('openEnexSource', () => {
    var { dialog } = require('electron');
    dialog.showOpenDialog({
        properties: ['openFile'],
    }).then((result) => {
        logger_1.logger.info(result.canceled);
        logger_1.logger.info(result.filePaths);
        // fileNames is an array that contains all the selected
        if (result.filePaths === undefined) {
            logger_1.logger.info("No file selected");
            return;
        }
        const filePath = result.filePaths[0];
        logger_1.logger.info('path: ' + filePath);
        store_1.store.set('enexSource', filePath);
        //const currentEnexFiles = fs.readdirSync(filePath).filter(fileName => fileName.match(/enex$/g)).join('\n');
        logger_1.logger.info('enex files: ' + filePath);
        mainWindow.webContents.send('currentEnexFiles', filePath);
        mainWindow.webContents.send('enexSource', filePath);
    }).catch((err) => {
        logger_1.logger.info(err);
    });
});
ipcMain.on('selectOutputFolder', () => {
    var { dialog } = require('electron');
    dialog.showOpenDialog({
        properties: ['openDirectory'],
    }).then((result) => {
        logger_1.logger.info(result.canceled);
        logger_1.logger.info(result.filePaths);
        // fileNames is an array that contains all the selected
        if (result.filePaths === undefined) {
            logger_1.logger.info("No file selected");
            return;
        }
        const outputPath = result.filePaths[0];
        store_1.store.set('outputDir', outputPath);
        mainWindow.webContents.send('outputDirectorySelected', outputPath);
    }).catch((err) => {
        logger_1.logger.info(err);
    });
});
ipcMain.on('configurationUpdated', (event, data) => {
    logger_1.logger.info("this is the firstname from the form ->", data);
    store_1.store.set(data.id, data.value);
    logger_1.logger.info(store_1.store.get(data.id));
});
ipcMain.on('startConversion', async (event, data) => {
    const settings = settingsMapper_1.mapSettingsToYarleOptions();
    await yarle.dropTheRope(settings);
});
//# sourceMappingURL=index.js.map