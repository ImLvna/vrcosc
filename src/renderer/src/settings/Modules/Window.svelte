<script lang="ts">
  import { writable } from "svelte/store";
  import { ClientConfig, Events } from "../../../../shared/moduleRunner";
  import Collapse from "../../components/Collapse.svelte";
  import Switch from "../../components/Switch.svelte";
  import moduleRunner from "../../lib/moduleRunner";

  let config = writable(moduleRunner.config);

  moduleRunner.on(
    Events.configUpdate,
    (p, v) => (($config[p] as number | boolean) = v)
  );
</script>

<Collapse>
  <div slot="title" class="flex flex-row justify-between w-full pr-5">
    <label for="windowEnabled" class="text-white self-center">Window</label>
  </div>
  <div slot="titleRight">
    <Switch
      bind:value={$config[ClientConfig.windowEnabled]}
      on:change={() =>
        moduleRunner.updateParameter(
          ClientConfig.windowEnabled,
          $config[ClientConfig.windowEnabled]
        )}
    />
  </div>

  <div slot="content">
    {#if !config}
      <div>Loading...</div>
    {:else}
      <div class="size-full">
        <div class="w-full flex flex-row justify-between">
          <label for="windowTitle">Window Title</label>
          <Switch
            bind:value={$config[ClientConfig.windowTitle]}
            on:change={() =>
              moduleRunner.updateParameter(
                ClientConfig.windowTitle,
                $config[ClientConfig.windowTitle]
              )}
          />
        </div>
      </div>
    {/if}
  </div>
</Collapse>
