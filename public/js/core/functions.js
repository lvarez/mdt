/*
 * @param INT radian
 * @return INT
 */
export function degrees(radians){
    return radians * 180 / Math.PI;
};

/*
 * @param INT degrees
 * @return INT
 */
export function radians(degrees){
    return degrees * Math.PI / 180;
};

/*
 * @param INT degrees
 * @return INT
 */
export function ratio(width, height){
    return width/height;
}

/*
 * @param hexadecimal number - hex
 * @param INT           opacity
 * @return string       rgba(255, 255, 255, 1) or rgb(255, 255, 255);
 */
export function hex2rgba(hex, opacity = 1){
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    if(opacity === 1){
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }else{
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
    }
};

/*
 * @param INT r         Red
 * @param INT g         Green
 * @param INT b         Blue
 * @return STRING       #ffffff;
 */
export function rgb2hex(r, g, b){
    return '#' + r.toString(16) + g.toString(16) + b.toString(16);
};