import { app, ipcMain } from "electron";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import { cwd } from "process";
import { IPCMessage } from "../shared/ipc";
import { Config } from "./../shared/config";

function isDev() {
  return process.argv[0].includes("electron");
}

function findConfigPath() {
  if (!isDev()) {
    if (!existsSync(app.getPath("userData"))) {
      mkdirSync(app.getPath("userData"));
    }

    if (existsSync(join(cwd(), "config.json"))) {
      console.log("Moving config file to userData");
      renameSync(
        join(cwd(), "config.json"),
        join(app.getPath("userData"), "config.json")
      );
    }
    return join(app.getPath("userData"), "config.json");
  }
  if (existsSync(join(cwd(), "config.json"))) {
    return join(cwd(), "config.json");
  }
  if (existsSync(join(cwd(), "../config.json"))) {
    return join(cwd(), "../config.json");
  }
  if (existsSync(join(cwd(), "../../config.json"))) {
    return join(cwd(), "../../config.json");
  }
  return join(cwd(), "config.json");
}

const config = (() => {
  const path = findConfigPath();
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, "utf8"));
  }
  console.error("No config file found, using defaults");
  return {
    listen: 9001,
    connect: "localhost:9000",
    verbose: false,
    debug: false,
    modules: {
      chatbox: {
        sets: [],
        random: false,
        interval: 3000,
      },
      spotify: {
        api: {
          clientId: "",
          clientSecret: "",
          redirectUri: "",
          refreshToken: "",
        },
        alternativeApi: "",
        lyrics: true,
        interval: 3000,
      },
      pishock: {
        username: "",
        apiKey: "",
        code: "",
      },
      xsOverlay: {
        enabled: false,
        port: 42070,
      },
      ui: {
        color: "Teal",
      },
    },
  };
})() as Config;

export default config;

export function save() {
  console.log("Saving config");
  const path = findConfigPath();
  return writeFileSync(path, JSON.stringify(config, null, 2));
}

ipcMain.on(IPCMessage.getModuleConfig, (event, module) => {
  event.returnValue = config.modules[module];
});

ipcMain.on(IPCMessage.setModuleConfig, (event, module, data) => {
  config.modules[module as any] = data;
  save();
  event.returnValue = true;
});
