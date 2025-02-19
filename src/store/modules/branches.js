import axios from 'axios'

const state = {
    branches: [], // List of branches that accept reservations
    nonReservationBranches: [], // List of branches that do not accept reservations
    loading: false, // Loading state for fetching branches
    error: null // Error state for handling errors
}

const mutations = {
    // Set the branches that accept reservations
    SET_BRANCHES(state, branches) {
        state.branches = branches.filter(branch => branch.accepts_reservations)
    },
    // Add a branch to the list of branches that accept reservations
    ADD_BRANCH(state, branch) {
        state.branches.push(branch)
        const index = state.nonReservationBranches.indexOf(branch)
        if (index > -1) {
            state.nonReservationBranches.splice(index, 1)
        }
    },
    UPDATE_BRANCH(state, branch) {
        const index = state.branches.findIndex(b => b.id === branch.id)
        if (index > -1) {
            // mutate branch
            state.branches.splice(index, 1, branch)
        }
    },

    // Set the branches that do not accept reservations
    SET_NON_RESERVATION_BRANCHES(state, branches) {
        state.nonReservationBranches = branches.filter(branch => !branch.accepts_reservations)
    },
    // Set the loading state
    SET_LOADING(state, loading) {
        state.loading = loading
    },
    // Set the error state
    SET_ERROR(state, error) {
        state.error = error
    }
}

const actions = {
    // Fetch branches from the API
    async fetchBranches({ commit }) {
        commit('SET_LOADING', true)
        try {
            const response = await axios.get('/api/branches?include[0]=sections&include[1]=sections.tables')
            commit('SET_BRANCHES', response.data.data)
            commit('SET_NON_RESERVATION_BRANCHES', response.data.data)
            commit('SET_ERROR', null)
        } catch (error) {
            commit('SET_ERROR', 'Failed to fetch branches')
            console.error(error)
        } finally {
            commit('SET_LOADING', false)
        }
    },

    // Enable reservations for a specific branch
    async enableReservations({ commit }, branch) {
        try {
            await axios.put(`/api/branches/${branch.id}`, {
                accepts_reservations: true
            })
            commit('ADD_BRANCH', branch)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    },

    // Disable reservations for all branches
    async disableAllReservations({ state, dispatch }) {
        try {
            await Promise.all(
                state.branches.map(branch =>
                    axios.put(`/api/branches/${branch.id}`, {
                        accepts_reservations: false
                    })
                )
            )
            await dispatch('fetchBranches')
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    },

    // Update settings for a specific branch
    async updateBranchSettings({ commit }, { branchId, settings }) {
        try {
            //Note: this is not the best methodology for updating the tables that accept reservations but this is what could be found in the documentation
            // each table in the enabled_tables array will accept reservations
            await Promise.all(
                settings.enabled_tables.map(table =>
                    axios.put(`/api/tables/${table}`, {
                        accepts_reservations: true
                    })
                )
                 
            )
            // each table in the disable_tables array will not accept reservations
            await Promise.all(
                settings.disable_tables.map(table =>
                    axios.put(`/api/tables/${table}`, {
                        accepts_reservations: false
                    })
                )
                 
            )
            const response = await axios.put(`/api/branches/${branchId}`, settings)
            commit('UPDATE_BRANCH', response.data.data)
            return true
        } catch (error) {
            console.error(error)
            return false
        }
    }
}

const getters = {
    // Get the list of branches that accept reservations
    branches: state => state.branches,
    // Get the list of branches that do not accept reservations
    nonReservationBranches: state => state.nonReservationBranches,
    // Get a branch by its ID
    getBranchById: state => id => state.branches.find(branch => branch.id === id)
}

export default {
    state,
    mutations,
    actions,
    getters
}