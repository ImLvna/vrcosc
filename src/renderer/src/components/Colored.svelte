<script lang="ts">
  import { getContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import type { Config } from "../../../shared/config";

  type ColorSpecify =
    | (number | { value: number | undefined; color: string } | string)
    | undefined;

  export let bg: ColorSpecify = undefined;
  export let text: ColorSpecify = undefined;
  export let border: ColorSpecify = undefined;

  export let overrideColorScheme: string | undefined = undefined;

  let hardcodedClass: string = "";
  export { hardcodedClass as class };

  const uiSettings =
    getContext<Writable<Config["modules"]["ui"]>>("uiSettings");

  const formatClass = (color: ColorSpecify, type: string) => {
    let className = `${type}-`;
    if (typeof color === "number") {
      className += `${overrideColorScheme || $uiSettings.color.toLowerCase()}-${color}`;
    } else if (typeof color === "object") {
      className += color.color.toLowerCase();

      if (color.value !== undefined) {
        className += `-${color.value}`;
      }
    } else if (typeof color === "string") {
      className += color.toLowerCase();
    }
    return className + " ";
  };

  const className = writable("");

  const updateClassName = () => {
    console.log(bg, text, border);
    let newClassName = "";
    if (bg) newClassName += formatClass(bg, "bg");
    if (text) newClassName += formatClass(text, "text");
    if (border) newClassName += formatClass(border, "border");

    className.set(newClassName);
  };

  uiSettings.subscribe(updateClassName);
</script>

<div class={$className + hardcodedClass}>
  <slot />
</div>
