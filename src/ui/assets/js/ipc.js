const {ipcRenderer} = require('electron')
const fs = require('fs');
const path = require('path');

const getAppDataPath = () => {
  switch (process.platform) {
    case "darwin": {
      return path.join(process.env.HOME, "Library", "Application Support", "yarle-evernote-to-md");
    }
    case "win32": {
      return path.join(process.env.APPDATA, "yarle-evernote-to-md");
    }
    case "linux": {
      return path.join(process.env.HOME, ".yarle-evernote-to-md");
    }
    default: {
      console.log("Unsupported platform!");
      process.exit(1);
    }
  }
}



function startLogWatcher() {
  const LOGFILE =  path.join(getAppDataPath(),'conversion.log');

  var chokidar = require("chokidar");
  console.log('watching: ' + LOGFILE);
  var watcher = chokidar.watch(LOGFILE, {
  ignored: /[\/\\]\./,
  persistent: true,
  usePolling: true
  });

  function onWatcherReady() {
    console.info('From here can you check for real changes, the initial scan has been completed.');

  }

  // Declare the listeners of the watcher
  watcher.on('change', function (path) {
    console.log(`${path} changed`);
    document.getElementById('logArea').innerHTML = fs.readFileSync(path, 'UTF-8')
  }).on('ready', onWatcherReady)

}

window.ipc = window.ipc || {},
function(n) {
    ipc.messaging = {

      sendOpenSecondWindowEvent: function() {
        ipcRenderer.send('open-second-window', 'an-argument')
      },

      sendCloseSecondWindowEvent: function() {
        ipcRenderer.send('close-second-window', 'an-argument')
      },

      sendConfigValueChangedEvent: function(e) {
        ipcRenderer.send('configurationUpdated',
        {
          id: e.target.id,
          value: e.target.type === 'text' ? e.target.value : e.target.checked
        });
      },

      sendSaveTemplateEvent: function(e) {
        ipcRenderer.send('saveTemplate',e);
        
      },
      init: function() {
        $('#open-secondwindow-button').click( function () {
          ipc.messaging.sendOpenSecondWindowEvent()
        })

        $('#close-me-button').click( function () {
          ipc.messaging.sendCloseSecondWindowEvent()
        })

        const inputs = document.querySelectorAll('input');
        for (const input of inputs) {
          input.addEventListener('input', ipc.messaging.sendConfigValueChangedEvent);
        }
      
        $('#startConversion').click(function () {
          startLogWatcher();
          ipcRenderer.send('startConversion');

        });

        $('#saveTemplate').click(function () {
          console.log('savetemplate');
          const parameters = { id:'currentTemplate', value: document.getElementById('currentTemplate').value};
          console.log(JSON.stringify(parameters));
          ipc.messaging.sendSaveTemplateEvent(parameters);
        })

      }
    };

    n(function() {
        ipc.messaging.init();
    })

    

}(jQuery);
