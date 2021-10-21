<template>
  <div>
    <svg id="svg" :width="width" :height="height">
      <g>
        <rect
          v-for="(item, index) in data"
          class="bar-positive"
          :key="index"
          :x="xScale(item[0])"
          :y="yScale(0)"
          :width="xScale.bandwidth()"
          :height="100"
        ></rect>
      </g>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'barChart',
  props: {
    option: Object,
    data: Array
  },
  computed: {
    // 画布的宽
    width() {
      return this.option.size.width || 600
    },
    // 画布的高
    height () {
      return this.option.size.height || 600
    },
    // 坐标轴方向
    axisPosition () {
     return this.option.axisPosition || 'bottom'
    },
    axisX () {
      return this.position[this.axisPosition][0]
    },
    axisY () {
      return this.position[this.axisPosition][1]
    },
    // 坐标轴位置
    position () {
      return { 'bottom': ['axisBottom', 'axisLeft'], 'top': ['axisTop', 'axisLeft'], 'left': ['axisLeft', 'axisBottom']}
    },
    // 坐标轴位移
    transform () {
      return  { 'bottom': [`translate(0, ${this.height - 50})`, 'translate(50 0)'], 'top': [`translate(0 50)`, 'translate(50 0)'], 'left': [`translate(50, 0)`, `translate(0, ${this.height - 50})`] }
    },
    // x轴在像素坐标内的起始点和结束点 xPixelRange，左右各偏移50
    xPixelRange () {
      return [50, this.width - 50]
    },
    // y轴的极值
    maxY () {
      // data 是纯数字的情况下
      return  Math.max(...this.data.flat())
    },
    // 声明y轴在图表坐标系中的数据起点和结束点 yChartRange
    yChartRange () {
      return [0, this.maxY]
    },
    // 声明y轴在像素坐标系中的数据起点和结束点 yPixelRange
    yPixelRange () {
      return [this.height - 50, 50]
    },
    xChartData () {
      const len = this.option.categories.length
      return this.d3.range(len)
    },
    xScale () {
      return this.d3
              .scaleBand()
              .domain(this.xChartData)
              .rangeRound(this.xPixelRange)
              .padding(this.option.gap)
    },
    yScale () {
      return this.d3
              .scaleLinear()
              .domain(this.yChartRange)
              .range(this.yPixelRange)
    }
  },
  data() {
    return {
    }
  },
  mounted () {
    this.drawAxis()
  },
  methods: {
    drawAxis () {
      let svg = this.d3.select('#svg')
      const xAxisGenerator = this.d3[this.axisX](this.xScale)
      const yAxisGenerator = this.d3[this.axisY](this.yScale)
      // 绘制x坐标轴
      svg.append('g')
      .attr('transform', this.transform[this.axisPosition][0])
      .call(xAxisGenerator)
      .selectAll('text')
      .text(n => this.option.categories[n])
      .attr('font-size', this.option.fontSize || '12px')
      // 绘制y坐标轴
      svg
      .append('g')
      .attr('transform', this.transform[this.axisPosition][1])
      .call(yAxisGenerator)
      .attr('font-size', this.option.fontSize || '12px')
    },
    init () {
      // const xBandW = this.xScale.bandwidth()
      // /*获取系列的数量n*/
      // const n = this.data.length
      // /*用x轴的像素宽除以系列数，得到列宽colW*/
      // const colW = xBandW / n
      // /*计算调色盘颜色数量colorLen*/
      // const colorLen = this.color.length
    }
  }
}
</script>

<style lang="scss" scoped>
</style>