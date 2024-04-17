<template>
  <div class="reservation-form">
    <h2 v-if="str === 'update'">修改預約時段</h2>
    <h2 v-if="str === 'cancel'">取消訂房</h2>
    <h2 v-if="str === 'score'">評分</h2>

    <div class="reservation-details">
      <div class="detail-item">
        <span class="detail-label">訂房Id: </span>
        <span>{{ reservation.reservationId }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">訂房時段: </span>
        <span
          >{{ formatDate(reservation.startTime) }} -
          {{ formatDate(reservation.endTime) }}</span
        >
      </div>
      <div class="detail-item">
        <span class="detail-label">房號: </span>
        <span>{{ reservation.room ? reservation.room.roomName : "N/A" }}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">寵物名: </span>
        <span>{{ reservation.dog ? reservation.dog.dogName : "N/A" }}</span>
      </div>
      <div class="detail-item" v-if="str !== 'update'">
        <span class="detail-label">費用: </span>
        <span>{{ reservation.totalPrice }}</span>
      </div>
      <div class="detail-item" v-if="str === 'update'">
        <span class="detail-label">原先費用: </span>
        <span>{{ reservation.totalPrice }}</span>
      </div>
    </div>

    <!-- 修改預約時段表單 -->
    <form v-if="str === 'update'" @submit.prevent="bookRoom(reservation.room)">
      <div class="form-group">
        <label>選擇住宿的日期:</label>
        <VueDatePicker
          class="date-picker"
          v-model="selectedDates"
          range
          :options="datepickerOptions"
          :enable-time-picker="false"
          :min-date="new Date()"
          :disabled-dates="disabledDates"
        />
      </div>
      <div class="button-container">
        <button type="submit" class="btn btn-primary">修改時段</button>
      </div>
    </form>

    <!-- 取消訂房表單 -->
    <form v-if="str === 'cancel'" @submit.prevent="cancel(direction)">
      <div class="form-group">
        <label>取消原因:</label>
        <select v-model="direction" class="form-control">
          <option>選錯房間</option>
          <option>行程取消</option>
          <option>找到其他家更便宜的旅館</option>
          <option>其他原因</option>
        </select>
        <br />
        <input
          v-if="direction == '其他原因'"
          class="form-control"
          type="text"
          v-model.trim="cancelReason"
          placeholder="請說明原因"
        />
      </div>
      <div class="button-container">
        <button type="submit" class="btn btn-primary">取消訂單</button>
      </div>
    </form>

    <!-- 評分表單 -->
    <form v-if="str === 'score'" @submit.prevent="score(comments)">
      <div class="star-rating">
        <span
          v-for="rating in maxRating"
          :key="rating"
          class="star"
          @click="rate(rating)"
          @mouseover="hover(rating)"
        >
          {{ rating <= currentRating ? "★" : "☆" }}
        </span>
      </div>
      <textarea
        class="form-control"
        v-model.trim="comments"
        placeholder="請留下您的評論"
      ></textarea>
      <br />
      <div class="checkbox-wrapper-33">
        <label class="checkbox">
          <input class="checkbox__trigger visuallyhidden" type="checkbox" />
          <span class="checkbox__symbol">
            <svg
              aria-hidden="true"
              class="icon-checkbox"
              width="28px"
              height="28px"
              viewBox="0 0 28 28"
              version="1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 14l8 7L24 7"></path>
            </svg>
          </span>
          <p class="checkbox__textwrapper">分享至動態</p>
        </label>
        <button type="submit" class="btn btn-primary">送出評分</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, computed, watch } from "vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const selectedDates = ref([]); // 用於存儲所選日期的範圍
// 接收
const route = useRoute();
// 傳送
const router = useRouter();
const reservationId = route.params.reservationId;
const str = route.params.str;
// findByReservationId 傳過來的物件
const reservation = ref([]);
// reservationTime 傳過來的物件 List
const reservations = ref([]);
// 取消原因
const direction = ref("");
const cancelReason = ref("");
// 評分說明
const comments = ref("");
// 禁用日期
const date = ref(new Date());
// 取得 checkbox 元素
const checkbox = ref(null);
const checkboxValue = ref(null);

onMounted(() => {
  axios
    .get(
      `http://localhost:8080/room/showUpdateRoom?roomReservationId=${reservationId}`
    )
    .then((response) => {
      reservation.value = response.data;
    });
  axios.get("http://localhost:8080/room/reservation").then((response) => {
    reservations.value = response.data;
  });
  const checkbox = document.querySelector(".checkbox__trigger");
  if (checkbox) {
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        checkboxValue.value = 1;
      } else {
        checkboxValue.value = 0;
      }
    });
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
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

// 點擊訂房
const bookRoom = (room) => {
  const formattedDates = selectedDates.value.map((date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  });

  const dateRange = calculateDateRange(formattedDates[0], formattedDates[1]);
  console.log(`訂房日期範圍: ${dateRange}`); // 訂房日期範圍

  let conflict = false;
  let arr = [];
  let addedDates = {}; // 使用物件來追蹤已經添加的日期

  for (let i = 0; i < reservations.value.length; i++) {
    if (room.roomId == reservations.value[i][0]) {
      for (let date of dateRange) {
        for (let j = 1; j < reservations.value[i].length; j++) {
          if (date == reservations.value[i][j] && !addedDates[date]) {
            conflict = true;
            arr.push(date);
            addedDates[date] = true; // 將已經添加的日期標記為 true
          }
        }
      }
    }
  }

  // 修改訂房明細
  const GOregister = () => {
    axios.post(
      `http://localhost:8080/room/updateRoom?roomReservationId=${reservationId}`,
      {
        startTime: formattedDates[0],
        endTime: formattedDates[1],
        totalPrice: (dateRange.length - 1) * room.roomPrice,
      }
    );
  };
  if (
    !conflict &&
    formattedDates[1] != "1970-01-01" &&
    formattedDates.length != 0
  ) {
    GOregister();
    // 成功的話頁面跳轉到 o_page 並重新加載
    router.push({ name: "o_page" }).then(() => {
      // window.location.reload();
    });
  } else if (formattedDates.length == 0) {
    alert("請選擇時間");
  } else if (formattedDates[1] == "1970-01-01") {
    alert("請選擇結束時間");
  } else {
    alert(`房號: ${room.roomId} 在 ${arr} 已被預訂`);
  }
};

// 禁用日期
const disabledDates = computed(() => {
  const dis = [];
  reservations.value.forEach((reservationTime) => {
    // 取消的訂單日期要可以選取
    if (
      reservationTime[0] == reservation.value.room.roomId &&
      reservation.value.cancelTime == null
    ) {
      for (let i = 2; i < reservationTime.length; i++) {
        dis.push(new Date(reservationTime[i]));
      }
    }
  });
  return dis;
});

// 拿到目前訂單的日期 Array
const calculateDateRange = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);
  while (currentDate <= endDateObj) {
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);
    dates.push(`${year}-${month}-${day}`);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

// 取消訂單
const cancel = () => {
  if (direction.value !== null) {
    if (direction.value === "其他原因") {
      direction.value = cancelReason.value; // 將 cancelReason 的值設置為 direction 的值
    } else {
      cancelReason.value = ""; // 其他情況下，將 cancelReason 的值設置為空字符串
    }
    axios.post(
      `http://localhost:8080/room/cancel?roomReservationId=${reservationId}`,
      { cancelTime: new Date(), cancelDirection: direction.value }
    );
    // 成功的話頁面跳轉到 o_page 並重新加載
    router.push({ name: "c_page" }).then(() => {
      // window.location.reload();
    });
  } else {
    alert("請選擇取消原因");
  }
};

// 評分
// Props
const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  maxRating: {
    type: Number,
    default: 5,
  },
});

// 使用 defineEmits 创建 emit 函数
const emit = defineEmits();

// State
const currentRating = ref(props.value);

// Methods
const rate = (rating) => {
  currentRating.value = rating;
  emit("update:value", rating); // 使用 emit 函数
  // console.log(`星星數: ${currentRating.value}`);
};

const hover = (rating) => {
  currentRating.value = rating;
  // console.log(`星星數: ${currentRating.value}`);
};

const score = (comments) => {
  if (currentRating.value != 0) {
    axios
      .post(
        `http://localhost:8080/room/score?roomReservationId=${reservationId}`,
        {
          star: currentRating.value,
          conments: comments,
          conmentsTime: new Date(),
        }
      )
      // 先修改完訂房明細再發推文
      .then(() => {
        if (checkboxValue.value == 1) {
          axios.post(
            `http://localhost:8080/tweet/postTweetForRoomShare?reservationId=${reservationId}`
          );
        }
        // 成功的話頁面跳轉到 h_page 並重新加載
        router.push({ name: "h_page" }).then(() => {
          // window.location.reload();
        });
      })
      .catch((error) => {
        // 請求失敗時的錯誤處理
        console.error("評分請求失敗:", error);
      });
  } else {
    alert("請給星");
  }
};
</script>

<style scoped>
.reservation-form {
  width: 60%;
  margin: 4rem auto;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  box-shadow: -10px 10px 10px rgb(36, 36, 37, 0.5);
}

h2 {
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: flex-end; /* 將按鈕向右靠 */
}

.reservation-details {
  margin-bottom: 20px;
}

.detail-item {
  margin-bottom: 10px;
}

.detail-label {
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

.date-picker {
  width: 100%;
}

.star-rating {
  margin-bottom: 20px;
}

.star {
  font-size: 24px;
  cursor: pointer;
  color: gold;
  transition: all 0.5s;
}

/* 分享 */
.checkbox-wrapper-33 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  --s-xsmall: 0.625em;
  --s-small: 1.2em;
  --border-width: 1px;
  --c-primary: #5f11e8;
  --c-primary-20-percent-opacity: rgb(95 17 232 / 20%);
  --c-primary-10-percent-opacity: rgb(95 17 232 / 10%);
  --t-base: 0.4s;
  --t-fast: 0.2s;
  --e-in: ease-in;
  --e-out: cubic-bezier(0.11, 0.29, 0.18, 0.98);
}

.checkbox-wrapper-33 .visuallyhidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.checkbox-wrapper-33 .checkbox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.checkbox-wrapper-33 .form-control {
  flex: 1; /* 讓 textarea 佔據剩餘空間 */
}

.checkbox-wrapper-33 .btn-primary {
  margin-left: 10px;
}

.checkbox-wrapper-33 .checkbox + .checkbox {
  margin-top: var(--s-small);
}
.checkbox-wrapper-33 .checkbox__symbol {
  display: inline-block;
  display: flex;
  margin-right: calc(var(--s-small) * 0.7);
  border: var(--border-width) solid var(--c-primary);
  position: relative;
  border-radius: 0.1em;
  width: 1.5em;
  height: 1.5em;
  transition: box-shadow var(--t-base) var(--e-out),
    background-color var(--t-base);
  box-shadow: 0 0 0 0 var(--c-primary-10-percent-opacity);
}
.checkbox-wrapper-33 .checkbox__symbol:after {
  content: "";
  position: absolute;
  top: 0.5em;
  left: 0.5em;
  width: 0.25em;
  height: 0.25em;
  background-color: var(--c-primary-20-percent-opacity);
  opacity: 0;
  border-radius: 3em;
  transform: scale(1);
  transform-origin: 50% 50%;
}
.checkbox-wrapper-33 .checkbox .icon-checkbox {
  width: 1em;
  height: 1em;
  margin: auto;
  fill: none;
  stroke-width: 3;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-miterlimit: 10;
  color: var(--c-primary);
  display: inline-block;
}
.checkbox-wrapper-33 .checkbox .icon-checkbox path {
  transition: stroke-dashoffset var(--t-fast) var(--e-in);
  stroke-dasharray: 30px, 31px;
  stroke-dashoffset: 31px;
}
.checkbox-wrapper-33 .checkbox__textwrapper {
  margin: 0;
}
.checkbox-wrapper-33 .checkbox__trigger:checked + .checkbox__symbol:after {
  -webkit-animation: ripple-33 1.5s var(--e-out);
  animation: ripple-33 1.5s var(--e-out);
}
.checkbox-wrapper-33
  .checkbox__trigger:checked
  + .checkbox__symbol
  .icon-checkbox
  path {
  transition: stroke-dashoffset var(--t-base) var(--e-out);
  stroke-dashoffset: 0px;
}
.checkbox-wrapper-33 .checkbox__trigger:focus + .checkbox__symbol {
  box-shadow: 0 0 0 0.25em var(--c-primary-20-percent-opacity);
}

@-webkit-keyframes ripple-33 {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale(20);
  }
}

@keyframes ripple-33 {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale(20);
  }
}
</style>
