<template>
    <div class="tweet-container">
        <h3>我的主頁</h3>


        <!-- <button v-if="!noShowCommentButton" @click="noShowComment" class="btn btn-warning">不顯示回覆的推文</button>
        <button v-else @click="showComment" class="btn btn-warning">顯示包含回覆的推文</button>
        <hr> -->
        <TweetItem3 v-for="tweet in tweets" :key="tweet.tweetId" :tweet="tweet"></TweetItem3>
        <!-- <TweetItem v-for="tweet in tweets" :key="tweet.tweetId" :tweet="tweet" /> -->
    </div>
</template>
<script>

import axios from 'axios';
import TweetItem from '@/components/tweet/TweetCard.vue';
import TweetItem2 from '@/components/tweet/TweetCard2.vue';
import TweetItem3 from '@/components/tweet/TweetCard3.vue'
import { useMemberStore } from '@/stores/memberStore';

export default {
    components: {
        TweetItem,
        TweetItem2,
        TweetItem3
    },
    data() {
        return {
            tweets: [],
            noShowCommentButton: false,
        }
    },
    mounted() {
        const memberStore = useMemberStore();
        if (memberStore.memberRole.startsWith("Act")) {
            axios.get(`${this.API_URL}/tweet/getTweetsByUserIdWithNoComments/${memberStore.memberId}`).then(re => {
                this.tweets = re.data;
                this.noShowCommentButton = !this.noShowCommentButton
            })
        }

    },
    methods: {
        noShowComment() {
            const memberStore = useMemberStore();
            axios.get(`${this.API_URL}/tweet/getTweetsByUserIdWithNoComments/${memberStore.memberId}`).then(re => {
                this.tweets = re.data;
                this.noShowCommentButton = !this.noShowCommentButton
            })
        },
        showComment() {
            const memberStore = useMemberStore();
            axios.get(`${this.API_URL}/tweet/getTweetsByUserId/${memberStore.memberId}`).then(re => {
                this.tweets = re.data;
                this.noShowCommentButton = !this.noShowCommentButton
            })
        }
    }

}
</script>
<style></style>