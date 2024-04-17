<template>
  <div>
    <div id="title">
      <table>
        <tbody>
          <tr>
            <td style="vertical-align: middle">
              <p class="titleh4">
                <b>過去參加活動紀錄</b>
              </p>
            </td>
            <td style="vertical-align: middle">
              <img
                src="../../assets/pastManager.png"
                alt="🐶"
                id="managerPic"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 主要內容 -->
    <div class="py-1 bg-light">
      <div class="container">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">管理</th>
              <!-- <th scope="col">報名狀態</th> -->
              <th scope="col">活動日期</th>
              <th scope="col">活動名稱</th>
              <th scope="col">
                活動狀態
                <span id="loading">
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <div
                    class="spinner-grow spinner-grow-sm text-danger"
                    role="status"
                  >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </span>
              </th>
              <th scope="col">參加的狗狗</th>
            </tr>
          </thead>
          <tbody class="smallText" v-if="myEndedList.length < 1">
            <tr>
              <th
                colspan="5"
                style="text-align: center; font-weight: 400; line-height: 36px"
              >
                還沒有結束的活動喔🐾
              </th>
            </tr>
          </tbody>
          <tbody
            class="smallText"
            v-if="myEndedList.length > 0"
            v-for="a of myEndedList"
            :key="a.userJoinedId"
          >
            <tr v-if="a.activityStatus === '活動已結束'">
              <th scope="row">
                <button
                  :class="{
                    'btn btn-outline-success me-md-2':
                      userfinishedList.includes(a.activityId),
                    'btn btn-warning me-md-2': !userfinishedList.includes(
                      a.activityId
                    ),
                  }"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  :id="a.activityId"
                  @click="updatePrepare(a.activityId, a.activityTitle)"
                >
                  <span v-if="!userfinishedList.includes(a.activityId)"
                    >尚未</span
                  >評論<span v-if="userfinishedList.includes(a.activityId)"
                    >完成</span
                  >
                </button>
              </th>
              <!-- <td>{{ a.joinedStatus }}</td> -->
              <td>
                {{ a.activityDate }} {{ this.timeFormat(a.activityStart) }} ~
                {{ this.timeFormat(a.activityEnd) }}
              </td>
              <td>
                <router-link
                  :to="{
                    name: 'activityInfo',
                    params: { activityId: a.activityId },
                  }"
                  ><button class="actTag btn smallText">
                    {{ a.activityTitle }}
                  </button>
                </router-link>
              </td>
              <td>{{ a.activityStatus }}</td>
              <td>
                <span v-for="d of a.dogList">{{ d }}&nbsp;</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 互動視窗 -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">來寫寫評論吧!🐶</h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <!-- 表單內容 -->
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label"
                  >所參加的活動</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="recipient-name"
                  :value="chooseActTitle"
                  readonly
                />
              </div>

              <div>
                <label for="" class="col-form-label">
                  參與的狗狗 ฅ՞•ﻌ•՞ฅ~
                </label>
                <div>
                  <span
                    v-for="d in myDogJoinedList"
                    :key="d.dogId"
                    class="mb-2"
                  >
                    <label class="doggy">
                      <img
                        :src="d.dogImgPathCloud"
                        class="dogProfile"
                        alt="🐶"
                      />
                      <p class="checkbox__textwrapper">{{ d.dogName }}</p>
                    </label>
                  </span>
                </div>
              </div>
              <!-- 改成評論? -->
              <div>
                <label for="" style="line-height: 20px; margin-bottom: 10px"
                  ><b>想為我們的活動評論幾星呢!</b></label
                >
                <form id="starform">
                  <fieldset class="stars" @change="checkComplete">
                    <input
                      type="radio"
                      name="stars"
                      id="star1"
                      value="5"
                      v-model="starScore"
                      ontouchstart="ontouchstart"
                    />
                    <label class="fa fa-star" for="star1"></label>
                    <input
                      type="radio"
                      name="stars"
                      id="star2"
                      value="4"
                      v-model="starScore"
                      ontouchstart="ontouchstart"
                    />
                    <label class="fa fa-star" for="star2"></label>
                    <input
                      type="radio"
                      name="stars"
                      id="star3"
                      value="3"
                      v-model="starScore"
                      ontouchstart="ontouchstart"
                    />
                    <label class="fa fa-star" for="star3"></label>
                    <input
                      type="radio"
                      name="stars"
                      id="star4"
                      value="2"
                      v-model="starScore"
                      ontouchstart="ontouchstart"
                    />
                    <label class="fa fa-star" for="star4"></label>
                    <input
                      type="radio"
                      name="stars"
                      id="star5"
                      value="1"
                      v-model="starScore"
                      ontouchstart="ontouchstart"
                    />
                    <label class="fa fa-star" for="star5"></label>
                  </fieldset>
                </form>
              </div>
              <div class="mb-2">
                <label for="message-text" class="col-form-label"
                  ><b>寫點心得吧!</b></label
                >
                <textarea
                  class="form-control"
                  id="message-text"
                  @change.lazy="checkComplete"
                  v-model="comment"
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              v-if="checkComplete && isFirstTime"
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              id="doBtn"
              disabled
              @click="doComment"
            >
              送出評論
            </button>
            <button
              v-if="checkComplete && isFirstTime == false"
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              id="updateBtn"
              disabled
              @click="updateComment"
            >
              完成修改
            </button>
          </div>
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
      userId: null,
      userfinishedList: [],
      myEndedList: [],
      chooseAct: "",
      chooseActTitle: "",
      activityDogNumber: null,
      currentDogNumber: null,
      isFirstTime: true,
      starScore: null,
      oldstarScore: null,
      oldCommentId: null,
      comment: "",
      oldcomment: "",
      message: "",
      myDogJoinedList: [],
    };
  },
  mounted() {
    const memberStore = useMemberStore();
    if (memberStore.memberRole.startsWith("Act")) {
      this.userId = memberStore.memberId;
      axios
        .get(`${this.API_URL}/activity/api/activityManager/${this.userId}`)
        .then((rs) => {
          const myActivitiesObj = Object.values(rs.data);
          const myJoinedList = JSON.parse(JSON.stringify(myActivitiesObj));
          this.myEndedList = myJoinedList.filter(
            (activity) => activity.activityStatus === "活動已結束"
          );

          console.log(this.myEndedList);
        })
        .then((rs) => {
          if (this.myEndedList.length > 0) {
            this.getFinishedList();
          }
        })
        .catch((error) => {
          console.error("Activities eroor:", error);
        });
    }
  },
  methods: {
    doComment() {
      const fd = new FormData();
      fd.append("userId", this.userId);
      fd.append("activityId", this.chooseAct);
      fd.append("commentText", this.comment);
      fd.append("score", this.starScore);
      axios
        .post(`${this.API_URL}/activity/api/activityManager/doComment`, fd)
        .then((response) => {
          console.log("comment成功", response.data);
        })
        .then((rs) => {
          this.updatePage();
        })
        .catch((error) => {
          console.error("comment失敗", error);
        });
    },
    updateComment() {
      const fd = new FormData();
      fd.append("commentId", this.oldCommentId);
      fd.append("commentText", this.comment);
      fd.append("score", this.starScore);
      axios
        .post(
          `${this.API_URL}/activity/api/activityManager/doComment/update`,
          fd
        )
        .then((rs) => {
          console.log(" update comment成功", rs.data);
        })
        .then((rs) => {
          this.updatePage();
        })
        .catch((error) => {
          console.error("update comment失敗", error);
        });
    },
    updatePage() {
      let loading = document.getElementById("loading");
      loading.style.display = "inline";
      setTimeout(function () {
        let loading = document.getElementById("loading");
        loading.style.display = "none";
      }, 3000);
      window.location.reload();
    },
    getFinishedList() {
      axios
        .get(
          `${this.API_URL}/activity/api/activityManager/get/${this.userId}/commentList`
        )
        .then((rs) => {
          this.userfinishedList = rs.data;
          console.log("完成的活動有: ", this.userfinishedList);
        });
    },
    getMyComment(activityId) {
      axios
        .get(
          `${this.API_URL}/activity/api/activityManager/get/${this.userId}/comment/${activityId}`
        )
        .then((rs) => {
          console.log(rs.data);
          this.oldCommentId = rs.data.commentId;
          this.oldcomment = rs.data.commentText;
          this.comment = rs.data.commentText;
          this.oldstarScore = rs.data.score;
          this.starScore = rs.data.score;
          this.isFirstTime = false;
          console.log("以前給星: ", this.oldstarScore);
        })
        .catch((error) => {
          console.error("取評論錯誤: ", error);
        });
    },
    checkComplete() {
      console.log(this.starScore);
      if (this.isFirstTime) {
        const doBtn = document.getElementById("doBtn");
        if (this.starScore != null) {
          doBtn.disabled = false;
        } else {
          doBtn.disabled = true;
        }
      } else {
        const updateBtn = document.getElementById("updateBtn");
        if (
          this.starScore === this.oldstarScore &&
          this.comment === this.oldcomment
        ) {
          updateBtn.disabled = true;
        } else {
          updateBtn.disabled = false;
        }
      }
    },
    updatePrepare(activityId, activityTitle) {
      const memberStore = useMemberStore();
      console.log(memberStore.memberRole);
      this.chooseAct = activityId;
      this.chooseActTitle = activityTitle;
      this.isFirstTime = true;
      console.log("所選擇的活動id: ", this.chooseAct);
      if (memberStore.memberRole.startsWith("Act")) {
        axios
          .get(
            `${this.API_URL}/activity/api/activityManager/${this.userId}/findDogListIn/${this.chooseAct}`
          )
          .then((rs) => {
            const myActivitiesObj = Object.values(rs.data);
            this.myDogJoinedList = JSON.parse(JSON.stringify(myActivitiesObj));
            console.log(this.myDogJoinedList);
          })
          .then((rs) => {
            if (this.userfinishedList.includes(activityId)) {
              this.getMyComment(activityId);
            }
          })
          .catch((error) => {
            console.error("Activities eroor:", error);
          });
      }
    },
    timeFormat(time) {
      time = time.substring(0, time.length - 3);
      return time;
    },
  },
};
</script>
<style scoped>
#title {
  color: #874a33;
  margin: auto 20px;
  padding: 20px 20px;
  display: flex;
  justify-content: center;
  text-align: center;
}
.titleh4 {
  font-weight: 700;
  font-size: 20px;
  text-align: center;
}
.actTag {
  background-color: white;
  border-radius: 20px;
  border: none;
  /* transition: background-color 0.3s ease; */
}
th,
td {
  /* text-align: center; 水平居中 */
  vertical-align: middle; /* 垂直居中 */
}
.smallText {
  font-size: 15px;
}
#managerPic {
  height: 60px;
}
.doggy {
  margin: 10px 10px;
  text-align: center;
}
.dogProfile {
  height: 65px;
}
/* loading icon */
#loading {
  display: none;
}
#starform {
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  height: 100%;
  margin: auto;
}

[class*="fontawesome-"]:before {
  font-family: "FontAwesome", sans-serif;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100%;
}

.reset {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  margin: auto;
  padding: 12px 24px;
  color: #3d3d3d;
  background: #f0f0f0;
  border: 4px solid #3d3d3d;
  border-radius: 60px;
  font-family: "Helvetica", sans-serif;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: rgba(255, 255, 255, 0.8) 1px 1px 0;
  cursor: pointer;
  box-shadow: inset rgba(0, 0, 0, 0.06) 0 -15px 0;
  outline: none;
  transform: translateX(-50%);
}
.reset:hover {
  background: #ffff4c;
}

input,
label {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.stars {
  position: relative;
}
.stars input {
  display: none;
}
.stars input:checked ~ label:not(.reset) {
  -webkit-animation: wobble 0.8s ease-out;
  animation: wobble 0.8s ease-out;
  color: #ffdb19;
}
.stars input:checked:not(#star-reset) ~ label.reset {
  display: block;
}
.stars label:not(.reset) {
  display: inline-block;
  float: right;
  position: relative;
  width: 40px;
  height: 40px;
  font-size: 40px;
  padding: 2px;
  cursor: pointer;
  color: #3d3d3d;
  transition: color 0.1s ease-out;
  z-index: 10;
}

@-webkit-keyframes wobble {
  0% {
    transform: scale(0.8);
  }
  20% {
    transform: scale(1.1);
  }
  40% {
    transform: scale(0.9);
  }
  60% {
    transform: scale(1.05);
  }
  80% {
    transform: scale(0.96);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes wobble {
  0% {
    transform: scale(0.8);
  }
  20% {
    transform: scale(1.1);
  }
  40% {
    transform: scale(0.9);
  }
  60% {
    transform: scale(1.05);
  }
  80% {
    transform: scale(0.96);
  }
  100% {
    transform: scale(1);
  }
}
</style>
