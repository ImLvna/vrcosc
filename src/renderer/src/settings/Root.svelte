<script lang="ts">
  import { writable } from "svelte/store";
  import Colored from "../components/Colored.svelte";
  import Main from "./Main.svelte";
  import Modules from "./Modules/Modules.svelte";
  import RightHand from "./RightHand.svelte";
  import Settings from "./Settings.svelte";

  const panes = [Main, Modules, Settings];

  const pane = writable(panes[1].name);
</script>

<Colored
  bg={700}
  class="root flex flex-row justify-between size-full max-h-full"
>
  <div class="left size-full flex flex-col">
    <div class="container w-full h-14 pl-2 pt-2">
      <Colored
        bg={500}
        class="header flex flex-row size-full align-left rounded-xl items-center"
      >
        {#each panes as item}
          {#if $pane === item.name}
            <Colored
              bg={600}
              text={"white"}
              class="tab flex items-center h-full rounded-xl ml-3"
            >
              <button class="size-full" on:click={() => pane.set(item.name)}>
                <div class="pl-5 pr-5">
                  {item.name.replace(/Proxy<(.*)>/, "$1")}
                </div>
              </button>
            </Colored>
          {:else}
            <Colored
              bg={900}
              text={{ value: 400, color: "gray" }}
              class="tab flex items-center h-full rounded-xl ml-3"
            >
              <button class="size-full" on:click={() => pane.set(item.name)}>
                <div class="pl-5 pr-5">
                  {item.name.replace(/Proxy<(.*)>/, "$1")}
                </div>
              </button>
            </Colored>
          {/if}
        {/each}
      </Colored>
    </div>

    <div class="container size-full p-5 pr-0 overflow-hidden">
      <Colored
        bg={500}
        class="content size-full rounded-xl p-10 max-h-full overflow-y-auto"
      >
        <svelte:component this={panes.find((i) => i.name === $pane)} />
      </Colored>
    </div>
  </div>
  <div class="right size-full w-1/3 p-5">
    <Colored bg={800} class="size-full rounded-xl">
      <RightHand />
    </Colored>
  </div>
</Colored>
