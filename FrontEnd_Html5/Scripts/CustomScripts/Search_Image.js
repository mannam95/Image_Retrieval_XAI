define(['jquery', 'jqueryui', 'sweetalert', 'datatables', 'datatables.net', 'es6promise', 'zingchart', 'bootstrap', 'tensorflowjs'], function ($, jqueryui, swal, datatables, datatables_net, es6promise, z_chart, b_strap, tf) {
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
            baseImagedata: '',
            serverHostedDetails: {
                url: 'http://localhost:3000/lireq',
                urlkey: 'urld'
            },
            colorConstants: ['Black', 'Maroon', 'Green', 'Olive', 'Navy', 'Purple', 'Teal', 'Silver', 'Grey', 'Red', 'Lime', 'Yellow', 'Blue', 'Fuchsia', 'Aqua', 'White'],
            semanticsConstants: ['aeroplane', 'bicycle', 'bird', 'boat', 'bottle', 'bus', 'car', 'cat', 'chair', 'cow', 'diningtable', 'dog', 'horse', 'motorbike', 'person', 'pottedplant', 'sheep', 'sofa', 'train', 'tvmonitor'],
            constantDetails: ['colorConstants', 'semanticsConstants'],
            excludedFeatures: ['shapesemantic', 'colorSemanticData'],
            normalizeFeatures: ['overallDistScore', 'backforegrounddistance', 'colordistance', 'semanticcolordistance', 'shapedistance', 'HighLevelSemanticFeatureDistance'],
            normalizeFeatures2: ['backforegrounddistance', 'colordistance', 'shapedistance', 'HighLevelSemanticFeatureDistance'],
            globalFeaturesExp: ['background_foreground', 'color', 'shape', 'high_level_semantic_feature'],
            explainFeatures: ['shapedistance', 'colordistance', 'backforegrounddistance', 'HighLevelSemanticFeatureDistance'],
            explainFeatureNames: ['shape', 'color', 'background_foreground', 'high_level_semantic_feature'],
            endpointresult: null
        };


        //When everything is loaded what to do first
        $(document).ready(function () {
            try {

                //loader before loading the data
                $('body').addClass("loading");
                $(pageDetails.idDetails[0]).css("display", "block");
                $(pageDetails.idDetails[1]).hide();

                createdragview();

                // globalExplanationData();
                // linearRegCalc();

                // normalizeServerData(endpointresult.topScores);

                $('body').removeClass("loading");

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
                        pageDetails.queryFileData = input.files;

                        if ((pageDetails.supportedImageFormats.indexOf((pageDetails.imageName.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi)[0]).toUpperCase())) >= 0 && (pageDetails.queryFileData[0].size > 0)) {

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
                                    if ($('.preview-zone').height() < $('.dropzone-wrapper').height()) {
                                        //do nothing
                                    } else {
                                        $('.dropzone-wrapper').css("height", $('.preview-zone').height());
                                    }
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
                    $('#globalDivID').empty();
                    var boxZone = $('.preview-zone').find('.box-body');
                    boxZone.empty();

                    $('#viewPartdiv').hide();
                    $('.dropzone').val('')
                    $('.dropzone-wrapper').css("height", '187px');

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

                if (pageDetails.imageName == '' || pageDetails.imageName == null || pageDetails.imageName == undefined || pageDetails.queryFileData[0].size <= 0) {
                    swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please select an image!'
                    });
                } else {

                    $('body').addClass("loading");
                    returnDataFromServer();
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
        $(document).on('click', '[id^="ExpBtnID"]', function () {
            try {

                $("[id^='ExpID']:not(#" + this.id + ")").removeClass('in');

                var getcurrentid = this.id;
                getcurrentid = Number(getcurrentid.replace("ExpBtnID", "") - 1);

                prepareExpData(getcurrentid);

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });

        function prepareExpData(currentaccID) {
            try {

                var createRankList = [];
                var tempIndCount = 0;

                $.each(pageDetails.explainFeatures, function (ind, currValue) {
                    createRankList[tempIndCount] = [];
                    createRankList[tempIndCount].push(pageDetails.explainFeatureNames[ind]);
                    createRankList[tempIndCount++].push(pageDetails.mainTableData[currentaccID][currValue]);
                });

                var bgColors = ['antiquewhite', 'darkkhaki', 'beige', 'khaki'];

                var listData = '<h4>This image is ranked No:' + (currentaccID + 1) + ' because</h4>' +

                    '<ul class="list-group">';

                var litempdata = '';
                for (var li1 = 0; li1 < createRankList.length; li1++) {

                    litempdata = litempdata + '<li class="list-group-item" style="background-color: ' + bgColors[li1] + ';">' +
                        'Similarity of ' +
                        firstCaps(createRankList[li1][0]) +
                        ': ' + createRankList[li1][1].toFixed(2) + '%' +
                        '<div><input type="range" min="1" max="100" value="' + createRankList[li1][1].toFixed(2) + '" disabled></div>' +
                        '</li>';
                }

                listData = listData + litempdata + '</ul>';

                $('#expDiv' + (currentaccID + 1)).empty();
                $('#expDiv' + (currentaccID + 1)).append(listData);

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //creates the data into our custom way for table creation
        function makeTableData() {
            try {

                pageDetails.mainTableData = sortArrayByObj(pageDetails.mainTableData, 'overallDistScore', true);

                pageDetails.mainTableData = addIndToArr(pageDetails.mainTableData, 'ID');

                pageDetails.baseImagedata['mainFeatures']['BackgroundForeground'] = [].concat.apply([], pageDetails.baseImagedata['mainFeatures']['BackgroundForeground']);

                pageDetails.subFeaturesNames = Object.keys(pageDetails.baseImagedata['mainFeatures']);


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
                                '<button type="button" style="width:30%;" class="btn btn-info" data-toggle="collapse" id="ExpBtnID' + (row.ID + 1) + '" data-target="#ExpID' + (row.ID + 1) + '"><h5>Explain</h5></button>' +
                                '<div id="ExpID' + (row.ID + 1) + '" class="collapse">' +
                                '<div style="height: auto !important;">' +
                                '<div class="expDivCls" id="expDiv' + (row.ID + 1) + '"></div>' +
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
                pageDetails.extractCurResind = Number(getcurrentid.replace("VisualBtn", "") - 1);
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
                $.each(mainFeatures, function (key, valueObj) {

                    if (pageDetails.excludedFeatures.indexOf(key) < 0) {
                        //loop for every individual feature
                        for (countsf = 0; countsf < valueObj.length; countsf++) {

                            var temp = {
                                diff: Math.abs((pageDetails.baseImagedata.mainFeatures[key][countsf]) - (valueObj[countsf])),
                            };
                            temp[key] = [countsf];

                            pageDetails.singlediffarray.push(temp);
                        }
                    }
                });

                // for (countf = 0; countf < mainFeatures.length; countf++) {

                //     var childFeatures = pageDetails.mainTableData[imageIndex].mainFeatures[countf];

                //     currentObjName = Object.keys(childFeatures)[0];
                //     childFeatures = childFeatures[Object.keys(childFeatures)[0]];

                //     //loop for every individual feature
                //     for (countsf = 0; countsf < childFeatures.length; countsf++) {

                //         var temp = {
                //             diff: Math.abs((pageDetails.baseImagedata.mainFeatures[countf][countsf][countsf]) - (pageDetails.mainTableData[imageIndex].mainFeatures[countf][currentObjName][countsf])),
                //         };
                //         temp[currentObjName] = [countsf];

                //         pageDetails.singlediffarray.push(temp);
                //     }

                // }
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
                    return item.diff.toFixed(0);
                }).filter(function (value, index, self) {
                    return self.indexOf(value) === index;
                });


                //get the unique values
                for (tempi = 0; tempi < tempUniqueValues.length; tempi++) {
                    pageDetails.singlefirstlevedata.push(pageDetails.singlediffarray.filter(function (e1, index1) {
                        return e1.diff.toFixed(0) === tempUniqueValues[tempi];
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
                                        result[key] = currentObject[key].toFixed(0);
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
                pageDetails.singlefirstlevedata = sortArrayByObj(pageDetails.singlefirstlevedata, 'diff');

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
                        level1data('45%'),
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
        level1data = function level1data(yAxisHeight) {
            try {

                var level1XCords = returnArrayObj(pageDetails.singlefirstlevedata, 'diff');
                var level1barData = returnArrayObj(pageDetails.singlefirstlevedata, 'totalLength');
                maxvalue = Math.max.apply(Math, level1barData) + 10
                var level1YCords = 0 + ":" + (maxvalue) + ":0.5";

                var yTempData = [];

                for (var yt1 = 0; yt1 < level1XCords.length; yt1++) {
                    yTempData.push(maxvalue);
                }

                var level1config = {
                    "id": "uniquelevel1",
                    "x": "0%",
                    "y": "0%",
                    "width": "95%",
                    "height": yAxisHeight,
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
                            "background-color": "#29A2CC",
                            "cursor": "pointer",
                            "z-index": 10
                        },
                        {//just to make the background gray...
                            "values": yTempData,
                            "background-color": "#E8E7E8",
                            "maxTrackers": 0,
                            "z-index": 5
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

                for (p1 = 0; p1 < pageDetails.pyramidresults.childfeaturesNames.length; p1++) {

                    pageDetails.pyramidresults.topPyramid.push(Math.abs(pageDetails['baseImagedata']['mainFeatures'][pageDetails.level2SelectdText][pageDetails.pyramidresults.childfeaturesNames[p1]]));

                    pageDetails.pyramidresults.bottomPyramid.push(Math.abs(pageDetails.mainTableData[pageDetails.extractCurResind]['mainFeatures'][pageDetails.level2SelectdText][pageDetails.pyramidresults.childfeaturesNames[p1]]));
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

                var chartConfig = {
                    "graphset": [
                        level1data('30%'),
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

                var chartConfig = {
                    "graphset": [
                        level1data('30%'),
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

        //get the data from backend
        function returnDataFromServer() {
            try {

                var formdata = new FormData();
                var file = pageDetails.queryFileData[0];

                formdata.append(pageDetails.serverHostedDetails.urlkey, file);

                $.ajax({
                    url: pageDetails.serverHostedDetails.url,
                    type: 'POST',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        pageDetails.endpointresult = response;
                        pageDetails.mainTableData = pageDetails.endpointresult.topScores;
                        pageDetails.baseImagedata = pageDetails.endpointresult.QueryImgDetails;
                        $('#globalDivID').empty();
                        $('#globalDivID').append('<h4><b>Global Explanation Loading...</b></h4>');
                        normalizeServerData();
                        globalExplanationData();
                        makeTableData();
                        $('body').removeClass("loading");
                    },
                    error: function (errres) {
                        // pageDetails.mainTableData = pageDetails.endpointresult.topScores;
                        // pageDetails.baseImagedata = pageDetails.endpointresult.QueryImgDetails;
                        // $('#globalDivID').empty();
                        // $('#globalDivID').append('<h4><b>Global Explanation Loading...</b></h4>');
                        // normalizeServerData();
                        // globalExplanationData();
                        // makeTableData();
                        $('body').removeClass("loading");
                        swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Problem with server!!!',
                            footer: JSON.stringify(errres)
                        });
                    }
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

        //calculates the regression for the features based on similarity
        function calculateReg2() {
            try {
                var xPrepData = [];
                var yPrepData = [];
                for (var cTemp1 = 0; cTemp1 < pageDetails.mainTableData.length; cTemp1++) {
                    xPrepData[cTemp1] = [];
                    pageDetails.normalizeFeatures2.forEach(function (currF, currInd) {
                        xPrepData[cTemp1].push(pageDetails.mainTableData[cTemp1][currF]);
                    });
                    yPrepData.push(pageDetails.mainTableData[cTemp1]['overallDistScore']);
                }

                return ([xPrepData, yPrepData]);

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        // Normalize the features
        function normalizeServerData(currResData) {
            try {
                pageDetails.normalizeFeatures.forEach(function (currF, currInd) {
                    var currTot = getSum(pageDetails.mainTableData, currF);
                    for (var nTemp1 = 0; nTemp1 < pageDetails.mainTableData.length; nTemp1++) {
                        if (currTot === 0 || pageDetails.mainTableData[nTemp1][currF] === 0) {
                            pageDetails.mainTableData[nTemp1][currF] = 1 * 100;
                        } else {
                            // currResData[nTemp1][currF] = Number(((1-((currResData[nTemp1][currF]/currTot)/2)) * 100).toFixed(2));
                            pageDetails.mainTableData[nTemp1][currF] = Number(Number(1 / (1 + (pageDetails.mainTableData[nTemp1][currF] / currTot))).toFixed(2)) * 100;
                        }
                        // pageDetails.mainTableData[nTemp1][currF] = Number(Number(1 / ((pageDetails.mainTableData[nTemp1][currF] / currTot))).toFixed(2)) * 100;
                    }
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

        //this function returns the global explantion text
        function globalExplanationData() {
            try {
                var colorDataRes = [];
                var semanticDataRes = [];

                for (var rTemp = 0; rTemp < pageDetails.mainTableData.length; rTemp++) {
                    colorDataRes[rTemp] = pageDetails.mainTableData[rTemp]['mainFeatures']['colorSemanticData'];
                    if (pageDetails.mainTableData[rTemp]['mainFeatures']['shapesemantic'] === undefined || pageDetails.mainTableData[rTemp]['mainFeatures']['shapesemantic'] === null) {
                        semanticDataRes[rTemp] = [0];
                    } else {
                        semanticDataRes[rTemp] = pageDetails.mainTableData[rTemp]['mainFeatures']['shapesemantic'];
                    }
                }

                var serverResultTemp = [];
                //converts the semantics to a specific format
                for (var stemp1 = 0; stemp1 < semanticDataRes.length; stemp1++) {
                    var uniqs = semanticDataRes[stemp1].reduce(function (acc, val) {
                        acc[val] = acc[val] === undefined ? 1 : acc[val] += 1;
                        return acc;
                    }, {});
                    var tempResSem = [];
                    tempResCount = 0;

                    for (var objKey in uniqs) {
                        tempResSem[tempResCount++] = {
                            semanticName: objKey,
                            count: uniqs[objKey]
                        };
                    }

                    serverResultTemp[stemp1] = {
                        'semanticsData': tempResSem
                    };
                }

                //converts the color to a specific format
                for (var stemp2 = 0; stemp2 < colorDataRes.length; stemp2++) {
                    var tempcolorArr = [];
                    for (stemp3 = 0; stemp3 < colorDataRes[stemp2].length; stemp3++) {
                        tempcolorArr[stemp3] = {
                            'colorName': pageDetails.colorConstants[stemp3],
                            'count': colorDataRes[stemp2][stemp3]
                        }
                    }
                    serverResultTemp[stemp2]['colorData'] = tempcolorArr;
                }

                var finalVec = [];

                for (var gtemp1 = 0; gtemp1 < serverResultTemp.length; gtemp1++) {
                    var colorVec = returnArrayObj(serverResultTemp[gtemp1].colorData, 'count');
                    // var semanticsVec = returnSemanticVec(serverResultTemp[gtemp1].semanticsData, pageDetails.semanticsConstants);
                    var semanticsVec = [];
                    finalVec[gtemp1] = colorVec.concat(semanticsVec);
                }

                var targetVec = [];
                for (var tt = 0; tt < pageDetails.mainTableData.length; tt++) {
                    targetVec[tt] = pageDetails.mainTableData[tt]['overallDistScore'];
                }

                finalVec = spliceArr(finalVec);
                var linSucc = linearRegCalc(finalVec, targetVec);

                linSucc.done(function (wRes) {
                    var ArrTempData = calculateReg2();
                    returnGlobalText(wRes, 'wRes1');
                    // var linSucc1 = linearRegCalc(ArrTempData[0], ArrTempData[1]);
                    // linSucc1.done(function (wRes1) {
                    //     returnGlobalText(wRes, wRes1);
                    //     const t1 = performance.now();
                    //     console.log(`Call to doSomething took ${(t1 - t0) / 1000} Seconds.`);
                    // });
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

        //removes a complete column if all the values of one column is 0
        function spliceArr(tempArr) {
            try {
                var spliInd = [];
                for (var t1 = 0; t1 < tempArr[0].length; t1++) {
                    if (tempArr[0][t1] === 0) {
                        for (var t2 = 1; t2 < tempArr.length; t2++) {
                            if (tempArr[t2][t1] === 0) {
                                if (t2 === tempArr.length - 1) {
                                    spliInd.push(t1);
                                }
                            } else {
                                break;
                            }
                        }
                    }
                }

                pageDetails.newColorConstants = pageDetails.colorConstants;
                pageDetails.newSemanticsConstants = pageDetails.semanticsConstants;

                for (var t3 = 0; t3 < spliInd.length; t3++) {
                    if (spliInd[t3] < pageDetails.colorConstants.length) {
                        pageDetails.newColorConstants.splice(spliInd[t3], 1);
                    } else {
                        pageDetails.newSemanticsConstants.splice(spliInd[t3] - pageDetails.colorConstants.length, 1);
                    }
                }

                for (var t4 = 0; t4 < spliInd.length; t4++) {
                    if (t4 === 0) {
                        tempArr.forEach(function (a) {
                            return a.splice(spliInd[t4], 1);
                        });
                    } else {
                        tempArr.forEach(function (a) {
                            return a.splice(spliInd[t4] - t4, 1);
                        });
                    }
                }

                return tempArr;

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //calculates the linear regression and returns weights
        function linearRegCalc(regData, targetData) {
            var deferred = $.Deferred();
            try {
                // higher=better but slower
                var nr_epochs = 2048;
                var learningRate = 0.00000000001;
                var thresholdRate = 0.0001;

                var tfinterface;
                var model = tf.sequential();

                var xS = tf.tensor(regData, [regData.length, regData[0].length]);
                var yS = tf.tensor(targetData, [targetData.length, 1]);
                model.add(tf.layers.dense({
                    units: 1,
                    inputShape: [regData[0].length],
                    weights: [tf.randomUniform([regData[0].length, 1], 0, 0), tf.randomUniform([1], 0, 0)]
                }));

                model.compile({
                    optimizer: tf.train.sgd(learningRate),
                    loss: 'meanSquaredError'
                });

                var prevLoss, currLoss;
                var prevWeights;
                tfinterface = model.fit(xS, yS, {
                    epochs: nr_epochs,
                    callbacks: [{
                        onEpochEnd: function onEpochEnd(epoch, logs) {
                            currLoss = logs.loss;
                            if (epoch === 0) {
                                prevLoss = logs.loss;
                                prevWeights = model.getWeights()[0].dataSync();
                            } else {
                                if ((prevLoss - currLoss) < thresholdRate) {
                                    model.stopTraining = true;
                                } else if ((prevLoss - currLoss) < 0) {
                                    model.stopTraining = true;
                                } else {
                                    prevLoss = currLoss;
                                    prevWeights = model.getWeights()[0].dataSync();
                                }
                            }
                        }
                    }]
                });

                tfinterface.then(function () {
                    model.dispose();
                    xS.dispose();
                    yS.dispose();
                    tf.disposeVariables();
                    deferred.resolve(prevWeights);
                });
            } catch (error) {
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

        //returns the global text
        function returnGlobalText(weightsData, g2Weights) {
            try {
                var cRes = minmax(weightsData, 0, pageDetails.newColorConstants.length);
                var cData = [];
                for (wTemp1 = 0; wTemp1 < cRes.length; wTemp1++) {
                    var cIndex = (weightsData.reduce(function (a, e, i) {
                        return e === cRes[wTemp1] ? a.concat(i) : a;
                    }, []));

                    for (wTemp3 = 0; wTemp3 < cIndex.length; wTemp3++) {
                        cData.push(pageDetails.newColorConstants[cIndex[wTemp3]]);
                    }
                }

                var sRes = minmax(weightsData, pageDetails.newColorConstants.length, pageDetails.newColorConstants.length + pageDetails.newSemanticsConstants.length);
                var sData = [];
                for (wTemp2 = 0; wTemp2 < sRes.length; wTemp2++) {
                    var sIndex = (weightsData.reduce(function (a, e, i) {
                        return e === sRes[wTemp2] ? a.concat(i) : a;
                    }, []));

                    for (wTemp4 = 0; wTemp4 < sIndex.length; wTemp4++) {
                        sData.push(pageDetails.newSemanticsConstants[sIndex[wTemp4] - (pageDetails.newColorConstants.length - 1)]);
                    }
                }

                var gData = [cData, sData];
                var gText = ['Colors', 'Objects']

                var listData = '<div class="col-xs-3"><div style="background-color: cadetblue;"  class="card"><div class="card-body"><h4 style="padding-top: 10px;"><b>2) These image results are because:</b></h4>' + '<ul class="list-group" >';

                var litempdata = '';
                for (gTemp1 = 0; gTemp1 < gText.length; gTemp1++) {
                    if (gData[gTemp1].length > 0) {
                        litempdata = litempdata + '<li class="list-group-item">' + 'In ' + gText[gTemp1] + ': '
                        for (var li1 = 0; li1 < gData[gTemp1].length; li1++) {
                            litempdata = litempdata + firstCaps(gData[gTemp1][li1]) + ((li1 + 1) == gData[gTemp1].length ? ' ' : ', ');
                        }
                        litempdata = litempdata + ' are dominant.</li>';
                    }
                }

                listData = listData + litempdata + '</ul></div></div></div>';

                // returnGlobalText2(g2Weights, listData);
                returnGlobalText3(listData)

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        function returnGlobalText2(weightsData, g1listData) {
            try {
                var newTempData = [];
                weightsData.forEach(function (currF, currInd) {
                    newTempData[currInd] = {
                        name: pageDetails.globalFeaturesExp[currInd],
                        weightData: currF
                    };
                });
                newTempData = sortArrayByObj(newTempData, 'weightData', true);

                var listData = '<div class="col-xs-3"><div style="background-color: cadetblue;"  class="card"><div class="card-body"><h4 style="padding-top: 10px;"><b>2-)In features the precedence is given as follows:</b></h4>' + '<ul class="list-group">';

                var litempdata = '<li class="list-group-item">';

                for (var gTemp1 = 0; gTemp1 < newTempData.length; gTemp1++) {
                    litempdata = litempdata + firstCaps(newTempData[gTemp1]['name']) + ((gTemp1 + 1) == newTempData.length ? ' ' : ' > ');
                }

                listData = listData + litempdata + '</li></ul></div></div></div>';

                returnGlobalText3(g1listData, listData);
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        function returnGlobalText3(g1Data, g2Data) {
            try {
                var newTempData = [];
                for (var g3Temp1 = 0; g3Temp1 < pageDetails.endpointresult['classification_result'].length; g3Temp1++) {
                    newTempData[g3Temp1] = {
                        name: pageDetails.endpointresult['classification_names'][g3Temp1],
                        weightData: pageDetails.endpointresult['classification_result'][g3Temp1]
                    };
                    newTempData = sortArrayByObj(newTempData, 'weightData');

                    var listData = '<div class="col-xs-3"><div style="background-color: cadetblue;"  class="card"><div class="card-body"><h4 style="padding-top: 10px;"><b>1) In features the precedence is given as follows:</b></h4>' + '<ul class="list-group">';

                    var litempdata = '<li class="list-group-item">';

                    for (var g3Temp2 = 0; g3Temp2 < newTempData.length; g3Temp2++) {
                        litempdata = litempdata + firstCaps(newTempData[g3Temp2]['name']) + ((g3Temp2 + 1) == newTempData.length ? ' ' : ' > ');
                    }

                    listData = listData + litempdata + '</li></ul></div></div></div>';

                    $('#globalDivID').empty();
                    $('#globalDivID').append(listData + g1Data);
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

        //makes the semantic vector for regression
        function returnSemanticVec(semVec, semVecConst) {
            try {
                var indexCount = [];
                var finalSemVec = [];
                for (var stemp1 = 0; stemp1 < semVec.length; stemp1++) {
                    indexCount[stemp1] = [semVecConst.indexOf(semVec[stemp1]['semanticName']), semVec[stemp1]['count']];
                }

                for (var stemp2 = 0; stemp2 < indexCount.length; stemp2++) {

                    for (var stemp3 = 0; stemp3 < semVecConst.length; stemp3++) {
                        if (indexCount[stemp2][0] === stemp3) {
                            finalSemVec[stemp3] = indexCount[stemp2][1];
                        } else {
                            if (finalSemVec[stemp3] === undefined || finalSemVec[stemp3] <= 0 || finalSemVec[stemp3] === null) {
                                finalSemVec[stemp3] = 0;
                            }
                        }
                    }
                }

                return finalSemVec;

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
        function sortArrayByObj(inpArr, ObjName, ascdsc) {
            if (ascdsc) {
                return inpArr.sort(function (a, b) {
                    return Number(a[ObjName]) > Number(b[ObjName]) ? 1 : -1;
                }).reverse();
            } else {
                return inpArr.sort(function (a, b) {
                    return Number(a[ObjName]) > Number(b[ObjName]) ? 1 : -1;
                });
            }
        }

        //to ad an additional property to array of objects
        function addIndToArr(inpArr, ObjName) {
            for (var a1 = 0; a1 < inpArr.length; a1++) {
                inpArr[a1][ObjName] = a1;
                inpArr[a1]['mainFeatures']['BackgroundForeground'] = [].concat.apply([], inpArr[a1]['mainFeatures']['BackgroundForeground']);
            }
            return inpArr;
        }

        //calculates the eucleadean distance between two vectors
        function eucDistance(a, b) {
            return 1 / (1 + Math.pow(a.map(function (x, i) {
                return Math.pow(Math.abs(x - b[i]), 2);
            }).reduce(function (sum, now) {
                return sum + now;
            }), 1 / 2)) * 100;
        }

        //shuffles an array
        function shuffleArray(inpArr) {
            return inpArr.map(function (a) {
                return [Math.random(), a];
            }).sort(function (a, b) {
                return a[0] - b[0];
            }).map(function (a) {
                return a[1];
            });
        }

        //returns random number
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        //get the max value by range index
        function minmax(arr, begin, end) {
            arr = [].slice.apply(arr, [].slice.call(arguments, 1));
            var max1 = Math.min.apply(Math, arr);
            arr.splice(arr.indexOf(max1), 1);
            return [max1, Math.min.apply(null, arr)];
        }

        //get the sum all values from an array by a specific property
        function getSum(arr, prop) {
            return arr.reduce(function (prev, cur) {
                return prev + cur[prop];
            }, 0);
        }

        function firstCaps(capsStr) {
            return (capsStr.charAt(0).toUpperCase() + capsStr.slice(1));
        }

        //detect window changes and maje responsive
        $(window).resize(function () {

            if (pageDetails.imageName != '') {
                if ($('.preview-zone').height() < $('.dropzone-wrapper').height()) {
                    //do nothing
                } else {
                    $('.dropzone-wrapper').css("height", $('.preview-zone').height());
                }
            }
        });
    });
});