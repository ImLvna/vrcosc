import { BrowserWindow, Menu, Tray, app } from "electron";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("static/index.html");
};

let configMod: typeof import("./config");

app.whenReady().then(async () => {
  const tray = new Tray("resources/static/icon.png");
  const contextMenu = Menu.buildFromTemplate([
    { label: "Close", click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);

  configMod = await import("./config");

  console.log("Starting...");
  await import("./coreController");
});

app.on("before-quit", () => {
  console.log("Saving...");
  configMod.save();
});
