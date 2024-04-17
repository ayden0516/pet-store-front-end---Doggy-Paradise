<template>
  <div>
    <canvas ref="chart" class="chart-canvas"></canvas>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import Chart from "chart.js/auto";

export default {
  name: "CombinedCharts",
  setup() {
    const chart = ref(null);

    onMounted(() => {
      fetchDataAndDrawCharts();
    });

    const fetchDataAndDrawCharts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/employee/roomReservation"
        );
        const data = await response.json();

        // 处理数据
        const roomData = processRoomData(data);

        // 绘制图表
        drawCharts(roomData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const processRoomData = (data) => {
      const roomData = {};
      data.forEach((item) => {
        const roomName = item.room.roomName;
        const stars = item.star;
        if (stars !== null) {
          // 只处理不为 null 的数据
          if (!roomData[roomName]) {
            roomData[roomName] = { starSum: 0, ratingCount: 0 };
          }
          roomData[roomName].starSum += stars;
          roomData[roomName].ratingCount++;
        }
      });
      return roomData;
    };

    const drawCharts = (roomData) => {
      const labels = Object.keys(roomData);
      const starSums = labels.map((roomName) => roomData[roomName].starSum);
      const ratingCounts = labels.map(
        (roomName) => roomData[roomName].ratingCount
      );
      const averageStars = starSums.map((sum, index) => {
        return ratingCounts[index] !== 0
          ? Math.floor(sum / ratingCounts[index])
          : 0; // 避免除以0
      });

      const ctx = chart.value.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Number of Ratings",
              data: ratingCounts,
              backgroundColor: "rgb(255, 120, 53)",
            },
            {
              label: "Average Star",
              data: averageStars,
              backgroundColor: "rgb(255, 238, 53)",
              yAxisID: "star",
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Ratings",
              },
              ticks: {
                stepSize: 1, // 设置刻度间隔为1
              },
            },
            star: {
              position: "right",
              title: {
                display: true,
                text: "Average Star",
              },
              ticks: {
                stepSize: 1, // 设置刻度间隔为1
              },
            },
            x: {
              title: {
                display: true,
                text: "Rooms",
              },
            },
          },
        },
      });
    };

    return { chart };
  },
};
</script>

<style scoped>
</style>
