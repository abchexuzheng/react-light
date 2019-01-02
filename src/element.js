// 渲染dom对象的方法
function render (element, parentDom) {
    const { type, props } = element;

    // 创建DOM元素
    const isTextElement = type === "TEXT ELEMENT";
    const dom = isTextElement
        ? document.createTextNode("")
        : document.createElement(type);

    // 找到props中的事件，并监听对应的事件
    const isListener = name => name.startsWith("on");
    Object.keys(props).filter(isListener).forEach(name => {
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, props[name]);
    });

    // 找到props中的attribute，添加到dom中
    const isAttribute = name => !isListener(name) && name != "children";
    Object.keys(props).filter(isAttribute).forEach(name => {
        dom[name] = props[name];
    });

    // 渲染子元素
    const childElements = props.children || [];
    childElements.forEach(childElement => render(childElement, dom));

    // 添加到父元素中
    parentDom.appendChild(dom);
}