/*
 * ======================================================================
 * Class Csv
 * ======================================================================
 * http://www.microdowntown.com
 * Copyright 2019 Micro Downtown
 * ====================================================================== 
 */
class Csv{

    /**
     * @description Constructor
     * @param {array} options Array of CSV options 
     */
    constructor(options){
        const defaults = {
            delimiter:','
        };
        this.settings   = $.extend(defaults, options);
        this.version    = '0.1 beta'
    }

    /**
     * @description Convert JSON to CSV
     * @static
     * @param {string} JSON 
     * @param {string} delimiter Delimiter of CSV file 
     * @returns 
     */
    static jsonToCsv(objArray, delimiter = ','){
        let data = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        for(let i=0;i<data.length;i++) {
            let line = '';
            for (let index in data[i]) {
                if (line != '') {
                    line += delimiter
                }
                line += data[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }
}