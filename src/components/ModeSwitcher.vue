<template>
  <button @click="toggleDarkMode">
    {{ darkMode ? "Light Mode" : "Dark Mode" }}
  </button>
</template>

<script>
export default {
  data() {
    return {
      darkMode: JSON.parse(localStorage.getItem("darkMode")) || false,
    };
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("darkMode", JSON.stringify(this.darkMode));
      }

      document.body.classList.toggle("dark-mode", this.darkMode);
    },
  },

  mounted() {
    if (this.darkMode) {
      document.body.classList.toggle("dark-mode", this.darkMode);
    }
  },
};
</script>

<style>
body {
  transition: background-color 0.2s ease;
}
</style>
