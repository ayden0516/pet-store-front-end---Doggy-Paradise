<template>
    <div class="tweet-container">
        <h3>我的追蹤</h3>
        <TweetItem3 v-for="tweet in tweets" :key="tweet.tweetId" :tweet="tweet"></TweetItem3>
        <!-- <TweetItem v-for="tweet in tweets" :key="tweet.tweetId" :tweet="tweet" /> -->
    </div>
    <!-- 追蹤名單 -->
    <div class="follow-list">
        <h4>追蹤名單</h4>
        <div class="modal-body" v-for="n in this.users" :key="n.userId" @click="goOthersPage(n.lastName)">
            {{ n.lastName }}
            <hr>
        </div>
    </div>

</template>
<script>
import axios from 'axios';
import TweetItem from '@/components/tweet/TweetCard.vue';
import { useMemberStore } from '@/stores/memberStore';
import { useTweetStore } from '@/stores/tweetStore';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import TweetItem2 from '@/components/tweet/TweetCard2.vue';
import TweetItem3 from '@/components/tweet/TweetCard3.vue'

export default {
    components: {
        TweetItem,
        TweetItem2,
        TweetItem3
    },
    data() {
        return {
            tweets: [],
            users: [],
        }
    },
    mounted() {
        const memberStore = useMemberStore();

        if (memberStore.memberRole.startsWith("Act")) {
            axios.get(`${this.API_URL}/tweet/getMyFollowTweets?userId=${memberStore.memberId}`)
                .then(response => {
                    this.tweets = response.data;
                })
                .catch(error => {
                    console.error(error);
                });

            axios.get(`${this.API_URL}/tweet/getMyFollowUsers?userId=${memberStore.memberId}`)
                .then(response => {
                    this.users = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        }


    },
    methods: {
        goOthersPage(name) {
            const tweetStore = useTweetStore();
            axios.get(`${this.API_URL}/tweet/getTweetsByUserName/${name}`).then(re => {
                tweetStore.writeIn(re.data)
                tweetStore.setUserName(name)
                this.$router.push("/tweetPage/tweetsOthersWallPage")
            })

        },

    }

}
</script>
<style scoped>
.follow-list {
    margin-top: 39px;

    border: 2px solid #ccc;

    padding: 20px;

    border-radius: 6px;

}

.follow-list h4 {
    color: #333;

    font-size: 1.5em;

    margin-bottom: 20px;

}

.modal-body {
    cursor: pointer;

}

.modal-body:hover {
    background-color: #f0f0f0;

}
</style>