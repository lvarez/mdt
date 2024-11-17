/*
 * ======================================================================
 * Class Range
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Range{

    /**
     * @description Constructor
     * @param {string} element - HTML element 
     * @param {array} options - Array of range options 
     */
    constructor(element, options){
        const defaults = {
            min:1,
            max:100,
            step:10
        }
        this.$element   = $(element);
        this.settings   = $.extend(defaults, options);
        this.$progress  = null;
        this.$thumb     = null;
        this.$track     = null;
        this.init();
    }

    /**
     * @description Initialize the range
     * @returns {void}
     */
    init(){
        this.$progress = $(this.$element.find('.range-progress'));
        this.$thumb = $(this.$element.find('.range-thumb'));
        this.$track = $(this.$element.find('.range-track')); 
        this.$element.on('click', (e) => {this.move(e)})
    }

    /**
     * @description Move the range
     * @param {*} e
     * @returns {void} 
     */
    move(e){
        let left = e.clientX - this.$element[0].getBoundingClientRect().left;
        this.$track.css({
           left:left 
        });
        this.$progress.css({
            width:left
        });           
   }
}