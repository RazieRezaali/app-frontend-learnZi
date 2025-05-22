<template>
  <div class="info-box">
    <p><strong>Simplified:</strong> {{ info.simplified }}</p>
    <p><strong>Traditional:</strong> {{ info.traditional }}</p>
    <p><strong>Pinyin:</strong> {{ info.pinyin }}</p>
    <p><strong>Definition:</strong> {{ info.definition }}</p>
  </div>
</template>

<script>
import hanzi from "hanzi";
export default {
  props: {
    character: String, 
  },
  data(){
    return{
      info: {},
    };
  },
  mounted(){
    hanzi.start();
    const definition = hanzi.definitionLookup(this.character);
    console.log(definition[0]);
    this.info = definition[0]; 
  },
}
</script>

<style scoped>
.info-box {
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 1rem;
  background: #fefefe;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
}
</style>