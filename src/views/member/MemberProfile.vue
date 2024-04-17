<template>
  <div class="main-container">
    <!-- sideBar -->
    <div class="sidebar">
      <div id="leftside-navigation" class="nano">
        <ul class="nano-content">
          <li class="sortName">個人資訊管理</li>
          <li>
            <router-link to="/profile/detail">
              <i class="fa-regular fa-user"></i>
              <span> 個人資訊 </span>
            </router-link>
          </li>

          <li></li>
          <li>
            <router-link to="/profile/order">
              <i class="fa-regular fa-calendar-days"></i>
              <span> 我的訂單 </span>
            </router-link>
          </li>
          <li>
            <router-link to="/profile/mydog">
              <i class="fa-solid fa-dog"></i>
              <span> 我的狗勾 </span>
            </router-link>
          </li>
          <li>
            <router-link to="/profile/addDog">
              <i class="fa-solid fa-paw"></i>
              <span> 新增狗勾 </span>
            </router-link>
          </li>
          <li>
            <router-link to="/profile/collection">
              <i class="fa-regular fa-calendar-days"></i>
              <span> 我的收藏 </span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- 本體 -->
    <div class="main">
      <router-view>
        <template v-slot="{ Component }">
          <component :is="Component" />
        </template></router-view>
      <!-- <router-view>
        <template v-slot="{ Component }">
          <transition name="slide-left" mode="out-in">
            <component :is="Component" />
          </transition> </template
      ></router-view> -->
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useMemberStore } from "@/stores/memberStore";

const memberId = ref();
const role = ref();

onMounted(() => {
  const memberStore = useMemberStore();
  memberId.value = memberStore.memberId;
  role.value = memberStore.memberRole;

  $("#leftside-navigation .sub-menu > a").click(function (e) {
    $("#leftside-navigation ul ul").slideUp(),
      $(this).next().is(":visible") || $(this).next().slideDown(),
      e.stopPropagation();
  });
});
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,400,700");
@import url("//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.min.css");

.main {
  width: 80vw;
  /* padding-left: 50px; */
  margin: 0 auto;
  /* 水平置中 */
}

.main-container {
  display: flex;
}

.sidebar {
  padding: 20px;
  height: 100vh;
  width: 15vw;
  background: #263747;
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  position: sticky;
  z-index: 100;
  top: 0;
}

.sidebar #leftside-navigation ul,
.sidebar #leftside-navigation ul ul {
  margin: -2px 0 0;
  padding: 0;
}

.sidebar #leftside-navigation ul li {
  list-style-type: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar #leftside-navigation ul li.active>a {
  color: #6579eb;
}

.sidebar #leftside-navigation ul li.active ul {
  display: block;
}

.sidebar #leftside-navigation ul li a {
  color: #cacdd1;
  text-decoration: none;
  display: block;
  padding: 18px 0 18px 25px;
  font-size: 12px;
  outline: 0;
  -webkit-transition: all 200ms ease-in;
  -moz-transition: all 200ms ease-in;
  -o-transition: all 200ms ease-in;
  -ms-transition: all 200ms ease-in;
  transition: all 200ms ease-in;
}

.sidebar #leftside-navigation ul li a:hover {
  color: #7990af;
}

span {
  display: inline-block;
  font-size: 14px;
}

i {
  width: 30px;
}

.sidebar #leftside-navigation ul li a i .fa-angle-left,
.sidebar #leftside-navigation ul li a i .fa-angle-right {
  padding-top: 3px;
}

.sidebar #leftside-navigation ul ul {
  display: none;
}

.sidebar #leftside-navigation ul ul li {
  background: #23313f;
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  border-bottom: none;
}

.slide-left-enter {
  opacity: 0;
  -webkit-transform: translate(-20px, 0);
  transform: translate(-20px, 0);
}

.slide-left-enter-active {
  transition: all 0.4s ease;
}

.slide-left-leave-to {
  opacity: 0;
  -webkit-transform: translate(20px, 0);
  transform: translate(20px, 0);
}

.slide-left-leave-active {
  transition: all 0.4s ease;
}

.sortName {
  padding-bottom: 15px;
  padding-top: 15px;
  text-align: center;
  font-weight: 600;
  font-size: medium;
  color: #8e9eb5;
}
</style>
