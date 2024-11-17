/*
 * ======================================================================
 * Class Excel
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Excel{

    /**
     * @description Constructor
     * @param {*} options 
     */
    constructor(options){
        const defaults = {

        }
        this.settings = $.Extend(defaults, options);
        this.version = '0.1 beta'
        this.init();
    }

    /**
     * @description Initialize excel
     * @return {void}
     */
    init(){

    }
}