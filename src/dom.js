// 更新dom的属性
export function updateDomProperties(dom, prevProps, nextProps) {  
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