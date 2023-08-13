const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

// Settings:
const url = "http://localhost:5173/";
const pythonVersion = "python3";
const scriptPath = "Electron/picpurger.py";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
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

ipcMain.handle(
  "runScript",
  async (event, folderPath, aggressiveness, removeNonMedia) => {
    let pythonArgs = null;
    if (!removeNonMedia) {
      pythonArgs = [
        String(folderPath),
        Number(aggressiveness),
        "--keep_non_media",
      ];
    } else {
      pythonArgs = [String(folderPath), Number(aggressiveness)];
    }

    const progressUpdates = [];

    try {
      const pythonProcess = spawn(pythonVersion, [
        "-u",
        scriptPath,
        ...pythonArgs,
      ]);

      pythonProcess.stdout.on("data", (data) => {
        const output = data.toString();

        const progressMatch = output.match(/Progress: ([\d.]+)/);
        if (progressMatch) {
          const progressPercentage = parseFloat(progressMatch[1]);
          progressUpdates.push(progressPercentage);
          // Send progress updates to the renderer process
          mainWindow.webContents.send("progressUpdate", progressPercentage);
        }
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Python stderr: ${data}`);
      });

      pythonProcess.on("close", (code) => {
        mainWindow.webContents.send("progressUpdate", 100); // Assuming 100% progress
      });
    } catch (error) {
      console.error(error);
    }
  }
);
