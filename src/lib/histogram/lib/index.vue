<template>
  <div>
    <div id="main"></div>
  </div>
</template>

<script>
export default {
  name: 'histogram',
  props: {
    option: Object,
    data: Array
  },
  data() {
    return {
      color: [
        '#c23531',
        '#2f4554',
        '#61a0a8',
        '#d48265',
        '#91c7ae',
        '#749f83',
        '#ca8622',
        '#bda29a',
        '#6e7074',
        '#546570',
        '#c4ccd3'
      ],
      source: [] // 格式化后的数据
    }
  },
  watch: {
    /*优化数据源
     *   使用map方法遍历数据源
     *   将其中的数据变成对象：
     *   {
     *       rectData:柱状体数据,
     *       rectInd:柱状体索引,
     *       rectName:柱状体名称,
     *       seriesInd:系列索引,
     *       seriesName:系列名称
     *    }
     * */
    data: {
      handler(val) {
        this.source = val.map((seriesData, seriesInd) => {
          const seriesName = this.option.dimensions[seriesInd]
          return seriesData.map((rectData, rectInd) => {
            const rectName = this.option.categories[rectInd]
            return { rectData, rectInd, rectName, seriesInd, seriesName }
          })
        })
        console.log('data', this.source)
        this.$nextTick(() => {
          this.init()
        })
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // this.init()
    console.log('create', this.d3)
  },
  methods: {
    init() {
      /*===========2-建立容器对象===========*/
      /*获取main 容器*/
      const main = this.d3.select('#main')
      const { width= 600, height = 600 } = this.option.size || {}
      const svg = main
        .append('svg')
        .attr('version', 1.2)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)

      /*===========3-建立轴相关的基础数据===========*/
      // 判断x坐标轴的位置
      const axisPosition = this.option.axisPosition || 'bottom'
      const position = { 'bottom': ['axisBottom', 'axisLeft'], 'top': ['axisTop', 'axisLeft'], 'left': ['axisLeft', 'axisBottom']}
      const transform = { 'bottom': [`translate(0, ${height - 50})`, 'translate(50 0)'], 'top': [`translate(0 50)`, 'translate(50 0)'], 'left': [`translate(50, 0)`, `translate(0, ${height - 50})`] }
      const len = this.option.categories.length
      const xChartData = this.d3.range(len)

      /*x轴在像素坐标内的起始点和结束点 xPixelRange，左右各偏移50*/
      const xPixelRange = [50, width - 50]

      /*-----y轴相关的基础数据-----*/
      /*计算数据源中所有数据的极值 maxY
       *   用js原生方法flat()展开数据源，再通过max()方法取极值
       * */
      const maxY = Math.max(...this.data.flat())

      /*声明y轴在图表坐标系中的数据起点和结束点 yChartRange*/
      const yChartRange = [0, maxY]

      /*声明y轴在像素坐标系中的数据起点和结束点 yPixelRange*/
      const yPixelRange = [height - 50, 50]
      /*===========4-建立比例尺===========*/
      const xScale = this.d3
        .scaleBand()
        .domain(xChartData)
        .rangeRound(xPixelRange)
        .padding(this.option.gap)

      const yScale = this.d3
        .scaleLinear()
        .domain(yChartRange)
        .range(yPixelRange)
      /*===========5-建立轴对象===========*/
      const xAxisGenerator = this.d3[position[axisPosition][0]](xScale)
      svg
        .append('g')
        .attr('transform', transform[axisPosition][0])
        .call(xAxisGenerator)
        .selectAll('text')
        .text(n => this.option.categories[n])
        .attr('font-size', this.option.fontSize || '12px')

      const yAxisGenerator = this.d3[position[axisPosition][1]](yScale)
      svg
        .append('g')
        .attr('transform', transform[axisPosition][1])
        .call(yAxisGenerator)
        .attr('font-size', this.option.fontSize || '12px')
      /*===========6-建立绘图区相关的基础数据===========*/
      /*-----绘图区相关的基础数据-----*/
      const xBandW = xScale.bandwidth()

      /*获取系列的数量n*/
      const n = this.data.length

      /*用x轴的像素宽除以系列数，得到列宽colW*/
      const colW = xBandW / n

      /*计算调色盘颜色数量colorLen*/
      const colorLen = this.color.length

      /*===========7-架构绘图区===========*/
      /*在svg中建立系列集合seriesObjs，在系列集合中建立系列对象
       *   在svg中append 加入g 对象
       *   selectAll() 选择所有g元素，此处终点不在选择，而是建立一个选择集对象
       *   用data() 方法将具备系列信息的数据源source绑定到系列集合中
       *   用join() 基于数据源批量创建g元素，一个g代表一个系列，之后每个g元素里都会放入三个不同类目的柱状体
       *   用transform 属性中的translate设置系列的x像素位——列宽乘以系列索引
       *   基于系列索引，从调色盘中取色，然后将其作为一个系列中所有图形的填充色
       * */
      const seriesObjs = svg
        .append('g')
        .selectAll('g')
        .data(this.source)
        .join('g')
        .attr('transform', (seriesData, seriesInd) => {
          const seriesX = colW * seriesInd
          console.log('seriesX', seriesX)
          return `translate(${seriesX},0)`
        })
        .attr(
          'fill',
          (seriesData, seriesInd) => this.color[seriesInd % colorLen]
        )

      /*在系列集合中建立柱状体集合rects
       *   用系列集合seriesObjs 的selectAll()方法选择所有的rect元素，用于建立选择集对象
       *   用data()方法将之前绑定在每个系列集合中的数据绑定到柱状体集合中
       *   用join()基于每个系列的数据数据批量创建rect元素
       *   用classed() 方法为其添加item属性
       * */
      const rects = seriesObjs
        .selectAll('rect')
        .data(seriesData => seriesData)
        .join('rect')
        .classed('item', true)

      rects
        .attr('x', ({ rectData = '' }, rectInd) => {
          console.log('rectData', rectData)
          return xScale(rectInd)
        })
        .attr('width', colW)
        .attr('y', () => yScale(0))
        .attr('height', 0)

      rects
        .transition()
        .duration(1000)
        .delay(({ rectInd, seriesInd }) => {
          // return seriesInd*300
          return (seriesInd + rectInd) * 300
        })
        .ease(this.d3[this.option.animateStyle])
        .attr('y', ({ rectData }) => yScale(rectData))
        .attr('height', ({ rectData }) => yScale(0) - yScale(rectData))
      const tip = main.append('div').attr('id', 'tip')

      /*===========10-为柱状体添加鼠标事件===========*/
      /*缓动跟随
       *   更新终点位置endPos
       *   开始缓动跟随
       * */
      if (this.option.pointDisplay) {
        rects.on(
          'mouseover',
          ({ clientX, clientY }, { seriesName, rectName, rectData }) => {
            tip.style('display', 'block').html(`
                  <div>${seriesName}</div>
                  <div>${rectName}：${rectData}</div>
              `)

            easeTip.endPos = {
              x: clientX,
              y: clientY
            }
            easeTip.play = true
          }
        )

        /*-----鼠标移动事件 mousemove-----*/
        /*设置提示left、top位置*/
        /*缓动跟随
        *   更新终点位置endPos
        * */
        rects.on('mousemove', ({ clientX, clientY }) => {
          easeTip.endPos = {
            x: clientX,
            y: clientY
          }
        })
      }

      /*-----鼠标划出事件 mouseout-----*/
      /*隐藏提示*/
      /*缓动跟随
       *   删除动画帧
       * */
      rects.on('mouseout', () => {
        tip.style('display', 'none')
        easeTip.play = false
      })

      /*===========12-提示的缓动跟随===========*/
      /*EaseObj 缓动对象
       *   target 缓动目标
       *   fm 当前动画帧
       *   pos 绘图位置
       *   endPos 目标位置
       *   ratio 移动比例，如0.1
       *   _play 是否开始缓动跟随
       * */
      class EaseObj {
        /*构造函数*/
        constructor(target) {
          this.target = target
          this.fm = 0
          this.pos = { x: 0, y: 0 }
          this.endPos = { x: 0, y: 0 }
          this.ratio = 0.1
          this._play = false
        }
        /*play 属性的取值器*/
        get play() {
          return this._paly
        }
        /*play 属性的赋值器
         *   现在的值不等于当过去值时
         *       当现在的值为true时
         *           缓动跟随
         *           更新目标对象
         *           连续渲染
         *       当现在的值为false时
         *           删除动画帧，取消连续渲染
         * */
        set play(val) {
          if (val !== this._play) {
            if (val) {
              this.render()
            } else {
              this.cancel()
            }
            this._play = val
          }
        }

        /*render 渲染方法
         *   按比值，让pos位置接近终点endPos
         *   更新目标对象target的样式
         *   连续渲染
         * */
        render () {
          const { target, pos, endPos, ratio } = this
          pos.x += (endPos.x - pos.x) * ratio
          pos.y += (endPos.y - pos.y) * ratio
          console.log('pos.x', pos.x, pos.y)
          target.style('left', `${pos.x}px`).style('top', `${pos.y}px`)
          this.fm = requestAnimationFrame(() => {
            this.render()
          })
        }

        /*cancel 删除动画帧，取消连续渲染*/
        cancel() {
          cancelAnimationFrame(this.fm)
        }
      }
      /*easeTip 实例化缓动对象*/
      const easeTip = new EaseObj(tip)
    },
    draw() {}
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}
#main {
  margin: 20px;
  width: 600px;
  height: 600px;
  border: 1px solid #ddd;
}
.item {
  cursor: pointer;
}
.item:hover {
  opacity: 0.9;
}
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
