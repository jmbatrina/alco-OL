<script>
    //get current route; to be used for knowing which link is active
    import { page } from "$app/stores";
    $:currentRoute = $page.url.pathname;
    
</script>


<nav class="bg-cyan w-screen h-20 font-bold shadow-xl z-20 absolute">
    <ul class="">
    <li class="flex" >

        <!--Home-->
        <a href="/" class={`bg-cyan-dark h-20 bg-opacity-0 hover:bg-opacity-100  ${currentRoute === '/' ? 'bg-opacity-100' : 'bg-opacity-0'}`}>
        <h1 class="mt-6 mx-5 text-white text-2xl">alco-OL</h1>
        </a>

        <!--floor1-->
        <a href="/floor1" class={`bg-cyan-dark h-20 bg-opacity-0 hover:bg-opacity-100  ${currentRoute === '/floor1' ? 'bg-opacity-100' : 'bg-opacity-0'}`}>
        <h1 class="mt-6 mx-5 text-white text-2xl">F1</h1>
        </a>

        <!--floor1-->
        <a href="/floor2" class={`bg-cyan-dark h-20 bg-opacity-0 hover:bg-opacity-100  ${currentRoute === '/floor2' ? 'bg-opacity-100' : 'bg-opacity-0'}`}>
        <h1 class="mt-6 mx-5 text-white text-2xl">F2</h1>
        </a>

    </li>
    </ul>
    
    

</nav>