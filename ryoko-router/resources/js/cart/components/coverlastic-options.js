import {default as parseProductValue} from '../../functions/product-value-parser';
import {default as encodeProductValue} from '../../functions/product-value-encoder';

export default function (selectedStyle, selectedColor, colorSlugList, labelList, styleList, attributesList) {
    return {
        maxQuantity: 10,
        minQuantity: 1,
        selectedStyle: selectedStyle,
        selectedColor: selectedColor,
        lastSelectedColor: selectedColor,
        colorSlugList: colorSlugList,
        labelList: labelList,
        styleList: styleList,
        attributesList: attributesList,
        selectedQuantity: 1,
        options: [],
        init() {
            Alpine.store('cartOptions').removeFromCartItems();
            this.$watch('selectedQuantity', () => {
                this.selectedQuantity = this.selectedQuantity > this.maxQuantity ? this.maxQuantity : this.selectedQuantity;
                this.selectedQuantity = this.selectedQuantity < this.minQuantity ? this.minQuantity : this.selectedQuantity;
            });
            this.$watch('selectedColor', () => {
                if (this.selectedColor !== null) {
                    this.lastSelectedColor = this.selectedColor;
                }
            });
            this.$watch('options', () => {
                this.options.forEach(option => {
                    Alpine.store('cartItems').update(encodeProductValue(option.option), 'product[' + option.option.id + ']');
                });
            });
        },
        outOfStock() {
            if (
                this.selectedStyle &&
                parseProductValue(this.selectedStyle).id.startsWith('coverlastic-xl-sofa-') &&
                ['#252525', '#8A8C91'].includes(this.selectedColor)
            ) {
                return true;
            }
        },
        disabled() {
            if (this.outOfStock()) {
                return true;
            }

            return !(this.selectedStyle && this.selectedColor);
        },
        /**
         * @param {string} color
         */
        showPreviewWithColor(color) {
            return this.lastSelectedColor === color;
        },
        add() {
            if (this.disabled()) {
                return;
            }

            const {label, parsedOption} = this.formatOptionValue(this.selectedStyle, this.selectedQuantity, this.selectedColor);
            this.options = this.options.filter(option => {
                return option.color !== this.selectedColor && option.style !== this.selectedStyle;
            })
            this.options.push({
                color: this.selectedColor,
                style: this.selectedStyle,
                quantity: this.selectedQuantity,
                option: parsedOption,
                label
            });

            this.selectedQuantity = this.minQuantity;
            this.selectedStyle = null;
            this.selectedColor = null;
        },
        remove(option) {
            Alpine.store('cartItems').remove('product[' + option.option.id + ']');

            this.options = this.options.filter(function (o) {
                return !(option.color === o.color && option.style === o.style);
            });
        },
        increase(option) {
            option.quantity = option.quantity === this.maxQuantity ? this.maxQuantity : option.quantity + 1;
            const {parsedOption} = this.formatOptionValue(option.style, option.quantity, option.color);
            option.option = parsedOption;

        },
        decrease(option) {
            option.quantity = option.quantity === this.minQuantity ? this.minQuantity : option.quantity - 1;
            const {parsedOption} = this.formatOptionValue(option.style, option.quantity, option.color);
            option.option = parsedOption;
        },
        formatOptionValue(style, quantity, color) {
            const parsedOption = parseProductValue(style, 0);
            const label = this.styleList[parsedOption.id];

            parsedOption.id = parsedOption.id.replace('-sand', '-' + this.colorSlugList[color])
            parsedOption.price = (parsedOption.price * quantity).toFixed(2);
            parsedOption.name = this.labelList[parsedOption.id];
            parsedOption.options = [color];
            parsedOption.oldPrice = (parsedOption.oldPrice * quantity).toFixed(2);
            parsedOption.quantity = quantity;

            return {label, parsedOption}
        }
    };
};