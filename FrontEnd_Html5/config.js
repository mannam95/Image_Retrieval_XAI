//configuration
requirejs.config({
    baseUrl: 'Scripts',
    paths: {
        jquery: ['Libraries/JQuery/jquery'],
        jqueryui: ['Libraries/jquery-ui-1.12.1/jquery-ui'],
        'sweetalert': ['Libraries/SweetAlert/sweetalert2.all'],
        'datatables': ['Libraries/DataTables/datatables'],
        'es6promise': ['Libraries/Polyfill/es6-promise.auto'],
        'zingchart': ['Libraries/zingchart/zingchart.min'],
        'bootstrap': ['Libraries/bootstrap-3.3.7-dist/js/bootstrap'],

        'datatables.net': ['Libraries/DataTables/jquery.dataTables.min'],
        'datatables.net-buttons': ['//cdn.datatables.net/buttons/1.5.2/js/dataTables.buttons.min'],
        'datatables.net-buttons-html5': ['//cdn.datatables.net/buttons/1.5.2/js/buttons.html5.min'],
        'datatables.net-buttons-flash': ['//cdn.datatables.net/buttons/1.5.2/js/buttons.flash.min'],

        'jszip': ['//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min']
    },
    shim: {
        jqueryui: {
            deps: ['jquery'],
        },
        'bootstrap': {
            deps: ['jquery'],
        },
        'sweetalert': {
            deps: ['jquery'],
        },
        'datatables': {
            deps: ['jquery'],
        },
        'datatables.net': {
            deps: ['jquery']
        },
        'script': {
            deps: ['datatables.net']
        }

    },
    waitSeconds: 7

});