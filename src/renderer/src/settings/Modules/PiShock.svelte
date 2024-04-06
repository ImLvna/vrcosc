<script lang="ts">
  import { writable } from "svelte/store";
  import Collapse from "../../components/Collapse.svelte";

  let serverConfig = writable(
    window.electron.config.getConfigModule("pishock")
  );

  $: window.electron.config.setConfigModule("pishock", $serverConfig);
</script>

<Collapse>
  <div slot="title" class="flex flex-row justify-between w-full pr-5">
    <label for="a" class="text-white self-center">PiShock</label>
  </div>

  <div slot="content">
    {#if !$serverConfig}
      <div>Loading...</div>
    {:else}
      <div class="size-full">
        <div class="w-full flex flex-row justify-between">
          <label for="username">Username</label>
          <input
            class="bg-violet-800"
            type="text"
            id="username"
            bind:value={$serverConfig["username"]}
          />
        </div>
      </div>

      <div class="size-full">
        <div class="w-full flex flex-row justify-between">
          <label for="apiKey">Api Key</label>
          <input
            class="bg-violet-800"
            type="text"
            id="username"
            bind:value={$serverConfig["apiKey"]}
          />
        </div>
      </div>

      <div class="size-full">
        <div class="w-full flex flex-row justify-between">
          <label for="code">Share Code</label>
          <input
            class="bg-violet-800"
            type="text"
            id="code"
            bind:value={$serverConfig["code"]}
          />
        </div>
      </div>
    {/if}
  </div>
</Collapse>
