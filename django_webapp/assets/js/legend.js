var layers = ['0.3', '0.5', '0.7', '0.80', '0.95'];
var colors = ['#ff0000', '#ff6200', '#ffb400', '#fff000', '#00FF00'];

for (i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
}

map.on('mousemove', function (e) {
    var states = map.queryRenderedFeatures(e.point, {
        layers: ['subregions']
    });

    if (states.length > 0) {
        document.getElementById('pd').innerHTML = '<h3><strong>' + states[0].properties.name + '</strong></h3>';
        document.getElementById('pd').innerHTML += '<p><strong><em>Scores:</strong></em></p>';
        document.getElementById('pd').innerHTML += '<p><strong><em>' + states[0].properties.population + '</strong> people</em></p>';
        document.getElementById('pd').innerHTML += '<p><strong><em>' + states[0].properties.churchs + '</strong> church</em></p>';
        document.getElementById('pd').innerHTML += '<p><strong><em>' + states[0].properties.schools + '</strong> school</em></p>';
        document.getElementById('pd').innerHTML += '<p><strong><em>' + states[0].properties.crime + '</strong> crime</em></p>';
        document.getElementById('pd').innerHTML += '<p><strong><em>' + states[0].properties.parks + '</strong> park</em></p>';
        document.getElementById('pd').innerHTML += '<p><strong><em>' + states[0].properties.restaurants + '</strong> restaurants</em></p>';


    } else {
        document.getElementById('pd').innerHTML = '<p>Hover over a state!</p>';
    }
});
