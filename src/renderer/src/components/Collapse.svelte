<script lang="ts">
  import Colored from "./Colored.svelte";

  export let expanded = false;
</script>

<Colored bg={600} text={"white"} class="w-full rounded-xl mb-3">
  <h3 class="w-full">
    <Colored
      bg={700}
      class="p-3 flex flex-row justify-between w-full rounded-xl items-center"
    >
      <button
        class="size-full"
        aria-expanded={expanded}
        on:click={() => (expanded = !expanded)}><slot name="title" /></button
      >
      <div class="items-center flex flex-row">
        <slot name="titleRight" />
        <button
          aria-expanded={expanded}
          on:click={() => (expanded = !expanded)}
          class="pl-3">{expanded ? "▲" : "▼"}</button
        >
      </div>
    </Colored>
  </h3>

  <div class="contents" class:collapsed={!expanded}>
    <div class="p-3">
      <slot name="content" />
    </div>
  </div>
</Colored>

<style>
  .contents {
    display: block;
    overflow-y: auto;
    max-height: 1000px;
    transition: max-height 0.2s ease;
  }

  .collapsed {
    max-height: 0;
  }
</style>
