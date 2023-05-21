<script>
    //get screen size
    $: innerWidth = 0;
    $: innerHeight = 0;

    let dispensers = [
		{location: 'Working Dispenser', level: 'High', status: 'Active', floor:'1'},
		{location: 'Room 105', level: 'Medium', status: 'Inactive', floor:'1'},
		{location: 'CR Left', level: 'Low', status: 'Active', floor:'1'},
        {location: 'Room 109', level: 'Medium', status: 'Active', floor:'1'},
		{location: 'Room 114', level: 'High', status: 'Active', floor:'1'},
		{location: 'CR Right', level: 'Low', status: 'Active', floor:'1'},
        {location: 'Back Entrance', level: 'High', status: 'Active', floor:'1'},
		{location: 'Room 120', level: 'Low', status: 'Inactive', floor:'1'},
		{location: 'Room 127', level: 'Low', status: 'Active', floor:'1'},
	];

    //function for getting the source of the image
    function IMAGESOURCE(dispenser) {
        let source = "../" + dispenser.status + "-" + dispenser.level + ".png";
        return source;
    }

    //function for getting the route to the specific dispenser log page
    function LOGNAME(dispenser) {
        let source = "/floor" + dispenser.floor + "/" + dispenser.location;
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
        {#each dispensers as dispenser}
        <li>
            <a href={LOGNAME(dispenser)}>
            <div class={`mt-10 hover:brightness-90 ${innerWidth > 700 ? 'mx-10' : ''} `}>
            <img src={IMAGESOURCE(dispenser)} alt="" class={`max-w-[350px] drop-shadow-xl ${innerWidth > 700 ? 'flex flex-wrap justify-center' : ''} `}>
            <p class="absolute -mt-[90px] mx-20 font-bold text-lg">{dispenser.location}</p>
            <p class="absolute -mt-[65px] mx-20">Level: {dispenser.level}</p>
            <p class="absolute -mt-[40px] mx-20">Status: {dispenser.status}</p>
            </div>
            </a>
        </li>
        {/each}
    </ul>

</div>
</body>