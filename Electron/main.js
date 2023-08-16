const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

// Settings:
const url = "http://localhost:5173/";
const pythonVersion = "python3";
const purgeScriptPath = "Electron/picpurger.py";
const sortScriptPath = "Electron/picsort.py";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 900,
    minHeight: 900,
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
        purgeScriptPath,
        ...pythonArgs,
      ]);

      pythonProcess.stdout.on("data", (data) => {
        const output = data.toString();

        const progressMatch = output.match(/Progress: ([\d.]+)/);
        if (progressMatch) {
          const progressPercentage = parseFloat(progressMatch[1]);
          progressUpdates.push(progressPercentage);
          mainWindow.webContents.send("progressUpdate", progressPercentage);
        }
        if (output.includes("Duplicate_Found_Message")) {
          mainWindow.webContents.send("duplicateFound");
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

ipcMain.handle("sortMedia", async (event, folderPath) => {
  const pythonProcess = spawn(pythonVersion, [sortScriptPath, folderPath]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`Python stdout: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
  });
});
