// components/tree/tree.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tree: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    treeData: []
  },

  ready: function () {
    this.setData({
      treeData: this.data.tree
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggle: function (e) {
      const id = e.currentTarget.dataset.id;
      const isFolder = e.currentTarget.dataset.isfolder;
      const url = e.currentTarget.dataset.url;
      if (isFolder) {
        const treeData = this._findChild(id, this.data.treeData);
        this.setData({
          treeData: treeData
        })
      } else if (url && url.length > 0) {
        wx.navigateTo({
          url: url
        })
      }
    },
    _findChild: function (id, arr) {
      const that = this;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
          arr[i].isOpen = !arr[i].isOpen;
          break;
        }
        if (arr[i].children && arr[i].children.length > 0) {
          that._findChild(id, arr[i].children)
        }
      }
      return arr;
    }
  }
})
