/*
 * ======================================================================
 * Class Button
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Button{
    
    /**
     * @description Constructor
     * @param {string} element HTML element
     * @param {array} options Array of button options 
     */
    constructor(element, options){
        const defaults = {
            
        }
        this.$element   = $(element);
        this.settings   = $.extend(defaults, options);
        this.isLoading  = false;
        this.version    = '0.1 beta';
    }

    /**
     * @description Set state of button
     * @param {*} state 
     * @return {void}
     */
    SetState(state){
        switch(state){
            case 'enabled':
                if(this.$element.hasClass('disabled')){
                    this.$element.removeClass('disabled');
                }else if(this.$element.hasClass('loading')){
                    this.$element.removeClass('loading');
                }
                break;
            case 'disabled':
                if(this.$element.hasClass('loading')){
                    this.$element.removeClass('loading');
                }            
                this.$element.addClass('disabled');
                break;
            case 'loading':
                if(this.$element.hasClass('disabled')){
                    this.$element.removeClass('disabled');
                }
                this.$element.addClass('loading');
                break;
        }
    }

    /**
     * @description Toggle button
     * @return {void}
     */
    Toggle(){

    }
}