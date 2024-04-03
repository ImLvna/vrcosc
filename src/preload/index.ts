import { contextBridge } from "electron";
import * as config from "./config";
import * as moduleRunner from "./moduleRunner";
import * as other from "./other";

contextBridge.exposeInMainWorld("electron", {
  moduleRunner,
  config,
  other,
});
