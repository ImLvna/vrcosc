<script lang="ts">
  import { writable } from "svelte/store";
  import Main from "./Main.svelte";
  import Modules from "./Modules/Modules.svelte";
  import RightHand from "./RightHand.svelte";

  const panes = [Main, Modules];

  const pane = writable(panes[1].name);
</script>

<div
  class="root flex flex-row justify-between size-full max-h-full bg-violet-700"
>
  <div class="left size-full flex flex-col">
    <div class="container w-full h-14 pl-2 pt-2">
      <div
        class="header flex flex-row size-full align-left bg-violet-500 rounded-xl items-center"
      >
        {#each panes as item}
          <button
            class="tab flex items-center h-full rounded-xl ml-3"
            class:bg-violet-900={$pane !== item.name}
            class:bg-violet-600={$pane === item.name}
            on:click={() => pane.set(item.name)}
          >
            <div class="p-5">{item.name.replace(/Proxy<(.*)>/, "$1")}</div>
          </button>
        {/each}
      </div>
    </div>

    <div class="container size-full p-5 pr-0">
      <div class="content bg-violet-500 size-full rounded-xl p-10">
        <svelte:component this={panes.find((i) => i.name === $pane)} />
      </div>
    </div>
  </div>
  <div class="right size-full w-1/3 p-5">
    <div class="bg-violet-800 size-full rounded-xl">
      <RightHand />
    </div>
  </div>
</div>
