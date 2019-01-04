let rootInstance = null;

// 渲染dom对象的方法
function render (element, parentDom) {
    const prevInstance = rootInstance;
    const nextInstance = reconcile(container, prevInstance, element);
    rootInstance = nextInstance;
}

// 调和
function reconcile(parentDom, instance, element) {
    if (instance == null) {
        // 实例不存在时，添加实例
        const newInstance = instantiate(element);
        parentDom.appendChild(newInstance.dom);
        return newInstance;
    } else if (element == null) {
        // 移除实例
        parentDom.removeChild(instance.dom);
        return null;
    } else if (instance.element.type === element.type) {
        // 更新实例
        updateDomProperties(instance.dom, instance.element.props, element.props);
        instance.childInstances = reconcileChildren(instance, element);
        instance.element = element;
        return instance;
    } else {
        const newInstance = instantiate(element);
        parentDom.replaceChild(newInstance.dom, instance.dom);
        return newInstance;
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

// 实例化
function instantiate (element) {
    const { type, props } = element;

    // 创建DOM元素
    const isTextElement = type === "TEXT ELEMENT";
    const dom = isTextElement
        ? document.createTextNode("")
        : document.createElement(type);

    updateDomProperties(dom, [], props)
    
    // 实例化并添加子实例
    const childElements = props.children || [];
    const childInstances = childElements.map(instantiate);
    const childDoms = childInstances.map(childInstance => childInstance.dom);
    childDoms.forEach(childDom => dom.appendChild(childDom));

    const instance = { dom, element, childInstances };

    return instance
}

// 更新dom的属性
function updateDomProperties(dom, prevProps, nextProps) {  
    const isListener = name => name.startsWith("on");
    const isAttribute = name => !isListener(name) && name != "children";

    // 移除旧的事件
    Object.keys(prevProps).filter(isEvent).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
    });

    // 移除旧的attribute
    Object.keys(prevProps).filter(isAttribute).forEach(name => {
        dom[name] = null;
    });

    // 找到props中的事件，并监听对应的事件
    Object.keys(props).filter(isListener).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, props[name]);
    });

    // 找到props中的attribute，添加到dom中  
    Object.keys(props).filter(isAttribute).forEach(name => {
        dom[name] = props[name];
    });
}