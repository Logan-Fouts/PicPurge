const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");

const url = "http://localhost:5173/";

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

  mainWindow.loadURL(url);
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

ipcMain.handle("openFileExplorer", async (event) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (!result.canceled) {
    return result.filePaths[0];
  } else {
    return null;
  }
});
