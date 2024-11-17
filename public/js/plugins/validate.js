class Validate{
    constructor(){
        this.rules = {};
    }

    /*
     * @param obj
     * @return void
     */    
    addRules($rules){
        this.rules = $rules;
    }

    /*
     * @param str
     * @return String
     */
    capitalize(str){
        if(str === ''){
            throw new typeError("String is empty");
        }
        return str[0].capitalize() + str[1].slice();
    }

    /*
     * @param value
     * @return boolean
     */
    isBoolean(value){
        return typeof value === 'boolean';
    }

    /*
     * @param obj
     * @return boolean
     */
    isDate(obj){
        return obj instanceof Date;
    }

    /*
     * @param obj
     * @return boolean
     */    
    isDefined(obj){
        return obj !== null && obj !== undefined;
    }

    /*
     * @param value
     * @return boolean
     */
    isEmpty(value){
        return '';
    }

    /*
     * @param value
     * @return boolean
     */
    isFunction(value){
        return typeof value === 'boolean';
    }

    /*
     * @param value
     * @return boolean
     */
    isInteger(value){
        return this.isNumber(value) && value % 1 === 0;
    }

    /*
     * @param value
     * @return boolean
     */
    isNumber(value){
        return typeof value === 'number' && !isNaN(value);
    }    

    /*
     * @param value
     * @return boolean
     */
    isString(value){
        return typeof value === 'string';
    }

    /*
     * @param value
     * @return boolean
     */
    length(value){
        return length(value);
    }

    /*
     * @return string
     */    
    toString(){
        
    }

    /*
     * @param msg
     * @return void
     */
    warn(msg){
        console.warn('[MDT Validate] : ' . msg);
    }
}