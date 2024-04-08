<script lang="ts">
  import { getContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import Switch from "../Switch.svelte";

  export let group: string;

  export let data: string;

  export let colorOverride: string | undefined = undefined;

  const groupValue = getContext<Writable<string>>(`radioSwitch-${group}`);

  const value = writable($groupValue === data);

  $: if ($groupValue === data) {
    value.set(true);
  } else {
    value.set(false);
  }
</script>

<Switch
  {colorOverride}
  value={$value}
  on:change={(newVal) => {
    if (newVal) {
      groupValue.set(data);
    }
    value.set(true);
  }}
/>
