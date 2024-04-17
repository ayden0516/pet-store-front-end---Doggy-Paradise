<template>
  <div class="product-details-container">
    <!-- <h1>Product Details</h1> -->
    <hr />
    <div v-if="productpage.length">
      <div class="product-info">
        <div class="product-image">
          <img :src="productpage[0].imgPath[0]" class="product-img" />
        </div>
        <div class="product-details">
          <!-- 輪播 -->
          <div id="cont">
            <div id="photo">
              <img src="https://cdn2.ettoday.net/images/5550/5550904.jpg" />
              <img src="https://cdn2.ettoday.net/images/5465/5465162.jpg" />
              <img
                src="https://image-cdn-flare.qdm.cloud/q64c525421aa98/image/data/2022/11/27/4ccdfb4dab48da9463d7662e993bd7ca.jpeg"
              />
            </div>
          </div>
          <!-- 輪播 -->
          <div class="product-name-container">
            <!-- 愛心 -->
            <svg
              width="24"
              height="20"
              class="vgMiJB pointer-cursor"
              viewBox="0 0 24 20"
              @click="isHeartFilled ? deleteToCollect() : addToCollect()"
            >
              <!-- class="vgMiJB" -->
              <!-- 當isHeartFilled為true調用deleteToCollect，為false調用addToCollect -->
              <path
                :fill="isHeartFilled ? '#FF424F' : 'none'"
                stroke="#FF424F"
                stroke-width="1.5"
                d="M19.469 1.262c-5.284-1.53-7.47 4.142-7.47 4.142S9.815-.269 4.532 1.262C-1.937 3.138.44 13.832 12 19.333c11.559-5.501 13.938-16.195 7.469-18.07z"
                fill-rule="evenodd"
                stroke-linejoin="round"
              ></path>
            </svg>
            <!-- 愛心 -->
            <p class="product-name">{{ productpage[0].productName }}</p>
          </div>
          <p class="product-price">價格：{{ productpage[0].unitPrice }}</p>
          <!-- 數量鍵開始 -->
          <div class="quantity-input-section d-flex align-items-center">
            <button
              class="btn btn-link px-2"
              onclick="this.parentNode.querySelector('input[type=number]').stepDown()"
              @click="decrementQuantity"
            >
              <i class="fas fa-minus"></i>
            </button>

            <input
              min="0"
              name="quantity"
              :value="quantity"
              type="number"
              class="form-control form-control-sm quantity-input text-center"
              @input="updateQuantity"
            />

            <button
              class="btn btn-link px-2"
              onclick="this.parentNode.querySelector('input[type=number]').stepUp()"
              @click="incrementQuantity"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
          <!-- 结束數量鍵 -->
          <button
            class="add-to-cart-button"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- 彈出視窗 -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    v-if="productpage.length"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">購物車</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>商品:{{ productpage[0].productName }}</h5>
          <p>價格:{{ productpage[0].unitPrice }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="pageAddToCart()"
          >
            加入
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- ----------以下是新的------------ -->
  <el-tabs type="border-card">
    <el-tab-pane label="全部">
      <!-- 頁面 -->
      <div v-for="cm in comment" class="card">
        <!-- v-if="comment.length > 0 && cm[1] === 1" -->
        <div class="card-body">{{ cm[8] }}**</div>
        <div class="card-body">
          <el-rate
            v-model="cm[1]"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value} 顆星"
          />
        </div>
        <div class="card-body">{{ formatDate(cm[5]) }}</div>
        <div class="card-body">{{ cm[3] }}</div>
        <div class="card-body">
          <div class="demo-image__preview">
            <el-image
              style="width: 100px; height: 100px"
              :src="cm[4]"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[cm[4]]"
              :initial-index="4"
              fit="cover"
            />
          </div>
          <!-- <img :src="cm[4]" style="max-width: 100px; max-height: 100px" /> -->
        </div>
      </div>
      <!-- 頁面 -->
    </el-tab-pane>
    <el-tab-pane label="五顆星">
      <div v-for="cm5 in comment5" class="card">
        <div class="card-body">{{ cm5[8] }}**</div>
        <div class="card-body">
          <el-rate
            v-model="cm5[1]"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value} 顆星"
          />
        </div>
        <div class="card-body">{{ formatDate(cm5[5]) }}</div>
        <div class="card-body">{{ cm5[3] }}</div>
        <div class="card-body">
          <div class="demo-image__preview">
            <el-image
              style="width: 100px; height: 100px"
              :src="cm5[4]"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[cm5[4]]"
              :initial-index="4"
              fit="cover"
            />
          </div>
        </div></div
    ></el-tab-pane>
    <el-tab-pane label="四顆星">
      <div v-for="cm4 in comment4" class="card">
        <div class="card-body">{{ cm4[8] }}**</div>
        <div class="card-body">
          <el-rate
            v-model="cm4[1]"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value} 顆星"
          />
        </div>
        <div class="card-body">{{ formatDate(cm4[5]) }}</div>
        <div class="card-body">{{ cm4[3] }}</div>
        <div class="card-body">
          <div class="demo-image__preview">
            <el-image
              style="width: 100px; height: 100px"
              :src="cm4[4]"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[cm4[4]]"
              :initial-index="4"
              fit="cover"
            />
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="三顆星">
      <!-- <div v-for="cm3 in comment3" class="card">
        <div class="card-body">{{ cm3[8] }}**</div>
        <div class="card-body">
          <el-rate
            v-model="cm3[1]"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value} 顆星"
          />
        </div>
        <div class="card-body">{{ formatDate(cm3[5]) }}</div>
        <div class="card-body">{{ cm3[3] }}</div>
        <div class="card-body">
          <div class="demo-image__preview">
            <el-image
              style="width: 100px; height: 100px"
              :src="cm3[4]"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[cm3[4]]"
              :initial-index="4"
              fit="cover"
            />
          </div>
        </div></div
    > -->
    </el-tab-pane>
    <el-tab-pane label="二顆星">
      <!-- <div v-for="cm2 in comment2" class="card">
        <div class="card-body">{{ cm2[8] }}**</div>
        <div class="card-body">
          <el-rate
            v-model="cm2[1]"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value} 顆星"
          />
        </div>
        <div class="card-body">{{ formatDate(cm2[5]) }}</div>
        <div class="card-body">{{ cm2[3] }}</div>
        <div class="card-body">
          <div class="demo-image__preview">
            <el-image
              style="width: 100px; height: 100px"
              :src="cm2[4]"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[cm2[4]]"
              :initial-index="4"
              fit="cover"
            />
          </div>
        </div>
      </div> -->
    </el-tab-pane>
    <el-tab-pane label="一顆星">
      <!-- <div v-for="cm1 in comment1" class="card">
        <div class="card-body">{{ cm1[8] }}**</div>
        <div class="card-body">
          <el-rate
            v-model="cm1[1]"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value} 顆星"
          />
        </div>
        <div class="card-body">{{ formatDate(cm1[5]) }}</div>
        <div class="card-body">{{ cm1[3] }}</div>
        <div class="card-body">
          <div class="demo-image__preview">
            <el-image
              style="width: 100px; height: 100px"
              :src="cm1[4]"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[cm1[4]]"
              :initial-index="4"
              fit="cover"
            />
          </div>
        </div>
      </div> -->
    </el-tab-pane>
    <el-tab-pane label="商品描述" v-if="productpage.length">
      {{ productpage[0].productDescription }}
    </el-tab-pane>
  </el-tabs>
  <!-- ----------以上是新的------------ -->
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      productpage: [],
      productId: "",
      quantity: 1,
      isHeartFilled: false,
      collection: "",
      comment: [],
      comment5: [],
      comment4: [],
      // comment3: [],
      // comment2: [],
      // comment1: [],
    };
  },
  mounted() {
    const productId = this.$route.params.productId;
    axios.get(`${this.API_URL}/productPage/${productId}`).then((response) => {
      console.log(response.data);
      this.productpage = response.data;
      this.productId = productId;
    });
    //檢查愛心
    axios.get(`${this.API_URL}/checkCollect/${productId}`).then((response) => {
      // console.log(response.data);
      this.collection = response.data;
      //當isHeartFilled為true的時候是填滿的
      this.isHeartFilled = this.collection === 1;
    });
    //評論Data(全部)
    axios
      .get(`${this.API_URL}/findAllComment/${productId}`)
      .then((response) => {
        // console.log(response.data);
        this.comment = response.data;
        // console.log(this.comment[0][3]);
      });
    //評論Data(五顆星)
    axios
      .get(`${this.API_URL}/findAllCommentAndStar/${productId}/5`)
      .then((response) => {
        // console.log(response.data);
        this.comment5 = response.data;
      });
    //評論Data(四顆星)
    axios
      .get(`${this.API_URL}/findAllCommentAndStar/${productId}/4`)
      .then((response) => {
        console.log(response.data);
        this.comment4 = response.data;
      });
    //評論Data(三顆星)
    // axios
    //   .get(`${this.API_URL}/findAllCommentAndStar/${productId}/3`)
    //   .then((response) => {
    //     console.log(response.data);
    //     this.comment3 = response.data;
    //   });
    //評論Data(二顆星)
    // axios
    //   .get(`${this.API_URL}/findAllCommentAndStar/${productId}/2`)
    //   .then((response) => {
    //     console.log(response.data);
    //     this.comment2 = response.data;
    //   });
    //評論Data(一顆星)
    // axios
    //   .get(`${this.API_URL}/findAllCommentAndStar/${productId}/1`)
    //   .then((response) => {
    //     console.log(response.data);
    //     this.comment1 = response.data;
    //   });
  },
  methods: {
    //日期格式修改(新)
    formatDate(isoDateString) {
      const date = new Date(isoDateString);
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleString("zh-CN", options);
    },
    //加入購物車
    pageAddToCart() {
      console.log(this.quantity);
      axios
        .post(
          `http://localhost:8080/totalAddToCart/add/${this.productId}?quantity=${this.quantity}`
        )
        .then((response) => {
          console.log("已成功加入購物車！");
        })
        .catch((error) => {
          window.location.href = "http://localhost:5173/login";
        });
    },
    //數字鍵
    decrementQuantity() {
      if (this.quantity > 0) {
        this.quantity -= 1;
      }
    },
    //數字鍵
    incrementQuantity() {
      this.quantity += 1;
    },
    //數字鍵
    updateQuantity(event) {
      // 更新 quantity 的值
      this.quantity = parseInt(event.target.value);
    },
    //加入愛心
    addToCollect() {
      axios
        .post(`http://localhost:8080/addCollect/${this.productId}`)
        .then((response) => {
          if (response.data.collect === 1) {
            console.log("已成功加入收藏！");
            this.isHeartFilled = !this.isHeartFilled;
          }
          if (response.data.collect === 2) {
            //這個其實不用(上面有條件判斷式)
            console.error("加入收藏時發生錯誤：返回值為2"); // 處理空返回值為2的情況
          }
        })
        .catch((error) => {
          console.error("未登入", error); // 處理錯誤
          window.location.href = "http://localhost:5173/login";
        });
    },
    deleteToCollect() {
      axios
        .post(`http://localhost:8080/deleteCollect/${this.productId}`)
        .then((response) => {
          console.log("已成功刪除收藏！"); // 處理後端回應
          this.isHeartFilled = !this.isHeartFilled;
        })
        .catch((error) => {
          console.error("刪除收藏時發生錯誤：", error); // 處理錯誤
          const errorMessage = error.response.data.message;
          if (errorMessage === "未登入錯誤") {
            window.location.href = "http://localhost:5173/login";
          }
          //下面這個其實不用(上面有條件判斷式)
          if (errorMessage === "沒有可刪除的收藏") {
            console.log(errorMessage);
          }
        });
    },
  },
};
</script>

<style>
/* 愛心:讓滑鼠移到該元素時顯示手指頭指標 */
.pointer-cursor {
  cursor: pointer;
}
/* 設置愛心 */
.filled-heart {
  fill: red;
}
/* 標題的CSS */
.product-details-container {
  padding: 20px;
}

.product-info {
  display: flex;
}

.product-img {
  width: 95%; /* 設置圖片的寬度為其父元素的寬度 */
  height: 100%; /* 設置圖片的高度為其父元素的高度 */
  /* 讓圖片填滿整個容器 */
  object-fit: cover;
}

.product-image {
  width: 65%; /* 設置圖片區域寬度為頁面的一半 */
  overflow: hidden;
}

.product-details {
  padding-left: 0px;
}

.product-name {
  font-size: 50px;
  font-weight: bold;
  margin-top: 20px;
}

.product-price {
  font-size: 50px;
  /* margin-bottom: 10px; */
}
/* 數量鍵的CSS */
.quantity-input {
  width: 30%; /* 设置输入框的宽度 */
  height: 45px; /* 设置输入框的高度 */
}
/* 購物車按鈕CSS */
.add-to-cart-button {
  padding: 10px 60px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  margin-top: 5%;
}
/* 彈出視窗 */
.modal-body {
  text-align: center;
}
/* 輪播2版 */
#cont {
  width: 400px;
  height: 300px;
  overflow: hidden;
}
#photo {
  width: 1200px;
  animation: switch 5s ease-out infinite;
}
#photo > img {
  float: left;
  width: 400px;
  height: 300px;
}
@keyframes switch {
  0%,
  25% {
    margin-left: 0;
  }
  35%,
  60% {
    margin-left: -400px;
  }
  70%,
  100% {
    margin-left: -800px;
  }
}
</style>
