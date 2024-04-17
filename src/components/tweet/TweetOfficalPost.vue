<template>
    <div class="container">
        <div class="card-module">
            <div class="title">
                <div class="cat">員工編號:{{ tweet.employeeId }}</div>
                <!-- img size => 16:9-->
                <div v-if="tweet.imgPathCloud" class="cover"
                    :style="{ backgroundImage: 'url(' + tweet.imgPathCloud + ')' }"></div>
                <div v-else class="cover" style="background-image: url(//picsum.photos/400/225?image=1041)"></div>
            </div>
            <div class="body">
                <!-- <h2 class="chapter">Card Title</h2> -->
                <div v-if="!this.editTweetContent" class="content-wrapper">
                    <div class="tweet-content">推播內容:{{ tweet.tweetContent }}</div>
                </div>

                <div v-else>
                    <textarea v-model="this.editTweetContentTmp" class="form-control"></textarea>
                    <div class="mt-2">
                        <button @click="saveEditedTweet" class="btn btn-primary">保存</button>
                        <button @click="editTweetContent = false" class="btn btn-secondary ms-2">取消</button>
                        <button @click="removeTweet" class="btn btn-warning ms-2">刪除貼文</button>
                    </div>
                </div>



                推播連結:<span v-html="generateTweetLink(tweet.tweetLink)"></span>
                <br>
                推播時間:<span>{{ formatPostDate(tweet.postDate) }}</span>
            </div>
            <div class="footer">
                <!-- <div class="favor">
                    <div class="icon read">
                        <img class="svg"
                            src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24.024' height='16' viewBox='0 0 24.024 16'%3E%3Cpath fill='%23040000' d='M12.012 0C4.075 0 0 8 0 8s3.075 8 12.012 8c8.093 0 12.012-7.969 12.012-7.969S20.075 0 12.012 0zm.018 13c-2.901 0-5-2.188-5-5 0-2.813 2.098-5 5-5s5 2.187 5 5c0 2.812-2.098 5-5 5zm0-8c-1.658.003-3 1.393-3 3 0 1.605 1.342 3 3 3s3-1.395 3-3c0-1.608-1.342-3.003-3-3z'/%3E%3C/svg%3E" />
                        <span>12345</span>
                    </div>
                    <div class="icon love">
                        <img class="svg"
                            src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='23.993' height='21.031' viewBox='0 0 23.993 21.031'%3E%3Cpath fill='%23040000' d='M22.227 10.549c2.355-2.414 2.354-6.325 0-8.737A5.946 5.946 0 0 0 17.863.001c-2.206.038-5.845 3.029-5.845 3.029S8.279-.003 6.018 0a5.93 5.93 0 0 0-4.253 1.812c-2.354 2.413-2.355 6.324 0 8.737l10.231 10.482 10.231-10.482z'/%3E%3C/svg%3E" />
                        <span>678</span>
                    </div>
                </div> -->
                <button @click="editTweetContent = true" type="button" class="btn btn-outline-primary">編輯</button>
                <button @click="removeTweet" type="button" class="btn btn-outline-danger">刪除</button>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios';

export default {

    props: {
        tweet: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            read: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24.024" height="16" viewBox="0 0 24.024 16">
          <path fill="#040000" d="M12.012 0C4.075 0 0 8 0 8s3.075 8 12.012 8c8.093 0 12.012-7.969 12.012-7.969S20.075 0 12.012 0zm.018 13c-2.901 0-5-2.188-5-5 0-2.813 2.098-5 5-5s5 2.187 5 5c0 2.812-2.098 5-5 5zm0-8c-1.658.003-3 1.393-3 3 0 1.605 1.342 3 3 3s3-1.395 3-3c0-1.608-1.342-3.003-3-3z"/>
        </svg>
      `,
            love: `
        <svg xmlns="http://www.w3.org/2000/svg" width="23.993" height="21.031" viewBox="0 0 23.993 21.031">
          <path fill="#040000" d="M22.227 10.549c2.355-2.414 2.354-6.325 0-8.737A5.946 5.946 0 0 0 17.863.001c-2.206.038-5.845 3.029-5.845 3.029S8.279-.003 6.018 0a5.93 5.93 0 0 0-4.253 1.812c-2.354 2.413-2.355 6.324 0 8.737l10.231 10.482 10.231-10.482z"/>
        </svg>
      `,
            editTweetContent: false,
            editTweetContentTmp: '',
        };
    },
    methods: {
        generateTweetLink(tweetLink) {
            // 將 URL 嵌入到 <a> 標籤中並返回
            return `<a href="${tweetLink}" target="_blank">${tweetLink}</a>`;
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
        saveEditedTweet() {
            const postData = {
                editTweetContentTmp: this.editTweetContentTmp,
                tweetId: this.tweet.tweetId
            };
            axios.post(`${this.API_URL}/tweet/updateOfficialTweetContent`, postData)
                .then(response => {
                    this.tweet.tweetContent = response.data;
                    this.editTweetContent = false;
                })
                .catch(error => {
                    console.error('更新推文錯誤：', error);
                });

        },
        removeTweet() {
            if (window.confirm('確定要刪除此推播嗎？')) {
                const postData = {
                    tweetId: this.tweet.tweetId
                };
                axios.post(`${this.API_URL}/tweet/removeOfficialTweetContent`, postData)
                    .then(response => {
                        alert('成功刪除: ' + response.data.tweetContent);
                        this.$router.go(0)
                    })
                    .catch(error => {
                        console.error('刪除錯誤：', error);
                    });

            } else {
                console.log('取消操作');
            }
        }
    },
    watch: {
        editTweetContent(newValue, oldValue) {
            if (newValue) {
                this.editTweetContentTmp = this.tweet.tweetContent;
            } else {
                this.editTweetContentTmp = "";
            }
        }
    }
};
</script>


<style scoped>
*,
*::before,
*::after {
    box-sizing: border-box;
}

html,
body,
.container {
    height: 100%;
}

body {
    background: #EEE;
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px auto;
    width: 500px;
    letter-spacing: 0.5px;
}


.card-module {
    border-radius: 6px;
    border-right: 1.5px solid rgba(0, 0, 0, 0.1);
    border-bottom: 1.5px solid rgba(0, 0, 0, 0.1);
    width: 100%;
}

.card-module .title {
    position: relative;
    width: 100%;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}

.card-module .cat {
    position: absolute;
    top: 5%;
    left: 0;
    padding: 2% 12% 2% 2%;
    background: linear-gradient(to right, white 0%, rgba(255, 255, 255, 0) 100%);
    font-size: 14px;
}

.card-module .cover {
    width: 100%;
    height: 0;
    padding-bottom: 56.25%;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
}

.card-module .body {
    padding: 16px;
    background: #FFF;
}

.card-module .body .chapter {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 24px;
}

.card-module .body .content {
    margin: 0 0 4px;
    line-height: 1.25;
    font-size: 16px;
}

.card-module .footer {
    position: relative;
    display: flex;
    padding: 16px;
    background: #FFF;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
}

.card-module .footer::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, rgba(204, 204, 204, 0) 0%, rgba(204, 204, 204, 0) 20%, #dddddd 50%, rgba(204, 204, 204, 0) 80%, rgba(204, 204, 204, 0) 100%);
}

.card-module .favor {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 75%;
}

.card-module .link {
    width: 25%;
    text-align: right;
}

.card-module .icon {
    display: flex;
    font-size: 14px;
}

.card-module .icon.read {
    margin-right: 8px;
}

.card-module .icon .svg,
.card-module .icon span {
    margin-right: 4px;
    color: #999;
}

.card-module .icon svg {
    width: 16px;
    height: 16px;
}

.card-module .icon svg path {
    fill: #999;
}

.card-module .icon span {
    display: inline-block;
}

.card-module .link a {
    display: inline-block;
    padding: 8px 24px;
    border-radius: 6px;
    text-decoration: none;
    color: rgba(0, 186, 255, 0.87);
    transition: all ease 0.5s;
}

.card-module .link a:hover,
.card-module .link a:active {
    background: rgba(0, 186, 255, 0.24);
    color: #008BBF;
}
</style>