# 渲染DOM元素

要自己创建一个轻量级的react，我们首先要来学习的是react是如何渲染dom元素的。

## 元素对象定义

在开始开发之前，我们先回顾一下react对于dom元素的定义。

``` js
const element = {
  type: "div",
  props: {
    id: "container",
    children: [
      { type: "input", props: { value: "foo", type: "text" } },
      { type: "a", props: { href: "/bar" } },
      { type: "span", props: {} }
    ]
  }
};
```

根据这个对于元素的定义，我们将生成下面这样的HTML代码

``` html
<div id="container">
  <input value="foo" type="text">
  <a href="/bar"></a>
  <span></span>
</div>
```

当然我们不会在js中直接使用这样的数据结构去生成HTML代码，通常我们会使用JSX语法，或是createElement方法，但最终还是转化成这样的数据结构来生成HTML代码的，至于怎么转换的，我们将会在之后的教程中一一展示。

## 渲染DOM元素方法

接下来我们就来创建一个render方法，接收要渲染的元素对象和他的容器，来创建他的dom树并插入到容器中去。

``` js
function render(element, parentDom) {
  const { type, props } = element;
  const dom = document.createElement(type);
  const childElements = props.children || [];
  childElements.forEach(childElement => render(childElement, dom));
  parentDom.appendChild(dom);
}
```

通过这样一个简单的递归就可以生成对应的dom树了，但是我们发现我们没有把属性和事件添加到对应的元素中去。通过Object.keys的这个方法把属性和事件遍历到元素中去，注意这里需要props中判断哪些是事件哪些是属性。

``` js
function render(element, parentDom) {
  const { type, props } = element;
  const dom = document.createElement(type);

  const isListener = name => name.startsWith("on");
  Object.keys(props).filter(isListener).forEach(name => {
    const eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, props[name]);
  });

  const isAttribute = name => !isListener(name) && name != "children";
  Object.keys(props).filter(isAttribute).forEach(name => {
    dom[name] = props[name];
  });

  const childElements = props.children || [];
  childElements.forEach(childElement => render(childElement, dom));

  parentDom.appendChild(dom);
}
```

## 渲染text节点

然后我们发现我们的render方法并不支持text元素，我们先来看一下text元素是怎么定义的。

``` js
const textElement = {
  type: "span",
  props: {
    children: ["Foo"]
  }
};
```

对应生成的是

``` html
<span>Foo</span>
```

但是我们发现这样就我们之前定义的元素就冲突了，我们需要有type和props的元素。于是我们这边用一个特殊的type名字“TEXT ELEMENT”来表示text元素。text内容的属性就为nodeValue。我们来看一下具体例子。

``` js
const textElement = {
  type: "span",
  props: {
    children: [
      {
        type: "TEXT ELEMENT",
        props: { nodeValue: "Foo" }
      }
    ]
  }
};
```

接下来我们需要添加判断是否为text节点的代码，是的话使用createTextNode来生成text节点，我们来看一下修改后的代码。

``` js
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
```

## 总结

这里我们创建了一个render方法使用dom数据结构来生成dom元素，接下来我们要做的是怎么生成虚拟dom的数据结构（如何将jsx转换成dom数据）