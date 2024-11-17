/*
 * ======================================================================
 * Class Modal
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Modal{

    /**
     * @description Constructor
     * @param {object} element - HTML element
     * @param {array} options - Array of modal window options
     */
    constructor(element, options){
        const defaults = {
            animate:true,
            animation:'displace',
            dataType:'JSON',
            orientation:'top',
            backdrop:true,
            autoOpen:false,
            resizable:false,
            escape:true,
            scroll:false,
            width:100,
            height:100,
            title:'MDT Modal',
            footer:'MDT Footer',
            template:'video',
            content:'Content of modal box',
            contentType:'json',
            url:'web/json/modal.json',
            duration:600,
            trigger:'click',
            videoSource:'web/mp4/Fergie.mp4'
        }
        this.$element = $(element);
        this.settings = $.extend(defaults, options);
        this.init();
    }

    /**
     * @description Animate the modal window
     * @param {*} self 
     * @param {*} hide 
     * @param {*} callback 
     */
    animate(self, hide = false, callback = null){
        const offset = self.$element.offset();
        let top = offset.top;
        let left = offset.left;
        top = ($(window).height() / 2) - (self.$html.height() / 2);
        left = ($(window).width() / 2) - (self.$html.width() / 2);
        const pageWidth = $(window).width();
        const pageHeight  = $(document).height();
        const width = self.$html.innerWidth();
        const height = self.$html.innerHeight();
        switch(self.settings.animation){
            case 'displace':
                switch(self.settings.orientation){
                    case 'top':
                        if(!hide){
                            this.$html.css({
                                display:'block',
                                top:'-' + pageHeight + 'px',
                                left:left  + 'px'
                            });
                            this.$html.animate({
                                top:top + 'px',
                                left:left + 'px'
                            }, this.settings.duration, callback); 
                        }else{
                            this.$html.css({
                                display:'block',
                                top:top + 'px',
                                left:left  + 'px'
                            });
                            this.$html.animate({
                                top:'-' + pageHeight + 'px',
                                left:left + 'px'
                            }, this.settings.duration, callback); 
                        }
                        break;
                    case 'right':
                        if(!hide){
                            this.$html.css({
                                display:'block',
                                top:top + 'px',
                                left:left + pageWidth + 'px'
                            });
                            this.$html.animate({
                                top:top + 'px',
                                left:left + 'px'
                            }, this.settings.duration, callback);  
                        }else{
                            this.$html.css({
                                top:top + 'px',
                                left:left + 'px'
                            });
                            this.$html.animate({
                                top:top + 'px',
                                left:left + pageWidth + 'px'
                            }, this.settings.duration, callback);  
                        }                   
                        break;
                    case 'bottom':
                        if(!hide){
                            this.$html.css({
                                display:'block',
                                top:top + pageHeight + 'px',
                                left:left + 'px'
                            });
                            this.$html.animate({
                                top:top + 'px',
                                left:left + 'px'
                            }, this.settings.duration, callback); 
                        }else{
                            this.$html.css({
                                top:top + 'px',
                                left:left + 'px'
                            });
                            this.$html.animate({
                                top:top + pageHeight + 'px',
                                left:left + 'px'
                            }, this.settings.duration, callback); 
                        }
                        break;
                    case 'left':
                        if(!hide){
                            this.$html.css({
                                display:'block',
                                top:top + 'px',
                                left:left - pageWidth + 'px'
                            });
                            this.$html.animate({
                                top:top + 'px',
                                left:left + 'px'
                            }, this.settings.duration, callback);  
                        }else{
                            this.$html.css({
                                top:top + 'px',
                                left:left + 'px'
                            });
                            this.$html.animate({
                                top:top + 'px',
                                left:left - pageWidth + 'px'
                            }, this.settings.duration, callback);  
                        } 
                        break;
                }               
                break;
            case 'fade':
                if(!hide){
                    this.$html.css({
                        display:'none',
                        top:top + 'px',
                        left:left + 'px'
                    });
                    this.$html.fadeIn(this.settings.duration, callback);
                }else{
                    this.$html.css({
                        display:'block',
                        top:top + 'px',
                        left:left + 'px'
                    });
                    this.$html.fadeOut(this.settings.duration, callback);
                }
                break;
            case 'zoom':
                if(!hide){
                    this.$html.css({
                        display:'block',
                        top:top + (height/2) + 'px',
                        left:left + (width/2) + 'px',
                        width:'0%',
                        height:'0%'
                    });
                    this.$html.animate({
                        top:top + 'px',
                        left:left + 'px',
                        width:width + 'px',
                        height:height + 'px',
                    }, this.settings.duration, callback);
                }else{
                    this.$html.css({
                        top:top + 'px',
                        left:left + 'px',
                        width:width + 'px',
                        height:height + 'px'
                    });
                    this.$html.animate({
                        top:top + (height/2) + 'px',
                        left:left + (width/2) + 'px',
                        width:'0%',
                        height:'0%'
                    }, this.settings.duration, callback);   
                }
                break;
        }
    }

    /**
     * 
     */
    click(){
        const audioplayer = $('[data-plugin="audioplayer"]').data('mdt.audioplayer');
        if(audioplayer !== undefined && !audioplayer.$audio[0].paused){
            audioplayer.stop(audioplayer);
            audioplayer.setCloseAnalyser(audioplayer);
        }
        if(!this.settings.scroll){
            $('body').css({
                overflow:'hidden'
            });
        }
        if(this.settings.contentType === 'json'){
            this.getData();
        }else{
            this.createMask();
            this.create();
        }
    }

    /**
     * @description Create modal window
     * @return {void}
     */
    create(){
        const self = this;
        this.$html = $(this.createTemplate());
        if(this.settings.template === 'video'){
            this.$html.find('video').on('ended', ()=>{
                self.hide(self);
            });
            this.$html.find('video').on('contextmenu', (e)=>{
                e.preventDefault();
            });
            const src = this.$html.find('source');
            src[0].src = this.settings.videoSource;
            // const video = $(this.$html).find('video');
            // video.on('loadedmetadata', function(e){
            //     video.width(video[0].videoWidth);
            //     video.height(video[0].videoHeight);
            // });
        }
        $('body').append(this.$html);   
        $('.mdt-modal-close').on('click', function(){
            self.hide(self);
        });
    }

    /**
     * @description CreateMask() - 
     * @return {void}
     */
    createMask(){
        const self = this;
        const mask = $('<div class="mdt-modal-backdrop in"></div>');
        $('#blur').css({    
            filter:'blur(5px)'
        });
        if(this.settings.backdrop){
            $(mask).on("click", ()=>{
                self.hide(self);
            });
        }
        $(mask).on("contextmenu", (e)=>{
            e.preventDefault();
        });
        $('body').append(mask);
    }

    /**
     * @description Create HTML template
     * @returns string HTML template
     */
    createTemplate(){
        let html=`
            <div class="mdt-modal in">
                <div class="mdt-modal-close"><i class="fa fa-times"></i></div>
                <div class="mdt-modal-dialog">
        `;
        if(this.settings.template==='video'){
            html += `
                    <div class="mdt-modal-content video">
            `;
        }else{
            html += `
                    <div class="mdt-modal-content">
            `;
        }
        if(this.settings.title !== null && this.settings.title !== ''){
            html += `
                        <div class="mdt-modal-header">${this.settings.title}</div>
            `;
        }
        html += `
                        <div class="mdt-modal-body">${this.settings.content}</div>
        `;
        if(this.settings.footer !== null && this.settings.footer !== ''){
            html += `
                        <div class="mdt-modal-footer">${this.settings.footer}</div>
            `;
        }
        html += `
                    </div>
                </div>
            </div>
        `;
        return html;   
    }

    /**
     * @description 
     * @returns 
     */
    getContent(){
        if(typeof this.settings.content === 'string'){
            return this.settings.content;
        }else{
            return this.settings.content[2].content
        }
    }

    /**
     * @description 
     * @return {void}
     */
    getData(){
        const self = this;
        $.ajax({
            type:'GET',
            url:self.settings.url,
            dataType:self.settings.dataType,
            success:(data) => {
                try{
                    for(let i=0;i<data.templates.length;i++){
                        if(data.templates[i].name === this.settings.template){
                            self.settings.title = data.templates[i].title;
                            self.settings.content = data.templates[i].content;
                            self.settings.footer = data.templates[i].footer;
                            break;
                        }
                    }
                }catch(ex){
                    console.log(ex);
                }
            },
            complete:() => {
                if(self.settings.backdrop){
                    self.createMask();
                }             
                self.create();  
                if(self.settings.animate){
                    self.animate(self, false, ()=>{
                        if(this.settings.template === 'video'){
                            this.$html.find('video')[0].play();
                        }
                    });
                }else{
                    self.show();
                }
            },
            error:(result) => console.error(result)
        });
    }

    /**
     * @description
     * @return {string} Title of modal window 
     */
    getTitle(){
        if(typeof this.settings.content === 'string'){
            return this.settings.title;
        }else{
            return this.settings.content[2].title;
        }        
    }

    /**
     * @description Initialize the modal window
     * @return {void}
     */
    init(){
        const self = this;
        if(this.$element.data('options') !== undefined){
            const options = this.$element.data('options');
            this.settings = $.extend(this.settings, options);
        }
        switch(self.settings.trigger){
            case 'dblclick':
                self.$element.dblclick(function(e){
                    self.click();
                });
                break;
            case 'click':
                self.$element.on('click', function(){
                    self.click();
                });
                break;
            case 'hover':
                self.$element.on('mouseover', function(){
                    self.create();
                    self.createMask();
                });                
                break;
        }
        if(this.settings.escape){
            $(window).on('keyup', (event) => {
                if(event.keyCode === 27){
                    //self.hide(self);
                }
            });
        }
    }
    
    /**
     * @description Hide modal window
     * @param {*} self 
     */
    hide(self){
        if(self.settings.backdrop){
            $(self.$html).prev().remove();
        }
        self.animate(self, true, ()=>{
            $(self.$html).remove();
            if(!this.settings.scroll){
                $('body').css({
                    overflow:'auto scroll'
                }); 
            }  
            $('#blur').css({
                filter:'blur(0)'
            });  
        });                   
    }

    /**
     * @description Show modal window
     * @return {void}
     */
    show(){
        const $window = $(window);
        $(this.$html).css({
            'top':(($window.height() / 2) - $window.scrollTop()) - (this.$html.children().outerHeight() / 2) + 'px',
            'left':(($window.width() / 2) - (this.settings.width / 2)) + 'px'
        });
    }
}

export {Modal};