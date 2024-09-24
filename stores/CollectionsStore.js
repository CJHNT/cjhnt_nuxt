export const useCollectionsStore = defineStore('CollectionsStore', {
  state: () => {
    return {
      subColls: [],
      collectionLists: {},
      searchList: []
    }
  },
  actions: {
    fillData(subs, colls, search) {
      this.subColls = subs
      this.collectionLists = colls
      this.searchList = search
    }
  },
  getters: {}
})
