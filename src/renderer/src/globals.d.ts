import type { IPCModuleRunner } from "./lib/moduleRunner";

declare global {
  interface Window {
    moduleRunner: IPCModuleRunner;
  }
}
