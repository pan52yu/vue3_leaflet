<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import zhejiang from './areaJson/zhejiang.json'

defineOptions({
  name: 'LeafletMap',
})

// 地图容器
const mapContainer = ref(null)
// 地图实例
const map = ref<any>(null)
// 地图图层
const mapLayer = ref<any>(null)
// 当前选中的地区
const currentArea = ref('')

const areaDensity = ref()
const areaName = ref('')

const DensityList = [0, 10, 20, 50, 100, 200, 500, 1000]

const densityStyle = (value: number) => {
  return {
    backgroundColor: getColor(value),
  }
}

// 地区中文名与英文名的映射
const chineseToEnglishMap: ReadonlyArray<{ name: string; value: string }> = [
  { name: '杭州市', value: 'hangzhou' },
  { name: '温州市', value: 'wenzhou' },
  { name: '湖州市', value: 'huzhou' },
  { name: '嘉兴市', value: 'jiaxing' },
  { name: '宁波市', value: 'ningbo' },
  { name: '绍兴市', value: 'shaoxing' },
  { name: '金华市', value: 'jinhua' },
  { name: '衢州市', value: 'quzhou' },
  { name: '台州市', value: 'taizhou' },
  { name: '丽水市', value: 'lishui' },
  { name: '舟山市', value: 'zhoushan' },
]

// 随机生成0-400的数据
const randomData = () => {
  return Math.round(Math.random() * 400)
}
// 每个地区的数据，用于热力图展示
const areaData = ref<{ name: string; value: number }[]>([
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
])

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

// 初始化地图
const initMap = () => {
  map.value = L.map(mapContainer.value, {
    center: [30.245927, 120.154798],
    zoom: 8,
    maxZoom: 10,
    minZoom: 7,
    zoomControl: false, // 隐藏地图缩放控件
  })

  mapLayer.value = L.geoJSON(zhejiang, {
    onEachFeature: onEachFeature,
    style: styleMap,
  }).addTo(map.value)

  map.value.fitBounds(mapLayer.value.getBounds())
}

// 地图样式 >>> 热力图
const styleMap = (feature: any) => {
  const area = feature.properties.name
  const areaValue = areaData.value.find((item) => item.name === area)?.value
  const fillColor = areaValue ? getColor(areaValue) : '#2772d3'

  return {
    fillColor: fillColor,
    weight: 1,
    opacity: 1,
    color: '#2772d3',
    dashArray: '3',
    fillOpacity: 0.7,
  }
}

// 根据数据值获取颜色
const getColor = (value: number) => {
  // 0-100 为白色，100-200 为蓝色，200-300 为橙色，300-400 为红色
  switch (true) {
    // case value <= 100:
    //   return '#ffffff'
    // case value <= 200:
    //   return '#2772d3'
    // case value <= 300:
    //   return '#f7a35c'
    // case value <= 400:
    //   return '#f15c80'
    // default:
    //   return '#ffffff'
    case value > 1000:
      return 'rgba(128,0,38,1)'
    case value > 500:
      return 'rgba(189,0,38,1)'
    case value > 200:
      return 'rgba(227,26,28,1)'
    case value > 100:
      return 'rgba(252,78,42,1)'
    case value > 50:
      return 'rgba(253,141,60,1)'
    case value > 20:
      return 'rgba(254,178,76,1)'
    case value > 10:
      return 'rgba(254,217,118,1)'
    default:
      return 'rgba(255,255,204,1)'
  }
}

// 鼠标移入地图事件
const mouseoverMap = (e: any) => {
  const layer = e.target
  areaDensity.value = areaData.value.find(
    (item) => item.name === layer.feature.properties.name
  )?.value
  areaName.value = layer.feature.properties.name

  layer.setStyle({
    weight: 5,
    color: '#2772d3',
    fillColor: '#0532e8',
    dashArray: '',
    fillOpacity: 0.7,
  })
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront()
  }
}
// 鼠标移出地图事件
const mouseoutMap = (e: any) => {
  mapLayer.value.resetStyle(e.target)
  areaDensity.value = 0
  areaName.value = ''
}

// 地图事件
const onEachFeature = (feature: any, layer: any) => {
  // 获取地图中心点
  const center = layer.getBounds().getCenter()
  // 创建地区标签
  L.marker(center, {
    icon: L.divIcon({
      className: 'label',
      html: feature.properties.name,
      iconSize: [50, 20],
    }),
  }).addTo(map.value)

  layer.on({
    mouseover: mouseoverMap,
    mouseout: mouseoutMap,
    click: async function () {
      const areaName = feature.properties.name
      // 加载地图
      const area = await loadMap(areaName)
      // 如果没有地图数据，直接返回
      if (!area) {
        map.value.fitBounds(layer.getBounds())
        return
      }
      // 清空地图
      clearMap()
      currentArea.value = areaName
      // 添加地图
      mapLayer.value = L.geoJSON(area, {
        onEachFeature: onEachFeature,
        style: styleMap,
      }).addTo(map.value)

      map.value.fitBounds(mapLayer.value.getBounds()) // 自适应地图视图
    },
  })
}

// 重置地图
const resetMap = () => {
  clearMap()
  currentArea.value = ''
  mapLayer.value = L.geoJSON(zhejiang, {
    onEachFeature: onEachFeature,
    style: styleMap,
  }).addTo(map.value)
  map.value.fitBounds(mapLayer.value.getBounds()) // 自适应地图视图
}

// 清空地图
const clearMap = () => {
  map.value.eachLayer(function (layer: any) {
    if (layer instanceof L.Marker) {
      map.value.removeLayer(layer)
    }
  })
  if (mapLayer.value) {
    mapLayer.value.clearLayers() // 清除浙江地图图层
  }
}

onMounted(() => {
  initMap()
})
</script>

<template>
  <div class="leaflet_map">
    <!--  地图容器  -->
    <div ref="mapContainer" class="mapContainer">
      <div
        v-show="areaName !== ''"
        class="absolute right-0 top-0 z-500 w-30 p-3 bg-[rgba(255,255,255,0.1)] text-base"
      >
        <div>值: {{ areaDensity }}</div>
        <div>地区: {{ areaName }}</div>
      </div>
      <ul class="absolute right-[1.25rem] bottom-[1.875rem] z-500 p-4 text-base">
        <li v-for="(Density, index) in DensityList" :key="Density">
          <span class="inline-block w-4 h-4 mr-2" :style="densityStyle(DensityList[index])"></span>
          {{ DensityList[index + 1] ? `${Density}-${DensityList[index + 1]}` : `${Density}+` }}
        </li>
      </ul>
    </div>
    <!--  左上角导航  -->
    <div class="navigation">
      <span @click="resetMap">浙江省</span>
      <span v-if="currentArea"> > {{ currentArea }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.leaflet_map {
  width: 100vw;
  height: 100vh;
  background: rgba(31, 45, 180, 0.5);
  position: relative;
  .mapContainer {
    width: 100%;
    height: 100%;
    background: transparent;
    ul {
      list-style: none;
    }
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
  .navigation {
    position: absolute;
    top: 10px;
    left: 10px;
    span {
      &:first-child {
        cursor: pointer;
        &:hover {
          color: #fff;
        }
      }
    }
  }
}
</style>
