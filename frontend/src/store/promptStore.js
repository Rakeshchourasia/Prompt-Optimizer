import { create } from 'zustand';

const usePromptStore = create((set) => ({
    prompts: [],
    selectedPrompt: null,
    filters: {
        search: '',
        category: '',
        tags: [],
        favorite: false,
    },

    setPrompts: (prompts) => set({ prompts }),
    setSelectedPrompt: (prompt) => set({ selectedPrompt: prompt }),
    addPrompt: (prompt) => set((state) => ({ prompts: [prompt, ...state.prompts] })),
    updatePrompt: (updatedPrompt) =>
        set((state) => ({
            prompts: state.prompts.map((p) => (p._id === updatedPrompt._id ? updatedPrompt : p)),
            selectedPrompt: state.selectedPrompt?._id === updatedPrompt._id ? updatedPrompt : state.selectedPrompt,
        })),
    deletePrompt: (id) =>
        set((state) => ({
            prompts: state.prompts.filter((p) => p._id !== id),
            selectedPrompt: state.selectedPrompt?._id === id ? null : state.selectedPrompt,
        })),
    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
    clearFilters: () => set({ filters: { search: '', category: '', tags: [], favorite: false } }),
}));

export default usePromptStore;
