import { contextBridge } from "electron";
import * as moduleRunner from "./moduleRunner";

contextBridge.exposeInMainWorld("electron", {
  moduleRunner,
});
