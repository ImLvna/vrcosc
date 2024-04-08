<script lang="ts">
  import { writable } from "svelte/store";
  import Collapse from "../../components/Collapse.svelte";
  import Colored from "../../components/Colored.svelte";

  let serverConfig = writable(
    window.electron.config.getConfigModule("pishock")
  );

  $: window.electron.config.setConfigModule("pishock", $serverConfig);
</script>

<Collapse>
  <div slot="title" class="flex flex-row justify-between w-full pr-5">
    <label for="a" class="self-center">PiShock</label>
  </div>

  <div slot="content">
    {#if !$serverConfig}
      <div>Loading...</div>
    {:else}
      <div class="size-full">
        <div class="w-full flex flex-row justify-between">
          <label for="username">Username</label>
          <Colored bg={800} class="rounded-xl">
            <input
              type="text"
              id="username"
              bind:value={$serverConfig["username"]}
            />
          </Colored>
        </div>
      </div>

      <div class="size-full">
        <div class="w-full flex flex-row justify-between">
          <label for="apiKey">Api Key</label>
          <Colored bg={800} class="rounded-xl">
            <input
              type="text"
              id="apiKey"
              bind:value={$serverConfig["apiKey"]}
            />
          </Colored>
        </div>
      </div>

      <div class="size-full">
        <div class="w-full flex flex-row justify-between">
          <label for="code">Share Code</label>
          <Colored bg={800} class="rounded-xl">
            <input type="text" id="code" bind:value={$serverConfig["code"]} />
          </Colored>
        </div>
      </div>
    {/if}
  </div>
</Collapse>

<style>
  input {
    background: inherit;
  }
</style>
