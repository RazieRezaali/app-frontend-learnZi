<template>
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0, 0, 0, 0.5);" @click.self="onClose">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content shadow">
        <div class="modal-header">
          <h5 class="modal-title">Select Category for "{{ character.character }}"</h5>
          <button type="button" class="btn-close" @click="onClose"></button>
        </div>

        <div class="modal-body">
          <div v-if="!userId" class="alert alert-info text-center">
            <p class="mb-2">🚀 To add a character to your learning cards, please <strong>sign in</strong>.</p>
            <router-link to="/login" class="btn btn-primary">
              Login to Continue
            </router-link>
          </div>
          <div v-else id="category-tree"></div>
          <div v-if="successMessage" class="alert alert-success mt-3" role="alert">
            {{ successMessage }}
          </div>
        </div>

        <div v-if="userId" class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="onClose">Close</button>
          <button type="button" class="btn btn-primary" :disabled="!selectedCategoryId" @click="submitSelection">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global $ */
import axios from '@/axios';
import { auth } from '@/stores/auth';

export default {
  name: 'CategoryModal',
  props: {
    character: Object
  },
  emits: ['close'],
  data() {
    return {
      addingCategoryId: null,
      newCategoryName: '',
      addRootNodeId: null,
      selectedCategoryId: null,
      jstreeInstance: null,
      successMessage: ''
    };
  },
  computed: {
    userId() {
      return auth.user?.id;
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`/categories`);
        const rawCategories = response.data.categories;
        const treeData = rawCategories.map(cat => ({
          id: cat.id,
          parent: cat.parent_id === null ? '#' : cat.parent_id,
          text: this.formatCategoryText(cat),
          icon: false
        }));

        this.addRootNodeId = 'add-root-' + Date.now();
        treeData.push({
          id: this.addRootNodeId,
          parent: '#',
          text: this.getAddButtonHtml(),
          icon: false
        });

        this.$nextTick(() => {
          const tree = $('#category-tree');
          if (tree.jstree(true)) {
            tree.jstree('destroy');
          }

          this.jstreeInstance = tree.jstree({
            core: {
              data: treeData,
              themes: { stripes: true },
              check_callback: true,
              multiple: false
            },
            plugins: ['checkbox'],
            checkbox: {
              whole_node: false,
              tie_selection: false,
              three_state: false,
              cascade: ''
            }
          }).on('ready.jstree', () => {
            $(`#category-tree li#${this.addRootNodeId} > a > .jstree-checkbox`).hide();

            tree.on('check_node.jstree', (e, data) => {
              if (data.node.id === this.addRootNodeId) return;

              const checked = tree.jstree('get_checked');
              checked.forEach(id => {
                if (id !== data.node.id) {
                  tree.jstree('uncheck_node', id);
                }
              });

              this.selectedCategoryId = data.node.id;
            });

            tree.on('uncheck_node.jstree', () => {
              this.selectedCategoryId = null;
            });
          });

          tree.off('click', '.add-icon').on('click', '.add-icon', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const parentId = $(e.currentTarget).data('id');
            this.startAddingCategory(parentId === 'null' ? null : parseInt(parentId, 10));
          });
        });
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    },

    formatCategoryText(cat) {
      return `
        <span class="category-icon">📁</span>
        <span class="category-name">${cat.name}</span>
        <button class="btn btn-sm btn-link p-0 add-icon" data-id="${cat.id}" title="Add Subcategory">➕</button>
      `;
    },

    getAddButtonHtml() {
      return `<div class="add-root-container no-checkbox">
                <button class="btn btn-sm btn-outline-primary add-icon" data-id="null" title="Add Root Category">
                  ➕ Add Root Category
                </button>
              </div>`;
    },

    startAddingCategory(parentId) {
      this.addingCategoryId = parentId;

      this.$nextTick(() => {
        $('#category-tree').find('.custom-input-form').remove();

        let container = parentId
          ? $(`#category-tree li#${parentId}`)
          : $(`#category-tree li#${this.addRootNodeId}`);

        const inputFormHtml = `
          <form class="custom-input-form" style="margin-top: 6px;">
            <input type="text" class="new-category-input" placeholder="New category..." />
            <button type="button" class="submit-new-btn">✔️</button>
          </form>
        `;

        container.append(inputFormHtml);
        const input = container.find('.new-category-input');
        input.focus();

        container.find('.custom-input-form').on('submit', (e) => {
          e.preventDefault();
          this.handleNewCategory(input.val().trim());
        });

        container.find('.submit-new-btn').on('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.handleNewCategory(input.val().trim());
        });

        input.on('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            this.handleNewCategory(input.val().trim());
          }
        });
      });
    },

    async handleNewCategory(name) {
      if (!name) return;
      this.newCategoryName = name;
      await this.submitNewCategory();
    },

    async submitNewCategory() {
      try {
        await axios.post('/categories', {
          name: this.newCategoryName,
          parent_id: this.addingCategoryId ?? null,
          user_id: this.userId
        });

        this.addingCategoryId = null;
        this.newCategoryName = '';
        $('#category-tree').find('.custom-input-form').remove();
        this.fetchCategories();
      } catch (error) {
        console.error('Failed to add category:', error);
      }
    },

    async submitSelection() {
      if (!this.selectedCategoryId) return;

      try {
        await axios.post('/card', {
          character_id: this.character.id,
          category_id: this.selectedCategoryId
        });

        this.successMessage = 'Card submitted successfully!';
        setTimeout(() => {
          this.successMessage = '';
          this.onClose();
        }, 2000);
      } catch (error) {
        console.error('Failed to save card:', error);
      }
    },

    onClose() {
      $('#category-tree').jstree('destroy');
      this.$emit('close');
    }
  },

  mounted() {
    this.fetchCategories();
  }
};
</script>

<style scoped>#category-tree .jstree-anchor {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  font-size: 14px;
}
.category-icon {
  font-size: 16px;
  color: #6c757d;
}
.category-name {
  flex-grow: 1;
}
.add-icon {
  background: none;
  border: none;
  color: #0d6efd;
  font-size: 14px;
  padding: 0;
  cursor: pointer;
}
.add-icon:hover {
  color: #0a58ca;
}

.new-category-input {
  padding: 6px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  width: 180px;
}
.submit-new-btn {
  background-color: #198754;
  border: none;
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  margin-left: 5px;
  cursor: pointer;
}
.submit-new-btn:hover {
  background-color: #157347;
}
.no-checkbox .jstree-checkbox {
  display: none !important;
}
.add-icon {
  font-size: 16px;
  line-height: 1;
  color: #0d6efd !important;
  padding: 0 4px;
  text-decoration: none;
  transition: color 0.3s ease;
}
.add-icon:hover {
  color: #0a58ca !important;
  text-decoration: underline;
}
.add-root-container {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  justify-content: center;
}
</style>