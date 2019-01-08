// 调和
export function reconcile(parentDom, instance, element) {
    if (instance == null) {
        // 实例不存在时，添加实例
        const newInstance = instantiate(element);
        parentDom.appendChild(newInstance.dom);
        return newInstance;
    } else if (element == null) {
        // 移除实例
        parentDom.removeChild(instance.dom);
        return null;
    } else if (instance.element.type !== element.type) {
        // 替换实例
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom, instance.dom);
        return newInstance;
    } else if (typeof element.type === "string") {
        // 更新实例
        updateDomProperties(instance.dom, instance.element.props, element.props);
        instance.childInstances = reconcileChildren(instance, element);
        instance.element = element;
        return instance;
    } else {     
        // 更新组件实例 
        instance.publicInstance.props = element.props;
        const childElement = instance.publicInstance.render();
        const oldChildInstance = instance.childInstance;
        const childInstance = reconcile(parentDom, oldChildInstance, childElement);
        instance.dom = childInstance.dom;
        instance.childInstance = childInstance;
        instance.element = element;
        return instance;
    }
}

function reconcileChildren(instance, element) {
    const dom = instance.dom;
    const childInstances = instance.childInstances;
    const nextChildElements = element.props.children || [];
    const newChildInstances = [];
    const count = Math.max(childInstances.length, nextChildElements.length);
    for (let i = 0; i < count; i++) {
      const childInstance = childInstances[i];
      const childElement = nextChildElements[i];
      const newChildInstance = reconcile(dom, childInstance, childElement);
      newChildInstances.push(newChildInstance);
    }
    return newChildInstances.filter(instance => instance != null);
}

// 渲染dom对象的方法
export function render (element, parentDom) {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(container, prevInstance, element);
    rootInstance = nextInstance;
}