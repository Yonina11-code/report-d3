const mixin = {
  props: {
    option: Object,
    data: Array
  },
  data () {
    return {
    }
  },
  methods: {
    // 鼠标移动事件
    // handleMouse () {
    //   const tip = this.d3.select('#main').append('div').attr('id', 'tip')
    //   console.log('tip', tip)
    //   const easeTip = new EaseObj(tip)
    //   const rects = this.d3.select('svg').selectAll('rect')
    //   rects.on('mouseover', ({ clientX, clientY }, { amount, name }) => {
    //    tip.style('display', 'block').html(`<div>${name}: ${amount}</div>`)
    //     console.log('easeTip', easeTip)
    //     easeTip.endPos = {
    //       x: clientX,
    //       y: clientY
    //     }
    //     easeTip.play = true
    //     console.log('easeTip', easeTip)
    //   })
    //   // 鼠标移动
    //   rects.on('mousemove', ({ clientX, clientY}) => {
    //     easeTip.endPos = {
    //       x: clientX,
    //       y: clientY
    //     }
    //   })
    //   // 鼠标划出
    //   rects.on('mouseout', () => {
    //     tip.style('display', 'none')
    //     easeTip.play = false
    //   })
    // }
  }
}
export default mixin