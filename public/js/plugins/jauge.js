import * as functions from '../core/functions.js';
import {Canvas} from './canvas.js';

/*
 * ======================================================================
 * Class Jauge
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Jauge extends Canvas{

    /**
     * @description Constructor
     * @param {HTML element} element 
     * @param {Array of jauge options} options 
     */
    constructor(element, options){
        super(element, options);
        this.defaults = {
            width:100,
            height:100,
            theme:'default',
            type:'default',
            isReadOnly:false,
            ratio:null
        }
        this.$canvas    = null;
        this.$element   = $(element); 
        this.settings   = $.extend(this.defaults, this.settings);
        this.themes     = null;
        this.ctx        = null;
        this.init();
    }

    /**
     * @description Click
     * @param {event} e 
     */
    click(e){
        e.preventDefault();
        let mouseX  = e.pageX - $(this).offset().left - $(this).width()/2;
        let mouseY  = e.pageY - $(this).offset().top - $(this).height()/2;
        $(this).data('mdt.jauge').settings.ratio  = Math.atan2(mouseX, -mouseY) / (2 * Math.PI);
        if($(this).data('mdt.jauge').settings.ratio < 0){
            $(this).data('mdt.jauge').settings.ratio += 1;
        }
        $(this).data('mdt.jauge').draw();          
    }

    /**
     * @description Create jauge
     * @return void
     */
    create(){
        super.create(this);
        this.$element.append(this.$canvas);
        const min   = this.$element.data('min');
        const max   = this.$element.data('max');        
        this.settings.ratio = (this.$element.data('value') - min) / (max - min);
        this.draw();
        if(!this.settings.isReadOnly){
            this.$element.on('click', this.onClick);
            this.$element.on('mousedown', this.mousedown);           
        }
    }

    /**
     * @description Draw jauge
     * @return void
     */
    draw(){
        super.clear(this);
        for(let i=0;i<this.themes.types[this.settings.type].length;i++){
            super.drawArcJauge(this.themes.types[this.settings.type][i]); 
        }
        super.drawText(Math.round(this.settings.ratio * 100), this.settings.width/2, this.settings.height/2, this.settings.font, this.themes['colors'][this.settings.theme].color);   
    }

    /**
     * @description GetThemes
     * @void
     */
    getThemes(){
        let self = this;
        $.ajax({
            type:'GET',
            url:'public/json/jaugeThemes.json',
            dataType:'json',
            success:function(data){
                self.themes = data;
                self.create();
            },
            error:function(result){
                var html = '<span class="error">url : "' + this.url + '" (' + result.status + ' : ' + result.statusText + ')</span>';
                self.$element.append(html);
            }            
        });
    }

    /**
     * @description Initialize jauge
     * @return void
     */
    init(){
        this.getThemes();
        if(this.$element.data('theme') !== undefined){
            this.settings.theme = this.$element.data('theme');
        }
        if(this.$element.data('type') !== undefined){
            this.settings.type = this.$element.data('type');
        }
        if(this.$element.data('readonly') !== undefined){
            this.settings.isReadOnly = this.$element.data('readonly');
        }
    }

    /**
     * @description MouseDown
     * @param {event} e Event
     * @return {void}
     */
    mousedown(e){
        e.preventDefault();
        $(this).bind('mousemove', function(e){
            var mouseX = e.pageX - $(this).offset().left - $(this).width()/2;
            var mouseY = e.pageY - $(this).offset().top - $(this).height()/2;
            $(this).data('mdt.jauge').settings.ratio = Math.atan2(mouseX, -mouseY) / (2 * Math.PI);
            if($(this).data('mdt.jauge').settings.ratio < 0){
                $(this).data('mdt.jauge').settings.ratio += 1;
            }
            $(this).data('mdt.jauge').draw($(this).data('mdt.jauge').settings.ratio);
        }).mouseup(function(event){
            event.preventDefault();
            $(this).unbind('mousemove');
        }).mouseout(function(event){
            event.preventDefault();
            $(this).unbind('mousemove');
        });
    }

    /**
     * @description SetTheme - Define the theme
     * @param {string} theme 
     */
    setTheme(theme){
        this.settings.theme = theme;
        super.draw();
        if(debug){
            console.log(theme);
        }
    }
}

export {Jauge};