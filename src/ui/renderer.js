
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
