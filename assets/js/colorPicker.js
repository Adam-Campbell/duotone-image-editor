
/**
 * ColorPicker class
 * This class corresponds to a color picker element in the UI, and handles local state and event listeners.
 */
export default class ColorPicker {
    /**
     * Constructor for ColorPicker class.
     * @param {*} element - the color picker HTML element
     * @param {*} onChangeCallback - callback function to be called when the color picker value changes
     */
    constructor(element, onChangeCallback) {
        this.element = element;
        this.onChangeCallback = onChangeCallback;
        this.debounceTimeout = null;
        this.init();
    }

    /**
     * Initialize the color picker element and add an event listener for input changes.
     * @param {*} initialValue - initial value for the color picker
     */
    init(initialValue='#000000') {
        this.element.value = initialValue;
        this.element.addEventListener('input', e => {
            this.handleInput(e);
        });
    }

    /**
     * Handles input changes on the color picker element. Debounces the input event to prevent 
     * excessive calls to the callback function.
     * @param {*} e - the event object
     */
    handleInput(e) {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
        this.debounceTimeout = setTimeout(() => {
            this.onChangeCallback(e.target.value);
        }, 100);
    }
}