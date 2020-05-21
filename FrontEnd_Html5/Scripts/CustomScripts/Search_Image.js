define(['jquery', 'jqueryui', 'sweetalert', 'datatables'], function ($, jqueryui, swal, datatables) {
    $(function () {

        // store all the variables as an object properties
        var pageDetails = {
            data: 'Testing',
            imageName: '',
            duplicateImageName: '',
            displayImageCharacterslen: 15,
            currentBrowserURL: $(location).attr('href'),
            idDetails: ['#MainDiv', '#hideLabelId', '#fileUploadID', '#fileNameId', '#fileImgID', '#SearchBtn'],
            supportedImageFormats: [".JPG", ".JPEG", ".PNG", ".BMP", ".TIFF", ".SVG", "EXIF", "JFIF"],
        };

        var tableData = [{
            ID: 0,
            imageURL: 'imagesData/Sample1.jpg',
            imageDetails: 'Dog'
        }, {
            ID: 1,
            imageURL: 'imagesData/Sample2.jpg',
            imageDetails: 'Butterfly'
        }, {
            ID: 2,
            imageURL: 'imagesData/Sample3.jpg',
            imageDetails: 'Parrot'
        }, {
            ID: 3,
            imageURL: 'imagesData/Sample4.jpg',
            imageDetails: 'Nature'
        }, {
            ID: 4,
            imageURL: 'imagesData/Sample5.jpg',
            imageDetails: 'Riding Bycycle'
        }];

        //When everything is loaded what to do first
        $(document).ready(function () {
            try {
                //loader before loading the data
                // $('body').addClass("loading");
                $(pageDetails.idDetails[0]).css("display", "block");
                $(pageDetails.idDetails[1]).hide();
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }

        });

        //detect change events when the user browses for an image
        $(pageDetails.idDetails[2]).change(function (e) {
            try {
                if (this.files && this.files.length > 0) {
                    pageDetails.imageName = e.target.value.split('\\').pop();
                    if (filesizevalidation(pageDetails.idDetails[2])) {
                        pageDetails.duplicateImageName = pageDetails.imageName;
                        if (pageDetails.imageName.length > pageDetails.displayImageCharacterslen) {
                            pageDetails.duplicateImageName = pageDetails.imageName.slice(0, 4) + '....' + pageDetails.imageName.slice(pageDetails.imageName.length - 6, pageDetails.imageName.length)
                        }
                        $(pageDetails.idDetails[3]).text(pageDetails.duplicateImageName);
                        $(pageDetails.idDetails[1]).show();

                    } else {
                        swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Invalid File! Please select a valid file!'
                        });
                    }
                }
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });

        //remove the file context when the user clicks on remove image symbol and hide
        $(pageDetails.idDetails[4]).click(function () {
            try {
                $(pageDetails.idDetails[2]).val('');
                $(pageDetails.idDetails[1]).hide();
                pageDetails.duplicateImageName = pageDetails.imageName = '';

                //hide and remove the table context once the user clicks on remove image
                $('#irtexdbID').hide();
                pageDetails.tabledetails.destroy();
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });

        //On click of the search button
        $(pageDetails.idDetails[5]).click(function () {
            try {
                if ($(pageDetails.idDetails[2]).val() == '' || $(pageDetails.idDetails[2]).val() == null || $(pageDetails.idDetails[2]).val() == undefined) {
                    swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select an image!'
                    });
                } else {

                    if ($.fn.DataTable.isDataTable('#irtexdbID')) {
                        pageDetails.tabledetails.destroy();
                    }

                    CreateDatatable('irtexdbID', tableData);
                    $("[id^='accordion']").accordion({ header: "h3", collapsible: true, active: false, heightStyle: "content" });
                    $('#irtexdbID').show();
                    $("#irtexdbID").css("width", "100%");

                }
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });

        //this function will validate the file whether it is an image or not and valid file or not
        function filesizevalidation(fileuploadid) {
            try {
                var fileMinSize = 0;
                var fileValidation = false;
                var fileInput = $(fileuploadid);
                for (var i = 0; i < fileInput[0].files.length; i++) {
                    if (fileInput[0].files[i].size > fileMinSize) {
                        fileValidation = ((pageDetails.supportedImageFormats.indexOf((pageDetails.imageName.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi)[0]).toUpperCase())) >= 0 ? true : false);
                    } else {
                        fileValidation = false;
                        break;
                    }
                }
                return fileValidation;

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }


        // detect when the accoirdion is clicked and collapse all other than the current one
        $(document).on('click', '[id^="accordion"]', function () {
            try {
                $("[id^='accordion']:not(#" + this.id + ")").accordion({ header: "h3", collapsible: true, active: false, heightStyle: "content" });

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });


        //to create the data table
        function CreateDatatable(TableName, BindingData) {
            var deferred = $.Deferred();
            try {
                pageDetails.tabledetails = $('#' + TableName).DataTable({
                    dom: 'lrtip',
                    data: BindingData,
                    "deferRender": true,
                    columns: [{
                        "className": 'CustomClass',
                        "orderable": false,
                        "data": null,
                        render: function (data, type, row) {
                            return '<input type="checkbox" id="selectIndex' + row.ID + '">';
                        }
                    },
                    {
                        "className": 'CustomClass',
                        "orderable": false,
                        "data": null,
                        render: function (data, type, row) {
                            return '<label>' + (row.ID + 1) + '</label>';
                        }
                    },
                    {
                        "data": "imageURL",
                        "className": 'thirdColumnClass',
                        render: function (data, type, row) {
                            return '<img class="tableImgClass" src="' + data + '"/>';
                        },
                        "orderable": false
                    },
                    {
                        "data": "imageDetails",
                        "className": 'lastCOlumnClass',
                        render: function (data, type, row) {
                            return '<div style:width:100%;>' +
                                '<div id="accordion' + (row.ID + 1) + '">' +
                                '<h3>Explain</h3>' +
                                '<div style="height: auto !important;">' +
                                '<p>' + data + '</p>' +
                                '<p><input class="VisualBtnClass" type="button" value="Visual Explanation" id="VisualBtn' + (row.ID + 1) + '"></p>' +
                                '</div>' +
                                '</div>' +
                                '</div>';
                        },
                        "autoWidth": false,
                        "orderable": false,
                    }
                    ],
                    // "aaSorting": [[1, 'dsc']],
                    "lengthMenu": [
                        [10, 20, 50, -1],
                        [10, 20, 50, "All"]
                    ]
                });

                deferred.resolve();
            } catch (err) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
                deferred.reject();
            }
            return deferred.promise();
        }

        // detect when the accoirdion is clicked and collapse all other than the current one
        $(document).on('click', '[id^="VisualBtn"]', function () {
            try {
                var getcurrentid = this.id;
                var extractindex = Number(getcurrentid.replace("VisualBtn", "")-1);
                visualPopUp(extractindex);
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });

        function visualPopUp(currentind) {
            try {
                swal.fire({
                    title: '<strong><u>Visual Explanation</u></strong>',
                    html:'<b>' + tableData[currentind].imageDetails + '</b>',
                    showCloseButton: true,
                    customClass: 'swalClass',
                });

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

    });

});