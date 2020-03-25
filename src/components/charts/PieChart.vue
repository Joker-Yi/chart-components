<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'
  export default {
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
        default: '300px'
      },
      chartData: {
        type: Array,
        default: () => [],
        required: true
      },
      legendType: {
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
      setOptions(data) {
        let total = 0
        this.chartData.forEach((i) => {
          total += i.value
        })
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)',
          },
          legend: {
            right: 'right',
            bottom: 'middle',
            data: this.legendType
            // data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
          },
          title: {
            zlevel: 0,
            text: [
              '{value|' + total + '}',
              '{name|总数}',
            ].join('\n'),
            rich: {
              value: {
                color: '#303133',
                fontSize: 40,
                fontWeight: 'bold',
                lineHeight: 40,
              },
              name: {
                color: '#909399',
                lineHeight: 20
              },
            },
            padding: [5,5,5,0],
            top: 'middle',
            left: '50%',
            textAlign: 'center',
            // textVerticalAlign: 'middle',
            textStyle: {
              rich: {
                value: {
                  color: '#303133',
                  fontSize: 30,
                  fontWeight: 'bold',
                  lineHeight: 30,
                },
                name: {
                  color: '#909399',
                  lineHeight: 20
                },
              },
            },
          },
          series: [
            {
              name: 'WEEKLY WRITE ARTICLES',
              type: 'pie',
              top: 'top',
              // roseType: 'radius',
              radius: ['65%', '80%'],
              zlevel: 1,
              data: data,
              label: {
                normal: {
                  show: false,
                  backgroundColor: '#fff',
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  formatter: [
                    '{bt|{b}}',
                    '({num|{c}/'+total+'})'
                  ].join('\n'),
                  rich: {
                    bt: {
                      fontSize: '25',
                      lineHeight: '40'
                    },
                    num: {
                      fontSize: '12'
                    }
                  }
                }
              },
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.chartData)
      }
    }
  }
</script>

<style scoped>

</style>
