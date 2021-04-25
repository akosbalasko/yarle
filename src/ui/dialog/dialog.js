const { ipcMain, dialog, app } = require('electron')

ipcMain.on('show-open-dialog', (event, arg)=> {

  const options = {
      //title: 'Open a file or folder',
      //defaultPath: '/path/to/something/',
      //buttonLabel: 'Do it',
      /*filters: [
        { name: 'xml', extensions: ['xml'] }
      ],*/
      //properties: ['showHiddenFiles'],
      //message: 'This message will only be shown on macOS'
    };

    dialog.showOpenDialog(null, options, (filePaths) => {
      event.sender.send('open-dialog-paths-selected', filePaths)
    });
})

ipcMain.on('show-error-box', (event, arg) => {
  dialog.showErrorBox('Oops! Something went wrong!', 'Help us improve your experience by sending an error report')
});

ipcMain.on('show-message-box', (event, arg) => {
  const options = {
      type: 'question',
      buttons: ['Cancel', 'Yes, please', 'No, thanks'],
      defaultId: 2,
      title: 'Question',
      message: 'Do you want to do this?',
      detail: 'It does not really matter',
      checkboxLabel: 'Remember my answer',
      checkboxChecked: true,
    };

    dialog.showMessageBox(null, options, (response, checkboxChecked) => {
      event.sender.send('show-message-box-response', [response, checkboxChecked]);
    });
});

ipcMain.on('show-save-dialog', (event, arg) => {
  const options = {
    title: 'Save current page as a pdf',
    defaultPath: app.getPath('documents') + '/electron-tutorial-app.pdf',
  }
  dialog.showSaveDialog(null, options, (path) => {
    console.log(path);
  });
})
