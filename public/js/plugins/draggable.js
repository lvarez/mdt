/*
 * ======================================================================
 * Class Draggable
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Draggable{

    /**
     * @designation Constructor
     * @param {object} element HTML element 
     * @param {array} options Array of draggable options 
     */
    constructor(element, options){
        const defaults = {

        }
        this.$element       = $(element);
        this.settings       = $.extend(this.defaults, options);
        this.dragElement    = null;
        this.init();
    }

    /**
     * @designation Drag end
     * @param {*} e
     * @return {void} 
     */
    dragEnd(e){
        e.target.classList.remove('draggable');
        $(e.target).siblings().removeClass('dragOver');
    }

    /**
     * @designation Drag enter
     * @param {*} e 
     * @return {void}
     */
    dragEnter(e){
        e.target.classList.add('dragOver');
    }

    /**
     * @designation Drag leave
     * @param {*} e 
     * @return {void}
     */
    dragLeave(e){
        e.stopPropagation();
        e.target.classList.remove('dragOver');
    }

    /**
     * @designation Drag over
     * @param {*} e 
     * @return {void}
     */
    dragOver(e){
        e.preventDefault();
        e.originalEvent.dataTransfer.dropEffect = 'move';
        return false;
    }

    /**
     * @designation Drag start
     * @param {*} e 
     * @return {void}
     */
    dragStart(e){
        this.dragElement = e.target;
        e.target.classList.add('draggable');
        e.originalEvent.dataTransfer.effectAllowed = 'move';
        e.originalEvent.dataTransfer.setData('text/html', e.target.innerHTML);
    }

    drop(e){
        this.dragElement.innerHTML = e.target.innerHTML;
        $(e.target).html(e.originalEvent.dataTransfer.getData('text/html'));
        return false;
    }

    /**
     * @designation Initialize draggable
     * @return {void}
     */
    init(){
        $.each(this.$element.find('li'), (key, value)=>{
            $(value).on('dragstart', (e)=>{this.dragStart(e)});
            $(value).on('dragenter', (e)=>{this.dragEnter(e)});
            $(value).on('dragover', (e)=>{this.dragOver(e)});
            $(value).on('dragleave', (e)=>{this.dragLeave(e)});
            $(value).on('drop', (e)=>{this.drop(e)});
            $(value).on('dragend', (e)=>{this.dragEnd(e)});
        });
    }
}

export {Draggable};