<template>
  <main class="container col-xl-10 col-xxl-8 px-4 py-5">
    <div class="row align-items-center g-lg-5 py-5">
      <div class="col-lg-7 text-center text-lg-start">
        <h1 @click="check" class="display-4 fw-bold lh-1 mb-3">
          歡迎來到<br />
          Doggy Paradise!
        </h1>
        <p class="col-lg-10 fs-4">
          由指尖開始探索Doggy Paradise!<br />您寵寵物，我們寵你!提供您各式狗狗用品、寵平台社交，預訂寵物旅館，参加精彩活動，一站式滿足您與寵物的所有需求，一切由您的指尖玩轉，享受樂園般的寵生活體驗！
        </p>
      </div>
      <div class="col-md-10 mx-auto col-lg-5">
        <form class="p-4 p-md-5 border rounded-3 bg-light">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="name@example.com"
              v-model="email"
            />
            <label>Email address</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              placeholder="Password"
              v-model="password"
            />
            <label>Password</label>
          </div>
          <div class="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div>
          <button class="w-100 btn btn-lg btn-primary" @click.prevent="login">
            登入
          </button>

          <div class="text-danger text-center mt-3">{{ message }}</div>
          <div class="d-flex justify-content-between mt-3">
            <button
              class="btn btn-outline-primary"
              @click.prevent="redirectToRegisterPage"
            >
              註冊
            </button>

            <button
              class="btn btn-outline-primary"
              @click.prevent="redirectToForgetPassWordPage"
            >
              忘記密碼
            </button>

            <button
              class="btn btn-outline-danger"
              @click.prevent="gotoGoogleLoginPage"
            >
              Google登入
            </button>
          </div>

          <hr class="my-4" />
          <small class="text-muted"
            >使用服務即表示您同意我們的<a href="#">使用條款</a></small
          >
        </form>
      </div>
    </div>
  </main>
</template>
<script>
import axios from "axios";
import { useMemberStore } from "@/stores/memberStore";

export default {
  data() {
    return {
      email: "amy@mail.com",
      password: "1234",
      message: "",
    };
  },
  methods: {
    login() {
      const fd = new FormData();
      fd.append("email", this.email);
      fd.append("password", this.password);

      axios
        .post(`${this.API_URL}/formLogin`, fd)
        .then((rs) => {
          const memberStore = useMemberStore(); //pinia
          memberStore.loginSuccess(rs.data); //pinia
          this.message = "";
          console.log(rs.data);

          sessionStorage.setItem("loggedInMenber", JSON.stringify(rs.data));

          this.$router.push("/");
        })
        .catch(() => {
          this.message = "登入失敗";
        });
    },
    check() {
      axios.get(`${this.API_URL}/check`).then((re) => console.log(re.data));
    },
    redirectToRegisterPage() {
      this.$router.push("/register");
    },
    gotoGoogleLoginPage() {
      window.location.href = "http://localhost:8080/google-login";
    },
    redirectToForgetPassWordPage() {
      this.$router.push("/forgetPassword");
    },
  },
};
</script>
<style scoped></style>
