<template>
  <div class="container">
    <h2 class="text-center">取消</h2>

    <!-- 添加查询功能 -->
    <div class="search-bar">
      <label for="searchType">選擇查詢方式：</label>
      <select v-model="searchType" id="searchType" @change="changeSearchType">
        <option value="all">全部資料</option>
        <option value="id">訂單ID</option>
        <option value="name">訂房用戶</option>
        <option value="roomName">房號</option>
        <option value="petName">寵物名稱</option>
        <option value="Date">訂房日期</option>
        <option value="cancelDirection">取消原因</option>
        <option value="cancelTime">取消時間</option>
      </select>
      <input
        v-if="
          searchType != 'all' &&
          searchType != 'Date' &&
          searchType != 'cancelDirection' &&
          searchType != 'cancelTime'
        "
        v-model="searchTerm"
        type="text"
        placeholder="輸入關鍵字"
      />
      <!-- 選取訂單時間 -->
      <VueDatePicker
        class="date-picker"
        v-if="searchType == 'Date'"
        v-model="selectedDates"
        range
        :options="datepickerOptions"
        :enable-time-picker="false"
      />
      <!-- 取消原因 -->
      <select
        v-if="searchType == 'cancelDirection'"
        v-model="searchTerm"
        id="searchTerm"
      >
        <option value="選錯房間">選錯房間</option>
        <option value="行程取消">行程取消</option>
        <option value="找到其他家更便宜的旅館">找到其他家更便宜的旅館</option>
        <option value="其他">其他</option>
      </select>
      <!-- 取消時間 -->
      <VueDatePicker
        class="date-picker"
        v-if="searchType == 'cancelTime'"
        v-model="selectedDates"
        :options="datepickerOptions"
        :enable-time-picker="false"
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
          <th v-if="searchType != 'Date'" @click="sortcancel">
            取消原因<button
              class="sort"
              v-if="
                searchType != 'cancelDirection' ||
                searchTerm == '其他' ||
                searchTerm == ''
              "
            >
              <template v-if="sortCancelDirection === 'asc'">▲</template>
              <template v-else>▼</template>
            </button>
          </th>
          <th v-else>訂單時間</th>
          <th v-if="searchType != 'Date'" @click="sortByCancelTime">
            取消時間<button class="sort">
              <template v-if="sortCancelTimeDirection === 'asc'">▲</template>
              <template v-else>▼</template>
            </button>
          </th>
          <th v-else>總金額</th>
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
          <td v-if="searchType != 'Date'">{{ reservation.cancelDirection }}</td>
          <td v-else>
            {{ formatDate(reservation.startTime, 0) }} -
            {{ formatDate(reservation.endTime, 0) }}
          </td>
          <td v-if="searchType != 'Date'">
            {{ formatDate(reservation.cancelTime) }}
          </td>
          <td v-else>{{ reservation.totalPrice }}</td>
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
                    <div>取消原因: {{ reservation.cancelDirection }}</div>
                    <br />
                    <div>
                      取消時間: {{ formatDate(reservation.cancelTime) }}
                    </div>
                    <br />
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
let reservationTime = ref([]);
let sortReservationIdDirection = ref("asc");
let sortDirection = ref("asc");
let sortStartTimeDirection = ref("asc");
let sortCancelDirection = ref("asc");
let sortCancelTimeDirection = ref("asc");
// let sortTotalPriceDirection = ref("asc");

const searchType = ref("all"); // 默认按照名字查询
const searchTerm = ref(""); // 查询关键字

const dogSize = ref(0);

const selectedDates = ref([]); // 用於存儲所選日期的範圍

onMounted(() => {
  axios
    .get("http://localhost:8080/employee/roomReservation")
    .then((response) => {
      reversedData.value = response.data;
      reservations.value = reversedData.value.slice().reverse();
    });
  axios.get("http://localhost:8080/room/reservation").then((response) => {
    reservationTime.value = response.data;
  });
});

const changeSearchType = () => {
  searchTerm.value = "";
};

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

const formatDate = (dateString, number) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  if (number == 1) {
    return `${year}-${month}-${day}`;
  } else {
    return `${year}/${month}/${day}`;
  }
};

const changeDogSize = (size) => {
  dogSize.value = size;
};

const filteredReservations = computed(() => {
  const currentDate = formatDate(new Date(), 1);
  const includeSearchTerm = (str) =>
    str.toLowerCase().includes(searchTerm.value.toLowerCase());

  return reservations.value.filter((reservation) => {
    if (reservation.cancelTime != null) {
      switch (searchType.value) {
        case "name":
          if (dogSize.value === 0) {
            return includeSearchTerm(reservation.lastName);
          } else {
            return (
              dogSize.value === reservation.room.roomSize &&
              includeSearchTerm(reservation.lastName)
            );
          }
        case "id":
          if (dogSize.value === 0) {
            return reservation.reservationId
              .toString()
              .includes(searchTerm.value);
          } else {
            return (
              dogSize.value === reservation.room.roomSize &&
              reservation.reservationId.toString().includes(searchTerm.value)
            );
          }
        case "roomName":
          if (dogSize.value === 0) {
            return reservation.room.roomName
              .toString()
              .includes(searchTerm.value);
          } else {
            return (
              dogSize.value === reservation.room.roomSize &&
              reservation.room.roomName.toString().includes(searchTerm.value)
            );
          }
        case "petName":
          if (dogSize.value === 0) {
            return includeSearchTerm(reservation.dog.dogName);
          } else {
            return (
              dogSize.value === reservation.room.roomSize &&
              includeSearchTerm(reservation.dog.dogName)
            );
          }
        case "Date":
          if (dogSize.value === 0) {
            return RoomsDate(reservation.startTime, reservation.endTime);
          } else {
            return (
              dogSize.value === reservation.room.roomSize &&
              RoomsDate(reservation.startTime, reservation.endTime)
            );
          }
        case "cancelDirection":
          if (searchTerm.value == "其他") {
            if (dogSize.value === 0) {
              return !(
                reservation.cancelDirection === "選錯房間" ||
                reservation.cancelDirection === "行程取消" ||
                reservation.cancelDirection === "找到其他家更便宜的旅館"
              );
            } else {
              return (
                dogSize.value === reservation.room.roomSize &&
                !(
                  reservation.cancelDirection === "選錯房間" ||
                  reservation.cancelDirection === "行程取消" ||
                  reservation.cancelDirection === "找到其他家更便宜的旅館"
                )
              );
            }
          } else {
            if (dogSize.value === 0) {
              return includeSearchTerm(reservation.cancelDirection);
            } else {
              return (
                dogSize.value === reservation.room.roomSize &&
                includeSearchTerm(reservation.cancelDirection)
              );
            }
          }
        case "cancelTime":
          if (selectedDates.value != null && selectedDates.value.length != 0) {
            if (dogSize.value === 0) {
              return (
                formatDate(selectedDates.value) ==
                formatDate(reservation.cancelTime, 0)
              );
            } else {
              return (
                dogSize.value === reservation.room.roomSize &&
                formatDate(selectedDates.value) ==
                  formatDate(reservation.cancelTime, 0)
              );
            }
          }
        default:
          if (dogSize.value === 0) {
            return true;
          } else {
            return dogSize.value === reservation.room.roomSize && true;
          }
      }
    }
  });
});

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

// const sortByTotalPrice = () => {
//   sortTotalPriceDirection.value =
//     sortTotalPriceDirection.value === "asc" ? "desc" : "asc";
//   reservations.value.sort((a, b) => {
//     if (sortTotalPriceDirection.value === "asc") {
//       return a.totalPrice - b.totalPrice;
//     } else {
//       return b.totalPrice - a.totalPrice;
//     }
//   });
// };

// 取消原因
const sortcancel = () => {
  sortCancelDirection.value =
    sortCancelDirection.value === "asc" ? "desc" : "asc";
  reservations.value.sort((a, b) => {
    if (sortCancelDirection.value === "asc") {
      if (
        typeof a.cancelDirection === "string" &&
        typeof b.cancelDirection === "string"
      ) {
        return a.cancelDirection.localeCompare(b.cancelDirection);
      } else {
        // 如果 cancelDirection 不是字串，則按照其在內存中的位置進行排序
        return a.cancelDirection - b.cancelDirection;
      }
    } else {
      if (
        typeof a.cancelDirection === "string" &&
        typeof b.cancelDirection === "string"
      ) {
        return b.cancelDirection.localeCompare(a.cancelDirection);
      } else {
        // 如果 cancelDirection 不是字串，則按照其在內存中的位置進行排序
        return b.cancelDirection - a.cancelDirection;
      }
    }
  });
};

// 取消時間
const sortByCancelTime = () => {
  sortCancelTimeDirection.value =
    sortCancelTimeDirection.value === "asc" ? "desc" : "asc";
  reservations.value.sort((a, b) => {
    if (sortCancelTimeDirection.value === "asc") {
      return new Date(a.cancelTime) - new Date(b.cancelTime);
    } else {
      return new Date(b.cancelTime) - new Date(a.cancelTime);
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

/* .room-table tr:nth-child(even) {
  background-color: rgb(255, 243, 223);
} */

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

.mr-1 {
  margin-right: 1rem;
}
</style>
