<script lang="ts">
  import { writable } from "svelte/store";
  import { ClientConfig } from "../../../../shared/moduleRunner";
  import Colored from "../../components/Colored.svelte";
  import Switch from "../../components/Switch.svelte";
  import moduleRunner from "../../lib/moduleRunner";

  let config = writable(moduleRunner.config);
</script>

<Colored
  bg={700}
  text={"white"}
  class="p-3 flex flex-row justify-between w-full rounded-xl items-center mb-3"
>
  <label for="clockEnabled" class="self-center">Clock</label>

  <Switch
    bind:value={$config[ClientConfig.timeEnabled]}
    on:change={() =>
      moduleRunner.updateParameter(
        ClientConfig.timeEnabled,
        $config[ClientConfig.timeEnabled]
      )}
  />
</Colored>
