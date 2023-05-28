<script>
    //get screen size
    $: innerWidth = 0;
    $: innerHeight = 0;

    import {globalID} from "../../components/global.js";

    import { app, db, getDispenserUIData } from '../../Firebase';

    let dispensers_promise = getDispenserUIData(app, db);

    //function for getting the source of the image
    function IMAGESOURCE(dispenser) {
        let source = "../" + dispenser.status + "-" + dispenser.level + ".png";
        return source;
    }

</script>

<!--get screen size-->
<svelte:window bind:innerWidth bind:innerHeight />

<body>
<!--background color - light cyan-->
<div class="min-h-screen w-screen absolute flex justify-center mt-20">

    <!--each slot-->
    <ul class={`${innerWidth > 900 ? 'flex flex-wrap justify-center' : ''} `}>
        {#await dispensers_promise then dispensers}
        {#each dispensers as dispenser}
        {#if dispenser.floor == 2}
        <li>
            <a href="/logsPage" data-sveltekit-preload-data="tap" on:mousedown={()=>globalID.set(dispenser.id)}>
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
        {/await}
    </ul>

</div>
</body>