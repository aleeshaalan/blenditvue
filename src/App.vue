<template>
  <div id="app">
    <div>
      <!-- Upload Interface -->
      <div id="upload">
        <div v-if="this.$root.$data.loading === false">
          <h1>Lend land </h1>
          
          <!-- Form for file choose, caption text and submission -->
          <form
            class="margin-sm"
            @submit.stop.prevent="handleSubmit"
          >
            <div class="border-style">
              <b-form-file
                plain
                @change="captureFile"
              />
            </div>
            <b-form-textarea
              v-model="caption"
              placeholder="Post description about land"
              :rows="3"
              :max-rows="6"
              class="margin-xs"
            />
            <b-form-textarea
              v-model="caption1"
              placeholder="land location"
              :rows="3"
              :max-rows="6"
              class="margin-xs"
            />
            <b-button
              class="margin-xs"
              variant="secondary"
              @click="handleOk"
            >
              Upload
            </b-button>
          </form>
        </div>
        <div
          v-if="this.$root.$data.loading === true"
          style="margin-top: 10%; margin-bottom: 5%"
        >
          <img
            class="upload-load"
            src="https://media.giphy.com/media/2A6xoqXc9qML9gzBUE/giphy.gif"
          >
        </div>
      </div>

      <!-- Posts Interface -->
      <ul class="home-list">
        <li class="card-items"
          v-for="item in this.$root.$data.currentPosts"
          :key="item.key"
          :item="item"
        >
          <!-- Card UI for post's image & caption text -->
          <b-card :img-src="item.src">
            <p class="home-card-text">
              {{ item.caption }}
            </p>
          </b-card>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ipfs from './contracts/ipfs';

export default {
  name: 'App',
  // data variables
  data() {
    return {
      buffer: '',
      caption: '',
      caption1:'',
    };
  },
  methods: {
    /* used to catch chosen image &
     * convert it to ArrayBuffer.
     */
    captureFile(file) {
      const reader = new FileReader();
      if (typeof file !== 'undefined') {
        reader.readAsArrayBuffer(file.target.files[0]);
        reader.onloadend = async () => {
          this.buffer = await this.convertToBuffer(reader.result);
        };
      } else this.buffer = '';
    },
    /**
     * converts ArrayBuffer to
     * Buffer for IPFS upload.
     */
    async convertToBuffer(reader) {
      return Buffer.from(reader);
    },
    /**
     * submits buffered image & text to IPFS
     * and retrieves the hashes, then store
     * it in the Contract via sendHash().
     */
    onSubmit() {
      alert('Uploading on IPFS...');
      this.$root.loading = true;
      let imgHash;
      console.log("DESC:",this.caption);
      console.log("LOC:",this.caption1);
      var dataObj ="{'desc':'"+this.caption+"','location':'"+this.caption1+"'}";
      console.log("FINAL : ",dataObj);
      ipfs.add(this.buffer)
        .then((hashedImg) => {
          imgHash = hashedImg[0].hash;
          return this.convertToBuffer(dataObj);
        }).then(bufferDesc => ipfs.add(bufferDesc)
          .then(hashedText => hashedText[0].hash)).then((textHash) => {
          this.$root.contract.methods
            .sendHash(imgHash, textHash)
            .send({ from: this.$root.currentAccount },
              (error, transactionHash) => {
                if (typeof transactionHash !== 'undefined') {
                  alert('Storing on Ethereum...');
                  this.$root.contract.once('NewPost',
                    { from: this.$root.currentAccount },
                    () => {
                      this.$root.getPosts();
                      alert('Operation Finished! Refetching...');
                    });
                } else this.$root.loading = false;
              });
        });
    },
    /**
     * validates if image & captions
     * are filled before submission.
     */
    handleOk() {
      if (!this.buffer || !this.caption || !this.caption1) {
        alert('Please fill in the information.');
      } else {
        this.onSubmit();
      }
    },

  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
  color: #2c3e50;
  margin-top: 3%;
}

.home-load {
  width: 50px;
  height: 50px;
}

.card img {
  object-fit: contain;

}
.card-items{
  margin: 10px 20px;
  box-shadow: 1px 1px 5px 0px #9e9e9e82;
  border-radius: 2px;
}
.card { 
  border: none;
  text-align: center;
    width: 250px;
    height: 400px;
  margin-bottom: 20px;
}


.home-list{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  contain: content;
  list-style: none;
}

.home-card-text {
  text-align: justify;
  margin-top: 10px;
}

#upload {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 5%;
  width: 500px;
}

.upload-load {
  width: 50px;
  height: 50px;
}

.margin-xs {
  margin-top: 3%;
}

.margin-sm {
  margin-top: 7%;
}

.border-style {
  border: 1px solid #ced4da;
}

</style>
