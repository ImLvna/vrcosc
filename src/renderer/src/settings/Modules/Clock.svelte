<script lang="ts">
  import { writable } from "svelte/store";
  import { ClientConfig } from "../../../../shared/moduleRunner";
  import Switch from "../../components/Switch.svelte";
  import moduleRunner from "../../lib/moduleRunner";

  let config = writable(moduleRunner.config);
</script>

<div
  class="bg-violet-700 p-3 flex flex-row justify-between w-full rounded-xl items-center mb-3"
>
  <label for="clockEnabled" class="text-white self-center">Clock</label>

  <Switch
    bind:value={$config[ClientConfig.timeEnabled]}
    on:change={() =>
      moduleRunner.updateParameter(
        ClientConfig.timeEnabled,
        $config[ClientConfig.timeEnabled]
      )}
  />
</div>
