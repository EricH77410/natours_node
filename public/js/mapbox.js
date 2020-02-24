
export const displayMap = (locations) => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiZXJpY2g3NyIsImEiOiJjazZ0azk1N28wMDN3M2twN2duenh2d2t6In0.KfYqPHFWHRxlY9gjmawuxg'
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/erich77/ck6tkcbl71dm11ika65lzejzd',
    scrollZoom: false,
    // center: latlng,
    // zoom: 4,
    // interactive: true
  });
  
  const bounds = new mapboxgl.LngLatBounds()
  
  locations.forEach(loc => {
    // Add a marker
    const el = document.createElement('div')
    el.className = 'marker'
  
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    }).setLngLat(loc.coordinates)
    .addTo(map)
  
    // Add Popup
    new mapboxgl.Popup({
      offset: 30
    })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map)
  
    bounds.extend(loc.coordinates)
  });
  
  
  
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  })
}



