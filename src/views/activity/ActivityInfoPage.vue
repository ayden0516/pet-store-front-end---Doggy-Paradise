<template>
  <div>
    <div id="title">
      <h5>
        <b>Activity Info 🐾</b>
      </h5>
    </div>
    <main id="products">
      <div class="container">
        <div class="producat_wrapper">
          <div class="producat_image">
            <div class="img_thumbnail">
              <img v-if="mainImg != null" :src="mainImg.galleryImgUrl" alt="" />
            </div>
          </div>
          <div class="producat_content">
            <p class="company_txt">
              {{ activityInfo.activityTypeName }} / {{ activityInfo.venueName }}
            </p>
            <h2>{{ activityInfo.activityTitle }}</h2>
            <p class="update_txt">
              <b>🗓️更新日期:</b
              >{{ this.dateFormat(activityInfo.activityUpdateDate) }}
            </p>
            <p class="liked_txt">
              <b
                ><i class="fa-solid fa-heart fa-lg" style="color: #e85454"></i
                >&nbsp;{{ activityInfo.likedTime }} liked!</b
              >
            </p>
            <p class="producat_des">
              <b>活動日期:&nbsp;</b>{{ activityInfo.activityDate }}
              {{ this.timeFormat(activityInfo.activityStart) }} ~
              {{ this.timeFormat(activityInfo.activityEnd) }}
              <br />
              <b>報名截止:&nbsp;</b>
              {{ this.dateFormat(activityInfo.activityClosingDate) }}
              <br />
              <b>活動費用:&nbsp;</b
              >{{ activityInfo.activityCost }} 元/每🐶<br />
              <b>現在報名狀況:&nbsp;</b>毛孩:{{
                activityInfo.currentDogNumber
              }}/{{ activityInfo.activityDogNumber }}&nbsp;&nbsp;(共{{
                activityInfo.currentUserNumber
              }}位飼主 )
            </p>
            <div class="price">
              <div class="dicscount_price">
                <p
                  class="normal_price"
                  v-if="
                    activityInfo.activityDogNumber -
                      activityInfo.currentDogNumber >
                      0 && activityInfo.activityStatus !== '活動已結束'
                  "
                >
                  剩下🐶
                  {{
                    activityInfo.activityDogNumber -
                    activityInfo.currentDogNumber
                  }}
                  名餘額🔥🔥🔥
                </p>
                <!-- <p><span class="discount">50%</span></p> -->
              </div>
              <p></p>
            </div>
            <div class="qty">
              <div class="cont">
                <div class="button-container">
                  <div class="dog">
                    <div class="tail"></div>
                    <div class="body"></div>
                    <div class="head">
                      <div class="eyes">
                        <div class="left"></div>
                        <div class="right"></div>
                      </div>
                      <div class="nuzzle">
                        <div class="mouth">
                          <div class="tongue"></div>
                        </div>
                        <div class="nose">
                          <div class="nostrils"></div>
                          <div class="highlight"></div>
                        </div>
                      </div>
                    </div>
                    <div class="ears">
                      <div class="left"></div>
                      <div class="right"></div>
                    </div>
                  </div>
                  <button
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    id="joinbtn"
                    v-if="
                      activityInfo.activityDogNumber -
                        activityInfo.currentDogNumber >
                        0 && activityInfo.activityStatus !== '活動已結束'
                    "
                    @click="
                      joinPrepare(
                        activityInfo.activityId,
                        activityInfo.activityTitle,
                        activityInfo.activityDogNumber,
                        activityInfo.currentDogNumber,
                        activityInfo.activityCost
                      )
                    "
                  >
                    Join Now!
                  </button>
                  <button
                    v-if="
                      activityInfo.activityDogNumber -
                        activityInfo.currentDogNumber ==
                        0 && activityInfo.activityStatus !== '活動已結束'
                    "
                  >
                    Oops 已額滿🌚!
                  </button>
                  <button v-if="activityInfo.activityStatus == '活動已結束'">
                    活動已結束😶‍🌫️!
                  </button>
                  <div class="paw"></div>
                  <div class="paw top"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <hr />
    <div class="infoContainer">
      <div class="actInfo">
        <div class="infoHtml" v-if="activityInfo.activityProcess == null">
          <div v-html="activityInfo.activityDescription"></div>
        </div>
        <div
          v-if="
            activityInfo.activityProcess == null &&
            activityInfo.activityCost == 0
          "
          style="margin-left: 20px"
        >
          <h4><b>參與費用 :</b></h4>
          <p>免費參加</p>
        </div>
        <div
          style="margin-left: 20px"
          v-if="
            activityInfo.activityProcess == null &&
            activityInfo.activityCost > 0
          "
        >
          <h4><b>參與費用 :</b></h4>
          <p>{{ activityInfo.activityCost }}</p>
          <h4><b>費用詳細: </b></h4>
          <p>{{ activityInfo.activityCostDescription }}</p>
        </div>

        <div v-if="activityInfo.activityProcess != null">
          <div>
            <h4><b>活動敘述 :</b></h4>
            <p>{{ activityInfo.activityDescription }}</p>
          </div>
          <div v-if="activityInfo.activityProcess !== null">
            <h4><b>活動流程 :</b></h4>
            <p style="white-space: pre">{{ activityInfo.activityProcess }}</p>
          </div>
          <div v-if="activityInfo.activityCost == 0">
            <h4><b>參與費用 :</b></h4>
            <p>免費參加</p>
          </div>
          <div v-if="activityInfo.activityCost > 0">
            <h4><b>參與費用 :</b></h4>
            <p>{{ activityInfo.activityCost }}</p>
            <h4><b>費用詳細: </b></h4>
            <p>{{ activityInfo.activityCostDescription }}</p>
          </div>
          <div v-if="activityInfo.activityNotice !== null">
            <h4><b>注意事項: </b></h4>
            <p>{{ activityInfo.activityNotice }}</p>
          </div>
        </div>

        <div class="blog-card">
          <div class="meta">
            <div
              class="photo"
              style="
                background-image: url(https://res.cloudinary.com/dxz9qtntt/image/upload/v1712205601/o8d9ao8xgx3ybde09lje.png);
              "
            ></div>
            <ul class="details">
              <li class="author">
                {{ activityInfo.contactInfo }}
              </li>
              <li class="tags">
                <ul>
                  諮詢活動:
                  <li>{{ activityInfo.activityTitle }}</li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="description">
            <h1>Contact Us!</h1>
            <h2>Doggy Paradise Activity Dept.</h2>
            <h3>{{ activityInfo.contactInfo }}</h3>
            <p>
              {{ activityInfo.contactMail }}<br />
              {{ activityInfo.contactPhone }}
            </p>
            <!-- 要補上寄信功能嗎 -->
            <p class="read-more">
              <a href="#">立即詢問</a>
            </p>
          </div>
        </div>
      </div>
      <div class="carouselContainer" v-if="ImgList.length > 1">
        <div
          id="carouselExampleAutoplaying"
          class="carousel slide"
          data-bs-ride="carousel"
        >
          <div class="carousel-inner">
            <div
              v-for="(img, index) in ImgList"
              :key="index"
              :class="['carousel-item', { active: index === 0 }]"
            >
              <img
                :src="img.galleryImgUrl"
                class="d-block w-100"
                :alt="'Image ' + (index + 1)"
              />
            </div>
          </div>
          <button
            class="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button
            class="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
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
      v-if="isUser"
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
              disabled
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

export default {
  data() {
    return {
      activityInfo: [],
      mainImg: [],
      ImgList: [],
      activityId: "",
      isCustomer: true,
      isEmployee: false,
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
      message: "",
    };
  },
  mounted() {
    const memberStore = useMemberStore();
    console.log(memberStore.memberRole);
    if (memberStore.memberRole.startsWith("R")) {
      this.isCustomer = false;
      this.isUser = false;
      this.isEmployee = true;
    } else if (memberStore.memberRole.startsWith("Act")) {
      this.isUser = true;
      this.isCustomer = false;
      this.userId = memberStore.memberId;
    }
    this.activityId = this.$route.params.activityId;
    axios
      .get(
        `${this.API_URL}/activity/api/official/activityInfo/${this.activityId}`
      )
      .then((rs) => {
        console.log(rs.data);
        this.activityInfo = rs.data;
        this.mainImg = this.activityInfo.activityImgList[0];
        this.ImgList = this.activityInfo.activityImgList;
        console.log(this.mainImg);
        console.log("圖片長度", this.ImgList.length);
        console.log(this.ImgList);
      })
      .then((rs) => {
        if (this.isEmployee) {
          this.joinBtnDisabled();
        }
      });
  },
  methods: {
    joinBtnDisabled() {
      document.getElementById("joinbtn").disabled = true;
    },
    timeFormat(time) {
      if (time && time.length >= 3) {
        time = time.substring(0, time.length - 3);
      }
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
      if (this.isUser) {
        // this.isUser = true;
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
      } else if (this.isCustomer) {
        this.$router.push("/login");
      }
    },
    checkComplete() {
      if (this.chooseDogs.length == 0) {
        let submitButton = document.getElementById("liveToastBtn");

        submitButton.disabled = true;
        this.message = "請選擇要參與的狗狗!";
        this.payCost = 0;
      } else if (
        this.chooseDogs.length + this.currentDogNumber >
        this.activityInfo.activityDogNumber
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
              this.chooseAct = "";
              this.chooseActTitle = "";
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
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
#title {
  color: #502d20;
  margin: 10px 20px;
  padding: 5px 5px;
  text-align: left;
}
.infoContainer {
  /* border: 3px dashed darkcyan; */
  background-color: rgb(218, 232, 198);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  /* align-items: center; */
  gap: 4rem;
  width: 100%;
}
.actInfo {
  margin: 10px;
  width: 50%;
}
.infoHtml {
  margin: 15px;
}
.carouselContainer {
  width: 35%; /* 寬度 */
  margin-top: 20px;
  margin-right: 20px;
  /* height: 400px; */
  overflow: hidden; /* 隱藏超出的內容 */
}
.carousel {
  padding: 10px;
  background-color: #fff;
  /* border: 10px double rgb(93, 59, 16); */
}
.blog-card {
  display: flex;
  width: 500px;
  height: 200px;
  flex-direction: column;
  margin: 1rem auto;
  box-shadow: 0 3px 7px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.6%;
  background: #fff;
  line-height: 1.4;
  font-family: sans-serif;
  border-radius: 5px;
  overflow: hidden;
  z-index: 0;
}
.blog-card a {
  color: inherit;
}
.blog-card a:hover {
  color: #5ad67d;
}
.blog-card:hover .photo {
  transform: scale(1.3) rotate(3deg);
}
.blog-card .meta {
  position: relative;
  z-index: 0;
  height: 200px;
}
.blog-card .photo {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-size: cover;
  background-position: center;
  transition: transform 0.2s;
}
.blog-card .details,
.blog-card .details ul {
  margin: auto;
  padding: 0;
  list-style: none;
}
.blog-card .details {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -100%;
  margin: auto;
  transition: left 0.2s;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 10px;
  width: 100%;
  font-size: 0.9rem;
}

.blog-card .details ul li {
  display: inline-block;
}
.blog-card .details .author:before {
  font-family: FontAwesome;
  margin-right: 10px;
  content: "";
}
.blog-card .details .date:before {
  font-family: FontAwesome;
  margin-right: 10px;
  content: "";
}
.blog-card .details .tags ul:before {
  font-family: FontAwesome;
  content: "";
  margin-right: 10px;
}
.blog-card .details .tags li {
  margin-right: 2px;
}
.blog-card .details .tags li:first-child {
  margin-left: -4px;
}
.blog-card .description {
  padding: 1rem;
  background: #fff;
  position: relative;
  z-index: 1;
}
.blog-card .description h1,
.blog-card .description h2 {
  font-family: Poppins, sans-serif;
}
.blog-card .description h1 {
  line-height: 1;
  margin: 0;
  font-size: 1.4rem;
}
.blog-card .description h2 {
  font-size: 0.9rem;
  font-weight: 300;
  text-transform: uppercase;
  color: #a2a2a2;
  margin-top: 5px;
}
.blog-card .description h3 {
  font-size: 1.5rem;
  font-weight: 600;
  /* text-transform: uppercase; */
  color: rgb(64, 42, 5);
  margin-top: 5px;
}
.blog-card .description .read-more {
  text-align: right;
  font-size: 0.9rem;
}
.blog-card .description .read-more a {
  color: #5ad67d;
  display: inline-block;
  position: relative;
}
.blog-card .description .read-more a:after {
  content: "";
  font-family: FontAwesome;
  margin-left: -10px;
  opacity: 0;
  vertical-align: middle;
  transition: margin 0.3s, opacity 0.3s;
}
.blog-card .description .read-more a:hover:after {
  margin-left: 5px;
  opacity: 1;
}
.blog-card p {
  position: relative;
  margin: 1rem 0 0;
}
.blog-card p:first-of-type {
  margin-top: 1.25rem;
}
.blog-card p:first-of-type:before {
  content: "";
  position: absolute;
  height: 5px;
  background: #5ad67d;
  width: 35px;
  top: -0.75rem;
  border-radius: 3px;
}
.blog-card:hover .details {
  left: 0%;
}
@media (min-width: 640px) {
  .blog-card {
    flex-direction: row;
    max-width: 500px;
  }
  .blog-card .meta {
    flex-basis: 40%;
    height: auto;
  }
  .blog-card .description {
    flex-basis: 60%;
  }
  .blog-card .description:before {
    transform: skewX(-3deg);
    content: "";
    background: #fff;
    width: 30px;
    position: absolute;
    left: -10px;
    top: 0;
    bottom: 0;
    z-index: -1;
  }
  .blog-card.alt {
    flex-direction: row-reverse;
  }
  .blog-card.alt .description:before {
    left: inherit;
    right: -10px;
    transform: skew(3deg);
  }
  .blog-card.alt .details {
    padding-left: 25px;
  }
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
#title {
  margin-top: 2rem;
}
#products {
  margin-top: 2rem;
  position: relative;
  width: 100%;
}

.producat_wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4rem;
  width: 100%;
}
.producat_image img {
  display: block;
  object-fit: cover;
  width: 90%;
  border-radius: 10px;
  cursor: pointer;
  margin-left: 0;
  margin-right: 0;
  padding: 0;
}
.company_txt {
  color: #563667;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 2px;
  font-size: 1rem;
}
.update_txt {
  color: #65576c;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 2px;
  font-size: 0.8rem;
}
.liked_txt {
  color: #65576c;
  text-transform: uppercase;
  font-weight: 400;
  letter-spacing: 0.5px;
  font-size: 0.7rem;
  margin: 0;
}
.producat_content {
  width: 150%;
  margin: 0 auto;
}
.producat_content h2 {
  font-size: 1.6rem;
  margin: 0.8rem 0;
  font-weight: 800;
  width: 100%;
}
.producat_des {
  margin: 1.5rem 0;
  width: 90%;
  font-size: 1rem;
  line-height: 1.56;
  color: #6374b7;
}
.dicscount_price {
  display: flex;
  align-items: center;
}
.normal_price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e34244;
  border: #c28e5f dashed 2px;
  border-radius: 10px;
  padding: 4px;
}
.dicscount_price span {
  font-weight: normal;
  font-size: 1.5rem;
  background-color: #ffeee2;
  padding: 0 0.5rem;
  color: var(--Orange);
  font-weight: 700;
  margin-left: 1rem;
}
.total_price {
  /* text-decoration: line-through; */
  color: palevioletred;
  margin: 0.5rem 0;
}

.cont {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  margin-top: 30px;
  /* align-items: center; */
  /* justify-content: right; */
  /* background-color: #f9fafb; */
}

.button-container {
  position: relative;
  /* position: fixed; */
  /* right: 40px; */
  /* bottom: 50px; */
}
.button-container button {
  color: #d7a449;
  padding: 10px 20px;
  font-family: "Poppins", sans-serif;
  font-size: 28px;
  font-weight: 700s;
  background-color: #1d4072;
  border: 5px solid #1d4072;
  border-radius: 20px;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
}
.button-container:hover .dog {
  transform: translate(20px, -55px) rotate(15deg);
  transition-delay: 0.6s;
}
.button-container:hover .paw {
  transition-delay: 0.3s;
  right: -5px;
}
.button-container:hover .paw::after {
  transition-delay: 0s;
  left: 0;
}
.button-container:hover .paw.top {
  transition-delay: 0.4s;
  right: 40px;
  top: -8px;
}
.button-container:hover .tail {
  opacity: 1;
  transition-delay: 0.6s;
}

.dog {
  position: absolute;
  width: 65px;
  height: 65px;
  top: -10px;
  right: 1px;
  transform: translate(0, 0) rotate(0);
  transition: 0.3s transform cubic-bezier(0.33, 1, 0.68, 1);
}
.dog div {
  position: absolute;
}
.dog .tail {
  width: 10%;
  height: 35%;
  left: -50%;
  bottom: -34%;
  transform: rotate(-25deg);
  transition: 0.1s opacity;
  transition-delay: 0s;
  opacity: 0;
}
.dog .tail::after {
  content: "";
  position: absolute;
  transform-origin: bottom center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50% 50% 0 0;
  background-color: #e1a46e;
  animation: infinite alternate tailSkew 0.3s cubic-bezier(0.65, 0, 0.35, 1);
}
@keyframes tailSkew {
  from {
    transform: skewX(15deg);
  }
  to {
    transform: skewX(-15deg);
  }
}
.dog .body {
  width: 70%;
  height: 50%;
  bottom: -20%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #9f6a43;
  border-radius: 50% 50% 0 0;
}
.dog .head {
  width: 65%;
  height: 70%;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 80% 80% 60% 60%;
  background-color: #e1a46e;
}
.dog .nuzzle {
  width: 70%;
  height: 40%;
  bottom: 0%;
  left: 50%;
  transform: translateX(-50%);
}
.dog .nuzzle::before,
.dog .nuzzle::after {
  content: "";
  width: 50%;
  height: 100%;
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #c28e5f;
  border-radius: 70% 30% 50% 20%;
  z-index: 1;
}
.dog .nuzzle::after {
  left: auto;
  right: 0;
  transform: scaleX(-1);
}
.dog .mouth {
  width: 50%;
  height: 90%;
  border-radius: 100%;
  background-color: #111827;
  left: 50%;
  bottom: -20%;
  transform: translateX(-50%);
}
.dog .tongue {
  width: 50%;
  height: 50%;
  background-color: #ef4444;
  left: 50%;
  transform: translateX(-50%);
  bottom: 5%;
  border-radius: 50%;
  animation: 0.3s alternate tongueBounce infinite cubic-bezier(0.45, 0, 0.55, 1);
}
@keyframes tongueBounce {
  from {
    bottom: 20%;
  }
  to {
    bottom: 15%;
  }
}
.dog .nose {
  width: 30%;
  height: 20%;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  z-index: 10;
}
.dog .nose::before {
  content: "";
  width: 100%;
  height: 60%;
  top: -50%;
  left: 0;
  position: absolute;
  display: inline-block;
  background-color: #1f2937;
  border-radius: 1000px 1000px 0 0;
}
.dog .nose::after {
  content: "";
  width: 100%;
  height: 100%;
  top: 10%;
  left: 0;
  position: absolute;
  display: inline-block;
  background-color: #1f2937;
  border-radius: 0 0 1000px 1000px;
}
.dog .nose .nostrils {
  width: 90%;
  height: 100%;
  top: 0;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
}
.dog .nose .nostrils::before {
  content: "";
  display: inline-block;
  width: 30%;
  left: 10%;
  height: 100%;
  position: absolute;
  background-color: #000;
  border-radius: 100%;
}
.dog .nose .nostrils::after {
  content: "";
  display: inline-block;
  width: 30%;
  right: 10%;
  height: 100%;
  position: absolute;
  background-color: #000;
  border-radius: 100%;
}
.dog .nose .highlight {
  top: -50%;
  left: 50%;
  width: 80%;
  height: 30%;
  transform: translateX(-50%);
  background-color: #fff;
  border-radius: 1000px 1000px 0 0;
  background: linear-gradient(#fff, rgba(255, 255, 255, 0));
  opacity: 0.3;
}
.dog .eyes {
  width: 80%;
  height: 35%;
  top: 25%;
  transform: translateX(-50%);
  left: 50%;
}
.dog .eyes .left,
.dog .eyes .right {
  border-radius: 1000px;
  background-color: #111;
  width: 25%;
  height: 52%;
  top: 50%;
  transform: translateY(-50%);
}
.dog .eyes .left::after,
.dog .eyes .right::after {
  content: "";
  display: inline-block;
  position: absolute;
  width: 30%;
  height: 30%;
  background-color: #fff;
  opacity: 0.7;
  border-radius: 1000px;
  left: 15%;
  top: 15%;
}
.dog .eyes .left {
  left: 15%;
}
.dog .eyes .right {
  right: 15%;
}
.dog .ears {
  width: 90%;
  height: 90%;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.dog .ears div {
  width: 30%;
  height: 50%;
  left: 0;
  top: 0;
  background-color: #9f6a43;
  transform: rotate(15deg);
  border-radius: 60% 20% 80% 10%;
  z-index: 1;
}
.dog .ears div.right {
  transform: rotate(-15deg) scaleX(-1);
  left: auto;
  right: 0;
}

.paw {
  position: absolute;
  right: -20px;
  top: 15px;
  overflow: hidden;
  width: 20px;
  height: 20px;
  transition: 0.3s right cubic-bezier(0.33, 1, 0.68, 1);
}
.paw::after {
  content: "";
  position: absolute;
  left: -100%;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #e1a46e;
  transition: 0.3s left cubic-bezier(0.33, 1, 0.68, 1);
  transition-delay: 0.3s;
}
.paw.top {
  transform: rotate(-90deg);
  top: -20px;
  right: 40px;
  transition: 0.3s top cubic-bezier(0.33, 1, 0.68, 1);
}
</style>
