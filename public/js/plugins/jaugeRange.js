import {Canvas} from './canvas.js';

/*
 * ======================================================================
 * Class JaugeRange
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class JaugeRange extends Canvas{

    /**
     * @description Constructor
     * @param {object} element HTML element 
     * @param {array} options Array of JaugeRange options 
     */
    constructor(element, options){
        super(element, options);
        const defaults = {
            min:0,
            max:100,
            value:0
        }
        this.$element = $(element);
        this.settings = $.extend(defaults, this.settings);
        this.init();
    }

    click(e){
        e.preventDefault();
        var percent = Math.round(100 / (this.settings.width - 40) * (e.pageX - this.$canvas.offset().left - 20));
        if(percent>100){
            percent = 100; 
        }else if(percent<0){
            percent = 0;
        }
        this.settings.value = percent;
        this.draw();    
    }

    /**
     * @description Draw JaugeRange
     * @return {void}
     */
    draw(){
        super.clear();
        super.drawText('Volume ' + this.settings.value, this.settings.width /2, 20, 'bold 18px Arial');
        super.drawRectangle(this, 20, this.settings.height/2 + 5, ((this.settings.width-40)/100)*this.settings.value, 15, '#337ab7');
        super.drawRectangle(this, 20, this.settings.height/2 + 15, this.settings.width - 40, 5, 'rgba(0, 0, 0, 0.15)');
        this.drawLine(20, this.settings.height/2 + 20, this.settings.width - 20,  this.settings.height/2 + 20);
        for(var i=0;i<=100;i++){
            if(i % 10 === 0){
                super.drawText(i, ((this.settings.width - 40)/100) * i + 20, this.settings.height/2 - 5, 'bold 10px Arial');             
            }
            if(i % 10 === 0){
                super.drawLine(((this.settings.width - 40)/100) * i + 20, this.settings.height/2 + 20, ((this.settings.width - 40)/100) * i + 20, this.settings.height/2 + 5, '#000', 1.5);
            }else if(i % 2 === 0){
                super.drawLine(((this.settings.width - 40)/100) * i + 20, this.settings.height/2 + 20, ((this.settings.width - 40)/100) * i + 20, this.settings.height/2 + 15, '#000', 1.5);
            }
        }
    }

    /**
     * @description Initialize JaugeRange
     * @return {void}
     */
    init(){
        let self = this;
        this.settings.min = this.$element.attr('data-min');
        this.settings.max = this.$element.attr('data-max');
        this.settings.value = this.$element.attr('data-value');
        super.create();
        this.$element.append(this.$canvas);
        this.draw();
        this.$canvas.on('click', function(e){
            self.click(e);
        });
        this.$canvas.on('mousedown', function(e){
            self.mousedown(e);
        });
    }

    mousedown(e){
        let self = this;
        e.preventDefault();
        this.$element.bind('mousemove', function(e){
            var percent = Math.round(100 / (self.settings.width - 40) * (e.pageX - self.$canvas.offset().left - 20));
            if(percent>100){
                percent = 100; 
            }else if(percent<0){
                percent = 0;
            }
            self.settings.value = percent;
            self.draw();
        }).mouseup(function(event){
            event.preventDefault();
            self.$element.unbind('mousemove');
        }).mouseout(function(event){
            event.preventDefault();
            self.$element.unbind('mousemove');
        });
    }
}

export {JaugeRange};