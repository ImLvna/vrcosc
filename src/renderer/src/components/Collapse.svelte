<script lang="ts">
  export let expanded = false;
</script>

<div class="w-full bg-violet-600 rounded-xl text-white mb-3">
  <h3 class="w-full">
    <div
      class="bg-violet-700 p-3 flex flex-row justify-between w-full rounded-xl items-center"
    >
      <button
        class="size-full"
        aria-expanded={expanded}
        on:click={() => (expanded = !expanded)}><slot name="title" /></button
      >
      <div class=" items-center flex flex-row">
        <slot name="titleRight" />
        <button
          aria-expanded={expanded}
          on:click={() => (expanded = !expanded)}
          class="pl-3">{expanded ? "▲" : "▼"}</button
        >
      </div>
    </div>
  </h3>

  <div class="contents" class:collapsed={!expanded}>
    <div class="p-3">
      <slot name="content" />
    </div>
  </div>
</div>

<style>
  .contents {
    display: block;
    overflow: hidden;
    max-height: 1000px;
    transition: max-height 0.3s ease;
  }

  .collapsed {
    max-height: 0;
  }
</style>
