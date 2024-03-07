import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";

interface Config {
  listen: number;
  connect: string;
  verbose: boolean;
  debug: boolean;
  modules: {
    chatbox: {
      messages: string[];
      random: boolean;
      interval: number;
    };
    spotify: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
      refreshToken: string;
      lyrics: boolean;
      interval: number;
    };
    pishock: {
      username: string;
      apiKey: string;
      code: string;
    };
    xsOverlay: {
      enabled: boolean;
      port: number;
    };
  };
}

function findConfigPath() {
  console.log(join(cwd(), "config.json"));
  if (existsSync(join(cwd(), "config.json"))) {
    return join(cwd(), "config.json");
  }
  if (existsSync(join(cwd(), "../config.json"))) {
    return join(cwd(), "../config.json");
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
        messages: [],
        random: false,
        interval: 3000,
      },
      spotify: {
        clientId: "",
        clientSecret: "",
        redirectUri: "",
        refreshToken: "",
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
    },
  };
})() as Config;

export default config;

export function save() {
  const path = findConfigPath();
  return writeFileSync(path, JSON.stringify(config, null, 2));
}
