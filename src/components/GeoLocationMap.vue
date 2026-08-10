<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const mapElement = ref(null)
const placeSearch = ref('')
const startPlace = ref('')
const endPlace = ref('')
const searchMessage = ref('')
const routeMessage = ref('')
const searchLoading = ref(false)
const routeLoading = ref(false)

let map = null
let searchMarker = null
let routeLine = null

const findPlace = async (place) => {
  const params = new URLSearchParams({
    q: place,
    format: 'jsonv2',
    limit: '1',
    'accept-language': 'en'
  })
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`)

  if (!response.ok) {
    throw new Error('The place search is not available.')
  }

  const places = await response.json()

  if (!places.length) {
    throw new Error(`No place was found for "${place}".`)
  }

  return {
    latitude: Number(places[0].lat),
    longitude: Number(places[0].lon),
    name: places[0].name || places[0].display_name.split(',')[0]
  }
}

const searchLocation = async () => {
  if (!placeSearch.value.trim()) {
    searchMessage.value = 'Enter a place to search.'
    return
  }

  searchLoading.value = true
  searchMessage.value = ''

  try {
    const place = await findPlace(placeSearch.value)

    if (searchMarker) {
      searchMarker.remove()
    }

    searchMarker = L.marker([place.latitude, place.longitude])
      .addTo(map)
      .bindPopup(place.name)
      .openPopup()

    map.setView([place.latitude, place.longitude], 14)
    searchMessage.value = `Showing ${place.name}`
  } catch (error) {
    searchMessage.value = error.message
  } finally {
    searchLoading.value = false
  }
}

const showRoute = async () => {
  if (!startPlace.value.trim() || !endPlace.value.trim()) {
    routeMessage.value = 'Enter both a starting place and a destination.'
    return
  }

  routeLoading.value = true
  routeMessage.value = ''

  try {
    const start = await findPlace(startPlace.value)
    const end = await findPlace(endPlace.value)
    const routeUrl = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
    const response = await fetch(routeUrl)

    if (!response.ok) {
      throw new Error('The route service is not available.')
    }

    const routeData = await response.json()

    if (!routeData.routes.length) {
      throw new Error('No route was found between these places.')
    }

    if (routeLine) {
      routeLine.remove()
    }

    routeLine = L.geoJSON(routeData.routes[0].geometry, {
      style: { color: '#1769aa', weight: 5 }
    }).addTo(map)

    map.fitBounds(routeLine.getBounds(), { padding: [24, 24] })
    routeMessage.value = `Route distance: ${(routeData.routes[0].distance / 1000).toFixed(1)} km`
  } catch (error) {
    routeMessage.value = error.message
  } finally {
    routeLoading.value = false
  }
}

onMounted(() => {
  map = L.map(mapElement.value).setView([-37.8136, 144.9631], 11)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)
})

onUnmounted(() => {
  map?.remove()
})
</script>

<template>
  <section class="geo-location-panel">
    <div class="geo-search-block">
      <h2>Search for a place</h2>
      <p>Find a support service or another place on the map.</p>
      <div class="geo-form-row">
        <label for="place-search">Place</label>
        <input id="place-search" v-model="placeSearch" type="text" placeholder="Example: Melbourne" />
        <button class="action-button" type="button" :disabled="searchLoading" @click="searchLocation">
          {{ searchLoading ? 'Searching...' : 'Search Place' }}
        </button>
      </div>
      <p v-if="searchMessage" class="geo-message" role="status" aria-live="polite">{{ searchMessage }}</p>
    </div>

    <div class="geo-search-block">
      <h2>Find a route</h2>
      <p>Enter two places to display a driving route.</p>
      <div class="geo-route-form">
        <label for="start-place">From</label>
        <input id="start-place" v-model="startPlace" type="text" placeholder="Starting place" />
        <label for="end-place">To</label>
        <input id="end-place" v-model="endPlace" type="text" placeholder="Destination" />
        <button class="action-button" type="button" :disabled="routeLoading" @click="showRoute">
          {{ routeLoading ? 'Finding Route...' : 'Show Route' }}
        </button>
      </div>
      <p v-if="routeMessage" class="geo-message" role="status" aria-live="polite">{{ routeMessage }}</p>
    </div>

    <div ref="mapElement" class="geo-map" role="region" aria-label="Interactive map" tabindex="0"></div>
  </section>
</template>
