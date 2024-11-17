/*
 * ======================================================================
 * Class Progress
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Progress{

    /**
     * @description Constructor
     * @param {string} element - HTML element
     * @param {array} options - Array of progress options 
     */
    constructor(element, options){
        const defaults = {
            type:'generated',
            orientation:'horizontal'
        }
        this.$element   = $(element);
        this.settings   = $.extend(defaults, options);
        this.init();
    }

    animate(){
        
    }

    /**
     * @description Create progress
     * @return {void}
     */
    create(){
        this.$html = $('<div class="progress progress-primary"><div class="progress-bar progress-bar-primary" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">75%</div></div>');
        this.$html.find('.progress-bar').text($(this).attr('aria-valuenow'));
        this.$element.append(this.$html);
    }

    /**
     * @description Initialize the progress
     * @return {void}
     */
    init(){
        this.create();
    }
}