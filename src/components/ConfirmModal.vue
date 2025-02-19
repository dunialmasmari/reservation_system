<template>
    <div v-if="isOpen" class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block">
            <!-- Background overlay -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')" />

            <!-- Modal content -->
            <div class="inline-block bg-white rounded-lg shadow-xl transform transition-all sm:my-8 align-middle max-w-md w-full">
                <div class="px-6 pt-6">
                    <div class="flex flex-col items-center justify-center gap-5">
                        <!-- Warning icon -->
                        <div class="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-lg bg-red-100 sm:mx-0">
                            <svg class="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 11-12.728 0M12 9v4m0 4h.01" />
                            </svg>
                        </div>
                        <!-- Modal title and message -->
                        <div class="text-center">
                            <h3 class="text-xl leading-7 font-medium text-gray-900">
                                {{ 'Disable Reservations' }}
                            </h3>
                            <div class="mt-2">
                                <p class="text-md text-gray-500">
                                    {{ 'This will disable reservations for all branches. Continue?' }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Action buttons -->
                <div class="px-6 py-6 flex justify-center gap-3">
                    <button type="button" class="btn-gray-50" @click="$emit('close')">
                        Cancel
                    </button>
                    <button id="disable-reservations" type="button" class="btn-danger" :class="{ 'is-loading': isSubmitting }" @click="handleDisableAll">
                        <span class="btn-text">Confirm</span>
                        <span class="btn-spinner"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConfirmModal',
    props: {
        isOpen: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            isSubmitting: false // Indicates if the form is being submitted
        }
    },
    methods: {
        // Handle the action to disable all reservations
        async handleDisableAll() {
            this.isSubmitting = true
            const success = await this.$store.dispatch('disableAllReservations')
            if (success) {
                this.isSubmitting = false
                this.$emit('close')
            }
        }
    }
}
</script>