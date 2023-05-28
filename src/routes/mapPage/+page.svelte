<script>
    import Map1 from "../../components/map1.svelte";
    import Map2 from "../../components/map2.svelte";
    let isfloor1 = 1;
    let isfloor2 = 0;

    function GOFLOOR1(){
        isfloor1 = 1;
        isfloor2 = 0;
        console.log("aaaaaaaaa");
    }

    function GOFLOOR2(){
        isfloor1 = 0;
        isfloor2 = 1;
    }

</script>

<div>
    

    <div class={`z-0 ${isfloor1 === 1 ? 'visible' : 'invisible'}`}>
    <Map1>
    </Map1>
    </div>

    <div class={`z-0 ${isfloor2 === 1 ? 'visible' : 'invisible'}`}>
    <Map2>
    </Map2>
    </div>

    <div class="flex flex-wrap justify-center z-30">
        <div class="fixed  mt-20 text-gray-600 text-2xl">
        <button data-sveltekit-preload-data="tap" on:click={()=>GOFLOOR1()} class={`mx-20 ${isfloor1 === 1 ? 'underline' : ''}`}>Floor1</button>
        <button data-sveltekit-preload-data="tap" on:click={()=>GOFLOOR2()} class={`mx-20 ${isfloor2 === 1 ? 'underline' : ''}`}>Floor2</button>
        </div>
        </div>
    

</div>