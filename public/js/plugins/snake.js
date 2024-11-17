import {Canvas} from './canvas.js';

/*
 * ======================================================================
 * Class Snake
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Snake extends Canvas{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of snake options 
     */
    constructor(element, options){
        super(element, options);
        const defaults = {
            width:100,
            height:100
        }
        this.$element = $(element);
        this.settings = $.extend(defaults, this.settings);
        this.x = 10;
        this.y = 10;
        this.init();
    }

    game(self){
        super.clear();
        super.drawRectangle(self, this.x, this.y, 10, 10, '#768aad');
        requestAnimationFrame(()=>{
            this.game(this);
        });
    }

    /**
     * @description Initialize Snake
     */
    init(){
        super.create();
        this.drawLine(0, 0, this.settings.width, 0);
        this.drawLine(this.settings.width, 0, this.settings.width, this.settings.height, '#000', 1);
        this.drawLine(0, this.settings.height, this.settings.width, this.settings.height);
        this.drawLine(0, 0, 0, this.settings.height);
        this.$element.append(this.$canvas);
        $(document).on('keydown', (e)=>{
            e.preventDefault();
            this.keyDown(e);
        });
        requestAnimationFrame(()=>{
            this.game(this);
        });
    }
    
    keyDown(e){
        switch(e.keyCode){
            case 37: // Left
                this.x -= 1;
                break;
            case 38: // Top
                this.y -= 1;
                break;
            case 39: // Right
                this.x += 1;
                break;
            case 40: // Bottom
                this.y += 1;
                break;
        }
    }
}

export {Snake};