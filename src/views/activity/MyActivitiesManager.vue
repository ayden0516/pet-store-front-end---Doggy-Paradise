<template>
  <div>
    <div id="titlemanager">
      <table>
        <tbody>
          <tr>
            <td style="vertical-align: middle">
              <p class="titleh4" style="color: brown">
                <b>管理我的報名</b>
              </p>
            </td>
            <td style="vertical-align: middle">
              <img
                src="../../assets/managerPic.png"
                alt="🐶"
                id="managerPicc"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
      <div class="checkbox-wrapper-10 status">
        <b>點擊切換活動狀態:⋆˚🐾˖° &nbsp;</b>
      </div>
      <div class="checkbox-wrapper-10">
        <input
          class="tgl tgl-flip"
          id="cb5"
          type="checkbox"
          checked
          @change="changeView"
          v-model="view"
        />
        <label
          class="tgl-btn"
          data-tg-off="已截止"
          data-tg-on="未截止"
          for="cb5"
        ></label>
      </div>
    </div>

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
          <tbody
            class="smallText"
            v-if="myJoinedList.length > 0"
            v-for="a of myJoinedList"
            :key="a.userJoinedId"
          >
            <tr v-if="changeView(a)">
              <th scope="row">
                <button
                  class="btn btn-outline-warning me-md-2"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  :id="a.activityId"
                  @click="
                    updatePrepare(
                      a.activityId,
                      a.activityTitle,
                      a.userNote,
                      a.activityDogNumber,
                      a.currentDogNumber,
                      a.activityStatus,
                      a.activityCost
                    )
                  "
                >
                  管理
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
            <h5 class="modal-title" id="exampleModalLabel">
              管理要參加的狗狗們!🐶
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
            <form>
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

              <div v-if="this.chooseActStatus != '報名截止'">
                <label for="" class="col-form-label">
                  已經參與的狗狗~ 若想要取消參加，請勾選欲取消的狗狗
                </label>
                <div v-for="d in myDogJoinedList" :key="d.dogId" class="mb-2">
                  <div class="checkbox-wrapper-33">
                    <label class="checkbox">
                      <input
                        class="checkbox__trigger visuallyhidden"
                        type="checkbox"
                        :value="d.dogId"
                        @change="checkComplete"
                        v-model="dogCancelledList"
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
              <div v-if="this.chooseActStatus != '報名截止'">
                <label for="" class="col-form-label">
                  還有狗狗想參與嗎~ 💡:每位毛孩參與費用:
                  {{ chooseActCost }} 元</label
                >
                <div v-if="this.activityDogNumber == this.currentDogNumber">
                  本活動已達參加狗之上限😥
                </div>
                <div
                  v-if="!(this.activityDogNumber == this.currentDogNumber)"
                  v-for="d in myDogNotApplyList"
                  :key="d.dogId"
                  class="mb-2"
                >
                  <div class="checkbox-wrapper-33">
                    <label class="checkbox">
                      <input
                        class="checkbox__trigger visuallyhidden"
                        type="checkbox"
                        :value="d.dogId"
                        @change="checkComplete"
                        v-model="dogApplyList"
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
                  >想要修改備註嗎~</label
                >
                <textarea
                  class="form-control"
                  id="message-text"
                  @change="checkComplete"
                  v-model="newNote"
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
            <div class="text-danger text-center mt-3">
              {{ message }}
            </div>
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              v-if="checkComplete"
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              id="liveToastBtn"
              @click="joinActivity"
              disabled
            >
              更新
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
export default {
  data() {
    return {
      userId: null,
      myJoinedList: [],
      chooseAct: "",
      chooseActTitle: "",
      chooseActStatus: "",
      chooseActCost: null,
      activityDogNumber: null,
      currentDogNumber: null,
      oldNote: "",
      newNote: "",
      message: "",
      myDogJoinedList: [],
      dogCancelledList: [],
      payCost: null,
      isDoPay: false,
      myDogNotApplyList: [],
      dogApplyList: [],
      completeChangeCount: null,
      view: true,
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
          this.myJoinedList = JSON.parse(JSON.stringify(myActivitiesObj));
          console.log(this.myJoinedList);
        })
        .catch((error) => {
          console.error("Activities eroor:", error);
        });
    }
  },
  methods: {
    changeView(a) {
      console.log(this.view);
      if (this.view == false) {
        return a.activityStatus === "報名截止";
      } else {
        return a.activityStatus === "已額滿" || a.activityStatus === "報名中";
      }
    },
    updatePrepare(
      activityId,
      activityTitle,
      userNote,
      activityDogNumber,
      currentDogNumber,
      activityStatus,
      activityCost
    ) {
      const memberStore = useMemberStore();
      console.log(memberStore.memberRole);

      this.chooseAct = activityId;
      this.chooseActTitle = activityTitle;
      this.chooseActCost = activityCost;
      this.newNote = userNote;
      this.oldNote = userNote;
      this.activityDogNumber = activityDogNumber;
      this.currentDogNumber = currentDogNumber;
      this.completeChangeCount = null;
      (this.chooseActStatus = activityStatus),
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
          .then(this.checkNotJoinedDog())
          .then((rs) => {
            this.dogApplyList = [];
            this.dogCancelledList = [];
            this.checkComplete();
          })
          .catch((error) => {
            console.error("Activities eroor:", error);
          });
      }
    },
    checkNotJoinedDog() {
      axios
        .get(
          `${this.API_URL}/activity/api/apply/${this.userId}/dogNotJoinedList/${this.chooseAct}`
        )
        .then((rs) => {
          const myActivitiesObj = Object.values(rs.data);
          this.myDogNotApplyList = JSON.parse(JSON.stringify(myActivitiesObj));
          console.log(this.myDogNotApplyList);
        })
        .catch((error) => {
          console.error("Activities eroor:", error);
        });
    },
    checkComplete() {
      if (
        this.dogCancelledList.length == 0 &&
        this.dogApplyList.length == 0 &&
        this.oldNote === this.newNote
      ) {
        let submitButton = document.getElementById("liveToastBtn");
        submitButton.disabled = true;
        this.message = "還沒做更改喔~";
        this.payCost = 0;
        this.isDoPay = false;
        // return false;
      } else if (
        this.dogApplyList.length + this.currentDogNumber >
        this.activityDogNumber
      ) {
        let submitButton = document.getElementById("liveToastBtn");
        submitButton.disabled = true;
        this.message = "很抱歉😥已超過🐶數上限!";
        this.payCost = "⚠️";
        this.isDoPay = false;
      } else {
        let submitButton = document.getElementById("liveToastBtn");
        submitButton.disabled = false;
        this.message = "";
        if (this.dogApplyList.length > this.dogCancelledList.length) {
          this.payCost =
            this.chooseActCost *
            (this.dogApplyList.length - this.dogCancelledList.length);
          this.isDoPay = true;
        } else if (
          this.dogApplyList.length > 0 &&
          this.dogCancelledList.length > 0 &&
          this.dogApplyList.length == this.dogCancelledList.length
        ) {
          this.payCost = "不需補差額";
          this.isDoPay = false;
        } else if (this.dogApplyList.length < this.dogCancelledList.length) {
          this.payCost =
            "將退款: " +
            this.chooseActCost *
              (this.dogCancelledList.length - this.dogApplyList.length) +
            "元";
          this.isDoPay = false;
        }
      }
    },
    timeFormat(time) {
      time = time.substring(0, time.length - 3);
      return time;
    },
    joinActivity() {
      if (this.dogApplyList.length > 0) {
        this.doDogApply();
        this.completeChangeCount++;
      }
      if (this.dogCancelledList.length > 0) {
        this.doDogCancell();
        this.completeChangeCount++;
      }
      if (!(this.newNote === this.oldNote)) {
        this.doRenewUserNote();
        this.completeChangeCount++;
      }
      if (!this.isDoPay) {
        this.doUpdatePage();
      }
    },
    doDogApply() {
      console.log("i do new dog apply");
      const fd = new FormData();
      fd.append("userId", this.userId);
      fd.append("note", this.newNote);
      fd.append("dogIdList", this.dogApplyList);
      fd.append("activityId", this.chooseAct);

      axios
        .post(`${this.API_URL}/activity/api/JoinActivity`, fd)
        .then((response) => {
          console.log("報名成功", response.data);
          this.dogApplyList = [];
        })
        .then((rs) => {
          if (this.payCost > 0) {
            this.goEcPay();
          }
        })
        .catch((error) => {
          console.error("報名失敗", error);
          this.message = "報名失敗";
        });
    },
    doDogCancell() {
      console.log("do dog cancell");
      const fd = new FormData();
      fd.append("userId", this.userId);
      fd.append("dogIdList", this.dogCancelledList);
      fd.append("activityId", this.chooseAct);

      axios
        .post(
          `${this.API_URL}/activity/api/activityManager/doCancelProcess`,
          fd
        )
        .then((response) => {
          console.log("取消", response.data);
          this.dogCancelledList = [];
        })
        // .then(this.$router.push("/activity/myJoinedManager"))
        .catch((error) => {
          console.error("取消失敗", error);
          this.message = "取消失敗";
        });
    },
    goEcPay() {
      axios
        .post(
          `http://localhost:8080/ecpayCheckout?price=${this.payCost}&url=activity/myJoinedManager`
        )
        .then((response) => {
          // console.log(response.data);
          const pay = document.getElementById("pay");
          pay.innerHTML = response.data;
          document.getElementById("allPayAPIForm").submit();
        });
    },
    doRenewUserNote() {
      console.log("do note");
      const fd = new FormData();
      fd.append("userId", this.userId);
      fd.append("userNote", this.newNote);
      fd.append("activityId", this.chooseAct);
      axios
        .post(
          `${this.API_URL}/activity/api/activityManager/doRenewNoteProcess`,
          fd
        )
        .then((response) => {
          console.log("更新", response.data);
          this.dogCancelledList = [];
        })
        // .then(this.$router.push("/activity/myJoinedManager"))
        .catch((error) => {
          console.error("更新失敗", error);
          this.message = "更新失敗";
        });
    },
    doUpdatePage() {
      console.log(this.completeChangeCount);
      if (this.completeChangeCount > 0) {
        let loading = document.getElementById("loading");
        loading.style.display = "inline";
        setTimeout(function () {
          let loading = document.getElementById("loading");
          loading.style.display = "none";
        }, 3000);
        window.location.reload();
      }
    },
  },
};
</script>
<style scoped>
#titlemanager {
  margin: auto 20px;
  padding: 20px 20px;
  text-align: center;
  display: flex;
  justify-content: center;
}
.titleh4 {
  font-weight: 700;
  font-size: 20px;
}
.status {
  color: #2990aa;
}
#managerPicc {
  height: 75px;
  margin: 0;
}
/* loading icon */
#loading {
  display: none;
}
.smallText,
td {
  font-size: 15px;
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

/* 第二個素材 */
.checkbox-wrapper-10 .tgl {
  display: none;
}
.checkbox-wrapper-10 .tgl,
.checkbox-wrapper-10 .tgl:after,
.checkbox-wrapper-10 .tgl:before,
.checkbox-wrapper-10 .tgl *,
.checkbox-wrapper-10 .tgl *:after,
.checkbox-wrapper-10 .tgl *:before,
.checkbox-wrapper-10 .tgl + .tgl-btn {
  box-sizing: border-box;
}
.checkbox-wrapper-10 .tgl::-moz-selection,
.checkbox-wrapper-10 .tgl:after::-moz-selection,
.checkbox-wrapper-10 .tgl:before::-moz-selection,
.checkbox-wrapper-10 .tgl *::-moz-selection,
.checkbox-wrapper-10 .tgl *:after::-moz-selection,
.checkbox-wrapper-10 .tgl *:before::-moz-selection,
.checkbox-wrapper-10 .tgl + .tgl-btn::-moz-selection,
.checkbox-wrapper-10 .tgl::selection,
.checkbox-wrapper-10 .tgl:after::selection,
.checkbox-wrapper-10 .tgl:before::selection,
.checkbox-wrapper-10 .tgl *::selection,
.checkbox-wrapper-10 .tgl *:after::selection,
.checkbox-wrapper-10 .tgl *:before::selection,
.checkbox-wrapper-10 .tgl + .tgl-btn::selection {
  background: none;
}
.checkbox-wrapper-10 .tgl + .tgl-btn {
  outline: 0;
  display: block;
  width: 4em;
  height: 2em;
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.checkbox-wrapper-10 .tgl + .tgl-btn:after,
.checkbox-wrapper-10 .tgl + .tgl-btn:before {
  position: relative;
  display: block;
  content: "";
  width: 50%;
  height: 100%;
}
.checkbox-wrapper-10 .tgl + .tgl-btn:after {
  left: 0;
}
.checkbox-wrapper-10 .tgl + .tgl-btn:before {
  display: none;
}
.checkbox-wrapper-10 .tgl:checked + .tgl-btn:after {
  left: 50%;
}

.checkbox-wrapper-10 .tgl-flip + .tgl-btn {
  padding: 2px;
  transition: all 0.2s ease;
  font-family: sans-serif;
  perspective: 100px;
}
.checkbox-wrapper-10 .tgl-flip + .tgl-btn:after,
.checkbox-wrapper-10 .tgl-flip + .tgl-btn:before {
  display: inline-block;
  transition: all 0.4s ease;
  width: 100%;
  text-align: center;
  position: absolute;
  line-height: 2em;
  font-weight: bold;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 4px;
}
.checkbox-wrapper-10 .tgl-flip + .tgl-btn:after {
  content: attr(data-tg-on);
  background: #02c66f;
  transform: rotateY(-180deg);
}
.checkbox-wrapper-10 .tgl-flip + .tgl-btn:before {
  background: #ff3a19;
  content: attr(data-tg-off);
}
.checkbox-wrapper-10 .tgl-flip + .tgl-btn:active:before {
  transform: rotateY(-20deg);
}
.checkbox-wrapper-10 .tgl-flip:checked + .tgl-btn:before {
  transform: rotateY(180deg);
}
.checkbox-wrapper-10 .tgl-flip:checked + .tgl-btn:after {
  transform: rotateY(0);
  left: 0;
  background: #7fc6a6;
}
.checkbox-wrapper-10 .tgl-flip:checked + .tgl-btn:active:after {
  transform: rotateY(20deg);
}

/* 自定義 */
.col-form-label {
  font-weight: bold;
  color: #36472aff;
}
h5 {
  font-weight: bolder;
  color: #874a33ff;
}
</style>
