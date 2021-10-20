export const option = {
  size: {
    with: 600,
    height: 600
  }, // 画布大小
  fontSize: '16px', // 文字大小
  // gap: 50,
  backgroundColor: '', // 背景色
  title: '柱状图',
  titlePosition: '', // 标题位置 top 、center、bottom
  axisPosition: 'bottom', // 坐标轴线的位置
  categories: ['html','css','js'], //横坐标轴显示的内容
  dimensions: ['学习人数','就业人数'],  // 横坐标轴中每个类目， 需要显示的种类
  initAnimate: true, // 是否需要初始动画
  pointDisplay: true, // 鼠标移入时是否显示数据
  animateStyle: 'easeBackIn', // 动画效果
  displaySplit: true, // 是否显分割线
  splitStyle: 'solid', // 线条样式
  gap: 0.3, // 类目的内边距 百分比单位
  splitSize: 2, // 线条大小 2px
}