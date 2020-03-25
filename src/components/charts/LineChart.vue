<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'
export default {
  name: 'lineChart',
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
    xData: {
      type: Array,
      required: true
    },
    dateType: {
      required: true,
      default: 'hour'
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
    },
    xData: {
      deep: true,
      handler() {
        this.setOptions(this.chartData)
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
    this.getDate('day')
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
    getDate (type) {
      let base = +this.xData[1]
      let oneDay = 24*3600*1000
      let oneHour = 3600*1000
      let oneMonth = 3600*1000*24*30
      let date = []
      if (type === 'hour'){
        for (let i = 0; i < 24; i++) {
          if (i === 0){
            date.push(+new Date(base))
            continue
          }
          date.unshift(+new Date(base -= oneHour))
          // date.unshift(this.$moment(new Date(base -= oneHour)).format('DD HH:00' ))
        }
      }else if (type === 'day'){
        do {
          date.unshift(+new Date(base -= oneDay ))
        } while (date[0] > +this.xData[0])
      }else {
        do {
          date.unshift(+new Date(base -= oneMonth))
        } while (date[0] > +this.xData[0])
        if (new Date(date[0]).getMonth() === new Date(date[1]).getMonth()){
          date.shift()
        }
         // bug点: 因为1个月的计算是按照30天为标准 取最近一年 导致减12次oneMonth 可能第一项的月份跟第二项月份相同 列如 ['3.1','3.31',.....], 换种理解就是 因为减的时间为 30天,导致循环执行到第12次时, 当前date[0] 依然比 start 起始日期要大,会执行循环的第13次,多出一个月,需要去除
      }
      console.log(date);
      return date
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          data: this.getDate (this.dateType),
          // type: 'time',
          maxInterval: 3600 * 24 * 1000,
          boundaryGap: false,
          // boundaryGap: ['1%', '5%'],
          axisLabel: {
            // showMaxLabel: true,
            formatter: (value) => {
              // 格式化成月/日，只在第一个刻度显示年份
              // let date = new Date(Number(value));
              // console.log(value);
              // // console.log(date);
              // let texts = [(date.getMonth() + 1), date.getDate(),date.getHours()];
              // if (index === 0) {
              //   texts.unshift(date.getYear());
              // }
              // return texts.join('/');
              // console.log(this.$moment(Number(value)).format('DD HH:mm'));
              if (this.dateType === 'hour'){
                return this.$moment(Number(value)).format('HH:00')
              } else if (this.dateType === 'day'){
                return this.$moment(Number(value)).format('MM/DD')
              } else {
                return this.$moment(Number(value)).format('MM月')
              }
            }
          },
          axisTick: {
            show: true
          }
        },
        grid: {
          left: '2%',
          right: '2%',
          bottom: '2%',
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              formatter: (value) => {
                if (value.axisDimension === 'y'){
                  return value.value.toFixed(1)
                } else {
                  if (this.dateType === 'hour'){
                    return this.$moment(Number(value.value)).format('MM/DD HH:00')
                  } else if (this.dateType === 'day'){
                    return this.$moment(Number(value.value)).format('YYYY/MM/DD')
                  } else {
                    return this.$moment(Number(value.value)).format('YYYY/MM')
                  }
                }
              }
            }
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['expected', 'actual']
        },
        series: [
          {
            name: 'expected',
            itemStyle: {
              normal: {
                color: '#FF005A',
                lineStyle: {
                  color: '#FF005A',
                  width: 2
                }
              }
            },
            smooth: true,
            type: 'line',
            data: expectedData,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
            name: 'actual',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: actualData,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      })
    }
  }
}
</script>

<style scoped>

</style>
