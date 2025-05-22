<template>
  <div class="details-page">
    <h1 class="details-title">Character Details: {{ character }}</h1>
    <br>
    <div class="details-grid">
      <stroke-order :character="character" />
      <info-character :character="character" />
      <character-audio :character="character" />
    </div>
  </div>
</template>

<script>
export default {
  props: ['char'],
  computed: {
    character() {
      return this.char;
    }
  }
}
</script>

<style scoped>
.details-page {
  padding: 2rem;
  background: #f3f4f6;
  min-height: 100vh;
  box-sizing: border-box;
}

.details-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1f2937;
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

/* Responsive for larger screens */
@media (min-width: 768px) {
  .details-grid {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .details-grid > * {
    flex: 1 1 45%;
    max-width: 45%;
  }
}
</style>