/*
 * ======================================================================
 * Class ScrollSpy
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class ScrollSpy{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of ScrollSpy options
     */
    constructor(element, options){
        const defaults = {
            offset:10
        }
        this.$element = $(element);
        this.settings = $.extend(defaults, options);
        this.$body = $(document.body);
        this.offsets = [];
        this.targets = [];
        this.version = '0.1 beta';
    }

    /**
     * 
     * @param {*} target 
     */
    activate(target){
        this.activeTarget = target
        this.clear();
    }

    clear(){

    }

    init(){

    }

    getScrollHeight(){
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    }

    process(){
        var scrollTop       = this.$scrollElement.scrollTop() + this.settings.offset;
        var scrollHeight    = this.getScrollHeight();      
        var maxScroll       = this.settings.offset + scrollHeight - this.$scrollElement.height();
        var offsets         = this.offsets;
        var targets         = this.targets;
        var activeTarget    = this.activeTarget;
        var i;
        //
        if(this.scrollHeight != scrollHeight){
            this.refresh();
        }
    }

    refresh(){
        const self = this;
    }
}