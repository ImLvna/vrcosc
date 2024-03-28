import { join } from "path";
import { BrowserWindow, Menu, Tray, app } from "electron";

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
  const tray = new Tray(
    join(
      !app.isPackaged && process.env.ELECTRON_RENDERER_URL
        ? ""
        : join(process.resourcesPath, "app.asar.unpacked"),
      "resources/static/icon.png",
    ),
  );

  const contextMenu = Menu.buildFromTemplate([
    { label: "Close", click: () => app.quit() },
  ]);
  tray.on("click", () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });
  tray.setContextMenu(contextMenu);

  configMod = await import("./config");

  console.log("Starting...");
  await import("./coreController");
});

app.on("before-quit", () => {
  console.log("Saving...");
  configMod.save();
});
