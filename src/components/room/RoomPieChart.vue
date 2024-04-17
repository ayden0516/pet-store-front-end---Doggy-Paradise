<template>
  <div>
    <canvas ref="pieChart" width="400" height="400"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import axios from "axios";

export default {
  name: "RoomPieChart",
  props: {
    reservations: {
      type: Array,
      required: true,
    },
  },
  mounted() {
    this.fetchDataAndRenderChart();
  },
  methods: {
    fetchDataAndRenderChart() {
      axios
        .get("http://localhost:8080/employee/roomReservation")
        .then((response) => {
          const reservations = response.data;
          this.renderPieChart(reservations);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    },
    renderPieChart(reservations) {
      if (!Array.isArray(reservations)) {
        console.error("Reservations must be an array");
        return;
      }

      const cancelReasons = this.getCancelReasons(reservations);
      const ctx = this.$refs.pieChart.getContext("2d");
      new Chart(ctx, {
        type: "pie",
        data: {
          labels: Object.keys(cancelReasons),
          datasets: [
            {
              label: "Cancel Reasons",
              data: Object.values(cancelReasons),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
        },
      });
    },
    getCancelReasons(reservations) {
      if (reservations.cancelDirection !== null) {
        const basicReasons = ["選錯房間", "行程取消", "找到其他家更便宜的旅館"];

        const cancelReasons = {};
        reservations.forEach((reservation) => {
          if (reservation.cancelDirection) {
            if (basicReasons.includes(reservation.cancelDirection)) {
              if (cancelReasons.hasOwnProperty(reservation.cancelDirection)) {
                cancelReasons[reservation.cancelDirection]++;
              } else {
                cancelReasons[reservation.cancelDirection] = 1;
              }
            } else {
              const otherReason = "其他原因";
              if (cancelReasons.hasOwnProperty(otherReason)) {
                cancelReasons[otherReason]++;
              } else {
                cancelReasons[otherReason] = 1;
              }
            }
          }
        });
        return cancelReasons;
      }
    },
  },
};
</script>

<style scoped></style>
