<template>
  <div>
    <div v-if="error" class="alert alert-warning text-center">
      Stroke order data not available for this character.
    </div>
    <div v-else>
      <div ref="strokeCanvas" class="hanzi-canvas mx-auto "></div>
      <div class="text-center">
        <button @click="animateStrokeOrder" class="btn btn-light mt-3">
          <i class="bi bi-play-fill"></i> Animate Stroke
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import HanziWriter from "hanzi-writer";

export default {
  props: {
    character: String,
  },
  setup(props) {
    const strokeCanvas = ref(null);
    const error = ref(false);
    let writer = null;

    const loadStrokeOrder = (char) => {
      if (!char || !strokeCanvas.value) return;

      if (writer) {
        writer.hideCharacter();
        writer = null;
      }

      try {
        writer = HanziWriter.create(strokeCanvas.value, char, {
          width: 200,
          height: 200,
          strokeColor: "#000000",
          delayBetweenStrokes: 300,
          onLoadError: () => {
            error.value = true;
            writer = null;
          },
        });
        error.value = false;
      } catch (e) {
        error.value = true;
        console.warn(`Stroke order data not found for: ${char}`, e);
      }
    };

    const animateStrokeOrder = () => {
      if (writer) {
        writer.animateCharacter();
      }
    };

    onMounted(() => {
      loadStrokeOrder(props.character);
    });

    watch(
      () => props.character,
      (newChar) => {
        loadStrokeOrder(newChar);
      }
    );

    return {
      strokeCanvas,
      animateStrokeOrder,
      error,
    };
  },
};
</script>

<style scoped>
.hanzi-canvas {
  width: 200px;
  height: 200px;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}
</style>