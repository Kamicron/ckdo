<script>
import { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-firestore.js'
import { ref, getStorage, getDownloadURL, uploadString, } from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-storage.js';
import App from '@/App.vue';


export default {
  data() {
    return {
      imagedata: "",
      showForm: false,
      showSuccessMessage: false,
      listeCadeau: [],
      connected: JSON.parse(localStorage.getItem("connected")) || false,
      userid: JSON.parse(localStorage.getItem("userid")) || null,
      cadeau: {
        gift_name: null,
        gift_url: null,
        gift_photo: null,
        id_user: null,
        is_reserved: false,
      }

    };
  },
  methods: {
    previewImage: function (event) {
      this.file = this.$refs.file.files[0];
      this.cadeau.gift_photo = this.file.name;
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = (e) => {
          this.imagedata = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
      }
    },
    async getGift() {
      const firestore = getFirestore();
      const dbPart = collection(firestore, "liste");
      const q = query(dbPart, orderBy('gift_name', 'asc'));

      await onSnapshot(q, (snapshot) => {
        this.listeCadeau = snapshot.docs.map(doc => (
          { id: doc.id, ...doc.data() }
        ))

        this.listeCadeau.forEach(function (gift) {
          const storage = getStorage();
          const spaceRef = ref(storage, 'cadeau/' + gift.gift_photo);
          console.log('spaceRef: ', spaceRef);

          getDownloadURL(spaceRef)
            .then((url) => {
              gift.gift_photo = url;
              console.log("gift url:", gift.gift_photo);
            })
            .catch((error) => {
              console.log('erreur url', error);
            })
        })
        this.listeCadeau.push(gift);
      })
    },
    async createCadeau() {
      const storage = getStorage();
      const refStorage = ref(storage, 'cadeau/' + this.cadeau.gift_photo);
      this.cadeau.id_user = this.userid;
      await uploadString(refStorage, this.imagedata, 'data_url').then((snapshot) => {
        console.log('uploaded a base 64 string');
        const db = getFirestore();
        const docRef = addDoc(collection(db, "liste"), this.cadeau);
        this.showForm = false;
      });

      this.$router.push('/whishlist');
      
    }
  },
  computed: {
    filteredList() {
      console.log('liste: ', this.listeCadeau);
      console.log("liste filtr??: ", this.listeCadeau.filter(cadeau => cadeau.id_user === this.userid));
      return this.listeCadeau.filter(cadeau => cadeau.id_user === this.userid);
    }

  },
  mounted() {
    this.getGift();
    console.log('user id whishlist: ', this.userid);
  },
}
</script>

<template>
  <main v-if="connected">
    <div class="main_title">
      <h1>Liste de voeux <svg v-on:click="showForm = !showForm" class="svg-icon" viewBox="0 0 20 20">
          <path
            d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10">
          </path>
        </svg> </h1>
    </div>
    <div class="wrapper">
      <transition>

        <form enctype="multipart/from-data" @submit.prevent="createCadeau" v-if="showForm">

          <div class="card bg-dark">
            <div class="card-header">
              <h5>Ajouter un cadeau</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <div>
                    <img :src="imagedata" class="preview img-fluid">
                  </div>
                </div>
                <div class="col-6">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">Nom</span>
                    </div>
                    <input class="form-control" placeholder="Nom du cadeau" v-model="cadeau.gift_name" required>
                  </div>
                  <br>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">lien du cadeau</span>
                    </div>
                    <input class="form-control" placeholder="Url du cadeau" v-model="cadeau.gift_url" required>
                  </div>
                  <br>

                  <div class="input-group mb-3">
                    <input type="file" class="form-control" ref="file" id="file" @change="previewImage" required>
                    <label class="input-group-text" for="file">S??lectionner l'image</label>
                  </div>

                </div>
              </div>
            </div>
            <div class="card-footer wrapper endflex">
              <button v-on:click="showSuccessMessage=true" type='submit' class="float-left btn btn">Cr??er</button>
            </div>
          </div>
        </form>
      </transition>
      <transition name="fade">
      <div class="alert alert-success mt-3" v-if="showSuccessMessage">
        <strong>Succ??s!</strong> Le cadeau a ??t?? cr???? avec succ??s.
      </div>
    </transition>
      <div class="wrapper  mb-3">
        <div class="card" style="width: 18rem;" v-for='cadeau in filteredList' :key="cadeau.id">
          <img :src="cadeau.gift_photo" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">{{ cadeau.gift_name }}</h5>
            <a :href="cadeau.gift_url" class="btn btn-primary" target="_blank">Acceder au site marchand</a>
          </div>
        </div>
      </div>
    </div>
  </main>
  <main v-else>
    vous n'??tes pas connect?? donc vous n'avez pas acc??s ?? cette page
  </main>
</template>

<style>
form {
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

.endflex{
  justify-content: end;
}

.card {
  border: 2px solid var(--second-color);
  background-color: var(--main-dark_color);
  border-radius: 10px;
  padding: 10px;
}

.btn {
  color: var(--white);
  background-color: var(--main-color);
  padding: 8px;
  border-radius: 10px;
  text-decoration: none;
  border-color: var(--main-color);
}

.btn:hover {
  background-color: var(--second-color);
  border-color: var(--second-color);
}

.add {
  color: var(--dynamic-color);
}
</style>

