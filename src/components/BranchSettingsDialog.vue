<template>
  <div v-if="isOpen" class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')" />
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
        <div class="bg-white px-6 pt-6 pb-4 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-0">
            Branch Reservation Settings
          </h3>
          <!-- Close icon -->
          <button @click="$emit('close')"
            class="text-gray-400 hover:text-gray-500 bg-gray-50 rounded-md border border-gray-200 p-1">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="handleSave">
          <div class="px-6 pt-6 pb-4 flex flex-col justify-between items-center w-full gap-4">
            <!-- info message of the branch working hours -->
            <div class="bg-blue-100 border border-blue-500 py-4 px-2 rounded-lg flex items-center gap-2 w-full">
              <!-- info icon -->
              <svg class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
              </svg>
              <p class="text-sm text-blue-500">Branch working hours are {{ branch?.opening_from }} - {{
                branch?.opening_to }}</p>
            </div>
            <!-- Reservation Duration Input -->
            <div class="form-group flex gap-4 flex-wrap rounded-sm w-full">
              <label class="block text-sm font-medium text-gray-700">
                Reservation Duration (minutes)
              </label>
              <input type="number" v-model.number="settings.reservation_duration" min="30" step="1" required
                class="mt-1 block w-full rounded-md form-input" />
            </div>
            <!-- Tables Selection -->
            <div class="form-group flex gap-4 flex-wrap rounded-sm w-full">
              <label class="block text-sm font-medium text-gray-700">
                Tables
              </label>
              <v-select v-model="settings.tables" :deselect-from-dropdown="true" :options="availableTables"
                :close-on-select="false" multiple label="label" class="w-full z-20 relative"></v-select>
            </div>
            <!-- Time Slots -->
            <div class="space-y-4 w-full">
              <div v-for="(day, index) in weekDays" :key="day" class="form-group rounded-lg">
                <div class="flex justify-between items-center">
                  <span class="font-medium">{{ day }}</span>
                  <button v-if="index === 0" :disabled="settings.timeSlots[day].length < 1"
                    :class="{ 'text-gray-300': settings.timeSlots[day].length < 1 }" type="button"
                    class="text-primary hover:text-primary text-sm" @click="applyToAllDays">
                    Apply on all days
                  </button>
                </div>
                <div class="flex form-input gap-3">
                  <div class="flex flex-wrap gap-2 w-full">
                    <span v-if="settings.timeSlots[day].length < 1" class="my-auto text-gray-400 text-md">Add Available
                      Reservation Times</span>
                    <div v-for="(slot, slotIndex) in settings.timeSlots[day]" :key="slotIndex"
                      class="flex items-center w-full gap-2">
                      <input type="time" v-model="slot.start"
                        class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                      <span>-</span>
                      <input type="time" v-model="slot.end"
                        class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                      <button type="button" @click="removeTimeSlot(day, slotIndex)"
                        class="text-red-600 hover:text-red-800 bg-gray-50 rounded-md flex items-center justify-center add-slot">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button :disabled="settings.timeSlots[day].length > 2" type="button"
                    class="text-gray-500 hover:text-gray-600 disabled:text-gray-300 rounded-md border flex items-center justify-center add-slot"
                    @click="addTimeSlot(day)">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <div v-if="errors[day]" class="text-red-600 text-sm">
                  {{ errors[day] }}
                </div>
              </div>
            </div>
          </div>
          <div class="px-6 py-6 flex flex-wrap justify-end gap-3">
            <div class="flex flex-row-reverse gap-3">
              <button type="submit" class="btn-primary btn-settings" :class="{ 'is-loading': isSubmitting }"
                :disabled="settings.reservation_duration < 1">
                <span class="btn-text">Save</span>
                <span class="btn-spinner"></span>
              </button>
              <button type="button" class="btn-gray-50" @click="$emit('close')">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  name: 'BranchSettingsDialog',
  components: {
    vSelect
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    branch: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      weekDays: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      settings: {
        reservation_duration: 60,
        tables: [],
        timeSlots: {
          Saturday: [],
          Sunday: [],
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: []
        }
      },
      availableTables: [],
      errors: {},
      isSubmitting: false,
      openingTime: '',
      closingTime: '',
    }
  },
  watch: {
    branch: {
      immediate: true,
      handler(newBranch) {
        if (newBranch) {
          this.initializeSettings(newBranch)
        }
      }
    }
  },
  methods: {
    // Initialize settings based on the selected branch
    async initializeSettings(branch) {
      this.settings.reservation_duration = branch.reservation_duration

      try {
        this.availableTables = branch.sections?.flatMap(section =>
          section.tables?.map(table => ({
            id: table.id,
            label: `${section.name} - ${table.name}`,
            accepts_reservations: table.accepts_reservations
          }))
        ).filter(Boolean) || []

        this.openingTime = new Date(`1970-01-01T${branch.opening_from}:00`)
        this.closingTime = new Date(`1970-01-01T${branch.opening_to}:00`)

        // If opening and closing times are equal, treat as 24 hours open
        if (branch.opening_from === branch.opening_to) {
          this.closingTime = new Date(`1970-01-02T${branch.opening_to}:00`)
        } else if (branch.opening_to < branch.opening_from) {
          this.closingTime = new Date(`1970-02-02T${branch.opening_to}:00`)
        }

        this.settings.tables = this.availableTables.filter(table => table.accepts_reservations)
        // Set time slots for each day
        const timeSlots = branch.reservation_times || {}
        this.weekDays.forEach(day => {
          this.settings.timeSlots[day] = timeSlots[day.toLowerCase()]?.map(slot => ({
            start: slot[0],
            end: slot[1]
          })) || []
        })
      } catch (error) {
        console.error(error)
      }
    },
    // Add a new time slot for a specific day
    addTimeSlot(day) {
      if (this.settings.timeSlots[day].length < 3) {
        this.settings.timeSlots[day].push({ start: '', end: '' })
      }
    },
    // Remove a time slot for a specific day
    removeTimeSlot(day, index) {
      this.settings.timeSlots[day].splice(index, 1)
    },
    // Apply Saturday's time slots to all days
    applyToAllDays() {
      const saturdaySlots = [...this.settings.timeSlots.Saturday]
      this.weekDays.forEach(day => {
        if (day !== 'Saturday') {
          this.settings.timeSlots[day] = JSON.parse(JSON.stringify(saturdaySlots))
        }
      })
    },
    // Validate time slots to ensure they do not overlap, are longer than the reservation duration, and fall within branch working hours
    validateTimeSlots() {
      this.errors = {}
      if (this.settings.reservation_duration < 30) {
        this.errors.reservation_duration = 'Reservation duration must be at least 30 minutes.'
      }
      this.weekDays.forEach(day => {
        const slots = this.settings.timeSlots[day]
        for (let i = 0; i < slots.length; i++) {
          const startTime = new Date(`1970-01-01T${slots[i].start}:00`)
          const endTime = new Date(`1970-01-01T${slots[i].end}:00`)

          // Validate that start time is before end time
          if (startTime >= endTime) {
            this.errors[day] = 'Start time must be before end time.'
            continue
          }

          const duration = Math.abs((endTime - startTime) / (1000 * 60)) // duration in minutes

          if (duration < this.settings.reservation_duration) {
            this.errors[day] = `Time slot must be longer than reservation duration (${this.settings.reservation_duration} minutes).`
          }
          if (startTime < this.openingTime || endTime > this.closingTime) {
            this.errors[day] = `Time slot must be within branch working hours (${this.branch.opening_from} - ${this.branch.opening_to}).`
          }
          for (let j = i + 1; j < slots.length; j++) {
            const otherStartTime = new Date(`1970-01-01T${slots[j].start}:00`)
            const otherEndTime = new Date(`1970-01-01T${slots[j].end}:00`)
            if (
              (startTime < otherEndTime && endTime > otherStartTime) ||
              (otherStartTime < endTime && otherEndTime > startTime)
            ) {
              this.errors[day] = 'Time slots cannot overlap.'
            }
          }
        }
      })
      return Object.keys(this.errors).length === 0
    },
    // Handle save action
    async handleSave() {
      this.isSubmitting = true
      if (!this.validateTimeSlots()) {
        this.isSubmitting = false
        return
      }
      this.errors = {}
      const formattedTimeSlots = {}
      Object.entries(this.settings.timeSlots).forEach(([day, slots]) => {
        formattedTimeSlots[day.toLowerCase()] = slots
          .filter(slot => slot.start && slot.end)
          .map(slot => ([slot.start, slot.end]))
      })

      // Set up tables for each section
      const sections = this.branch.sections
      const enableTables = []
      const disableTables = []
      sections.forEach(section => {
        section.tables.forEach(table => {
          const selectedTable = this.settings.tables.find(t => t.id === table.id)
          if (table.accepts_reservations && !selectedTable) {
            disableTables.push(table.id)
          }
          if (selectedTable && !table.accepts_reservations) {
            enableTables.push(table.id)
          }

        })
      })
      const success = await this.$store.dispatch('updateBranchSettings', {
        branchId: this.branch.id,
        settings: {
          reservation_duration: this.settings.reservation_duration,
          sections: sections,
          enabled_tables: enableTables,
          disable_tables: disableTables,
          reservation_times: formattedTimeSlots
        }
      })
      this.isSubmitting = false
      if (success) {
        this.$emit('close')
      }
    }
  }
}
</script>