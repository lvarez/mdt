/*
 * ======================================================================
 * Class ToolTip
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Tooltip{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of tooltip options 
     */
    constructor(element, options){
        const defaults = {
            animate:false,
            contentType:'title',        
            dataType:'json',
            debug:false,
            duration:500,
            direction:'top',
            isDisabled:false,
            timeout:100,
            trigger:'hover',
            url:null
        }
        this.direction  = null;
        this.$element   = $(element);
        this.$html      = null;
        this.settings   = $.extend(defaults, options);
        this.version    = '0.1 beta';
        this.init();
    }

    /**
     * @description Anim
     * @param {string} type Type of animation
     * @param {function} callback Function callback
     */
    anim(type, callback){
        const self = this;
        switch(type){
            case 'fadeIn':
                this.$html.css({
                    opacity:0
                });
                this.$html.stop().animate({
                    opacity:1
                }, self.settings.duration, callback);
                break;
            case 'fadeOut':           
                this.$html.stop().animate({
                    opacity:0
                }, self.settings.duration, callback);
                break;
        }
    }

    /**
     * @description Get offset of element
     * @param {object} el 
     * @return {object} 
     */
    getOffset(el) {
        let x = 0;
        let y = 0;
        while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top:y, left:x };
    }

    getElementPosition(a) {
        var b = a.getBoundingClientRect();
        return {
          clientX: a.offsetLeft,
          clientY: a.offsetTop,
          viewportX: (b.x || b.left),
          viewportY: (b.y || b.top)
        }
    }

    getDirection(self){
        const offset = self.getOffset(self.$element[0]);
        let direction = self.settings.direction;
        switch(direction){
            case 'top':
            case 'top-left':
            case 'top-right':
                if(offset.top - window.pageYOffset + self.$element[0].offsetHeight < self.$html[0].offsetHeight + self.$element[0].offsetHeight){
                    switch(direction){
                        case 'top':
                            direction = 'bottom';
                            break;
                        case 'top-left':
                            direction = 'bottom-left';
                            break;
                        case 'top-right':
                            direction = 'bottom-right';
                            break;
                    }
                }   
                break; 
            case 'bottom':
            case 'bottom-left':
            case 'bottom-right':
                if(offset.top + self.$element[0].offsetHeight + self.$html[0].offsetHeight > window.innerHeight + window.pageYOffset){
                    switch(direction){
                        case 'bottom':
                            direction = 'top';
                            break;
                        case 'bottom-left':
                            direction = 'top-left';
                            break;
                        case 'bottom-right':
                            direction = 'top-right';
                            break;
                    }
                }                
                break;   
        }
        return direction;
    }

    getPosition(self){
        const offset = self.getOffset(self.$element[0]);
        let top;
        let left;
        switch(self.direction){
            case 'top':
                top = offset.top - self.$html[0].offsetHeight;
                left = offset.left + ((self.$element[0].offsetWidth / 2) - (self.$html[0].offsetWidth / 2));
                break;
            case 'top-left':
                top = offset.top - self.$html[0].offsetHeight;
                left = offset.left;
                break;
            case 'top-right':
                top = offset.top - self.$html[0].offsetHeight;
                left = offset.left + (self.$element[0].offsetWidth - self.$html[0].offsetWidth) + 2.5;
                break;
            case 'left':
                top = (offset.top + (self.$element[0].offsetHeight / 2) - (self.$html[0].offsetHeight / 2));
                left = offset.left - self.$html[0].offsetWidth;
                break;                
            case 'right':
                top =  (offset.top + (self.$element[0].offsetHeight / 2) - (self.$html[0].offsetHeight / 2));
                left = offset.left + self.$element[0].offsetWidth;
                break;
            case 'bottom':
                top = offset.top + self.$element[0].offsetHeight;
                left = offset.left + ((self.$element[0].offsetWidth / 2) - (self.$html[0].offsetWidth / 2));
                break;
            case 'bottom-left':
                top = offset.top + self.$element[0].offsetHeight;
                left = offset.left;
                break;
            case 'bottom-right':
                top = offset.top + self.$element[0].offsetHeight;
                left = offset.left + (self.$element[0].offsetWidth - self.$html[0].offsetWidth);
                break;
        }
        return {
            top:top,
            left:left            
        };   
    }

    /**
     * @description Get data of tooltip
     * @return {void}
     */
    getData(){
        const self = this;
        $.ajax({
            type:'GET',
            url:self.settings.url,
            dataType:self.settings.dataType,
            success:(data) => self.entries = typeof data != 'object' ? JSON.parse(data) : data,
            complete:() => self.create(),
            error:(e) => console.error(e)
        }); 
    }

    /**
     * 
     * @return 
     */
    getTitle(){
        if(this.$element.attr('title') !== undefined){
            if(this.$element.attr('title') !== ''){
                return this.$element.attr('title');
            }else{
                console.warn("Le titre n\'a pas été renseigné");
                return "<span class='error'><i class='fa fa-exclamation-circle'></i> Le titre n\'a pas été renseigné</span>";
            }
        }else if(this.$element.attr('data-content') !== undefined){
            if(this.$element.attr('data-content').substring(0, 1) === '#'){
                this.settings.contentType = 'data-content';
                let element = $(this.$element.attr('data-content'));
                return element.html();
            }else{
                this.settings.contentType = 'data-content';
                return this.$element.attr('data-content');
            }
        }else{
            return this.$element.attr('title');
        }
    }

    /**
     * @description Hide tooltip
     * @return {void} 
     */
    hide(){
        const self = $(this).data('mdt.tooltip');
        if(self.settings.isDisabled){
            return;
        }
        if(self.settings.contentType === 'title'){
            let title = self.$html.find('.mdt-tooltip-inner').html();
            if(title.indexOf('error')){
                $(self.$element).attr('title', self.$html.find('.mdt-tooltip-inner').html());
            }else{
                $(self.$element).attr('title', '');
            }
        }
        if(self.settings.animate){
            self.anim('fadeOut', function(){
                self.$html.remove();
            });
        }else{
            self.$html.remove();         
        }
        if(self.settings.debug){
            console.log("Suppression de l'infobulle");
        }
    }

    /**
     * @description Initialize tooltip
     * @return {void}
     */
    init(){
        let trigger;
        if(this.$element.attr('data-options') !== undefined && this.$element.attr('data-options') !== ''){
            this.settings = $.extend(this.settings, this.$element.data('options'));
        }
        switch(this.settings.trigger){
            case 'click':
                this.$element.on("click", () => {this.show(this)});
                this.$element.on("mouseout", this.hide);
                break;
            case 'hover':
                this.$element.on("mouseover", () => {this.show(this)});
                this.$element.on("mouseout", this.hide);
                break;
            case 'focus':
                this.$element.on("focus", () => {this.show(this)});
                this.$element.on("blur", this.hide);            
                break;
        }
    }

    setColor(html){
        html.find('.mdt-tooltip-inner').css({
            'color':'#000000',
            'background-color':'#FDFDFD'
        });
        html.find('.mdt-tooltip-arrow').css({
            'border-bottom-color':'#FDFDFD'
        });
    }

    show(self){
        if(self.settings.isDisabled){
            return;
        } 
        self.$html = $('<div class="mdt-tooltip in ' + this.settings.direction + '"><div class="mdt-tooltip-arrow"></div><div class="mdt-tooltip-inner">' + self.getTitle() + '</div></div>');
        self.$element.removeAttr('title');
        $('body').append(self.$html);
        self.direction = self.getDirection(self);
        $(self.$html).removeClass(self.settings.direction);
        $(self.$html).addClass(self.direction);
        var positions = self.getPosition(self);
        self.$html.css({
            top:positions.top + 'px',
            left:positions.left + 'px' 
        });
        if(self.settings.animate){
            self.anim('fadeIn');
        }
        if(self.settings.debug){
            console.log('Top : ' + self.$html.offset().top + 'px Left : ' + self.$html.offset().left + "px");
        }
    }

    /**
     * 
     * @param {*} self 
     * @param {*} enabled 
     */
    setDisabled(self, enabled){
        if(enabled){
            self.settings.isDisabled = false;
        }else{
            self.settings.isDisabled = true;
        }
    }

    toConsole(){
        console.groupCollapsed('Tooltip');
        console.log('Plugin : ');
        console.log(this);
        console.log('Settings : ');
        console.log(this.settings);
        console.groupEnd();
    }
}

export {Tooltip};