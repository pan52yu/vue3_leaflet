<script lang="ts">
export default {
  name: 'MyHome',
}
</script>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/store/module/user'

const count = ref(0)

const userStore = useUserStore()

// 修改名字
const changeName = () => {
  userStore.setName('new name')
}
onMounted(() => {
  console.log(import.meta.env)
})
</script>

<template>
  <div class="card">
    <h1>{{ userStore.name }}</h1>
    <button @click="changeName">修改名字</button>
    <button type="button" @click="count++">count is {{ count }}</button>
  </div>
</template>

<style lang="scss" scoped>
button {
  color: $test-color;
  background: var(--main-bg-color);
}
</style>