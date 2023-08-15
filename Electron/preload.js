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
  mediaSort: async (folderPath) => {
    ipcRenderer.invoke("sortMedia", folderPath);
  },
});

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
});
