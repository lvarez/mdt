/*
 * ======================================================================
 * Class Combo
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Combo{

    /**
     * @description Constructor
     * @param {string} element HTML element 
     * @param {array} options Array of combo options 
     */
    constructor(element, options){
        const defaults = {
            autoOpen:false,
            dataType:'json',
            url:'./public/json/cantons.json'
        }
        this.$element   = $(element);
        this.$html      = null;
        this.items      = null;
        this.settings   = $.extend(defaults, options);
        this.init();
    }

    click(){
        if(this.$html.find('.combo-content').hasClass('on')){
            this.close();
        }else{
            this.open();
        }
    }

    clickValue(e){
       this.$html.find('#combo-text').html($(e.currentTarget).attr('data-value'));
       this.close();
    }

    /**
     * @description Create combo
     * @return {void}
     */
    create(){
        let html = '<div class="combo-container">';
        html += '<span id="combo-chevron" class="fa fa-chevron-down"></span>';
        html += '<span id="combo-text">Recherche</span>';
        html += '<div class="combo-content">'
        html += '<ul>';
        for(let i = 0;i<this.items.length;i++){
            html += '<li data-value="' + this.items[i].canton + '">' + this.items[i].canton + '</li>';
        }
        html += '</ul>';
        html += '</div></div>';
        this.$html = $(html);
        this.$html.find('#combo-chevron, #combo-text').on('click', ()=> {this.click()});
        this.$html.find('li').on('click', (e) => {this.clickValue(e)});
        this.$element.append(this.$html);
    }
    
    /**
     * @description Close combo
     * @return {void}
     */
    close(){
        this.$html.find('.combo-content').removeClass('on');
    }

    getData(){
        const self = this;
        $.ajax({
            dataType:self.settings.dataType,
            type:'GET',
            url:self.settings.url,
            success:(data) => {self.items = data},
            complete:() => {self.create()},
            error:(result) => {console.error(result)}
        });
    }

    /**
     * @description Initialize combo
     * @return {void}
     */
    init(){
        this.getData();
    }

    /**
     * @description Open combo
     * @return {void}
     */
    open(){
        this.$html.find('.combo-content').addClass('on');
    }
}

export {Combo}