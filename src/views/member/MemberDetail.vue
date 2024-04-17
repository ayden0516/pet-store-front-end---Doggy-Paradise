<template>
  <div class="main-container">
    <main class="container mt-5">
      <div class="row featurette">
        <div class="col-md-3">
          <!-- 圖片預覽 -->
          <div v-if="imagePreviewUrl" class="mb-3">
            <img :src="imagePreviewUrl" class="img-fluid" alt="Image Preview" />
          </div>
          <img v-else :src="memberImgPath" class="w-100" />
          <div v-if="editing" class="input-group mb-3">
            <input type="file" class="form-control" id="mainImgUpload" ref="mainImgUpload" accept="image/*"
              placeholder="自定義文字" @change="previewImage" />
          </div>
        </div>

        <div class="col-md-9">
          <div class="row mt-3 align-items-center">
            <div class="col-3 text-end">姓名</div>
            <span v-if="!editing" class="col">{{ memberName }}</span>
            <input v-else v-model="memberName" type="text" class="form-control" />
          </div>

          <div class="row mt-3 align-items-center">
            <div class="col-3 text-end">Email</div>
            <span class="col">{{ memberEmail }}</span>
          </div>

          <div class="row mt-3 align-items-center">
            <div class="col-3 text-end">性別</div>
            <span v-if="!editing" class="col">{{ memberGender }}</span>
            <span v-else class="col">
              <label>
                <input type="radio" name="gender" v-model="memberGender" value="男" />男性</label>
              <label>
                <input type="radio" name="gender" v-model="memberGender" value="女" />女性</label>
              <label>
                <input type="radio" name="gender" v-model="memberGender" value="其他" />其他</label>
            </span>
          </div>

          <div class="row mt-3 align-items-center">
            <div class="col-3 text-end">生日</div>
            <span v-if="!editing" class="col">{{
              memberBirthday ? memberBirthday.substring(0, 10) : ""
            }}</span>
            <span v-else class="col">
              <input v-model="memberBirthday" type="date" />
            </span>
          </div>

          <!-- <div class="row mt-3">
            <div class="col-3 text-end">違規次數</div>
            <div class="col">{{ memberViolationCount }}</div>
          </div> -->
        </div>
        <div class="col">
          <button v-if="editing" @click="showResetPasswordPage" class="btn btn-primary">
            修改密碼
          </button>
          <hr />
          <button v-if="!editing" @click="toggleEdit" class="btn btn-primary">
            編輯個人資訊
          </button>
          <div v-else>
            <button @click="saveChanges" class="btn btn-success me-2">
              保存
            </button>
            <button @click="refreshPage" class="btn btn-success">
              放棄修改
            </button>
          </div>
        </div>
      </div>
    </main>

    <!--重設密碼的彈出式視窗 -->
    <div ref="ResetPasswordPage" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h3>重設密碼</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div v-if="!resetSuccess" class="col-md-10 mx-auto col-lg-11">
              <form class="p-4 p-md-5 border rounded-3 bg-light">
                <div v-if="!googleFirstTime" class="form-floating mb-3">
                  <input type="password" class="form-control" placeholder="" v-model="oldPassword" required />
                  <label>請輸入原始密碼</label>
                </div>
                <div v-if="googleFirstTime" class="text-center">
                  <h3>您為 Google 登入，請設置新密碼</h3>
                  <hr class="my-4" />
                </div>

                <div class="form-floating mb-3">
                  <input type="password" class="form-control" placeholder="" v-model="newPassword" required />
                  <label>請輸入新密碼</label>
                </div>
                <div class="form-floating mb-3">
                  <input type="password" class="form-control" placeholder="" v-model="confirmPassword" required />
                  <label>請再次輸入新密碼</label>
                </div>
                <button class="w-100 btn btn-lg btn-primary" @click.prevent="updatePassword"
                  :disabled="showPassWordMismatch">
                  重設密碼
                </button>
                <div class="text-danger text-center mt-3" v-if="showPassWordMismatch">
                  新密碼不一致
                </div>
                <hr class="my-4" />
                <small class="text-muted">謹慎操作，以免遺失密碼或造成不必要的麻煩。Doggy
                  Paradise關心您</small>
              </form>
            </div>

            <h3 v-if="resetSuccess">修改密碼成功，將自動導回個人資訊頁</h3>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
    <!-- Modal 修改成功 -->
    <div class="modal" tabindex="-1" id="exampleModal">
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
</template>
<script>
import axios from "axios";
import { useMemberStore } from "@/stores/memberStore";

export default {
  data() {
    return {
      memberId: "",
      memberName: "",
      memberId: "",
      memberEmail: "",
      memberImgPath: "",
      memberViolationCount: "",
      memberGender: "",
      memberBirthday: "",
      editing: false,

      //修改密碼
      showPassWordMismatch: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      resetSuccess: false,
      googleFirstTime: false,
      //圖片預覽
      imagePreviewUrl: "",
    };
  },
  mounted() {
    const memberStore = useMemberStore();
    this.memberId = memberStore.memberId;

    if (memberStore.memberRole.startsWith("ROLE")) {
      console.log("emp");
      this.$router.push("/");
    }
    if (this.memberId == "") {
      this.$router.push("/login");
    }

    axios.get(`${this.API_URL}/getUserDetail`).then((re) => {
      console.log(re.data);
      const tmp = re.data;
      this.memberName = tmp.lastName;
      this.memberEmail = tmp.userEmail;
      this.memberImgPath = tmp.userImgPath;
      this.memberViolationCount = tmp.userViolationCount;
      this.memberGender = tmp.userGender;
      this.memberBirthday = tmp.birthDate;
    });

    axios.get(`${this.API_URL}/account/checkPasswordIsEmpty`).then((re) => {
      console.log("checkPasswordIsEmpty: " + re.data);
      this.googleFirstTime = re.data;
    });
  },
  watch: {
    confirmPassword(newVal, oldVal) {
      this.showPassWordMismatch = this.newPassword != this.confirmPassword;
    },
  },
  methods: {
    toggleEdit() {
      this.editing = !this.editing;
    },
    saveChanges() {
      const myModal = new bootstrap.Modal(
        document.getElementById(`exampleModal`)
      );
      myModal.show();

      // 五秒後自動關閉 modal
      setTimeout(() => {
        myModal.hide();
      }, 2600);

      this.editing = false;

      axios
        .post(
          `${this.API_URL}/account/update`,
          {
            userId: this.memberId,
            userEmail: this.memberEmail,
            lastName: this.memberName,
            userGender: this.memberGender,
            birthDate: this.memberBirthday,
          },
          {
            Headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            const memberStore = useMemberStore();
            memberStore.memberName = response.data.lastName;
            sessionStorage.setItem(
              "loggedInMenber",
              JSON.stringify(response.data)
            );
          } else {
            console.error("change failed");
          }
        });

      if (this.$refs.mainImgUpload.files.length == 0) {
        window.location.reload();
      }
      this.mainImgUpload();
    },
    refreshPage() {
      this.editing = !this.editing;
      this.imagePreviewUrl = "";
    },
    mainImgUpload() {
      if (this.memberId != null) {
        if (this.$refs.mainImgUpload.files.length > 0) {
          const fd = new FormData();
          fd.append("userId", this.memberId);
          fd.append("mainImg", this.$refs.mainImgUpload.files[0]);
          axios
            .post(`${this.API_URL}/account/addMainImg`, fd)
            .then((response) => {
              const memberStore = useMemberStore();
              memberStore.memberPhoto = response.data;
              this.memberImgPath = response.data;
              console.log("response.data" + response.data);
              this.getUserDetail();
              window.location.reload();
            })
            .catch((error) => {
              console.error("主題圖片新增失敗", error);
            });
        } else {
          console.log("沒有選擇任何圖片");
        }
      }
    },
    getUserDetail() {
      axios.get(`${this.API_URL}/getUserPassport`).then((re) => {
        sessionStorage.setItem("loggedInMenber", JSON.stringify(re.data));
      });
    },
    showResetPasswordPage() {
      const resetPasswordPage = new bootstrap.Modal(
        this.$refs.ResetPasswordPage
      );
      resetPasswordPage.show();
    },
    updatePassword() {
      const apiUrl = `${this.API_URL}/account/updatePassword`;
      const requestData = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      };

      axios
        .post(apiUrl, requestData)
        .then((response) => {
          this.resetSuccess = true;
          console.log("成功：", response.data);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((error) => {
          console.error("失敗：", error);
        });
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviewUrl = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>
<style scoped>
/* Sidebar 的外觀和佈局 */
.main-container {
  display: flex;
}

/* sideBar 按鈕的寬度 */
.custom-router-link {
  width: 100%;
  /* 設置寬度為父元素的 100% */
}

.error {
  color: red;
  /* 錯誤提示的顏色 */
}

img {
  width: 400px;
  height: 400px;
  object-fit: cover;
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
