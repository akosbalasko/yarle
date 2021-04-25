const { ipcRenderer } = require('electron')

ipcRenderer.on('open-dialog-paths-selected', (event, arg)=> {
  dialog.handler.outputSelectedPathsFromOpenDialog(arg);
})

ipcRenderer.on('show-message-box-response', (event, args) => {
  dialog.handler.outputMessageboxResponse(args);
})

ipcRenderer.on('enexSource', (event, store) => {
  document.getElementById('enexSource').innerHTML = `Current File: ${store}`;
});

ipcRenderer.on('outputDirectorySelected', (event, store) => {
  document.getElementById('outputDirectory').innerHTML = `Current output folder: ${store}`;
})

ipcRenderer.on('defaultTemplateLoaded', (event, store) => {
  document.getElementById('currentTemplate').value = store;
  });

window.dialog = window.dialog || {},
function(n) {

    dialog.handler = {

      showOpenDialog: function() {
        console.log('dialog showed')
        ipcRenderer.send('show-open-dialog');
      },

      outputSelectedPathsFromOpenDialog: function(paths) {
        alert('user selected: ' + paths);
      },

      outputMessageboxResponse: function(args) {
        alert('user selected button index: ' + args[0] + '. Should remember answer value is: ' + args[1]);
      },

      showErrorBox: function() {
        ipcRenderer.send('show-error-box');
      },

      showMessageBox: function() {
        ipcRenderer.send('show-message-box');
      },

      showSaveDialog: function() {
        ipcRenderer.send('show-save-dialog');
      },

      init: function() {
        $('#showOpendialog').click( function () {
          dialog.handler.showOpenDialog();
        })
        $('#selectEnexFile').click( function () {
          ipcRenderer.send('openEnexSource');
        })
	
        $('#selectOutputFolder').click( function () {
          ipcRenderer.send('selectOutputFolder');
        });

        $('#showErrorBox').click( function () {
          dialog.handler.showErrorBox();
        })

        $('#showMessageBox').click( function() {
          dialog.handler.showMessageBox();
        })

        $('#showSaveDialog').click( function() {
          dialog.handler.showSaveDialog();
        })
      }
    };

    n(function() {
        dialog.handler.init();
    })
}(jQuery);
