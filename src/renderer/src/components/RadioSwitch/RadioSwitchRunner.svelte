<script lang="ts">
  import { createEventDispatcher, setContext } from "svelte";
  import { writable } from "svelte/store";

  export let group: string;

  export let value: string;

  const writableValue = writable(value);

  setContext(`radioSwitch-${group}`, writableValue);

  const dispatch = createEventDispatcher();

  writableValue.subscribe((newValue) => {
    value = newValue;
    dispatch("change", newValue);
  });
</script>

<slot />
