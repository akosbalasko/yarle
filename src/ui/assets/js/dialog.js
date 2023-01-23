const { ipcRenderer } = require('electron')
const flatten = (data) => {
  const result= {};
  recurse = (cur, prop) => {
      if (Object(cur) !== cur) {
          result[prop] = cur;
      } else if (Array.isArray(cur)) {
          const l = cur.length;
          for (let i = 0; i < l; i++) {
               recurse(cur[i], prop ? `${prop}.${i}` : `${i}`);
          }
          if (l === 0) {
              result[prop] = [];
          }
      } else {
          var isEmpty = true;
          // tslint:disable-next-line:forin
          for (const p in cur) {
              isEmpty = false;
              recurse(cur[p], prop ? `${prop}.${p}` : p);
          }
          if (isEmpty) {
              result[prop] = {};
          }
      }
  };
  recurse(data, '');

  return result;
};

const updateConfigStore = (configItemName, value) => {
  ipcRenderer.send('configurationUpdated', {
    id: configItemName,
    value
  });
}
const updateDomByFlatConfig = (flatConfig, disable) => {
  for (const configItem in flatConfig){
    if (configItem !== 'outputFormat'){
      const domItem = document.getElementById(configItem);
      if (domItem){
        if (domItem.getAttribute('type') === 'checkbox'){
          document.getElementById(configItem).checked = flatConfig[configItem];
        } else {
          document.getElementById(configItem).value = flatConfig[configItem];
        }
      document.getElementById(configItem).disabled = disable;

      }
      updateConfigStore(configItem, flatConfig[configItem]);
      
    }
  }
}

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

ipcRenderer.on('logSeqModeSelected', (event, config, template) => {

  const flatConfig = flatten(JSON.parse(config));
  flatConfig.currentTemplate = template;
  updateDomByFlatConfig(flatConfig, true);
  document.getElementById('currentTemplate').disabled = false;
  document.getElementById('logseqSettings.journalNotes').disabled = false;

  document.getElementById('logseqSettings.journalNotes.container').style.display = 'block';

  });
ipcRenderer.on('logSeqModeDeselected', (event, config, template) => {

  const flatConfig = flatten(JSON.parse(config));
  updateDomByFlatConfig(flatConfig, false);
  document.getElementById('currentTemplate').value = template;

  document.getElementById('resourcesDir').value = '_resources';
  document.getElementById('logseqSettings.journalNotes.container').style.display = 'none';

  updateConfigStore('resourcesDir', '_resources');
  updateConfigStore('currentTemplate', template);
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
