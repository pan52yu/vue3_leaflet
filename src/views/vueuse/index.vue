<template>
  <div class="chart">
    <div class="chart_card">
      <div class="chart_card_item">
        <div class="father">父节点1</div>
        <div class="son no_one_node">
          <div>子节点1</div>
          <div>子节点2</div>
          <div>子节点3</div>
          <div>子节点4</div>
          <div class="last">子节点5</div>
        </div>
      </div>
      <div class="chart_card_item">
        <div class="father">父节点2</div>
        <div class="son on_node">
          <div>一个子节点</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Chart',
})
</script>
<style lang="scss" scoped>
.chart {
  width: 100vw;
  height: 100vh;
  background: #031331;
  padding: 20px;

  &_card {
    width: 500px;
    height: 300px;
    border: 2px solid #486a9b;
    padding: 15px;

    &_item {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      .father {
        color: #93afd2;
        background: #122a48;
        width: 150px;
        text-align: center;
        padding: 10px;
        border-radius: 5px;
        position: relative;
        z-index: 1;
        box-shadow: 2px 2px 5px rgba(255, 255, 255, 0.2);

        &::after {
          content: '';
          position: absolute;
          right: -20px;
          top: 50%;
          width: 20px;
          height: 2px;
          background-color: #486a9b;
          transform: translateY(-50%);
        }
      }

      .son {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding-left: 20px;
        margin-left: 20px;
        padding-top: -50px;
        position: relative;
        div {
          color: #93afd2;
          background: #122a48;
          width: 150px;
          text-align: center;
          padding: 5px;
          border-radius: 5px;
          box-shadow: 2px 2px 5px rgba(255, 255, 255, 0.2);
        }
      }
      .no_one_node {
        &:before {
          content: ''; /* 设置伪元素内容为空 */
          position: absolute; /* 设置绝对定位 */
          left: 0; /* 将伪元素放置在元素左侧 */
          top: 10%; /* 将伪元素放置在元素顶部 */
          height: 80%; /* 设置伪元素高度为元素高度的80% */
          border-left: 2px solid #486a9b; /* 设置伪元素的左边框 */
        }

        div:first-child::before {
          content: '';
          position: absolute;
          left: 0;
          top: 10%;
          width: 20px;
          height: 2px;
          background-color: #486a9b;
          transform: translateY(-50%);
        }
        div:last-child::before {
          content: '';
          position: absolute;
          left: 0;
          top: 90%;
          width: 20px;
          height: 2px;
          background-color: #486a9b;
          transform: translateY(-50%);
        }
      }
      .on_node {
        div:first-child::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 20px;
          height: 2px;
          background-color: #486a9b;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
