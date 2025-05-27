<template>
  <div class="audio-component text-center my-2 position-relative">
    <!-- Play Button -->
    <button
      @click="getAudio"
      class="btn btn-outline-secondary d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm"
      :disabled="loading"
    >
      <i class="bi bi-volume-up-fill"></i>
      {{ loading ? 'Loading...' : 'Play Audio' }}
    </button>
    <!-- Audio Player -->
    <div v-if="audioSrc" class="mt-3">
      <audio ref="audio" controls class="form-control w-100" style="max-width: 300px; margin: 0 auto;">
        <source :src="audioSrc" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  </div>
</template>

<script>
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
        const response = await fetch('http://localhost:5001/speak', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ character: this.character })
        });

        if (!response.ok) throw new Error("Failed to fetch audio");

        const blob = await response.blob();
        this.audioSrc = URL.createObjectURL(blob);

        this.$nextTick(() => {
          this.$refs.audio.play();
        });

      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.audio-component button:disabled {
  opacity: 0.75;
  cursor: not-allowed;
}
</style>