<template>
  <div>
    <!-- 評分分布 ex.1 2 3 4 5 分別幾人 語意分析 星1 評論針對甚麼3分以下負 45正 -->
    <canvas ref="starChart" width="400" height="400"></canvas>
  </div>
</template>
<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";
export default {
  data() {
    return {
      chart: null,
      chartData: [],
      chartOptions: {},
    };
  },
  mounted() {
    this.fetchChartData();
  },
  methods: {
    fetchChartData() {
      axios
        .get("/your-backend-api-endpoint")
        .then((response) => {
          // Assuming your backend returns chartData and chartOptions
          this.chartData = response.data.chartData;
          this.chartOptions = response.data.chartOptions;

          this.createChart();
        })
        .catch((error) => {
          console.error("Error fetching chart data:", error);
        });
    },
    createChart() {
      const ctx = this.$refs.chartCanvas.getContext("2d");
      this.chart = new Chart(ctx, {
        type: "bar", // Change to the desired chart type
        data: this.chartData,
        options: this.chartOptions,
      });
    },
  },
};
</script>
<style></style>
