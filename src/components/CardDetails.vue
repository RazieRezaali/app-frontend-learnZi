<template>
  <char-info v-if="card && card.character" :characterId="card.character.id"></char-info>
  <div class="details-page container" v-if="card">    
    <div class="mb-3">
      <h5 class="mb-2">📝 Note</h5>
      <div v-if="!showEditor" v-html="card.description || '<p class=\'text-muted\'>No note added.</p>'"></div>
    </div>

    <div v-if="!showEditor" class="d-flex flex-wrap gap-2 mb-3">
      <button class="btn btn-outline-secondary" @click="editNote">
        {{ card.description ? 'Edit Note' : 'Add Note' }}
      </button>
      <button class="btn btn-outline-danger" @click="deleteCard">Delete Card</button>
    </div>

    <div v-if="showEditor" class="mb-3">
      <Ckeditor :editor="editor" v-model="editorData" :config="editorConfig" />
      <div class="mt-3 d-flex flex-wrap gap-2">
        <button class="btn btn-success" type="button" @click="submitNote">💾 Submit</button>
        <button class="btn btn-secondary" type="button" @click="cancelEdit">❌ Cancel</button>
      </div>
    </div>

    <div v-if="message" class="alert alert-success mt-3">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/axios';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const editor = ClassicEditor;
const editorConfig = {
  toolbar: [
    'heading', '|',
    'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
    'uploadImage', 'blockQuote', '|',
    'undo', 'redo'
  ],
  image: {
    toolbar: [
      'imageTextAlternative',
      'imageStyle:inline',
      'imageStyle:block',
      'imageStyle:side'
    ],
    upload: {
      types: ['png', 'jpeg', 'jpg', 'gif']
    }
  }
};

const card = ref(null);
const message = ref('');
const showEditor = ref(false);
const editorData = ref('');
const loading = ref(true);

const route = useRoute();
const router = useRouter();

const fetchCard = async () => {
  loading.value = true;
  try {
    const res = await axios.get(`/cards/${route.params.cardId}`);
    card.value = res.data.card;
  } catch (error) {
    console.error('Failed to load card:', error);
  } finally {
    loading.value = false;
  }
};

const deleteCard = async () => {
  if (confirm('Are you sure you want to delete this card?')) {
    try {
      await axios.delete(`/card/${card.value.id}`);
      message.value = 'Card deleted successfully.';
      setTimeout(() => router.push({ name: 'Home' }), 1500);
    } catch (error) {
      console.error('Failed to delete card:', error);
    }
  }
};

const editNote = () => {
  editorData.value = card.value?.description || '';
  showEditor.value = true;
};

const cancelEdit = () => {
  showEditor.value = false;
  editorData.value = '';
  message.value = '';
};

const submitNote = async () => {
  try {
    loading.value = true;
    const res = await axios.post(`/cards/description/${card.value.id}`, {
      description: editorData.value
    });

    card.value.description = res.data.card.description;
    message.value = 'Note updated successfully!';
    showEditor.value = false;
  } catch (error) {
    console.error('Failed to update note:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCard);
</script>

<style scoped>
.details-page {
  background-color: #f8f9fa;
  padding-top: 2rem;
  padding-bottom: 4rem;
  /* min-height: 100vh; */
}

.details-title {
  font-size: 2.25rem;
  font-weight: bold;
  color: #212529;
  margin-bottom: 2rem;
  text-align: center;
}
</style>
