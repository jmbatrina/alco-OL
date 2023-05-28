<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
  
    //get current route; to be used for knowing which link is active
    import {globalID} from "./global.js";
  
    let IDvalue;
    globalID.subscribe(value => {
      IDvalue = Number(value);
    });
    
  
    //uncomment once db has xy-coordinates
    // import { app, db, getDispenserUIData } from '../Firebase';
  
    // let dispensers_promise = getDispenserUIData(app, db);
    // console.log(dispensers);
  
    //marker location
    
    // let dispenserbase = dispensers[Number(IDvalue)-1].floor;
  
    // leaflet
    let mapElement;
    let map;
  
    onMount(async () => {
      if(browser) {
        const leaflet = await import('leaflet');
        
        // create map component
        map = L.map(mapElement, { zoomControl: false }).setView([0, 0], 1);
  
        // get and set values of floorplan
        var imageUrl = 'https://www.rockwellprimaries.com.ph/wp-content/uploads/2019/05/2BR-1-1.jpg';
        var imageBounds = [[-300, -300], [300, 300]];
        L.imageOverlay(imageUrl, imageBounds).addTo(map);
  
  
        // set bounds of dragging screen
        var southWest = L.latLng(-1000, -300),
        northEast = L.latLng(1000, 300);
        var bounds = L.latLngBounds(southWest, northEast);
  
        map.setMaxBounds(bounds);
        map.on('drag', function() {
        map.panInsideBounds(bounds, { animate: false });
        });
  
      
  
      //set custom markers details
    var alcotags = L.Icon.extend({
      options: {
        iconSize:     [80, 96], // size of the icon
        iconAnchor:   [40, 48], // point of the icon which will correspond to marker's location
        popupAnchor:  [20, 24] // point from which the popup should open relative to the iconAnchor
      }
      });
  
    var Active_High_Tag = new alcotags({iconUrl: '../active-high-tag.png'}),
      Active_Medium_Tag = new alcotags({iconUrl: '../active-medium-tag.png'}),
      Active_Low_Tag = new alcotags({iconUrl: '../active-low-tag.png'}),
      Inactive_High_Tag = new alcotags({iconUrl: '../inactive-high-tag.png'}),
      Inactive_Medium_Tag = new alcotags({iconUrl: '../inactive-medium-tag.png'}),
      Inactive_Low_Tag = new alcotags({iconUrl: '../inactive-low-tag.png'});
  
    // function MARKER(dispenser){\
    let dispensers = [
      {id:1, xy: [0,0] , status: 'Active', level: 'Medium', location: 'Working Dispenser', floor: 1},
      {id:2, xy: [-50,-100], status: 'Active', level: 'Medium', location: 'Back Entrance', floor: 1},
      {id:3, xy: [70,50], status: 'Inactive', level: 'High', location: 'Near CR', floor: 2},
    ];
  
    let basefloor = Number(IDvalue-1);
    // let floornum = "FLOOR " + dispensers[basefloor].floor;
    // L.marker([50, 0],{opacity: 0}).bindTooltip(floornum,{
    //       permanent: true, 
    //       direction: 'center',
    //       offset: [0,-100]
          
    //     }).addTo(map);
  
    let tag;
  
    for (let i = 0;i<dispensers.length; i+=1){
      if (dispensers[i].floor === 1){
      
        
  
        if (dispensers[i].status == "Active"){
          if (dispensers[i].level == "High") tag = Active_High_Tag;
          else if (dispensers[i].level == "Medium") tag = Active_Medium_Tag;
          else tag = Active_Low_Tag;
        }
        else{
          if (dispensers[i].level == "High") tag = Inactive_High_Tag;
          else if (dispensers[i].level == "Medium") tag = Inactive_Medium_Tag;
          else tag = Inactive_Low_Tag;
        }
        L.marker(dispensers[i].xy, {icon: tag}).bindTooltip(dispensers[i].location, 
        {
          permanent: true, 
          direction: 'top',
          offset: [0,-30]
          
        }
        ).addTo(map);
      }
    }
}

    });
  
    
  
    onDestroy(async () => {
        if(map) {
            console.log('Unloading Leaflet map.');
            map.remove();
        }
    });
  </script>
  
  
  <main>
    <div bind:this={mapElement} ></div>
  </main>
  
  <style>
    @import 'leaflet/dist/leaflet.css';
    main div {
      margin-top: 80px;
        position: fixed;
        height: calc(100vh - 80px);
        width: 100%;
        background: none !important;
        box-shadow: 10px 10px;
    }
    
  </style>