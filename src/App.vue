<template>
  <div class="min-h-screen bg-gray-100">
    <div class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8 flex flex-wrap gap-4 justify-between items-center bg-white p-4 rounded-lg">
          <h1 class="text-xl sm:text-3xl font-bold text-gray-800">
            Reservations
          </h1>
          <div class="flex flex-wrap gap-4">
            <button class="btn-primary" @click="showAddBranchDialog = true">
              Add Branches
            </button>
            <button class="btn-outline-primary" @click="showConfirmModal = true">
              Disable Reservations
            </button>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg">
          <branch-table :branches="$store.getters.branches" @edit="editBranchSettings" />
        </div>

        <add-branch-dialog :is-open="showAddBranchDialog" :branches="$store.getters.nonReservationBranches"
          @close="showAddBranchDialog = false" />

        <branch-settings-dialog :is-open="showSettingsDialog" :branch="selectedBranch"
          @close="()=>{showSettingsDialog = false; selectedBranch = null}"   />

        <confirm-modal :is-open="showConfirmModal" @close="showConfirmModal = false" />
      </div>
    </div>
  </div>
</template>

<script>
import BranchTable from './components/BranchTable.vue'
import AddBranchDialog from './components/AddBranchDialog.vue'
import BranchSettingsDialog from './components/BranchSettingsDialog.vue'
import ConfirmModal from './components/ConfirmModal.vue'

export default {
  name: 'App',
  components: {
    BranchTable,
    AddBranchDialog,
    BranchSettingsDialog,
    ConfirmModal
  },
  data() {
    return {
      showAddBranchDialog: false,
      showSettingsDialog: false,
      showConfirmModal: false,
      selectedBranch: null,
    }
  },
  methods: {
    // Edit settings for a specific branch
    editBranchSettings(branch) {
      this.selectedBranch = branch
      this.showSettingsDialog = true
    },
    // Handle saving settings for a specific branch
    
  }
}
</script>