  
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

