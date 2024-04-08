<script lang="ts">
  import { createEventDispatcher, getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import type { Config } from "../../../shared/config";

  export let disabled = false;
  export let value = false;

  export let colorOverride: string | undefined = undefined;

  const dispatch = createEventDispatcher();

  const toggle = () => {
    if (disabled) return;
    value = !value;
    dispatch("change", value);
  };

  const uiSettings =
    getContext<Writable<Config["modules"]["ui"]>>("uiSettings");
</script>

<div
  class="switch w-16 h-8 bg-white rounded-full block"
  on:click={toggle}
  on:keypress={toggle}
  role="switch"
  aria-checked={value}
  tabindex="0"
>
  <div
    class={`circle w-1/2 h-full rounded-full relative bg-${colorOverride ? colorOverride.toLowerCase() : $uiSettings.color.toLowerCase()}-${value ? 400 : 600}`}
    class:active={value}
  ></div>
</div>

<style>
  .circle {
    transition:
      background-color 0.2s ease,
      transform 0.2s ease;
  }

  .circle.active {
    transform: translateX(100%);
  }
</style>
