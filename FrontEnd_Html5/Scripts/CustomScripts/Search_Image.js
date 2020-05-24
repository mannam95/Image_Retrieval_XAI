define(['jquery', 'jqueryui', 'sweetalert', 'datatables', 'datatables.net', 'es6promise', 'zingchart', 'bootstrap',], function ($, jqueryui, swal, datatables, datatables_net, es6promise, z_chart, b_strap) {
    $(function () {

        // store all the variables as an object properties
        var pageDetails = {
            data: 'Testing',
            imageName: '',
            duplicateImageName: '',
            displayImageCharacterslen: 15,
            currentBrowserURL: $(location).attr('href'),
            idDetails: ['#MainDiv', '#hideLabelId', '#fileUploadID', '#fileNameId', '#fileImgID', '#SearchBtn'],
            supportedImageFormats: [".XBM", ".TIF", ".PJP", ".PJPEG", ".JFIF", ".WEBP", ".ICO", ".TIFF", ".BMP", ".PNG", ".JPEG", ".SVGZ", ".JPG", ".GIF", ".SVG", "EXIF"],
            singlediffarray: [],
            singlefirstlevedata: [],
            singleSecondleveldata: [],
            level1SelectdText: [],
            pyramidresults: {},
            currentsingleIndex: '',
            extractCurResind: '',
            queryFileData: '',
            mainTableData: '',
            baseImagedata: ''

        };


        var endpointresult = {
            "topScores": [
                {
                    "name": "imagesData/Sample1.jpg",
                    "overallDistScore": 264.55603,
                    "backforegrounddistance": 18.712542,
                    "colordistance": 63.15092,
                    "shapedistance": 182.69258,
                    "mainFeatures": [
                        {
                            "BackgroundForeground": [[1, 2, 1, 1, 4, 3, 6, 14, 55, 15, 2, 0, 2, 0, 9, 0, 0, 2, 4, 3, 8, 5, 7, 0, 5, 4, 3, 8, 6, 9], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 0, 0, 0, 0, 3, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0]]
                        }, {
                            "Color": [10, 14, 15, 15, 21, 7, 18, 12, 14, 18, 14, 15, 18, 10, 18, 22, 19, 15, 14, 15, 14, 25, 17, 17, 16, 14, 18, 36, 16, 14, 15, 15, 15]
                        }, {
                            "Shape": [0, 4, 0, 1, 0, 4, 2, 1, 1, 1, 1, 5, 0, 0, 0, 7, 0, 2, 2, 1, 3, 0, 1, 1, 1, 6, 1, 3, 2, 1, 2, 0, 1, 0, 0, 7, 0, 0, 0, 0, 1, 1, 5, 4, 5, 2, 1, 5, 5, 4, 1, 4, 1, 1, 1, 5, 0, 0, 0, 0, 0, 2, 0, 3, 2, 1, 3, 2, 4, 3, 1, 2, 0, 3, 2, 1, 1, 1, 1, 3]
                        }]
                }, {
                    "name": "imagesData/Sample2.jpg",
                    "overallDistScore": 240.3624,
                    "backforegrounddistance": 19.28962,
                    "colordistance": 47.43347,
                    "shapedistance": 173.63931,
                    "mainFeatures": [{
                        "BackgroundForeground": [[1, 2, 5, 4, 22, 2, 7, 9, 28, 13, 3, 7, 1, 6, 10, 7, 14, 6, 19, 6, 3, 4, 8, 5, 7, 3, 10, 3, 0, 15], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 2, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0]]
                    }, {
                        "Color": [18, 14, 8, 13, 15, 13, 17, 21, 18, 19, 16, 14, 12, 18, 11, 13, 13, 13, 14, 17, 16, 24, 16, 15, 13, 15, 15, 31, 15, 16, 17, 16, 14]
                    }, {
                        "Shape": [5, 4, 2, 2, 1, 4, 5, 0, 0, 0, 1, 2, 0, 0, 0, 5, 2, 3, 5, 0, 4, 1, 3, 2, 1, 6, 0, 0, 0, 0, 2, 0, 3, 1, 2, 5, 1, 3, 2, 1, 2, 2, 3, 5, 4, 4, 6, 4, 3, 1, 4, 4, 4, 2, 5, 4, 1, 2, 2, 4, 2, 4, 6, 7, 5, 4, 5, 5, 4, 4, 1, 4, 5, 6, 6, 4, 4, 6, 5, 4]
                    }]
                }, {
                    "name": "imagesData/Sample3.jpg",
                    "overallDistScore": 238.21576,
                    "backforegrounddistance": 21.703552,
                    "colordistance": 53.582546,
                    "shapedistance": 162.92966,
                    "mainFeatures": [{
                        "BackgroundForeground": [[0, 0, 0, 0, 1, 2, 2, 4, 68, 2, 0, 0, 1, 0, 1, 0, 1, 3, 10, 2, 2, 5, 8, 1, 0, 2, 4, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0], [3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 3, 0, 0, 0, 0, 0, 0, 1, 3, 0]]
                    }, {
                        "Color": [38, 11, 29, 19, 22, 23, 16, 7, 16, 9, 18, 12, 16, 17, 20, 14, 10, 16, 16, 17, 17, 30, 15, 15, 15, 15, 16, 31, 15, 15, 16, 15, 15]
                    }, {
                        "Shape": [5, 1, 2, 0, 1, 0, 2, 0, 0, 0, 1, 2, 0, 1, 0, 5, 0, 1, 1, 0, 6, 1, 1, 0, 0, 6, 0, 0, 0, 0, 7, 1, 0, 0, 1, 6, 1, 0, 1, 0, 2, 2, 0, 0, 0, 0, 3, 2, 2, 0, 4, 5, 1, 3, 1, 5, 2, 0, 2, 0, 1, 1, 0, 1, 0, 0, 2, 0, 0, 0, 4, 2, 3, 5, 1, 5, 0, 1, 1, 0]
                    }]
                }], "QueryImgDetails": {
                    "overallDistScore": 0,
                    "backforegrounddistance": 0,
                    "colordistance": 0,
                    "shapedistance": 0,
                    "mainFeatures": [{
                        "BackgroundForeground": [[7, 4, 10, 3, 7, 12, 7, 3, 40, 5, 7, 5, 12, 8, 9, 1, 2, 17, 15, 10, 3, 5, 11, 6, 8, 20, 17, 6, 13, 7], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 2, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 4, 5, 0, 0, 0, 0, 0, 3, 0], [1, 0, 0, 1, 1, 0, 7, 2, 2, 1, 1, 0, 1, 1, 1, 1, 0, 21, 0, 0, 8, 3, 4, 0, 0, 0, 2, 2, 2, 3]]
                    }, {
                        "Color": [24, 16, 11, 24, 14, 23, 14, 14, 14, 25, 20, 17, 13, 14, 24, 14, 19, 14, 15, 15, 20, 31, 16, 14, 16, 15, 16, 26, 15, 17, 14, 16, 14]
                    }, {
                        "Shape": [4, 3, 2, 3, 1, 3, 6, 0, 0, 0, 1, 5, 0, 0, 0, 3, 4, 0, 1, 1, 2, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0, 0, 4, 1, 0, 0, 0, 4, 5, 4, 4, 4, 1, 6, 2, 1, 4, 2, 6, 2, 3, 3, 4, 5, 4, 2, 3, 0, 6, 0, 0, 2, 0, 6, 0, 0, 0, 0, 7, 0, 0, 0, 0, 6, 3, 0, 0]
                    }]
                }
        };

        //When everything is loaded what to do first
        $(document).ready(function () {
            try {
                //loader before loading the data
                // $('body').addClass("loading");
                $(pageDetails.idDetails[0]).css("display", "block");
                $(pageDetails.idDetails[1]).hide();

                createdragview();

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }

        });

        //this function helps us to detect any events for drag and drop or any changes in file part
        function createdragview() {
            try {

                readFile = function readFile(input) {
                    if (input.files && input.files[0] && input.files.length == 1) {

                        pageDetails.imageName = pageDetails.duplicateImageName = input.files[0].name;
                        pageDetails.queryFileData = input;

                        if ((pageDetails.supportedImageFormats.indexOf((pageDetails.imageName.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi)[0]).toUpperCase())) >= 0 && (pageDetails.queryFileData.files[0].size > 0)) {

                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var htmlPreview =
                                    '<button type="button" onclick="previewRemove()" class="btn btn-danger btn-xs remove-preview"><i class="fa fa-times"></i> Reset</button>' +
                                    '<img style="max-height:100%;max-width:100%;padding:0;margin:auto;" src="' + e.target.result + '" />' +
                                    '<p>' + input.files[0].name + '</p>';
                                var wrapperZone = $(input).parent();
                                var previewZone = $('.preview-zone');
                                var boxZone = $('.preview-zone').find('.box').find('.box-body');

                                wrapperZone.removeClass('dragover');
                                previewZone.removeClass('hidden');
                                boxZone.empty();
                                boxZone.append(htmlPreview);
                            };

                            reader.onloadend = function (e) {
                                setTimeout(function () {
                                    $('#viewPartdiv').show();
                                    $('.dropzone-wrapper').css("height", $('.preview-zone').height());
                                }, 200);
                            };

                            reader.readAsDataURL(input.files[0]);

                        } else {
                            previewRemove();
                            $('.dropzone').val('')
                            swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Please select a valid Image file!'
                            });
                        }
                    } else {
                        $('.dropzone').val('')
                        swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No file selected or Multiple files selected!'
                        });
                    }
                }

                //to detect any changes in the file inpu
                $(".dropzone").on('change', function (e) {
                    readFile(this);
                });

                //to detect drag events
                $('.dropzone-wrapper').on('dragover', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).addClass('dragover');
                });

                //to detect drag events
                $('.dropzone-wrapper').on('dragleave', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).removeClass('dragover');
                });

                //to remove on click of remove image
                previewRemove = function previewRemove() {
                    var boxZone = $('.preview-zone').find('.box-body');
                    boxZone.empty();

                    $('#viewPartdiv').hide();
                    $('.dropzone').val('')

                    pageDetails.imageName = pageDetails.duplicateImageName = '';
                    pageDetails.queryFileData = '';

                    //hide and remove the table context once the user clicks on remove image
                    $('#irtexdbID').hide();
                    if (($.fn.DataTable.isDataTable('#irtexdbID'))) {
                        pageDetails.tabledetails.destroy();
                    };
                }

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //On click of the search button
        $(pageDetails.idDetails[5]).click(function () {
            try {
                pageDetails.imageName
                if (pageDetails.imageName == '' || pageDetails.imageName == null || pageDetails.imageName == undefined || pageDetails.queryFileData.files[0].size <= 0) {
                    swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select an image!'
                    });
                } else {

                    makeTableData();
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

        //creates the data into our custom way for table creation
        function makeTableData() {
            try {
                var tempTabData = endpointresult.topScores;

                tempTabData = sortArrayByObj(tempTabData, 'overallDistScore');

                tempTabData = addIndToArr(tempTabData, 'ID');

                pageDetails.mainTableData = tempTabData;

                pageDetails.baseImagedata = endpointresult.QueryImgDetails;

                pageDetails.baseImagedata['mainFeatures'][0]['BackgroundForeground'] = [].concat.apply([],pageDetails.baseImagedata['mainFeatures'][0]['BackgroundForeground']);

                pageDetails.subFeaturesNames = [];
                for(var fn=0; fn< pageDetails.baseImagedata['mainFeatures'].length; fn++){
                    pageDetails.subFeaturesNames.push(Object.keys(pageDetails.baseImagedata['mainFeatures'][fn])[0]);
                }


                if ($.fn.DataTable.isDataTable('#irtexdbID')) {
                    pageDetails.tabledetails.destroy();
                }

                CreateDatatable('irtexdbID', pageDetails.mainTableData);

                $("[id^='accordion']").accordion({ header: "h3", collapsible: true, active: false, heightStyle: "content" });
                $('#irtexdbID').show();
                $("#irtexdbID").css("width", "100%");

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }


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
                        "data": "name",
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
                                '<p>Local Explanation</p>' +
                                '<p><input class="VisualBtnClass" data-target="#exampleModalCenter" data-toggle="modal" type="button" value="Visual Explanation" id="VisualBtn' + (row.ID + 1) + '"></p>' +
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
                pageDetails.extractCurResind = (Number(getcurrentid.replace("VisualBtn", "") - 1) > 1 ? 0 : Number(getcurrentid.replace("VisualBtn", "") - 1));
                // visualPopUp(extractindex);

                pageDetails.singlediffarray = [];
                pageDetails.singlefirstlevedata = [];

                //calling the function that calculates the visual display data
                calculatesingleVisualData(pageDetails.extractCurResind);

                //calling the function that prepares data for visual display
                prepareData();

                makechartconfig();
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });

        //this function calculates the difference between base image and result image
        function calculatesingleVisualData(imageIndex) {
            try {
                var mainFeatures = pageDetails.mainTableData[imageIndex].mainFeatures;

                //loop for every feature
                for (countf = 0; countf < mainFeatures.length; countf++) {

                    var childFeatures = pageDetails.mainTableData[imageIndex].mainFeatures[countf];

                    currentObjName = Object.keys(childFeatures)[0];
                    childFeatures = childFeatures[Object.keys(childFeatures)[0]];

                    //loop for every individual feature
                    for (countsf = 0; countsf < childFeatures.length; countsf++) {

                        var temp = {
                            diff: Math.abs((pageDetails.baseImagedata.mainFeatures[countf][currentObjName][countsf]) - (pageDetails.mainTableData[imageIndex].mainFeatures[countf][currentObjName][countsf])),
                        };
                        temp[currentObjName] = [countsf];

                        pageDetails.singlediffarray.push(temp);
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
        }

        //this function creates the customised data for the visual display graphs
        function prepareData() {
            try {
                var tempUniqueValues = pageDetails.singlediffarray.map(function (item) {
                    return item.diff.toFixed(3);
                }).filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                });


                //get the unique values
                for (tempi = 0; tempi < tempUniqueValues.length; tempi++) {
                    pageDetails.singlefirstlevedata.push(pageDetails.singlediffarray.filter(function (e1, index1) {
                        return e1.diff.toFixed(3) === tempUniqueValues[tempi];
                    }).map(function (e2, index2) {
                        return e2;
                    }));
                }

                //merge the unique values objects
                var resultObject = [];
                for (recount = 0; recount < pageDetails.singlefirstlevedata.length; recount++) {
                    resultObject.push(pageDetails.singlefirstlevedata[recount].reduce(function (result, currentObject, curind) {

                        for (var key in currentObject) {
                            if (currentObject.hasOwnProperty(key)) {
                                if (Array.isArray(currentObject[key])) {
                                    if (result.hasOwnProperty(key)) {
                                        result[key] = result[key].concat(currentObject[key]);
                                    } else {
                                        result[key] = currentObject[key]
                                    }
                                } else {
                                    if (!isNaN(currentObject[key])) {
                                        result[key] = currentObject[key].toFixed(3);
                                    } else {
                                        result[key] = currentObject[key];
                                    }
                                }
                            }
                        }
                        result['totalLength'] = curind + 1;
                        return result;
                    }, {}));
                }

                pageDetails.singlefirstlevedata = resultObject;
                pageDetails.singlefirstlevedata.sort(compareValues('diff', 'asc'));

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //prepare the drill down graphset
        function makechartconfig() {
            try {
                var chartConfig = {
                    "graphset": [
                        level1data(),
                        level23dummy()[0]
                    ],
                    "background-color": "white"
                };

                zingchart.exec('visualdialog', 'destroy');

                zingchart.render({
                    id: 'visualdialog',
                    data: chartConfig,
                    height: '100%',
                    width: '100%',
                    cachePolicy: '',
                });

                zingchart.node_click = function (p) {
                    var getSelectedBarText = p.scaletext;
                    if (p.graphid.match("uniquelevel1$")) {
                        //prepare the data for level2
                        pageDetails.level1SelectdText = getSelectedBarText;
                        prepareSecondData(pageDetails.level1SelectdText);
                        buildTwoLevels();
                    } else if (p.graphid.match("uniquelevel2$")) {
                        //prepare the data for level3
                        pageDetails.level2SelectdText = getSelectedBarText;
                        buildEntireDrill();

                    } else {
                        //do nothing
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
        }

        //returns the chart config data for level
        level1data = function level1data() {
            try {

                var level1XCords = returnArrayObj(pageDetails.singlefirstlevedata, 'diff');
                var level1barData = returnArrayObj(pageDetails.singlefirstlevedata, 'totalLength');
                maxvalue = Math.max.apply(Math, level1barData)
                var level1YCords = 0 + ":" + (maxvalue + 2) + ":0.5";

                var level1config = {
                    "id": "uniquelevel1",
                    "x": "0%",
                    "y": "0%",
                    "width": "95%",
                    "height": "45%",
                    "type": "bar",
                    "title": {
                        "text": "Drilldown Visual Explanation"
                    },
                    "plotarea": {
                        "margin-top": 60,
                        "margin-right": 30,
                        "margin-bottom": 40,
                        "margin-left": 60.
                    },
                    "plot": {
                        "bars-overlap": "100%",
                        "rules": []
                    },
                    scaleX: {
                        label: {
                            text: 'Score Difference Between(Query Image & Result Image)',
                            bold: true,
                            fontSize: 16,
                            // padding: '5px 20px'
                        },
                        values: level1XCords,
                        guide: {
                            "visible": false
                        },
                        maxItems: level1XCords.length
                    },
                    "scale-y": {
                        label: {
                            text: 'Relevant Features Count',
                            bold: true,
                        },
                        "values": level1YCords,
                        "min-value": 0,
                        "guide": {
                            "visible": false
                        }
                    },
                    "series": [
                        {
                            "values": level1barData,
                            "cursor": "pointer",
                            "z-index": 1
                        },
                        {//just to make the background gray...
                            "values": [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
                            "background-color": "#E8E7E8",
                            "maxTrackers": 0,
                            "z-index": 0
                        }
                    ]
                };

                return level1config;

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //prepare the data for the second level chart
        function prepareSecondData(currentbarTex) {
            try {
                var currentlevelInd = findIndexByObj(pageDetails.singlefirstlevedata, "diff", currentbarTex);
                pageDetails.currentsingleIndex = currentlevelInd[0];
                var currentIndVals = Object.keys(pageDetails.singlefirstlevedata[pageDetails.currentsingleIndex]);
                currentIndVals = arrayRemove(currentIndVals, "diff");
                currentIndVals = arrayRemove(currentIndVals, "totalLength");
                pageDetails.singleSecondleveldata[0] = currentIndVals;
                pageDetails.singleSecondleveldata[1] = [];

                for (s2 = 0; s2 < pageDetails.singleSecondleveldata[0].length; s2++) {
                    pageDetails.singleSecondleveldata[1].push(pageDetails.singlefirstlevedata[pageDetails.currentsingleIndex][pageDetails.singleSecondleveldata[0][s2]].length);
                }
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //this will register our function and gets invoked in level1 chart call method
        level2data = function level2data() {
            try {
                var level2Max = Math.max.apply(Math, pageDetails.singleSecondleveldata[1]);
                var level2YCords = 0 + ":" + (Math.max.apply(Math, pageDetails.singleSecondleveldata[1]) + 2) + ":0.5";
                var level2config = {
                    "id": "uniquelevel2",
                    "x": 0,
                    "y": "33%",
                    "width": "95%",
                    "height": "30%",
                    "type": "bar",
                    "background-color": "#f4f6fc",
                    "plotarea": {
                        "margin": "10 10 30 50"
                    },
                    "plot": {
                        "bars-overlap": "100%",
                        "rules": []
                    },
                    "scale-x": {
                        "line-color": "#AFB2AF",
                        "line-width": "2px",
                        "values": pageDetails.singleSecondleveldata[0],
                        "tick": {
                            "line-color": "#AFB2AF",
                            "line-width": "1px"
                        },
                        "item": {
                            "font-color": "#59514E"
                        },
                        "guide": {
                            "visible": false
                        }
                    },
                    "scale-y": {
                        "values": level2YCords,
                        "line-color": "#AFB2AF",
                        "tick": {
                            "line-color": "#AFB2AF",
                            "line-width": "2px"
                        },
                        "item": {
                            "font-color": "#59514E",
                            "padding": "4px"
                        },
                        "guide": {
                            "visible": false
                        }
                    },
                    "tooltip": {
                        "text": "%v",
                        "shadow-color": "#fff"
                    },
                    "series": [
                        {
                            "values": pageDetails.singleSecondleveldata[1],
                            "background-color": "#B0DB07 #8CB206",
                            "border-width": "2px",
                            "border-color": "#fff",
                            "z-index": 1,
                            "border-radius": "7px 7px 0px 0px",
                            "cursor": "pointer"
                        },
                        {
                            "values": [level2Max + 2, level2Max + 2, level2Max + 2],
                            "background-color": "#E8E7E8",
                            "maxTrackers": -1,
                            "z-index": 0,
                        }
                    ],
                    "labels": [
                        {
                            "x": 50,
                            "y": 0,
                            "color": "#fff",
                            "background-color": "#8CB206",
                            "text": "Categorized stats for the difference of " + pageDetails.level1SelectdText,
                        }
                    ]
                };
                return level2config;

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //creates the data for the third chart which will look like a pyramid
        function pyramidData() {
            try {

                pageDetails.pyramidresults['childfeaturesNames'] = pageDetails.singlefirstlevedata[pageDetails.currentsingleIndex][pageDetails.level2SelectdText];
                pageDetails.pyramidresults['topPyramid'] = [];
                pageDetails.pyramidresults['bottomPyramid'] = [];

                var tempsubFInd = pageDetails['subFeaturesNames'].indexOf(pageDetails.level2SelectdText);

                for (p1 = 0; p1 < pageDetails.pyramidresults.childfeaturesNames.length; p1++) {

                    pageDetails.pyramidresults.topPyramid.push(Math.abs(((pageDetails['baseImagedata']['mainFeatures'][tempsubFInd])[pageDetails.level2SelectdText])[pageDetails.pyramidresults.childfeaturesNames[p1]]));

                    pageDetails.pyramidresults.bottomPyramid.push(Math.abs(((pageDetails.mainTableData[pageDetails.extractCurResind]['mainFeatures'][tempsubFInd])[pageDetails.level2SelectdText])[pageDetails.pyramidresults.childfeaturesNames[p1]]));
                }
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //this will register our function and gets invoked in level1 chart call method
        level3data = function level3data() {
            try {

                pyramidData();

                var level3Config = [
                    {
                        "id": "uniquelevel4",
                        "x": 0,
                        "y": "66%",
                        "width": "95%",
                        "height": "16%",
                        "background-color": "none",
                        "legend": {
                            "adjust-layout": false,
                            "margin-top": 10
                        },
                        "type": "bar",
                        "options": {
                            "aspect": "bar"
                        },
                        "plotarea": {
                            "margin": "10 10 30 50",
                            "margin-bottom": 0
                        },
                        "scale-x": {
                            "item": {
                                "text-align": "middle"
                            },
                            "values": pageDetails.pyramidresults.childfeaturesNames,
                            "visible": false,
                            itemsOverlap: true,
                            maxItems: pageDetails.pyramidresults.childfeaturesNames.length,
                        },
                        "series": [
                            {
                                "data-side": 1,
                                "text": "Query Image",
                                "background-color": "#007DF0 #0055A4",
                                "values": pageDetails.pyramidresults.topPyramid
                            }
                        ],
                        "scale-y": {
                            "short": true,
                        },
                        "scale-x-2": {
                            "item": {
                                "text-align": "middle"
                            },
                            "values": pageDetails.pyramidresults.childfeaturesNames,
                        }
                    },
                    {
                        "id": "uniquelevel5",
                        "x": 0,
                        "y": "82%",
                        "width": "95%",
                        "height": "16%",
                        "background-color": "none",
                        "legend": {
                            "adjust-layout": false,
                            "margin-top": 10
                        },
                        "type": "bar",
                        "options": {
                            "aspect": "bar"
                        },
                        "plotarea": {
                            "margin": "10 10 30 50",
                            "margin-top": 0
                        },
                        "scale-x": {
                            "item": {
                                "text-align": "middle"
                            },
                            "values": pageDetails.pyramidresults.childfeaturesNames,
                            itemsOverlap: true,
                            maxItems: pageDetails.pyramidresults.childfeaturesNames.length,
                        },
                        "series": [
                            {
                                "data-side": 2,
                                "text": "Result Image",
                                "background-color": "#94090D #D40D12",
                                "values": pageDetails.pyramidresults.bottomPyramid
                            }
                        ],
                        itemsOverlap: true,
                        "scale-y": {
                            "mirrored": true,
                            "short": true
                        }
                    }
                ];

                return level3Config;

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //this function will show only two views
        function buildTwoLevels() {
            try {
                var level1XCords = returnArrayObj(pageDetails.singlefirstlevedata, 'diff');
                var level1barData = returnArrayObj(pageDetails.singlefirstlevedata, 'totalLength');
                maxvalue = Math.max.apply(Math, level1barData)
                var level1YCords = 0 + ":" + (maxvalue + 2) + ":0.5";
                var chartConfig = {
                    "graphset": [
                        {
                            "id": "uniquelevel1",
                            "x": "0%",
                            "y": "0%",
                            "width": "95%",
                            "height": "30%",
                            "type": "bar",
                            "title": {
                                "text": "Drilldown Visual Explanation"
                            },
                            "plotarea": {
                                "margin-top": 60,
                                "margin-right": 30,
                                "margin-bottom": 40,
                                "margin-left": 60.
                            },
                            "plot": {
                                "bars-overlap": "100%",
                                "rules": []
                            },
                            scaleX: {
                                label: {
                                    text: 'Score Difference Between(Query Image & Result Image)',
                                    bold: true,
                                    fontSize: 16,
                                    // padding: '5px 20px'
                                },
                                values: level1XCords,
                                guide: {
                                    "visible": false
                                },
                                maxItems: level1XCords.length
                            },
                            "scale-y": {
                                label: {
                                    text: 'Relevant Features Count',
                                    bold: true,
                                },
                                "values": level1YCords,
                                "min-value": 0,
                                "guide": {
                                    "visible": false
                                }
                            },
                            "series": [
                                {
                                    "values": level1barData,
                                    "cursor": "pointer",
                                    "z-index": 1
                                },
                                {//just to make the background gray...
                                    "values": [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
                                    "background-color": "#E8E7E8",
                                    "maxTrackers": 0,
                                    "z-index": 0
                                }
                            ]
                        },
                        level2data(),
                        level23dummy()[1]

                    ],
                    "background-color": "white"
                };

                zingchart.exec('visualdialog', 'setdata', {
                    data: chartConfig
                });

                zingchart.exec('visualdialog', 'update');

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //this function will show the entire view
        function buildEntireDrill() {
            try {
                var level1XCords = returnArrayObj(pageDetails.singlefirstlevedata, 'diff');
                var level1barData = returnArrayObj(pageDetails.singlefirstlevedata, 'totalLength');
                maxvalue = Math.max.apply(Math, level1barData)
                var level1YCords = 0 + ":" + (maxvalue + 2) + ":0.5";
                var chartConfig = {
                    "graphset": [
                        {
                            "id": "uniquelevel1",
                            "x": "0%",
                            "y": "0%",
                            "width": "95%",
                            "height": "30%",
                            "type": "bar",
                            "title": {
                                "text": "Drilldown Visual Explanation"
                            },
                            "plotarea": {
                                "margin-top": 60,
                                "margin-right": 30,
                                "margin-bottom": 40,
                                "margin-left": 60.
                            },
                            "plot": {
                                "bars-overlap": "100%",
                                "rules": []
                            },
                            scaleX: {
                                label: {
                                    text: 'Score Difference Between(Query Image & Result Image)',
                                    bold: true,
                                    fontSize: 16,
                                    // padding: '5px 20px'
                                },
                                values: level1XCords,
                                guide: {
                                    "visible": false
                                },
                                maxItems: level1XCords.length
                            },
                            "scale-y": {
                                label: {
                                    text: 'Relevant Features Count',
                                    bold: true,
                                },
                                "values": level1YCords,
                                "min-value": 0,
                                "guide": {
                                    "visible": false
                                }
                            },
                            "series": [
                                {
                                    "values": level1barData,
                                    "cursor": "pointer",
                                    "z-index": 1
                                },
                                {//just to make the background gray...
                                    "values": [150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
                                    "background-color": "#E8E7E8",
                                    "maxTrackers": 0,
                                    "z-index": 0
                                }
                            ]
                        },
                        level2data(),
                        (level3data())[0],
                        (level3data())[1]

                    ],
                    "background-color": "white"
                };

                zingchart.exec('visualdialog', 'setdata', {
                    data: chartConfig
                });

                zingchart.exec('visualdialog', 'update');

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //this function returns the default data for level2 and level3
        level23dummy = function level23dummy() {
            try {

                var level23defaultconfig = [
                    {
                        "id": "uniquelevel2",
                        "x": "0%",
                        "y": "50%",
                        "width": "95%",
                        "height": "45%",
                        "type": "null",
                        "labels": [
                            {
                                "text": "Click on a Similarity Score above to view categorized stats",
                                "width": "70%",
                                "height": 40,
                                "margin": "auto auto",
                                "border-width": 1,
                                "border-radius": 2,
                                "padding": 20,
                                "background-color": "#f9f9f9"
                            }
                        ]
                    }, {
                        "id": "uniquelevel3",
                        "x": "0%",
                        "y": "70%",
                        "width": "95%",
                        "height": "30%",
                        "type": "null",
                        "scale-x": {
                            "max-labels": 16
                        },
                        "labels": [
                            {
                                "text": "Click on a Category above to view child features stats",
                                "width": "70%",
                                "height": 40,
                                "margin": "auto auto",
                                "border-width": 1,
                                "border-radius": 2,
                                "padding": 20,
                                "background-color": "#f9f9f9"
                            }
                        ]
                    }];

                return level23defaultconfig;
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //generic funtions

        //to get array unique values
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }

        //to sort array of objects
        function compareValues(key, order) {
            return function innerSort(a, b) {
                if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                    // property doesn't exist on either object
                    return 0;
                }

                var varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
                var varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

                var comparison = 0;
                if (varA > varB) {
                    comparison = 1;
                } else if (varA < varB) {
                    comparison = -1;
                }
                return (
                    (order === 'desc') ? (comparison * -1) : comparison
                );
            };
        }

        //get array of values for one specific object(property) from array of objects
        function returnArrayObj(inputArr, objName) {
            return inputArr.map(function (a) {
                return a[objName];
            });
        }

        //removes element and returns the array
        function arrayRemove(arr, value) {
            return arr.filter(function (ele) {
                return ele != value;
            });
        }

        //get the index from an array of objects by object value
        function findIndexByObj(arr, objname, objvalue) {
            return $.map(arr, function (x, index) {
                if (x[objname] == objvalue)
                    return index;
            });
        }

        //sorts the array of values based on a specific property value
        function sortArrayByObj(inpArr, ObjName) {
            return inpArr.sort(function (a, b) {
                return a[ObjName] > b[ObjName] ? 1 : -1;
            });
        }

        //to ad an additional property to array of objects
        function addIndToArr(inpArr, ObjName) {
            for(var a1=0; a1< inpArr.length; a1++){
                inpArr[a1][ObjName] = a1;
                inpArr[a1]['mainFeatures'][0]['BackgroundForeground'] = [].concat.apply([],inpArr[a1]['mainFeatures'][0]['BackgroundForeground']);
            }
            return inpArr;
        }

        //detect window changes and maje responsive
        $(window).resize(function () {

            if (pageDetails.imageName != '')
                $('.dropzone-wrapper').css("height", $('.preview-zone').height());
        });
    });
});