<template>
  <div class="dogcard">
    <DogItem
      v-for="dog in dogs"
      :key="dog.dogId"
      :dog="dog"
      @update-success="reloadData"
    />
  </div>
</template>
<script>
import { useMemberStore } from "@/stores/memberStore";
import DogItem from "@/components/dog/DogCard.vue";
import axios from "axios";
import { useRouter } from "vue-router";
export default {
  components: {
    DogItem,
  },
  data() {
    return {
      memberId: "",
      dogs: [],
    };
  },
  mounted() {
    const emits = ["update-success"]; // 聲明自定義事件
    const memberStore = useMemberStore();
    this.memberId = memberStore.memberId;

    axios.get(`${this.API_URL}/dog/getDogs/${this.memberId}`).then((re) => {
      this.dogs = re.data;
    });
  },
  methods: {
    reloadData() {
      axios.get(`${this.API_URL}/dog/getDogs/${this.memberId}`).then((re) => {
        this.dogs = re.data;
      });
    },
  },
};
</script>
<style scoped>
.dogcard {
  display: flex;
  flex-wrap: wrap;
}

.btn {
  max-height: 40px;
}
</style>
