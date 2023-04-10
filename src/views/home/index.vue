<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import zhejiang from './zhejiang.json'
defineOptions({
  name: 'LeafletMap',
})
const mapContainer = ref(null)

onMounted(() => {
  // 初始化地图
  const map = L.map(mapContainer.value, {
    center: [30.245927, 120.154798],
    zoom: 8,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="javaScript:;">橙晖科技</a>提供技术支持',
  }).addTo(map)

  const chinaData = zhejiang
  L.geoJSON(chinaData).addTo(map)
  const bounds = L.latLngBounds(L.latLng(18.15, 73.5), L.latLng(53.5, 135.1))
  map.setMaxBounds(bounds)
})
</script>

<template>
  <div ref="mapContainer" class="mapContainer"></div>
</template>

<style lang="scss" scoped>
.mapContainer {
  width: 100vw;
  height: 100vh;
}
</style>
