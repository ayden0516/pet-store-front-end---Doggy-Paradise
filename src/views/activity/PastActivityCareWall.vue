<template>
  <div>
    <div id="title">
      <h5>
        <b>Past Activities</b>
      </h5>
    </div>
    <!-- 依分類 -->
    <div class="container bobo">
      <div class="grid-wrapper grid-col-auto">
        <label for="radio-card-0" class="radio-card">
          <input
            type="radio"
            name="radio-card"
            id="radio-card-0"
            value="0"
            v-model="chooseCat"
            @change="changeCategory"
          />
          <div class="card-content-wrapper">
            <span class="check-icon"></span>
            <div class="card-content">
              <img src="../../assets/dogall.png" alt="" />
              <h4>全部分類</h4>
            </div>
          </div>
        </label>
        <label for="radio-card-1" class="radio-card">
          <input
            type="radio"
            name="radio-card"
            id="radio-card-1"
            value="1"
            v-model="chooseCat"
            @change="changeCategory"
          />
          <div class="card-content-wrapper">
            <span class="check-icon"></span>
            <div class="card-content">
              <img src="../../assets/doghealth.png" alt="" />
              <h4>寵保健</h4>
            </div>
          </div>
        </label>
        <!-- /.radio-card -->

        <label for="radio-card-2" class="radio-card">
          <input
            type="radio"
            name="radio-card"
            id="radio-card-2"
            value="2"
            v-model="chooseCat"
            @change="changeCategory"
          />
          <div class="card-content-wrapper">
            <span class="check-icon"></span>
            <div class="card-content">
              <img src="../../assets/dogeat.png" alt="" />
              <h4>寵試吃</h4>
            </div>
          </div>
        </label>
        <!-- /.radio-card -->
        <label for="radio-card-3" class="radio-card">
          <input
            type="radio"
            name="radio-card"
            id="radio-card-3"
            value="3"
            v-model="chooseCat"
            @change="changeCategory"
          />
          <div class="card-content-wrapper">
            <span class="check-icon"></span>
            <div class="card-content">
              <img src="../../assets/dogplay.png" alt="" />
              <h4>寵跑跳</h4>
            </div>
          </div>
        </label>
      </div>
      <!-- /.grid-wrapper -->
    </div>
    <!-- /.container -->

    <!-- 活動卡 -->
    <div class="py-1 bg-light actCard">
      <div class="container">
        <div class="row">
          <div class="col">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <button
                  v-if="currentPage != 1"
                  class="page-link"
                  @click="goForwardPage"
                >
                  <span>🐾</span>
                </button>
              </li>
              <!--分頁處理-->
              <!--@click="gotoPage(P)"綁定頁碼事件-->
              <li
                class="page-item"
                v-for="p of showPageBar"
                @click="goToPage(p)"
                :class="{ active: p == currentPage }"
              >
                <button class="page-link">{{ p }}</button>
              </li>
              <!--分頁處理-->
              <!--@click="gotoPage(P)"綁定頁碼事件-->
              <li class="page-item">
                <button
                  v-if="currentPage != totalPage"
                  class="page-link"
                  @click="goNextPage"
                >
                  <span>🐾</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <!-- v-for -->
          <div class="col" v-for="a in activities" :key="a.activityId">
            <div class="card">
              <router-link
                :to="{
                  name: 'activityInfo',
                  params: { activityId: a.activityId },
                }"
              >
                <img :src="`${a.galleryImgUrl}`" class="card-img-top" alt="..."
              /></router-link>
              <div class="card-img-overlay" style="height: 50px" v-if="isUser">
                <button class="likebtn" @click="toggleLike(a.activityId)">
                  <i
                    :class="{
                      'fa-solid fa-heart': userLikedList.includes(a.activityId),
                      'fa-regular fa-heart': !userLikedList.includes(
                        a.activityId
                      ),
                    }"
                    style="color: #ff0550"
                  ></i>
                </button>
                <span style="color: beige; font-weight: 600; font-size: small"
                  >&nbsp;{{ a.likedTime }}</span
                >
              </div>

              <div class="card-body">
                <h5 class="card-title">
                  <b>{{ a.activityTitle }}</b>
                </h5>
                <p class="card-text">
                  <b>活動日期:&nbsp;</b>{{ a.activityDate }}
                  {{ this.timeFormat(a.activityStart) }} ~
                  {{ this.timeFormat(a.activityEnd) }}
                  <br />
                  <b>活動場地:&nbsp;</b>{{ a.venueName }}
                  <br />
                  <b>活動費用:&nbsp;</b>{{ a.activityCost }} 元/每🐶
                  <br />
                  <b>現在報名狀況:&nbsp;</b>毛孩:{{ a.currentDogNumber }}/{{
                    a.activityDogNumber
                  }}&nbsp;&nbsp;(共{{ a.currentUserNumber }}位飼主 )
                </p>
              </div>
              <div class="card-footer">
                <div class="row">
                  <div class="col-md-7">
                    <small class="text-body-secondary a"
                      ><b>截止:&nbsp;</b>
                      {{ this.dateFormat(a.activityClosingDate) }}</small
                    >
                  </div>
                  <div class="col-md-5 ms-auto">
                    <div>ฅ֞•ﻌ•֞ฅ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { useMemberStore } from "@/stores/memberStore";
import { useActivityStore } from "@/stores/activityStore";

export default {
  data() {
    return {
      chooseCat: 1,
      activities: [],
      userLikedList: [],
      isUser: false,
      userId: "",
      chooseAct: "",
      activityDogNumber: null,
      currentDogNumber: null,
      currentPage: 1,
      totalPage: 0,
    };
  },
  mounted() {
    const memberStore = useMemberStore();
    console.log(memberStore.memberRole);
    if (memberStore.memberRole.startsWith("Act")) {
      this.isUser = true;
      this.userId = memberStore.memberId;
    }
    axios
      .get(`${this.API_URL}/activity/api/pastAct/category/1/1`)
      .then((rs) => {
        console.log(rs.data);
        this.activities = rs.data.content;
        this.totalPage = rs.data.totalPages;
        this.currentPage = rs.data.number + 1;
        console.log("現在是", this.currentPage);
      })
      .then((rs) => {
        if (this.isUser) {
          this.getLikedActs();
        }
      });
  },
  methods: {
    getLikedActs() {
      axios
        .get(`${this.API_URL}/activity/api/usersLiked/${this.userId}`)
        .then((rs) => {
          this.userLikedList = rs.data;
          console.log(this.userLikedList);
        });
    },
    toggleLike(activityId) {
      const index = this.userLikedList.indexOf(activityId);
      if (index === -1) {
        this.userLikedList.push(activityId); //不在list就加進去
        this.incrementLikedTime(activityId); ///////
        if (this.isUser) {
          const fd = new FormData();
          fd.append("userId", this.userId);
          fd.append("activityId", activityId);
          axios
            .post(`${this.API_URL}/activity/api/userDo/like`, fd)
            .then((response) => {
              console.log("like成功", response.data);
            })
            .catch((error) => {
              console.error("like失敗", error);
            });
        }
      } else {
        this.userLikedList.splice(index, 1);
        this.decrementLikedTime(activityId); ///////
        if (this.isUser) {
          const fd = new FormData();
          fd.append("userId", this.userId);
          fd.append("activityId", activityId);
          axios
            .post(`${this.API_URL}/activity/api/userDo/dislike`, fd)
            .then((response) => {
              console.log("dislike成功", response.data);
            })
            .catch((error) => {
              console.error("dislike失敗", error);
            });
        }
      }
    },
    incrementLikedTime(activityId) {
      // 尋找到對應的 activity，並將 likedTime 屬性加 1
      const activity = this.activities.find((a) => a.activityId === activityId);
      if (activity) {
        activity.likedTime++;
      }
    },
    decrementLikedTime(activityId) {
      // 尋找到對應的 activity，並將 likedTime 屬性減 1
      const activity = this.activities.find((a) => a.activityId === activityId);
      if (activity && activity.likedTime > 0) {
        activity.likedTime--;
      }
    },
    changeCategory() {
      console.log(this.chooseCat);
      if (this.chooseCat == 0) {
        this.$router.push("/activity/pastActs");
      } else if (this.chooseCat == 2) {
        this.$router.push("/activity/pastActs/eat");
      } else if (this.chooseCat == 3) {
        this.$router.push("/activity/pastActs/play");
      }
    },
    goForwardPage() {
      this.currentPage = this.currentPage - 1;
    },
    goToPage(p) {
      if (p == "...") {
        return;
      }
      this.currentPage = p;
    },
    goNextPage() {
      this.currentPage = this.currentPage + 1;
    },
    timeFormat(time) {
      time = time.substring(0, time.length - 3);
      return time;
    },
    dateFormat(dateString) {
      const weekdays = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];
      const date = new Date(dateString);

      // 分別年月日和星期
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = weekdays[date.getDay()];

      // 拼接格式化后的日期字串
      const formattedDate = `${year}-${month}-${day} ${weekday}`;

      return formattedDate;
    },
  },
  computed: {
    showPageBar() {
      const cp = this.currentPage;
      const tp = this.totalPage;

      let arr = [1];

      if (tp <= 5) {
        for (let i = 2; i <= tp; i++) {
          arr.push(i);
        }
      } else {
        if (cp > 3) {
          arr.push("...");
        }
        for (let i = cp - 1; i <= cp + 1; i++) {
          if (i > 1 && i < tp) {
            arr.push(i);
          }
        }

        if (cp < tp - 2) {
          arr.push("...");
        }

        arr.push(tp);
      }

      return arr;
    },
  },
  watch: {
    //綁定頁碼與商品頁面
    currentPage(newVal, oldVal) {
      axios
        .get(`${this.API_URL}/activity/api/pastAct/category/1/${newVal}`)
        .then((rs) => {
          this.totalPage = rs.data.totalPages;
          this.activities = rs.data.content;
        });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.likebtn {
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.actCard {
  border-radius: 0.2rem;
}

.bobo {
  font-family: "Open Sans", sans-serif;
  font-size: 15px;
  line-height: 1.5;
  font-weight: 400;
  border-radius: 0.2rem;
  /* background: #f0f3f6; */
  color: #3a3a3a;
}

label,
input {
  cursor: pointer;
}

h4 {
  font-weight: 600;
  line-height: 1.3;
  color: #1f2949;
  font-size: 14px;
}

img {
  max-width: 100%;
  display: block;
  vertical-align: middle;
}

.container {
  max-width: 99vw;
  margin: 10px auto;
  padding: 0 5px;
}

.top-text-wrapper {
  margin: 10px 0 10px 0;
}

.top-text-wrapper h4 {
  font-size: 24px;
  margin-bottom: 10px;
}

.top-text-wrapper code {
  font-size: 0.85em;
  background: linear-gradient(90deg, #fce3ec, #ffe8cc);
  color: #ff2200;
  padding: 0.1rem 0.3rem 0.2rem;
  border-radius: 0.2rem;
}

.tab-section-wrapper {
  padding: 30px 0;
}

.grid-wrapper {
  display: grid;
  grid-gap: 30px;
  place-items: center;
  place-content: center;
}

.grid-col-auto {
  grid-auto-flow: column;
  grid-template-rows: auto;
}

/* ******************* Main Styeles : Radio Card */
label.radio-card {
  cursor: pointer;
}
label.radio-card .card-content-wrapper {
  background: #fff;
  border-radius: 5px;
  max-width: 100px;
  min-height: 100px;
  padding: 5px;
  display: grid;
  box-shadow: 0 2px 4px 0 rgba(219, 215, 215, 0.04);
  transition: 200ms linear;
}
label.radio-card .check-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  border: solid 2px #e3e3e3;
  border-radius: 50%;
  transition: 200ms linear;
  position: relative;
}
label.radio-card .check-icon:before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='9' viewBox='0 0 12 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.93552 4.58423C0.890286 4.53718 0.854262 4.48209 0.829309 4.42179C0.779553 4.28741 0.779553 4.13965 0.829309 4.00527C0.853759 3.94471 0.889842 3.88952 0.93552 3.84283L1.68941 3.12018C1.73378 3.06821 1.7893 3.02692 1.85185 2.99939C1.91206 2.97215 1.97736 2.95796 2.04345 2.95774C2.11507 2.95635 2.18613 2.97056 2.2517 2.99939C2.31652 3.02822 2.3752 3.06922 2.42456 3.12018L4.69872 5.39851L9.58026 0.516971C9.62828 0.466328 9.68554 0.42533 9.74895 0.396182C9.81468 0.367844 9.88563 0.353653 9.95721 0.354531C10.0244 0.354903 10.0907 0.369582 10.1517 0.397592C10.2128 0.425602 10.2672 0.466298 10.3112 0.516971L11.0651 1.25003C11.1108 1.29672 11.1469 1.35191 11.1713 1.41247C11.2211 1.54686 11.2211 1.69461 11.1713 1.82899C11.1464 1.88929 11.1104 1.94439 11.0651 1.99143L5.06525 7.96007C5.02054 8.0122 4.96514 8.0541 4.90281 8.08294C4.76944 8.13802 4.61967 8.13802 4.4863 8.08294C4.42397 8.0541 4.36857 8.0122 4.32386 7.96007L0.93552 4.58423Z' fill='white'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-size: 12px;
  background-position: center center;
  transform: scale(1.6);
  transition: 200ms linear;
  opacity: 0;
}
label.radio-card input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}
label.radio-card input[type="radio"]:checked + .card-content-wrapper {
  box-shadow: 0 2px 4px 0 rgba(219, 215, 215, 0.5), 0 0 0 2px #3057d5;
}
label.radio-card
  input[type="radio"]:checked
  + .card-content-wrapper
  .check-icon {
  background: #3057d5;
  border-color: #3057d5;
  transform: scale(1.2);
}
label.radio-card
  input[type="radio"]:checked
  + .card-content-wrapper
  .check-icon:before {
  transform: scale(1);
  opacity: 1;
}
label.radio-card input[type="radio"]:focus + .card-content-wrapper .check-icon {
  box-shadow: 0 0 0 4px rgba(48, 86, 213, 0.2);
  border-color: #3056d5;
}
label.radio-card .card-content img {
  margin-bottom: 5px;
}
label.radio-card .card-content h4 {
  font-size: 16px;
  letter-spacing: -0.24px;
  text-align: center;
  color: #1f2949;
  margin-bottom: 3px;
}
#title {
  color: #874a33;
  margin: auto 20px;
  padding: 20px 20px;
  text-align: center;
}
</style>
