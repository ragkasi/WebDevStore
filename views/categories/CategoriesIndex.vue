<template>
  <div>
    <h2>Part Categories</h2>
    <hr />
    <div class="mb-3">
      <b-button variant="danger" v-b-modal="'add-category-modal'"
        >Add Part Category</b-button
      >
    </div>
    <div class="mt-2">
      <FehTableWrapping
        :all="categories"
        :shown="shownCategories"
        v-on:pagingChange="pagingChange"
        v-if="hasMounted"
        :defaultPerPage="10"
      >
        <template v-slot:top-right>
          <div style="float: right">
            <CategoriesSearch v-on:update="update" :categories="categories" />
          </div>
        </template>
        <b-table
          id="categories-table"
          striped
          hover
          :items="shownCategories"
          :fields="fields"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :current-page="paging.current"
          :per-page="paging.per"
          responsive="sm"
        >
          <template #cell(name)="data">
            {{ data.value }}
          </template>

          <template #cell(actions)="data">
            <div v-if="data.item.name != 'Uncategorized'">
              <b-button
                class="button"
                variant="danger"
                style="padding: 3px 6px"
                v-on:click="deleteCategory(data.item.id, data.index)"
              >
                <i class="fa fa-trash" />
              </b-button>
              <span>&ensp;</span>
              <b-button
                class="button"
                variant="danger"
                style="padding: 3px 6px"
                v-on:click="showEditCategoryModal(data.item.id)"
              >
                <i class="fa fa-edit" />
              </b-button>
            </div>
            <span v-else>Cannot Edit or Remove</span>
          </template>
        </b-table>
      </FehTableWrapping>
    </div>
    <b-modal id="add-category-modal" title="Add Part Category" hide-footer>
      <AddCategoryForm v-on:refresh="refresh" />
    </b-modal>
    <b-modal
      id="edit-category-modal"
      ref="edit-category-modal"
      title="Edit Part Category"
      hide-footer
    >
      <EditCategoryForm :id="categoryId" v-on:refresh="refresh" />
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CategoriesSearch from '../../components/categories/CategoriesSearch.vue';
import AddCategoryForm from '../../components/categories/AddCategoryForm.vue';
import EditCategoryForm from '../../components/categories/EditCategoryForm.vue';
import FehTableWrapping from '../../components/utils/FehTableWrapping.vue';
import api from '../../api/categories';
import roles from '../../shared/roles';

@Component({
  components: {
    CategoriesSearch,
    AddCategoryForm,
    EditCategoryForm,
    FehTableWrapping,
  },
})
export default class CategoriesIndex extends Vue {
  categories: Category[] = [];
  shownCategories: Category[] = [];

  name = '';

  hasMounted = false;
  paging = { per: 1, current: 1, total: 1 };
  pagingChange(incoming: Paging) {
    this.paging = incoming;
  }

  categoryId = '';

  sortBy = 'name';
  sortDesc = false;
  fields = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  update(shownCategories: Category[]) {
    this.shownCategories = shownCategories;
  }

  deleteCategory(id: string, idx: number) {
    api.deleteCategory(id).then((res) => {
      if (res.data.status == 'success') {
        this.categories.splice(idx, 1);
      }
    });
  }

  showEditCategoryModal(id: string) {
    this.categoryId = id;
    (this.$refs['edit-category-modal'] as Vue & { show: () => boolean }).show();
  }

  refresh() {
    api.getCategories().then((res) => {
      if (res.status === 403) {
        this.$router.push('/forbidden');
      } else if (res.success) {
        this.categories = res.data;
        this.shownCategories = res.data;
      }
    });
  }

  mounted() {
    this.refresh();

    if (roles.student) {
      this.$router.push('/forbidden');
    }
    this.hasMounted = true;
  }
}
</script>
