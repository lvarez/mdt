/*
 * ======================================================================
 * Class DropDown
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class DropDown{

    /**
     * @designation Constructor
     * @param {object} element HTML element
     * @param {array} options Array of drop down options
     */
    constructor(element, options){
        const defaults = {
            contentType:'html',
            dataType:'JSON',
            delay:5000,
            width:100,
            height:100,
            url:null
        }
        this.$element   = $(element);
        this.$html      = null;
        this.settings   = $.extend(defaults, options);
        this.target     = null;
        this.version    = '0.1 beta'
        this.init();
    }

    /**
     * @designation Create drop down
     * @return {void}
     */
    create(){
        const html = `
            <div class="dropdown">
                ${this.version}
            </div>
        `;
    }

    /**
     * @designation Get data of drop down
     * @return {void}
     */
    getData(){
        const self = this;
        $.ajax({
            type:'GET',
            url:self.settings.url,
            dataType:self.settings.dataType,
            success:(data) => self.settings.content = typeof data != 'object' ? JSON.parse(data) : data,
            complete:() => {
                self.createMask();
                self.create();                
                if(self.settings.animate){
                    self.animate(self, self.settings.animation, self.settings.animationOrientation);
                }else{
                    self.show();
                }
            },
            error:(result) => console.error(result)            
        });
    }

    /**
     * @designation Hide drop down
     * @return {void}
     */
    hide(){

    }

    /**
     * @designation Initialize drop down
     * @return {void}
     */
    init(){
        this.target = this.$element.attr('data-target');
    }

    /**
     * @designation Show drop down
     * @return {void}
     */
    show(){
        this.create();
    }
}