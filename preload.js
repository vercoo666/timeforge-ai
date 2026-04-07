const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld('api', {
  setTime: (filePath, newTime) =>
    ipcRenderer.invoke('set-time', filePath, newTime),

  getTime: (filePath) => {
    const stat = fs.statSync(filePath);
    return stat.mtime;
  }
});
