import { BrowserWindow, app } from "electron";
import { join } from "path";

export let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
    },
  });

  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
};

let configMod: typeof import("./config");

app.whenReady().then(async () => {
  createWindow();

  configMod = await import("./config");

  console.log("Starting...");
  await import("./coreController");
});

app.on("before-quit", () => {
  console.log("Saving...");
  configMod.save();
});
