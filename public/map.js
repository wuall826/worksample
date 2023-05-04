const map = L.map('map').setView([45, -75], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function getColor(riskRating) {
    if (riskRating <= 0.15) return 'green';
    if (riskRating <= 0.30) return 'yellow';
    if (riskRating <= 0.60) return 'orange';
    return 'red';
}

function addMarkers(year) {
    assets.forEach(asset => {
        if (asset.Year === year) {
            const marker = L.marker([asset.Lat, asset.Long], {
                icon: L.divIcon({
                    html: `<div style="width: 15px; height: 15px; border-radius: 0%; background-color:${getColor(parseFloat(asset['Risk Rating']))}; opacity: 0.8; border: none;"></div>`,
                    iconSize: [15, 15],
                }),
            })
                .addTo(map)
                .bindTooltip(
                    `<strong>Asset Name:</strong> ${asset['Asset Name']}<br><strong>Business Category:</strong> ${asset['Business Category']}`
                );
        }
    });
}              

function clearMarkers() {
    map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
}

document.getElementById('decadeSelector').addEventListener('change', (event) => {
    clearMarkers();
    addMarkers(event.target.value);
});        

addMarkers('2030');
