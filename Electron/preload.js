const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openFiles: async () => {
    const selectedPath = await ipcRenderer.invoke("openFileExplorer");
    return selectedPath;
  },
  process: async (folderPath, aggressiveness, removeNonMedia) => {
    const progressUpdates = await ipcRenderer.invoke(
      "runScript",
      folderPath,
      aggressiveness,
      removeNonMedia
    );
  },
  receive: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
});