/*
 * ======================================================================
 * Class Tabs
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Tabs{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of tabs options 
     */
    constructor(element, options){
        const defaults = {
            autoRotate:false,
            animation:false,
            dataType:'json',
            delay:3000,
            url:'json/tabs'
        }
        this.$element   = $(element);
        this.settings   = $.extend(defaults, options);
        this.timer      = null;
        this.entries    = null;
        this.init();
        console.log(options, this.settings);
    }

    /**
     * @description Auto rotate the tabs
     * @return {void}
     */
    autoRotate(){
        this.timer = setTimeout(this, 1000);
    }

    /**
     * @description Create tabs
     * @return {void}
     */
    create(){
        let html = '<div class="tabs-container">';
        html += '<ul class="tabs">';
        for(let i = 0;i<this.entries.length;i++){
            if(i === 0){
                html += '<li class="active"><span>' + this.entries[i].title + '</span></li>';
            }else{
                html += '<li><span>' + this.entries[i].title + '</span></li>';
            }
        }
        html += '</ul>';
        html += '<div class="content">' + this.entries[0].content + '</div>';
        html += '</div>';        
        this.$html = $(html);
        this.$element.append(this.$html);
        this.$element.find('li').on('click', this.click);
        if(this.settings.autoRotate){
            this.autoRotate();
        }
    }

    /**
     * @description Click
     * @return {void}
     */
    click(){
        const index = $(this).index();
        const content = $(this).parent().parent().parent().data('mdt.tabs').entries[index].content;
        $(this).parent().parent().parent().find('.content').html(content);
        $(this).parent().find('li').removeClass('active');
        $(this).addClass('active');        
    }

    /**
     * @description Get data of tabs
     * @return {void}
     */
    getData(){
        const self = this;
        if(this.$element.data('url') !== undefined){
            this.settings.url = this.$element.data('url');
        }
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
     * @description Initialize tabs
     * @return {void}
     */
    init(){
        try{
            this.getData();
        }catch(e){
            console.warn(e);
        }
    }
}