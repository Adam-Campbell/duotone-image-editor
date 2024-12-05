
export default class ColorPicker {
    constructor(element, onChangeCallback) {
        this.element = element;
        this.onChangeCallback = onChangeCallback;
        this.debounceTimeout = null;
        this.init();
    }

    init(initialValue='#000000') {
        this.element.value = initialValue;
        this.element.addEventListener('input', e => {
            this.handleInput(e);
        });
    }

    handleInput(e) {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        this.debounceTimeout = setTimeout(() => {
            this.onChangeCallback(e.target.value);
        }, 100);
    }
}