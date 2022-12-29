
const selectEnexFilesDialogBtn = document.getElementById('selectEnexFilesDialogBtn')
const filePathElement = document.getElementById('filePath')

selectEnexFilesDialogBtn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
})

const selectOutputFolderDialogBtn = document.getElementById('selectOutputFolderDialogBtn')
const outputFolderElement = document.getElementById('outputFolder')

selectOutputFolderDialogBtn.addEventListener('click', async () => {
  const outputFolder = await window.electronAPI.selectOutputFolder()
  outputFolderElement.innerText = outputFolder
})
/*
const outputFormatSelect = document.getElementById('outputFormat')
outputFormatSelect.addEventListener('change', async (event) => {
  // save changed value to store
  console.log('value:'+ event.target.value)
  await window.electronAPI.store.set('outputFormat', event.target.value)
  const newStoredValue = window.electronAPI.store.get('outputFormat')
  console.log('store value: ' + JSON.stringify(newStoredValue))
})*/

const configItems = document.getElementsByClassName('configurationItem')
for(const configItem of configItems){
  configItem.addEventListener('change', async (event) => {
   // save changed value to store
   console.log('event:'+ JSON.stringify(event))
   let value = event.target.value
   if (isBooleanString(event.target.value))
    value = Boolean(value)
    await window.electronAPI.store.set(event.target.id,value)
   const newStoredValue = window.electronAPI.store.get(event.target.id)
   console.log('store value: ' + JSON.stringify(newStoredValue))
})

}

const startConversionBtn = document.getElementById('startConversion')
startConversionBtn.addEventListener('click', (event) => {
  window.electronAPI.startLogWatcher(document.getElementById('logArea'))
  window.electronAPI.startConversion()
})

const templateButton = document.getElementById('saveTemplate')
templateButton.addEventListener('click', () => {
  console.log('savetemplate');
  window.electronAPI.store.set('currentTemplate', document.getElementById('currentTemplate').value);

document.getElementById('logseqSettings.journalNotes.container').style.display = 'none';
})
function isBooleanString(value) {
  return value === 'true' || value === 'false'
}

window.electronAPI.onLogSeqModeSelected((event, config, template) => {

    console.log('window.electronAPI.onLogSeqModeSelected')
    const flatConfig = flatten(JSON.parse(config));
    flatConfig.currentTemplate = template;
    updateDomByFlatConfig(flatConfig, true);
    document.getElementById('currentTemplate').disabled = false;
    document.getElementById('logseqSettings.journalNotes').disabled = false;
  
    document.getElementById('logseqSettings.journalNotes.container').style.display = 'block';
  
})

window.electronAPI.onLogSeqModeDeSelected((event, config, template) => {
  console.log('window.electronAPI.onLogSeqModeDeSelected')

  const flatConfig = flatten(JSON.parse(config));
  updateDomByFlatConfig(flatConfig, false);
  document.getElementById('currentTemplate').value = template;

  document.getElementById('resourcesDir').value = '_resources';
  document.getElementById('logseqSettings.journalNotes.container').style.display = 'none';

  window.electronAPI.store.set('resourcesDir', '_resources');
  window.electronAPI.store.set('currentTemplate', template);
});


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
      window.electronAPI.store.set(configItem, flatConfig[configItem])
      
    }
  }
}

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