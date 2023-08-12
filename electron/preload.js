const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFiles: async () => {
    const selectedPath = await ipcRenderer.invoke("openFileExplorer");
    return selectedPath;
  },
});
