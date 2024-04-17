<template>
  <div>
    <div class="flex">
      <RoomChart class="chart-canvas" :reservations="reservationsData" />
      <RoomStarChart class="chart-canvas" />
    </div>
    <RoomPieChart class="chart-canvas" :reservations="reservationsData" />
  </div>
</template>

<script>
import RoomChart from "@/components/room/RoomChart.vue";
import RoomStarChart from "@/components/room/RoomStarChart.vue";
import RoomPieChart from "@/components/room/RoomPieChart.vue";

export default {
  components: {
    RoomChart,
    RoomStarChart,
    RoomPieChart,
  },
  data() {
    return {
      reservationsData: [], // 你的预订数据应该在这里
    };
  },
};
</script>

<style scoped>
.chart-canvas {
  width: 48%;
  height: 350px;
  margin: 2rem auto;
  padding: 20px;
  border: 1px solid rgb(216, 215, 215);
  border-radius: 10px;
  /* box-shadow: -10px 10px 2px rgba(183, 183, 183, 0.5); */
}

.flex {
  display: flex;
  width: 100%;
  /* justify-content: space-between; */
}
</style>
