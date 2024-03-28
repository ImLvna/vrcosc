import { Events } from "../../shared/moduleRunner";

export type moduleRunnerEvListener = <T extends Events>(
  ...args: EventsData[T]["args"]
) => EventsData[T]["return"];

export type electonGlobal = {
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
