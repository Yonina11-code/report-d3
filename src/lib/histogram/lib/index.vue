<template>
  <div id="main">
    <h1>{{option.title}}</h1>
    <svg id="svg" :width="width" :height="height"></svg>
  </div>
</template>
<script>
import EaseObj from './index.js'
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
      return  { 'bottom': [`translate(0, ${this.height - 50})`, 'translate(50 0)'], 'top': ['translate(0 50)', 'translate(50 0)'], 'left': [`translate(50, 0)`, `translate(0, ${this.height - 50})`] }
    },
    // x轴在像素坐标内的起始点和结束点 xPixelRange，左右各偏移50
    xPixelRange () {
      switch (this.option.axisPosition) {
        case 'left':
          return [this.width - 50, 50]
        default:
          return [50, this.width - 50]
      }
    },
    // y轴的极值
    maxY () {
      // data 是纯数字的情况下
      return  this.d3.max(this.data, d => {
        return d[this.option.valueName]
      })
    },
    // 声明y轴在图表坐标系中的数据起点和结束点 yChartRange
    yChartRange () {
      console.log('this.axisY', this.axisY, this.axisX)
      switch (this.option.axisPosition) {
        case 'left':
          return [this.maxY, 0]
        default:
          return [0, this.maxY]
      }
    },
    // 声明y轴在像素坐标系中的数据起点和结束点 yPixelRange
    yPixelRange () {
      console.log('this.position', this.position)
      switch (this.option.axisPosition) {
        case 'top':
          return [50, this.height - 50]
        default:
          return [this.height - 50, 50]
      }
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
    },
    svgHeight () {
      return this.width / 1.61803398875; // 黄金比例
    }
  },
  data() {
    return {
    }
  },
  mounted () {
    this.drawAxis()
    this.animateLoad()
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
    },
    animateLoad () {
            const itemSize = this.option.itemSize
            this.d3.select('svg')
             .selectAll('rect')
             .data(this.data)
             .enter()
             .append('rect')
             .transition()
             .delay((d, i) => {
               return i * 5
             })
             .duration(1000)
             .attr('y', (d, i) => {
               console.log('axisX', this.axisX)
               switch (this.axisX) {
                 case 'axisBottom':
                  return this.yScale(d[this.option.valueName])
                case 'axisTop':
                  return this.yPixelRange[0]
                case 'axisLeft':
                  return this.xScale(i)
               }
             })
             .attr('x', (d, i) => {
                switch (this.axisX) {
                  case 'axisLeft':
                    return 50
                  default:
                    return this.xScale(i)
                }
             })
             .attr('height', (d) => {
                switch (this.axisX) {
                 case 'axisBottom':
                  return this.yScale(0) - this.yScale(d[this.option.valueName])
                case 'axisTop':
                  return this.yScale(d[this.option.valueName]) - 50
                case 'axisLeft':
                  return itemSize
                }
             })
             .attr('width', (d) => {
               console.log('this.xScale(d[this.option.valueName])', this.xScale(d[this.option.valueName]))
               switch (this.axisX) {
                  case 'axisLeft':
                    return this.yScale(d[this.option.valueName]) - 50
                  default:
                    return itemSize
               }
             })
             .attr("fill","steelblue")
            this.handleMouse()
    },
    // 鼠标移动事件
    handleMouse () {
      const tip = this.d3.select('#main').append('div').attr('id', 'tip')
      const easeTip = new EaseObj(tip)
      const rects = this.d3.select('svg').selectAll('rect')
      rects.on('mouseover', ({ clientX, clientY }, { amount, name }) => {
       tip.style('display', 'block').html(`<div>${name}: ${amount}</div>`)
        console.log('easeTip', easeTip)
        easeTip.endPos = {
          x: clientX,
          y: clientY
        }
        easeTip.play = true
        console.log('easeTip', easeTip)
      })
      // 鼠标移动
      rects.on('mousemove', ({ clientX, clientY}) => {
        easeTip.endPos = {
          x: clientX,
          y: clientY
        }
      })
      // 鼠标划出
      rects.on('mouseout', () => {
        tip.style('display', 'none')
        easeTip.play = false
      })
    }
  }
}
</script>

<style>
#tip {
  position: absolute;
  margin-left: 10px;
  margin-top: 30px;
  line-height: 22px;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 4px 9px;
  font-size: 13px;
  color: #fff;
  border-radius: 3px;
  pointer-events: none;
  display: none;
}
</style>