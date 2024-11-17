import {Canvas} from './canvas.js';

/*
 * ======================================================================
 * Class Signature
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Signature extends Canvas{

    /**
     * @description Constructor
     * @param {object} element Html element 
     * @param {array} options Array of signature options
     */
    constructor(element, options){
        super(element, options);
        const defaults = {
            width:400,
            height:100,
            color:'#000',
            lineWidth:1.5
        }
        this.settings       = $.extend(defaults, this.settings);
        this.startPosition  = null;
        this.isDrawing      = false;
        this.isDisabled     = false;
        this.init();
    }

    /**
     * @description Load images into canvas
     * @return {void}
     */
    loadImage(){
        super.clear();
        const img = new Image();
        img.src = './public/images/signature.png';
        img.onload = ()=>{
            super.drawImage(img);
            this.isDisabled = true;
        }
    }

    /**
     * @description Download image on your browser
     * @return {void} 
     */
     downloadImage(){
         super.downloadImage('signature.png');
    }

    /**
     * @description Draw signature on canvas
     * @param {object} start Start position of drawing 
     * @param {object} end End position of drawing
     */
    draw(start, end){
        if(!this.isDisabled){
            super.drawLine(start.x, start.y, end.x, end.y, this.settings.color, this.settings.lineWidth);
        }
    }

    /**
     * @description Clear canvas
     * @return {void}
     */
    clear(){
        super.clear();
        super.drawRectangle(this, 0, 0, this.settings.width, this.settings.height, '#fff');
        this.isDisabled = false;
    }

    /**
     * @description Get mouse positions in canvas
     * @param {object} self HTML element
     * @param {object} e Event 
     * @return {object} positions x and y of cursor in canvas
     */
    getMousePositions(self, e){
        const rectangle = self.getBoundingClientRect();
        return {
            x:e.clientX - rectangle.left,
            y:e.clientY - rectangle.top
        }
    }

    /**
     * @description Initialize signature
     * @return {void}
     */
    init(){
        super.create();
        this.$canvas.on('mousedown', (e)=>{
            this.isDrawing = true;
            this.startPosition = this.getMousePositions(this.$element[0], e);
        });
        this.$canvas.on('mouseup', ()=>{
            this.isDrawing = false;
        });
        this.$canvas.on('mousemove', (e)=>{
            if(this.isDrawing){
                const position = this.getMousePositions(this.$element[0], e);
                this.draw(this.startPosition, position);
                this.startPosition = position;
            }
        });
        this.$canvas.on('mouseleave', ()=>{
            this.isDrawing = false;
        });
        this.loadImage();
        this.$element.append(this.$canvas);
    }
}

export {Signature};