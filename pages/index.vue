<template>
  <div id="root">
    <Header @search="search" ref="header" @reset="reset" />
    <Content :result="result" @search="search" />
  </div>
</template>

<script>
import Header from "../components/Header.vue";
import Content from "../components/Content.vue";
export default {
  components: { Header, Content },
  head() {
    return {
      meta: [{ hid: "robots", name: "robots", content: "noindex, nofollow" }],
    };
  },
  data() {
    return {
      result: {},
    };
  },
  mounted() {
    if (this.$route.query.s) {
      this.search(this.$route.query.s);
      this.$refs.header.setSearch(this.$route.query.s);
    }
  },
  methods: {
    search(searchText) {
      const result = this.$axios
        .$post("/", {
          params: {
            word: searchText,
          },
        })
        .then((res) => {
          this.result = res;
          window.history.pushState({}, "", `?s=${searchText}`);
        })
        .catch((err) => console.log(err));
    },
    reset() {
      this.result = {};
      window.history.pushState({}, "", "/");
    },
  },
};
</script>

<style>
.bold {
  font-weight: bold;
}
.italic {
  font-style: italic;
}
.clickable {
  cursor: pointer;
}
.clickable:hover {
  text-decoration: underline;
}
.inner {
  width: 1000px;
  margin-right: auto;
  margin-left: auto;
}
@media (max-width: 1000px) {
  .inner {
    width: 90%;
  }
}
</style>
