<template>
  <div class="overflow-x-auto rounded-lg">
    <table class="min-w-full divide-y divide-gray-100 rounded-lg">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Branch
          </th>
          <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Reference
          </th>
          <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Number of Tables
          </th>
          <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Reservation Duration
          </th>
          <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="isLoading">
          <td colspan="5" class="px-6 py-4 text-center text-gray-500">
            Loading...
          </td>
        </tr>
        <tr v-if="!isLoading && branches.length === 0">
          <td colspan="5" class="px-6 py-4 text-center text-gray-500">
            No branches available.
          </td>
        </tr>
        <tr v-for="branch in branches" :key="branch.id" class="hover:bg-gray-50">
          <td data-label="Branch" class="px-6 py-4 whitespace-nowrap">{{ branch.name }}</td>
          <td data-label="Reference" class="px-6 py-4 whitespace-nowrap">{{ branch.reference }}</td>
          <td data-label="Number of Tables" class="px-6 py-4 whitespace-nowrap">{{ getReservationTablesCount(branch) }}
          </td>
          <td data-label="Reservation Duration" class="px-6 py-4 whitespace-nowrap">{{ branch.reservation_duration }}
            Minutes</td>
          <td data-label="Actions" class="px-6 py-4 whitespace-nowrap">
            <button @click="$emit('edit', branch)" class="  text-primary">
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'BranchTable',
  props: {
    branches: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isLoading: false
    }
  },

  created() {
    this.fetchBranches()
  },
  methods: {
    // Fetch branches from the API
    async fetchBranches() {
      this.isLoading = true
      await this.$store.dispatch('fetchBranches')
      this.isLoading = false
    },
    getReservationTablesCount(branch) {
      return branch.sections?.reduce((count, section) => {
        return count + (section.tables?.filter(table => table.accepts_reservations)?.length || 0)
      }, 0) || 0
    }
  }
}
</script>