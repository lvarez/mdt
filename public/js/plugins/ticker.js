/*
 * ======================================================================
 * Class Ticker
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Ticker{
    constructor(element, options){
        const defaults  = {
            duration:10000
        }
        this.$element   = $(element);
        this.settings   = $.extend(defaults, options);
        this.current    = 0;
        this.init();
    }

    create(){

    }

    /**
     * @description Initialize ticker
     */
    init(){
        const self = this;
        setTimeout(()=>{
            this.next(self);
        }, this.settings.duration);
    }

    next(self){
        if(self.current < (self.$element.find('li').length - 1)){
            self.$element.find('li').eq(self.current).removeClass('current');
            self.$element.find('li').eq(self.current + 1).addClass('current');
            self.current++
        }else{
            self.$element.find('li').eq(self.current).removeClass('current');
            self.$element.find('li').eq(0).addClass('current');
            self.current = 0;           
        }
        setTimeout(()=>{
            self.next(self);
        }, self.settings.duration);
    }
}