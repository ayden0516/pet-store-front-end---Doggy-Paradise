<template>
    <div>
        <TweetItemOffical v-for="tweet in tweets" :key="tweet.tweetId" :tweet="tweet"></TweetItemOffical>
        <!-- <div v-for="tweet in tweets" :key="tweet.tweetId">
            <p>員工編號 ID: {{ tweet.employeeId }}</p>
            <p>推播內容: {{ tweet.tweetContent }}</p>
            推播連結:<span v-html="generateTweetLink(tweet)"></span>
            <br>
            <img :src="tweet.imgPathCloud" />
            <hr>
        </div> -->
    </div>
</template>
<script>
import axios from "axios";
import TweetItemOffical from '@/components/tweet/TweetOfficalPost.vue';

export default {
    components: {
        TweetItemOffical
    },
    data() {
        return {
            tweets: []
        }
    },
    mounted() {
        axios.get(`${this.API_URL}/tweet/getAllTweetOfficial`)
            .then(re => {
                this.tweets = re.data;
                console.log(re.data)
            }).catch(
        )
    },
    methods: {
        generateTweetLink(tweet) {
            // 將 URL 嵌入到 <a> 標籤中並返回
            return `<a href="${tweet.tweetLink}" target="_blank">${tweet.tweetLink}</a>`;
        }
    }
}
</script>
<style></style>