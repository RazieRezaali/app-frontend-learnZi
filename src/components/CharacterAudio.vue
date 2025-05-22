<template>
  <div class="audio-container">
    <!-- Loading bar -->
    <div v-if="loading" class="loading-bar"></div>

    <!-- Play Button -->
    <button @click="getAudio" class="play-btn" :disabled="loading">
      {{ loading ? 'Loading...' : 'Play Audio' }}
    </button>

    <!-- Audio Player -->
    <audio ref="audio" controls v-if="audioSrc" class="audio-player">
      <source :src="audioSrc" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
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
.audio-container {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  background: #f9fafb;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  text-align: center;
  position: relative;
}

.play-btn {
  padding: 0.5rem 1.2rem;
  background-color: #10b981;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background-color 0.2s ease;
}

.play-btn:hover {
  background-color: #059669;
}

.play-btn:disabled {
  background-color: #a7f3d0;
  cursor: not-allowed;
}

.audio-player {
  width: 100%;
  max-width: 300px;
}

/* Loading bar */
.loading-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  width: 100%;
  background: linear-gradient(to right, #10b981, #34d399, #10b981);
  background-size: 200% 100%;
  animation: loading-bar 1.2s linear infinite;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

@keyframes loading-bar {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>