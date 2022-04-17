<template>
  <header class="header">
    <div class="inner">
      <h1 class="logo" @click="reset">DICTIONARY</h1>
      <label class="search-field" for="search">
        <input
          class="search"
          type="text"
          v-model="searchText"
          @keydown.enter="search"
          placeholder="Search"
          id="search"
        />
        <span class="search-delete" @click="deleteText"></span>
      </label>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      searchText: "",
    };
  },
  mounted() {
    document.getElementById("search").focus();
  },
  methods: {
    search() {
      this.$emit("search", this.searchText);
    },
    reset() {
      this.$emit("reset");
      this.searchText = "";
    },
    deleteText() {
      this.searchText = "";
    },
    setSearch(word) {
      this.searchText = word;
    },
  },
};
</script>

<style lang="scss">
.header {
  background-color: #f6f2f3;
  border-bottom: 1px solid #d9d9d9;
  .inner {
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.logo {
  font-size: 32px;
  cursor: pointer;
}
.search-field {
  display: block;
  position: relative;
  margin-left: auto;
  margin-right: 0;
  width: 300px;
  height: 35px;
  &::before {
    content: "";
    display: inline-block;
    background-image: url("~@/assets/images/glass.svg");
    background-repeat: no-repeat;
    background-size: 16px;
    width: 16px;
    height: 16px;
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
  }
  .search {
    border: 2px solid #eae6e7;
    background-color: transparent;
    border-radius: 10px;
    width: 100%;
    padding-top: 2px;
    padding-bottom: 2px;
    padding-right: 38px;
    padding-left: 38px;
    font-size: 18px;
    &::placeholder {
      color: #aba9aa;
    }
  }
  .search-delete {
    cursor: pointer;
    background-image: url("~@/assets/images/delete.svg");
    background-repeat: no-repeat;
    background-size: 15px;
    display: inline-block;
    width: 15px;
    height: 15px;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.85;
  }
}
@media (max-width: 768px) {
  .header .inner {
    flex-direction: column;
  }
  .logo {
    font-size: 26px;
    line-height: 1;
    margin-bottom: 8px;
  }
  .search-field {
    width: 100%;
  }
}
</style>
