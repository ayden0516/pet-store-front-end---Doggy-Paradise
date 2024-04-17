<template>
  <div class="wall">
    <div id="title">
      <table>
        <tbody>
          <tr>
            <td style="vertical-align: middle">
              <p class="titleh4">
                <b>我的收藏</b>
              </p>
            </td>
            <td style="vertical-align: middle">
              <img
                src="https://res.cloudinary.com/dxz9qtntt/image/upload/v1712386226/vxnuv2o0jurjvimcw5oi.png"
                alt="🐶"
                id="managerPic"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="sumCat" v-if="activities.length > 0" class="summary">
      <h6 class="sunText">
        總共收藏了 {{ activities.length }} 項活動 !! 🌼 寵保健：{{
          careCount
        }}　🥯寵試吃：{{ eatCount }}　🫧寵跑跳：{{ runCount }}
      </h6>
    </div>
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:400,700"
      rel="stylesheet"
    />

    <section class="hero-section">
      <div class="card-grid" v-if="activities.length > 0">
        <a class="card" href="#" v-for="a of activities" :key="a.activityId">
          <router-link
            :to="{
              name: 'activityInfo',
              params: { activityId: a.activityId },
            }"
          >
            <div
              class="card__background"
              :style="{ 'background-image': 'url(' + a.galleryImgUrl + ')' }"
            ></div
          ></router-link>

          <div class="card__content">
            <p class="card__category">{{ a.activityTypeName }}</p>
            <h6 class="card__heading">{{ a.activityTitle }}</h6>
            <button class="likebtn" @click="toggleLike(a.activityId)">
              <i
                :class="{
                  'fa-solid fa-heart': userLikedList.includes(a.activityId),
                  'fa-regular fa-heart': !userLikedList.includes(a.activityId),
                }"
                style="color: #fb6068"
              ></i>
            </button>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import { useMemberStore } from "@/stores/memberStore";
export default {
  data() {
    return {
      activities: [],
      userLikedList: [],
      myDogsNotAttend: [],
      userId: "",
      chooseAct: "",
      chooseActTitle: "",
      activityDogNumber: null,
      currentDogNumber: null,
      chooseDogs: [],
      note: "",
      isUser: false,
      joinSuccess: false,
      currentPage: 1,
      totalPage: 0,
      message: "",
      isJoinButtonVisible: true,
      isJoinButtonDisabled: false,
    };
  },
  mounted() {
    const memberStore = useMemberStore();
    console.log(memberStore.memberRole);
    if (!memberStore.memberRole.startsWith("Act")) {
      this.isJoinButtonVisible = false;
      this.isJoinButtonDisabled = true;
    }
    if (memberStore.memberRole.startsWith("Act")) {
      this.isUser = true;
      this.userId = memberStore.memberId;
    }
    axios
      .get(`${this.API_URL}/activity/api/likedManager/${this.userId}`)
      .then((rs) => {
        const myActivitiesObj = Object.values(rs.data);
        this.activities = JSON.parse(JSON.stringify(myActivitiesObj));
        console.log(this.activities);
        console.log(this.activities[0].galleryImgUrl);
      })
      .then((rs) => {
        if (this.isUser) {
          this.getLikedActs();
          console.log("hi guest");
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
    getActivityTypeCount(type) {
      return this.activities.filter(
        (activity) => activity.activityTypeName === type
      ).length;
    },
    toggleLike(activityId) {
      const index = this.userLikedList.indexOf(activityId);
      if (index === -1) {
        this.userLikedList.push(activityId); //不在list就加進去
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
  },
  computed: {
    eatCount() {
      return this.getActivityTypeCount("寵試吃");
    },
    runCount() {
      return this.getActivityTypeCount("寵跑跳");
    },
    careCount() {
      return this.getActivityTypeCount("寵保健");
    },
  },
};
</script>
<style>
#title {
  color: #874a33;
  margin: auto 20px;
  padding: 20px 20px;
  text-align: center;
  justify-content: center;
  display: flex;
}
.titleh4 {
  font-weight: 700;
  font-size: 20px;
  color: #c4445a;
}
#managerPic {
  height: 80px;
  padding-left: 10px;
}
.sunText {
  text-align: center;
  font-weight: 800;
  font-size: medium;
  color: #e4545d;
}
.likebtn {
  background-color: rgba(255, 255, 255, 0.6);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
:root {
  --background-dark: #2d3548;
  --text-light: rgba(255, 255, 255, 0.6);
  --text-lighter: rgba(255, 255, 255, 0.9);
  --spacing-s: 8px;
  --spacing-m: 16px;
  --spacing-l: 24px;
  --spacing-xl: 32px;
  --spacing-xxl: 64px;
  --width-container: 1200px;
}

* {
  border: 0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  height: 100%;
  font-family: "Montserrat", sans-serif;
  font-size: 14px;
}

body {
  height: 100%;
}

.hero-section {
  align-items: flex-start;
  /* background-image: linear-gradient(15deg, #0f4667 0%, #2a6973 150%); */
  display: flex;
  min-height: 100%;
  justify-content: center;
  padding: var(--spacing-xxl) var(--spacing-l);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-column-gap: var(--spacing-l);
  grid-row-gap: var(--spacing-l);
  max-width: var(--width-container);
  width: 100%;
}

@media (min-width: 540px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.card {
  list-style: none;
  position: relative;
  border: none;
}

.card:before {
  content: "";
  display: block;
  padding-bottom: 150%;
  width: 100%;
}

.card__background {
  background-size: cover;
  background-position: center;
  border-radius: var(--spacing-l);
  bottom: 0;
  filter: brightness(0.75) saturate(1.2) contrast(0.85);
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transform-origin: center;
  transform: scale(1) translateZ(0);
  transition: filter 200ms linear, transform 200ms linear;
}

.card:hover .card__background {
  transform: scale(1.05) translateZ(0);
}

.card-grid:hover > .card:not(:hover) .card__background {
  filter: brightness(0.5) saturate(0) contrast(1.2) blur(20px);
}

.card__content {
  left: 0;
  padding: var(--spacing-l);
  position: absolute;
  top: 0;
}

.card__category {
  color: rgba(250, 250, 250, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: var(--spacing-s);
  text-transform: uppercase;
}

.card__heading {
  color: var(--text-lighter);
  font-size: 1rem;
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.2);
  line-height: 1.4;
  word-spacing: 100vw;
}
</style>
