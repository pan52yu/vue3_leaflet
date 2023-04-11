<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// import 'leaflet/dist/leaflet.choropleth'
import zhejiang from './areaJson/zhejiang.json'

defineOptions({
  name: 'LeafletMap',
})

const mapContainer = ref(null)
const map = ref<any>(null)
const zheJiangLayer = ref<any>(null)

const chineseToEnglishMap = [
  { name: '杭州市', value: 'hangzhou' },
  { name: '温州市', value: 'wenzhou' },
]

// 随机生成0-400的数据
const randomData = () => {
  return Math.round(Math.random() * 400)
}
// 每个地区的数据，用于热力图展示
const areaData = [
  { name: '杭州市', value: randomData() },
  { name: '温州市', value: randomData() },
  { name: '湖州市', value: randomData() },
  { name: '嘉兴市', value: randomData() },
  { name: '宁波市', value: randomData() },
  { name: '绍兴市', value: randomData() },
  { name: '金华市', value: randomData() },
  { name: '衢州市', value: randomData() },
  { name: '台州市', value: randomData() },
  { name: '丽水市', value: randomData() },
  { name: '舟山市', value: randomData() },
]

// 异步加载地图
const loadMap = async (area: string) => {
  const areaName = chineseToEnglishMap.find((item) => item.name === area)?.value
  if (!areaName) {
    return false
  }
  // 动态导入对应英文地名的地图数据
  const url = `./areaJson/${areaName}.json`
  return import(url) // 返回地图数据
}

const initMap = () => {
  map.value = L.map(mapContainer.value, {
    center: [30.245927, 120.154798],
    zoom: 8,
    maxZoom: 10,
    minZoom: 7,
    zoomControl: false, // 隐藏地图缩放控件
  })

  zheJiangLayer.value = L.geoJSON(zhejiang, {
    onEachFeature: onEachFeature,
    style: styleMap,
  }).addTo(map.value)

  map.value.fitBounds(zheJiangLayer.value.getBounds())
}

const styleMap = (feature: any) => {
  const area = feature.properties.name
  const areaValue = areaData.find((item) => item.name === area)?.value
  const fillColor = areaValue ? getColor(areaValue) : '#2772d3'

  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  }
}

const getColor = (value: number) => {
  // 0-100 为白色，100-200 为蓝色，200-300 为橙色，300-400 为红色
  switch (true) {
    case value <= 100:
      return '#ffffff'
    case value <= 200:
      return '#2772d3'
    case value <= 300:
      return '#f7a35c'
    case value <= 400:
      return '#f15c80'
    default:
      return '#ffffff'
  }
}

const onEachFeature = (feature: any, layer: any) => {
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
        // 线条宽度
        weight: 5,
        // 填充颜色
        color: '#666',
        // dashArray 是一个字符串，用于设置线条的虚线样式，例如 '5, 10, 15' 表示先绘制 5 像素的实线，再绘制 10 像素的空白，再绘制 15 像素的实线，然后再重复这个过程。
        dashArray: '',
        // 透明度
        fillOpacity: 0.1,
      })
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront()
      }
    },
    mouseout: function () {
      zheJiangLayer.value.resetStyle(this)
    },
    click: async function () {
      const areaName = feature.properties.name
      const area = await loadMap(areaName)
      if (!area) {
        map.value.fitBounds(layer.getBounds())
        return
      }
      clearMap()
      zheJiangLayer.value = L.geoJSON(area, {
        // 添加杭州地图图层
        onEachFeature: onEachFeature,
        style: styleMap,
      }).addTo(map.value)

      map.value.fitBounds(zheJiangLayer.value.getBounds()) // 自适应地图视图
    },
  })
}

// 重置地图
const resetMap = () => {
  clearMap()
  zheJiangLayer.value = L.geoJSON(zhejiang, {
    onEachFeature: onEachFeature,
    style: styleMap,
  }).addTo(map.value)
  map.value.fitBounds(zheJiangLayer.value.getBounds()) // 自适应地图视图
}

// 清空地图
const clearMap = () => {
  map.value.eachLayer(function (layer: any) {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer)
    }
  })
  if (zheJiangLayer.value) {
    zheJiangLayer.value.clearLayers() // 清除浙江地图图层
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
  background: #8a6060;
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
  font-weight: 700;
  text-shadow: 0 0 5px #fff;
}
::v-deep(.leaflet-bottom.leaflet-right) {
  display: none !important;
}
</style>
