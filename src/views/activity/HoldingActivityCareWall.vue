<template>
  <div>
    <div id="title">
      <h5>
        <b>Holding activities ₊˚⊹♡</b>
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
                    <span v-if="a.activityStatus === '報名中'">
                      <button
                        v-if="isJoinButtonVisible"
                        v-bind:disabled="isJoinButtonDisabled"
                        class="btn btn-outline-warning me-md-2"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        :id="a.activityId"
                        @click="
                          joinPrepare(
                            a.activityId,
                            a.activityTitle,
                            a.activityDogNumber,
                            a.currentDogNumber,
                            a.activityCost
                          )
                        "
                      >
                        報名去🔜
                      </button></span
                    ><span v-if="a.activityStatus === '已額滿'">
                      <button
                        class="btn btn-secondary me-md-2 disabled"
                        type="button"
                      >
                        已額滿🌚
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
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
            <h5
              class="modal-title"
              id="exampleModalLabel"
              v-if="this.myDogsNotAttend.length > 0"
            >
              請選擇要參加的狗狗!🐶
            </h5>
            <h5
              class="modal-title"
              id="exampleModalLabel"
              v-if="this.myDogsNotAttend.length == 0"
            >
              喔嗚!您的狗狗都已經報名過了喔!🐶
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <!-- 表單內容 -->
          <div class="modal-body">
            <form v-if="this.myDogsNotAttend.length == 0">
              可以至我的活動中查看喔 ૮⍝• ᴥ •⍝ა &nbsp;<a
                class="btn btn-outline-success"
                href="/activity/myJoinedManager"
                role="button"
                >前往 ᕕ( ᐛ )ᕗ</a
              >
            </form>

            <form v-if="this.myDogsNotAttend.length > 0">
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label"
                  >您所選擇的活動</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="recipient-name"
                  :value="chooseActTitle"
                  readonly
                />
              </div>
              <!-- 檢查用 -->
              <!-- <div>Checked names: {{ chooseDogs }}</div> -->
              <div>
                <label for="" class="col-form-label">
                  要參與的狗狗~ 💡:每位毛孩參與費用:
                  {{ chooseActCost }} 元</label
                >
                <div v-for="d in myDogsNotAttend" :key="d.dogId" class="mb-2">
                  <div class="checkbox-wrapper-33">
                    <label class="checkbox">
                      <input
                        class="checkbox__trigger visuallyhidden"
                        type="checkbox"
                        :value="d.dogId"
                        @change="checkComplete"
                        v-model="chooseDogs"
                      />
                      <span class="checkbox__symbol">
                        <svg
                          aria-hidden="true"
                          class="icon-checkbox"
                          width="28px"
                          height="28px"
                          viewBox="0 0 28 28"
                          version="1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M4 14l8 7L24 7"></path>
                        </svg>
                      </span>
                      <p class="checkbox__textwrapper">{{ d.dogName }}</p>
                    </label>
                  </div>
                </div>
                <br />
              </div>
              <div class="mb-2">
                <label for="message-text" class="col-form-label"
                  >有甚麼想備註的嗎~</label
                >
                <textarea
                  class="form-control"
                  id="message-text"
                  v-model="note"
                ></textarea>
              </div>
              <div class="mb-2" v-if="chooseActCost > 0">
                <label for="message-text" class="col-form-label">💰小計</label>
                <input
                  type="text"
                  class="form-control"
                  id="message-text"
                  readonly
                  v-model="payCost"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <div
              class="text-danger text-center mt-3"
              v-if="this.myDogsNotAttend.length > 0"
            >
              {{ message }}
            </div>
            <div
              class="checkbox-wrapper-33"
              v-if="this.myDogsNotAttend.length > 0"
            >
              <label class="checkbox">
                <p class="checkbox__textwrapper">發布貼文&nbsp;</p>
                <input
                  class="checkbox__trigger visuallyhidden"
                  type="checkbox"
                  v-model="isPostTweet"
                />
                <span class="checkbox__symbol">
                  <svg
                    aria-hidden="true"
                    class="icon-checkbox"
                    width="28px"
                    height="28px"
                    viewBox="0 0 28 28"
                    version="1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 14l8 7L24 7"></path>
                  </svg>
                </span>
              </label>
            </div>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              v-if="this.myDogsNotAttend.length > 0"
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              id="liveToastBtn"
              @click="joinActivity"
            >
              快速報名
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="pay"></div>
  </div>
</template>
<script>
import axios from "axios";
import { useMemberStore } from "@/stores/memberStore";
import { useActivityStore } from "@/stores/activityStore";

export default {
  components: {},
  data() {
    return {
      chooseCat: 1,
      activities: [],
      userLikedList: [],
      myDogsNotAttend: [],
      userId: "",
      chooseAct: "",
      chooseActTitle: "",
      chooseActCost: null,
      activityDogNumber: null,
      currentDogNumber: null,
      chooseDogs: [],
      payCost: null,
      note: "",
      isUser: false,
      joinSuccess: false,
      currentPage: 1,
      totalPage: 0,
      message: "",
      isPostTweet: "",
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
      .get(`${this.API_URL}/activity/api/nowAct/category/1/1`)
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
        .get(`${this.API_URL}/activity/api/nowAct/category/1/${newVal}`)
        .then((rs) => {
          this.totalPage = rs.data.totalPages;
          this.activities = rs.data.content;
        });
    },
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
        this.$router.push("/activity/holdingActs");
      } else if (this.chooseCat == 2) {
        this.$router.push("/activity/holdingActs/eat");
      } else if (this.chooseCat == 3) {
        this.$router.push("/activity/holdingActs/play");
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
    checkComplete() {
      if (this.chooseDogs.length == 0) {
        let submitButton = document.getElementById("liveToastBtn");
        submitButton.disabled = true;
        this.message = "請選擇要參與的狗狗!";
        this.payCost = 0;
      } else if (
        this.chooseDogs.length + this.currentDogNumber >
        this.activityDogNumber
      ) {
        let submitButton = document.getElementById("liveToastBtn");
        submitButton.disabled = true;
        this.message = "很抱歉😥已超過🐶數上限!";
        this.payCost = "⚠️";
      } else {
        let submitButton = document.getElementById("liveToastBtn");
        submitButton.disabled = false;
        this.message = "";
        this.payCost = this.chooseActCost * this.chooseDogs.length;
      }
    },
    showSuccess() {
      window.alert("報名成功!!");
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
    joinPrepare(
      activityId,
      activityName,
      activityDogNumber,
      currentDogNumber,
      activityCost
    ) {
      const memberStore = useMemberStore();
      console.log(memberStore.memberRole);

      this.chooseAct = activityId;
      this.chooseActTitle = activityName;
      this.activityDogNumber = activityDogNumber;
      this.currentDogNumber = currentDogNumber;
      this.chooseActCost = activityCost;
      this.note = "";
      console.log("所選擇的活動id: ", this.chooseAct);
      if (memberStore.memberRole.startsWith("Act")) {
        this.isUser = true;
        this.userId = memberStore.memberId;
        console.log(this.userId);
        //直接給沒參加過的狗
        axios
          .get(
            `${this.API_URL}/activity/api/apply/${this.userId}/dogNotJoinedList/${this.chooseAct}`
          )
          .then((response) => {
            const dogObj = Object.values(response.data);
            this.myDogsNotAttend = JSON.parse(JSON.stringify(dogObj));
            console.log(this.myDogsNotAttend);
            console.log(this.myDogsNotAttend.length);
            console.log(this.myDogsNotAttend[0]);
            console.log(this.myDogsNotAttend[0].dogName);
            this.checkComplete();
          })
          .catch((error) => {
            console.error("Error dogs:", error);
          });
      }
    },
    joinActivity() {
      console.log(this.userId);
      console.log(this.chooseDogs);
      console.log(this.chooseAct);
      console.log(this.note);
      const memberStore = useMemberStore();
      if (memberStore.memberRole.startsWith("Act")) {
        if (this.chooseDogs.length > 0) {
          const fd = new FormData();
          fd.append("userId", memberStore.memberId);
          fd.append("note", this.note);
          fd.append("dogIdList", this.chooseDogs);
          fd.append("activityId", this.chooseAct);

          axios
            .post(`${this.API_URL}/activity/api/JoinActivity`, fd)
            .then((response) => {
              console.log("報名成功", response.data);
              this.chooseDogs = [];
              this.chooseActTitle = "";
              // 在換成別的路徑 重新導向會無法即時更新
            })
            .then((rs) => {
              if (this.isPostTweet) {
                this.doTweet();
              }
              console.log("tweet check");
              this.chooseAct = "";
            })
            .then((rs) => {
              if (this.payCost > 0) {
                this.goEcPay();
              } else {
                this.$router.push("/activity/myJoinedManager");
              }
            })
            .catch((error) => {
              console.error("報名失敗", error);
              this.message = "報名失敗";
            });
        } else {
          this.message = "請選擇要參與的狗狗!";
        }
      } else {
        this.message = "你應該看不到才對?";
      }
    },
    doTweet() {
      axios
        .post(
          `${this.API_URL}/tweet/postTweetForActivityShare?userId=${this.userId}&activityId=${this.chooseAct}`
        )
        .then((rs) => {
          console.log("tweet success");
        })
        .catch((error) => {
          console.log("tweet error", error);
        });
    },
    goEcPay() {
      axios
        .post(
          `http://localhost:8080/order/ecpayCheckout?price=${this.payCost}&url=activity/myJoinedManager`
        )
        .then((response) => {
          // console.log(response.data);
          const pay = document.getElementById("pay");
          pay.innerHTML = response.data;
          document.getElementById("allPayAPIForm").submit();
        });
    },
    showToast() {
      const toastTrigger = document.getElementById("liveToastBtn");
      const toastLiveExample = document.getElementById("liveToast");

      if (toastTrigger && joinSuccess) {
        const toastBootstrap =
          bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastTrigger.addEventListener("click", () => {
          toastBootstrap.show();
        });
      }
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
.checkbox-wrapper-33 {
  --s-xsmall: 0.625em;
  --s-small: 1.2em;
  --border-width: 1px;
  --c-primary: #5f11e8;
  --c-primary-20-percent-opacity: rgb(95 17 232 / 20%);
  --c-primary-10-percent-opacity: rgb(95 17 232 / 10%);
  --t-base: 0.4s;
  --t-fast: 0.2s;
  --e-in: ease-in;
  --e-out: cubic-bezier(0.11, 0.29, 0.18, 0.98);
}

.checkbox-wrapper-33 .visuallyhidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.checkbox-wrapper-33 .checkbox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.checkbox-wrapper-33 .checkbox + .checkbox {
  margin-top: var(--s-small);
}
.checkbox-wrapper-33 .checkbox__symbol {
  display: inline-block;
  display: flex;
  margin-right: calc(var(--s-small) * 0.7);
  border: var(--border-width) solid var(--c-primary);
  position: relative;
  border-radius: 0.1em;
  width: 1.5em;
  height: 1.5em;
  transition: box-shadow var(--t-base) var(--e-out),
    background-color var(--t-base);
  box-shadow: 0 0 0 0 var(--c-primary-10-percent-opacity);
}
.checkbox-wrapper-33 .checkbox__symbol:after {
  content: "";
  position: absolute;
  top: 0.5em;
  left: 0.5em;
  width: 0.25em;
  height: 0.25em;
  background-color: var(--c-primary-20-percent-opacity);
  opacity: 0;
  border-radius: 3em;
  transform: scale(1);
  transform-origin: 50% 50%;
}
.checkbox-wrapper-33 .checkbox .icon-checkbox {
  width: 1em;
  height: 1em;
  margin: auto;
  fill: none;
  stroke-width: 3;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-miterlimit: 10;
  color: var(--c-primary);
  display: inline-block;
}
.checkbox-wrapper-33 .checkbox .icon-checkbox path {
  transition: stroke-dashoffset var(--t-fast) var(--e-in);
  stroke-dasharray: 30px, 31px;
  stroke-dashoffset: 31px;
}
.checkbox-wrapper-33 .checkbox__textwrapper {
  margin: 0;
}
.checkbox-wrapper-33 .checkbox__trigger:checked + .checkbox__symbol:after {
  -webkit-animation: ripple-33 1.5s var(--e-out);
  animation: ripple-33 1.5s var(--e-out);
}
.checkbox-wrapper-33
  .checkbox__trigger:checked
  + .checkbox__symbol
  .icon-checkbox
  path {
  transition: stroke-dashoffset var(--t-base) var(--e-out);
  stroke-dashoffset: 0px;
}
.checkbox-wrapper-33 .checkbox__trigger:focus + .checkbox__symbol {
  box-shadow: 0 0 0 0.25em var(--c-primary-20-percent-opacity);
}

@-webkit-keyframes ripple-33 {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale(20);
  }
}

@keyframes ripple-33 {
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale(20);
  }
}
.col-form-label {
  font-weight: bold;
  color: #36472aff;
}
h5 {
  font-weight: bolder;
  color: #874a33ff;
}
</style>
<!--     axios
        .post(
          `http://localhost:8080/ecpayCheckout?price=${
            (dateRange.length - 1) * room.roomPrice
          }&url=room/o_page`
        )
        .then((response) => {
          // console.log(response.data);
          const pay = document.getElementById("pay");
          pay.innerHTML = response.data;
          document.getElementById("allPayAPIForm").submit();
        });
      
      -->
