const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');



let mainWindow; // Define the mainWindow variable

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:5173/");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("open-file-explorer", async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'], // Show only directories
  });

  if (!result.canceled) {
    return result.filePaths[0];
  } else {
    return null;
  }
});
