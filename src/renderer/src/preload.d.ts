declare global {
  interface Window {
    electron: {
      moduleRunner: {
        onModuleRunnerEvent<T extends Events>(
          event: T,
          listener: moduleRunnerEvListener,
        );
        callModuleRunnerFunc<T extends keyof ModuleRunnerBase>(
          func: T,
          ...args: Parameters<ModuleRunnerBase[T]>
        ): Promise<ReturnType<ModuleRunnerBase[T]>>;
      };
    };
  }
}

export {};
