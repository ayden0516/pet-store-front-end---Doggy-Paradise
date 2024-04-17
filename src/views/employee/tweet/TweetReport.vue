<template>
    <div class="accordion" id="accordionExample">
        <ReportItem v-for="r in reports" :report="r" :key="r.reportsId"></ReportItem>
    </div>
</template>
<script>
import axios from 'axios';
import ReportItem from '@/components/tweet/TweetReport.vue';
import { useMemberStore } from "@/stores/memberStore";

export default {
    components: {
        ReportItem,
    },
    data() {
        return {
            reports: [],
        }
    },
    created() {
        const memberStore = useMemberStore();
        if (!memberStore.memberRole.startsWith('ROLE')) {
            // 如果 memberRole 不是以 'ROLE' 開頭，導向首頁
            this.$router.push('/:pathMatch(.*)*');
        }
    },
    mounted() {
        axios.get(`${this.API_URL}/tweet/getTweetsReports`).then(re => {
            console.log(re.data);
            this.reports = re.data;
        })
    }
}
</script>


<style scoped>
.accordion-item {
    width: 800px;
}
</style>
