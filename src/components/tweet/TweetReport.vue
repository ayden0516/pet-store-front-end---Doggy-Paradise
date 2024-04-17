<template>

    <div class="accordion-item">

        <h2 class="accordion-header" :id="'headingOne' + report.reportsId">

            <button class="accordion-button btn-custom" type="button" data-bs-toggle="collapse"
                :data-bs-target="'#collapseOne' + report.reportsId" aria-expanded="false"
                :aria-controls="'collapseOne' + report.reportsId">
                <strong>檢舉編號 : {{ report.reportsId }}<div>推文ID : {{ tweet.tweetId }}</div></strong>

                &nbsp;&nbsp;&nbsp;&nbsp;

                <code>狀態 :<span v-if="buttonControll">未處理</span>
                    <span v-else>已處理</span></code>


                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span v-if="this.dangerSigle">AI判定:異常推文</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                <span v-if="!buttonControll">處理員工ID : {{ empName }}</span>

            </button>
        </h2>
        <div :id="'collapseOne' + report.reportsId" class="accordion-collapse collapse "
            :aria-labelledby="'headingOne' + report.reportsId" data-bs-parent="#accordionExample">
            <div class="accordion-body">

                <div>檢舉型態 : {{ report.reportReason }}</div>
                <div>其他意見 : {{ report.reportDescription }}</div>
                <hr>
                <div>推文內容 :{{ tweet.tweetContent }}</div>
                <!-- 推文圖片 -->
                <div v-if="tweet.tweetGalleries && tweet.tweetGalleries.length > 0 && !imgOnline"
                    class="tweet-galleries">
                    <div class="d-flex justify-content-center">
                        <div v-for="(gallery, index) in tweet.tweetGalleries" :key="index" class="gallery-item">
                            <img :src="getImageUrl(gallery.imgPath)" alt="Gallery Image" class="gallery-image">
                        </div>
                    </div>
                </div>
                <div v-if="tweet.tweetGalleries && tweet.tweetGalleries.length > 0 && imgOnline"
                    class="tweet-galleries">
                    <div class="d-flex justify-content-center">
                        <div class="gallery-item">
                            <img :src="imgOnlinePath" alt="Gallery Image" class="gallery-image">
                        </div>
                    </div>
                </div>
                <hr>
                <h5>AI自動審核結果</h5>
                <div>情色露骨內容 : {{ this.report.sexuallyExplicit }}</div>
                <div>仇恨言論 : {{ this.report.hateSpeech }}</div>
                <div>騷擾內容 : {{ this.report.harassment }}</div>
                <div>危險內容 : {{ this.report.dangerousContent }}</div>
                <strong :style="{ color: dangerScore >= 4 ? 'red' : 'inherit' }">分數 : {{ this.dangerScore
                    }}</strong><code>(越高則越危險)</code>

                <hr>
                <div>檢舉人 : {{ user.lastName }}</div>

                <div>被檢舉人 : {{ tweet.userName }}</div>

                <div>推文已被檢舉次數 : {{ tweet.numReport }}</div>

                <code>檢舉時間 : {{ formatPostDate(report.reportDate) }}</code>
                <hr>
                <h3>推文狀態 : {{ tweetMode }}</h3>
                <div v-if="buttonControll" class="d-flex justify-content-end">
                    <div class="btn-group">
                        <button @click="banTweet" class="btn btn-outline-danger">封鎖貼文</button>

                        <button @click="noBanTweet" class="btn btn-outline-success">檢舉不通過</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import axios from 'axios';



export default {
    props: {
        report: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            tweet: "",
            user: "",
            emp: "",
            imgOnlinePath: "",
            imgOnline: false,
            buttonControll: true,
            empName: "已在其他檢舉中處理",
            tweetMode: "保留",
            sexuallyExplicit: "",
            hateSpeech: "",
            harassment: "",
            dangerousContent: "",
            dangerScore: 0,
            dangerSigle: false,
        }
    },
    mounted() {
        //被檢舉tweet
        axios.get(`${this.API_URL}/tweet/getTweetByReportId/${this.report.reportsId}`).then(re => {
            this.tweet = re.data;
            if (re.data.tweetStatus == 0) {
                this.buttonControll = false;
                this.tweetMode = "移除";
            }
        })

        //檢舉人
        axios.get(`${this.API_URL}/tweet/getUserByReportId/${this.report.reportsId}`).then(re => {
            this.user = re.data;
        })

        //如果該檢舉已經處理了
        if (this.report.reportStatus == 1) {
            axios.get(`${this.API_URL}/employee/getEmpByReportId/${this.report.reportsId}`).then(re => {
                this.emp = re.data;
                this.empName = re.data.lastName
                this.buttonControll = false;
            })

        }

        switch (this.report.sexuallyExplicit) {
            case "HIGH":
                this.dangerScore += 4;
                break;
            case "MEDIUM":
                this.dangerScore += 2;
                break;
            case "LOW":
                this.dangerScore += 1;
                break;
        }

        switch (this.report.hateSpeech) {
            case "HIGH":
                this.dangerScore += 4;
                break;
            case "MEDIUM":
                this.dangerScore += 2;
                break;
            case "LOW":
                this.dangerScore += 1;
                break;
        }

        switch (this.report.harassment) {
            case "HIGH":
                this.dangerScore += 4;
                break;
            case "MEDIUM":
                this.dangerScore += 2;
                break;
            case "LOW":
                this.dangerScore += 1;
                break;
        }

        switch (this.report.dangerousContent) {
            case "HIGH":
                this.dangerScore += 4;
                break;
            case "MEDIUM":
                this.dangerScore += 2;
                break;
            case "LOW":
                this.dangerScore += 1;
                break;
        }


        if (this.dangerScore >= 4) {
            this.dangerSigle = true;
        }


    },
    methods: {
        getImageUrl(imgPath) {
            if (imgPath.startsWith('http')) {
                this.imgOnlinePath = imgPath;
                this.imgOnline = true;
                return;
            }
            return `${this.API_URL}/tweet/getImage/${imgPath}`;
        },
        formatPostDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `${year}年${month}月${day}號 ${hours}點${minutes}分`;
        },
        banTweet() {
            const confirmed = confirm('確認要刪除該推文嗎?');
            if (confirmed) {
                axios.get(`${this.API_URL}/employee/banTweet/${this.tweet.tweetId}/${this.report.reportsId}`)
                    .then(response => {
                        this.empName = response.data;
                        this.buttonControll = false;
                        this.tweetMode = "移除";
                        window.location.reload();
                    })
                    .catch(error => {
                        console.error('Error during banTweet request:', error);
                    });
            } else {
                console.log('Ban tweet action cancelled.');
            }
        },
        noBanTweet() {
            axios.get(`${this.API_URL}/employee/noBanTweet/${this.tweet.tweetId}/${this.report.reportsId}`)
                .then(response => {
                    this.empName = response.data;
                    this.buttonControll = false;
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error during banTweet request:', error);
                });
        }

    }

}
</script>


<style scoped>
.accordion-item {
    width: 800px;
}

.btn-custom {
    background-color: #d4e6ff;
    color: #000000;
}

.gallery-image {
    width: 400px;
    /* 調整圖片的寬度 */
    height: auto;
    /* 讓高度根據比例自動調整 */
}
</style>