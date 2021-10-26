<template>
  <div>
    <svg width="400" height="400">
      <g></g>
    </svg>
  </div>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const arcgenerator = this.d3.arc().innerRadius(80).outerRadius(120).startAngle(0)
      const picture = this.d3.select('svg').append('g').attr('transform', 'translate(120, 120)')
      picture.append('path').datum({ endAngle: 2 * Math.PI }).style('fill', '#e34848').attr('d', arcgenerator)
      picture.append('path').datum({ endAngle: Math.PI / 2 }).style('fill', '#fef4e7').attr('d', arcgenerator)
      // 圆心样式
      this.d3.select('g').append('text').text(12).attr('text-anchor', 'middle').attr('domaint-baseline', 'middle').attr('font-size', '38px')

    }
  }
}
</script>

<style lang="scss" scoped>
</style>