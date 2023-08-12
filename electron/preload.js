const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFiles: async () => {
    const selectedPath = await ipcRenderer.invoke("open-file-explorer");
    return selectedPath;
  },
});


