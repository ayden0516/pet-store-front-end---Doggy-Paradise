<template>
  <header class="p-3 color bg-dark">
    <div class="container">
      <div
        class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"
      >
        <ul
          class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0"
        >
          <li>
            <img
              style="width: 60px; margin-right: 20px"
              src="https://res.cloudinary.com/dxz9qtntt/image/upload/v1712320726/m0px1710quyf7khpk770.png"
              alt="🐶"
            />
          </li>
          <li>
            <router-link to="/" class="nav-link px-2 text-secondary"
              >首頁</router-link
            >
          </li>
          <li>
            <router-link to="/shop/shopPage" class="nav-link px-2 text-white"
              >商城</router-link
            >
          </li>
          <li>
            <router-link to="/cart" class="nav-link px-2 text-white"
              >購物車</router-link
            >
          </li>
          <li>
            <router-link
              to="/activity/holdingActs"
              class="nav-link px-2 text-white"
              >寵活動</router-link
            >
          </li>

          <li>
            <router-link
              to="/tweetPage/tweetsWallPage"
              class="nav-link px-2 text-white"
              >動態牆</router-link
            >
          </li>
          <li>
            <router-link to="/room/b_page" class="nav-link px-2 text-white"
              >寵物旅館</router-link
            >
          </li>
          <li v-if="role && role.startsWith('ROLE')">
            <router-link to="/employee" class="nav-link px-2 text-white"
              >員工後臺</router-link
            >
          </li>
        </ul>

        <div class="text-end">
          <router-link
            v-if="!isloggedIn"
            to="/login"
            class="text-decoration-none"
          >
            <button type="button" class="btn btn-outline-light me-2">
              登入
            </button>
          </router-link>

          <template v-if="isloggedIn">
            <router-link to="/profile/detail" class="text-decoration-none">
              <button
                type="button"
                class="btn btn-success"
                v-if="role && role.startsWith('ROLE')"
              >
                {{ name }}</button
              ><button type="button" class="btn btn-warning" v-else>
                {{ name }}
              </button></router-link
            >
            <img
              :src="photo"
              width="40px"
              height="40px"
              class="mx-2"
              style="border-radius: 0.5rem; object-fit: cover"
              v-if="role && !role.startsWith('ROLE')"
            />
            <span v-else style="margin-right: 1rem"></span>

            <button @click="logout" type="button" class="btn btn-outline-light">
              登出
            </button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import { useMemberStore } from "@/stores/memberStore";
import axios from "axios";

export default {
  methods: {
    logout() {
      axios
        .get(`${this.API_URL}/logout`)
        .then((re) => {
          const memberStore = useMemberStore();
          memberStore.logout();
          this.$router.push("/");
        })
        .catch((error) => {
          console.log("failed", error);
        });
    },
  },
  computed: {
    id() {
      const memberStore = useMemberStore();
      return memberStore.memberId;
    },
    name() {
      const memberStore = useMemberStore();
      return memberStore.memberName;
    },
    photo() {
      return useMemberStore().memberPhoto;
    },
    isloggedIn() {
      return useMemberStore().isLoggedIn;
    },
    role() {
      // console.log(useMemberStore().memberRole);
      return useMemberStore().memberRole;
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
}

.text-end {
  display: flex;
  justify-content: end;
}
</style>
