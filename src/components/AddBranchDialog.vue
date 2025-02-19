<template>
  <div v-if="isOpen" class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')" />

      <div class="inline-block bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8 align-middle sm:max-w-lg w-full">
        <div class="px-6 pt-6 pb-4 flex flex-col gap-5">
          <div class="flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-0">
              Add Branches
            </h3>
            <!-- Close button -->
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500 bg-gray-50 rounded-md border border-gray-200 p-1">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Branch selection -->
          <div class="form-group forminput flex gap-4 flex-wrap rounded-sm mx-h-[400px]">
            <label for="branches">Branch</label>
            <v-select placeholder="Select Branch" v-model="selectedBranch" :options="branches" :clearable="false" :searchable="false" label="name" class="w-full z-20 relative">
              <template #option="option">
                <span>
                  {{ option?.name }}
                </span>
              </template>
            </v-select>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="px-6 py-6 flex flex-row-reverse gap-3">
          <button id="enable-reservations" type="button" class="btn-primary" :class="{ 'is-loading': isSubmitting }" @click="enableReservation">
            <span class="btn-text">Enable Reservations</span>
            <span class="btn-spinner"></span>
          </button>
          <button type="button" class="btn-gray-50" @click="$emit('close')">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  name: 'AddBranchDialog',
  components: {
    vSelect
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    branches: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedBranch: null, // The branch selected by the user
      isSubmitting: false // Indicates if the form is being submitted
    }
  },
  methods: {
    // Enable reservations for the selected branch
    async enableReservation() {
      if (this.selectedBranch) {
        this.isSubmitting = true
        const success = await this.$store.dispatch('enableReservations', this.selectedBranch)
        if (success) {
          this.selectedBranch = null
          this.isSubmitting = false
          this.$emit('close')
        }
      }
    }
  }
}
</script>