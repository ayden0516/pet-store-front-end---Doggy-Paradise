<template>
  <div class="main">
    <div class="flex">
      <h2 class="page-title">取消訂房紀錄</h2>
    </div>
    <table class="table room-table">
      <thead>
        <tr>
          <th>訂房時段</th>
          <th>訂房Id</th>
          <th>房號</th>
          <th>寵物名稱</th>
          <th>費用</th>
          <th>訂房時間</th>
          <th>取消原因</th>
          <th>取消時間</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredReservations.length === 0">
          <td colspan="8">沒有取消紀錄</td>
        </tr>
        <tr
          v-for="(reservation, reservationId) in filteredReservations"
          :key="reservationId"
        >
          <td>
            {{ formatDate(reservation.startTime) }} -
            {{ formatDate(reservation.endTime) }}
          </td>
          <td>{{ reservation.reservationId }}</td>
          <td>{{ reservation.room.roomName }}</td>
          <td>{{ reservation.dog.dogName }}</td>
          <td>{{ reservation.totalPrice }}</td>
          <td>{{ formatDate(reservation.reservationTime) }}</td>
          <td>{{ reservation.cancelDirection }}</td>
          <td>{{ formatDate(reservation.cancelTime) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const reservations = ref([]);

onMounted(() => {
  axios
    .get("http://localhost:8080/room/allRoomReservationByUser")
    .then((response) => {
      reservations.value = response.data;
    });
});

const filteredReservations = computed(() => {
  return reservations.value.filter((reservation) => {
    // console.log(reservation.reservationId);
    // console.log(reservation.cancelTime);
    return reservation.cancelTime != null;
  });
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const handleModifyReservation = (reservationId, str) => {
  router.push({
    name: "u_page",
    params: { reservationId: reservationId, str: str },
  });
};
</script>

<style scoped>
.main {
  margin: 2rem;
}

.flex {
  width: 95%;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.page-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.room-table {
  width: 95%;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 2rem;
}

.room-table th {
  background-color: rgb(255, 231, 137);
  padding: 1rem;
  position: sticky;
  top: 0;
}

.room-table td {
  /* border: 1px solid #c2bdbd; */
  padding: 20px;
}

.room-table th,
.room-table td {
  text-align: center;
}

/* .room-table th {
  background-color: rgb(255, 216, 157);
}

.room-table tr:nth-child(even) {
  background-color: rgb(248, 248, 244);
} */

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
</style>
