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

    try {
      const categoryRes = await this.$axios.get(`/category/${id}`);
      this.categoryName = categoryRes.data.name;

      const cardsRes = await this.$axios.get(`/category/${id}/cards`);
      this.cards = cardsRes.data;
    } catch (error) {
      console.error('Error loading category or cards:', error);
    }
  }
};
</script>

<style scoped>
body {
  background-color: #f9f9f9;
}
</style>