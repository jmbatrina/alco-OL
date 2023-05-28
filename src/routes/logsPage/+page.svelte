<script>

    //get screen size
    $: innerWidth = 0;
    $: innerHeight = 0;

    //get current route; to be used for knowing which link is active
    import {globalID} from "../../components/global.js";

    let IDvalue;
    globalID.subscribe(value => {
		IDvalue = Number(value);
	});
    console.log(IDvalue);

    //function for the output log in PC
    function PCLOG(log) {
        let source = log.timestamp + "    " + log.message;
        return source;
    }

    import { app, db, getDispenserLogs } from '../../Firebase';
    
    // TODO: Get DispenserID when user clicks on dispenser status instead of hardcoding
    const dispenserID = IDvalue;
    console.log(dispenserID);
    let logs_promise = getDispenserLogs(app, db, dispenserID);

</script>

<!--get screen size-->
<svelte:window bind:innerWidth bind:innerHeight />

<div class="flex justify-center text-center">
<div class="absolute mt-24">
    {#await logs_promise then logs}
    <!--Title History Log-->
    <h1 class="text-4xl font-bold text-gray-800">{logs[0].location} History Log</h1>
    <div class="flex justify-center">
    <div class="absolute mt-5 bg-white rounded-2xl opacity-80 min-w-[90%] min-h-full">
        <!--Latest Log-->
        <h1 class="my-6 text-lg font-bold text-gray-800">Latest Log</h1>
        <div class="h-1 w-full bg-cyan-light"></div>
        <!--each Log-->
        {#each logs as log}
        <div class="my-6 text-lg font-bold text-gray-800">
            {#if innerWidth < 700}
                <h1 class>{log.timestamp}</h1>
                <h1 class>{log.message}</h1>
            {:else}
                <h1 class>{PCLOG(log)}</h1>
            {/if}
            
        </div>
        <div class="h-1 w-full bg-cyan-light"></div>
        {/each}
        <!--First Log-->
        <h1 class="my-6 text-lg font-bold text-gray-800">First Log</h1>
    </div>
    </div>
    {/await}
</div>
</div>


<!--Map Button-->
<a href="../logmapPage" class="fixed bottom-[90px] right-0">
    <img src="../map.png" alt="" class={`max-w-[100px] shadow-4xl hover:animate-bouncex`}>
</a>

<!--Back Button-->
<button onclick="history.back()" class="fixed bottom-0 right-0">
    <img src="../back.png" alt="" class={`max-w-[100px] shadow-4xl hover:animate-bouncex`}>
</button>
