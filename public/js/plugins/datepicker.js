/*
 * ======================================================================
 * Class DatePicker
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class DatePicker{

    /**
     * @description Constructor
     * @param {object} element HTML element 
     * @param {array} options Array of date picker options 
     */
    constructor(element, options){
        const defaults = {
            autoClose:false,
            dayNames:['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
            dayShortNames:['L', 'M', 'M', 'J', 'V', 'S', 'D'],
            defaultDate:null,
            format:'YYYY-MM-JJ',
            maxDate:null,
            minDate:null,
            month:['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],            
            todayHighlight:true           
        }
        this.$element       = $(element);
        this.settings       = $.extend(defaults, options);
        this.$html          = null;
        this.date           = null;
        this.selectedDate   = null;
        this.isOpen         = false;
        this.init();
    }

    /**
     * @description Capitalize first letter 
     * @param {string} value Text to capitalize first letter 
     * @return {void}
     */
    capitalizeFirstLetter(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    
    /**
     * @description Click on a date of date picker 
     * @param {object} self HTML element
     * @param {object} e Events 
     */
    click(self, e){
        if($(e.currentTarget).hasClass('active')){
            $(e.currentTarget).parent().parent().find('td.active').removeClass('active');
            self.$element.val('');
            self.selectedDate = null;
        }else{
            $(e.currentTarget).parent().parent().find('td.active').removeClass('active');
            $(e.currentTarget).addClass('active');
            self.$element.val($(e.currentTarget).find('span').data('value'));
            self.selectedDate = new Date(self.date.getFullYear(), self.date.getMonth(), e.currentTarget.innerText);
        }
    }

    /**
     * @description Create date picker
     * @return {void}
     */
    create(){
        const self = this;
        if(self.$element.val().trim() !== ''){
            const valeur = self.$element.val();
            const pattern = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);
            if(pattern.test(valeur)){
                self.selectedDate = new Date(valeur.substring(6), valeur.substring(3, 5) - 1, valeur.substring(0, 2));
                self.date =  new Date(valeur.substring(6), valeur.substring(3, 5) - 1);
            }else{
                console.error('La chaîne entrée ne correspond pas au format de la date.');
            }
        }
        self.$html = $('<div class="datepicker-container bottom">' + self.createCalendar(self) + '</div>');
        self.setEvents(self);
        let offset = self.getOffset(self.$element[0]);
        
        if(offset.top + self.$element[0].offsetHeight + 300 > window.innerHeight + window.pageYOffset){
            self.$html.removeClass('bottom');
            self.$html.addClass('top');
        }else{
            self.$html.removeClass('top');
            self.$html.addClass('bottom');
        }
        self.$element.after(this.$html);
    }

    createCalendar(self){
        let currentDate = new Date().getDate();
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();
        let firstDay = new Date(self.date.getFullYear(), self.date.getMonth(), 1);
        let lastDay = new Date(self.date.getFullYear(), self.date.getMonth() + 1, 0);
        let dayOfMonth = lastDay.getDate();
        let currentDay = 1;
        let dayOfWeek = 0;
        let begin = true;
        let end = false;
        let html = '<p class="select"><span class="fa fa-angle-left left"></span><span class="fa fa-angle-double-left left"></span>' + self.capitalizeFirstLetter(self.settings.month[self.date.getMonth()]) + ' ' + self.date.getFullYear() + '<span class="fa fa-angle-right right"></span><span class="fa fa-angle-double-right right"></span></p>';
        html += '<table class="datepicker">';   
        html += '<tr>';
        for(var key in self.settings.dayShortNames){
            html += '<th>' + self.settings.dayShortNames[key] + '</th>';        
        };
        html += '</tr><tr>';
        while(true){
            if(dayOfWeek === 7){
                dayOfWeek = 0
                html += '</tr><tr>';
            }
            if(((dayOfWeek !== self.getMonday(firstDay.getDay())) && begin) || end){
                if(!end){
                    const datePrev = new Date(firstDay);
                    datePrev.setDate(datePrev.getDate() - (self.getMonday(firstDay.getDay()) - (dayOfWeek)));
                    html += '<td><span class="other" data-value="' + ((datePrev.getDate()<10?'0' + datePrev.getDate():datePrev.getDate()) + "/" + (datePrev.getMonth() + 1 < 10?'0' + (datePrev.getMonth() + 1):datePrev.getMonth() + 1) + "/" + datePrev.getFullYear()) + '">' + datePrev.getDate()  + '</span></td>';
                    dayOfWeek++;
                    continue;   
                }else{
                    const dateNext = new Date(lastDay);
                    if(dayOfWeek >= 6){
                        dateNext.setDate(dateNext.getDate() + ((dayOfWeek + 1)- lastDay.getDay()));
                        html += '<td><span class="other" data-value="' + ((dateNext.getDate()<10?'0' + dateNext.getDate():dateNext.getDate()) + "/" + (dateNext.getMonth() + 1 < 10?'0' + (dateNext.getMonth() + 1):dateNext.getMonth() + 1) + "/" + dateNext.getFullYear()) + '">' + dateNext.getDate()  + '</span></td>';
                        break;
                    }else{
                        dateNext.setDate(dateNext.getDate() + ((dayOfWeek + 1) - lastDay.getDay()));
                        html += '<td><span class="other" data-value="' + ((dateNext.getDate()<10?'0' + dateNext.getDate():dateNext.getDate()) + "/" + (dateNext.getMonth() + 1 < 10?'0' + (dateNext.getMonth() + 1):dateNext.getMonth() + 1) + "/" + dateNext.getFullYear()) + '">' + dateNext.getDate()  + '</span></td>';
                        dayOfWeek++
                        continue;
                    }
                }
            }else if(currentDate === currentDay && self.date.getMonth() === currentMonth && self.date.getFullYear() === currentYear){
                begin = false;
                if(self.selectedDate !== null){
                    if(self.selectedDate.getDate() === currentDay && self.selectedDate.getMonth() === self.date.getMonth() && self.selectedDate.getFullYear() === self.date.getFullYear()){
                        html += '<td class="active"><span class="current" data-value="' + ((currentDay < 10?'0' + currentDay:currentDay) + "/" + (self.date.getMonth() + 1 < 10?'0' + (self.date.getMonth() + 1):self.date.getMonth()) + "/" + self.date.getFullYear()) + '">' + currentDay + '</span></td>';
                    }else{
                        html += '<td><span class="current" data-value="' + ((currentDay < 10?'0' + currentDay:currentDay) + "/" + (self.date.getMonth() + 1 < 10?'0' + (self.date.getMonth() + 1):self.date.getMonth() + 1) + "/" + self.date.getFullYear()) + '">' + currentDay + '</span></td>';
                    }   
                }else{
                    html += '<td><span class="current" data-value="' + ((currentDay < 10?'0' + currentDay:currentDay) + "/" + (self.date.getMonth() + 1 < 10?'0' + (self.date.getMonth() + 1):self.date.getMonth() + 1) + "/" + self.date.getFullYear()) + '">' + currentDay + '</span></td>';
                }
            }else{
                begin = false;
                if(self.selectedDate !== null){
                    if(self.selectedDate.getDate() === currentDay && self.selectedDate.getMonth() === self.date.getMonth() && self.selectedDate.getFullYear() === self.date.getFullYear()){
                        html += '<td class="active"><span data-value="' + ((currentDay < 10?'0' + currentDay:currentDay) + "/" + (self.date.getMonth() + 1 < 10?'0' + (self.date.getMonth() + 1):self.date.getMonth() + 1) + "/" + self.date.getFullYear()) + '">' + currentDay + '</span></td>';
                    }else{
                        html += '<td><span data-value="' + ((currentDay < 10?'0' + currentDay:currentDay) + "/" + (self.date.getMonth() + 1 < 10?'0' + (self.date.getMonth() + 1):self.date.getMonth()+ 1) + "/" + self.date.getFullYear()) + '">' + currentDay + '</span></td>';
                    }
                }else{
                    html += '<td><span data-value="' + ((currentDay < 10?'0' + currentDay:currentDay) + "/" + (self.date.getMonth() +  1 < 10?'0' + (self.date.getMonth() + 1):self.date.getMonth() + 1) + "/" + self.date.getFullYear()) + '">' + currentDay + '</span></td>';
                }
            }
            if(currentDay === dayOfMonth){
                end = true;
            }
            currentDay++;
            dayOfWeek++;
        }        
        html += '</tr>';
        html += '</table>';
        return html;
    }

    getMonday(current){
        return current === 0?6:current - 1
    }

    /**
     * @description Get offset of element
     * @param {object} el 
     * @return {object} 
     */
     getOffset(el) {
        let x = 0;
        let y = 0;
        while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top:y, left:x };
    }

    /**
     * @description Hide date picker
     * @param {object} self HTML element
     * @return {void}
     */
    hide(self){
        if(self.$element.val() === ''){
            self.date = new Date();
        }
        self.$element.next().remove();
        self.isOpen = false;
    }

    /**
     * @description Initialize date picker
     * @return {void}
     */
    init(){
        const self = this;
        self.date = new Date();
        self.$element.on('click', () =>{
            if(self.isOpen){
                self.hide(self);
            }else{
                self.show(self);
            }
        });
    }

    /**
     * @description Next month of date picker
     * @param {*} self
     * @return {void} 
     */
    next(self){
        if(self.date.getMonth() < 11){
            self.date.setMonth(self.date.getMonth() + 1);
        }else{
            self.date.setMonth(0);
            self.date.setFullYear(self.date.getFullYear() + 1);
        }
        self.$html.html('');
        self.$html.html(self.createCalendar(self));
        self.setEvents(self);
    }

    /**
     * @description Next year of date picker
     * @param {object} self
     * @return {void}
     */
    nextYear(self){
        self.date.setFullYear(self.date.getFullYear() + 1);
        self.$html.html('');
        self.$html.html(self.createCalendar(self));
        self.setEvents(self);
    }

    /**
     * @description Previous month of date picker
     * @param {object} self
     * @return {void}
     */
    prev(self){
        if(self.date.getMonth() > 0){
            self.date.setMonth(self.date.getMonth() - 1);
        }else{
            self.date.setMonth(11);
            self.date.setFullYear(self.date.getFullYear() - 1);
        }
        self.$html.html('');
        self.$html.html(self.createCalendar(self));
        self.setEvents(self);
    }

    /**
     * @description Previous year of date
     * @param {object} self HTML element
     * @return {void}
     */
    prevYear(self){
        self.date.setFullYear(self.date.getFullYear() - 1);
        self.$html.html('');
        self.$html.html(self.createCalendar(self));
        self.setEvents(self);

    }

    /**
     * @description Set events of date picker
     * @param {object} self HTML element
     * @return {void} 
     */
    setEvents(self){
        self.$html.find('td').on('click', (e)=> {self.click(self, e)});
        self.$html.find('span.fa-angle-left').on('click', (e)=> {self.prev(self)});
        self.$html.find('span.fa-angle-right').on('click', (e)=> {self.next(self)});
        self.$html.find('span.fa-angle-double-left').on('click', (e)=> {self.prevYear(self)});
        self.$html.find('span.fa-angle-double-right').on('click', (e)=> {self.nextYear(self)});
    }

    /**
     * @description Show date picker
     * @param {object} self HTML element 
     * @return {void}
     */
    show(self){
        self.create();
        self.isOpen = true;
    }
}

export {DatePicker};