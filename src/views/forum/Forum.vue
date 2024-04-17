<template>
  <main>
    <div class="container mb-3">
      <div class="row align-items-center text-center">
        <div class="col-1">
          <label for="inputPassword6" class="col-form-label">文章名稱：</label>
        </div>
        <div class="col-4">
          <input type="text" class="form-control" />
        </div>

        <div class="col-1">
          <label for="inputPassword6" class="col-form-label">文章種類：</label>
        </div>
        <div class="col-2">
          <select>
            <option selected="selected" value="1">綜合討論</option>
            <option value="2">飼養心得</option>
            <option value="3">疑難雜症</option>
          </select>
        </div>
        <div class="col-2">
          <button @click="loadArticles" class="btn btn-primary">查詢</button>
        </div>
      </div>
    </div>
    <hr />
    <div class="py-1 bg-light">
      <div class="container">
        <div class="row">
          <div class="col">
            <ul class="pagination justify-content-center">
              <li class="page-item">
                <button class="page-link">
                  <span>&laquo;</span>
                </button>
              </li>
              <li
                class="page-item"
                v-for="p of showPageBar"
                @click="goToPage(p)"
                :class="{ active: p == currentPage }"
              >
                <button class="page-link">{{ p }}</button>
              </li>

              <li class="page-item">
                <button class="page-link">
                  <span>&raquo;</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 text-center">
      <div class="col" v-for="a in articles" :key="a.articleId">
        <div class="card shadow-sm">
          <p class="card-text mt-2 px-3 text-truncate">
            {{ a.articleTitle }}
          </p>
          <p>{{ a.userName }}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="m-3">
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary m-2"
              >
                <i class="fa-solid fa-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 text-center">
      <tr class="b-list__row">
        <td class="b-list__summary">
          <a name="{{a.articleId}}"></a>
          <p class="b-list__summary__sort">
            <a>{{}}</a>
          </p>
          <span class="b-list__summary__gp b-gp b-gp--best">2728</span>
          <div
            title="精華"
            class="b-list__summary__mark b-mark b-mark--feature"
          >
            <i class="material-icons feature"></i>
          </div>
        </td>
        <td class="b-list__main">
          <a
            data-gtm="B頁文章列表-清單"
            href="C.php?bsn=23805&amp;snA=610529&amp;tnum=19796"
            class="b-list__main__title"
            >【討論】神魔問答室 ಠ_ಠ</a
          ><span class="b-list__main__pages"
            ><a
              data-gtm="B頁文章列表-清單"
              href="C.php?bsn=23805&amp;snA=610529&amp;tnum=19796&amp;page=988"
              >988</a
            ><a
              data-gtm="B頁文章列表-清單"
              href="C.php?bsn=23805&amp;snA=610529&amp;tnum=19796&amp;page=989"
              >989</a
            ><a
              data-gtm="B頁文章列表-清單"
              href="C.php?bsn=23805&amp;snA=610529&amp;tnum=19796&amp;page=990"
              >990</a
            ></span
          >
        </td>
        <td class="b-list__count">
          <p class="b-list__count__number">
            <span title="互動：20,147">20147</span>/
            <span title="人氣：5,776,749">5776749</span>
          </p>
          <p class="b-list__count__user">
            <a href="https://home.gamer.com.tw/Sheep1219" target="_blank"
              >Sheep1219</a
            >
          </p>
        </td>
        <td class="b-list__time">
          <p class="b-list__time__edittime">
            <a
              data-gtm="B頁文章列表-清單"
              title="觀看最新回覆文章"
              href="C.php?bsn=23805&amp;snA=610529&amp;tnum=19796&amp;last=1"
              >1 小時前</a
            >
          </p>
          <p class="b-list__time__user">
            <a href="https://home.gamer.com.tw/king22332233" target="_blank"
              >king22332233</a
            >
          </p>
        </td>
      </tr>
    </div> -->
  </main>
</template>
<script>
import axios from "axios";
import { useMemberStore } from "@/stores/memberStore";
export default {
  data() {
    return {
      currentPage: 1,
      totalPage: 0,
      articles: [],
      category: [],
    };
  },
  methods: {
    goToPage(p) {
      if (p != "...") {
        this.currentPage = p;
        console.log(this.currentPage);
      }
    },
    loadArticles() {
      axios.get(`${this.API_URL}/forum/${this.currentPage}`).then((re) => {
        this.totalPage = re.data.totalPages;
        this.articles = re.data.content;
        console.log(re.data);
      });
    },
    loadCategory() {
      axios.get(`${this.API_URL}/forum/category`).then((re) => {
        this.category = re.data.categoryName;
      });
    },
  },
  mounted() {
    axios.get(`${this.API_URL}/forum/${this.currentPage}`).then((re) => {
      this.currentPage = re.data.number;
      this.totalPage = re.data.totalPages;
      this.articles = re.data.content;
      console.log(re.data);
    });
  },
  computed: {
    showPageBar() {
      const cp = this.currentPage;
      const tp = this.totalPage - 1;
      let arr = [1];

      if (cp > 4) {
        arr.push("...");
      }

      for (let i = cp - 2; i <= cp + 2; i++) {
        if (i > 1 && i < tp) {
          arr.push(i);
        }
      }

      if (tp - cp > 3) {
        arr.push("...");
      }

      arr.push(tp);
      return arr;
    },
  },
  watch: {
    currentPage(newValue, oldValue) {
      this.loadArticles();
    },
  },
};
</script>
<style></style>
