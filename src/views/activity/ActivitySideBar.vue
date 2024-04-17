<template>
  <div>
    <sidebar-menu :menu="menu" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      menu: [
        {
          header: "Main Service",
          hiddenOnCollapse: true,
        },
        {
          href: "/activity/all",
          title: "寵活動",
          icon: "fa-solid fa-seedling",
          child: [
            {
              href: "/activity/holdingActs",
              title: "現在活動",
            },
            {
              href: "/activity/pastActs",
              title: "過去活動",
            },
            {
              href: "/activity/all",
              title: "所有活動",
            },
          ],
        },
        {
          href: "/activity/venuesIntro",
          title: "場地租借",
          icon: "fa fa-chart-area",
          child: [
            {
              href: "/activity/venuesIntro",
              title: "場地介紹",
            },
            {
              href: "/activity/venueRental",
              title: "租借場地",
            },
            {
              href: "/activity/myVenuesRental",
              title: "我的租借",
            },
          ],
        },
        {
          href: "/activity/myJoinedManager",
          title: "我的活動",
          icon: "fa fa-user",
          child: [
            {
              href: "/activity/myJoinedManager",
              title: "報名中",
            },
            {
              href: "/activity/myPastJoinedManager",
              title: "過去參加",
            },
            {
              href: "/charts/sublink",
              title: "我的收藏",
            },
          ],
        },
      ],
    };
  },
};
</script>

<style></style>
