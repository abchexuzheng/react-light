export class Component {
    constructor(props) {
      this.props = props;
      this.state = this.state || {};
    }
  
    setState(partialState) {
      this.state = Object.assign({}, this.state, partialState);
      updateInstance(this.__internalInstance);
    }
}

function createPublicInstance(element, internalInstance) {
    const { type, props } = element;
    const publicInstance = new type(props);
    publicInstance.__internalInstance = internalInstance;
    return publicInstance;
}

function updateInstance(internalInstance) {
    const parentDom = internalInstance.dom.parentNode;
    const element = internalInstance.element;
    reconcile(parentDom, internalInstance, element);
}