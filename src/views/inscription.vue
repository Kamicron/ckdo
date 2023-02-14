<template>
  <div>
    <form @submit.prevent="signUp">
      <input type="email" v-model="email" placeholder="Email">
      <input type="password" v-model="password" placeholder="Password">
      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>
<script>
import firebase from "firebase/app";


import "firebase/auth";

export default {
  name: "Inscription",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    async signUp() {
      try {
        await firebase.auth().createUserWithEmailAndPassword(this.email, this.password);
        this.$router.push("/");
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>