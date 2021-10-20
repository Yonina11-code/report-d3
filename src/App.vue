<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <histogram :data="source" :option="option"></histogram>
  </div>
</template>

<script>
import { option } from "@/const/histogram"
export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      option: option,
      source: [
          //html css js
          [ 30,  20, 40], //学习人数
          [ 40,  30, 50], //就业人数
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
