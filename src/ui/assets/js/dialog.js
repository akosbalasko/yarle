const { ipcRenderer } = require('electron')
const { readFileSync } = require('fs');
ipcRenderer.on('open-dialog-paths-selected', (event, arg)=> {
  dialog.handler.outputSelectedPathsFromOpenDialog(arg);
})

ipcRenderer.on('show-message-box-response', (event, args) => {
  dialog.handler.outputMessageboxResponse(args);
})

ipcRenderer.on('enexSources', (event, store) => {
  document.getElementById('enexSources').innerHTML = store;
});

ipcRenderer.on('outputDirectorySelected', (event, store) => {
  document.getElementById('outputDirectory').innerHTML = `Current output folder: ${store}`;
})

ipcRenderer.on('defaultTemplateLoaded', (event, store) => {
  console.log('defaultTemplateLoaded');
  document.getElementById('currentTemplate').value = store;
  });

ipcRenderer.on('logSeqModeSelected', (event, store) => {
  document.getElementById('keepOriginalAmountOfNewlines').checked = true;
  document.getElementById('keepOriginalAmountOfNewlines').disabled = true;
  document.getElementById('haveEnexLevelResources').checked = true
  document.getElementById('haveEnexLevelResources').disabled = true
  document.getElementById('urlEncodeFileNamesAndLinks').checked = true
  document.getElementById('urlEncodeFileNamesAndLinks').disabled = true
  document.getElementById('resourcesDir').value = 'assets';
  document.getElementById('resourcesDir').disabled = true
  document.getElementById('currentTemplate').value = store;


  });
ipcRenderer.on('logSeqModeDeselected', (event, store) => {
  document.getElementById('keepOriginalAmountOfNewlines').disabled = false;
  document.getElementById('haveEnexLevelResources').disabled = false
  document.getElementById('urlEncodeFileNamesAndLinks').disabled = false
  document.getElementById('resourcesDir').disabled = false
  document.getElementById('resourcesDir').value = '_resources';
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
