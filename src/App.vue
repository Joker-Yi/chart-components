<template>
  <div id="app">
    <pie-chart :chart-data="data" :legend-type="legendType" width="500px" height="200px"></pie-chart>
    <div class="block">
      <el-date-picker
          v-model="value"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
      </el-date-picker>
    </div>
    <line-chart :chart-data="data2" width="800px" :x-data="value" :dateType="dateType"></line-chart>
    <bar-chart :chart-data="data3" width="800px" :y-data="yData"></bar-chart>
  </div>
</template>

<script>
import PieChart from "./components/charts/PieChart";
import LineChart from "./components/charts/LineChart";
import BarChart from "./components/charts/BarChart";
export default {
  name: 'App',
  components: {PieChart, LineChart, BarChart},
  data() {
    return {
      data: [
        { value: 320, name: 'Industries' },
        { value: 240, name: 'Technology' },
        { value: 149, name: 'Forex' },
        { value: 100, name: 'Gold' },
        { value: 59, name: 'Forecasts' }
      ],
      data1: {
        expectedData: [100, 120, 161, 134, 105, 160, 165],
        actualData: [120, 82, 91, 154, 162, 140, 145]
      },
      data2: {
        expectedData: [100, 120, 161, 134, 105, 160, 165,120, 82, 91, 154, 162, 140, 145,120, 82, 91, 154, 162, 140, 145,120,156,123],
        actualData: [120, 82, 91, 154, 162, 140, 145,161, 134, 105, 160, 165,120, 82,161, 134, 105, 160, 165,120, 82,120, 82, 91,]
      },
      day: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],

      legendType: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts'],
      pickerOptions: {
        shortcuts: [{
          text: '最近24小时',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', [start, end]);
          }
        },{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        },{
          text: '最近一年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value: [new Date()- 3600 * 1000 * 24,new Date()],
      dateType: 'hour', // 日期类型 用于x轴的显示 day x轴显示为日, hour x轴显示为小时
      data3: {
        up: [820, 832, 901, 934, 1290, 1310, 1320,1290, 1330, 1320],
        down: [250, 265, 320, 860, 900, 1010, 1020,1290, 1330, 1350]
      },
      yData: ['No.1', 'No.2', 'No.3', 'No.4', 'No.5', 'No.6', 'No.7','No.8','No.9','No.10'].reverse()
    }
  },
  watch: {
    value: {
      deep: true,
      handler(val) {
        let temp = val[1] - val[0]
        if (temp <= 3600 * 1000 * 24){
          this.dateType = 'hour'
        }else if (temp < 3600 * 1000 * 24 * 365){
          this.dateType = 'day'
        } else {
          this.dateType = 'month'
        }
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-wrap: wrap;
}
</style>
