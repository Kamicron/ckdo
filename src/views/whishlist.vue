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
      showDeleteMessage: false,
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

    },
    async editCadeau(id) {
      const cadeau = this.listeCadeau.find(gift => gift.id === id);
      this.cadeau = { ...cadeau };
      this.showForm = true;
    },
    async updateCadeau() {
      const db = getFirestore();
      const docRef = doc(collection(db, "liste"), this.cadeau.id);
      await updateDoc(docRef, this.cadeau);
      this.showForm = false;
    },
    async deleteCadeau(id) {
      const db = getFirestore();
      const docRef = doc(collection(db, "liste"), id);
      await deleteDoc(docRef);
    },
  },
  computed: {
    filteredList() {
      console.log('liste: ', this.listeCadeau);
      console.log("liste filtré: ", this.listeCadeau.filter(cadeau => cadeau.id_user === this.userid));
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
    <transition name="fade">
      <div class="alert alert-success mt-3" v-if="showDeleteMessage">
        <strong>Succès!</strong> Le cadeau a été supprimé avec succès.
      </div>
    </transition>
    <transition name="fade">
      <div class="alert alert-success mt-3" v-if="showSuccessMessage">
        <strong>Succès!</strong> Le cadeau a été créé avec succès.
      </div>
    </transition>
    <div class="main_title">
      <h1>Liste de voeux <img src="../../public/plus.png" width="10px" height="auto" alt="add icon"
          v-on:click="showForm = !showForm" class="svg-icon"></h1>
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
                    <label class="input-group-text" for="file">Sélectionner l'image</label>
                  </div>

                </div>
              </div>
            </div>
            <div class="card-footer wrapper endflex">
              <button v-on:click="showSuccessMessage = true" type='submit' class="float-left btn btn">Créer</button>
            </div>
          </div>
        </form>
      </transition>
      
      <div class="wrapper  mb-3">
        <div class="card" style="width: 18rem;" v-for='cadeau in filteredList' :key="cadeau.id">
          <img :src="cadeau.gift_photo" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">{{ cadeau.gift_name }}</h5>
            <a :href="cadeau.gift_url" class="btn btn-primary" target="_blank">Acceder au site marchand</a>
          </div>
          <div class="card-footer">
            <img v-on:click="showDeleteMessage = true" src="../../public/bin.png" class='icon' alt="Supprimer"
              @click="deleteCadeau(cadeau.id)">
              <img src="../../public/draw.png" class='icon' alt="Modifier" @click="editCadeau(cadeau.id)">
          </div>
        </div>
      </div>
    </div>
  </main>
  <main v-else>
    vous n'êtes pas connecté donc vous n'avez pas accès à cette page
  </main>
</template>

<style>
.icon {
  width: 45px;
  height: auto;
}

.icon:hover {
  cursor: pointer;
}

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

.endflex {
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

