let rootInstance = null;
const TEXT_ELEMENT = "TEXT ELEMENT";

// 实例化
function instantiate (element) {
    const { type, props } = element;
    const isDomElement = typeof type === "string";

    if (isDomElement) {
        // 创建DOM元素
        const isTextElement = type === TEXT_ELEMENT;
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
    } else {
        // 实例化组件元素
        const instance = {};
        const publicInstance = createPublicInstance(element, instance);
        const childElement = publicInstance.render();
        const childInstance = instantiate(childElement);
        const dom = childInstance.dom;
    
        Object.assign(instance, { dom, element, childInstance, publicInstance });
        return instance;
    }
}

function createElement(type, config, ...args) {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  const rawChildren = hasChildren ? [].concat(...args) : [];
  props.children = rawChildren
    .filter(c => c != null && c !== false)
    .map(c => c instanceof Object ? c : createTextElement(c));
  return { type, props };
}

function createTextElement(value) {
  return createElement(TEXT_ELEMENT, { nodeValue: value });
}