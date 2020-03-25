<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'
export default {
  name: 'barChart',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    yData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chart: null,
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({up, down}={}) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['上传', '下载']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          data: this.yData
          // data: ['No.1', 'No.2', 'No.3', 'No.4', 'No.5', 'No.6', 'No.7','No.8','No.9','No.10'].reverse()
        },
        series: [
          {
            name: '上传',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'inside',
              formatter: '{a}: {c} GB'
            },
            data: up
          },
          {
            name: '下载',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'inside',
              formatter: '{a}: {c} GB'
            },
            data: down
          },
        ]
      })
    }
  }
}
</script>

<style scoped>

</style>
