<script>
    //get screen size
    $: innerWidth = 0;
    $: innerHeight = 0;

    let logs = [
		{location: 'Working Dispenser', level: 'High', status: 'Active', floor:'1', timestamp:'[2012-12-20 12:00:00]', message: 'Dropped to Medium level'},
        {location: 'Working Dispenser', level: 'High', status: 'Active', floor:'1', timestamp:'[2012-12-20 12:00:00]', message: 'Dropped to Medium level'},
        {location: 'Working Dispenser', level: 'High', status: 'Active', floor:'1', timestamp:'[2012-12-20 12:00:00]', message: 'Dropped to Medium level'},
        {location: 'Working Dispenser', level: 'High', status: 'Active', floor:'1', timestamp:'[2012-12-20 12:00:00]', message: 'Dropped to Medium level'},
        {location: 'Working Dispenser', level: 'High', status: 'Active', floor:'1', timestamp:'[2012-12-20 12:00:00]', message: 'Dropped to Medium level'},
        {location: 'Working Dispenser', level: 'High', status: 'Active', floor:'1', timestamp:'[2012-12-20 12:00:00]', message: 'Dropped to Medium level'},
        {location: 'Working Dispenser', level: 'High', status: 'Active', floor:'1', timestamp:'[2012-12-20 12:00:00]', message: 'Dropped to Medium level'},
        {location: 'Working Dispenser', level: 'High', status: 'Active', floor:'1', timestamp:'[2012-12-20 12:00:00]', message: 'Dropped to Medium level'},
    ]

    //function for the output log in PC
    function PCLOG(log) {
        let source = log.timestamp + "    " + log.message;
        return source;
    }

</script>

<!--get screen size-->
<svelte:window bind:innerWidth bind:innerHeight />

<div class="flex justify-center text-center">
<div class="absolute mt-24">
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
</div>
</div>

<!--Back Button-->
<button onclick="history.back()" class="fixed bottom-0 right-0">
    <img src="../back.png" alt="" class={`max-w-[100px] shadow-4xl hover:animate-bouncex`}>
</button>