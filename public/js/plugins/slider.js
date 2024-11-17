/*
 * ======================================================================
 * Class Slider
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Slider{

    /**
     * @description Constructor 
     * @param {object} element HTML element
     * @param {array} options Array Slider options 
     */
    constructor(element, options){
        const defaults = {
            width:100,
            height:100,
            autoPlay:true,
            duration:30000,
            infiniteLoop:true        
        }
        this.$element   = $(element);
        this.settings   = $.extend(defaults, options);                                       
        this.current    = 0;
        this.total      = this.settings.entries.length - 1; 
        this.timer      = null;       
        this.version    = '0.1 beta';  
        this.init();
    }

    /**
     * @description Automatic playing
     * @return {void}
     */
    autoPlay(){
        const self = this;
        this.timer = setTimeout(function(){
            self.next();
            self.autoPlay();
        }, self.settings.duration);
    }

    /**
     * @description Create slider
     * @return {void}
     */
    create(){
        const self = this;
        let sl = '<ul class="list-no-style">';
        for(let i = 0;i<this.settings.entries.length; i++){
            sl += '<li><img src="' + this.settings.entries[i] + '" class="responsive"></li>';
        }
        sl += '</ul><span class="prev fa fa-chevron-left"></span><span class="next fa fa-chevron-right"></span>';
        sl += '<ul class="navButton">';
        for(let i = 0;i<this.settings.entries.length; i++){
            sl += '<li></li>';
        }        
        sl += '</ul>';
        this.$html = $(sl);
        this.$element.append(this.$html);        
        this.$element.find('ul.navButton li').on("click", function(e){self.click(e);});
    }

    /**
     * @description Click
     * @param {*} e 
     */
    click(e){
        this.$element.children('ul').children().eq(this.current).css({display:"none"});
        this.$element.children('ul').children().eq($(e.target).index()).css({display:"block"});
        this.$element.children('ul.navButton').children().eq(this.current).removeAttr('class');
        this.$element.children('ul.navButton').children().eq($(e.target).index()).attr('class', 'active');            
        this.current = $(e.target).index();
        if(this.settings.autoPlay){
            clearTimeout(this.timer);
            this.autoPlay();
        }
    }

    /**
     * @description Initialize slider
     * @return {void}
     */
    init(){
        this.create();
        this.$element.children('ul').eq(0).children('li').eq(0).css({display:"block"});
        this.$element.children('ul.navButton').children().eq(0).addClass("active");
        if(this.settings.autoPlay){
            this.autoPlay();
        }
        this.$element.find('.prev').on('click', this.prev);
        this.$element.find('.next').on('click', this.next);
        var self = this;
        $(window).on('resize', () => self.setHeight(self));
        $(window).on('keyup', function(event){
            switch(event.keyCode){
                case 37:
                    self.prev();
                    break;
                case 39:
                    self.next();
                    break;
            }
        });            
    }

    /**
     * @description Next image of slider
     * @return {void}
     */
    next(){
        const self = $(this).parent().data('mdt.slider') || this;
        if(self.current < self.total) {
            self.$element.children(0).children().eq(self.current).css({display:"none"});
            self.$element.children(0).children().eq(self.current + 1).css({display:"block"});
            self.$element.children().eq(3).children().removeClass('active');
            self.$element.children().eq(3).children().eq(self.current + 1).addClass('active');
            self.current++;
        } else {
            self.$element.children(0).children().eq(self.current).css({display:"none"});
            self.$element.children(0).children().eq(0).css({display:"block"});
            self.$element.children().eq(3).children().removeClass('active');
            self.$element.children().eq(3).children().eq(0).addClass('active');
            self.current = 0;        
        }
        if(self.settings.autoPlay){
            clearTimeout(self.timer);
            self.autoPlay();
        }    
    }

    /**
     * @description Previous image of slider
     * @return {void}
     */
    prev(){
        const self = $(this).parent().data('mdt.slider') || this;
        if(self.current > 0) {
            self.$element.children(0).children().eq(self.current).css({display:"none"});
            self.$element.children(0).children().eq(self.current - 1).css({display:"block"});
            self.$element.children().eq(3).children().removeClass('active');
            self.$element.children().eq(3).children().eq(self.current - 1).addClass('active');            
            self.current--;
        } else {
            self.$element.children(0).children().eq(self.current).css({display:"none"});
            self.$element.children(0).children().eq(self.total).css({display:"block"});
            self.$element.children().eq(3).children().removeClass('active');
            self.$element.children().eq(3).children().eq(self.total).addClass('active');            
            self.current = self.total;        
        }
        if(self.settings.autoPlay){
            clearTimeout(self.timer);
            self.autoPlay();
        }        
    }

    /**
     * @description Set height of slider image
     * @param {*} self 
     */
    setHeight(self){
        self.$element.css({
            height:self.$element.find('li').eq(self.current).children()[0].clientHeight
        });
    }
}

export {Slider};