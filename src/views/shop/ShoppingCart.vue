<template>
  <main class="h-100">
    <div class="container h-100 py-5">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-11">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h3 class="fw-normal mb-0 text-black">購物車</h3>
            <div>
              排序：<select v-model="sortBy" @change="sortCart">
                <option>價格低至高</option>
                <option>價格高至低</option>
              </select>
            </div>
          </div>
          <!-- 列頭 -->
          <!-- ------------------------- -->
          <!-- <div class="card rounded-3 mb-2" v-if="carts.length > 0"> -->
          <!-- <div class="card-body p-4" v-if="carts.length > 0"> -->
          <!-- ------------------------- -->
          <div class="card rounded-3 mb-2">
            <div class="card-body p-4">
              <div
                class="row d-flex justify-content-between align-items-center"
              >
                <!-- 商品 -->
                <div class="col-md-2 col-lg-2 col-xl-2">
                  <h5 class="mb-0 text-center">商品</h5>
                </div>
                <!-- 數量與總計 -->
                <div class="col-md-8 col-lg-8 col-xl-8">
                  <div class="row d-flex justify-content-between">
                    <div class="col-md-4 col-lg-4 col-xl-4 offset-md-1">
                      <h5 class="mb-0 text-center">數量</h5>
                    </div>
                    <div class="col-md-4 col-lg-4 col-xl-4">
                      <h5 class="mb-0 text-center">總計</h5>
                    </div>
                    <div class="col-md-3 col-lg-3 col-xl-2 text-end">
                      <h5 class="mb-0 text-center">操作</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 空狀態 -->
          <el-empty
            description="購物車沒商品嘍！"
            :image-size="200"
            v-if="carts === null || carts.length === 0"
          >
            <router-link to="/shop/shopPage">
              <el-button type="primary">商城</el-button>
            </router-link>
          </el-empty>
          <!-- 空狀態 -->
          <!-- 列頭 -->
          <div class="card rounded-3 mb-4">
            <!-- v-for綁定 -->
            <div class="card-body p-4" v-for="c in carts" :key="c.productId">
              <div
                class="row d-flex justify-content-between align-items-center"
              >
                <div class="col-md-2 col-lg-2 col-xl-2">
                  <!--圖片處理-->
                  <img :src="c.imgPath[0]" class="w-100" />
                </div>
                <div class="col-md-3 col-lg-3 col-xl-3">
                  <p class="lead fw-normal mb-2 fs-5">
                    {{ c.productName }}
                  </p>
                </div>
                <!-- 加減 -->
                <div class="col-md-3 col-lg-3 col-xl-2">
                  <div class="d-flex">
                    <button
                      class="btn btn-link px-2"
                      onclick="this.parentNode.querySelector('input[type=number]').stepDown()"
                      @click="decrementQuantity(c)"
                    >
                      <i class="fas fa-minus"></i>
                    </button>

                    <input
                      min="0"
                      name="quantity"
                      :value="c.quantity"
                      type="number"
                      class="form-control form-control-sm"
                    />

                    <button
                      class="btn btn-link px-2"
                      onclick="this.parentNode.querySelector('input[type=number]').stepUp()"
                      @click="incrementQuantity(c)"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <!-- 加減 -->
                <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                  <h5 class="mb-0">{{ totalPrice(c) }}</h5>
                </div>
                <!-- 刪除按鈕 -->
                <div class="col-md-1 col-lg-1 col-xl-1">
                  <div class="text-start">
                    <a
                      href="#!"
                      class="text-danger"
                      @click="deleteToCart(c.productId)"
                    >
                      <i class="fas fa-trash fa-lg"></i>
                    </a>
                  </div>
                </div>
                <!-- 刪除按鈕 -->
              </div>
              <!-- 彈出視窗 -->
              <div
                class="modal fade"
                id="exampleModal"
                tabindex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="exampleModalLabel">
                        LinePay支付
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      <div class="image-container">
                        <img
                          src="https://timgm.eprice.com.tw/tw/mobile/img/2018-09/08/5127108/fsu2913_1_babc65f86a710b4f1097172a4542193f.jpg"
                          class="modal-image"
                        />
                      </div>
                      <div class="totalcartprice">
                        總金額: ${{ totalCartPrice }}
                      </div>
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
                        @click.native="
                          linePay(totalCartPrice);
                          deleteAllCart();
                        "
                      >
                        <!-- linePay(totalCartPrice); -->
                        <!-- lineConfirm(totalCartPrice); -->
                        結帳
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 彈出視窗 -->
            </div>
          </div>
          <!-- 下訂單按鈕 -->
          <div class="card">
            <div class="card-body text-center">
              <div class="checkout-container">
                <div class="total-price">總金額: ${{ totalCartPrice }}</div>
                <button
                  type="button"
                  class="btn btn-warning btn-block btn-lg"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  @click="sendCartToBackend(totalCartPrice)"
                >
                  <!-- @click="sendCartToBackend(totalCartPrice)" -->
                  下訂單
                </button>
              </div>
              <!-- 下訂單按鈕 -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      carts: [],
      sortBy: "價格低至高", // 添加 sortBy 變量來存儲排序方式
      // redirectUrl: "",
    };
  },
  mounted() {
    axios.get(`${this.API_URL}/cart`).then((rs) => {
      //console.log(rs.data); //打印確認資料有傳送到
      //console.log(rs.data[0].productName); //打印確認資料有傳送到
      this.carts = rs.data;
    });
  },
  methods: {
    //排序
    sortCart() {
      if (this.sortBy === "價格低至高") {
        this.carts.sort((a, b) => a.unitPrice - b.unitPrice);
      } else if (this.sortBy === "價格高至低") {
        this.carts.sort((a, b) => b.unitPrice - a.unitPrice);
      }
    },
    //減少商品數量
    decrementQuantity(product) {
      if (product.quantity > 0) {
        product.quantity--;
      }
    },
    //增加商品數量
    incrementQuantity(product) {
      product.quantity++;
    },
    //購物車刪除事件
    deleteToCart(productId) {
      axios
        .post(`http://localhost:8080/product/delete/${productId}`)
        .then((response) => {
          console.log("已成功刪除購物車商品！"); // 處理後端回應
          this.carts = this.carts.filter(
            (product) => product.productId !== productId
          );
        })
        .catch((error) => {
          console.error("刪除購物車時發生錯誤：", error); // 處理錯誤
        });
    },
    //結帳時刪除所有購物車商品
    deleteAllCart() {
      axios
        .post(`http://localhost:8080/product/deleteByUser`)
        .then((response) => {
          console.log("已成功刪除購物車商品！"); // 處理後端回應
        })
        .catch((error) => {
          console.error("刪除購物車時發生錯誤：", error); // 處理錯誤
        });
    },
    // linepay傳入一個totalCartPrice的參數到後端
    linePay(totalCartPrice) {
      console.log(totalCartPrice);
      // 打包要傳遞的參數
      const data = {
        totalCartPrice: totalCartPrice,
      };
      axios
        .post(`http://localhost:8080/linepay/${totalCartPrice}`)
        .then((response) => {
          // this.redirectUrl = response.data; // 將redirectUrl儲存在组件的數據属性中
          const redirectUrl = response.data;
          window.location.href = redirectUrl;
        })
        .catch((error) => {
          console.error("結帳時發生錯誤：", error);
        });
    },
    // linepay請款
    lineConfirm(totalCartPrice) {
      const data = {
        totalCartPrice: totalCartPrice,
      };
      setTimeout(() => {
        axios
          .post(`http://localhost:8080/confirm/${totalCartPrice}`)
          .then((response) => {
            console.log("確認請求已發送");
            console.log(this.redirectUrl);
            window.location.href = this.redirectUrl;
          })
          .catch((error) => {
            console.error("結帳時發生錯誤：", error);
          });
      }, 10000); // 10 秒延遲
    },
    //傳送購物車的訂單到後端
    sendCartToBackend(totalCartPrice) {
      //`http://localhost:8080/order/${totalCartPrice}`這個要用反引號
      const backendEndpoint = `http://localhost:8080/order/${totalCartPrice}`;
      // 將 this.carts 資料轉換為 JSON 字串，this.carts本來是proxy格式
      const jsonData = JSON.stringify(this.carts);
      // const jsonData = JSON.stringify({
      //   carts: this.carts, // 將購物車資料加入到要傳送的 JSON 物件中
      //   totalPrice: this.totalCartPrice, // 添加 totalCartPrice 到要傳送的 JSON 物件中
      // });
      axios
        .post(backendEndpoint, jsonData, {
          headers: {
            "Content-Type": "application/json", // 設定請求標頭為 JSON
          },
        })
        .then((response) => {
          console.log("購物車資料已成功發送到後端");
          console.log(jsonData);
        })
        .catch((error) => {
          console.error("發送購物車資料到後端時發生錯誤：", error);
          window.location.href = "http://localhost:5173/login";
          console.log(jsonData);
        });
    },
  },
  computed: {
    totalPrice() {
      return (product) => product.unitPrice * product.quantity;
    },
    //計算購物車總金額
    totalCartPrice() {
      return this.carts
        .reduce((total, product) => {
          return total + product.unitPrice * product.quantity;
        }, 0)
        .toFixed(0); // 四捨五入到沒有小數
    },
  },
};
</script>
<style>
/* 讓頁面離footer為0 */
main.h-100 {
  background-color: #eee;
  min-height: calc(100vh - 0px);
  margin-bottom: 0;
}
/* 結帳按鈕效果 */
.checkout-container {
  display: flex;
  justify-content: flex-end; /* 將內容靠右排列 */
  align-items: center; /* 垂直居中 */
}

.total-price {
  font-size: 1.5rem; /* 調整字體大小 */
  color: #ff6b6b; /* 調整顏色 */
  font-weight: bold; /* 加粗字體 */
  margin-right: 20px; /* 距離結帳按鈕的間距 */
}
/* 結帳照片 */
.image-container {
  text-align: center; /* 圖片居中 */
}

.modal-image {
  max-width: 100%; /* 圖片最大寬度為父元素寬度 */
  height: auto; /* 高度自適應 */
  border-radius: 8px; /* 圖片邊角圓角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 圖片陰影 */
}

.totalcartprice {
  text-align: center; /* 文字居中 */
  font-size: 1.5rem; /* 字體大小 */
  color: #333; /* 字體顏色 */
  margin-top: 10px; /* 上邊距 */
}
</style>
