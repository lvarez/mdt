/*
 * ======================================================================
 * Class Menu
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Menu{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of menu options 
     */
    constructor(element, options){
        const defaults = {
            width:'100%',
            height:'100%',
            orientation:'horizontal'
        }
        this.$element   = $(element);
        this.settings   = $.extend(defaults, options);
        this.styles     = {};
        this.version    = '0.1 beta'
        this.init();
    }

    /**
     * @description Create menu
     * @return {void}
     */
    create(){
        if(this.settings.items.length > 0){
            let html    = '<div id="mainMenu">';
            html        += '<ul>';
            for(const item in this.settings.items){
                html    += '<li>' + this.settings.items[item] + '</li>';
            }
            html        += '</ul>';
            html        += '</div>'
            this.$element.append($(html));
        } else {
            console.error('no items');
        }
    }

    /**
     * @description Initialize menu
     * @return {void}
     */
    init(){
        this.create();
    }
}