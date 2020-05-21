//configuration

requirejs.config({
    baseUrl: 'Scripts',
    paths: {
        'jquery': 'Libraries/JQuery/jquery',
        'jqueryui': 'Libraries/jquery-ui-1.12.1/jquery-ui',
        'sweetalert': 'Libraries/SweetAlert/sweetalert2.all',
        'datatables': 'Libraries/DataTables/datatables',
        'datatables.net': 'Libraries/DataTables/datatables.min'
    },
    shim: {
        'jqueryui': {
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