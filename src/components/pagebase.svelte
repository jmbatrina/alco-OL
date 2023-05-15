<script>
    //get screen size
    $: innerWidth = 0;
    $: innerHeight = 0;
</script>

<!--get screen size-->
<svelte:window bind:innerWidth bind:innerHeight />

<div class={`fixed z-0` }>
    {#if innerWidth < 1200}
        <img src="../src/assets/main-bg.png" alt="" class={``}>
        <img src="../src/assets/main-bg.png" alt="" class={`absolute`}>
        <img src="../src/assets/main-bg.png" alt="" class={`absolute mt-[220px]`}>
        <img src="../src/assets/main-bg.png" alt="" class={`absolute mt-[440px]`}>
    {:else}
        <img src="../src/assets/main-bg.png" alt="" class={``}>
    {/if}

</div>