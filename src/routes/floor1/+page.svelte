<script>
    //get screen size
    $: innerWidth = 0;
    $: innerHeight = 0;

    import {globalID, dispensers} from "../../components/global.js";

    //function for getting the source of the image
    function IMAGESOURCE(dispenser) {
        let source = "../" + dispenser.status + "-" + dispenser.level + ".png";
        return source;
    }

</script>

<!--get screen size-->
<svelte:window bind:innerWidth bind:innerHeight />

<body>
<div class="min-h-screen w-screen absolute flex justify-center mt-20">

    <!--group for slot-->
    <ul class={`${innerWidth > 900 ? 'flex flex-wrap justify-center' : ''} `}>
        <!--each slot-->
        <!-- TODO: investigate why adding a key to the each block causes "Cannot have duplicate keys in a keyed each" error -->
        {#each $dispensers as dispenser}
        {#if dispenser.floor == 1}
        <li>
            <a href="/logsPage" data-sveltekit-preload-data="tap"  on:mousedown={()=>globalID.update(n => dispenser.id)}>
            <div class={`mt-10 hover:brightness-90 ${innerWidth > 700 ? 'mx-10' : ''} `}>
            <img src={IMAGESOURCE(dispenser)} alt="" class={`max-w-[350px] drop-shadow-xl ${innerWidth > 700 ? 'flex flex-wrap justify-center' : ''} `}>
            <p class="absolute -mt-[90px] mx-20 font-bold text-lg">{dispenser.location}</p>
            <p class="absolute -mt-[65px] mx-20">Level: {dispenser.level}</p>
            <p class="absolute -mt-[40px] mx-20">Status: {dispenser.status}</p>
            </div>
            </a>
        </li>
        {/if}
        {/each}
    </ul>

</div>
</body>
