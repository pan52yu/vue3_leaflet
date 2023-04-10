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
  // const map = L.map(mapContainer.value, {
  //   center: [30.245927, 120.154798],
  //   zoom: 8,
  // })
  const map = L.map(mapContainer.value, {
    center: [30.245927, 120.154798],
    zoom: 8,
    maxZoom: 10,
    minZoom: 7,
  })

  const onEachFeature = function (feature, layer) {
    const center = layer.getBounds().getCenter()
    const label = L.marker(center, {
      icon: L.divIcon({
        className: 'label',
        html: feature.properties.name,
        iconSize: [100, 20],
      }),
    }).addTo(map)
  }

  // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution: '&copy; <a href="javaScript:;">橙晖科技</a>提供技术支持',
  // }).addTo(map)

  const zheJiangData = zhejiang
  const zheJiangLayer = L.geoJSON(zheJiangData, {
    onEachFeature: onEachFeature,
  }).addTo(map)

  map.fitBounds(zheJiangLayer.getBounds())

  const bounds = zheJiangLayer.getBounds()
  if (map.getBoundsZoom(bounds) > map.getMaxZoom()) {
    map.fitBounds(bounds, {
      maxZoom: map.getMaxZoom(),
    })
  } else {
    map.fitBounds(bounds)
  }
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
.label {
  font-size: 14px;
  text-align: center;
  color: #000;
  font-weight: bold;
  text-shadow: 0 0 5px #fff;
}
</style>
