const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September"];


const monthsDiv = document.getElementById("months");

let month = "Januar";


const casesDiv = document.getElementById("cases");
casesDiv.innerHTML = myPoints.features.length + " Fälle";




months.forEach(function(item){
    const div = item;
    monthsDiv.innerHTML += `<div  id=${item}>${item}</div>`;
})







var map = new maplibregl.Map({
        container: 'map', // container id
        style: 'https://api.maptiler.com/maps/01875ece-e969-4b12-8bcf-94e407a9117b/style.json?key=w920nHmnkczgMwFZMmXN', // style URL
        center: [10.387887223339249, 51.347688652879526], // starting position [lng, lat]
        zoom: 5.25 // starting zoom
});

 // disable map zoom when using scroll
 // map.scrollZoom.disable();


// console.log(myPoints)

myPoints.features.map(function(item){
    // console.log(item.properties._umap_options)

    let killed;

    if(item.properties._umap_options){
        item.properties.status = "getötet"
    } else {
        item.properties.status = "versucht"
    }
    return item;
})

// console.log(myPoints)


map.on("load", () => {

    map.setMinZoom(5.25);

    map.addSource("bundesländer", {
        type:"geojson",
        data: myData
    })

    map.addLayer({
        id: "egal",
        source: "bundesländer",
        type: "line",
        paint:{
            "line-color": "#526D82"
        }
    })    

    map.addSource("points",{
        type: "geojson",
        data: myPoints
    })

    map.addLayer({
        id: "myPoints",
        source: "points",
        type: "circle",
        paint:{
            'circle-color': [
                'match',
                ['get', 'status'],
                'getötet',
                '#526d82',
                'versucht',
                '#9db2bf',
                '#ccc'
                ],
            "circle-radius": 10,
            "circle-opacity": 0.8
        }


    })

    // function zoomin () {
    //     var myData =  document.getElementById("egal");
    //     var currWidth =myImgclientWidth;
    //     if (currWidth == 2500) return false;
    //     else {
    //         myImg.style.width = (currWidth + 100) + "px";
    //     }
    // }

    const filterReset = map.getFilter("myPoints");


    monthsDiv.addEventListener("click", (e) => {
        e.target.style.color = "#a084e8";
        month = e.target.id;
        console.log(month)
    
        let filtered = myPoints.features.filter(item => {
            return item.properties.month == month;
        })
    
        map.setFilter("myPoints",["==", "month", month] )
    })
    
    monthsDiv.addEventListener("mouseover", (e) => {
        e.target.style.color = "#a084e8";
        month = e.target.id;
        // console.log(month)
    
        let filtered = myPoints.features.filter(item => {
            return item.properties.month == month;
        })

        let numberOfCases = filtered.length;

    
        map.setFilter("myPoints",["==", "month", month] )

        casesDiv.innerHTML = numberOfCases + " Fälle";
    })
    
    
    monthsDiv.addEventListener("mouseout", (e) => {
        e.target.style.color = "#526d82";
        map.setFilter("myPoints", filterReset)


        casesDiv.innerHTML = myPoints.features.length + " Fälle";
    })

    map.on("click", "myPoints", function(event){
            // console.log(event.features[0].properties.date);


            const date = event.features[0].properties.date;
            const description = event.features[0].properties.description;

            const popup = `<div> ${date}</div><div> ${description}</div>`
            
            

            new maplibregl.Popup()
            .setLngLat(event.lngLat)
            .setHTML(popup)
            .addTo(map);


        })
        

})








