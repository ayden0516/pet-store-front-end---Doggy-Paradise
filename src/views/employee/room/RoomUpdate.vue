<template>
  <div id="app">
    <div class="main">
      <span v-for="(room, roomId) in rooms" :key="roomId">
        <div class="room-container">
          <div class="card">
            <img :src="room.roomImgPath" class="card-img-top" alt="..." />
            <div class="card-body">
              <h5 class="card-title">房間名稱: {{ room.roomName }}</h5>
              <p class="card-text">
                房間適用於:
                {{ roomSizeText(room.roomSize) }}<hr />房間價格(一天):
                {{ room.roomPrice }}<hr />房間說明: <br />{{
                  room.roomIntroduction
                }}
              </p>
              <button 
              data-bs-toggle="modal"
              :data-bs-target="'#exampleModal_' + room.roomId"
                >修改房間資訊
              </button>
              <!-- Modal -->
              <div
                class="modal fade"
                :id="'exampleModal_' + room.roomId"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">修改 {{ room.roomName }} 號房資訊</h5>
                    </div>
                    <div class="modal-body">
                      <div class="mb-3">
                        <label for="roomPrice" class="form-label">房間價格</label>
                        <input
                          type="text"
                          class="form-control"
                          id="roomPrice"
                          v-model="room.roomPrice"
                          placeholder="輸入房間價格"
                          required
                        />
                      </div>
                      <div class="mb-3">
                        <label for="roomImgPath" class="form-label">房間照片</label>
                        <input
                          type="file"
                          class="form-control"
                          id="roomImgPath"
                          ref="roomImgPath"
                        />
                      </div>
                      <div class="mb-3">
                        <label for="roomIntroduction" class="form-label">房間介紹</label>
                        <textarea
                          class="form-control"
                          id="roomIntroduction"
                          placeholder="簡短介紹房間"
                          rows="3"
                          v-model="room.roomIntroduction"
                        ></textarea>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button
                        type="button"
                        class="btn btn-primary"
                        @click="update(room.roomId)"
                        data-bs-dismiss="modal"
                      >
                        修改
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Modal 修改成功 -->
              <div
                class="modal"
                tabindex="-1"
                :id="'exampleModal01_' + room.roomId"
              >
                <div class="modal-dialog">
                  <div class="modal-content modalbgc">
                    <div class="success">
                      <h2 class="modal-title">修改成功</h2>
                    </div>
                    <div class="modal-body success">
                      <svg width="400" height="400">
                        <circle
                          fill="none"
                          stroke="#68E534"
                          stroke-width="20"
                          stroke-linecap="round"
                          cx="200"
                          cy="200"
                          r="190"
                          class="circle"
                          transform="rotate(-90 200 200)"
                        />

                        <polyline
                          fill="none"
                          stroke="#68E534"
                          stroke-width="24"
                          points="88,214 173,284 304,138"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="tick"
                        />
                      </svg>
                    </div>
                    <!-- <p class="gray">已寄信至您的信箱</p> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
// import { useRouter } from "vue-router";
import { useMemberStore } from "@/stores/memberStore";

const rooms = ref([]);
const memberId = ref(null);
// const router = useRouter(); // 這一行應該被移除



onMounted(() => {
  const memberStore = useMemberStore();
  memberId.value = memberStore.memberId;
  axios.get("http://localhost:8080/room").then((response) => {
    rooms.value = response.data;
  });
});


const roomSizeText = (size) => {
  if (size === 1) return "小型犬";
  else if (size === 2) return "中型犬";
  else return "大型犬";
};

const update = (roomId) => {
  const room = rooms.value.find((r) => r.roomId === roomId);
  axios
    .post(
      `http://localhost:8080/employee/updateRoom?roomId=${roomId}`,
      {
        roomPrice: room.roomPrice,
        roomIntroduction: room.roomIntroduction
      }
    )
    .then((response) => {
      roomImg(response.data);
      const myModal = new bootstrap.Modal(
        document.getElementById(`exampleModal01_${room.roomId}`)
      );
      myModal.show();

      // 五秒後自動關閉 modal
      setTimeout(() => {
        myModal.hide();
        // 重新設置 rooms 的值以觸發組件重新渲染
        axios.get("http://localhost:8080/room").then((response) => {
          rooms.value = response.data;
        });
      }, 3000);
    });
};


const roomImg = (roomId) => {
  if (memberId.value != null) {
    if (document.getElementById('roomImgPath').files.length > 0) {
      const fd = new FormData();
      fd.append("roomId", roomId);
      fd.append("roomImgPath", document.getElementById('roomImgPath').files[0]);
      axios
        .post(`http://localhost:8080/employee/addRoomImg`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((error) => {
          console.error("圖片新增失敗", error);
        });
    } else {
      console.log("沒有選擇任何圖片");
    }
  }
}
</script>

<style scoped>

.room-container {
  width: 80%;
  margin: 2rem 0;
}

.main span{
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-body button {
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 4px;
  background-color: #ffffff;
  color: #245c50;
  border: none;
  cursor: pointer;
  outline: none;
  transition: all 0.5s;
}

.card-body button:hover {
  background-color: #bbbbbb;
}

.card {
  flex-direction: row;
  align-items: center;
  padding: 2rem;
  background-color: #245c50;
  color: #f3f3f3;
}

.card img {
  margin: 2rem;
  max-width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: -20px 20px 20px rgb(39, 40, 38)}


.modal h5, label {
  color: #1f1e1e;
}



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

</style>
