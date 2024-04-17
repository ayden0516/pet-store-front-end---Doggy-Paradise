<template>
  <div>
    <div id="title">
      <h4>
        <b>我要租借!</b
        ><img src="../../assets/managerPic.png" alt="🐶" id="managerPic" />
      </h4>
    </div>
    <form class="p-4 p-md-7 border rounded-3 bg-light">
      <h6><b>🦴🦴 租借資訊 🦴🦴</b></h6>
      <div class="row g-2">
        <div class="col-md">
          <div class="form-floating mb-3">
            <select
              class="form-select"
              id="floatingSelect"
              name="venueId"
              v-model="venueId"
              required
              aria-label="Floating label select example"
            >
              <option v-for="v in venues" :key="v.venueId" :value="v.venueId">
                {{ v.venueName }}
              </option>
            </select>
            <label for="floatingSelect">場地選擇</label>
          </div>
        </div>
        <div class="col-md">
          <div class="form-floating mb-3">
            <select
              class="form-select"
              id="floatingSelect"
              name="activityDogNumber"
              aria-label="Floating label select example"
              v-model="dogNumber"
            >
              <option v-for="n in dogOptions" :key="n" :value="n">
                {{ n }}
              </option>
            </select>
            <label for="floatingSelect">預計狗數</label>
          </div>
        </div>
        <div class="col-md">
          <div class="form-floating mb-3">
            <select
              class="form-select"
              id="floatingSelect"
              name="activityDogNumber"
              aria-label="Floating label select example"
              v-model="participantsNumber"
            >
              <option v-for="p in personOptions" :key="p" :value="p">
                {{ p }}
              </option>
            </select>
            <label for="floatingSelect">預計人數</label>
          </div>
        </div>
      </div>

      <div class="row g-2">
        <div class="col-md">
          <div class="form-floating mb-3">
            <input
              class="form-control"
              type="date"
              name="activityDate"
              value="2024-04-26"
              min="2024-03-25"
              max="2026-04-26"
              v-model.lazy="rentalDate"
            />
            <label>租借日期:</label>
          </div>
        </div>
        <div class="col-md">
          <div class="form-floating mb-3">
            <input
              class="form-control"
              type="time"
              name="activityStart"
              value="10:00"
              min="10:00"
              max="18:00"
              v-model.lazy="rentalStart"
            /><label>開始時間:</label>
          </div>
        </div>
        <div class="col-md">
          <div class="form-floating mb-3">
            <input
              class="form-control"
              type="time"
              name="activityEnd"
              min="10:00"
              max="18:00"
              v-model.lazy="rentalEnd"
              @change="costCalculate"
            /><label>結束時間:</label>
          </div>
        </div>
      </div>

      <div class="row g-2">
        <h6><b>🦴🦴 費用小計 🦴🦴</b></h6>
        <p class="note">
          🚩非整數小時計費：超過半小時計費一小時、未超過半小時計費半小時算🙌
        </p>
        <div>
          <p v-if="timeTotal !== null">總計時間: {{ timeTotal }} 小時</p>
          <p v-if="timeTotal !== null">總計費用: {{ rentalTotal }} 元</p>
        </div>
      </div>

      <button class="w-100 btn btn-lg btn-primary" @click.prevent="create">
        租借申請
      </button>

      <div class="text-danger text-center mt-3">{{ message }}</div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import { useMemberStore } from "@/stores/memberStore";

export default {
  data() {
    return {
      venues: [],
      venueId: null,
      dogNumber: null,
      participantsNumber: null,
      rentalDate: "",
      rentalStart: "",
      rentalEnd: "",
      venueRent: "",
      rentalTotal: "",
      message: "",
      timeTotal: "",
    };
  },
  mounted() {
    fetch(`${this.API_URL}/activity/api/venues`)
      .then((rs) => rs.json())
      .then((venueObj) => {
        this.venues = Object.values(venueObj);
        let venues = JSON.parse(JSON.stringify(venueObj));
      });
  },
  computed: {
    dogOptions() {
      if (!this.venueId) return [];
      const selectedVenue = this.venues.find(
        (venue) => venue.venueId === this.venueId
      );
      if (!selectedVenue) return [];
      return Array.from(
        { length: selectedVenue.venueCapacityDog },
        (_, index) => index + 1
      );
    },
    personOptions() {
      if (!this.venueId) return [];
      const selectedVenue = this.venues.find(
        (venue) => venue.venueId === this.venueId
      );
      if (!selectedVenue) return [];
      return Array.from(
        { length: selectedVenue.venueCapacityUser },
        (_, index) => index + 1
      );
    },
  },
  methods: {
    costCalculate() {
      const start = new Date(`2000-01-01T${this.rentalStart}`);
      const end = new Date(`2000-01-01T${this.rentalEnd}`);
      const differenceInMilliseconds = end - start;
      const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
      this.timeTotal = Math.abs(differenceInHours).toFixed(1);

      if (this.venueId != null) {
        console.log(this.venues[this.venueId - 1].venueRent);
        this.venueRent = this.venues[this.venueId - 1].venueRent;
        //邏輯超過半小時以1小時算 未超過半小時以半小時算
        //取得時間小數點部分
        const decimalPart = this.timeTotal - Math.floor(this.timeTotal);
        const intPart = Math.floor(this.timeTotal);
        if (decimalPart == 0) {
          this.rentalTotal = this.timeTotal * this.venueRent;
        } else if (decimalPart <= 0.5 && decimalPart > 0) {
          this.rentalTotal = intPart * this.venueRent + this.venueRent * 0.5;
        } else {
          this.rentalTotal = (intPart + 1) * this.venueRent;
        }
        return;
      }
    },
    create() {
      const memberStore = useMemberStore();
      if (
        memberStore.memberRole != null &&
        memberStore.memberRole.startsWith("Act")
      ) {
        axios
          .post(`${this.API_URL}/activity/api/rental/add`, {
            venueId: this.venueId,
            userId: memberStore.memberId,
            participantsNumber: this.participantsNumber,
            dogNumber: this.dogNumber,
            rentalDate: new Date(this.rentalDate),
            rentalStart: new Date(`${this.rentalDate}T${this.rentalStart}`),
            rentalEnd: new Date(`${this.rentalDate}T${this.rentalEnd}`),
            rentalTotal: this.rentalTotal,
          })
          .then((response) => {
            if (response.status === 200) {
              console.log("create order success");
              this.$router.push("/");
            } else {
              console.error("failed..");
              this.message = "失敗";
            }
          });
      } else if (memberStore.memberRole.startsWith("ROLE")) {
        axios
          .post(`${this.API_URL}/activity/api/rental/officialAdd`, {
            venueId: this.venueId,
            userId: 0,
            participantsNumber: this.participantsNumber,
            dogNumber: this.dogNumber,
            rentalDate: new Date(this.rentalDate),
            rentalStart: new Date(`${this.rentalDate}T${this.rentalStart}`),
            rentalEnd: new Date(`${this.rentalDate}T${this.rentalEnd}`),
            rentalTotal: this.rentalTotal,
          })
          .then((response) => {
            if (response.status === 200) {
              console.log("create order success");
              this.$router.push("/");
            } else {
              console.error("failed..");
              this.message = "失敗";
            }
          });
      } else {
        this.message = "你不夠格";
      }
    },
  },
};
</script>
<style>
#title {
  margin: auto 20px;
  padding: 20px 20px;
  text-align: center;
}
.note {
  color: #2990aa;
}

#managerPic {
  height: 75px;
}
</style>
