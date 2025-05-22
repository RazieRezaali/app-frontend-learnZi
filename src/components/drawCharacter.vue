<template>
  <div class="home-layout">
    <h1 class="main-title">Draw a Character & See Similar Ones</h1>
    <div class="components-wrapper">
      <recognize-character @get-ocr-result="ocrResult" />
      <similar-character :character="result" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: ''
    }
  },
  methods: {
    ocrResult(ocrResult) {
      this.result = ocrResult
    }
  }
}
</script>

<style scoped>
.home-layout {
  padding: 2rem;
  background: #f9fafb;
  min-height: 100vh;
  box-sizing: border-box;
}

.main-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #1f2937;
}

.components-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto; /* centers the container */
  padding: 1rem;
}

/* Optional: give children consistent width and card-like appearance */
.components-wrapper > * {
  flex: 1 1 400px;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}
</style>