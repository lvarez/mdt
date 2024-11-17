import {Canvas} from './canvas.js';

/*
 * ======================================================================
 * Class Clock
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Clock extends Canvas{

    /**
     * @description Constructor
     * @param {HTML element} element 
     * @param {Array of options of clock} options 
     */
    constructor(element, options){
        super(element, options);
        const defaults = {
            baseLine:'bottom',
            className:'montre',
            font:'bold 14px Arial',
            height:20,
            fillStyle:'#387bb3',
            textAlign:'center',
            width:70
        }
        this.settings   = $.extend(this.settings, defaults);
        this.timer      = null;
        this.init();
    }

    /**
     * @description Draw text of time in canvas
     * @return void
     */
    drawText(){
        const date = new Date();
        super.clear();
        super.drawText(date.toLocaleTimeString(), this.settings.width/2, this.settings.height/2, this.settings.font, this.settings.fillStyle, this.settings.textAlign);
    }

    /**
     * @description Initialize clock
     * @return void
     */
    init(){
        var self = this;
        super.create();
        this.$element.addClass(this.settings.className);
        this.$element.append(this.$canvas);
        this.timer = setInterval(self.showTime, 1000, self);
    }

    /**
     * @description Show time in clock
     * @param {*} self
     * @return void
     */
    showTime(self){
        self.drawText();
    }
}

export {Clock};