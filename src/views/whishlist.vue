<script>
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js'
// dans un autre fichier
import App from '@/App.vue';

export default {
  data() {
    return {
      listeCadeau: [],
      connected: JSON.parse(localStorage.getItem("connected")) || false,
    };
  },
  methods: {
    async getGift() {
      console.log("test");

      let test = this.currentUser;
      console.log("user id wish",  App.userid);
      const firestore = getFirestore();
      const dbGift = collection(firestore, "liste");
      const query = await getDocs(dbGift);
      query.forEach((doc) => {

        let gift = {

          name: doc.data().gift_name,
          url: doc.data().gift_url,
          user_id: doc.data().id_user,
        }
        // if ($id == user_id) {
          this.listeCadeau.push(gift);
        // }

      });

    }
  },
  mounted() {
    this.getGift();
  },
  computed: {
    userid() {
      return App.userid;
    }
  }
}
</script>

<template>
  <main v-if="connected">
    <div class="main_title">
      <h1>Liste de voeux</h1>
    </div>
    <div>
      <h2>Ajouter un voeux</h2>

    </div>
    <div>
      <h2>Lsite de veux</h2>
      <table>
        <tr>
          <th>
          <td>Nom cadeau</td>
          <td>url cadeau</td>
          <td>utilisateur</td>
          </th>
        </tr>
        <tr v-for='cadeau in listeCadeau' :key="cadeau.id">
          <td>{{ cadeau.name }}</td>
          <td><a :href="cadeau.url">{{ cadeau.name }}</a></td>
          <td>{{ cadeau.user_id }}</td>
        </tr>
      </table>
    </div>
  </main>
  <main v-else>
    vous n'êtes pas connecté donc vous n'avez pas accès à cette page
  </main>
</template>

<style>

</style>

