<template>
  <div class="container">
    <h2 class="text-center">已結束</h2>

    <!-- 添加查詢功能 -->
    <div class="search-bar">
      <label for="searchType">選擇查詢方式：</label>
      <select v-model="searchType" id="searchType">
        <option value="all">全部資料</option>
        <option value="id">訂單ID</option>
        <option value="name">訂房用戶</option>
        <option value="roomName">房號</option>
        <option value="petName">寵物名稱</option>
        <option value="Date">訂房日期</option>
      </select>
      <input
        v-if="
          searchType != 'all' && searchType != 'Date' && searchType != 'size'
        "
        v-model="searchTerm"
        type="text"
        placeholder="輸入關鍵字"
      />
      <VueDatePicker
        class="date-picker"
        v-if="searchType == 'Date'"
        v-model="selectedDates"
        range
        :options="datepickerOptions"
        :enable-time-picker="false"
        :max-date="new Date()"
      />
      <div class="button">
        <span class="mr-1">房型:</span>
        <button class="btn" @click="changeDogSize(0)">全部</button>
        <button class="btn" @click="changeDogSize(1)">小型犬</button
        ><button class="btn" @click="changeDogSize(2)">中型犬</button
        ><button class="btn" @click="changeDogSize(3)">大型犬</button>
      </div>
    </div>

    <table class="table room-table mx-auto">
      <thead>
        <tr>
          <th @click="sortByReservationId">
            訂單ID
            <button class="sort">
              <template v-if="sortReservationIdDirection === 'asc'">▲</template>
              <template v-else>▼</template>
            </button>
          </th>
          <th>訂購者</th>
          <th @click="sortByRoomName">
            房間號碼
            <button class="sort">
              <template v-if="sortDirection === 'asc'">▲</template>
              <template v-else>▼</template>
            </button>
          </th>
          <th>寵物名稱</th>
          <th @click="sortByStartTime">
            訂單時間
            <button class="sort">
              <template v-if="sortStartTimeDirection === 'asc'">▲</template>
              <template v-else>▼</template>
            </button>
          </th>
          <th @click="sortByTotalPrice">
            總金額<button class="sort">
              <template v-if="sortTotalPriceDirection === 'asc'">▲</template>
              <template v-else>▼</template>
            </button>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(reservation, reservationId) in filteredReservations"
          :key="reservationId"
        >
          <td>{{ reservation.reservationId }}</td>
          <td>{{ reservation.lastName }}</td>
          <td>{{ reservation.room.roomName }}</td>
          <td>{{ reservation.dog.dogName }}</td>
          <td>
            {{ formatDate(reservation.startTime) }} -
            {{ formatDate(reservation.endTime) }}
          </td>
          <td>{{ reservation.totalPrice }}</td>
          <td>
            <a
              v-if="reservation.reservationId != undefined"
              href="javascript: void(0)"
              class="btn"
              data-bs-toggle="modal"
              :data-bs-target="'#exampleModal_' + reservation.reservationId"
            >
              <span>詳情</span>
              <svg width="13px" height="10px" viewBox="0 0 13 10">
                <path d="M1,5 L11,5"></path>
                <!-- 更改箭頭的點以使其朝上 -->
                <polyline points="8 1 12 5 8 9"></polyline>
              </svg>
            </a>
            <!-- Modal -->
            <div
              class="modal left-to-right fade"
              :id="'exampleModal_' + reservation.reservationId"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      訂單ID: {{ reservation.reservationId }}
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <div>訂購者: {{ reservation.lastName }}</div>
                    <br />
                    <div>房號: {{ reservation.room.roomName }}</div>
                    <br />
                    <div>寵物名稱: {{ reservation.dog.dogName }}</div>
                    <br />
                    <div>
                      訂房時間: {{ formatDate(reservation.reservationTime) }}
                    </div>
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
                    <div v-else class="gray">未評分</div>
                  </div>
                  <!-- <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                  </div> -->
                </div>
              </div>
            </div>
          </td>
        </tr>
        <td
          class="record-count"
          colspan="7"
          v-if="filteredReservations.length != 0"
        >
          總共 {{ filteredReservations.length }} 筆記錄
        </td>
        <td class="record-count" colspan="6" v-else>沒有紀錄</td>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import VueDatePicker from "@vuepic/vue-datepicker";

let reversedData = ref([]);
let reservations = ref([]);
let sortReservationIdDirection = ref("asc");
let sortDirection = ref("asc");
let sortStartTimeDirection = ref("asc");
let sortTotalPriceDirection = ref("asc");
const maxRating = 5; // 最大星數

const searchType = ref("all"); // 默认按照名字查询
const searchTerm = ref(""); // 查询关键字

const dogSize = ref(0);

const selectedDates = ref([]); // 用於存儲所選日期的範圍

onMounted(() => {
  axios
    .get("http://localhost:8080/employee/roomReservation")
    .then((response) => {
      reversedData = response.data;
      reservations.value = reversedData.slice().reverse();
    });
});

// datepicker 設定
const en = {
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthsShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  today: "Today",
  clear: "Clear",
  dateFormat: "MM/dd/yyyy",
  timeFormat: "hh:mm aa",
  firstDay: 0,
};

// datepicker 設定
const datepickerOptions = {
  locale: en,
  range: true,
  multipleDateSeparator: " - ",
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const changeDogSize = (size) => {
  dogSize.value = size;
};

// 查詢
const filteredReservations = computed(() => {
  const currentDate = formatDate(new Date(), 1);
  const includeSearchTerm = (str) =>
    str.toLowerCase().includes(searchTerm.value.toLowerCase());

  return reservations.value.filter((reservation) => {
    const isAfterToday = isEndDateAfterToday(reservation.endTime);
    if (reservation.cancelTime == null) {
      switch (searchType.value) {
        case "name":
          if (dogSize.value === 0) {
            return includeSearchTerm(reservation.lastName) && !isAfterToday;
          } else {
            return (
              dogSize.value === reservation.room.roomSize &&
              includeSearchTerm(reservation.lastName) &&
              !isAfterToday
            );
          }
        case "id":
          if (dogSize.value === 0) {
            return (
              reservation.reservationId.toString().includes(searchTerm.value) &&
              !isAfterToday
            );
          } else {
            return (
              dogSize.value === reservation.room.roomSize &&
              reservation.reservationId.toString().includes(searchTerm.value) &&
              !isAfterToday
            );
          }
        case "roomName":
          if (dogSize.value === 0) {
            return (
              reservation.room.roomName.toString().includes(searchTerm.value) &&
              !isAfterToday
            );
          } else {
            return (
              dogSize.value === reservation.room.roomSize &&
              reservation.room.roomName.toString().includes(searchTerm.value) &&
              !isAfterToday
            );
          }
        case "petName":
          if (dogSize.value === 0) {
            return includeSearchTerm(reservation.dog.dogName) && !isAfterToday;
          } else {
            return (
              dogSize.value === reservation.room.roomSize &&
              includeSearchTerm(reservation.dog.dogName) &&
              !isAfterToday
            );
          }
        case "Date":
          if (dogSize.value === 0) {
            return (
              RoomsDate(reservation.startTime, reservation.endTime) &&
              !isAfterToday
            );
          } else {
            return (
              dogSize.value === reservation.room.roomSize &&
              RoomsDate(reservation.startTime, reservation.endTime) &&
              !isAfterToday
            );
          }
        default:
          if (dogSize.value === 0) {
            return !isAfterToday;
          } else {
            return dogSize.value === reservation.room.roomSize && !isAfterToday;
          }
      }
    }
  });
});

// 定義檢查結束日期是否大於當前日期的方法
const isEndDateAfterToday = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  return end > today;
};

const sortByReservationId = () => {
  sortReservationIdDirection.value =
    sortReservationIdDirection.value === "asc" ? "desc" : "asc";
  reservations.value.sort((a, b) => {
    if (sortReservationIdDirection.value === "asc") {
      return a.reservationId - b.reservationId;
    } else {
      return b.reservationId - a.reservationId;
    }
  });
};

// localeCompare 字串比較方法
const sortByRoomName = () => {
  sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  reservations.value.sort((a, b) => {
    if (sortDirection.value === "asc") {
      if (
        typeof a.room.roomName === "string" &&
        typeof b.room.roomName === "string"
      ) {
        return a.room.roomName.localeCompare(b.room.roomName);
      } else {
        // 如果 roomName 不是字串，則按照其在內存中的位置進行排序
        return a.room.roomName - b.room.roomName;
      }
    } else {
      if (
        typeof a.room.roomName === "string" &&
        typeof b.room.roomName === "string"
      ) {
        return b.room.roomName.localeCompare(a.room.roomName);
      } else {
        // 如果 roomName 不是字串，則按照其在內存中的位置進行排序
        return b.room.roomName - a.room.roomName;
      }
    }
  });
};

const sortByStartTime = () => {
  sortStartTimeDirection.value =
    sortStartTimeDirection.value === "asc" ? "desc" : "asc";
  reservations.value.sort((a, b) => {
    if (sortStartTimeDirection.value === "asc") {
      return new Date(a.startTime) - new Date(b.startTime);
    } else {
      return new Date(b.startTime) - new Date(a.startTime);
    }
  });
};

const sortByTotalPrice = () => {
  sortTotalPriceDirection.value =
    sortTotalPriceDirection.value === "asc" ? "desc" : "asc";
  reservations.value.sort((a, b) => {
    if (sortTotalPriceDirection.value === "asc") {
      return a.totalPrice - b.totalPrice;
    } else {
      return b.totalPrice - a.totalPrice;
    }
  });
};

const RoomsDate = (beginTime, endTime) => {
  const begin = new Date(beginTime);
  const endDate = new Date(endTime);
  begin.setDate(begin.getDate() - 1);
  // endDate.setDate(endDate.getDate() + 1);
  if (selectedDates.value !== null) {
    if (
      selectedDates.value.length === 2 &&
      selectedDates.value[1] !== null &&
      formatDate(selectedDates.value[1]) != "1970/01/01"
    ) {
      const start = new Date(selectedDates.value[0]);
      const end = new Date(selectedDates.value[1]);
      return start >= begin && end <= endDate;
    } else if (formatDate(selectedDates.value[1]) == "1970/01/01") {
      const day = new Date(selectedDates.value[0]);
      return day >= begin && day <= endDate;
    } else {
      return true;
    }
  } else {
    return true;
  }
};
</script>

<style scoped>
.container {
  width: 90%;
  margin: 2rem auto;
}

.room-table {
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
  padding: 0.5rem 0;
}

.search-bar {
  margin-bottom: 20px;
}

input[type="text"],
select {
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.date-picker {
  margin-top: 5px;
}

button.sort {
  font-size: 12px;
  border: none;
  cursor: pointer;
  background-color: transparent;
  color: rgb(205, 176, 141);
}

/* 詳情 */
.btn span {
  position: relative;
  z-index: 1;
}

.btn svg {
  position: relative;
  top: 0;
  margin-left: 10px;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: #e79283;
  stroke-width: 2;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}

.btn:hover:before {
  width: 100%;
  background: #ffab9d;
}

.btn:hover svg {
  transform: translateX(0);
}

.btn:hover {
  color: #e79283;
}

.left-to-right .modal-dialog {
  animation: slideInLeft 0.5s forwards;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
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

.mr-1 {
  margin-right: 1rem;
}
</style>
