<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <histogram :data="barChartData" :option="option"></histogram>
    <pie :option="pieOptions" :data="barChartData"></pie>
    <!-- <bar-chart title="test" xKey="name" yKey="amount" :data="source" :option="option"></bar-chart> -->
    <!-- <circle-progress></circle-progress> -->
  </div>
</template>

<script>
import { option } from "@/const/histogram"
import { options as pieOptions } from '@/const/pie'
// import BarChart from '@/components/bar-chart'
// import circleProgress from '@/components/circle-progress'

export default {
  name: 'App',
  components: {
    // BarChart,
    // circleProgress
  },
  data () {
    return {
      option: option,
      pieOptions: pieOptions,
      source: [
          //html css js
          [ 30,  20, 40], //学习人数
          [ 40,  30, 50], //就业人数
      ],
      barChartData: [
      {
        name: "张三",
        amount: 25
      },
      {
        name: "李四",
        amount: 40
      },
      {
        name: "老王",
        amount: 15
      },
      {
        name: "老赖",
        amount: 9
      }
    ]
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
