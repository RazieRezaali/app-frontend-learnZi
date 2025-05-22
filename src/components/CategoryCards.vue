<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Cards in "{{ categoryName }}"</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div
        v-for="card in cards"
        :key="card.id"
        class="bg-white p-4 rounded-xl shadow hover:shadow-md cursor-pointer text-center"
      >
        <div class="text-4xl font-bold">{{ card.character.character }}</div>
        <div class="text-gray-500 text-sm">{{ card.character.pinyin }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CategoryCards',
  data() {
    return {
      cards: [],
      categoryName: ''
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    const categoryRes = await axios.get(`http://localhost:8000/api/category/${id}`);
    this.categoryName = categoryRes.data.name;

    const cardsRes = await axios.get(`http://localhost:8000/api/category/${id}/cards`);
    this.cards = cardsRes.data;
  }
};
</script>

<style scoped>
body {
  background-color: #f9f9f9;
}
</style>