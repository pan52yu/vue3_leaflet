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
    zoomControl: false,
    style: 'background-color: transparent;', // 设置背景色为透明
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
    layer.on({
      // 鼠标移入事件
      mouseover: function () {
        // 高亮显示
        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7,
        })
        // 鼠标移入时，将当前图层置于最上层
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront()
        }
      },
      // 鼠标移出事件
      mouseout: function () {
        // 鼠标移出时，恢复默认样式
        zheJiangLayer.resetStyle(this)
      },
      // 点击事件
      click: function () {
        // 自适应地图视图
        map.fitBounds(layer.getBounds())
        console.log(feature.properties.name)
      },
    })
  }

  L.tileLayer('', {
    attribution: '&copy; <a href="javaScript:;">橙晖科技提供技术支持</a>',
  }).addTo(map)

  const zheJiangData = zhejiang
  const zheJiangLayer = L.geoJSON(zheJiangData, {
    onEachFeature: onEachFeature,
  }).addTo(map)

  map.fitBounds(zheJiangLayer.getBounds())
})
</script>

<template>
  <div class="leaflet_map">
    <div ref="mapContainer" class="mapContainer"></div>
  </div>
</template>

<style lang="scss" scoped>
.leaflet_map {
  width: 100vw;
  height: 100vh;
  //background: #646cff;
}
.mapContainer {
  width: 100vw;
  height: 100vh;
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
