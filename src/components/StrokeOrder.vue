<template>
  <div class="stroke-container">
    <h2>Stroke Order for: {{ character }}</h2>
    <div ref="strokeCanvas" class="hanzi-writer"></div>
    <button @click="animateStrokeOrder" class="animate-btn">Animate Strokes</button>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import HanziWriter from "hanzi-writer";

export default {
  props: {
    character: String, // Character received from parent
  },
  setup(props) {
    const strokeCanvas = ref(null);
    let writer = null;

    onMounted(() => {
      loadStrokeOrder(props.character);
    });

    watch(
      () => props.character,
      (newChar) => {
        loadStrokeOrder(newChar);
      }
    );

    function loadStrokeOrder(char) {
      if (!char || !strokeCanvas.value) return;

      // Clear previous instance
      if (writer) {
        writer.hideCharacter();
        writer = null;
      }

      // Initialize HanziWriter
      writer = HanziWriter.create(strokeCanvas.value, char, {
        width: 200,
        height: 200,
        strokeColor: "#222",
        delayBetweenStrokes: 300,
      });
    }

    function animateStrokeOrder() {
      if (writer) {
        writer.animateCharacter();
      }
    }

    return {
      strokeCanvas,
      animateStrokeOrder,
    };
  },
};
</script>

<style scoped>
.stroke-container {
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.hanzi-writer {
  width: 200px;
  height: 200px;
  margin: 1rem auto;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.animate-btn {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.animate-btn:hover {
  background-color: #2563eb;
}
</style>