<template>
  <div class="audio-component text-center my-2 position-relative">
    <button class="btn btn-light" :disabled="loading" @click="getAudio">
      <i class="bi bi-volume-up-fill"></i>
      {{ loading ? 'Loading...' : 'Play Audio' }}
    </button>
    <div v-if="audioSrc" class="mt-3">
      <audio ref="audio" controls class="form-control w-100" style="max-width: 300px; margin: 0 auto;">
        <source :src="audioSrc" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';
export default {
  props: {
    character: String,
  },
  data() {
    return {
      audioSrc: null,
      loading: false,
    };
  },
  methods: {
    async getAudio() {
      this.loading = true;
      try {
        const response = await axios.post('/audio', {
          character: this.character
        }, {
          responseType: 'blob', // 👈 necessary for audio
          headers: {
            'Content-Type': 'application/json'
          }
        });

        this.audioSrc = URL.createObjectURL(response.data);

        this.$nextTick(() => {
          this.$refs.audio.play();
        });

      } catch (err) {
        console.error('Audio fetch failed:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.audio-component button:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}
</style>