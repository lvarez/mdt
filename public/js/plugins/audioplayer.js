import {Canvas} from './canvas.js';

/*
 * ======================================================================
 * Class AudioPlayer
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown - Vazquez Luis
 * ====================================================================== 
 */
class AudioPlayer{

    /**
     * @description Constructor
     * @param {object} element HTML element 
     * @param {array} options Array of audio player options 
     */
    constructor(element, options){
        const defaults = {
            width:300,
            height:50,
            className:'audio-player-container',
            playListDuration:3000,
            dataType:'json',
            url:'./library/php/getFiles.php',
            volume:100
        }
        this.audioContext       = null;
        this.source             = null;
        this.animationFrame     = null;
        this.audioAnalyser      = null;
        this.analyserColor      = '#3677ae';
        this.analyserStdColor   = '#3677ae';
        this.analyserDarkColor  = '#27313a';
        this.analyserRandColor  = false;
        this.$analyser          = null;
        this.canvas             = null;
        this.$element           = $(element);
        this.settings           = $.extend(defaults, options);
        this.$html              = null;
        this.analyserOpen       = false;
        this.$audio             = null;
        this.$source            = null;
        this.$preloader         = null;
        this.$progress          = null;
        this.items              = null;
        this.param              = null;
        this.paramOpen          = false;
        this.$playList          = null;
        this.$timeLine          = null;
        this.playListOpen       = false;
        this.index              = 0;
        this.timer              = null;
        this.volume             = this.settings.volume;
        this.rate               = 1;
        this.replay             = false;
        this.compteur           = 0;
        this.init();
    }

    /**
     * @description Click
     * @param {object} self HTML element 
     * @param {object} e Event 
     */
    click(self, e){
        self.$audio[0].pause();
        self.$source.attr('src', $(e.target).children()[0].value);
        self.$element.find('.inputRange').children()[0].value = self.volume;
        self.$audio[0].load();
        self.$audio[0].play();
        self.$html.find('.play').html('<span class="fa fa-pause"></span>');
        self.$playList.find('li').removeAttr('class');
        self.$playList.find('li').eq( $(e.target).index()).attr('class', 'active');
        self.index = $(e.target).index();
        self.displayPlayList(self);
        if(this.analyserRandColor){
            this.analyserColor = this.getColor();
        }         
    }

    /**
     * @description Click on time line of audio player
     * @param {object} self HTML element 
     * @param {object} e Event 
     */
    clickTimeLine(self, e){
        if(self.$audio[0].duration !== Infinity && isNaN(self.$audio[0].duration) !== true){
            const mouseX = e.clientX;
            const bounds = self.$timeLine[0].getBoundingClientRect();
            const duration = self.$audio[0].duration;
            self.$element.find('.inputRange').children()[0].value = self.volume;
            self.$audio[0].pause();
            self.$audio[0].currentTime = Math.round((duration/150) * (mouseX - bounds.left));
            self.$audio[0].play();
            self.$html.find('.play').html('<span class="fa fa-pause"></span>');
        }
    }

    /**
     * @description Create audio player
     * @return {void}
     */
    create(){
        const self = this;       
        const html = `
            <div class="${self.settings.className}">
                <audio id="audio" preload="auto" crossorigin = "anonymous">
                    <source src="" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
                <div class="audio-analyser-container">
                    <div class="audio-analyser"></div>
                </div>
                <div class="audio-param">
                    <div class="row">
                        <div class="col-5">
                            <p>Thèmes</p>
                            <div class="switchRadio switchRadio-xs">
                                <input type="radio" id="standard" name="theme" value="light" checked="checked">
                                <label for="standard">Light</label>
                                <input type="radio" id="dark" name="theme" value="dark">
                                <label for="dark">Dark</label>
                            </div>
                        </div>
                        <div class="col-7">
                            <p>Volume</p>
                            <div class="inputRange">
                                <input type="range" name="volume" min="0" max="100" value="100" data-value="100" oninput="$(this).attr('data-value', this.value)">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <p>Vitesse de lecture</p>
                            <div class="switchRadio switchRadio-xs">
                                <input type="radio" id="0.6" name="rate" value="0.6">
                                <label for="0.6">0.6</label>
                                <input type="radio" id="0.8" name="rate" value="0.8">
                                <label for="0.8">0.8</label>
                                <input type="radio" id="0.9" name="rate" value="0.9">
                                <label for="0.9">0.9</label>
                                <input type="radio" id="1" name="rate" value="1" checked="checked">
                                <label for="1">1</label>
                                <input type="radio" id="1.1" name="rate" value="1.1">
                                <label for="1.1">1.1</label>
                                <input type="radio" id="1.2" name="rate" value="1.2">
                                <label for="1.2">1.2</label>
                                <input type="radio" id="1.4" name="rate" value="1.4">
                                <label for="1.4">1.4</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <p>Analyser color</p>
                            <div class="switchRadio switchRadio-xs">
                                <input type="radio" id="standardColor" name="analyserColor" value="standardColor" checked="checked">
                                <label for="standardColor">Standard</label>
                                <input type="radio" id="randomColor" name="analyserColor" value="randomColor">
                                <label for="randomColor">Random</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <p>Couleur standard</p>
                            <input type="color" id="analyserColor" class="mdt-input-color" value="${this.analyserColor}">
                        </div>
                    </div>
                </div>
                <div class="audio-play-list"></div>
                <div class="audio-player">
                    <button class="play"><span class="fa fa-play"></span></button>
                    <button class="volume"><span class="fa fa-volume-up"></span></button>
                    <span class="analyser fa fa-signal"></span>   
                    <span class="params fa fa-cog"></span>   
                    <span class="playList fa fa-bars"></span>
                    <span class="first fa fa-fast-backward"></span>
                    <span class="prev fa fa-step-backward"></span>
                    <span class="stop fa fa-stop"></span>
                    <span class="next fa fa-step-forward"></span>
                    <span class="end fa fa-fast-forward"></span>
                    <span class="replay fa fa-redo"></span>
                    <span class="audio-time-total">00.00</span>
                    <span class="audio-time">00.00</span>
                    <div class="audio-timeline">
                        <div class="audio-preloader"></div>
                        <div class="audio-progress"></div>
                    </div>
                </div>
            </div>
        `;
        this.$html          = $(html);
        this.$analyser      = this.$html.find('.audio-analyser');
        this.$audio         = this.$html.find('audio');
        this.$source        = this.$html.find('source');
        this.$playList      = this.$html.find('.audio-play-list');
        this.$param         = this.$html.find('.audio-param');
        this.$timeLine      = this.$html.find('.audio-timeline');
        this.$preloader     = this.$html.find('.audio-preloader');
        this.$progress      = this.$html.find('.audio-progress');
        this.$element.append(this.$html);
        this.$element.css({
            display:'inline-block',
            width:self.settings.width,
            height:self.settings.height
        });
        this.setEvents();
    }

    /**
     * @description Display analyser
     * @param {object} self HTML element
     * @return {void}
     */
    displayAnalyser(self){
        if(!self.analyserOpen){
            self.$html.find('.analyser').addClass('on');
            $(self.$html).find('.audio-analyser-container').css({
                top:'45px',
                minHeight:'50px',
                opacity:'1'
            });
            self.analyserOpen = true;
            if(self.audioContext === null){
                self.audioContext = new AudioContext();
                self.source = self.audioContext.createMediaElementSource(self.$audio[0]);
                self.audioAnalyser = self.audioContext.createAnalyser();
                self.audioAnalyser.smoothingTimeConstant = 0.5;
                self.source.connect(self.audioAnalyser);
                self.audioAnalyser.connect(self.audioContext.destination);
            }
            self.getAnalyser()
            self.animationFrame = requestAnimationFrame(()=>{
                self.frameAnalyser(self);
            });     
        }else{
            self.$html.find('.analyser').removeClass('on');
            $(self.$html).find('.audio-analyser-container').css({
                bottom:'0',
                minHeight:'10px',
                opacity:'0'
            }); 
            self.analyserOpen = false;
            cancelAnimationFrame(self.animationFrame);
            self.canvas.$canvas.remove();
        }
    }

    /**
     * @description Display play list
     * @param {object} self HTML element 
     * @return {void}
     */
    displayPlayList(self){
        if(self.paramOpen){
            self.displayParam(self);
        }
        if(!self.playListOpen){
            self.$html.find('.playList').addClass('on');
            $(self.$html).find('.audio-play-list').css({
                top:'-174px',
                minHeight:'175px',
                opacity:'1'
            });
            self.playListOpen = true;
            clearTimeout(self.timer);
            self.timer = setTimeout(function(){
                self.displayPlayList(self);
            }, self.settings.playListDuration);
            if(self.$playList.find('li').length > 0){
                self.$playList.scrollTop(self.$playList.find('li').eq(self.index)[0].offsetTop);            
            }
        }else{
            self.$html.find('.playList').removeClass('on');
            $(self.$html).find('.audio-play-list').css({
                top:'0',
                minHeight:'10px',
                opacity:'0'
            }); 
            self.playListOpen = false;
            clearTimeout(self.timer);
        }
    }

    /**
     * @description Display parameters
     * @param {object} self HTML element
     */
    displayParam(self){
        if(self.playListOpen){
            self.displayPlayList(self);
        }        
        if(!self.paramOpen){
            self.$html.find('.params').addClass('on');
            $(self.$html).find('.audio-param').css({
                top:'-174px',
                minHeight:'175px',
                opacity:'1'
            });
            self.paramOpen = true;
            clearTimeout(self.timer);
            self.timer = setTimeout(function(){
                self.displayParam(self);
            }, self.settings.playListDuration);
        }else{
            self.$html.find('.params').removeClass('on');
            $(self.$html).find('.audio-param').css({
                top:'0',
                minHeight:'10px',
                opacity:'0'
            }); 
            self.paramOpen = false;
            clearTimeout(self.timer);
        }        
    }

    /**
     * @description End play list sound
     * @param {object} self HTML element
     * @return {void} 
     */
    end(self){
        if(self.items === null){
            console.info('La playlist n\'est pas chargée');
            return;
        }
        self.index = (self.items.length-1);
        if(!self.$audio[0].paused){
            self.$audio[0].pause();
        }
        self.$source.attr('src', self.$playList.find('li').eq(self.index).children()[0].value);
        self.$audio[0].volume = self.volume / 100;
        self.$element.find('.inputRange').children()[0].value = self.volume;
        self.$audio[0].load();
        self.$audio[0].play();
        self.$audio[0].playbackRate = self.rate;
        self.$html.find('.play').html('<span class="fa fa-pause"></span>');   
        self.$playList.find('li').removeAttr('class');
        self.$playList.find('li').eq(self.index).attr('class', 'active');
        self.$playList.scrollTop(self.$playList.find('li').eq(self.index)[0].offsetTop);
        if(this.analyserRandColor){
            this.analyserColor = this.getRandomColor();
            self.$html.find("#analyserColor").val(self.analyserColor);
        }   
    }

    /**
     * @description First play list sound
     * @param {*} self 
     * @return {void}
     */
    first(self){
        if(self.items === null){
            console.info('La playlist n\'est pas chargée');
            return;
        }
        self.index = 0;      
        if(!self.$audio[0].paused){
            self.$audio[0].pause();
        }
        self.$source.attr('src', self.$playList.find('li').eq(self.index).children()[0].value);
        self.$audio[0].volume = self.volume / 100;
        self.$element.find('.inputRange').children()[0].value = self.volume;
        self.$audio[0].load();
        self.$audio[0].play();
        self.$audio[0].playbackRate = self.rate;
        self.$html.find('.play').html('<span class="fa fa-pause"></span>');    
        self.$playList.find('li').removeAttr('class');
        self.$playList.find('li').eq(self.index).attr('class', 'active');
        self.$playList.scrollTop(self.$playList.find('li').eq(self.index)[0].offsetTop);
        if(this.analyserRandColor){
            this.analyserColor = this.getRandomColor();
            self.$html.find("#analyserColor").val(self.analyserColor);
        }    
    }

    /**
     * @description 
     * @param {object} self HTML element 
     */
     frameAnalyser(self){
        const bars = 128;
        const fbc = new Uint8Array(this.audioAnalyser.fftSize);
        this.audioAnalyser.getByteFrequencyData(fbc);
        self.canvas.ctx.clearRect(-1, -1, 269, 36);
        for(let i=0;i<bars;i++){
            let barX = i * Math.ceil(268 / bars);
            let barWidth = Math.ceil(268 / bars);
            let barHeight = - Math.ceil((35 / 255) * fbc[i]);
            this.canvas.drawRectangle(self.canvas, barX, this.canvas.$canvas.height(), barWidth, barHeight, this.analyserColor);
        }
        self.animationFrame = requestAnimationFrame(()=>{
            self.frameAnalyser(self);
        });      
    }

    /**
     * @description Get analyser
     * @return {void}
     */
    getAnalyser(){
        this.canvas = new Canvas(null, {width:'268px', height:'35px'});
        this.canvas.create();
        this.$html.find('.audio-analyser').append(this.canvas.$canvas);
    }

    /**
     * @description Get data of play list
     * @return {void}
     */
    getData(){
        const self = this;
        const playList = self.$element.find('.audio-play-list');
        $.ajax({
            dataType:self.settings.dataType,
            type:'GET',
            url:self.settings.url,
            beforeSend:()=>{playList.append('<div class="spinner-container"><span class="spinner"></span><span class="legend">Loading</span></div>')},
            success:(data) => {self.items = data},
            complete:() => {
                playList.html('');
                playList.append(self.getPlayList(self));
            },
            error:(result) => {console.error(result)}
        });
    }

    /**
     * @description Get play list
     * @returns 
     */
    getPlayList(self){
        let html = '<ol>';
        for(var i=0;i<(this.items.length);i++){
            if(this.index === i){
                html += '<li class="active"><input value="' + this.items[i].value + '" type="hidden">' + this.items[i].title + ((this.items[i].duration !== undefined) ?' <span class="txtMuted">' + this.items[i].duration + '</span>':'') + '</li>';
            }else{
                html += '<li><input value="' + this.items[i].value + '" type="hidden">' + this.items[i].title + ((this.items[i].duration !== undefined) ?' <span class="txtMuted">' + this.items[i].duration + '</span>':'') + '</li>';
            }     
        }
        html += '</ol>';
        let $html = $(html);
        $html.find('li').each(function(){$(this).on('click', function(e){self.click(self, e)})});
        return $html;
    }

    /**
     * @description Get progress
     * @param {number} elapsed Elapsed time
     * @param {duration} duration Duration of sound
     * @return {number} progress
     */
    getProgress(elapsed, duration){
        const width = this.$html.find('.audio-timeline')[0].offsetWidth;
        const percent = ((elapsed/duration) * 100);
        const progress = (width/100) * percent; 
        return progress;
    }

    /**
     * @description Get random color
     * @returns {string} color
     */
     getRandomColor(){
        const randomColor = () => {
            let color = '#';
            for (let i = 0; i < 6; i++){
               const random = Math.random();
               const bit = (random * 16) | 0;
               color += (bit).toString(16);
            };
            return color;
         };
        return randomColor();
    }

    /**
     * @description Get time
     * @param {number} time 
     * @returns {string} 
     */
    getTime(time){
        if(time > 0 && time !== Infinity){
            var minutes = time/60;
            minutes = minutes.toString().substring(0, minutes.toString().indexOf('.'));
            minutes = Number(minutes) >= 10?minutes:'0' + minutes;
            var secondes = (Math.floor(time%60)<10)?'0' + Math.floor(time%60):Math.floor(time%60);
            return minutes + ':' + secondes;            
        }else{
            return '00:00';
        }
    }

    /**
     * @description Initialize audio player
     * @return {void}
     */
    init(){
        this.create();
        this.getData();
    }

    /**
     * @description Mute sound
     * @return {void}
     */
    mute(){
        var self = $(this).parent().parent().parent().data('mdt.audioplayer');
        if(self.$audio[0].muted){
            self.$audio[0].muted = false;
            self.$element.find('.inputRange').children()[0].value = self.volume;
            this.innerHTML = '<span class="fa fa-volume-up"></span>';
        }else{
            self.$audio[0].muted = true;
            self.$element.find('.inputRange').children()[0].value = 0;
            this.innerHTML = '<span class="fa fa-volume-off"></span>';
        }
    }

    /**
     * @description Next sound of audio player
     * @param {*} self 
     * @return {void}
     */
    next(self){
        if(self.items === null){
            console.info('La playlist n\'est pas chargée');
            return;
        }
        if(self.index < (self.items.length-1)){
            if(!self.replay){
                self.index++
            }
            if(!self.$audio[0].paused){
                self.$audio[0].pause();
            }
            self.$source.attr('src', self.$playList.find('li').eq(self.index).children()[0].value);
            self.$audio[0].volume = self.volume / 100;
            self.$element.find('.inputRange').children()[0].value = self.volume;
            self.$audio[0].load();
            self.$audio[0].play();
            self.$audio[0].playbackRate = self.rate;
            self.$html.find('.play').html('<span class="fa fa-pause"></span>');
        }else{
            self.index = 0;
            self.$audio[0].pause()
            self.$source.attr('src', self.$playList.find('li').eq(0).children()[0].value);
            self.$audio[0].volume = self.volume / 100;
            self.$element.find('.inputRange').children()[0].value = self.volume;
            self.$audio[0].load();
            self.$audio[0].play();
            self.$audio[0].playbackRate = self.rate;
            self.$html.find('.play').html('<span class="fa fa-pause"></span>');
        }
        self.$html.find('li').removeAttr('class');
        self.$playList.find('li').eq(self.index).attr('class', 'active');
        self.$playList.scrollTop(self.$playList.find('li').eq(self.index)[0].offsetTop);
        if(this.analyserRandColor){
            this.analyserColor = this.getRandomColor();
            self.$html.find("#analyserColor").val(self.analyserColor);
        }  
    }

    onMouseEnter(self){
        clearTimeout(self.timer);
    }

    onMouseLeave(self){
        clearTimeout(self.timer);
        self.timer = setTimeout(function(){
            if(self.playListOpen){
                self.displayPlayList(self);
            }else if(self.paramOpen){
                self.displayParam(self);
            }
        }, self.settings.playListDuration);
    }    

    /**
     * @description Play sound of audio player
     * @param {object} self HTML element 
     * @return {void}
     */
    play(self){
        if(self.items === null){
            console.info('La playlist n\'est pas chargée');
            return;
        }
        if(self.$audio[0].paused){
            if(self.$audio[0].readyState === 0){
                self.$source.attr('src', self.$playList.find('li').eq(self.index).children()[0].value);
                self.$audio[0].load();
            }
            self.$audio[0].play();

            self.$audio[0].playbackRate = self.rate;
            self.$audio[0].volume = self.volume / 100;
            self.$element.find('.inputRange').children()[0].value = self.$audio[0].volume * 100;
            self.$html.find('.play').html('<span class="fa fa-pause"></span>');
            if(self.analyserRandColor){
                self.analyserColor = self.getRandomColor();
            }  
        }else{
            self.$audio[0].pause();          
            self.$html.find('.play').html('<span class="fa fa-play"></span>');
            if(self.$audio[0].duration === Infinity){
                $(self.$preloader[0]).animate({
                    'width':'0px'
                }, 200);
            } 
            $(self.$progress[0]).animate({
                'width':'0px'
            }, 200); 
        }
    }

    /**
     * @description Previous sound of audio player
     * @param {object} self HTML element 
     * @return {void}
     */
    prev(self){
        if(self.items === null){
            console.info('La playlist n\'est pas chargée');
            return;
        }
        if(self.index > 0){
            self.index--;
            if(!self.$audio[0].paused){
                self.$audio[0].pause();
            }
            self.$source.attr('src', self.$playList.find('li').eq(self.index).children()[0].value);
            self.$audio[0].volume = self.volume / 100;
            self.$element.find('.inputRange').children()[0].value = self.volume;
            self.$audio[0].load();
            self.$audio[0].play();
            self.$audio[0].playbackRate = self.rate;
            self.$html.find('.play').html('<span class="fa fa-pause"></span>');
        }else{
            self.index = (self.items.length-1);
            self.$audio[0].pause()
            self.$source.attr('src', self.$playList.find('li').eq(self.index).children()[0].value);
            self.$audio[0].volume = self.volume / 100;
            self.$element.find('.inputRange').children()[0].value = self.volume;
            self.$audio[0].load();
            self.$audio[0].play();
            self.$audio[0].playbackRate = self.rate;
            self.$html.find('.play').html('<span class="fa fa-pause"></span>');
        }
        self.$playList.find('li').removeAttr('class');
        self.$playList.find('li').eq(self.index).attr('class', 'active');
        self.$playList.scrollTop(self.$playList.find('li').eq(self.index)[0].offsetTop);     
        if(self.analyserRandColor){
            self.analyserColor = this.getRandomColor();
            self.$html.find("#analyserColor").val(self.analyserColor);
        }  
    }

    setCloseAnalyser(self){
        if(self.analyserOpen){
            self.displayAnalyser(self);
        }
    }

    /**
     * @description Set events od audio player
     * @return {void}
     */
    setEvents(){
        const self = this;
        this.$html.find('.play').on('click', ()=>{self.play(self)});
        this.$html.find('.stop').on('click', ()=>{self.stop(self)});
        this.$html.find('.volume').on('click', this.mute);
        this.$html.find('.first').on('click', ()=>{self.first(self);});
        this.$html.find('.prev').on('click', ()=>{self.prev(self);});
        this.$html.find('.next').on('click', ()=>{self.next(self);});
        this.$html.find('.end').on('click', ()=>{self.end(self);});
        this.$html.find('.replay').on('click', ()=>{self.setReplay(self);});
        this.$html.find('.analyser').on('click', ()=>{self.displayAnalyser(self);});
        this.$html.find('.params').on('click', ()=>{self.displayParam(self);});
        this.$html.find('.playList').on('click', ()=>{self.displayPlayList(self);});
        this.$audio.on('timeupdate', ()=>{this.setProgress(self)});
        this.$audio.on('ended', ()=>{self.next(self);});
        this.$playList.on('mouseleave', ()=>{self.onMouseLeave(self)});
        this.$playList.on('mouseenter', ()=>{self.onMouseEnter(self)});
        this.$html.find('input[type=radio][name=theme]').on('change', (e)=>self.setTheme(self, e));
        this.$html.find('input[type=radio][name=rate]').on('change', (e)=>self.setRate(e, self));
        this.$html.find('input[type=radio][name=analyserColor]').on('change', (e)=>self.setRandomColor(e, self));
        this.$html.find('input[type=range]').on('input', (e)=>self.setVolume(e, self));
        this.$param.on('mouseleave', ()=>{self.onMouseLeave(self)});
        this.$param.on('mouseenter', ()=>{self.onMouseEnter(self)});
        this.$timeLine.on('click', (e)=>{self.clickTimeLine(self, e)});
        this.$element.on('contextmenu', (e)=>{e.preventDefault()});
        this.$html.find('#analyserColor').on('change', ()=>{self.setColor(self, self.$html.find('#analyserColor').val())});
    }

    /**
     * @description Set progress
     * @return {void}
     */
    setProgress(self){
        //var self = $(this).parent().parent().data('mdt.audioplayer');
        var time = self.$html.find('.audio-time')[0];
        var total = self.$html.find('.audio-time-total')[0];
        if(self.$audio[0].readyState === 4 || self.$audio[0].readyState === 3){
            var buffered = self.$audio[0].buffered.end(0);
            var duration = self.$audio[0].duration;
            var current = self.$audio[0].currentTime;
            if(duration !== Infinity){
                $(self.$preloader[0]).stop(true, true).animate({
                    'width':self.getProgress(buffered, duration) + 'px'
                }, 200);        
                $(self.$progress[0]).removeClass('on');
                $(self.$progress[0]).stop(true, true).animate({
                    'width':self.getProgress(current, duration) + 'px'
                }, 200);
            }else{
                if(self.$audio[0].paused !== true){
                    $(self.$preloader[0]).stop(true, true).animate({
                        'width':'0px'
                    }, 200);   
                    $(self.$progress[0]).addClass('on');
                    $(self.$progress[0]).stop(true, true).animate({
                        'width':self.getProgress(1, 1) + 'px'
                    }, 200);
                }
            }
            $(time).html(self.getTime(current, 2));
            $(total).html(self.getTime(duration, 2));
        }
    }

    /**
     * @description Set color of analyser
     * @param {string} color Color in hexadecimal
     * @return {void} 
     */
    setColor(self, color){
        self.analyserColor = color
    }

    /**
     * @description Set random color of analyser
     * @param {object} e Event 
     * @param {object} self HTML element 
     * @return {void}
     */
    setRandomColor(e, self){
        if(e.target.value === 'randomColor'){
            self.analyserRandColor = true;
            self.analyserColor = self.getRandomColor();
            self.$html.find("#analyserColor").val(self.analyserColor);
        }else{
            self.analyserRandColor = false;
            if(self.$element.children()[0].className !== 'audio-player-container-dark'){
                self.analyserColor = self.analyserStdColor;
            }else{
                self.analyserColor = self.analyserDarkColor;
            }
            self.$html.find("#analyserColor").val(self.analyserColor);
        }
    }

    /**
     * @description Set replay
     * @param {object} self HTML element 
     * @return {void}
     */
    setReplay(self){
        if(self.$audio[0].duration !== Infinity){
            if(self.$html.find('.replay').hasClass('on')){
                self.$html.find('.replay').removeClass('on');
                self.replay = false;
            }else{
                self.$html.find('.replay').addClass('on');
                self.replay = true;
            }
        }
    }

    /**
     * @description Set thème of audio player
     * @param {object} self HTML element
     * @return {void}
     */
    setTheme(self, e){
        if(e.target.value === "light"){
            self.$element.children()[0].className = 'audio-player-container';
            self.analyserColor = '#5a92c9';
            self.$param.find('#analyserColor').val(self.analyserColor);
        }else{
            self.$element.children()[0].className = 'audio-player-container-dark';
            self.analyserColor = '#253b50';
            self.$param.find('#analyserColor').val(self.analyserColor);
        }
    }

    /**
     * @description Set rate of sound
     * @param {object} e Event 
     * @param {object} self HTML element 
     */
    setRate(e, self){
        self.rate = e.target.value;
        self.$audio[0].playbackRate = e.target.value; 
    }

    /**
     * @description Set volume of audio player
     * @param {object} e Event 
     * @param {object} self HTML element 
     */
    setVolume(e, self){
        if(self.$audio[0].muted){
            self.$audio[0].muted = false;
        }
        self.$audio[0].volume = e.target.value / 100;
        self.volume = self.$audio[0].volume * 100;
    }

    /**
     * @description Stop sound of audio player
     * @param {object} self HTML element
     * @return {void}
     */
    stop(self){
        if(!self.$audio[0].paused){
            self.$html.find('.replay').removeClass('on');
            self.replay = false;
            self.$audio[0].pause();
            if(self.$audio[0].duration !== Infinity){
                self.$audio[0].currentTime = 0;
            }
            self.$html.find('.play').html('<span class="fa fa-play"></span>');
            if(self.$audio[0].duration === Infinity){
                $(self.$preloader[0]).animate({
                    'width':'0px'
                }, 200);
            } 
            $(self.$progress[0]).animate({
                'width':'0px'
            }, 200); 
        }
    }

    toConsole(){
        console.groupCollapsed('AudioPlayer');
        console.log('Plugin : ');
        console.log(this);
        console.log('Settings : ');
        console.log(this.settings);
        console.groupEnd();
    }
}

export {AudioPlayer};