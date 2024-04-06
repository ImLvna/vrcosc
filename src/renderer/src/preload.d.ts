export type moduleRunnerEvListener = <T extends Events>(
  ...args: EventsData[T]["args"]
) => EventsData[T]["return"];

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

        getModuleRunnerConfig(): ClientConfigData;
      };

      config: {
        getConfigModule<T extends keyof Config["modules"]>(
          module: T,
        ): Config["modules"][T];

        setConfigModule<T extends keyof Config["modules"]>(
          module: T,
          data: Config["modules"][T],
        ): void;
      };

      other: {
        setSendToClient(send: boolean): void;
      };
    };
  }
}
