<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import zhejiang from './zhejiang.json'
import hangzhou from './hangzhou.json'

defineOptions({
  name: 'LeafletMap',
})
const mapContainer = ref(null)
const map = ref<any>(null)
const zheJiangLayer = ref<any>(null)
const areaLayer = ref<any>(null)
const initMap = () => {
  map.value = L.map(mapContainer.value, {
    center: [30.245927, 120.154798],
    zoom: 8,
    maxZoom: 10,
    minZoom: 7,
    zoomControl: false,
  })

  zheJiangLayer.value = L.geoJSON(zhejiang, {
    onEachFeature: onEachFeature,
  }).addTo(map.value)

  map.value.fitBounds(zheJiangLayer.value.getBounds())
}
const onEachFeature = (feature, layer) => {
  const center = layer.getBounds().getCenter()
  const label = L.marker(center, {
    icon: L.divIcon({
      className: 'label',
      html: feature.properties.name,
      iconSize: [100, 20],
    }),
  }).addTo(map.value)
  layer.on({
    mouseover: function () {
      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7,
      })
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront()
      }
    },
    mouseout: function () {
      zheJiangLayer.value.resetStyle(this)
    },
    click: function () {
      console.log(feature.properties.name)
      if (feature.properties.name === '杭州市') {
        clearMap()
        areaLayer.value = L.geoJSON(hangzhou, {
          // 添加杭州地图图层
          onEachFeature: onEachFeature,
        }).addTo(map.value)
        map.value.fitBounds(areaLayer.value.getBounds()) // 自适应地图视图到市区地图
      }
    },
  })
}

// 重置地图
const resetMap = () => {
  clearMap()
  zheJiangLayer.value = L.geoJSON(zhejiang, {
    // 添加杭州地图图层
    onEachFeature: onEachFeature,
  }).addTo(map.value)
  map.value.fitBounds(zheJiangLayer.value.getBounds()) // 自适应地图视图到浙江地图
}

// 清空地图
const clearMap = () => {
  map.value.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer)
    }
  })
  if (zheJiangLayer.value) {
    zheJiangLayer.value.clearLayers() // 清除浙江地图图层
  }
  if (areaLayer.value) {
    areaLayer.value.clearLayers() // 清除杭州地图图层
  }
}

onMounted(() => {
  initMap()
})
</script>

<template>
  <div class="leaflet_map">
    <div ref="mapContainer" class="mapContainer"></div>
    <button @click="resetMap">重置</button>
  </div>
</template>

<style lang="scss" scoped>
.leaflet_map {
  width: 100vw;
  height: 100vh;
}

.mapContainer {
  width: 90vw;
  height: 90vh;
  background: transparent;
}

.label {
  font-size: 14px;
  text-align: center;
  color: #000;
  font-weight: bold;
  text-shadow: 0 0 5px #fff;
}
</style>
