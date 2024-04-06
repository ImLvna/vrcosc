<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let disabled = false;
  export let value = false;

  const dispatch = createEventDispatcher();

  const toggle = () => {
    if (disabled) return;
    value = !value;
    dispatch("change", value);
  };
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
    class="circle w-1/2 h-full rounded-full relative"
    class:active={value}
    class:bg-violet-400={value}
    class:bg-violet-900={!value}
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
