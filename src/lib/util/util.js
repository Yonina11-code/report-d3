export default class EaseObj {
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
    // console.log('pos.x', pos.x, pos.y)
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