<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import type { Config } from "../../../shared/config";
  import Collapse from "../components/Collapse.svelte";
  import Colored from "../components/Colored.svelte";
  import RadioSwitch from "../components/RadioSwitch/RadioSwitch.svelte";
  import RadioSwitchRunner from "../components/RadioSwitch/RadioSwitchRunner.svelte";

  enum ColorSchemes {
    Slate = "Slate",
    Gray = "Gray",
    Zinc = "Zinc",
    Neutral = "Neutral",
    Stone = "Stone",
    Red = "Red",
    Orange = "Orange",
    Amber = "Amber",
    Yellow = "Yellow",
    Lime = "Lime",
    Green = "Green",
    Emerald = "Emerald",
    Teal = "Teal",
    Cyan = "Cyan",
    Sky = "Sky",
    Blue = "Blue",
    Indigo = "Indigo",
    Violet = "Violet",
    Purple = "Purple",
    Fuchsia = "Fuchsia",
    Pink = "Pink",
    Rose = "Rose",
  }

  const uiSettings =
    getContext<Writable<Config["modules"]["ui"]>>("uiSettings");
</script>

<Collapse>
  <div slot="title" class="flex flex-row justify-between w-full pr-5">
    <label for="colorScheme" class="self-center">Color Scheme</label>
  </div>

  <div slot="content">
    <div class="size-full">
      <div class="w-full flex flex-col">
        <label for="colorScheme">Pick a color scheme!</label>
        <div class="flex flex-col">
          <RadioSwitchRunner
            group={"colorScheme"}
            bind:value={$uiSettings.color}
          >
            {#each Object.keys(ColorSchemes) as color}
              <Colored
                bg={500}
                text={"white"}
                overrideColorScheme={ColorSchemes[color].toLowerCase()}
                class="rounded-xl p-5 m-1 flex flex-row justify-between w-full items-center"
              >
                <label for={ColorSchemes[color]}>{ColorSchemes[color]}</label>
                <RadioSwitch
                  colorOverride={ColorSchemes[color]}
                  group={"colorScheme"}
                  data={ColorSchemes[color]}
                />
              </Colored>
            {/each}
          </RadioSwitchRunner>
        </div>
      </div>
    </div>
  </div></Collapse
>
