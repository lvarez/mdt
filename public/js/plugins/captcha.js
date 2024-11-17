import {Canvas} from './canvas.js';

/*
 * ======================================================================
 * Class Signature
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Captcha extends Canvas{

    /**
     * @description Constructor
     * @param {object} element HTML element 
     * @param {array} options Array of captcha options
     */
    constructor(element, options){
        super(element, options);
        const defaults = {
            width:100,
            height:10,
            font:'bold 24px sans-serif',
            fillStyle:'#000',
            length:10,
            value:null
        }
        this.settings       = $.extend(defaults, this.settings);
        this.charsRandom    = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.init();
    }

    /**
     * @description Draw captcha
     * @return {void}
     */
    draw(){
        super.clear();
        super.drawLine(Math.floor(Math.random() * 400), Math.floor(Math.random() * 100), Math.floor(Math.random() * 400), Math.floor(Math.random() * 100), 'rgba(' + super.getRandomColor(false) + ', 0.3)', Math.floor(Math.random() * 20));
        super.drawLine(0, Math.floor(Math.random() * 100), 400, Math.floor(Math.random() * 100), 'rgba(' + super.getRandomColor(false) + ', 0.3)', Math.floor(Math.random() * 20));
        super.drawLine(0, Math.floor(Math.random() * 100), 400, Math.floor(Math.random() * 100), 'rgba(' + super.getRandomColor(false) + ', 0.3)', Math.floor(Math.random() * 30));
        super.drawArc(this.randomNumber(50, 350), this.settings.height / 2, this.randomNumber(5, 45), 0, 2 * Math.PI, false, 'rgba(' + super.getRandomColor(false) + ', 0.3)', false);
        super.drawText(this.getRandomString(Math.floor(Math.random() * (this.settings.length-5)+5), this.charsRandom), this.settings.width/2, this.settings.height/2, this.settings.font, this.settings.fillStyle);
    }

    /**
     * @description
     * @return {void}
     */
    generate(){
        this.draw();
    }

    /**
     * @description Initialize captcha
     * @return {void}
     */
    init(){
        super.create();
        this.draw();
        this.$canvas.on('contextmenu', ()=>{
            return false;
        });
        this.$element.append(this.$canvas);
    }

    /**
     * @description Get random string
     * @param {int} length Length of string 
     * @param {string} chars 
     * @returns 
     */
    getRandomString(length, chars){
        let result = '';
        for(let i = 0;i<length;i++){
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        this.settings.value = result;
        return result;
    }

    randomNumber(min, max = null){
        if(max === null){
            return Math.floor(Math.random() * min);
        }else{
            return Math.floor(Math.random() * (max - min) + min);
        }
    }
}

export {Captcha};