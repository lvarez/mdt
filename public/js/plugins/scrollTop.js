/*
 * ======================================================================
 * Class ScrollTop
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class ScrollTop{

    /**
     * @description Constructor
     * @param {object} element HTML element 
     * @param {array} options Array of scrollTop options
     */
    constructor(element, options){
        const defaults = {
            width:50,
            height:50,
            className:'scrollTop',
            text:'<i class="fa fa-chevron-up"></i>'
        }
        this.$element = $(element);
        this.settings = $.extend(defaults, options);
        this.init();
    }

    /**
     * @description Click on scrollTop
     * @param {object} e Event
     */
    click(e){
        e.preventDefault();
        window.scrollTo(0, 0);
    }

    /**
     * @description Initialize scrollTop
     * @return {void}
     */
    init(){
        let scrollTop = $(`<div class="${this.settings.className}"><a href="#" class="btn btn-sm btn-first" title="Scroll top"><strong>${this.settings.text}</strong></a></div>`);
        $(scrollTop).on('click', this.click);
        $('body').append(scrollTop);
    }
}

$(window).on('scroll', function(){
    if($(window).scrollTop() > 100){
        $('.scrollTop').stop().fadeIn(100);
    } else if($(window).scrollTop() < 100){
        $('.scrollTop').stop().fadeOut(100);
    }
});

export {ScrollTop};