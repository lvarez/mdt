import {Canvas} from './canvas.js';
/*
 * ======================================================================
 * Class ColorPicker
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class ColorPicker extends Canvas{

    /**
     * @description Constructor
     * @param {object} element HTML element 
     * @param {array} options Array of color picker options
     */
    constructor(element, options){
        super(element, options)
        const defaults = {
             height:'75px',
             width:'300px'
        }
        this.$element   = $(element);
        this.settings   = $.extend(defaults, this.settings);
        this.isOpen     = false;
        this.posX       = 50;
        this.posY       = 50;
        this.init();
    }

    /**
     * @description Click on color picker
     * @param {object} e Event
     * @param {object} self HTML element 
     */
    click(e, self){
        const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('')
        const x = e.pageX - self.$canvas.offset().left;
        const y = e.pageY - self.$canvas.offset().top;
        const data = self.ctx.getImageData(x, y, 1, 1).data;
        const rgb = data[0] + ', ' + data[1] + ', ' + data[2];
        self.$element[0].value = rgbToHex(data[0], data[1], data[2]);
    }

    /**
     * @description Create color picker
     * @return void
     */
    create(self){
        if(!self.isOpen){
            super.drawColorPalette(self);
            super.drawArc(self.posX, self.posY, 5, 0, 2 * Math.PI, false, '#000', true, 2);
            super.drawArc(self.posX, self.posY, 5, 0, 2 * Math.PI, false, 'rgba(255, 255, 255, 0.3)');
            let html = `
                <div class="color-picker-container bottom"></div>
            `;
            self.$html = $(html);
            self.$html.append(self.$canvas);
            self.$element.after(self.$html);
            let offset = self.getOffset(self.$element[0]);
            if(offset.top + self.$element[0].offsetHeight + self.$html[0].offsetHeight + 20 > window.innerHeight + window.pageYOffset){
                self.$html.removeClass('bottom');
                self.$html.addClass('top');
            }else{
                self.$html.removeClass('top');
                self.$html.addClass('bottom');
            }
            self.$html.on('click', (e) => self.click(e, self));
            self.$html.find('canvas').on('mousemove', (e)=>{self.mousemove(self, e)});
            self.isOpen = true;            
        }
    }

    /**
     * @description Get offset of element
     * @param {object} el 
     * @return {object} 
     */
     getOffset(el) {
        let x = 0;
        let y = 0;
        while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top:y, left:x };
    }

    /**
     * @description Hide color picker
     * @param {*} self 
     */
    hide(self){
        self.$element.next().remove();
        self.isOpen = false;
    }

    /**
     * @description Initialize color picker
     * @return void
     */
    init(){
        super.create(this);
        const self = this;
        this.$element.on('click', () => self.show(self));
    }

    /**
     * @description Mouse move
     * @param {object} self
     * @return {void}
     */
    mousemove(self, e){
        const oCanvas = e.target; 
        const oRect = oCanvas.getBoundingClientRect();
        self.posX = (e.clientX - oRect.left) / (oRect.right - oRect.left) * oCanvas.width;
        self.posY = (e.clientY - oRect.top) / (oRect.bottom - oRect.top) * oCanvas.height;
        this.refresh(self);
    }

    refresh(self){
        super.drawColorPalette(self);
        super.drawArc(self.posX, self.posY, 5, 0, 2 * Math.PI, false, '#000', true, 2);
        super.drawArc(self.posX, self.posY, 5, 0, 2 * Math.PI, false, 'rgba(255, 255, 255, 0.3)');
    }

    /**
     * @description Show color picker
     * @param {*} self 
     */
    show(self){
        if(self.isOpen){
            self.hide(self);
        }else{
            self.create(self);
        }
    }
}

export {ColorPicker}