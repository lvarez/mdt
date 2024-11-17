/*
 * ======================================================================
 * Class VideoPlayer
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class VideoPlayer{

    /**
     * @description Constructor
     * @param {object} element HTML element 
     * @param {array} options Array of video player options 
     */
    constructor(element, options){
        const defaults = {
            width:600,
            height:300,
            autoPause:false,
            autoPlay:true,
            controls:true,
            loop:true,
            replay:true,
            source:'web/mp4/archive/The_Man_Feel_It_Still.mp4',
            styles:'video-player-container',
            theme:'dark',
        }
        this.$element   = $(element);
        this.settings   = $.extend(defaults, options);
        this.index      = 0;
        this.init();
    }

    /**
     * @description Create video player
     * @return {void}
     */
    create(){
        const html = `
            <div class="${this.settings.styles}">
                <video preload="auto" controls width="${this.settings.width}" height="${this.settings.height}">
                    <source src="${this.settings.source}" type="video/mp4">
                </video>
                <div class="videoControls">
                    <bouton><i class="fa fa-play"></i></bouton>
                    <span>0.00/3:22</span>
                    <bouton><i class="fas fa-expand"></i></bouton>   
                </div>
            </div>
        `;
        this.$html = $(html);
        this.$element.append(this.$html);
    }

    /**
     * @description Get data of video player
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
     * @description Initialize video player
     * @return {void}
     */
    init(){
        this.create();
    }

    /**
     * @description Next video
     * @param {object} self HTML element 
     */
    Next(self){
        
    }

    /**
     * @description Play video
     * @param {object} self HTML element
     */
    play(self){
        if(self.video[0].paused){
            self.video[0].play();
            this.innerHTML = '<span class="fa fa-pause"></span>';
        }else{
            self.video[0].pause();
            this.innerHTML = '<span class="fa fa-play"></span>';
        }
    }

    /**
     * @description Previous video
     * @param {object} self HTML element 
     */
    prev(self){
        self.video[0].pause();
    }

    /**
     * @description Stop video
     * @param {object} self HTML element 
     */
    stop(self){
        self.video[0].pause();                                                                          
        self.video[0].currentTime = 0; 
        self.$html.find('.play').html('<span class="fa fa-play"></span>');
    }
}

export {VideoPlayer};