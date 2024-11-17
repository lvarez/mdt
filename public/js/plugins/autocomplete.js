/*
 * ======================================================================
 * Class AutoComplete
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class AutoComplete{

    /**
     * @description Constructor
     * @param {object} element HTML element
     * @param {array} options Array of auto complete options 
     */
    constructor(element, options){
        const defaults = {
            dataType:'json',
            delay:150,
            width:100,
            height:25,
            minLength:3,
            position:'bottom',
            url:'./library/php/contacts.php?keyword='
        }
        this.$element       = $(element);
        this.settings       = $.extend(defaults, options);
        this.results        = null;
        this.currentFocus   = -1;
        this.isHidden       = false;
        this.create();
    }

    click(self, e){
        if(e.currentTarget !== undefined){
            $(self.$element).val($(e.currentTarget).attr('data-value'));
        }
        self.hide(self);
    }

    /**
     * @description Create auto complete
     * @return {void}
     */
    create(){
        const self = this;
        const html = '<div class="autocomplete"/>';
        this.$element.after($(html));
        this.$element.on('keydown', (e)=>{
            self.keyDown(self, e);
        });
        this.$element.on('focus', (e)=>{
            if(e.target.value.length >= self.settings.minLength && e.target.value.trim() !== ''){
                self.isHidden = false;
                self.getData(self, e.target.value);
            }else{
                if(self.$element.next().hasClass('open')){
                    self.hide(self);
                }
            }
        });
        this.$element.on('input', (e)=>{
            if(e.target.value.length >= self.settings.minLength && e.target.value.trim() !== ''){
                self.isHidden = false;
                self.getData(self, e.target.value);
            }else{
                if(self.$element.next().hasClass('open')){
                    self.hide(self);
                } 
            }
        });       
    }

    /**
     * @description Get data of auto complete
     * @return {void}
     */
    getData(self, value){
        $.ajax({
            type:'GET',
            url:self.settings.url + value,
            dataType:self.settings.dataType,
            success:(data) => {self.results = data},
            complete:() => {
                if(!self.isHidden){
                    self.show(self, value);
                }
            },
            error:(result) => {console.error(result)}
        });
    }

    /**
     * @description Hide auto complete
     * @param {object} element HTML element
     */
    hide(self){
        self.isHidden       = true;
        self.currentFocus   = -1;
        $(self.$element).next().html('');
        $(self.$element).next().removeClass('open');       
    }

    keyDown(self, e){
        const li = self.$element.next().find('li');
        switch(e.keyCode){
            case 13: // Enter
                e.currentTarget = li[self.currentFocus];
                self.click(self, e);
                break;
            case 38: // Up
                self.currentFocus--;
                self.setActive(self);
                break;
            case 40: // Down
                self.currentFocus++;
                self.setActive(self);
                break;
        }
    }

    /**
     * @description Set active
     * @param {object} self 
     */
    setActive(self){
        const li = self.$element.next().find('li');
        $(li).siblings().removeClass('active');
        if(self.currentFocus > li.length - 1){
            self.currentFocus = 0
        }
        if(self.currentFocus < 0){
            self.currentFocus = li.length - 1;
        }
        $(li[self.currentFocus]).addClass('active');
        $(li).parent().parent().scrollTop($(li)[self.currentFocus].offsetTop);
    }

    /**
     * @description Show auto complete
     * @return {void}
     */
    show(self, value){
        if(self.results.length > 0){
            let html = '<ul>';
            const rgxp = new RegExp(value, 'i');
            for(let i=0;i<self.results.length;i++){
                const repl = '<span class="txtHiglight">' + self.results[i].Nom.match(rgxp) + '</span>';        
                html += '<li data-value="' + self.results[i].Nom + '">' + self.results[i].Nom.replace(rgxp, repl) + '</li>';
            }
            html += '</ul>';
            self.$element.next().addClass('open');
            self.$element.next().html($(html));
            self.$element.next().find('li').on('click', (e)=>{self.click(self, e)});
        }
    }
}

export {AutoComplete}