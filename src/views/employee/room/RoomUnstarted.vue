<template>
  <div class="container">
    <h2 class="text-center">未開始</h2>

    <!-- 添加查询功能 -->
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
        v-if="searchType != 'all' && searchType != 'Date'"
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
        :min-date="new Date()"
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
            {{ formatDate(reservation.startTime, 0) }} -
            {{ formatDate(reservation.endTime, 0) }}
          </td>
          <td>{{ reservation.totalPrice }}</td>
        </tr>
        <td
          class="record-count"
          colspan="6"
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
let sortTotalPriceDirection = ref("asc");

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
  const includeSearchTerm = (str) =>
    str.toLowerCase().includes(searchTerm.value.toLowerCase());

  return reservations.value.filter((reservation) => {
    const isAfterToday = isBeginAndEndDate(
      reservation.startTime,
      reservation.endTime
    );
    if (reservation.cancelTime == null) {
      switch (searchType.value) {
        case "name":
          if (dogSize.value == 0) {
            return includeSearchTerm(reservation.lastName) && isAfterToday;
          } else {
            return (
              reservation.room.roomSize === dogSize.value &&
              includeSearchTerm(reservation.lastName) &&
              isAfterToday
            );
          }
        case "id":
          if (dogSize.value == 0) {
            return (
              reservation.reservationId.toString().includes(searchTerm.value) &&
              isAfterToday
            );
          } else {
            return (
              reservation.room.roomSize === dogSize.value &&
              reservation.reservationId.toString().includes(searchTerm.value) &&
              isAfterToday
            );
          }
        case "roomName":
          if (dogSize.value == 0) {
            return (
              reservation.room.roomName.toString().includes(searchTerm.value) &&
              isAfterToday
            );
          } else {
            return (
              reservation.room.roomSize === dogSize.value &&
              reservation.room.roomName.toString().includes(searchTerm.value) &&
              isAfterToday
            );
          }
        case "petName":
          if (dogSize.value == 0) {
            return includeSearchTerm(reservation.dog.dogName) && isAfterToday;
          } else {
            return (
              reservation.room.roomSize === dogSize.value &&
              includeSearchTerm(reservation.dog.dogName) &&
              isAfterToday
            );
          }
        case "Date":
          if (dogSize.value == 0) {
            return (
              RoomsDate(reservation.startTime, reservation.endTime) &&
              isAfterToday
            );
          } else {
            return (
              reservation.room.roomSize === dogSize.value &&
              RoomsDate(reservation.startTime, reservation.endTime) &&
              isAfterToday
            );
          }
        default:
          if (dogSize.value == 0) {
            return isAfterToday;
          } else {
            return reservation.room.roomSize === dogSize.value && isAfterToday;
          }
      }
    }
  });
});

// 檢查日期是否大於當前日期的方法
const isBeginAndEndDate = (beginDate, endDate) => {
  const today = new Date();
  const begin = new Date(beginDate);
  const end = new Date(endDate);
  return begin > today && end > today;
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
      selectedDates.value[1] !== null && // 添加这行检查
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

.mr-1 {
  margin-right: 1rem;
}
</style>
