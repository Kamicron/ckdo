<script>
import { RouterLink, RouterView } from 'vue-router'
import ModeSwitcher from './components/ModeSwitcher.vue';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js'

export default {
  data() {
    return {
      user: {
        email: null,
        password: null
      },
      message: JSON.parse(localStorage.getItem("message")) || null,
      connected: JSON.parse(localStorage.getItem("connected")) || false,
      userid: null,
    }
  },
  methods: {
    OnCnx() {
      signInWithEmailAndPassword(getAuth(), this.user.email, this.user.password)
        .then((response) => {
          this.userid = response.user.uid;
          localStorage.setItem("userid", JSON.stringify(this.userid));

          this.user = response.user;
          this.message = "Utilsateur connecté : " + this.user.email;
          localStorage.setItem("message", JSON.stringify(this.message));

          this.connected = true;
          localStorage.setItem("connected", JSON.stringify(this.connected));

        })
        .catch((error) => {
          this.message = "Erreur de connexion";
          this.connected = false;
          localStorage.setItem("connected", JSON.stringify(this.connected));
          localStorage.setItem("message", JSON.stringify(this.message));
        })
    }
  },
  mounted() {
  },
  components: {
    RouterLink,
    RouterView,
    ModeSwitcher
  }
};


</script>

<template>
  <header>
    <nav class="header_menu">
      <div class="flexbox">
        <transition name="fade">
          <ModeSwitcher />
        </transition>
        <ul class="header_menu-list">
          <li class="header_menu-item">
            <RouterLink to="/">Acceuil</RouterLink>
          </li>
          <li v-if="connected" class="header_menu-item">
            <RouterLink to="/whishlist">Liste de voeux</RouterLink>
          </li>
        </ul>
        <div>
          <form @submit.prevent="OnCnx()">
            <div v-if="!connected" class="input-group mb-3">
              <input type="text" class="form-control" placeholder='votre email' v-model="user.email" required>
            </div>
            <div v-if="!connected" class="input-group mb-3">
              <input type="password" class="form-control" placeholder='votre mot de passe' v-model="user.password"
                required>
            </div>
            <div class="alert alert-warning text-center mb-3" v-if="message != null">
              {{ message }}
            </div>
            <button v-if="connected" class="float-left" @click="OnDcnx()">
              Deconnexion
            </button>
            <button v-if="!connected" class="float-right" variant="dark" type="submit">Connexion</button>
          </form>

        </div>

      </div>



    </nav>

    <RouterView />
  </header>
</template>

<style scoped>
.header_menu {
  background-color: var(--second-color);
}

.header_menu-list {
  display: flex;
  list-style-type: none;
  justify-content: right;
  margin: 0 10%;

}

.header_menu-item {
  padding: 10px;
  font-size: 1.5rem;
  color: var(--main-white_color);
}

a {
  text-decoration: none;
  color: var(--main-white_color);
  position: relative;
}

a::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 4px;
  background-color: var(--dynamic-color);
  transition: width .3s ease;
}

a:hover::after {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
