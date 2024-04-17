<template>
    <div class="blog-card spring-fever" :style="{ height: cardHeight }">
        <!-- ...按紐們 -->
        <div class="col-auto">
            <div class="dropdown">
                <button class="btn btn-secondary" type="button" id="dropdownMenuButton1" aria-expanded="false">
                    ...
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li v-if="this.userName == this.tweetUserName"><a class="dropdown-item"
                            @click="editTweetContent = true">編輯推文</a></li>
                    <li v-if="this.userName != this.tweetUserName && userId"><a @click="showReportPostPage"
                            class="dropdown-item">檢舉推文</a></li>
                    <li v-if="this.userName != this.tweetUserName"><a class="dropdown-item"
                            @click="goOthersPage(this.tweetUserName, tweet.tweetId)">到{{ this.tweetUserName
                            }}的主頁</a>
                    </li>

                </ul>
            </div>
        </div>

        <div class="title-content">
            <h3><span @click="goOthersPage(this.tweetUserName, tweet.tweetId)">{{ this.tweetUserName }}</span></h3>
            <!-- 使用的的狗狗們 -->
            <div>
                <span v-if="userDogs.length > 0">我的狗勾們 :&nbsp;</span>
                <span v-for="(dog, index) in userDogs" :key="dog.dogId">
                    {{ dog.dogName }}
                    <template v-if="index < userDogs.length - 1">、</template>
                </span>
            </div>




            <hr v-if="tweet.preNode == 0">
            <div class="intro"> <a href="#">推文內容</a> </div>

        </div>
        <div class="card-info">
            <!-- 推文內容 -->
            <div v-if="!this.editTweetContent">
                <div class="tweet-content"><strong>{{ tweet.tweetContent }}</strong></div>
                <span>發文時間: {{ formatPostDate(tweet.postDate) }}</span>
            </div>
            <div v-else>
                <textarea v-model="this.editTweetContentTmp" class="form-control"></textarea>
                <div class="mt-2">
                    <button @click="saveEditedTweet" class="btn btn-primary">保存</button>
                    <button @click="editTweetContent = false" class="btn btn-secondary ms-2">取消</button>
                    <button @click="removeTweet" class="btn btn-warning ms-2">刪除貼文</button>
                </div>
            </div>
            <!-- <a href="#">Read Article<span class="licon icon-arr icon-black"></span></a> -->
        </div>

        <!-- 推文圖片 -->
        <div v-if="tweet.tweetGalleries && tweet.tweetGalleries.length > 0 && !imgOnline" class="tweet-galleries">
            <div class="d-flex justify-content-center">
                <div v-for="(gallery, index) in tweet.tweetGalleries" :key="index" class="gallery-item">
                    <img style=" object-fit: cover" width="250" height="250" :src="getImageUrl(gallery.imgPath)"
                        alt="Gallery Image" class="gallery-image">
                </div>
            </div>
        </div>
        <div v-if="tweet.tweetGalleries && tweet.tweetGalleries.length > 0 && imgOnline" class="tweet-galleries">
            <div class="d-flex justify-content-center">
                <div class="gallery-item">

                    <a v-if="tweet.tweetContent.startsWith('我的狗狗: ')" :href="roomLink">
                        <img :src="imgOnlinePath" style=" object-fit: cover" width="250" height="250"
                            alt="Gallery Image" class="gallery-image">
                    </a>
                    <a v-else :href="activityLink">
                        <img :src="imgOnlinePath" style=" object-fit: cover" width="250" height="250"
                            alt="Gallery Image" class="gallery-image">
                    </a>

                </div>
            </div>
        </div>


        <div class="utility-info">
            <ul class="utility-list">
                <li v-if="tweetLikeNum !== 0" @click="showLikeList">
                    <h6><strong><span @click="showLikeList">獲得了{{ tweetLikeNum
                                }}個骨頭</span></strong></h6>
                </li>

                <!-- 按讚按钮 -->
                <span v-if="tweet.preNode == 0 && userId">
                    <button v-if="!this.liked" @click="likeTweet" class="btn btn-outline-light custom-btn">🦴</button>
                    <button v-else @click="unlikeTweet" class="btn btn-outline-light custom-btn">💩</button>
                </span>

                <!-- <li><span class="licon icon-com"></span><a href="#">{{ this.numOfComment }}</a></li> -->
                <!-- 顯示留言數 -->
                <!-- <li><span v-if="this.numOfComment > 0" class="licon icon-com" style="margin-right: 10px;">{{
                        this.numOfComment }}</span></li> -->
                <!-- 顯示留言數 -->
                <span v-if="this.numOfComment > 0" class="comment-count" style="margin-right: 10px;">
                    <button @click="getCommentsLink(tweet.tweetId)" type="button" class="btn btn-outline-warning">有{{
                        this.numOfComment
                    }}則留言
                    </button>
                </span>
                <!-- 回覆推文的地方 -->
                <span v-if="tweet.preNode == 0 && userId">
                    <input type="text" v-model="replyContent" placeholder="在此輸入回覆內容"
                        style="height: 0px; padding-top: 16px; padding-bottom: 18px;">
                    <span>
                        <button @click="postReply" class="btn btn-success">回覆</button>
                    </span>
                </span>
                <hr>


                <!-- 子留言，內容 -->
                <div v-if="showComments" class="comment-section">

                    <div v-for="comment in tweetComments" :key="comment.id" class="comment-item">{{ comment.userName
                        }} : {{ comment.tweetContent }}</div>
                    <div>{{ currentReply }}</div>
                </div>

            </ul>
        </div>


    </div>

    <div class="gradient-overlay"></div>
    <div class="color-overlay"></div>
    <!-- /.blog-card -->


    <!--按讚名單的彈出式視窗 -->
    <div ref="myModal" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">按讚的人~</h5>

                </div>

                <div class="modal-body" v-for="n in userLikeList">
                    {{ n.lastName }}
                </div>

            </div>
        </div>
    </div>

    <!--檢舉的彈出式視窗 -->
    <div ref="ReportPostPage" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4>檢舉頁面</h4>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3 form-check">
                        <div>
                            <label>
                                <input type="checkbox" value="不可愛" v-model="reportPost" /> 不可愛
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" value="太恐怖" v-model="reportPost" /> 太恐怖
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" value="政治不正確" v-model="reportPost" /> 政治不正確
                            </label>
                        </div>
                        <div>
                            <label>
                                <input type="checkbox" value="我不爽" v-model="reportPost" /> 我不爽
                            </label>
                        </div>

                    </div>
                    <div class="mb-3">
                        <label for="reportReason" class="form-label">其他意見</label>
                        <textarea class="form-control" id="reportReason" rows="3" v-model="reportPostText"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" @click="submitReport" data-bs-dismiss="modal" aria-label="Close"
                            class="btn btn-primary">送出</button>

                    </div>
                </div>
            </div>
        </div>
    </div>


    <hr>
</template>

<script>

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from 'axios';
import { useMemberStore } from '@/stores/memberStore';
import { useTweetStore } from '@/stores/tweetStore';



export default {

    data() {
        return {

            numOfComment: 0,
            numOfLike: 0,
            showComments: false,
            tweetComments: [],
            tweetLikeNum: 0,
            liked: false,
            userId: useMemberStore().memberId,
            userName: useMemberStore().memberName,
            userLikeList: [],
            replyContent: '',
            thisTweetUserId: '',
            tweetUserName: "",
            currentReply: '',//當下留言立即出現
            preNodeUserName: '',//如果是回文的話，主文的推主是誰
            preNodeUserId: '',//如果是回文的話，主文的推主id
            preNodeTweetId: '',
            preNodeTweet: '',////如果是回文的話，主文的推主tweet
            editTweetContent: false,
            editTweetContentTmp: "",//編輯內文，暫存區
            userDogs: [],
            reportPost: [],//檢舉內容
            reportPostText: '',
            imgOnlinePath: "",
            imgOnline: false,
            activityLink: "http://localhost:5173/activity/all",
            roomLink: "http://localhost:5173/room/b_page",
            cardHeight: '',
        }
    },
    props: {
        tweet: {
            type: Object,
            required: true
        }
    },
    created() {
        axios.get(`${this.API_URL}/tweet/getNumOfComment/${this.tweet.tweetId}`)
            .then(response => {
                this.numOfComment = response.data;
            })
            .catch(error => {
                console.error('Error fetching number of comments:', error);
            });

        if (this.userId) {
            axios.get(`${this.API_URL}/tweet/getTweetLikesNum`, {
                params: {
                    tweetId: this.tweet.tweetId,
                    userId: this.userId
                }
            }).then(re => {
                this.tweetLikeNum = re.data.tweetLikesNum;
                //確認使用者是否已經按讚
                if (re.data.isUserLiked == 1) {
                    this.liked = true
                }
            })
        } else {
            axios.get(`${this.API_URL}/tweet/getTweetLikesNumForVisitor`, {
                params: {
                    tweetId: this.tweet.tweetId,
                }
            }).then(re => {
                this.tweetLikeNum = re.data.tweetLikesNum;
                //確認使用者是否已經按讚
                if (re.data.isUserLiked == 1) {
                    this.liked = true
                }
            })
        }


        //載入使用者的狗狗們
        axios.get(`${this.API_URL}/tweet/getTweetDogTags/${this.tweet.tweetId}`).then(re => {
            if (re.data !== null && re.data !== undefined && re.data !== '') {
                this.userDogs = re.data;

            }
        })
    },
    mounted() {
        if (this.tweet.preNode != 0) {
            axios.get(`${this.API_URL}/tweet/getUserByTweetId/${this.tweet.preNode}`).then(re => {
                this.preNodeUserName = re.data.lastName;
                // this.preNodeUserId = re.data.userId;
            })
            // axios.get(`${this.API_URL}/tweet/getTweetById/${this.tweet.preNode}`).then(re => {
            //     this.preNodeTweet = re.data;
            // })
        }


        if (this.tweet.preNode == 0) {
            axios.get(`${this.API_URL}/tweet/getUserNameByTweetId/${this.tweet.tweetId}`).then(re => {
                this.tweetUserName = re.data;
            })
        }
        if (this.tweet.preNode == 0) {
            axios.get(`${this.API_URL}/tweet/getUserIdByTweetId/${this.tweet.tweetId}`).then(re => {
                this.thisTweetUserId = re.data;
            })
        }

        if (this.tweet.tweetGalleries.length > 0) {
            this.cardHeight = '700px'
        } else {
            this.cardHeight = '300px'
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
    },
    methods: {
        getImageUrl(imgPath) {
            if (imgPath.startsWith('http')) {
                this.imgOnlinePath = imgPath;
                console.log(this.imgOnlinePath)
                this.imgOnline = true;
                return;
            }
            return `${this.API_URL}/tweet/getImage/${imgPath}`;
        },
        getCommentsLink() {
            if (this.showComments == false) {
                this.tweetComments = [];
                axios.get(`${this.API_URL}/tweet/getComments/${this.tweet.tweetId}`)
                    .then(response => {
                        this.tweetComments = response.data
                        this.expandCard();
                    })
                    .catch(error => {
                        console.error('Error fetching number of comments:', error);
                    });
                this.showComments = !this.showComments

            } else {
                this.currentReply = "";
                this.showComments = !this.showComments
                if (this.tweet.tweetGalleries.length > 0) {
                    this.cardHeight = '700px'
                } else {
                    this.cardHeight = '300px'
                    console.log("NOIMG")
                }
            }
        },
        goOthersPage(name, id) {
            const memberStore = useMemberStore();
            const tweetStore = useTweetStore();
            if (memberStore.memberName != name) {
                axios.get(`${this.API_URL}/tweet/getUserTweetsByTweetId/${id}`).then(re => {
                    tweetStore.writeIn(re.data)
                    tweetStore.setUserName(tweetStore.tweets[0].userName)
                    this.$router.push("/tweetPage/tweetsOthersWallPage")
                })
            } else {
                this.$router.push("/tweetPage/tweetsMyWallPage")
            }
        },
        likeTweet() {
            const memberStore = useMemberStore();
            this.liked = !this.liked;
            this.tweetLikeNum += 1;

            const fd = new FormData();
            fd.append("tweetId", this.tweet.tweetId);
            fd.append("userId", this.userId);

            axios.post(`${this.API_URL}/tweet/getLikeLink`, fd)
                .then(response => {
                    console.log("likeTweet success");
                })
                .catch(error => {
                    console.error(error);
                });

            if (this.userId != this.thisTweetUserId) {
                const params = {
                    hisUserId: this.thisTweetUserId,
                    hisTweetId: this.tweet.tweetId,
                    myName: memberStore.memberName
                };
                axios.get(`${this.API_URL}/tweet/sendLikeNotify`, { params })
                    .then(response => {
                        console.log(response.data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }

        },
        unlikeTweet() {
            this.liked = !this.liked;
            this.tweetLikeNum -= 1;

            const fd = new FormData();
            fd.append("tweetId", this.tweet.tweetId);
            fd.append("userId", this.userId);

            axios.post(`${this.API_URL}/tweet/removeLikeLink`, fd)
                .then(response => {
                    console.log("unlikeTweet success");
                })
                .catch(error => {
                    console.error(error);
                });
        },
        showLikeList() {
            const myModal = new bootstrap.Modal(this.$refs.myModal);
            myModal.show()
            axios.get(`${this.API_URL}/tweet/getTweetLikesUser`, {
                params: {
                    tweetId: this.tweet.tweetId,
                }
            }).then(re => {
                console.log("getTweetLikesUser" + re.data)
                this.userLikeList = re.data
            })
        },
        hideLikeList() {
            this.userLikeList = [];
        },
        // showReply() {
        //     const myReplyModal = new bootstrap.Modal(this.$refs.myReplyModal);
        //     myReplyModal.show()
        // },
        postReply() {
            if (!this.replyContent.trim()) {
                return;
            }
            this.RepolyErrorMsg = '';
            const memberStore = useMemberStore();

            const formData = new FormData();
            formData.append('memberId', memberStore.memberId);
            formData.append('tweetId', this.tweet.tweetId);
            formData.append('tweetContent', this.replyContent);
            axios.post(`${this.API_URL}/tweet/replyTweet`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    console.log("回文成功:", response.data);
                    // 清空推文内容
                    this.currentReply = memberStore.memberName + " : " + this.replyContent;
                    this.replyContent = "";
                    this.numOfComment += 1;
                    if (this.showComments == false) {
                        this.currentReply = "";
                    }
                })
                .catch(error => {
                    console.error("發文失败:", error);
                })

            if (this.userId != this.thisTweetUserId) {

                const params = {
                    hisUserId: this.thisTweetUserId,
                    hisTweetId: this.tweet.tweetId,
                    myName: memberStore.memberName
                };
                axios.get(`${this.API_URL}/tweet/sendReplyNotify`, { params })
                    .then(response => {
                        console.log("sendReplyNotify: " + response.data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        },
        goPreNodeTweetPage() {
            this.preNodeTweet = '';
            const tweetStore = useTweetStore();
            tweetStore.clearMsg();
            axios.get(`${this.API_URL}/tweet/getTweetById/${this.tweet.preNode}`).then(re => {

                this.preNodeTweet = re.data;

                tweetStore.setUserName(this.preNodeUserName)


                tweetStore.writeIn(re.data)

                this.$router.push("/tweetPage/tweetsSingleTweetPage")
            })

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
            axios.post(`${this.API_URL}/tweet/updateTweetContent`, postData)
                .then(response => {
                    this.tweet.tweetContent = response.data;
                    this.editTweetContent = false;
                })
                .catch(error => {
                    console.error('更新推文錯誤：', error);
                });

        },
        removeTweet() {
            if (window.confirm('確定要刪除此推文嗎？')) {
                const postData = {
                    tweetId: this.tweet.tweetId
                };
                axios.post(`${this.API_URL}/tweet/removeTweetContent`, postData)
                    .then(response => {
                        alert('成功刪除推文: ' + response.data.tweetContent);
                        this.$router.go(0)
                    })
                    .catch(error => {
                        console.error('刪除推文錯誤：', error);
                    });

            } else {
                console.log('取消操作');
            }
        },
        showReportPostPage() {
            const reportPostPage = new bootstrap.Modal(this.$refs.ReportPostPage);
            reportPostPage.show()
        },
        submitReport() {
            const requestData = {
                reportText: this.reportPostText,
                reportCheckBox: this.reportPost,
                reporterId: this.userId,
                tweetId: this.tweet.tweetId
            };
            axios.post(`${this.API_URL}/tweet/reportTweet`, requestData)
                .then(response => {
                    console.log("Report submitted successfully:", response.data);
                })
                .catch(error => {
                    console.error("Error submitting report:", error.message);
                });
        }, expandCard() {
            const numComments = this.tweetComments.length;
            const expandedHeight = 700 + (numComments * 50);
            this.cardHeight = `${expandedHeight}px`;
        },

    }
};
</script>

<style scoped>
@import url(//fonts.googleapis.com/css?family=Abril+Fatface|Droid+Serif:400,700,400italic,700italic);

html,
body {
    height: 100%
}

/* body {
  background: linear-gradient(to bottom, rgba(0,5,10,0.4) 0%,rgba(0,0,0,0) 100%);
  font-family: 'Droid Serif', serif;
}
 */
.blog-card {
    max-width: 600px;
    width: 100%;
    height: 700px;
    /* position: absolute; */
    font-family: 'Droid Serif', serif;
    color: #fff;
    top: 10%;
    right: 0;
    left: 0;
    margin: 4rem auto;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0px 10px 20px -9px rgba(0, 0, 0, 0.5);
    text-align: center;
    transition: all 0.4s;
    background: rgba(0, 0, 0, 0.5) url(https://unsplash.it/600/800?image=1061) center no-repeat;
    /* opacity: 0.5; */
    background-size: 100%;
}


.blog-card a {
    color: hsl(0, 0%, 0%);
    text-decoration: none;
    transition: all 0.2s
}

.blog-card .color-overlay {
    background: rgba(64, 84, 94, 0.5);
    width: 550px;
    height: 500px;
    /* position: absolute; */
    z-index: 10;
    top: 0;
    left: 0;
    transition: background 0.3s cubic-bezier(0.33, 0.66, 0.66, 1);
}

.blog-card .gradient-overlay {
    background-image: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.6) 21%);
    width: 550px;
    height: 500px;
    /* position: absolute; */
    top: 350px;
    left: 0;
    z-index: 15;
}

.blog-card:hover {
    box-shadow: 0px 18px 20px -9px rgba(0, 10, 30, 0.75);
}

.blog-card:hover .card-info {
    opacity: 1;
    bottom: 100px;
}

.blog-card:hover .color-overlay {
    background: rgba(64, 64, 70, 0.8);
}

.blog-card:hover .title-content {
    margin-top: 0px
}

.title-content {
    text-align: center;
    margin: 80px 0 0 0;
    /* position: absolute; */
    z-index: 20;
    width: 100%;
    top: 0;
    left: 0;
    transition: all 0.6s
}

.blog-card:hover h3:after {

    animation: changeLetter 0.3s 1 linear;
    width: 80%
}

.blog-card h3,
h1 {
    font-size: 1.9em;
    font-weight: 400;
    letter-spacing: 1px;
    font-family: 'Abril Fatface', serif;
    margin-bottom: 0;
    display: inline-block;
}

.blog-card h3 a {
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    transition: all 0.2s
}

.blog-card h3 a:hover {
    text-shadow: 0px 8px 20px rgba(0, 0, 0, 0.95);
}

h3:after {
    content: " ";
    display: block;
    width: 10%;
    height: 2px;
    margin: 20px auto;
    border: 0;
    background: #BDA26B;
    transition: all 0.2s
}

@keyframes changeLetter {
    0% {
        width: 10%;
    }

    100% {
        width: 80%;
    }
}

.intro {
    width: 170px;
    margin: 0 auto;
    color: #ddd;
    font-style: italic;
    line-height: 18px;
}

.intro a {
    color: #ddd
}

.intro a:hover {
    text-decoration: underline
}

.card-info {
    box-sizing: border-box;
    padding: 0;
    width: 100%;
    /* position: absolute; */
    bottom: -40px;
    left: 0;
    margin: 0 auto;
    padding: 0 50px;
    font-style: 16px;
    line-height: 24px;
    z-index: 20;
    opacity: 0;
    transition: bottom 0.64s, opacity 0.63s cubic-bezier(0.33, 0.66, 0.66, 1);
}

.card-info a {
    display: block;
    width: 100px;
    margin: 15px auto;
    background: #fff;
    color: #444;
    padding: 3px 10px;
    border-radius: 2px;
    font-size: 0.8em
}

.card-info a:hover {
    background: #8e7c49;
    color: #fff;
}

.card-info a:hover span {
    filter: brightness(10);
    opacity: 1
}

.utility-info {
    /* position: absolute; */
    bottom: 0px;
    left: 0;
    z-index: 20;
    width: 100%;
    text-align: left
}

.utility-info:after {
    content: " ";
    background: url(https://rawcdn.githack.com/Nodws/NodPen/ffad95aa5244b4b09a3c7c1508a018959bbedb7e/postItem/licons.svg) center no-repeat;
    background-size: 30px auto;
    display: block;
    opacity: 0.4;
    /* position: absolute; */
    bottom: 25px;
    right: 15px;
    width: 30px;
    height: 15px
}

.utility-info a:hover {
    text-decoration: underline
}

.utility-list {
    list-style-type: none;
    margin: 0 0 10px 20px;
    padding: 0;
    width: 100%;

}

.utility-list li {
    margin: 0 5px 0 0;
    padding: 3px 0 15px 0px;
    display: inline-block;

    font-size: 0.8em
}

.licon {
    position: relative;
    width: 23px;
    height: 15px;
    display: inline-block;
    vertical-align: middle;
}

.licon:before {
    content: "";
    background: url(https://rawcdn.githack.com/Nodws/NodPen/ffad95aa5244b4b09a3c7c1508a018959bbedb7e/postItem/licons.svg?) -2px -6px no-repeat;
    background-size: 250px;
    width: 26px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    /* position: absolute; */
    top: -3px;
    left: 0;
}

.icon-white {
    filter: brightness(10);
}

.icon-black {
    filter: brightness(0);
    opacity: 0.6
}

.icon-like:before {
    background-position: -183px -6px;

}

.icon-com:before {
    background-position: -63px -4px;

}

.icon-dat:before {
    background-position: -94px -7px;
}

.icon-tag:before {
    background-position: -33px -6px;

}

@media (max-width:750px) {
    .utility-info {
        text-align: center;
    }

    .utility-info ul {
        width: 100%;
        margin: 0;
        box-sizing: border-box
    }

    .utility-info li {
        width: 49%;
        display: inline-block;
        box-sizing: border-box;
        margin: 0
    }
}

@media (max-width:500px) {
    .utility-info li:last-of-type {
        width: 100%
    }

    .card-info {
        display: none
    }

    .blog-card:hover .title-content,
    .title-content {
        margin-top: 40px
    }

    .blog-card {
        height: 300px
    }

    .blog-card h3 {
        font-size: 1.3em
    }

    .intro {
        font-size: 0.8em
    }
}


/*  ================  */

/* ignore this bit :P */
#profile-badges:after {
    content: "BRO";
    font-family: "Lato", "Lucida Grande", "Lucida Sans Unicode", Tahoma, Sans-Serif;
    font-size: 13px;
    font-weight: 500;
    text-transform: uppercase;
    padding: 1px 4px 1px 4px;
    color: black !important;
    border-radius: 3px;
    position: relative;
    top: -2px;
    text-shadow: none !important;
    white-space: nowrap;
    letter-spacing: 0;
    background: #FFDD40;
}

.profile-header {
    background: #333 url(https://images.unsplash.com/photo-1435783099294-283725c37230?dpr=1&auto=compress,format&fit=crop&w=1376&h=635&q=80&cs=tinysrgb&crop=&bg=) top center no-repeat;
    background-size: cover;
    font-size: 3em;
    position: relative
}

.profile-header:after {
    /* position: absolute; */
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(23, 23, 31, 0.42);
    z-index: 0
}

#profile-links a {
    font-family: 'Abril Fatface', serif;
    font-size: 1.2em
}


.profile-links a[href*=nodws\.com]:before {
    content: "\2616";
    color: #0a45b5;
    padding-right: 3px
}

.profile-links a[href*=twitter]:before {
    content: "\1f426";
    color: #08c
}

.profile-links a[href*=dribbble]:before {
    content: "\26BE";
    color: #d055bf
}

#following-this-user {
    pointer-events: none
}

#follow-this-user {
    font-size: 1.2em;
    border-color: #359ef9
}

#follow-this-user:after {
    content: "\1f448"
}

.links-and-stats {
    background: rgb(20, 20, 21);
}

.profile-name h1 {
    text-shadow: 0 6px 9px rgba(0, 0, 0, 0.48)
}

.profile-avatar {
    bottom: -10px;
    width: 150px;
    height: 150px;
    border: 0px solid #1E1E1E;
    background: rgba(2, 2, 2, 0.49);
    box-shadow: 0 19px 19px -10px rgba(0, 0, 0, 0.63)
}

.profile-username,
.upsell,
.profile-location,
.primary-pro {
    opacity: 0;
}

.upsell,
#pen-as-header-question {
    display: none
}

.profile-nav-1 a {
    font-size: 1.2rem;
}

.profile-bio,
.profile-nav-1 a.active,
.profile-nav-1 a:hover {
    color: rgba(20, 20, 21, 0.59) !important;
    font-size: 1.2rem
}

.meta .pen-title {
    font-family: 'Droid Serif', serif;
    text-align: center
}

.pagination-button {
    background-color: #2f2f31;
    border-color: #2f2f31;
    transition: all 0.2s
}

.pagination-button:hover {
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2)
}

.single-project .stats,
.single-pen .stats {
    text-align: center;
    width: 100%
}

.stats svg {
    fill: #bda26b;
}

.stats svg,
.loves .icon-heart {
    fill: rgba(47, 47, 49, 0) !important;
    stroke: #ba6 !important;
    stroke-width: 0.1em !important;
}

.loves .icon-heart {
    stroke-width: 0.5em !important;
}

.comments svg {
    stroke-width: 0.35em !important;
}

.single-stat.loves.loved-1 svg {
    stroke: #fff !important
}

.single-pen:hover h3:after {
    width: 40%;
    transition: all 0.2s
}

.pen-actions {
    border: 0px !important
}

.meta {
    box-shadow: none !important
}

.with-background {
    background-color: #F3F3FA;
    border-radius: 10px;

}

.tweet-item {
    max-width: 500px;
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #C4E1E1;
}

.reply-message {
    cursor: pointer;
    font-weight: bold;
    color: blue;
    margin-bottom: 10px;
}

.tweet-id,
.post-date,
.tweet-name,
.tweet-content {
    margin-bottom: 10px;
}

.tweet-galleries {
    margin-bottom: 10px;
}

.gallery-item {
    display: inline-block;
    margin-right: 10px;
}

.gallery-image {
    max-width: 400px;
    /* 指定圖片的最大寬度 */
    max-height: 400px;

    /* 指定圖片的最大高度
    /* 如果需要指定固定的寬度和高度，可以使用 width 和 height 屬性 */
    /* width: 300px;
    height: 300px; */
}


.like-count {
    cursor: pointer;
    padding: 5px;
}

.hovered {
    background-color: #aa2929;
}

.comment-section {
    margin-top: 10px;
}

.comment-item {
    margin-bottom: 5px;
}

.comment-username {
    font-weight: bold;
}

.comment-content {
    margin-left: 5px;
}

.current-reply {
    margin-top: 10px;
    font-style: italic;
}


.colored-header {
    background-color: #ffffff;
    padding: 20px;

}


.dropdown {
    position: relative;
    display: inline-block;

}

.dropdown-menu {
    display: none;
    position: absolute;
    z-index: 1;

}

.dropdown:hover .dropdown-menu {
    display: block;
}

.custom-btn {
    border: none;
    /* 移除按鈕的邊框 */
}

.blog-card .dropdown {
    display: flex;
    justify-content: flex-end;
}

.blog-card .dropdown-menu {
    right: 0;
}
</style>