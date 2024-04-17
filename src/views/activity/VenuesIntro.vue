<template lang="">
  <div>
    <div class="row row-cols-1 row-cols-md-2 g-4">
      <div class="col">
        <div class="card">
          <img
            src="https://res.cloudinary.com/dxz9qtntt/image/upload/v1711371824/k0ysx1ge0huk4qui4zlt.jpg"
            class="card-img-top"
            alt="..."
          />
          <div class="card-body">
            <h5 class="card-title">{{ firstvenue.venueName }}</h5>
            <div class="card-text">
              <p>{{ firstvenue.venueDescription }}</p>
              <p>空間可活動狗數: {{ firstvenue.venueCapacityDog }} 隻</p>
            </div>
            <button type="button" class="btn btn-outline-info" @click="goRent">
              我要預約
            </button>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card">
          <img
            src="https://res.cloudinary.com/dxz9qtntt/image/upload/v1711373890/hfisamzpsmap7wno3jo4.jpg"
            class="card-img-top"
            alt="..."
          />
          <div class="card-body">
            <h5 class="card-title">{{ secondvenue.venueName }}</h5>
            <div class="card-text">
              <p>{{ secondvenue.venueDescription }}</p>
              <p>空間可活動狗數: {{ secondvenue.venueCapacityDog }} 隻</p>
            </div>
            <button type="button" class="btn btn-outline-info" @click="goRent">
              我要預約
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      venues: [],
      firstvenue: [],
      secondvenue: [],
    };
  },
  mounted() {
    fetch(`${this.API_URL}/activity/api/venues`)
      .then((rs) => rs.json())
      .then((venueObj) => {
        this.venues = Object.values(venueObj);
        let venues = JSON.parse(JSON.stringify(venueObj));
        this.firstvenue = venues[0];
        this.secondvenue = venues[1];
        console.log(this.firstvenue);
        console.log(this.secondvenue);
      });
  },
  methods: {
    goRent() {
      this.$router.push("/activity/venueRental");
    },
  },
};
</script>
<style scoped></style>
