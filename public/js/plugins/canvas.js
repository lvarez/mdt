import * as functions from '../core/functions.js';
/*
 * ======================================================================
 * Class Canvas
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Canvas{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of canvas options 
     */
    constructor(element, options){
        const defaults = {
            context:'2d'
        };
        this.$element   = $(element);
        this.settings   = $.extend(defaults, options);
        this.$canvas    = null;
        this.ctx        = null;
        this.$element.css({
            width:this.settings.width,
            height:this.settings.height
        });  
    }

    /**
     * @description Clear canvas
     * @return {void}
     */
    clear(){
        this.ctx.clearRect(0, 0, this.settings.width, this.settings.height);
    }

    /**
     * @description Create canvas
     * @return {void}
    */
    create(){
        this.$canvas = $('<canvas/>');
        this.$canvas.attr('width', this.settings.width);
        this.$canvas.attr('height', this.settings.height);
        this.$canvas.on('contextmenu', (e) => {e.preventDefault()});
        //this.$canvas.on('mousemove', (e) => {console.log(this.isInPath(e))})
        this.ctx = this.$canvas[0].getContext(this.settings.context);
    }

    /**
     * @description Download image in your browser
     * @return {void}
     */
     downloadImage(name){
        const image = this.$canvas[0].toDataURL().replace("image/png", "image/octet-stream");
        const a = document.createElement("a");
        a.href = image;
        a.download = name;
        a.click();
    }

    drawArc(centerX, centerY, radius, start, end, counterclockwise = false, color = '#000', stroke=false, lineWidth = 3){
        this.ctx.save(); 
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;  
        this.ctx.lineWidth = lineWidth;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, start, end, counterclockwise);
        if(stroke){
            this.ctx.stroke();
        }else{
            this.ctx.fill();
        }    
        this.ctx.restore();
    }

    /**
     * @description Draw an arc in canvas
     * @param {array} options Array of arc options
     */
    drawArcJauge(options){
        this.ctx.save();
        if(options.isFilled){
            this.ctx.fillStyle      = eval(options.strokeStyle);
        }else{
            this.ctx.strokeStyle    = eval(options.strokeStyle);
            this.ctx.lineWidth      = eval(options.lineWidth);
            this.ctx.lineCap        = options.lineCap;
        }
        if(options.shadowOffsetX !== undefined){
            this.drawShadow(eval(options.shadowOffsetX), eval(options.shadowOffsetY),  
                            eval(options.shadowColor), options.shadowBlur);
        }         
        this.ctx.beginPath();
        this.ctx.arc(eval(options.centerX), eval(options.centerY), eval(options.radius), eval(options.start), eval(options.end));
        if(options.isFilled){
            this.ctx.fill();
        }else{
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    /**
     * @description Draw color palette in canvas
     * @param {object} self 
     * @return {void}
     */
    drawColorPalette(self){
        let gradient = self.ctx.createLinearGradient(0, 0, self.ctx.canvas.width, 0);
        gradient.addColorStop(0, "rgb(255, 0, 0)");
        gradient.addColorStop(0.15, "rgb(255, 0, 255)");
        gradient.addColorStop(0.33, "rgb(0, 0, 255)");
        gradient.addColorStop(0.49, "rgb(0, 255, 255)");
        gradient.addColorStop(0.67, "rgb(0, 255, 0)");
        gradient.addColorStop(0.84, "rgb(255, 255, 0)");
        gradient.addColorStop(1, "rgb(255, 0, 0)");
        self.ctx.fillStyle = gradient;
        self.drawRectangle(self, 0, 0, self.ctx.canvas.width, self.ctx.canvas.height, gradient);
        gradient = self.ctx.createLinearGradient(0, 0, 0, self.ctx.canvas.height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
        self.ctx.fillStyle = gradient;
        self.drawRectangle(self, 0, 0, self.ctx.canvas.width, self.ctx.canvas.height, gradient);        
    }

    /**
     * @description Draw grid in canvas
     * @param {number} x Position X of grid
     * @param {number} y Position Y of grid
     * @param {number} width Width of grid
     * @param {number} height Height of grid
     * @param {number} stepX 
     * @param {number} stepY 
     * @param {number} lineWidth 
     * @param {string} strokeStyle 
     * @param {string} display
     * @return {void} 
     */
    drawGrid(x, y, width, height, stepX, stepY, lineWidth = 1, strokeStyle = '#000', display = 'both'){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = strokeStyle;
        if(display === 'both' || display === 'vertical'){
            for(var i=0;i<=width;i=i+stepX){
                this.ctx.moveTo(x + i, x + height);
                this.ctx.lineTo(x + i, x);
            }
        };
        if(display === 'both' || display === 'horizontal'){
            for(var i=0;i<=height;i=i+stepY){
                this.ctx.moveTo(x, y + i);
                this.ctx.lineTo(x + width, y + i);
            }
        };        
        this.ctx.stroke();
        this.ctx.restore();
    }

    /**
     * @description Draw image
     * @param {string} img Image URL
     * @return {void}
     */
    drawImage(img){
       this.ctx.save();
       this.ctx.drawImage(img, 0, 0, this.settings.width, this.settings.height);
       this.ctx.restore(); 
    }

    drawLegend(){
        this.drawText();
    }

    /**
     * @description Draw line
     * @param {number} startX Position X of start drawing
     * @param {number} startY Position Y of start drawing
     * @param {number} endX Position X of end drawing
     * @param {number} endY Position Y of end drawing
     * @param {string} color Color of line
     * @param {number} lineWidth Width of line
     * @return {void}
     */
    drawLine(startX, startY, endX, endY, color = '#000', lineWidth = 1){
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = lineWidth;    
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);                                        
        this.ctx.lineTo(endX, endY);         
        this.ctx.stroke();
        this.ctx.restore();           
    }

    drawPlot(){
        //Vertical
        this.drawLine(this.settings.margins.left, this.settings.margins.top, this.settings.margins.left, this.settings.height - this.settings.margins.bottom, '#000', 1.5);
        //Horizontal
        this.drawLine(this.settings.margins.left, this.settings.height - this.settings.margins.bottom, this.settings.width - this.settings.margins.right, this.settings.height - this.settings.margins.bottom, '#000', 1.5);
        //Valeurs
        const height = this.settings.height - this.settings.margins.top - this.settings.margins.bottom;
        const width = this.settings.width - this.settings.margins.left - this.settings.margins.right;
        const x = height/100000;
        const y = width/100000;
        for(let i = 0;i<=100000;i=i+10000){
            if(this.settings.orientation === 'vertical'){
                this.drawLine(this.settings.margins.left + 1, this.settings.height - this.settings.margins.bottom - (x * i), this.settings.margins.left - 3, this.settings.height - this.settings.margins.bottom - (x * i), '#000', 1.5);
                this.drawText(i, this.settings.margins.left - 5, (this.settings.height - this.settings.margins.bottom - (x * i)) + 1, "bold 9px Arial", "#000", "right");
            }else{
                this.drawLine(this.settings.margins.left + (y * i), this.settings.height - this.settings.margins.bottom - 1, this.settings.margins.left + (y * i), this.settings.height - this.settings.margins.bottom + 3, '#000', 1.5);
                this.drawText(i, this.settings.margins.left + (y * i), this.settings.height - (this.settings.margins.bottom / 2), "bold 9px Arial");
            }
        }
     }

    drawPie(){
        this.ctx.save();
        //var data = [65,58,42,75,40,61];//341
        var colors = ["#0b6fc5", "#0b4d87", "#0a3962", "#1c5968", "#68737d", "#6ac9c8", "#1AADCE"];//["#1AADCE", "#492970", "#F28F43", "#77A1E5", "#C42525", "#A6C96A"]
        var center = [this.settings.width / 2, this.settings.height / 2];
        var radius = Math.min(this.settings.width, this.settings.height) / 3;
        var lastPosition = 0;
        var total = 331.82;
        for(var i=0;i<this.data.data.length;i++) {
            let radian = functions.radians((360/total)*this.data.data[i].value);
            this.ctx.fillStyle = colors[i];
            this.ctx.beginPath();
            this.ctx.moveTo(center[0],center[1]);
            this.ctx.arc(center[0], center[1], radius, lastPosition, lastPosition + radian, false);
            this.ctx.lineTo(center[0],center[1]);
            this.ctx.fill();
            lastPosition += Math.PI*2*(this.data.data[i].value/total);
        }  
        this.ctx.restore(); 
    }

    /**
     * @description Draw rectangle
     * @param {number} x Horizontal position of rectangle
     * @param {number} y Vertical position
     * @param {number} width Width of rectangle
     * @param {number} height Height of rectangle
     * @param {string} color Color of rectangle 
     * @param {*} fillType fillType of rectangle 
     * @param {*} lineWidth Line width of rectangle
     * @return {void}
     */
    drawRectangle(self, x, y, width, height, color = '#000', fillType = 'fill', lineWidth = '1'){
        self.ctx.save();
        self.ctx.beginPath();
        if(fillType == 'fill'){                                               
            self.ctx.fillStyle = color;                                            
            self.ctx.fillRect(x, y, width, height); 
        }else{
            self.ctx.strokeStyle = color; 
            self.ctx.lineWidth = lineWidth;
            self.ctx.rect(x, y, width, height);
            self.ctx.stroke();
        }     
        self.ctx.restore();           
    }

    /**
     * @description Draw shadow
     * @param {number} offsetX 
     * @param {number} offsetY 
     * @param {string} color Color of shadow 
     * @param {number} blur
     * @return {void} 
     */
    drawShadow(offsetX, offsetY, color, blur){
        this.ctx.shadowOffsetX = offsetX;
        this.ctx.shadowOffsetY = offsetY;
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = blur;        
    };

    /**
     * @description Draw shape
     * @param {number} x  
     * @param {number} y 
     * @param {array} data 
     */
    drawShape(x, y, data){
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        for(let i=0;i<data.length;i++){
            this.ctx.lineTo(data[i][0], data[i][1]);
        }
        this.ctx.fill();
        this.ctx.restore();
    }

    /**
     * @description Draw text
     * @param {string} text  
     * @param {number} x Horizontal position of text
     * @param {number} y Vertical position of text
     * @param {string} font Font of text 
     * @param {string} fillStyle  
     * @param {string} textAlign Text alignement 
     * @param {string} textBaseline Text baseline
     */
    drawText(text, x, y, font = this.settings.font, fillStyle = '#000', textAlign = 'center', textBaseline = 'middle'){
        this.ctx.save();
        this.ctx.font = font;
        this.ctx.fillStyle = fillStyle;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }

    /**
     * @description Get font size by ratio
     * @returns 
     */
    getFont(){
        let ratio = fontSize / fontBase;
        let size = this.settings.width * ratio;
        return (size|0) + 'px sans-serif';
    }

    /**
     * @description Get random color
     * @param {boolean} hex  
     * @returns 
     */
    getRandomColor(hex = true){
        if(hex){
            let color = '#';
            for (let i = 0; i < 6; i++){
               const random = Math.random();
               const bit = (random * 16) | 0;
               color += (bit).toString(16);
            };
            return color;
        }else{
            return Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255);
        }
    }

    /**
     * @description Check if mouse is in path
     * @param {object} e Event 
     * @return {boolean} True if is in path or false
     */
    isInPath(e){
        const domRect = this.$canvas[0].getBoundingClientRect()
        let x = (e.clientX - domRect.left) * (this.$canvas.width / domRect.width)
        let y = (e.clientY - domRect.top) * (this.$canvas.height / domRect.height)
        return this.ctx.isPointInPath(x, y);  
    }
}

export {Canvas};