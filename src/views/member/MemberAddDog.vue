<template>
  <button class="btn" @click="add">新增資料</button>
  <div class="main flex">
    <form>
      <div class="mb-3">
        <label for="dogName" class="form-label">狗狗名稱</label>
        <input
          type="text"
          class="form-control"
          id="dogName"
          v-model="dogName"
          placeholder="輸入狗狗名稱"
          required
        />
      </div>
      <div class="mb-3">
        <label for="dogGender" class="form-label">狗狗性別</label>
        <select id="dogGender" class="form-select" v-model="dogGender" required>
          <option value="Male">公</option>
          <option value="Female">母</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="dogBirthDate" class="form-label" required>狗狗生日</label>
        <input
          type="date"
          id="dogBirthDate"
          class="form-control"
          :max="getCurrentDate()"
          v-model="dogBirthDate"
        />
      </div>
      <div class="mb-3">
        <label for="dogBreed" class="form-label" required>狗狗品種</label>
        <input
          type="text"
          class="form-control"
          id="dogBreed"
          placeholder="輸入狗狗品種"
          v-model="dogBreed"
        />
      </div>
      <div class="mb-3">
        <label for="dogWeight" class="form-label" required>狗狗體重</label>
        <input
          type="text"
          class="form-control"
          id="dogWeight"
          placeholder="輸入狗狗體重"
          v-model="dogWeight"
        />
      </div>
      <!-- 還沒綁定 -->
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
          v-model="dogIntroduce"
        ></textarea>
      </div>
    </form>
    <button class="btn btn-primary" @click="addDog()">新增狗狗</button>

    <!-- Modal 新增成功 -->
    <div class="modal" tabindex="-1" id="exampleModal">
      <div class="modal-dialog">
        <div class="modal-content modalbgc">
          <div class="success">
            <h2 class="modal-title">新增成功</h2>
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
</template>

<script>
// import { useMemberStore } from "@/stores/memberStore";
import DogItem from "@/components/dog/DogCard.vue";
import axios from "axios";
// import { useRouter } from "vue-router";

export default {
  components: {
    DogItem,
  },
  data() {
    return {
      // memberId: "",
      dogName: "",
      dogGender: "",
      dogBirthDate: "",
      dogBreed: "",
      dogWeight: "",
      dogImgPathCloud: "",
      dogIntroduce: "",
    };
  },
  mounted() {
    // const memberStore = useMemberStore();
    // this.memberId = memberStore.memberId;
  },
  methods: {
    // 鎖定今天以後的日期不能選取
    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();

      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;

      return `${year}-${month}-${day}`;
    },
    add() {
      (this.dogName = "Peter"),
        (this.dogGender = "Male"),
        (this.dogBirthDate = "2024-02-01"),
        (this.dogBreed = "米克斯"),
        (this.dogWeight = "20"),
        (this.dogImgPathCloud =
          "http://res.cloudinary.com/dxz9qtntt/image/upload/v1712907369/dogFolder/v8dfo7ifu15eafysi0jj.jpg"),
        (this.dogIntroduce = "很帥的狗");
    },
    addDog() {
      const myModal = new bootstrap.Modal(
        document.getElementById(`exampleModal`)
      );
      myModal.show();

      // 五秒後自動關閉 modal
      setTimeout(() => {
        myModal.hide();
      }, 3000);
      axios
        .post(
          `http://localhost:8080/dog/addUserDog`,
          {
            dogName: this.dogName,
            dogGender: this.dogGender,
            dogBirthDate: this.dogBirthDate,
            dogIntroduce: this.dogIntroduce,
            dogWeight: parseFloat(this.dogWeight),
            dogBreed: this.dogBreed,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          this.dogImg(response.data);
          setTimeout(() => {
            this.$router
              .push({
                name: "mydog", // 使用路由名稱
              })
              .then(() => {
                location.reload();
              });
          }, 3000);
        });
    },
    dogImg(data) {
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
    },
  },
};
</script>
<style scoped>
.main {
  width: 100%;
}

.btn {
  margin: 2rem auto 0;
  border: 1px solid blue;
}

.flex {
  margin: 0 auto; /* 將彈性容器水平置中 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 將內部元素水平置中 */
}

form {
  margin-top: 2rem;
  padding: 20px;
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9; /* 添加背景色 */
}

/* 標籤樣式 */
.form-label {
  font-weight: bold;
}

/* 輸入框樣式 */
.form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

/* 文本區樣式 */
textarea.form-control {
  resize: vertical;
}

/* 選擇框樣式 */
select.form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  appearance: none;
}

/* 文件上傳樣式 */
input[type="file"].form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* 按鈕樣式 */
.btn-primary {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 80%;
  margin: 2rem 0; /* 增加上邊距以與其他元素保持間距 */
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* 按鈕聚焦時樣式 */
.btn-primary:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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
