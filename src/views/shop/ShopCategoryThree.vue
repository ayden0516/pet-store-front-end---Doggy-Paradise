<template>
  <main>
    <div class="custom-header">狗狗牽引繩</div>
    <hr />
    <div class="py-1 custom-bg-color">
      <!-- 上面這個是一個加顏色的區塊 -->
      <div class="container">
        <div class="row">
          <div class="col">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <button class="page-link">
                  <span>&laquo;</span>
                </button>
              </li>
              <!--分頁處理-->
              <!--@click="gotoPage(P)"綁定頁碼事件-->
              <li
                class="page-item"
                v-for="p of showPageBar"
                @click="goToPage(p)"
                :class="{ active: p == currentPage }"
              >
                <button class="page-link">{{ p }}</button>
              </li>
              <!--分頁處理-->
              <!--@click="gotoPage(P)"綁定頁碼事件-->
              <li class="page-item">
                <button class="page-link">
                  <span>&raquo;</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 text-center">
          <!-- v-for渲染 -->
          <div class="col" v-for="p in products" :key="p.productId">
            <div class="card shadow-sm">
              <!--圖片處理(當庫存為0的時候不能跳轉商品頁面)-->
              <!-- <router-link
                  :to="{ name: 'product', params: { productId: p.productId } }"
                >
                  <img :src="p.imgPath[0]" class="w-100 fixed-size-img" />
                </router-link> -->
              <div
                class="product-image-wrapper"
                :class="{ 'disabled-link': p.stock === 0 }"
              >
                <router-link
                  v-if="p.stock !== 0"
                  :to="{ name: 'product', params: { productId: p.productId } }"
                >
                  <img :src="p.imgPath[0]" class="w-100 fixed-size-img" />
                </router-link>
                <img v-else :src="p.imgPath[0]" class="w-100 fixed-size-img" />
              </div>
              <!--圖片處理-->
              <div
                class="card-text mt-2 px-3 text-truncate d-flex justify-content-between align-items-center"
              >
                <div>{{ p.productName }}</div>
                <div v-if="salesVolume[p.productId] !== undefined">
                  銷量: {{ salesVolume[p.productId] }}
                </div>
              </div>
              <!-- 庫存:{{ p.stock }} -->
              <div class="d-flex justify-content-between align-items-center">
                <div class="m-3">價格:{{ p.unitPrice }}</div>
                <!-- 彈出視窗 -->
                <div
                  class="modal fade"
                  :id="'exampleModal_' + p.productId"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                          購物車
                        </h5>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <h5>商品:{{ p.productName }}</h5>
                        <p>價格:{{ p.unitPrice }}</p>
                        <!-- 錯誤訊息 -->
                        <!-- <div
                            v-if="errorMessage"
                            class="alert alert-danger"
                            role="alert"
                          >
                            {{ errorMessage }}
                          </div> -->
                        <!-- 錯誤訊息 -->
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
                          @click="addToCart(p.productId)"
                          data-bs-dismiss="modal"
                        >
                          加入
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 彈出視窗 -->
                <!-- 購物車按鈕 -->
                <div class="m-3">
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary m-2"
                    data-bs-toggle="modal"
                    :data-bs-target="'#exampleModal_' + p.productId"
                  >
                    <i class="fa-solid fa-cart-plus text-danger"></i>
                  </button>
                </div>
                <!-- 購物車按鈕 -->
              </div>
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
      currentPage: 0,
      totalPage: 0,
      products: [],
      //   errorMessage: "", // 新增錯誤訊息變數
    };
  },
  mounted() {
    this.findProducts();
    this.fetchSalesVolume();
  },
  computed: {
    showPageBar() {
      const tp = this.totalPage;
      let arr = [];

      for (let i = 1; i <= tp; i++) {
        arr.push(i);
      }
      return arr;
    },
  },
  methods: {
    //商品列表
    findProducts() {
      axios.get(`${this.API_URL}/category/${this.currentPage}/3`).then((rs) => {
        this.currentPage = rs.data.number;
        this.totalPage = rs.data.totalPages;
        this.products = rs.data.content;
      });
    },
    //銷量
    fetchSalesVolume() {
      axios
        .get(`http://localhost:8080/orderDetail/salesVolume`)
        .then((response) => {
          console.log(response.data);
          // 將銷售數量數據轉換為物件，以便更輕鬆地通過產品ID訪問
          this.salesVolume = response.data.reduce((acc, curr) => {
            acc[curr[0]] = curr[1];
            return acc;
          }, {});
          // 如果某個產品ID在銷量數據中不存在，則設置一個默認值
          this.products.forEach((p) => {
            if (typeof this.salesVolume[p.productId] === "undefined") {
              this.$set(this.salesVolume, p.productId, 0); // 設置默認銷量為0
            }
          });
        })
        .catch((error) => {
          console.error("获取销售数量数据时发生错误：", error);
        });
    },
    //綁定頁碼點擊事件
    goToPage(p) {
      if (p == "...") {
        return;
      }
      this.currentPage = p - 1;
    },
    //購物車點擊事件
    addToCart(productId) {
      axios
        .post(`http://localhost:8080/totalAddToCart/add/${productId}`)
        .then((response) => {
          console.log("已成功加入購物車！");
          //   this.errorMessage = ""; // 清空錯誤訊息
        })
        .catch((error) => {
          console.error("加入購物車時發生錯誤：", error);
          //   this.errorMessage = "需登入才能加入購物車"; // 更新錯誤訊息
          window.location.href = "http://localhost:5173/login";
        });
    },
  },
  watch: {
    //綁定頁碼與商品頁面
    currentPage(newVal, oldVal) {
      axios.get(`${this.API_URL}/products/${newVal}`).then((rs) => {
        this.totalPage = rs.data.totalPages;
        this.products = rs.data.content;
      });
    },
  },
};
</script>
<style>
/* 將活動頁面按鈕的顏色設置為與非活動按鈕相同 */
.page-item.active .page-link {
  background-color: #fcfcfc; /* 將背景色設置為透明(這個重要) */
  border-color: #dee2e6; /* 設置與非活動按鈕相同的邊框顏色 */
  color: #212529; /* 設置與非活動按鈕相同的文字顏色 */
}
.page-link {
  font-size: 18px; /* 調整字體大小 */
  color: #333; /* 調整字體顏色 */
}
.custom-header {
  font-size: 36px; /* 調整標題文字大小 */
  font-weight: bold; /* 設置粗體 */
  text-align: left; /* 文字靠左對齊 */
  color: #007bff; /* 設置文字顏色為藍色 */
  margin-bottom: 20px; /* 底部間距 */
}
</style>
