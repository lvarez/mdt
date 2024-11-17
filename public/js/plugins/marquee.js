/*
 * ======================================================================
 * Class Marquee
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Marquee{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of marquee options
     */
    constructor(element, options){
        const defaults = {
            delay:100,
            direction:'right'
        }
        this.$element = $(element);
        this.settings = $.extend(defaults, options);
        this.init();
    }

    /**
     * @description Initialize marquee
     * @return {void}
     */
    init(){
        
    }
}