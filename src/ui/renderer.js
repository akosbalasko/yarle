
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


const selectConfigFileDialogBtn = document.getElementById('selectConfigFileDialogBtn')
const configFileElement = document.getElementById('configFilePath')

selectConfigFileDialogBtn.addEventListener('click', async (event) => {
  const configFile = await window.electronAPI.loadConfigFile()
  configFileElement.innerText = configFile

})

const outputFormatSelect = document.getElementById('outputFormat')

outputFormatSelect.addEventListener('change', async (event) => {
  handleOutputFormatChange(event)
})

window.electronAPI.onLogSeqModeDeSelected((event, value) => {
  console.log('onLogSeqModeDeselected triggered')
  handleOutputFormatChange(event, window.electronAPI.outputFormat.ObsidianMD)
})

window.electronAPI.onConfigLoaded(async (event, configFilePath, configObj) => {
  console.log('onConfigLoaded triggered')
  console.log(JSON.stringify(configObj))
  updateOutputFormat(configObj.outputFormat)
  const flatConfigObj = flatten(configObj)
  flatConfigObj.replacementCharacterMap = configObj.replacementCharacterMap
  flatConfigObj.globalReplacementSettings = configObj.globalReplacementSettings;
  flatConfigObj.encryptionPasswords = configObj.encryptionPasswords.join(',');
  updateDomByFlatConfig(flatConfigObj, false);
 
  window.electronAPI.store.set('configFilePath', configFilePath);
  // tslint:disable-next-line:no-console
  console.log(`configFilePath: ${configFilePath}`);
  return configFilePath;
})


const configItems = document.getElementsByClassName('configurationItem')
for(const configItem of configItems){
  configItem.addEventListener('change', async (event) => {
   // save changed value to store
   console.log('event:'+ JSON.stringify(event))
   let value = event.target.value
   if (isBooleanString(event.target.value))
    value = JSON.parse(value)
   if (isCharacterMap(event.target.value))
    value = JSON.stringify(value)
    await window.electronAPI.store.set(event.target.id,value)
   const newStoredValue = await window.electronAPI.store.get(event.target.id)
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
    switch (value){
      case window.electronAPI.outputFormat.LogSeqMD: 
        console.log('window.electronAPI.onLogSeqModeSelected')
        const logSeqConfig =  window.electronAPI.getConfigByType('LogSeqMD')
        const logSeqTemplate =  window.electronAPI.getTemplateByType('LogSeqMD')
        const flatLogseqConfig = flatten(JSON.parse(logSeqConfig));
        document.getElementById('currentTemplate').value = logSeqTemplate;
    
        updateDomByFlatConfig(flatLogseqConfig, true);
        document.getElementById('currentTemplate').disabled = true;
        // because of Tana
        document.getElementById('useHashTags').disabled = false;
        document.getElementById('generateNakedUrls').disabled = false;
        // end of Tana
        document.getElementById('logseqSettings.journalNotes').removeAttribute('disabled');
        document.getElementById('logseqSettings.journalNotes.container').style.display = 'block';
        break;
      case window.electronAPI.outputFormat.Tana:
          console.log('window.electronAPI.onTanaModeSelected')
          //const logSeqConfig = window.electronAPI.readFileSync(`${window.electronAPI.currentDir}/../../config.logseq.json`, 'utf-8');
          //const logSeqTemplate = window.electronAPI.readFileSync(`${window.electronAPI.currentDir}/../../sampleTemplate_logseq.tmpl`, 'utf-8');
          const flatTanaConfig = flatten(JSON.parse(defaultConfig));
          const tanaTemplate =  window.electronAPI.getTemplateByType('Tana Internal Format')

          flatTanaConfig.currentTemplate = tanaTemplate;
          
          updateDomByFlatConfig(flatTanaConfig, false);
          document.getElementById('currentTemplate').removeAttribute('disabled');
      
          document.getElementById('resourcesDir').value = '_resources';
          document.getElementById('logseqSettings.journalNotes.container').style.display = 'none';
        
          window.electronAPI.store.set('resourcesDir', '_resources');
          // because of Tana
          document.getElementById('useHashTags').value = false;
          window.electronAPI.store.set('useHashTags', false);
          document.getElementById('useHashTags').disabled = true;
          document.getElementById('generateNakedUrls').value = true;
          window.electronAPI.store.set('generateNakedUrls', true);

          document.getElementById('generateNakedUrls').disabled = true;
          // end tana
          window.electronAPI.store.set('currentTemplate', flatTanaConfig.currentTemplate);
          break;
      default:
        console.log('window.electronAPI.onLogSeqModeDeSelected')
        //const logSeqConfig = window.electronAPI.readFileSync(`${window.electronAPI.currentDir}/../../config.logseq.json`, 'utf-8');
        //const logSeqTemplate = window.electronAPI.readFileSync(`${window.electronAPI.currentDir}/../../sampleTemplate_logseq.tmpl`, 'utf-8');
        const flatConfig = flatten(JSON.parse(defaultConfig));
        flatConfig.currentTemplate = defaultTemplate;
        updateDomByFlatConfig(flatConfig, false);
        document.getElementById('currentTemplate').removeAttribute('disabled');
    
        document.getElementById('resourcesDir').value = '_resources';
        document.getElementById('logseqSettings.journalNotes.container').style.display = 'none';
        document.getElementById('useHashTags').disabled = false;
        document.getElementById('generateNakedUrls').disabled = false;
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

function isCharacterMap(value) {
  return typeof value === 'CharacterMap'
}
const updateOutputFormat = (outputFormat) => {
  updateDomAndConfig({name: 'outputFormat', value: outputFormat})
}
const updateDomByFlatConfig = (flatConfig, disable) => {
  for (const configItem in flatConfig){
    if (configItem !== 'outputFormat' && !configItem.startsWith('enexSources') && configItem!== 'outputDir'){
      updateDomAndConfig({name: configItem, value: flatConfig[configItem]})
    }
  }
}
const updateDomAndConfig = (configItem, disable) => {
  const domItem = document.getElementById(configItem.name);
  let itemValueToStore = configItem.value
  if (domItem){
    if (domItem.getAttribute('type') === 'checkbox'){
      document.getElementById(configItem.name).checked = configItem.value;
    } else {
      if (isObject(itemValueToStore)){
        itemValueToStore =  JSON.stringify(configItem.value)
        document.getElementById(configItem.name).value = JSON.stringify(configItem.value, undefined, 2);;
      }
      else {
        
      document.getElementById(configItem.name).value = configItem.value;
    }
  }
  if (!disable)
    document.getElementById(configItem.name).removeAttribute('disabled')
  else document.getElementById(configItem.name).disabled = true;

  }
  window.electronAPI.store.set(configItem.name, itemValueToStore)
  
}
const isObject = (value) => {  
  return Object.prototype.toString.call(value) === '[object Object]'
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