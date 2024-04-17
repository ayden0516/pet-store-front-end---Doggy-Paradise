<template>
  <div id="app">
    <div class="main">
      <h2 class="page-title">訂房</h2>
      <div class="top" v-if="dogs.length != 0 && (role == null || !role.startsWith('ROLE'))">
        <span>請選擇要住宿的寵物:</span>
        <select v-model="selectedDog" @change="RoomsDate()" class="">
          <option v-for="(dog, dogId) in dogs" :key="dogId" :value="dog">
            {{ dog.dogName }}
          </option>
        </select>
        <br />
        <span>請選擇住宿的日期:</span>
        <VueDatePicker class="date-picker" v-model="selectedDates" range :options="datepickerOptions"
          :enable-time-picker="false" :min-date="new Date()" @blur="RoomsDate()" />
      </div>
      <span v-for="(room, roomId) in filteredRooms" :key="roomId">
        <div class="room-container" v-if="!noVacancies.includes(`${room.roomId}`)">
          <div class="card">
            <img :src="room.roomImgPath" class="card-img-top" alt="..." data-bs-toggle="modal"
              :data-bs-target="'#exampleModal_' + room.roomId" />
            <div class="card-body">
              <h5 class="card-title">房間名稱: {{ room.roomName }}</h5>
              <hr />
              <p class="card-text">
                房間適用於:
                {{ roomSizeText(room.roomSize) }}<br />房間價格(一天):
                {{ room.roomPrice }}<br />
              </p>
              <a @click="bookRoom(room)" href="javascript: void(0)" class="btn btn-primary" v-if="
                dogs.length != 0 && (role == null || !role.startsWith('ROLE'))
              ">訂房<span></span><span></span><span></span><span></span></a>
            </div>
            <!-- Modal 房間評價 -->
            <div class="modal fade" :id="'exampleModal_' + room.roomId" tabindex="-1"
              aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      房間名稱: {{ room.roomName }}
                    </h5>
                  </div>
                  <div class="modal-body">
                    <img :src="room.roomImgPath" class="card-img-top" />
                    <br />
                    <span>房間說明:</span>
                    <br />
                    <div style="white-space: pre-wrap">
                      {{ room.roomIntroduction }}
                    </div>
                    <hr />
                    <span>房間評價: </span>
                    <div v-for="(
                        roomReservation, roomReservationId
                      ) in roomReservations" :key="roomReservationId">
                      <div v-if="
                        roomReservation.room.roomId == room.roomId &&
                        roomReservation.star != null
                      " class="space">
                        <!-- <hr /> -->
                        用戶: {{ roomReservation.lastName }}
                        <br />
                        <!-- 用戶: {{ roomReservation.dog }}
                        <br /> -->
                        訂房時段: {{ formatDate(roomReservation.startTime) }} -
                        {{ formatDate(roomReservation.endTime) }}
                        <br />
                        <span v-for="index in roomReservation.star" :key="index" class="star">★</span>
                        <span v-for="index in maxRating - roomReservation.star" :key="index" class="star">☆</span>
                        <div class="jcsb">
                          <span v-if="
                            roomReservation.conments != '' &&
                            roomReservation.conments != null
                          " style="white-space: pre-wrap; width: 200px">
                            評分說明: {{ roomReservation.conments }}
                          </span>
                          <span class="gray" v-else>無評分說明</span><span class="gray">評分時間:
                            {{ formatDate(roomReservation.conmentsTime) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal 訂房成功 -->
            <div class="modal" tabindex="-1" :id="'exampleModal01_' + room.roomId">
              <div class="modal-dialog">
                <div class="modal-content modalbgc">
                  <div class="success">
                    <h2 class="modal-title">訂房成功</h2>
                  </div>
                  <div class="modal-body success">
                    <svg width="400" height="400">
                      <circle fill="none" stroke="#68E534" stroke-width="20" stroke-linecap="round" cx="200" cy="200"
                        r="190" class="circle" transform="rotate(-90 200 200)" />

                      <polyline fill="none" stroke="#68E534" stroke-width="24" points="88,214 173,284 304,138"
                        stroke-linecap="round" stroke-linejoin="round" class="tick" />
                    </svg>
                  </div>
                  <!-- <p class="gray">已寄信至您的信箱</p> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </span>
      <div id="pay"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import VueDatePicker from "@vuepic/vue-datepicker";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/memberStore";
import { dataType } from "element-plus/es/components/table-v2/src/common";

const router = useRouter();
const rooms = ref([]);
const dogs = ref([]);
const roomReservations = ref([]);
const reservations = ref([]);
const selectedDog = ref(null);
const selectedDates = ref([]); // 用於存儲所選日期的範圍
const maxRating = 5; // 最大星數
const role = ref();

onMounted(() => {
  axios.get("http://localhost:8080/room").then((response) => {
    rooms.value = response.data;
  });
  axios.get("http://localhost:8080/room/dog").then((response) => {
    dogs.value = response.data;
  });
  axios.get("http://localhost:8080/room/reservation").then((response) => {
    reservations.value = response.data;
  });
  // 所有訂單 (評價)
  axios.get("http://localhost:8080/employee/score").then((response) => {
    roomReservations.value = response.data;
  });

  const memberStore = useMemberStore();
  role.value = memberStore.memberRole;
});

// roomReservations.forEach((roomReservation) => {
//   console.log(roomReservation.startTime);
// });

// 判斷那幾間房型符合 dog 的體型
const filteredRooms = computed(() => {
  if (!selectedDog.value) return rooms.value;
  return rooms.value.filter((room) => {
    if (selectedDog.value.dogWeight < 9 && room.roomSize === 1) {
      return true;
    } else if (
      selectedDog.value.dogWeight >= 9 &&
      selectedDog.value.dogWeight < 22 &&
      room.roomSize === 2
    ) {
      return true;
    } else if (selectedDog.value.dogWeight >= 22 && room.roomSize === 3) {
      return true;
    } else {
      return false;
    }
  });
});

const roomSizeText = (size) => {
  if (size === 1) return "小型犬";
  else if (size === 2) return "中型犬";
  else return "大型犬";
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};

// 點擊訂房
const bookRoom = (room) => {
  // console.log(selectedDog.value);
  if (selectedDog.value && selectedDates.value.length > 0) {
    const formattedDates = selectedDates.value.map((date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      const day = ("0" + d.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    });

    const dateRange = calculateDateRange(formattedDates[0], formattedDates[1]);
    // console.log(`訂房日期範圍: ${dateRange}`); // 訂房日期範圍

    // let conflict = false;
    // let arr = [];
    // let addedDates = {}; // 使用物件來追蹤已經添加的日期

    // for (let i = 0; i < reservations.value.length; i++) {
    //   if (room.roomId == reservations.value[i][0]) {
    //     for (let date of dateRange) {
    //       for (let j = 1; j < reservations.value[i].length; j++) {
    //         if (date == reservations.value[i][j] && !addedDates[date]) {
    //           conflict = true;
    //           arr.push(date);
    //           addedDates[date] = true; // 將已經添加的日期標記為 true
    //         }
    //       }
    //     }
    //   }
    // }

    // 新增訂房明細
    const roomReservation = () => {
      // axios
      //   .post(
      //     `http://localhost:8080/ecpayCheckout?price=${
      //       (dateRange.length - 1) * room.roomPrice
      //     }&url=room/o_page`
      //   )
      //   .then((response) => {
      //     // console.log(response.data);
      //     const pay = document.getElementById("pay");
      //     pay.innerHTML = response.data;
      //     document.getElementById("allPayAPIForm").submit();
      //   })
      //   .then(() => {
      axios
        .post(
          `http://localhost:8080/room/roomReservation?roomId=${room.roomId}&dogId=${selectedDog.value.dogId}`,
          {
            startTime: formattedDates[0],
            endTime: formattedDates[1],
            totalPrice: (dateRange.length - 1) * room.roomPrice,
            reservationTime: new Date(),
            paymentMethod: "credit card",
            paymentStatus: "paid",
          }
        )
        .then((response) => {
          // console.log(response.data);
          axios.post(
            `http://localhost:8080/room/email?roomReservationId=${response.data}`
          );
        });
      // });
      const myModal = new bootstrap.Modal(
        document.getElementById(`exampleModal01_${room.roomId}`)
      );
      myModal.show();

      // 五秒後自動關閉 modal
      setTimeout(() => {
        myModal.hide();
      }, 2600);
    };

    if (formattedDates[1] != "1970-01-01") {
      roomReservation();

      setTimeout(() => {
        // 成功的話頁面跳轉到 o_page 並重新加載
        router.push({ name: "o_page" });
      }, 2700); // 添加延遲，確保頁面跳轉完成後再刷新
    } else if (formattedDates[1] == "1970-01-01") {
      alert("請選擇結束時間");
    }
    // else {
    //   alert(`房號: ${room.roomId} 在 ${arr} 已被預訂`);
    // }
  } else {
    alert(selectedDates.value.length === 0 ? "請選擇日期" : "請選擇寵物");
  }
};

let noVacancies = [];

// 判斷哪些房間不能選取
const RoomsDate = () => {
  noVacancies = [];
  // console.log(selectedDates.value[0]);
  if (selectedDates.value !== null) {
    // 原始的 RoomsDate 邏輯
    let endDate = new Date(selectedDates.value[1]);
    endDate.setDate(endDate.getDate() - 1); // 減去一天
    let arr = calculateDateRange(selectedDates.value[0], endDate);

    // 清空 noVacancies 陣列
    noVacancies = [];

    arr.forEach((arr) => {
      // 所有 Room
      roomReservations.value.forEach((roomReservation) => {
        filteredRooms.value.forEach((room) => {
          // 所有訂房明細的 roomId 和訂房時間 List
          reservations.value.forEach((reservation) => {
            // 當訂房明細的 roomId 和 room.roomId 相同時
            if (reservation[0] == room.roomId) {
              // 訂房時間
              console.log(reservation);
              for (let i = 0; i < reservation.length; i++) {
                if (
                  reservation[i] == arr &&
                  roomReservation.reservationId == reservation[1] &&
                  roomReservation.cancelTime == null
                ) {
                  // console.log(reservation[1]);
                  // console.log(`RoomId: ${reservation[0]}`);
                  // console.log(`RoomReservationId: ${reservation[1]}`);
                  // console.log(`重複日期: ${reservation[i]}`);
                  noVacancies.push(reservation[0]);
                }
              }
            }
          });
        });
      });
    });
  }

  // 刪除 noVacancies 陣列中的重複值
  noVacancies = [...new Set(noVacancies)];
  // console.log(noVacancies);
  // console.log(noVacancies.includes("2"));
};
</script>

<style scoped>
.page-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.sidebar {
  min-width: 82vw;
  min-height: 82vh;
}

.main {
  min-height: 82vh;
  margin: 2rem;
}

.top {
  display: flex;
  justify-content: space-around;
  border-radius: 1rem;
  background-color: #3e4452;
  padding: 1rem;
  color: aliceblue;
  width: calc(60rem + 1.25rem);
  /* 0.625rem 等於 10px，因為 1rem = 16px */
  position: sticky;
  top: 0;
  z-index: 1000;
}

.top span {
  margin-top: 0.5rem;
}

select {
  width: 10%;
  font-size: 16px;
  border-radius: 4px;
  outline: none;
}

.date-picker {
  width: 25%;
}

.room-container {
  margin-top: 20px;
  white-space: nowrap;
  display: inline-block;
  justify-content: center;
  margin-right: 20px;
  /* 調整卡片之間的間距 */
}

.room-container .room-details {
  margin-left: 10px;
}

.room-container .room-details p {
  margin: 5px 0;
}

.btn {
  display: inline-block;
  position: relative;
  z-index: 1;
  min-width: 150px;
  background: #ffffff;
  border: 2px solid goldenrod;
  border-radius: 4px;
  color: goldenrod;
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  overflow: hidden;
  transition: 0.5s;
  padding: 10px 20px;
}

.btn span {
  position: absolute;
  width: 25%;
  height: 100%;
  background-color: goldenrod;
  transform: translateY(150%);
  border-radius: 50%;
  left: calc((var(--n) - 1) * 25%);
  transition: 0.5s;
  transition-delay: calc((var(--n) - 1) * 0.1s);
  z-index: -1;
}

.btn:hover {
  color: rgb(255, 255, 255);
}

.btn:hover span {
  transform: translateY(0) scale(2);
}

.btn span:nth-child(1) {
  --n: 1;
}

.btn span:nth-child(2) {
  --n: 2;
}

.btn span:nth-child(3) {
  --n: 3;
}

.btn span:nth-child(4) {
  --n: 4;
}

.card {
  max-width: fit-content;
  flex-direction: row;
  align-items: center;
  padding: 1rem;
  background-color: #37474e;
  color: #f3f3f3;
}

.card img {
  margin: 2rem;
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: -10px 10px 10px rgb(36, 36, 37);
}

.modal-header,
.modal-body {
  color: #000;
  padding: 2rem;
}

.modal-body img {
  width: 350px;
  height: 300px;
  object-fit: cover;
}

.jcsb {
  display: flex;
  justify-content: space-between;
}

.gray {
  color: #515e63;
  margin-top: auto;
}

.star-rating {
  margin-bottom: 20px;
}

.star {
  font-size: 24px;
  color: gold;
}

.space {
  padding: 1.5rem;
  margin: 0.5rem;
  border-radius: 10px;
  border: 1px solid rgb(137, 137, 137);
  background-color: #ffffff;
}

/* body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;
} */

svg {
  /* 將 SVG 元素等比例縮小到 50% */
  transform: scale(0.4);
}

svg .circle {
  animation: circle 1s ease-in-out;
  animation-fill-mode: forwards;
}

svg .tick {
  animation: tick 0.8s ease-out;
  animation-fill-mode: forwards;
  animation-delay: 0.93s;
}

h2 {
  font-family: Helvetica;
  font-size: 36px;
  /* margin-top: 40px; */
  color: #333;
  /* opacity: 0; */
}

.circle {
  stroke-dasharray: 1194;
  /***
    2∏R=2*3.14*190=1194
    ***/

  stroke-dashoffset: 1194;
}

.tick {
  stroke-dasharray: 350;
  stroke-dashoffset: 350;
}

@keyframes circle {
  from {
    stroke-dashoffset: 1194;
  }

  to {
    stroke-dashoffset: 2388;
  }
}

@keyframes tick {
  from {
    stroke-dashoffset: 350;
  }

  to {
    stroke-dashoffset: 0;
  }
}

@keyframes title {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.modal {
  margin: auto;
}

.success {
  display: flex;
  justify-content: center;
  /* align-items: center; */
}

.success .modal-title {
  color: #874a33;
  margin-top: 2rem;
  font-size: 30px;
  font-weight: 800;
}

/* .modalbgc {
  background-color: rgba(225, 223, 223, 0.95);
} */
</style>
