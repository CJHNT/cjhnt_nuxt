export const useCollectionsStore = defineStore('CollectionsStore', {
  state: () => {
    return {
      primaryTexts: [],
      collectionLists: {},
      searchList: []
    }
  },
  actions: {
    fillData(primary, colls, search) {
      this.primaryTexts = primary
      this.collectionLists = colls
      this.searchList = search
    }
  },
  getters: {}
})
