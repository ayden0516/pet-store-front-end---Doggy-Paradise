<template>
  <!-- <div class="app-container"> -->
  <main>
    <div class="container mb-3">
      <div class="row align-items-center text-center">
        <div class="col-1">
          <label for="inputPassword6" class="col-form-label">商品名稱</label>
        </div>
        <div class="col-4">
          <input
            type="text"
            class="form-control"
            v-model="name"
            @keydown.enter="findProducts"
          />
          <!-- @keydown.enter="fetchProducts"按Enter也行 -->
        </div>

        <!-- <div class="col-1">
            <label for="inputPassword6" class="col-form-label">價格</label>
          </div> -->
        <!-- <div class="col-2">
            <input
              type="number"
              class="form-control"
              placeholder="最小值"
              min="0"
            />
          </div> -->
        <!-- <div class="col-2">
            <input
              type="number"
              class="form-control"
              placeholder="最大值"
              min="0"
            />
          </div> -->
        <div class="col-1">
          <button class="btn btn-primary" @click="findProducts()">查詢</button>
        </div>
        <!-- <div class="col-6">
            排序：<select v-model="sortBy" @change="sortCart">
              <option>價格低至高</option>
              <option>價格高至低</option>
            </select>
          </div> -->
        <div class="col-3">
          <label for="sortSelect" class="form-label"></label>
          <select
            v-model="sortBy"
            @change="sortCart"
            id="sortSelect"
            class="form-select"
          >
            <option value="價格低至高">價格低至高</option>
            <option value="價格高至低">價格高至低</option>
          </select>
        </div>
      </div>
    </div>
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
              <!--圖片處理-->
              <!-- src="https://pets-zakka.com/wp-content/uploads/2022/05/deal-with-hot.jpg" -->
              <img :src="p.imgPath[0]" class="w-100 fixed-size-img" />
              <!--圖片處理-->
              <p class="card-text mt-2 px-3 text-truncate">
                {{ p.productName }}
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="m-3">價格:{{ p.unitPrice }}</div>
                <!-- 彈出視窗 -->
                <!-- :id="'exampleModal_' + p.productId"將模態的 id 設置為基於商品的 productId -->
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
                    <!-- :data-bs-target="'#exampleModal_' + p.productId"設置目標模態的 id 為基於商品的 productId -->
                    <i class="fa-solid fa-cart-plus"></i>
                  </button>
                </div>
                <!-- 購物車按鈕 -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 輪播 -->
    <!-- <div class="carousel-container">
            <div
              id="carouselExampleSlidesOnly"
              class="carousel slide fixed-carousel-size"
              data-bs-ride="carousel"
            >
              <div class="carousel-inner">
                <div class="carousel-item active">
                  <img
                    src="https://cdn2.ettoday.net/images/5550/5550904.jpg"
                    class="d-block w-100 fixed-size-image"
                    alt="First slide"
                  />
                </div>
              </div>
            </div>
          </div> -->
    <!-- ----------------- -->
    <!-- 輪播 -->
    <div>
      <div
        id="carouselExampleSlidesOnly"
        class="carousel slide fixed-carousel-size"
        data-bs-ride="carousel"
      >
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img
              src="https://resource02.ulifestyle.com.hk/ulcms/content/article/image/w600/2023/10/20231018172402_4d0569666ba05e8c6dccb0a258d42f53c4d9f130.jpg"
              class="d-block w-100 fixed-size-image"
              alt="First slide"
            />
          </div>
          <div class="carousel-item">
            <img
              src="https://today-obs.line-scdn.net/0hLRSCSg4cE31uOgeSWrVsKlZsHwxdXAl0TA8JSUhtTx1BFlAiU1VAHk5tS1FKClx4TlsPSE9tSx8RCQB4Ag/w644"
              class="d-block w-100 fixed-size-image"
              alt="Second slide"
            />
          </div>
          <div class="carousel-item">
            <img
              src="https://as.chdev.tw/web/article/b/0/4/b1814323-0790-4b70-a3b1-6cbc87d37d1f/A0951614.jpg"
              class="d-block w-100 fixed-size-image"
              alt="Third slide"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 輪播 -->
  </main>
  <!-- </div> -->
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "", //關鍵字搜尋
      sortBy: "價格低至高", // 添加 sortBy 變量來存儲排序方式
      currentPage: 0,
      totalPage: 0,
      products: [],
    };
  },
  mounted() {
    // lineConfirm(totalCartPrice) {
    //   console.log(totalCartPrice);
    //   const data = {
    //     totalCartPrice: totalCartPrice,
    //   };
    //   axios
    //     .post(`http://localhost:8080/confirm/${totalCartPrice}`)
    //     .then((response) => {
    //       const redirectUrl = response.data;
    //       window.location.href = redirectUrl;
    //     })
    //     .catch((error) => {
    //       console.error("結帳時發生錯誤：", error);
    //     });
    // },
    // 傳入一個totalCartPrice的參數到後端(請款)
    // lineConfirm(totalCartPrice) {
    //   const data = {
    //     totalCartPrice: totalCartPrice,
    //   };
    //   // 延遲 15 秒後執行 API 請求
    //   setTimeout(() => {
    //     axios
    //       .post(`http://localhost:8080/confirm/${totalCartPrice}`)
    //       .then((response) => {
    //         const redirectUrl = response.data;
    //         window.location.href = redirectUrl;
    //       })
    //       .catch((error) => {
    //         console.error("結帳時發生錯誤：", error);
    //       });
    //   }, 30000); // 15 秒延遲
    // },
  },
  computed: {
    //分頁處理showPageBar
    // showPageBar() {
    //   const cp = this.currentPage;
    //   const tp = this.totalPage - 1;
    //   let arr = [1];
    //   // if (cp > 4) {
    //   //   arr.push("...");
    //   // }
    //   for (let i = cp - 2; i <= cp + 2; i++) {
    //     if (i > 1 && i < tp) {
    //       arr.push(i);
    //     }
    //   }
    //   // if (cp < tp - 3) {
    //   //   arr.push("...");
    //   // }
    //   arr.push(tp);
    //   return arr;
    // },
  },
  methods: {},
  watch: {
    // 綁定頁碼與商品頁面
    // currentPage(newVal, oldVal) {
    //   axios.get(`${this.API_URL}/products/${newVal}`).then((rs) => {
    //     this.totalPage = rs.data.totalPages;
    //     this.products = rs.data.content;
    //   });
    // },
  },
};
</script>
<style>
/* 數量鍵的CSS */
.quantity-input input[type="number"] {
  text-align: center; /* 将输入框中的数字置中 */
}
/* 商品名稱的樣式 */
.modal-body h5 {
  font-size: 24px;
  margin-top: 0;
}
/* 商品價格的樣式 */
/* .modal-body p {
  font-size: 18px;
  color: #888;
  margin-bottom: 20px;
} */
/* 橫線下面的區塊(對應class="py-1 custom-bg-color") */
.custom-bg-color {
  background-color: #fff8d7;
}
</style>
