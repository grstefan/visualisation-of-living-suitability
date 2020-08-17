mapboxgl.accessToken = "pk.eyJ1IjoiZ3JzdGVmYW4iLCJhIjoiY2puMzh0MnVwMWR3NjNrcGJsdTB6bWJiaCJ9.M0hMaSsjYoapgaa5e5Rn7Q";
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [-71.032, 42.345],
    zoom: 11.0
});


map.on('load', function () {


    map.addSource('restaurants', {
        type: 'geojson',
        data: "http://127.0.0.1:8000/restaurant.1"
    });

    map.loadImage("http://127.0.0.1:8000/image.restaurant", function (error, image) {
        if (error) throw error;
        map.addImage("custom-restaurant", image);
        /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
        map.addLayer({
            'id': "restaurants",
            'type': "symbol",
            /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
            'source': 'restaurants',
            'layout': {
                "icon-image": "custom-restaurant",
                "icon-size": 0.5
            },
            'minzoom': 11.5
        });
    });

    map.on('click', 'restaurants', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.name;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML('<b>' + description)
            .addTo(map);
    });


    map.addSource('schools', {
        type: 'geojson',
        data: "http://127.0.0.1:8000/school.1"
    });

    map.loadImage("http://127.0.0.1:8000/image.school", function (error, image) {
        if (error) throw error;
        map.addImage("custom-school", image);
        /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
        map.addLayer({
            'id': "schools",
            'type': "symbol",
            /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
            'source': 'schools',
            'layout': {
                "icon-image": "custom-school",
                "icon-size": 0.2
            },
            'minzoom': 11.5
        });
    });

    map.addSource('churchs', {
        type: 'geojson',
        data: 'http://127.0.0.1:8000/church.1'
    });

    map.loadImage("http://127.0.0.1:8000/image.church", function (error, image) {
        if (error) throw error;
        map.addImage("custom-church", image);
        /* Style layer: A style layer ties together the source and image and specifies how they are displayed on the map. */
        map.addLayer({
            'id': "churches",
            'type': "symbol",
            /* Source: A data source specifies the geographic coordinate where the image marker gets placed. */
            'source': 'churchs',
            'layout': {
                "icon-image": "custom-church",
                "icon-size": 0.6
            },
            'minzoom': 11.5
        });
    });


    map.on('click', 'schools', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.name;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML('<b>' + description)
            .addTo(map);
    });

    map.on('click', 'churchs', function (e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.name;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML('<b>' + description)
            .addTo(map);
    });


    // TODO centered and zoom on click
    map.addSource('subregions', {
        type: 'geojson',
        data: 'http://127.0.0.1:8000/subregions.population.0.crime.1.park.0.school.0.church.0.restaurant.0'
    });

    map.addLayer({
        'id': 'subregions',
        'type': 'fill',
        'source': 'subregions',
        'layout': {
            'visibility': 'visible',
        },
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'final_score'],
                0.30, '#ff0000',
                0.50, '#ff6200',
                0.70, '#ffb400',
                0.80, '#fff000',
                0.95, '#00FF00',
            ],
            'fill-opacity': 0.7,
            'fill-outline-color': '#fffdea'
        }
    });


    map.addSource('crimes', {
        type: 'geojson',
        data: 'http://127.0.0.1:8000/crimes'
    });

    map.addLayer({
        "id": "crime-heat",
        "type": "heatmap",
        "source": "crimes",
        "maxzoom": 20,
        'layout': {
            'visibility': 'visible',
        },
        "paint": {
            // Increase the heatmap weight based on frequency and property magnitude
            "heatmap-weight": [
                "interpolate",
                ["linear"],
                ["get", "score"],
                0, 0,
                10, 1
            ],

            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(33,102,172,0)",
                0.2, "rgb(103,169,207)",
                0.4, "rgb(209,229,240)",
                0.6, "rgb(253,219,199)",
                0.8, "rgb(239,138,98)",
                1, "rgb(178,24,43)"
            ],
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0, 2,
                8, 20
            ],

        }
    }, 'waterway-label');


});
