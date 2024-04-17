<template>
  <div class="main">
    <div class="flex">
      <h2 class="page-title">預約訂房管理</h2>
      <!-- <button class="btn" data-hover="click me!">
        <div>Button</div>
      </button> -->
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
          <th>修改時段</th>
          <th>取消訂房</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="reservations.length === 0">
          <td colspan="8">沒有預約紀錄</td>
        </tr>
        <tr
          v-for="(reservation, reservationId) in reservations"
          :key="reservationId"
        >
          <td>
            <span
              class="icon"
              v-if="
                new Date(reservation.startTime) <= new Date() &&
                new Date(reservation.endTime) > new Date()
              "
              ><i class="fa-solid fa-bookmark"></i
            ></span>
            {{ formatDate(reservation.startTime) }} -
            {{ formatDate(reservation.endTime) }}
          </td>
          <td>{{ reservation.reservationId }}</td>
          <td>{{ reservation.room.roomName }}</td>
          <td>{{ reservation.dog.dogName }}</td>
          <td>{{ reservation.totalPrice }}</td>
          <td>{{ formatDate(reservation.reservationTime) }}</td>
          <!-- <td v-if="formatDate(reservation.cancelTime) != '1970/01/01'">
            {{ formatDate(reservation.cancelTime) }}
          </td>
          <td v-else></td>
          <td v-if="formatDate(reservation.cancelTime) != '1970/01/01'">
            {{ reservation.cancelDirection }}
          </td>
          <td v-else></td> -->
          <td>
            <button
              v-if="!isStartDateWithinThreeDays(reservation.startTime)"
              class="btn btn-update"
              @click="
                handleModifyReservation(reservation.reservationId, 'update')
              "
            >
              修改時段
            </button>
          </td>
          <td>
            <button
              v-if="!isStartDateWithinThreeDays(reservation.startTime)"
              class="btn btn-cancel"
              @click="
                handleModifyReservation(reservation.reservationId, 'cancel')
              "
            >
              取消訂房
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const reservations = ref([]);

onMounted(() => {
  axios.get("http://localhost:8080/room/reservation/order").then((response) => {
    // 日期排列順序反過來
    reservations.value = response.data;
  });
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};

// const filteredReservations = computed(() => {
//   return reservations.value.filter((reservation) => {
//     if (reservation.cancelTime == null) {
//       return isEndDateAfterToday(reservation.endTime);
//     }
//   });
// });

// // 定義檢查結束日期是否大於當前日期的方法
// const isEndDateAfterToday = (endDate) => {
//   const today = new Date();
//   const end = new Date(endDate);
//   return end > today;
// };

const isStartDateWithinThreeDays = (startDate) => {
  const today = new Date();
  const start = new Date(startDate);
  const differenceInTime = start.getTime() - today.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return differenceInDays <= 3;
};

const handleModifyReservation = (reservationId, str) => {
  setTimeout(() => {
    router.push({
      name: "u_page",
      params: { reservationId, str },
    });
  }, 500); // 添加延遲，確保頁面跳轉完成後再刷新;
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

.room-table th,
.room-table td {
  text-align: center;
}

.room-table td {
  /* border: 1px solid #c2bdbd; */
  padding: 20px 0;
}

/* .room-table th {
  background-color: rgb(255, 216, 157);
}

.room-table tr:nth-child(even) {
  background-color: rgb(248, 248, 244);
} */

.btn {
  padding: 8px 16px;
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.5s;
}

.btn-update {
  border: 1px solid #49c936;
  color: #49c936;
}

.btn-update:hover {
  color: #fff;
  background-color: #63dc50;
}

.btn-cancel {
  border: 1px solid #dc362a;
  color: #dc362a;
}

.btn-cancel:hover {
  background-color: #e55c4a;
  color: #fff;
}

.icon {
  margin-right: 0.5rem;
  color: rgb(241, 189, 101);
}
</style>
