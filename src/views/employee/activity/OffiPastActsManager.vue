<template>
  <div class="">
    <div id="title">
      <table style="text-align: center">
        <tbody>
          <tr>
            <td class="titletd">
              <p class="titleh4">
                <b>過去活動區</b>
              </p>
            </td>
            <td class="titletd">
              <img
                src="https://res.cloudinary.com/dxz9qtntt/image/upload/v1712297321/activityFolder/mr905ji1iaq9timwqvgx.png"
                alt="🐶"
                id="managerPic"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="py-1 bg-light cont">
      <div class="queryContainer">
        <div class="datePeriod">
          <span class="queryText">請選擇想搜尋的日期範圍:</span><br />
          <VueDatePicker
            class="date-picker"
            v-model.lazy="selectedDates"
            range
            :enable-time-picker="false"
            :max-date="new Date()"
            @blur="queryDate"
          />
        </div>
      </div>
      <div class="container">
        <table class="table" v-if="empId != null">
          <thead>
            <tr>
              <th scope="col">管理</th>
              <th scope="col">
                活動日期
                <button class="sortbtn" @click="toggleSortOrder">
                  <i
                    :class="
                      sortOrder === 'asc'
                        ? 'fa-solid fa-chevron-up'
                        : 'fa-solid fa-chevron-down'
                    "
                  ></i>
                </button>
              </th>
              <th scope="col" class="titlecol">
                <i
                  class="fa-solid fa-heart-circle-plus"
                  style="color: #ff8585"
                ></i>
              </th>
              <th scope="col" class="titlecol">活動名稱</th>
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
              <th scope="col">報名狀況</th>
            </tr>
          </thead>
          <tbody
            class="smallText"
            v-if="OfficialActList.length > 0"
            v-for="a of sortedActivities"
            :key="a.activityId"
          >
            <tr>
              <th scope="row">
                <router-link
                  :to="{
                    name: 'activityComment',
                    params: { activityId: a.activityId },
                  }"
                >
                  <button
                    class="btn btn-outline-warning me-md-1"
                    type="button"
                    v-if="a.commentedTime > 0"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    :id="a.activityId"
                  >
                    查看({{ a.commentedTime }}/{{ a.currentUserNumber }})
                  </button></router-link
                >
                <button
                  type="button"
                  class="btn btn-light me-md-1"
                  v-if="a.commentedTime < 1"
                >
                  暫無評論
                </button>
              </th>
              <td class="smallText">
                {{ a.activityDate }} {{ this.timeFormat(a.activityStart) }} -
                {{ this.timeFormat(a.activityEnd) }}
              </td>
              <td class="smallText" style="text-align: center">
                {{ a.likedTime }}
              </td>
              <td class="smallText">
                <router-link
                  :to="{
                    name: 'activityInfo',
                    params: { activityId: a.activityId },
                  }"
                  ><button
                    class="actTag btn smallText"
                    style="max-width: 300px"
                  >
                    {{ a.activityTitle }}
                  </button>
                </router-link>
              </td>
              <td class="smallText">{{ a.activityStatus }}</td>
              <td>
                <div
                  class="accordion accordion-flush"
                  id="accordionFlushExample"
                >
                  <div class="accordion-item">
                    <div
                      class="accordion-header"
                      :id="'heading' + a.activityId"
                    >
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        @click="toggleAccordion(a.activityId)"
                        :aria-expanded="
                          isActiveAccordion === a.activityId ? 'true' : 'false'
                        "
                        :aria-controls="'collapse' + a.activityId"
                      >
                        🐶<span class="dogNum">{{ a.currentDogNumber }}</span
                        >/{{ a.activityDogNumber }}&nbsp;👤{{
                          a.currentUserNumber
                        }}
                      </button>
                    </div>
                    <div
                      :id="'collapse' + a.activityId"
                      class="accordion-collapse collapse"
                      :class="{ show: isActiveAccordion === a.activityId }"
                      :aria-labelledby="'heading' + a.activityId"
                      data-bs-parent="#accordionFlushExample"
                    >
                      <div class="accordion-body">
                        <!-- 展開後的內容 -->
                        <div v-for="(p, index) in attendeeList" :key="index">
                          <button
                            class="btn btn-sm"
                            type="button"
                            @click="toggleCollapse(index)"
                            aria-expanded="activeIndex === index ? 'true' : 'false'"
                            :aria-controls="'collapse_' + index"
                          >
                            {{ p.firstName }}
                          </button>
                          <div
                            class="collapse"
                            :class="{ show: activeIndex === index }"
                            :id="'collapse_' + index"
                          >
                            <div class="card card-body">
                              <div v-for="d in p.dogNameList.length" :key="d">
                                <img
                                  :src="p.dogProfileList[d - 1]"
                                  alt="🐶"
                                  class="dogProfile"
                                />{{ p.dogNameList[d - 1] }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { useMemberStore } from "@/stores/memberStore";
import VueDatePicker from "@vuepic/vue-datepicker";

export default {
  data() {
    return {
      empId: null,
      OfficialActList: [],
      chooseAct: "",
      attendeeList: [],
      //人名摺疊
      isActiveAccordion: null,
      // 狗名摺疊
      activeIndex: null,

      chooseActTitle: "",
      activityDogNumber: null,
      currentDogNumber: null,
      message: "",
      myDogJoinedList: [],
      selectedDates: "", // 用於存儲所選日期的範圍
      queryStart: "",
      queryEnd: "",
      sortOrder: "asc",
    };
  },
  mounted() {
    const memberStore = useMemberStore();
    if (memberStore.memberRole.startsWith("R")) {
      this.empId = memberStore.memberId;
      axios
        .get(`${this.API_URL}/activity/api/official/activityManager/past`)
        .then((rs) => {
          const OffiActivitiesObj = Object.values(rs.data);
          this.OfficialActList = JSON.parse(JSON.stringify(OffiActivitiesObj));
          console.log(this.OfficialActList);
        })
        .catch((error) => {
          console.error("Activities eroor:", error);
        });
    }
  },
  methods: {
    queryDate() {
      // console.log(this.selectedDates[1]);
      if (this.selectedDates != null) {
        this.queryStart = this.fixedDate(this.selectedDates[0]);
        this.queryEnd = this.fixedDate(this.selectedDates[1]);
        // console.log(this.queryStart);
        const fd = new FormData();
        fd.append("startDate", new Date(this.queryStart));
        fd.append("endDate", new Date(this.queryEnd));
        if (this.queryStart !== null && this.queryEnd !== null) {
          axios
            .post(
              `${this.API_URL}/activity/api/official/activityManager/past`,
              fd
            )
            .then((rs) => {
              const OffiActivitiesObj = Object.values(rs.data);
              this.OfficialActList = JSON.parse(
                JSON.stringify(OffiActivitiesObj)
              );
              console.log(this.OfficialActList);
            })
            .then((rs) => {
              this.queryStart = "";
              this.queryEnd = "";
            })
            .catch((error) => {
              console.error("Activities query eroor:", error);
            });
        }
      }
    },
    fixedDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },
    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
    timeFormat(time) {
      time = time.substring(0, time.length - 3);
      return time;
    },
    toggleAccordion(activityId) {
      if (this.isActiveAccordion === activityId) {
        this.isActiveAccordion = null;
      } else {
        this.isActiveAccordion = activityId;
        this.chooseAct = activityId;
        //拿attendee
        axios
          .get(
            `${this.API_URL}/activity/api/official/activityManager/${this.chooseAct}/attendeeList`
          )
          .then((rs) => {
            const activityJoinListObj = Object.values(rs.data);
            this.attendeeList = JSON.parse(JSON.stringify(activityJoinListObj));
            console.log(this.attendeeList);
          })
          .catch((error) => {
            console.error("attendeeList eroor:", error);
          });
      }
    },
    toggleCollapse(index) {
      if (this.activeIndex === index) {
        this.activeIndex = null; //展開
      } else {
        this.activeIndex = index;
      }
    },
  },
  computed: {
    sortedActivities() {
      return this.OfficialActList.slice().sort((a, b) => {
        if (this.sortOrder === "asc") {
          return new Date(a.activityDate) - new Date(b.activityDate);
        } else {
          return new Date(b.activityDate) - new Date(a.activityDate);
        }
      });
    },
  },
};
</script>
<style scoped>
#title {
  color: #502d20;
  margin: auto 20px;
  padding: 20px 20px;
  text-align: center;
  justify-content: center;
  display: flex;
}
.titleh4 {
  font-weight: 700;
  font-size: 24px;
  color: #804a42;
  text-align: center;
}
.titletd {
  vertical-align: center;
}
#managerPic {
  height: 70px;
}
.queryContainer {
  background-color: #c0a6a0;
  padding: 1px;
}
.queryText {
  font-weight: 700;
  color: rgb(252, 252, 252);
}
.datePeriod {
  width: 30%;
  margin-bottom: 20px;
  margin-left: 10px;
}
.sortbtn {
  border: none;
  background-color: #fff;
  color: rgb(80, 144, 123);
}

.doggy {
  margin: 10px 10px;
  text-align: center;
}
.dogProfile {
  height: 50px;
  margin-bottom: 2px;
}
/* loading icon */
#loading {
  display: none;
}
th,
td {
  /* text-align: center; 水平居中 */
  vertical-align: middle; /* 垂直居中 */
}
.smallText {
  font-size: 15px;
}
.dogNum {
  color: cadetblue;
}
.smallText {
  font-size: 14px;
}
</style>
