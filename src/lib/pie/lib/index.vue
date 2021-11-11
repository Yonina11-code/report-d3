<template>
  <div id="main-pie">
    <h1>{{option.title}}</h1>
    <svg id="pie"></svg>
  </div>
</template>
<script>
import mixins from '../../util/minix.js'
import EaseObj from '../../util/util.js'
export default {
  name: 'pie',
  mixins: [mixins],
  props: {
    option: Object,
    data: Array
  },
  data() {
    return {
    }
  },
  mounted () {
    this.init()
    this.handleFormat()
    this.handleMouse()
  },
  methods: {
    init () {
      const { width, height } = this.option.size || {}
      const { radius, innerRadius = 0 } = this.option || {}
      const main =  this.d3.select('#pie')
      .attr('width', width)
      .attr('height', height)
      const data = this.handleFormat()
      // 创建计算弧形路径的函数
      const arc = this.d3.arc()
                  .innerRadius(innerRadius)
                  .outerRadius(radius)
      const outerArc = this.d3.arc() // 主要是绘制标注线的时候有用到
                    .innerRadius(radius)
                    .outerRadius(radius)
      // const slices = main.append('g').attr('class', 'slices')
      // 添加弧形元素(g中的path)
      const arcs = main.selectAll('g')
            .data(data)
            .enter()
            .append('g')
            .attr('transform', `translate(${width/2}, ${height/2})`)
      arcs.append('path')
            .attr('fill', (d, i) => {
              return this.getColor(i)
            })
            .attr('d', d => {
              return arc(d)
            })
      // 添置标注
      arcs.append('text')
          .attr('transform', (d) => {
            const x = arc.centroid(d)[0] * 2.8
            const y = arc.centroid(d)[1] * 2.8
            return `translate(${x}, ${y})`
          })
          .attr('text-anchor', 'middle')
          .text((d) => {
            let percent = Number(d.value) / this.d3.sum(this.data, d => {
              return d['amount']
            }) * 100
            return `${d.data['name']} ${percent.toFixed(1)}%`
          })
      // 加上连线
      arcs.append('line')
          .attr('stroke', (d, i) => {
            return this.getColor(i)
          })
          // .attr('points', function(d) {
          //   return [arc.centroid(d), arc.centroid(d), arc.centroid(d)]
          // })
          // .attr('points', (d)=> {
          //   var pos = outerArc.centroid(d);
          //   pos[0] = radius * (this.midAngel(d)<Math.PI ? 1.5 : -1.5);
          //   return [outerArc.centroid(d), outerArc.centroid(d), pos];
          // })
          .style('opacity', 0.5)
          .attr('x1', d => {
            console.log('11', arc.centroid(d)[0])
            return arc.centroid(d)[0]
          })
          .attr('y1', (d) => {
            return arc.centroid(d)[1]
          })
          .attr('x2', d => {
            return outerArc.centroid(d)[0] * 0.8
          })
          .attr('y2', d => {
            return outerArc.centroid(d)[1] * 0.8
          })
          .attr('transform', (d) => {
            console.log('transform', arc.centroid(d)[0])
            const x = arc.centroid(d)[0]
            const y = arc.centroid(d)[1]
            return `translate(${x}, ${y})`
          })
    },
    // 将原始数据转换成用于绘图的数据
    handleFormat () {
      const pie = this.d3.pie()
                    .sort(null)
                    .value( d => {
                      return d.amount
                    })
      const formatData =  pie(this.data)
      return formatData
    },
    getColor (idx) {
      const palette = [
        '#2ec7c9', '#b6a2de', '#5ab1ef', '#ffb980', '#d87a80',
        '#8d98b3', '#e5cf0d', '#97b552', '#95706d', '#dc69aa',
        '#07a2a4', '#9a7fd1', '#588dd5', '#f5994e', '#c05050',
        '#59678c', '#c9ab00', '#7eb00a', '#6f5553', '#c14089'
      ]
      return palette[idx % palette.length]
    },
    midAngel(d) {
      return d.startAngle + (d.endAngle - d.startAngle)/2;
    },
    // 鼠标移动事件
    handleMouse () {
      let _this =this
      const tip = this.d3.select('#main-pie').append('div').attr('id', 'tip')
      console.log('tip', tip)
      const easeTip = new EaseObj(tip)
      const rects = this.d3.select('#main-pie').selectAll('path')
      rects.on('mouseover', function (client, { data })  {
        console.log('client', client)
       tip.style('display', 'block').html(`<div>${data.name}: ${data.amount}</div>`)
        console.log('easeTip', easeTip)
        easeTip.endPos = {
          x: client.pageX,
          y:  client.pageY
        }
        easeTip.play = true
        _this.d3.select(this).attr('transform', 'scale(1.1)')
                             .attr('box-shadow', '0px 0px 30px #ccc')
                             .attr('transition-duration', '5s')
        console.log('easeTip', easeTip)
      })
      // 鼠标移动
      rects.on('mousemove', function (client) {
        easeTip.endPos = {
          x: client.pageX,
          y:  client.pageY
        }
        _this.d3.select(this).attr('transform', 'scale(1.1)')
                             .attr('box-shadow', '0px 0px 30px #ccc')
                             .attr('transition-duration', '5s')
      })
      // 鼠标划出
      rects.on('mouseout', function () {
        tip.style('display', 'none')
        _this.d3.select(this).attr('transform', 'scale(1)')
                             .attr('box-shadow', 'none')
                             .attr('transition-duration', '5s')
        easeTip.play = false
      })
    }
  }
}
</script>

<style>
</style>