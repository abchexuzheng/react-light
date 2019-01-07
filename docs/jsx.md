## jsx

jsx提供给我们了一些语法糖来代替复杂的元素的定义：

``` js
const element = (
  <div id="container">
    <input value="foo" type="text" />
    <a href="/bar">bar</a>
    <span onClick={e => alert("Hi")}>click me</span>
  </div>
);
```

jsx会将上面的定义转换成下面这样：

``` js
const element = createElement(
  "div",
  { id: "container" },
  createElement("input", { value: "foo", type: "text" }),
  createElement(
    "a",
    { href: "/bar" },
    "bar"
  ),
  createElement(
    "span",
    { onClick: e => alert("Hi") },
    "click me"
  )
);
```

我们只需要实现createElement方法就可以支持jsx。这里第一个参数是元素的type，第二个是元素的props，接下来的参数都是元素的children。下面是简单的代码实现：

``` js
function createElement(type, config, ...args) {
  const props = Object.assign({}, config);
  const hasChildren = args.length > 0;
  props.children = hasChildren ? [].concat(...args) : [];
  return { type, props };
}
```

另外，我们还缺少的是对text元素的支持，判断一下children是不是string，是的话就创建text元素：

``` js
const TEXT_ELEMENT = "TEXT ELEMENT";

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
```

## 小结

这里我们添加了对于jsx的支持，我们就可以通过简单的语法来创建react元素了。
