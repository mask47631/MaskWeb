import { createVNode, render } from 'vue'
import GlobalLoading from './GlobalLoading.vue'

let instance = null
let container = null

const loading = {
  show(text = '加载中...') {
    if (!instance) {
      container = document.createElement('div')
      container.className = 'global-loading-container'
      document.body.appendChild(container)
      
      const vnode = createVNode(GlobalLoading, { 
        visible: true, 
        text
      })
      
      render(vnode, container)
      instance = vnode
    } else {
      instance.component.props.visible = true
      instance.component.props.text = text
    }
  },
  
  hide() {
    if (instance) {
      instance.component.props.visible = false
    }
  }
}

export default {
  install(app) {
    // 添加全局方法
    app.config.globalProperties.$loading = loading
    // 添加provide
    app.provide('$loading', loading)
  }
}