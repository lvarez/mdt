import {ContextMenu} from './contextmenu.js';

export class DataTable{

    constructor(element, options){
        const defaults = {
            autoFill:true,
            classes:{
                pagination:'paginate',
                table:'table table-sm table-bordered table-striped table-hover tableData'
            },
            pageRecords: 20,
            paginationPages:10,
            paginationClass:'',
            paging:false,
            url:null
        }
        this.data               = null;
        this.$element           = $(element);
        this.settings           = $.extend(defaults, options);
        this.currentPage        = 1;
        this.currentPagination  = 1;
        this.totalPages         = null;
        this.totalRecords       = null;
        this.totalPagination    = null;
        this.eventDraw          = $.Event('draw');
        this.init();
    }

    /**
     * @description Click
     * @param {*} e 
     * @return {void}
     */
    click(e){
        let pagination = $(e.target).closest('a').data('action');
        switch(pagination){
            case 'First' :
            case 'Premier':
                this.currentPage = 1;
                this.currentPagination = 1;
                this.drawTbody();
                this.drawPagination();
                break;
            case 'Previous' :
            case 'Précédent':
                if(this.currentPage > 1){
                    this.currentPage--;
                    if((this.currentPage) % this.settings.paginationPages === 0 && this.currentPagination > 1){
                        this.currentPagination--;
                    }
                    this.drawTbody();
                    this.drawPagination();
                }
                break;
            case 'Next' :
            case 'Suivant':
                if(this.currentPage < this.totalPages){
                    this.currentPage++;
                    if((this.currentPage - 1) % this.settings.paginationPages === 0 && this.currentPagination < this.totalPagination){
                        this.currentPagination++;
                    }
                    this.drawTbody();
                    this.drawPagination();
                }
                break;
            case 'Last' :
            case 'Dernier':
                this.currentPage = this.totalPages;
                this.currentPagination = this.totalPagination;
                this.drawTbody();
                this.drawPagination();
                break;
            case 'PaginateMinus':
                this.currentPage = this.currentPage - this.settings.paginationPages;
                this.currentPagination--;
                this.drawTbody();
                this.drawPagination();
                break;
            case 'PaginatePlus':
                this.currentPagination++;
                this.currentPage = this.currentPage + this.settings.paginationPages;
                this.drawTbody();
                this.drawPagination();
                break;
            default:
                this.currentPage = Number(pagination);
                this.drawTbody();
                this.drawPagination();                
                break;
        }
    }

    create(){
        const table = $('<table/>');
        table.addClass(this.settings.classes.table);
        this.$element.append(table);
        this.drawThead();
    }

    createLi(action, content, disabled = false, link = '#'){
        const li = $('<li/>');
        if(disabled){
            li.addClass('disabled');
        }
        const a = $('<a/>');
        a.attr('href', link);
        a.attr('data-action', action);
        if(isNaN(content)){
            if(content === '...'){
                a.html(content);
            }else{
                let i = $('<i/>');
                i.addClass(content);
                a.append(i);
            }
        }else{
            if(this.currentPage === content){
                li.addClass('active');
            }
            a.html(content);
        }
        li.append(a);
        return li;
    }

    csv(filename = 'data.csv'){
        let result = '';
        for(let title in this.data[0]){
            result += title + '; ';
        }
        result = result.substring(0, result.length - 2);
        result += '\n';
        for(let line in this.data) {
            for(let field in this.data[line]){
                result += this.data[line][field] + '; ';
            }
            result = result.substring(0, result.length - 2);
            result += '\n';
        }
        let hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(result);
        hiddenElement.target = '_blank';
        hiddenElement.download = filename;  
        hiddenElement.click();  
    }

    /**
     * Summary of draw
     * 
     */
    draw(){
        this.drawTbody();
        this.drawPagination();
    }

    /**
     * Summary of drawTbody
     * @returns 
     */
    drawTbody(){
        const columns = this.settings.columns.map(column => column.data);
        const tbody = $('<tbody/>');
        let rows = 0;
        let begin = (this.currentPage - 1) * this.settings.pageRecords;
        let end = begin + this.settings.pageRecords;
        for(let i=begin;i<end;i++){
            if(i>=this.totalRecords){
                break;
            }
            let tr = $('<tr/>');
            tr.attr('data-id', this.data[i].id);
            let record = this.data[i];
            for(let column in this.settings.columns){
                for(let field in record){
                    if(this.settings.columns[column].data === field && this.settings.columns[column].visible !== false){
                        let td  = $('<td/>');
                        if(typeof this.settings.columns[column].className !== undefined){
                            td.addClass(this.settings.columns[column].className);
                        }
                        td.html(record[field]);
                        tr.append(td);
                   }
                }
            }
            tbody.append(tr);
            rows++;
        }
        this.$element.find('tbody').remove();
        this.$element.find('.tableData-page').remove();
        this.$element.find('table').append(tbody);
        this.$element.find('.loading').remove();
        if(rows < this.settings.pageRecords){
            const height = (this.$element.find('tbody tr:first').outerHeight() * (this.settings.pageRecords - rows)) +'px';
            this.$element.find('table').after('<div class="tableData-page" style="height:' + height + '"></div>');
        }
        this.setEventsTbody();
        this.$element.trigger(this.eventDraw);
    }

    /**
     * Summary of drawPagination
     * @returns 
     */
    drawPagination(){
        this.$element.find('.paginateContainer').remove();
        const div = $('<div/>');
        div.addClass('paginateContainer');
        const ul = $('<ul/>');
        ul.addClass(this.settings.classes.pagination);
        let li;
        if(this.currentPage === 1){
            // first
            li = this.createLi('First', 'fa-solid fa-angles-left', true);
            ul.append(li);
            // prev
            li = this.createLi('Previous', 'fa-solid fa-angle-left', true);
            ul.append(li);
        }else{
            // first
            li = this.createLi('First', 'fa-solid fa-angles-left');
            ul.append(li);
            // prev
            li = this.createLi('Previous', 'fa-solid fa-angle-left');
            ul.append(li);
        }
        // paginateMinus
        if(this.totalPages > this.settings.paginationPages){
            if(this.currentPagination < 2){       
                li = this.createLi('PaginateMinus', '...', true);
                ul.append(li);
            }else{
                li = this.createLi('PaginateMinus', '...');
                ul.append(li);
            }
        }
        // Begin
        let begin;
        if(this.currentPagination === 1){
            begin = 1;
        }else{
            begin = ((this.currentPagination - 1) * this.settings.paginationPages) + 1
        }
        // End
        let end;
        if(this.totalPages > this.settings.paginationPages){
            if(this.currentPagination === 1){
                end = this.settings.paginationPages;
            }else{
                if(this.currentPagination === this.totalPagination){
                    end = this.totalPages;
                }else{
                    end = this.currentPagination * this.settings.paginationPages;
                }
            }
        }else{
            end = this.totalPages;
        }
        // Create numbers
        for(let i=begin;i<=end;i++){
            li = this.createLi(i, i);
            ul.append(li);
        }
        if(this.totalPages > this.settings.paginationPages){
            if(((this.currentPage + this.settings.paginationPages) > this.totalPages) || ((this.currentPagination + this.settings.paginationPages) > this.totalPages)){
                // paginatePlus
                li = this.createLi('PaginatePlus', '...', true);
                ul.append(li);
            }else{
                // paginatePlus
                li = this.createLi('PaginatePlus', '...');
                ul.append(li);
            }
        }
        if(this.currentPage === this.totalPages){
            // next
            li = this.createLi('Next', 'fa-solid fa-angle-right', true);
            ul.append(li);
            // Last
            li = this.createLi('Last', 'fa-solid fa-angles-right', true);
            ul.append(li);
        }else{
            // next
            li = this.createLi('Next', 'fa-solid fa-angle-right');
            ul.append(li);
            // Last
            li = this.createLi('Last', 'fa-solid fa-angles-right');
            ul.append(li);
        }
        div.append(ul);
        this.$element.append(div);
        this.setEventsPagination();
    }

    /**
     * Summary of drawThead
     * @returns 
     */
    drawThead(){
        this.$element.find('thead').remove();
        const thead = $('<thead/>');
        let tr = $('<tr/>');
        for(let column in this.settings.columns){
            let visible = ((typeof this.settings.columns[column].visible === undefined)? true : (this.settings.columns[column].visible !== false)? true : false);
            if(visible){
                let th = $('<th/>');
                th.attr('data-sort', this.settings.columns[column].data);
                if(this.settings.columns[column].width){
                    th.css('width', this.settings.columns[column].width);
                }
                if(this.settings.sortName === this.settings.columns[column].data){
                    if(this.settings.sortDirection === 'asc'){
                        th.html(this.settings.columns[column].label + '<i class="fa-solid fa-arrow-down-a-z"></i>');
                    }else{
                        th.html(this.settings.columns[column].label + '<i class="fa-solid fa-arrow-down-z-a"></i>');
                    }
                }else{
                    th.html(this.settings.columns[column].label + '<i class="fa-solid fa-sort"></i>');
                }
                tr.append(th);
            }
        }
        thead.append(tr);
        this.$element.find('table').append(thead);
        this.setEventsThead();
    }

    /**
     * Summary of init
     * @return {void}
     */
    init(){
        if(typeof this.$element.data('options') !== 'undefined'){
            this.getConfig(this.$element.data('options'));
       }else{
            if(this.settings.url){
                this.create();
                this.getData(this.settings.url);
            }
       }
    }

    /**
     * Summary of loading
     * @return {void}
     */
    loading(){
        if(this.$element.find('tbody').length === 0){
            const tbody = $('<tbody/>');
            for(let i = 1; i<this.settings.pageRecords; i++){
                let tr = $('<tr/>');
                for(let column in this.settings.columns){
                    let td = $('<td/>');
                    td.html('&nbsp');
                    tr.append(td);
                }
                tbody.append(tr);
            }
            this.$element.find('table').append(tbody);
        }
        const div = $('<div/>');
        div.css('height', this.settings.pageRecords * this.$element.find('tbody tr:first').outerHeight());
        div.addClass('loading');
        div.html('<span class="spinner-border text-mdt" aria-hidden="true"></span>');
        this.$element.append(div);
    }

    getConfig(url){
        fetch(url)
        .then(response =>{
            if(!response.ok){
                throw new Error(`HTTP error : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            this.settings = $.extend(this.settings, data);
            this.create();
            this.getData(this.settings.url);
        })
        .catch(error =>{
            console.error(`Could not fetch : ${error}`);
        });
    }

    /**
     * Summary of getData
     * @param {string} url 
     */
    getData(url){
        this.loading();
        fetch(url)
        .then(response => {
            if(!response.ok){
                throw new Error(`HTTP error : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            this.data = data;
            this.totalRecords = this.data.length;
            this.totalPages = Math.ceil(this.totalRecords / this.settings.pageRecords);
            this.totalPagination = Math.ceil(this.totalPages / this.settings.paginationPages);
            this.sortLocale(this.settings.sortName, this.settings.sortDirection);
            this.draw();
        })
        .catch(error => {
            this.$element.find('.loading').remove();
            console.error(`Could not fetch : ${error}`);
        });
    }

    /**
     * 
     * @returns Summary of getTotalPages
     */
    getTotalPages(){
        return this.totalPages;
    }

    getTotalRecords(){
        return this.totalRecords;
    }

    /**
     * Summary of print
     * @return {void}
     */
    print(){
        let win = window.open('index.html', '_blank');
        win.document.write('<html lang="fr"><head><title></title>');
        win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">');
        win.document.write('</head><body><table class="table table-striped">');
        let result = '<thead><tr>';
        for(let title in this.data[0]){
            result += '<th>' + title + '</th>';
        }
        result += '</tr></thead><tbody>';
        for(let line in this.data){
            result += '<tr>';
            for(let field in this.data[line]){
                result += '<td>' + this.data[line][field] + '</td>';
            }
            result += '</tr>';
        }
        win.document.write(result);
        win.document.write('</tbody></table></body></html>');
        win.document.close();
        win.onafterprint = window.close;
        win.print(); 
    }

    refresh(){
        this.currentPage = 1;
        this.currentPagination = 1;
        if(this.settings.url){
            this.getData(this.settings.url);
        }
    }

    /**
     * Summary of setEventsPagination
     * @return {void}
     */
    setEventsPagination(){
        const self = this;
        this.$element.find(`.${this.settings.classes.pagination}`).on('click', 'a', function(e){
            e.preventDefault();
            if(!$(e.target).parent().hasClass('disabled')){
                self.click(e);
            }
        });
    }

    /**
     * Summary serEventsTbody
     * @return {void}
     */
    setEventsTbody(){
        // new ContextMenu(this.$element.find('tbody'));
        // this.$element.find('tbody').on('contextmenu', (e)=>{
        //     e.preventDefault();
        // });
        this.$element.find('tbody td').each(function(){
            $(this).on('dblclick', ()=>{
                $('[id^=edit-]').trigger('click');
            });
        });
        this.$element.find('tr:has(td)').on('click', function(e){
            if(!$(this).hasClass('table-active')){
                $('tr').removeClass('table-active');
            }
            $(e.target).parent().addClass('table-active');
        });
        // this.$element.find('tr:has(td)').on('contextmenu', function(e){
        //     if(!$(this).hasClass('table-active'))
        //     {
        //         $('tr').removeClass('table-active');
        //     }            
        //     $(e.target).parent().addClass('table-active');
        // });
    }

    /**
     * Summary of setEventsThead
     * @return {void}
     */
    setEventsThead(){
        const self = this;
        this.$element.find('thead th').on('click', function(e){
            e.preventDefault();
            self.sort(e);
        });
    }

    /**
     * @description Set the number of page records
     * @param {Number} pageRecords 
     */
    setRecordsPage(pageRecords){
        this.currentPage = 1;
        this.currentPagination = 1;
        this.settings.pageRecords = pageRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.settings.pageRecords);
        this.totalPagination = Math.ceil(this.totalPages / this.settings.paginationPages);
        this.drawTbody();
        this.drawPagination();
    }

    /**
     * @designation Sort
     * @param {object} e Event 
     * @return {void}
     */
    sort(e){
        this.loading();
        const field = $(e.target).attr('data-sort');
        if(this.settings.sortName === field){
            if(this.settings.sortDirection === 'asc'){
                this.settings.sortDirection = 'desc';
                this.sortLocale(field, 'desc');
            }else{
                this.settings.sortDirection = 'asc';
                this.sortLocale(field, 'asc');
            }
        }else{
            this.settings.sortName = field;
            this.settings.sortDirection = 'asc';
            this.sortLocale(field, 'asc');
        }
        this.drawThead();
        this.drawTbody();
    }

    /**
     * @description Sort by localCompare
     * @param {} prop 
     * @param {*} asc 
     * @param {*} locales 
     * @param {*} options 
     */
    sortLocale(prop, direction = 'asc', locales = 'fr', options = { sensitivity: 'base' }){
        if(direction === 'asc'){
            this.data = this.data.sort((a, b) => {
                a[prop] = a[prop] || '';
                b[prop] = b[prop] || '';
                return a[prop].localeCompare(b[prop], locales, options);
            });
        }else{
            this.data = this.data.sort((a, b) => {
                a[prop] = a[prop] || '';
                b[prop] = b[prop] || '';
                return b[prop].localeCompare(a[prop], locales, options);
            });
        }
    }

    /**
     * @designation Sort results
     * @param {string} prop 
     * @param {boolean} asc 
     * @param {boolean} caseSensitive
     * @return {void}
     */
    sortResults(prop, asc = true, caseSensitive = false) {
        if(caseSensitive){
            this.data = this.data.sort(function(a, b) {
                if(asc){
                    return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
                } else {
                    return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
                }
            });
        }else{
            this.data = this.data.sort(function(a, b) {
                if(asc){
                    return (a[prop].toLowerCase() > b[prop].toLowerCase()) ? 1 : ((a[prop].toLowerCase() < b[prop].toLowerCase()) ? -1 : 0);
                } else {
                    return (b[prop].toLowerCase() > a[prop].toLowerCase()) ? 1 : ((b[prop].toLowerCase() < a[prop].toLowerCase()) ? -1 : 0);
                }
            });
        }
    }    
}