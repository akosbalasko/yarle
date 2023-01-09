

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

const outputFormatSelect = document.getElementById('outputFormat')

outputFormatSelect.addEventListener('change', async (event) => {
  handleOutputFormatChange(event)
})

window.electronAPI.onLogSeqModeDeSelected((event, value) => {
  console.log('onLogSeqModeDeselected triggered')
  handleOutputFormatChange(event, window.electronAPI.outputFormat.ObsidianMD)
})

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
const handleOutputFormatChange = ((event, initValue) => {
    //const defaultConfig = window.electronAPI.readFileSync(`${window.electronAPI.currentDir}/../../config.json`, 'utf-8');
    const defaultConfig = window.electronAPI.getConfigByType('ObsidianMD')
    const defaultTemplate = window.electronAPI.getTemplateByType('ObsidianMD')
    //const defaultTemplate = window.electronAPI.readFileSync(`${window.electronAPI.currentDir}/../../sampleTemplate.tmpl`, 'utf-8');
  
    // save changed value to store
    const value = initValue || event.target.value
    if (value === window.electronAPI.outputFormat.LogSeqMD) {
      console.log('window.electronAPI.onLogSeqModeSelected')
  
      const logSeqConfig =  window.electronAPI.getConfigByType('LogSeqMD')
      const logSeqTemplate =  window.electronAPI.getTemplateByType('LogSeqMD')
      const flatConfig = flatten(JSON.parse(logSeqConfig));
      document.getElementById('currentTemplate').value = logSeqTemplate;
  
      updateDomByFlatConfig(flatConfig, true);
      document.getElementById('currentTemplate').disabled = true;
  
      document.getElementById('logseqSettings.journalNotes').removeAttribute('disabled');
    
      document.getElementById('logseqSettings.journalNotes.container').style.display = 'block';
    } else {
      console.log('window.electronAPI.onLogSeqModeDeSelected')
      //const logSeqConfig = window.electronAPI.readFileSync(`${window.electronAPI.currentDir}/../../config.logseq.json`, 'utf-8');
      //const logSeqTemplate = window.electronAPI.readFileSync(`${window.electronAPI.currentDir}/../../sampleTemplate_logseq.tmpl`, 'utf-8');
      const flatConfig = flatten(JSON.parse(defaultConfig));
      flatConfig.currentTemplate = defaultTemplate;
      
      updateDomByFlatConfig(flatConfig, false);
      document.getElementById('currentTemplate').removeAttribute('disabled');
  
      document.getElementById('resourcesDir').value = '_resources';
      document.getElementById('logseqSettings.journalNotes.container').style.display = 'none';
    
      window.electronAPI.store.set('resourcesDir', '_resources');
      window.electronAPI.store.set('currentTemplate', flatConfig.currentTemplate);
    }
})

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
      if (!disable)
      document.getElementById(configItem).removeAttribute('disabled')
      else document.getElementById(configItem).disabled = true;

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