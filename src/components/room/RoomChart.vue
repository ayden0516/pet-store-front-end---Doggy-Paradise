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

        const roomData = processRoomData(data);

        drawCharts(roomData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const processRoomData = (data) => {
      const roomData = {};
      data.forEach((item) => {
        const roomName = item.room.roomName;
        const totalPrice = item.totalPrice;
        if (!roomData[roomName]) {
          roomData[roomName] = { orderCount: 0, totalPrice: 0 };
        }
        roomData[roomName].orderCount++;
        roomData[roomName].totalPrice += totalPrice;
      });
      return roomData;
    };

    const drawCharts = (roomData) => {
      const labels = Object.keys(roomData);
      const orderCounts = labels.map(
        (roomName) => roomData[roomName].orderCount
      );
      const totalPrices = labels.map(
        (roomName) => roomData[roomName].totalPrice
      );

      const ctx = chart.value.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Order Counts",
              data: orderCounts,
              backgroundColor: "rgb(75, 192, 192)",
            },
            {
              label: "Total Price",
              data: totalPrices,
              backgroundColor: "rgb(255, 99, 132)",
              yAxisID: "price",
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Order Counts",
              },
              ticks: {
                stepSize: 1, // 设置刻度间隔为1
              },
            },
            price: {
              position: "right",
              beginAtZero: true,
              title: {
                display: true,
                text: "Total Price",
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

<style scoped></style>
