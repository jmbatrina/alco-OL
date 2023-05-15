<script>
    //get screen size
    $: innerWidth = 0;
    $: innerHeight = 0;

    let dispensers = [
		{location: 'Front Entrance', level: 'High', status: 'Active' },
		{location: 'Room 105', level: 'Medium', status: 'Inactive' },
		{location: 'CR Left', level: 'Low', status: 'Active' },
        {location: 'Room 109', level: 'Medium', status: 'Active' },
		{location: 'Room 114', level: 'High', status: 'Active' },
		{location: 'CR Right', level: 'Low', status: 'Active' },
        {location: 'Back Entrance', level: 'High', status: 'Active' },
		{location: 'Room 120', level: 'Low', status: 'Inactive' },
		{location: 'Room 127', level: 'Low', status: 'Active' },
	];

    function imagesource(dispenser) {
        let source = "../src/assets/" + dispenser.status + "-" + dispenser.level + ".png";
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
        {#each dispensers as dispenser}
        <li>
            <div class={`mt-10 hover:brightness-90 ${innerWidth > 700 ? 'mx-10' : ''} `}>
            <img src={imagesource(dispenser)} alt="" class={`max-w-[350px] drop-shadow-lg ${innerWidth > 700 ? 'flex flex-wrap justify-center' : ''} `}>
            <p class="absolute -mt-[90px] mx-16 font-bold text-lg">{dispenser.location}</p>
            <p class="absolute -mt-[65px] mx-16">Level: {dispenser.level}</p>
            <p class="absolute -mt-[40px] mx-16">Status: {dispenser.status}</p>
            </div>
        </li>
        {/each}
    </ul>

</div>
</body>