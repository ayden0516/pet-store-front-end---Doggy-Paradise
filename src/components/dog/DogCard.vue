<template>
  <div class="dog-card">
    <img
      v-if="dog.dogImgPathCloud != null"
      :src="dog.dogImgPathCloud"
      class="dog-image"
    />
    <img
      v-else
      class="dog-image"
      src="https://res.cloudinary.com/dxz9qtntt/image/upload/f_auto,q_auto/v1/dogFolder/o88brizbheeecrszxhec"
    />
    <!-- <img
      src="https://res.cloudinary.com/dxz9qtntt/image/upload/v1711549113/accountFolder/yxq2tfhvpw8jtj1o8ifi.jpg"
      class="dog-image"
    /> -->
    <div class="dog-info">
      <div class="dog-name">狗狗名字：{{ dog.dogName }}</div>
      <div class="dog-detail">出生日期：{{ formatDate(dog.dogBirthDate) }}</div>
      <div class="dog-detail">品種：{{ dog.dogBreed }}</div>
      <div class="dog-detail">性別：{{ dog.dogGender }}</div>
      <div class="dog-introduction">
        狗狗介紹：
        <div style="white-space: pre-line">{{ dog.dogIntroduce }}</div>
      </div>
      <div class="dog-detail">體重：{{ dog.dogWeight }}</div>
      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        :data-bs-target="'#exampleModal_' + dog.dogId"
      >
        修改狗狗資訊
      </button>
      <button class="btn btn-danger" @click="deleteDog(dog.dogId)">
        刪除狗狗
      </button>
    </div>
  </div>

  <!-- Modal -->
  <div
    class="modal fade"
    :id="'exampleModal_' + dog.dogId"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">修改狗狗資訊</h5>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="dogName" class="form-label">狗狗名稱</label>
            <input
              type="text"
              class="form-control"
              id="dogName"
              v-model="dog.dogName"
              placeholder="輸入狗狗名稱"
              required
            />
          </div>
          <div class="mb-3">
            <label for="dogGender" class="form-label">狗狗性別</label>
            <select
              id="dogGender"
              class="form-select"
              v-model="dog.dogGender"
              required
            >
              <option value="Male">公</option>
              <option value="Female">母</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="dogBirthDate" class="form-label" required
              >狗狗生日</label
            >
            <input
              type="date"
              id="dogBirthDate"
              class="form-control"
              v-model="dog.dogBirthDate"
            />
          </div>
          <div class="mb-3">
            <label for="dogBreed" class="form-label" required>狗狗品種</label>
            <input
              type="text"
              class="form-control"
              id="dogBreed"
              placeholder="輸入狗狗品種"
              v-model="dog.dogBreed"
            />
          </div>
          <div class="mb-3">
            <label for="dogWeight" class="form-label" required>狗狗體重</label>
            <input
              type="text"
              class="form-control"
              id="dogWeight"
              placeholder="輸入狗狗體重"
              v-model="dog.dogWeight"
            />
          </div>
          <div class="mb-3">
            <label for="dogImgPathCloud" class="form-label">狗狗照片</label>
            <input
              type="file"
              class="form-control"
              id="dogImgPathCloud"
              ref="dogImgPathCloud"
            />
          </div>
          <div class="mb-3">
            <label for="dogIntroduce" class="form-label">狗狗介紹</label>
            <textarea
              class="form-control"
              id="dogIntroduce"
              placeholder="簡短介紹狗狗"
              rows="3"
              v-model="dog.dogIntroduce"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            @click="update(dog.dogId)"
            data-bs-dismiss="modal"
          >
            修改
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- 修改成功 -->
  <div class="modal" tabindex="-1" :id="'exampleModal01_' + dog.dogId">
    <div class="modal-dialog">
      <div class="modal-content">
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
</template>

<script>
import axios from "axios";
import { useMemberStore } from "@/stores/memberStore";

export default {
  emits: ["updateSuccess"],
  props: {
    dog: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    const memberStore = useMemberStore();
    this.memberId = memberStore.memberId;
  },
  data() {
    return { memberId: "" };
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}/${month}/${day}`;
    },
    update(dogId) {
      const myModal = new bootstrap.Modal(
        document.getElementById(`exampleModal01_${dogId}`)
      );
      myModal.show();

      // 五秒後自動關閉 modal
      setTimeout(() => {
        myModal.hide();
        this.$emit("update-success");
      }, 2600);
      axios
        .post(
          `http://localhost:8080/dog/update?dogId=${this.dog.dogId}`,
          {
            dogName: this.dog.dogName,
            dogGender: this.dog.dogGender,
            dogBirthDate: this.dog.dogBirthDate,
            dogIntroduce: this.dog.dogIntroduce,
            dogWeight: parseFloat(this.dog.dogWeight),
            dogBreed: this.dog.dogBreed,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          this.dogImg(response.data);
        });
    },
    dogImg(data) {
      if (this.memberId != null) {
        if (this.$refs.dogImgPathCloud.files.length > 0) {
          const fd = new FormData();
          fd.append("dogId", data);
          fd.append("dogImgPathCloud", this.$refs.dogImgPathCloud.files[0]);
          axios
            .post(`${this.API_URL}/dog/addDogImg`, fd, {
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
    },
    deleteDog(dogId) {
      axios.delete(`${this.API_URL}/dog/delete/Dogs/${dogId}`).then(() => {
        // 確認請求成功後觸發事件
        this.$emit("update-success");
      });
    },
  },
};
</script>

<style scoped>
.dog-card {
  display: flex;
  flex-wrap: wrap; /* 讓內容可以換行 */
  /* border: 1px solid #ccc; */
  min-width: 500px;
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
  margin-left: 50px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.dog-image {
  width: 250px;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.dog-info {
  font-family: Arial, sans-serif;
  margin: 2rem;
  flex: 1; /* 讓內容元素自動填滿可用空間 */
}

.dog-name {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 5px;
}

.dog-detail {
  margin-bottom: 5px;
}

.dog-introduction {
  margin-bottom: 10px;
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
