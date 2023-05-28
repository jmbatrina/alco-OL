<script>
    //get screen size
    $: innerWidth = 0;
    $: innerHeight = 0;

</script>

<!--get screen size-->
<svelte:window bind:innerWidth bind:innerHeight />
<!--class={` ${innerWidth > 700 ? '' : ''} `}-->
<!--class={` ${innerWidth > 700 ? '' : ''} `}-->

<body>
<!--
<div class={`fixed z-0` }>
    {#if innerWidth < 700}
        <img src="../src/assets/main-bg.png" alt="" class={``}>
        <img src="../src/assets/main-bg.png" alt="" class={`absolute`}>
        <img src="../src/assets/main-bg.png" alt="" class={`absolute mt-[220px]`}>
        <img src="../src/assets/main-bg.png" alt="" class={`absolute mt-[440px]`}>
    {:else}
        <img src="../src/assets/main-bg.png" alt="" class={``}>
    {/if}

</div>-->
<!--background color - light cyan-->
<div class={`min-h-screen w-screen absolute text-center flex flex-wrap justify-center mt-20 ${innerWidth > 700 ? 'space-x-16' : ''}` }>

    <!--logo and title-->
    <div class={`mt-10 bg-white drop-shadow-lg rounded-2xl bg-opacity-80 ${innerWidth > 700 ? 'min-w-[50%] max-h-[500px]' : 'w-72 h-full py-8'}`}>
    <div class={`flex justify-center`}><div class={`max-h-[400px] w-[600px]`}>
        <img src="../logo.png" alt="" class=""></div></div>
    <div>
        <h1 class={`text-4xl font-bold text-gray-800`}>Alco-OL</h1>
        <h1 class={`text-xl font-bold text-gray-600`}>CS 145 System Series Project</h1>
        <h1 class={`text-s text-gray-600`}>details</h1>
    </div>
    </div>

    <!--members and handlers-->
    <div class={` h-full`}>
    <!--members-->
    <div class={`mt-10 bg-white drop-shadow-lg w-72 h-full rounded-2xl bg-opacity-80 py-8`}>
    <h1 class={`text-xl font-bold text-gray-800`}>Members:</h1>
    <div class={`text-gray-600`}>
        <h1>Adrian Joshua M. Reapor</h1>
        <h1>Carl David B. Ragunton</h1>
        <h1>Jack Vincent Nicolas</h1>
        <h1>Jan Paul M. Batrina</h1>
        <h1>Yenzy Urson S. Hebron</h1>
    </div>
    </div>
    <!--handlers-->
    <div class={`mt-10 bg-white drop-shadow-lg w-72 h-full rounded-2xl bg-opacity-80 py-8`}>
    <h1 class={`text-xl font-bold text-gray-800`}>CS 145 Handlers:</h1>
    <div class={`text-gray-600`}>
        <h1>Wilson M. Tan</h1>
        <h1>Alfonso Labao</h1>
    </div>
    </div>
    
    </div>


    
</div>
</body>
