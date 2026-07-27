
const isElectron = typeof window.electronAPI !== 'undefined';
const selectEnexFilesDialogBtn = document.getElementById('selectEnexFilesDialogBtn');
const filePathElement = document.getElementById('filePath');
const selectOutputFolderDialogBtn = document.getElementById('selectOutputFolderDialogBtn');
const outputFolderElement = document.getElementById('outputFolder');
const selectConfigFileDialogBtn = document.getElementById('selectConfigFileDialogBtn');
const configFileElement = document.getElementById('configFilePath');
const outputFormatSelect = document.getElementById('outputFormat');
const startConversionBtn = document.getElementById('startConversion');

let selectedEnexHandles = [];
let selectedOutputDirectoryHandle = null;
let selectedConfigFileHandle = null;

const isFsAccessSupported = () => typeof window.showOpenFilePicker === 'function' && typeof window.showDirectoryPicker === 'function';

const getFileNameList = handles => handles.map(handle => handle.name).join('\n');

const openEnexFiles = async () => {
  if (isElectron) {
    const filePath = await window.electronAPI.openFile();
    filePathElement.innerText = filePath;
    return;
  }
  if (!isFsAccessSupported()) {
    alert('File System Access API is not available in this browser.');
    return;
  }

  selectedEnexHandles = await window.showOpenFilePicker({
    multiple: true,
    types: [{
      description: 'Evernote export files',
      accept: {'application/xml': ['.enex', '.xml']},
    }],
  });
  filePathElement.innerText = getFileNameList(selectedEnexHandles);
};

const openOutputFolder = async () => {
  if (isElectron) {
    const outputFolder = await window.electronAPI.selectOutputFolder();
    outputFolderElement.innerText = outputFolder;
    return;
  }
  if (!isFsAccessSupported()) {
    alert('File System Access API is not available in this browser.');
    return;
  }

  selectedOutputDirectoryHandle = await window.showDirectoryPicker();
  outputFolderElement.innerText = selectedOutputDirectoryHandle.name;
};

const openConfigFile = async () => {
  if (isElectron) {
    const configFile = await window.electronAPI.loadConfigFile();
    configFileElement.innerText = configFile;
    return;
  }
  if (!isFsAccessSupported()) {
    alert('File System Access API is not available in this browser.');
    return;
  }

  const handles = await window.showOpenFilePicker({
    multiple: false,
    types: [{
      description: 'Yarle config file',
      accept: {'application/json': ['.json', '.config']},
    }],
  });
  if (handles.length === 0) {
    return;
  }
  selectedConfigFileHandle = handles[0];
  const file = await selectedConfigFileHandle.getFile();
  const text = await file.text();
  configFileElement.innerText = selectedConfigFileHandle.name;

  try {
    const configObj = JSON.parse(text);
    updateOutputFormat(configObj.outputFormat);
    const flatConfigObj = flatten(configObj);
    flatConfigObj.replacementCharacterMap = configObj.replacementCharacterMap;
    flatConfigObj.globalReplacementSettings = configObj.globalReplacementSettings;
    flatConfigObj.encryptionPasswords = configObj.encryptionPasswords?.join(',');
    updateDomByFlatConfig(flatConfigObj, false);
  } catch (error) {
    console.error('Unable to parse config file', error);
    alert('Selected config file is not valid JSON.');
  }
};

selectEnexFilesDialogBtn.addEventListener('click', openEnexFiles);
selectOutputFolderDialogBtn.addEventListener('click', openOutputFolder);
selectConfigFileDialogBtn.addEventListener('click', openConfigFile);
outputFormatSelect.addEventListener('change', async event => {
  handleOutputFormatChange(event);
});

if (isElectron) {
  window.electronAPI.onLogSeqModeDeSelected((event, value) => {
    console.log('onLogSeqModeDeselected triggered');
    handleOutputFormatChange(event, window.electronAPI.outputFormat.ObsidianMD);
  });

  window.electronAPI.onConfigLoaded(async (event, configFilePath, configObj) => {
    console.log('onConfigLoaded triggered');
    updateOutputFormat(configObj.outputFormat);
    const flatConfigObj = flatten(configObj);
    flatConfigObj.replacementCharacterMap = configObj.replacementCharacterMap;
    flatConfigObj.globalReplacementSettings = configObj.globalReplacementSettings;
    flatConfigObj.encryptionPasswords = configObj.encryptionPasswords.join(',');
    updateDomByFlatConfig(flatConfigObj, false);
    window.electronAPI.store.set('configFilePath', configFilePath);
    console.log(`configFilePath: ${configFilePath}`);
    return configFilePath;
  });
}

const configItems = document.getElementsByClassName('configurationItem');
for (const configItem of configItems) {
  configItem.addEventListener('change', async event => {
    console.log('event:', event);
    let value = event.target.value;
    if (isBooleanString(event.target.value)) value = JSON.parse(value);
    if (isCharacterMap(event.target.value)) value = JSON.stringify(value);

    if (isElectron) {
      await window.electronAPI.store.set(event.target.id, value);
      const newStoredValue = await window.electronAPI.store.get(event.target.id);
      console.log('store value:', newStoredValue);
    } else {
      localStorage.setItem(event.target.id, JSON.stringify(value));
    }
  });
}

const handleOutputFormatChange = ((event, initValue) => {
  const defaultConfig = isElectron
    ? window.electronAPI.getConfigByType('ObsidianMD')
    : localStorage.getItem('defaultConfig') || '{}';
  const defaultTemplate = isElectron
    ? window.electronAPI.getTemplateByType('ObsidianMD')
    : localStorage.getItem('defaultTemplate') || '';

  const value = initValue || event.target.value;
  switch (value) {
    case isElectron ? window.electronAPI.outputFormat.LogSeqMD : 'LogSeqMD':
      console.log('onLogSeqModeSelected');
      if (isElectron) {
        const logSeqConfig = window.electronAPI.getConfigByType('LogSeqMD');
        const logSeqTemplate = window.electronAPI.getTemplateByType('LogSeqMD');
        const flatLogseqConfig = flatten(JSON.parse(logSeqConfig));
        document.getElementById('currentTemplate').value = logSeqTemplate;
        updateDomByFlatConfig(flatLogseqConfig, true);
      }
      document.getElementById('currentTemplate').disabled = true;
      document.getElementById('useHashTags').disabled = false;
      document.getElementById('generateNakedUrls').disabled = false;
      document.getElementById('logseqSettings.journalNotes').removeAttribute('disabled');
      document.getElementById('logseqSettings.journalNotes.container').style.display = 'block';
      break;
    case isElectron ? window.electronAPI.outputFormat.Tana : 'Tana Internal Format':
      console.log('onTanaModeSelected');
      if (isElectron) {
        const flatTanaConfig = flatten(JSON.parse(defaultConfig));
        const tanaTemplate = window.electronAPI.getTemplateByType('Tana Internal Format');
        flatTanaConfig.currentTemplate = tanaTemplate;
        updateDomByFlatConfig(flatTanaConfig, false);
      }
      document.getElementById('currentTemplate').removeAttribute('disabled');
      document.getElementById('resourcesDir').value = '_resources';
      document.getElementById('logseqSettings.journalNotes.container').style.display = 'none';
      if (isElectron) {
        window.electronAPI.store.set('resourcesDir', '_resources');
        document.getElementById('useHashTags').value = false;
        window.electronAPI.store.set('useHashTags', false);
        document.getElementById('useHashTags').disabled = true;
        document.getElementById('generateNakedUrls').value = true;
        window.electronAPI.store.set('generateNakedUrls', true);
      }
      document.getElementById('generateNakedUrls').disabled = true;
      break;
    default:
      console.log('onDefaultModeSelected');
      if (isElectron) {
        const flatConfig = flatten(JSON.parse(defaultConfig));
        document.getElementById('currentTemplate').value = defaultTemplate;
        flatConfig.currentTemplate = defaultTemplate;
        updateDomByFlatConfig(flatConfig, false);
      }
      document.getElementById('currentTemplate').removeAttribute('disabled');
      document.getElementById('resourcesDir').value = '_resources';
      document.getElementById('logseqSettings.journalNotes.container').style.display = 'none';
      document.getElementById('useHashTags').disabled = false;
      document.getElementById('generateNakedUrls').disabled = false;
      if (isElectron) {
        window.electronAPI.store.set('resourcesDir', '_resources');
        window.electronAPI.store.set('currentTemplate', document.getElementById('currentTemplate').value);
      }
  }
});

const updateOutputFormat = outputFormat => {
  updateDomAndConfig({name: 'outputFormat', value: outputFormat});
};

const updateDomByFlatConfig = (flatConfig, disable) => {
  for (const configItem in flatConfig) {
    if (configItem !== 'outputFormat' && !configItem.startsWith('enexSources') && configItem !== 'outputDir') {
      updateDomAndConfig({name: configItem, value: flatConfig[configItem]}, disable);
    }
  }
};

const updateDomAndConfig = (configItem, disable) => {
  const domItem = document.getElementById(configItem.name);
  let itemValueToStore = configItem.value;
  if (domItem) {
    if (domItem.getAttribute('type') === 'checkbox') {
      domItem.checked = configItem.value;
    } else {
      if (isObject(itemValueToStore) || Array.isArray(itemValueToStore)) {
        itemValueToStore = JSON.stringify(configItem.value);
        domItem.value = JSON.stringify(configItem.value, undefined, 2);
      } else {
        domItem.value = configItem.value;
      }
    }
    if (!disable) domItem.removeAttribute('disabled'); else domItem.disabled = true;
  }

  if (isElectron) {
    window.electronAPI.store.set(configItem.name, itemValueToStore);
  } else {
    localStorage.setItem(configItem.name, JSON.stringify(itemValueToStore));
  }
};

const isObject = value => Object.prototype.toString.call(value) === '[object Object]';

const flatten = data => {
  const result = {};
  const recurse = (cur, prop) => {
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
      let isEmpty = true;
      for (const p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? `${prop}.${p}` : p);
      }
      if (isEmpty) {
        result[prop] = {};
      }
    }
  };
  recurse(data, '');
  return result;
};

const isBooleanString = value => value === 'true' || value === 'false';

const isCharacterMap = value => typeof value === 'CharacterMap';

const startConversion = async () => {
  if (isElectron) {
    window.electronAPI.startLogWatcher(document.getElementById('logArea'));
    window.electronAPI.startConversion();
    return;
  }

  if (!selectedOutputDirectoryHandle || selectedEnexHandles.length === 0) {
    alert('Please select ENEX files and an output folder before converting.');
    return;
  }

  alert('Browser-based conversion is not yet fully implemented in this preview.');
};

startConversionBtn.addEventListener('click', startConversion);
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
      if (isObject(itemValueToStore) || Array.isArray(itemValueToStore)){
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