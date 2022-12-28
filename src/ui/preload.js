const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),

  // we can also expose variables, not just functions
})

contextBridge.exposeInMainWorld('electronAPI', {

  openFile: async () => {
    console.log('ipcRendere invoking dialog:openFile')

    return ipcRenderer.invoke('dialog:openFile')
  },
  selectOutputFolder: async () => {
    return ipcRenderer.invoke('dialog:selectOutputFolder')
  }
})