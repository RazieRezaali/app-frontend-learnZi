<template>
  <div class="container py-4">
    <h1 class="text-center h4 mb-4">Scan Chinese Characters</h1>

    <div class="text-center mb-3">
      <label for="file" class="btn btn-outline-secondary btn-sm">📷 Choose an image</label>
      <input type="file" id="file" @change="onFileChange" accept="image/*" class="d-none" />
    </div>

    <div v-if="imagePreview" class="text-center mb-3">
      <img :src="imagePreview" alt="Preview" class="img-fluid rounded shadow-sm" style="max-height: 250px;" />
    </div>

    <div class="text-center mb-3">
      <button
        @click="submitImage"
        :disabled="!image || loading"
        class="btn btn-primary btn-sm"
      >
        {{ loading ? 'Scanning...' : 'Scan' }}
      </button>
    </div>

    <div v-if="ocrResult.length" class="card p-3 border-light shadow-sm">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0">Recognized Text</h6>
        <button
          @click="copyToClipboard"
          class="btn btn-outline-success btn-sm"
          :disabled="copied"
        >
          <span>{{ copied ? '✅ Copied!' : '📋 Copy' }}</span>
        </button>
      </div>
      <ul class="list-unstyled small mb-0">
        <li v-for="(line, index) in ocrResult" :key="index">{{ line }}</li>
      </ul>
    </div>

    <div
      v-if="scanAttempted && !loading && !ocrResult.length && !error"
      class="alert alert-warning small mt-3"
    >
      No recognizable text found in the uploaded image.
    </div>

    <div v-if="error && !loading" class="alert alert-danger small mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ScanCharacters',
  data() {
    return {
      image: null,
      imagePreview: null,
      ocrResult: [],
      error: '',
      loading: false,
      copied: false,
      scanAttempted: false,
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.image = file;
        this.imagePreview = URL.createObjectURL(file);
        this.error = '';
        this.ocrResult = [];
        this.copied = false;
        this.scanAttempted = false; // 👈 reset when new image is selected
      }
    },
    async submitImage() {
      if (!this.image) return;

      this.loading = true;
      this.error = '';
      this.ocrResult = [];
      this.scanAttempted = true; // 👈 Only now, we say a scan has happened

      const formData = new FormData();
      formData.append('image', this.image);

      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        this.ocrResult = response.data.text || [];
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to process image.';
      } finally {
        this.loading = false;
      }
    },
    async copyToClipboard() {
      try {
        const fullText = this.ocrResult.join('\n');
        await navigator.clipboard.writeText(fullText);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 1500);
      } catch (err) {
        this.error = 'Failed to copy text.';
      }
    },
  },
};
</script>
