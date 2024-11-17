/*
 * ======================================================================
 * Class Collapse
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Collapse{

    /**
     * @description Constructor
     * @param {object} element HTML element 
     * @param {array} options Array of collapse options
     */
    constructor(element, options){
        const defaults = {
            contentType:'html',
            autoOpen:false,
            duration:500,
            trigger:'click'       
        }
        this.$element   = $(element);
        this.settings   = $.extend(defaults, options);
        this.isOpen     = false;
        this.$target     = null;
        this.version    = '0.1 beta';
        this.init();
    }

    /**
     * @description Hide collapse element
     * @return {void}
     */
    hide(){
        this.$target.css({
            maxHeight:0,
            opacity:0
        });
    }

    /**
     * @description Initialize collapse element
     * @return {void}
     */
    init(){
        const self = this;
        this.$target = $(this.$element.attr('data-target'));
        this.$element.on(this.settings.trigger, (e) => this.toggle(e, self));
    }

    /**
     * @description Show collapse element
     * @return {void}
     */
    show(){
        this.$target.css({
           maxHeight:this.$target[0].scrollHeight + 'px',
           opacity:1
        });
    }

    /**
     * @description Toggle collapse element
     * @return {void}
     */
    toggle(e, self){
        e.preventDefault();
        if(self.isOpen){
            self.isOpen = false;
            self.hide();
        }else{
            self.isOpen = true;
            self.show();
        }    
    }
}

export {Collapse}