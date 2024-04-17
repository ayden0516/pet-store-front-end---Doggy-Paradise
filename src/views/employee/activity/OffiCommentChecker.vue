<template>
  <div>
    <div class="title">{{ chooseTitle }}</div>
    <div class="graphZone">
      <div class="fixChart">
        <canvas id="scoreChart" class="chart" width="400" height="300"></canvas>
      </div>
      <div class="fixChart">
        <canvas id="mixChart" class="chart" width="400" height="300"></canvas>
      </div>
    </div>
    <div class="commentZone">
      <div class="tablecontainer">
        <ul class="responsive-table">
          <li class="table-header">
            <div class="col col-1">User Id</div>
            <div class="col col-2">Name</div>
            <div class="col col-3">Score</div>
            <div class="col col-4">Comment</div>
            <div class="col col-5">Sort</div>
          </li>
          <li
            class="table-row"
            v-for="a in commentList"
            :key="commentList.userId"
          >
            <div class="col col-1" data-label="Id">{{ a.userId }}</div>
            <div class="col col-2" data-label="Name">{{ a.firstName }}</div>
            <div class="col col-3" data-label="score">{{ a.score }}</div>
            <div class="col col-4" data-label="comment">
              {{ a.commentText }}
            </div>
            <div
              class="col col-5"
              data-label="sort"
              style="color: green; font-weight: 700"
              v-if="a.checkResult.startsWith('正面')"
            >
              {{ a.checkResult }}
            </div>
            <div
              class="col col-5"
              data-label="sort"
              style="color: red; font-weight: 700"
              v-if="a.checkResult.startsWith('負面')"
            >
              {{ a.checkResult }}
            </div>
            <div
              class="col col-5"
              data-label="sort"
              style="color: blue; font-weight: 700"
              v-if="
                a.checkResult.startsWith('無') ||
                a.checkResult.startsWith('其他')
              "
            >
              {{ a.checkResult }}
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import Chart from "chart.js/auto";
import { onMounted, ref } from "vue";
import { useMemberStore } from "@/stores/memberStore";
export default {
  data() {
    return {
      activityId: null,
      commentList: [],
      chooseTitle: "",
    };
  },
  mounted() {
    // 使用 $route.params.activityId 取值
    this.activityId = this.$route.params.activityId;
    axios
      .get(
        `${this.API_URL}/activity/api/official/activityManager/past/commentList/${this.activityId}`
      )
      .then((rs) => {
        this.commentList = rs.data;
        console.log(this.commentList);
        this.chooseTitle = this.commentList[0].activityTitle;
      })
      .then((rs) => {
        this.loadStarGraph();
      })
      .then((rs) => {
        this.loadSortedGraph();
      })
      .catch((error) => {
        console.error(error);
      });
  },
  methods: {
    loadSortedGraph() {
      // 各個分類初始
      const categories = ["活動", "服務", "場地", "其他"];
      const positiveCounts = [0, 0, 0, 0];
      const negativeCounts = [0, 0, 0, 0];
      const scoreSum = [0, 0, 0, 0];
      const catTime = [0, 0, 0, 0];
      const scoreAverage = [0, 0, 0, 0];

      // 統計次數
      this.commentList.forEach((comment) => {
        let index = categories.indexOf(comment.checkResult.slice(-2));
        if (index !== -1) {
          if (comment.checkResult.startsWith("正面")) {
            positiveCounts[index]++;
          } else if (comment.checkResult.startsWith("負面")) {
            negativeCounts[index]++;
          }
        } else if (
          comment.checkResult === "無評論" ||
          comment.checkResult === "無相關分類"
        ) {
          // 自動歸類到其他中
          positiveCounts[3]++;
        }
      });
      // 統計分數及次數
      this.commentList.forEach((comment) => {
        let index = categories.indexOf(comment.checkResult.slice(-2));
        if (index !== -1) {
          if (comment.score) {
            scoreSum[index] += comment.score;
            catTime[index]++;
          }
        } else if (
          comment.checkResult === "無評論" ||
          comment.checkResult === "無相關分類"
        ) {
          // 自動歸類到其他中
          scoreSum[3] += comment.score;
          catTime[3]++;
        }
      });

      //取得平均
      for (let i = 0; i < catTime.length; i++) {
        if (scoreSum[i] !== 0) {
          scoreAverage[i] = scoreSum[i] / catTime[i];
        }
      }
      console.log(scoreAverage);

      // 放到圖中
      const ctx = document.getElementById("mixChart").getContext("2d");
      const mixChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: categories,
          datasets: [
            {
              label: "正面",
              data: positiveCounts,
              backgroundColor: "rgba(218, 215, 185, 0.2)", // 背景顏色
              borderColor: "rgba(218, 215, 185, 1)", //邊框顏色
              order: 1,
            },
            {
              label: "負面",
              data: negativeCounts,
              backgroundColor: "rgba(75, 129, 120, 0.2)",
              borderColor: "rgba(75, 129, 120, 1)",
              order: 2,
            },
            {
              label: "各項平均",
              data: scoreAverage,
              backgroundColor: "rgba(6, 36, 56, 0.2)",
              borderColor: "rgba(6, 36, 56, 1)",
              type: "line",
              order: 0,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true, // 從0開始
              ticks: { stepSize: 0.5 },
            },
          },
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "各分類正負面評論次數及格分類得分平均",
            },
          },
        },
      });
    },
    loadStarGraph() {
      //存放每一個分數的累計數量
      const scoreTemplate = [0, 0, 0, 0, 0];
      // 計算每一個分數的累計數量
      this.commentList.forEach((comment) => {
        if (comment.score >= 1 && comment.score <= 5) {
          scoreTemplate[comment.score - 1]++;
        }
      });
      console.log(scoreTemplate);
      // 抓canvas
      const ctx = document.getElementById("scoreChart").getContext("2d");

      // 創圖表
      const scoreChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["1", "2", "3", "4", "5"],
          datasets: [
            {
              label: "人數",
              data: scoreTemplate,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "客戶回饋評分統計",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 },
            },
          },
        },
      });
    },
  },
};
</script>
<style scoped>
.title {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 20px;
  font-weight: 700;
  font-size: larger;
}

.graphZone {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 40px;
}
.fixChart {
  width: 45%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  padding: 20px;
  border: 1px solid rgb(216, 215, 215);
  border-radius: 10px;
}

.tablecontainer {
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 10px;
  padding-right: 10px;
}

.responsive-table li {
  border-radius: 3px;
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}
.responsive-table .table-header {
  background-color: #95a5a6;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.responsive-table .table-row {
  background-color: #ffffff;
  box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.1);
}
.responsive-table .col-1 {
  flex-basis: 10%;
}
.responsive-table .col-2 {
  flex-basis: 10%;
}
.responsive-table .col-3 {
  flex-basis: 10%;
}
.responsive-table .col-4 {
  flex-basis: 60%;
}
.responsive-table .col-5 {
  flex-basis: 10%;
}
@media all and (max-width: 767px) {
  .responsive-table .table-header {
    display: none;
  }
  .responsive-table li {
    display: block;
  }
  .responsive-table .col {
    flex-basis: 100%;
  }
  .responsive-table .col {
    display: flex;
    padding: 10px 0;
  }
  .responsive-table .col:before {
    color: #6c7a89;
    padding-right: 10px;
    content: attr(data-label);
    flex-basis: 50%;
    text-align: right;
  }
}
</style>
