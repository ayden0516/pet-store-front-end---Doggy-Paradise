<template>
  <div class="main">
    <div class="flex">
      <h2 class="page-title">歷史訂房紀錄</h2>
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
          <th>評分</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredReservations.length === 0">
          <td colspan="7">沒有歷史紀錄</td>
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
          <td>
            <button
              class="btn btn-primary"
              @click="
                handleModifyReservation(reservation.reservationId, 'score')
              "
              v-if="reservation.star == null"
            >
              評分
            </button>
            <button
              class="btn btn-end"
              v-else
              data-bs-toggle="modal"
              :data-bs-target="'#exampleModal_' + reservation.reservationId"
            >
              已評分
            </button>
            <!-- modal -->
            <div
              class="modal fade"
              :id="'exampleModal_' + reservation.reservationId"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      訂房Id: {{ reservation.reservationId }}
                    </h5>
                  </div>
                  <div class="modal-body">
                    <div>房號: {{ reservation.room.roomName }}</div>
                    <br />
                    <div>寵物名稱: {{ reservation.dog.dogName }}</div>
                    <br />
                    <div>
                      訂房時段: {{ formatDate(reservation.startTime) }} -
                      {{ formatDate(reservation.endTime) }}
                    </div>
                    <br />
                    <div>總金額: {{ reservation.totalPrice }}</div>
                    <hr />
                    <div v-if="reservation.star != null">
                      <div>
                        <span
                          v-for="index in reservation.star"
                          :key="index"
                          class="star"
                          >★</span
                        >
                        <span
                          v-for="index in maxRating - reservation.star"
                          :key="index"
                          class="star"
                          >☆</span
                        >
                      </div>
                      <br />
                      <div>
                        評價說明:
                        <span
                          v-if="
                            reservation.conments != '' &&
                            reservation.conments != null
                          "
                          >{{ reservation.conments }}</span
                        >
                        <span v-else class="gray">無評價說明</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </td>
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
const maxRating = 5; // 最大星數

onMounted(() => {
  axios
    .get("http://localhost:8080/room/allRoomReservationByUser")
    .then((response) => {
      reservations.value = response.data;
    });
});

const filteredReservations = computed(() => {
  return reservations.value.filter((reservation) => {
    if (reservation.cancelTime == null) {
      return isEndDateAfterToday(reservation.endTime);
    }
  });
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};

// 定義檢查結束日期是否大於當前日期的方法
const isEndDateAfterToday = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  return end < today;
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
  border-radius: 4px;
  cursor: pointer;
  background-color: transparent;
  transition: all 0.5s;
}

.btn-primary {
  border: 1px solid #331d81;
  color: #331d81;
  padding: 0.5rem 1.5rem;
}

.btn-primary:hover {
  background-color: #3f17c2;
  color: aliceblue;
}

.btn-end {
  border: 1px solid #49c936;
  color: #49c936;
}

.btn-end:hover {
  background-color: #35ac22;
  color: aliceblue;
}

.modal-body {
  text-align: left;
}

.star-rating {
  margin-bottom: 20px;
}

.star {
  font-size: 24px;
  color: gold;
}

.gray {
  color: gray;
}
</style>
