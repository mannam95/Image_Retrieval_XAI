define(['jquery', 'jqueryui', 'sweetalert', 'datatables', 'datatables.net', 'es6promise', 'zingchart', 'bootstrap', 'tensorflowjs'], function ($, jqueryui, swal, datatables, datatables_net, es6promise, z_chart, b_strap, tfjs) {
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
                geturl: 'http://localhost:3000/sessionid',
                urlkey: 'urld',
                imgUrlKey: 'imgurl',
                cookiesKey: 'sessiondata'
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
            endpointresult: null,
            cookiesObj: [],
            startTime: '',
            endTime: '',
        };

        //When everything is loaded what to do first
        $(document).ready(function () {
            try {
                //loader before loading the data
                $('body').addClass("loading");

                //check cookies
                checkCookies();

                $(pageDetails.idDetails[0]).css("display", "block");
                $(pageDetails.idDetails[1]).hide();

                $('.carousel').carousel();

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

        //when the user accepts cookies
        $("#cookiesBtn").click(function () {
            try {
                var succget = getSessionID();

                succget.done(function () {
                    console.log('Test');
                });
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });

        //gets the session ID and sets in the cookies
        function getSessionID() {
            var deferred = $.Deferred();
            try {
                $.ajax({
                    url: pageDetails.serverHostedDetails.geturl,
                    type: 'GET',
                    // dataType: 'json', // added data type
                    success: function (res) {
                        console.log(res);
                        var tempsessionID = res;
                        document.cookie = "sessionID=" + JSON.stringify(tempsessionID) + "; expires=" + new Date(new Date().setFullYear(new Date().getFullYear() + 1));
                        deferred.resolve();
                    },
                    error: function (errres) {
                        swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Problem with GET server!!!',
                            footer: JSON.stringify(errres)
                        });
                        deferred.reject();
                    }
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

        //Check whether the user accepted the GDPR consent about cookies storage
        function checkCookies() {
            try {
                // document.cookie = "sessionID=";
                if (getCookies('sessionID')[1] != undefined && getCookies('sessionID')[1] != null && getCookies('sessionID')[1] != '') {
                    //do nothing as cookies already present

                } else {
                    $("#cookieModal").modal({ backdrop: 'static', keyboard: false });
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

        //triggers file upload on click of label
        $("#formupload-button").click(function () {
            $("#formupload_box").click();
        });

        //detects when file is selected
        $("#formupload_box").change(function (e) {
            $('body').addClass("loading");
            checkImage(this);
        });

        //triggers when file browse and upload happens
        function checkImage(input) {
            try {
                if (input.files && input.files[0] && input.files.length == 1) {

                    pageDetails.imageName = pageDetails.duplicateImageName = input.files[0].name;
                    pageDetails.queryFileData = input.files;

                    if ((pageDetails.supportedImageFormats.indexOf((pageDetails.imageName.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi)[0]).toUpperCase())) >= 0 && (pageDetails.queryFileData[0].size > 0)) {

                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var getretSucc = returnDataFromServer(true);
                            getretSucc.done(function () {
                                $('#url_box').val('');
                                var htmlPreview = '<img style="max-height:100%;max-width:100%;margin:auto;" src="' + e.target.result + '" />';
                                $('#viewPartdiv').empty();
                                $('#viewPartdiv').append(htmlPreview);
                                $('body').removeClass("loading");
                            }).fail(function () {
                                pageDetails.mainTableData = pageDetails.endpointresult.topScores;
                                pageDetails.baseImagedata = pageDetails.endpointresult.QueryImgDetails;
                                $('#globalDivID').empty();
                                $('#globalDivID').append('<h4><b>Global Explanation Loading...</b></h4>');
                                normalizeServerData();
                                globalExplanationData();
                                makeTableData();
                                $('body').removeClass("loading");
                            });
                        };

                        reader.onloadend = function (e) {
                            $('#queryImageID').show();
                            $('#carsContainerID').hide();
                        };

                        reader.readAsDataURL(input.files[0]);

                    } else {
                        swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Please select a valid Image file!'
                        });
                    }
                } else {
                    swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No file selected or Multiple files selected!'
                    });
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

        //triggers when the url is pasted and searched
        function searchImage(defaultImageURL) {
            try {
                pageDetails.imageUrl = $('#url_box').val();
                if (defaultImageURL != undefined && defaultImageURL != null && defaultImageURL != '') {
                    pageDetails.imageUrl = defaultImageURL
                }
                var filename = pageDetails.imageUrl.split('/').pop().split('#')[0].split('?')[0];

                if (filename != '' && filename != null && filename != undefined) {
                    var getvalSucc = validateURL();
                    getvalSucc.done(function () {
                        $('#carsContainerID').hide();
                        pageDetails.imageName = pageDetails.duplicateImageName = filename;
                        if ((pageDetails.imageName.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi) != null) && ((pageDetails.supportedImageFormats.indexOf((pageDetails.imageName.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi)[0]).toUpperCase())) >= 0)) {

                            var getretSucc = returnDataFromServer(false);
                            getretSucc.done(function () {
                                // $('#url_box').val('');
                                var htmlPreview = '<img style="max-height:100%;max-width:100%;margin:auto;" id="previewImgID" src="' + pageDetails.imageUrl + '" />';
                                $('#viewPartdiv').empty();
                                $('#viewPartdiv').append(htmlPreview);
                                $('#queryImageID').show();
                                $('body').removeClass("loading");
                            }).fail(function () {
                                pageDetails.mainTableData = pageDetails.endpointresult.topScores;
                                pageDetails.baseImagedata = pageDetails.endpointresult.QueryImgDetails;
                                $('#globalDivID').empty();
                                $('#globalDivID').append('<h4><b>Global Explanation Loading...</b></h4>');
                                normalizeServerData();
                                globalExplanationData();
                                makeTableData();
                                $('body').removeClass("loading");
                            });

                        } else {
                            $('#url_box').val('');
                            swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Please enter a valid image URL!'
                            });
                        }

                    });
                } else {
                    $('#url_box').val('');
                    swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Please enter a valid image URL!'
                    });
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

        //to validate the URL
        function validateURL() {
            var deferred = $.Deferred();
            try {
                $.ajax({
                    url: pageDetails.imageUrl,
                    type: 'HEAD',
                    error: function () {
                        $('#url_box').val('');
                        swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Sorry! Local file path is not accepted!'
                        });
                        $('body').removeClass("loading");
                        deferred.reject();
                    },
                    success: function () {
                        deferred.resolve();
                    }
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

        //On click of the search button
        $(pageDetails.idDetails[5]).click(function () {
            try {
                $('body').addClass("loading");
                searchImage(null);
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });

        //detect when the default images clicked
        $('.carImgHeight').click(function () {
            $('body').addClass("loading");
            searchImage(this.src);
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

                    '<ul class="list-group" style="width: fit-content;">';

                var litempdata = '';
                for (var li1 = 0; li1 < createRankList.length; li1++) {

                    // litempdata = litempdata + '<li class="list-group-item" style="background-color: ' + bgColors[li1] + ';">' +
                    litempdata = litempdata + '<li class="list-group-item">' +
                        'Similarity of ' +
                        firstCaps(createRankList[li1][0]) +
                        ': ' + createRankList[li1][1].toFixed(2) + '%' +
                        '<div style="padding-top: 5px;"><input type="range" min="1" max="100" value="' + createRankList[li1][1].toFixed(2) + '" disabled></div>' +
                        '</li>';
                }

                listData = listData + litempdata + '</ul>';

                $('#expDiv' + (currentaccID + 1)).empty();
                $('#expDiv' + (currentaccID + 1)).append(listData);
                // $('#expDiv' + (currentaccID + 1)).fadeIn(3000);


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
                $('#resTableContID').show();
                // $("#irtexdbID").css("width", "100%");

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
                    "createdRow": function (row, data, dataIndex) {
                        $(row).addClass('rowSpaceClas');
                    },
                    "deferRender": true,
                    columns: [
                        {
                            "data": "name",
                            "className": 'thirdColumnClass',
                            render: function (data, type, row) {
                                return '<div class="row match-row trsingleDiv">' +
                                    '<div class="col-xs-1 col-sm-1 match-thumb imgVerCenter" style="justify-content: center;">' +
                                    '<input type="checkbox" id="selectIndex' + row.ID + '">' +
                                    '</div>' +
                                    '<div class="col-xs-3 col-sm-3 match-thumb imgVerCenter">' +
                                    '<img class="tableImgClass" src="' + data + '"/>' +
                                    '</div>' +
                                    '<div class="col-xs-6 col-sm-6 match-details">' +
                                    '<div class="match">' +
                                    '<div style="width:100%;">' +
                                    '<div>' +
                                    '<div class="row" style="padding-top: 1.5em;">' +
                                    '<div class="col-xs-8 col-sm-6 col-md-4 col-lg-4">' +
                                    '<input class="ExplainBtnClass" data-toggle="collapse" type="button" id="ExpBtnID' + (row.ID + 1) + '" data-target="#ExpID' + (row.ID + 1) + '" value="Explain">' +
                                    '</div>' +
                                    '<div class="col-xs-2 col-sm-3 col-md-3 col-lg-3">' +
                                    '<input class="VisualBtnClass" data-target="#exampleModalCenter" data-toggle="modal" type="button" value="Compare" id="VisualBtn' + (row.ID + 1) + '">' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div id="ExpID' + (row.ID + 1) + '" class="collapse">' +
                                    '<div style="height: auto !important;">' +
                                    '<div class="expDivCls" id="expDiv' + (row.ID + 1) + '"></div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>';
                            },
                            "orderable": false
                        },
                    ],
                    // "aaSorting": [[1, 'dsc']],
                    "lengthMenu": [
                        [10, 20, 50, -1],
                        [10, 20, 50, "All"]
                    ],
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
        function returnDataFromServer(fileorImgFlag) {
            var deferred = $.Deferred();
            try {
                pageDetails.startTime = performance.now();
                var formdata = new FormData();
                var file = pageDetails.queryFileData[0];

                if (fileorImgFlag) {
                    formdata.append(pageDetails.serverHostedDetails.urlkey, file);
                } else {
                    formdata.append(pageDetails.serverHostedDetails.imgUrlKey, pageDetails.imageUrl);
                }

                var tempObj = {
                    ['LoadingTest']: 'HelloTest',
                };
                setCookies(tempObj);

                if (getCookies('sessionID')[1] != undefined && getCookies('sessionID')[1] != null && getCookies('sessionID')[1] != '' && getCookies('userData')[1] != undefined && getCookies('userData')[1] != null && getCookies('userData')[1] != '') {
                    formdata.append(pageDetails.serverHostedDetails.cookiesKey, JSON.stringify({ 'sessionID': getCookies('sessionID')[1], 'data': JSON.parse(getCookies('userData')[1]) }));
                }

                $.ajax({
                    url: pageDetails.serverHostedDetails.url,
                    type: 'POST',
                    data: formdata,
                    processData: false,
                    contentType: false,
                    // "mimeType": "multipart/form-data",
                    success: function (response) {
                        document.cookie = "sessionID=";
                        document.cookie = "userData=";
                        var succget = getSessionID();
                        succget.done(function () {
                            // JSON.parse(response)
                            handleResultData(response);
                            deferred.resolve();
                        });
                    },
                    error: function (errres) {
                        swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Problem with server!!!',
                            footer: JSON.stringify(errres)
                        });
                        deferred.reject();
                    }
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

        //The data returned from server will be handled here
        function handleResultData(serverRes) {
            try {
                pageDetails.endpointresult = serverRes;
                pageDetails.mainTableData = pageDetails.endpointresult.topScores;
                pageDetails.baseImagedata = pageDetails.endpointresult.QueryImgDetails;
                $('#globalDivID').empty();
                $('#globalDivID').append('<h4><b>Global Explanation Loading...</b></h4>');
                normalizeServerData();
                globalExplanationData();
                makeTableData();
                $('body').removeClass("loading");
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
                var model = tfjs.sequential();

                var xS = tfjs.tensor(regData, [regData.length, regData[0].length]);
                var yS = tfjs.tensor(targetData, [targetData.length, 1]);
                model.add(tfjs.layers.dense({
                    units: 1,
                    inputShape: [regData[0].length],
                    weights: [tfjs.randomUniform([regData[0].length, 1], 0, 0), tfjs.randomUniform([1], 0, 0)]
                }));

                model.compile({
                    optimizer: tfjs.train.sgd(learningRate),
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
                    tfjs.disposeVariables();
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

                // var listData = '<div class="col-xs-3"><div style="background-color: cadetblue;"  class="card"><div class="card-body"><h4 style="padding-top: 10px;"><b>2) These image results are because:</b></h4>' + '<ul class="list-group" >';

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

                listData = litempdata;
                // listData = listData + litempdata + '</ul></div></div></div>';

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
                }
                newTempData = sortArrayByObj(newTempData, 'weightData');

                pageDetails.endTime = performance.now();

                currentTime = ((pageDetails.endTime - pageDetails.startTime) / 1000);

                var temph3 = '<h3>Search took ' + currentTime.toFixed(2) + ' seconds for: <strong>' + pageDetails.imageName + '</strong></h3>';

                var listData = '<div><h2><span id="result_count">' + pageDetails.mainTableData.length + '</span> results</h2>' + temph3 + '<h4 style="padding-top: 10px;"><b>For the queried image, the following are the key factors responsible for the result images:</b></h4>' + '<ul style="width:fit-content;" class="list-group">';

                var litempdata = '<li class="list-group-item">In Features: ';

                for (var g3Temp2 = 0; g3Temp2 < newTempData.length; g3Temp2++) {
                    litempdata = litempdata + firstCaps(newTempData[g3Temp2]['name']) + ((g3Temp2 + 1) == newTempData.length ? ' ' : ' > ');
                }

                listData = listData + litempdata + '</li>' + g1Data + '</ul></div>';

                $('#globalDivID').empty();
                $('#globalDivID').append(listData);
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

        function setCookies(eventDetails) {
            try {
                var getCurrCook = getCookies('userData');
                if (getCurrCook[0]) {
                    pageDetails.cookiesObj = JSON.parse(getCurrCook[1]);
                    pageDetails.cookiesObj.push(eventDetails);
                    document.cookie = "userData=" + JSON.stringify(pageDetails.cookiesObj) + "; expires=" + new Date(new Date().setFullYear(new Date().getFullYear() + 1));
                } else {
                    pageDetails.cookiesObj.push(eventDetails);
                    document.cookie = "userData=" + JSON.stringify(pageDetails.cookiesObj) + "; expires=" + new Date(new Date().setFullYear(new Date().getFullYear() + 1));
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

        function getCookies(cookieName) {
            var match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
            if (match) {
                return ([true, match[2]]);
            }
            else {
                return [false];
            }
        }

        pageDetails.endpointresult = {
            "topScores": [{
                "name": "Images/resultImages/2007_004988.jpg",
                "overallDistScore": 32.350124,
                "backforegrounddistance": 7.480642,
                "colordistance": 3.274505,
                "semanticcolordistance": 0.81699455,
                "shapedistance": 10.852388,
                "HighLevelSemanticFeatureDistance": 10.742587,
                "mainFeatures": {
                    "shapesemantic": ["aeroplane"],
                    "Shape": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 1, 1, 0, 2, 1, 7, 3, 5, 1, 2, 5, 1, 3, 5, 2, 5, 5, 3, 4, 2, 4, 5, 4, 5, 2, 6, 3, 3, 5, 1, 7, 1, 2, 2, 2, 7, 2, 2, 1, 1, 7, 3, 1, 2, 1, 7, 3, 0, 2],
                    "Color": [35, 17, 24, 11, 16, 14, 15, 15, 14, 17, 17, 16, 18, 16, 17, 15, 14, 16, 14, 16, 14, 29, 16, 21, 14, 16, 15, 31, 15, 13, 16, 16, 16],
                    "BackgroundForeground": [[63, 9, 13, 8, 16, 20, 12, 17, 8, 29, 12, 20, 19, 62, 14, 10, 12, 43, 12, 10]],
                    "HighLevelSemanticFeature": [0.12147617, 1.3237361, 0.2373733, 0.7737116, 1.9399112, 0.31210652, 0.87669295, 3.1338825, 0.25039047, 0.39050645, 1.8073622, 0.68734586, 1.3575836, 0.3268296, 0.31479445, 0.5450889, 0.35582632, 0.803566, 1.1796961, 0.15522458, 1.4244334, 0.2338457, 1.5504435, 4.7849054, 0.13516499, 0.32618812, 0.19507669, 0.9876758, 1.5765054, 0.2362449, 1.2383299, 3.778244, 2.8055854, 1.0772045, 0.61668926, 1.0206659, 2.721769, 0.1750544, 0.07130665, 1.010738, 0.13026097, 0.25305414, 0.15111117, 0.2493066, 0.023130625, 0.06276754, 0.46221325, 0.13378045, 0.67700905, 0.746681, 0.6130317, 1.1209502, 1.0144308, 0.067348816, 0.38321048, 0.14116664, 3.4472625, 0.14151119, 0.049104787, 1.3470433, 0.43226445, 0.20740966, 0.64843285, 1.2980784, 0.58345544, 0.43818638, 0.43098783, 0.43000045, 0, 0.17257358, 0.63348484, 0.52378213, 1.6773137, 1.2844105, 0.06828765, 2.9004853, 0.4222767, 0.037913818, 0.893604, 0.6783367, 1.0290686, 0.63135433, 0.16219723, 0.7186748, 0.32449937, 1.5445484, 0.91479903, 0.7912396, 1.3580827, 1.6539458, 0.18610294, 0.3003756, 0.26103908, 0.43119326, 1.1656827, 0.6196998, 0.13181065, 0.2788521, 0.75293475, 0.0648763, 0.020451797, 1.0363398, 0.8006047, 0.024181623, 3.0149183, 0.53377044, 1.617006, 0.19730967, 1.5121413, 1.4815199, 0.11311209, 0.5715696, 3.1493752, 0.93741685, 0.56642854, 1.2828386, 0.22923261, 1.4914448, 0.22489731, 0.4603647, 0.41848916, 1.5895804, 1.170509, 0.5230028, 0.27213857, 0.23400664, 0.150575, 0.23433417, 0.59077626, 2.4360685, 2.2794485, 2.934641, 0.7596885, 1.1441956, 0, 0.22676112, 0.18738942, 0.8631538, 0.15007688, 0.87542987, 1.0246315, 0.21271133, 2.322248, 0.879112, 0.89444256, 0.33653942, 1.5393844, 0.45312384, 1.4609971, 1.1568874, 0.099071026, 0.29785565, 0.67344946, 0.17031923, 1.5987756, 2.1286848, 2.727254, 1.5558273, 0.7600415, 1.9472544, 0.6847077, 0.34999284, 0.0050905375, 1.5850264, 1.4952779, 0.6138667, 0.6817905, 1.5722482, 1.2624662, 0.14433365, 0.5547927, 1.0684805, 0.58614016, 0.94654465, 0.4517556, 1.170154, 5.437166, 2.1370008, 1.5352151, 1.3546447, 0.09746489, 0.07851444, 4.215861, 0.24715182, 0.9045113, 0.41068864, 1.3313231, 1.1572329, 0.014881845, 0.59891456, 3.251477, 1.0726465, 0.6511798, 2.6099975, 0.9858822, 0.28567314, 0.09976998, 0.55906147, 0.21040489, 0.5933655, 0.16872099, 0.45290893, 2.5205355, 0.31445888, 1.0302784, 2.0709765, 2.5145068, 0.19660513, 0.9451663, 0.16786988, 1.2372581, 3.9788175, 0.27158657, 0.20378277, 1.3320464, 0.42369714, 0.77806515, 0.57749087, 2.3475974, 0.08081996, 4.1935563, 1.6933125, 1.8738596, 0.10708279, 0.71252763, 0.58251977, 1.5137424, 0.62677515, 0.59705913, 0.09152788, 1.2489657, 0.9215064, 0.5101962, 0.20376325, 0.84436345, 0.38968503, 0.14210811, 0.74487793, 0.63994074, 1.2055894, 0.9029472, 0.13869333, 0.60358816, 0.8015096, 0.08639775, 1.506803, 1.2196527, 1.0817882, 0.74406844, 0.60077226, 0.7173423, 0.12608536, 0.6581373, 1.056167, 2.9570696, 0.6291318, 0.4760043, 1.2282029, 0.6624347, 0.27036166, 0.5527914, 1.16969, 1.0984919, 0.1806235, 0.17406088, 0.810875, 0.09820801, 0.6885216, 1.5746189, 1.3631369, 0.53953576, 0.10548413, 1.0375983, 0.24508317, 0.15196818, 0.14660181, 0.36303592, 0.17894231, 1.4221318, 0.015704717, 0.66642404, 0.08369669, 0.70933414, 0.17275888, 0.4489402, 0.024814608, 1.8277858, 0.5786875, 1.9434938, 1.9131927, 1.9450201, 1.0711606, 0.18171464, 2.266851, 0.18663958, 1.7500153, 0.6223199, 0.45416513, 2.4537523, 0.37688074, 0.01749119, 1.2449185, 0.372316, 1.8630524, 0.1553547, 1.3182379, 0.43283287, 0.099739134, 0.6101297, 0.30916074, 2.1390758, 0.13208726, 2.3619785, 0.35269585, 0.47178912, 2.3568983, 0.52148104, 0.3785915, 0.03355475, 0.48791975, 0.5260989, 3.5556445, 0.29822493, 1.2095879, 0.5668222, 0.0017295091, 1.6825262, 1.2716902, 0.24704842, 2.4181316, 2.566757, 1.524618, 0.927089, 0.85923, 0.23531285, 0.04465041, 1.0431765, 0.6506298, 0.43145677, 0.45875698, 0.39084032, 2.700282, 0.64030796, 0.3602605, 0.245998, 0.040565237, 0.8036294, 0.9880847, 0.255051, 0.2246641, 0.14685744, 0.73720735, 0.10015077, 0.13484845, 0.5606813, 0.02888307, 0.6496786, 0.054668326, 0.4871435, 1.3162286, 1.3061883, 1.4320079, 2.5887263, 0.6470383, 0.061943144, 0.07107685, 1.5137899, 1.6275811, 0.18914402, 0.298649, 2.285307, 2.3454394, 1.7219446, 0.4742101, 3.9922192, 1.9792211, 0.48325625, 0.29069, 1.2847915, 0.049854297, 0.25217307, 0.1359997, 0.9283323, 2.6537075, 1.2327356, 0.10288906, 0.7717453, 0.7739349, 0.20518845, 0.21485013, 1.7305083, 2.6127512, 0.3331247, 0.010522701, 1.5560495, 1.6734842, 0.02176713, 0.5631002, 5.0461793, 0.002278702, 1.0663769, 0.7820725, 1.4362512, 2.2694201, 0.7343476, 1.0063633, 0.9671929, 0.49264297, 1.3178445, 1.1068943, 0.27088585, 0.32252726, 1.2176661, 0.13521363, 0.73311937, 1.2581524, 0.4832373, 2.868224, 0.014161142, 0.039893866, 0.7617408, 1.0605944, 1.3516896, 0.08562046, 0.08663486, 3.4132216, 1.1984301, 1.2585243, 0.08172519, 2.677143, 0.3915628, 2.4502394, 0.61739606, 1.5147384, 0.08291272, 3.4515147, 1.1555996, 0.56678164, 0.52392167, 0.4968938, 1.9794054, 1.3475969, 0.8564479, 0.14009048, 0.000100077414, 1.0705538, 0.17748015, 0.61401033, 0.8822603, 0.28937802, 0.23445587, 0.1694842, 0.6370602, 2.6891553, 0.2180086, 0.36446306, 3.0500898, 1.00968, 0.15705657, 0.20352258, 0.7485934, 0.8136983, 1.8254495, 1.2945273, 0.03951472, 0.75045055, 0.03938955, 0.78938675, 0.4359703, 1.226292, 0.67754763, 1.8519368, 1.3320931, 0.6406178, 0.8756218, 0.5868584, 0.9560065, 1.2517358, 1.2029369, 0.8320654, 2.1865196, 2.681295, 0.38640845, 3.0050733, 0.54926926, 1.0439011, 3.2184184, 1.110606, 0.05833462, 0.26852864, 0.7340615, 0.070725605, 0.8208132, 0.06369782, 0.20859417, 0.12706545, 0.01109752, 0.19894923, 0.27695927, 1.2552952, 3.0062792, 0.034707103, 1.0426576, 0.6978719, 0.0022565443, 0.14461121, 1.2498341, 1.986961, 0.07834548, 0.075630486, 1.0918019, 0.057047363],
                    "colorSemanticData": [10999, 14886, 5512, 19770, 4880, 14415, 10489, 13175, 14817, 7850, 4062, 11056, 10308, 9770, 9305, 9706]
                }
            }, {
                "name": "Images/resultImages/2007_006660.jpg",
                "overallDistScore": 42.124245,
                "backforegrounddistance": 4.871345,
                "colordistance": 5.3143535,
                "semanticcolordistance": 0.85871,
                "shapedistance": 14.966815,
                "HighLevelSemanticFeatureDistance": 16.97173,
                "mainFeatures": {
                    "shapesemantic": ["boat", "car", "boat", "car", "car"],
                    "Shape": [0, 2, 0, 1, 1, 0, 0, 0, 1, 1, 0, 3, 2, 0, 2, 0, 7, 2, 2, 2, 2, 3, 4, 1, 5, 3, 3, 2, 4, 3, 1, 3, 2, 6, 3, 0, 5, 2, 1, 2, 0, 6, 5, 6, 3, 2, 6, 5, 3, 5, 2, 4, 3, 3, 5, 1, 4, 3, 1, 3, 0, 6, 1, 2, 4, 1, 6, 2, 2, 4, 0, 4, 1, 1, 3, 0, 3, 0, 0, 2],
                    "Color": [21, 13, 13, 11, 12, 18, 17, 15, 11, 17, 18, 17, 16, 12, 16, 15, 14, 18, 14, 21, 13, 31, 15, 18, 15, 16, 15, 32, 18, 10, 17, 13, 14],
                    "BackgroundForeground": [[9, 13, 13, 4, 8, 12, 5, 21, 4, 2, 4, 6, 16, 17, 5, 9, 2, 22, 1, 5]],
                    "HighLevelSemanticFeature": [0.7635928, 1.9747976, 2.3091009, 1.323203, 0.70186585, 0.54099, 0.6280195, 1.1430156, 0.5876117, 2.1880782, 1.4879827, 0.92441124, 1.802887, 0.47151908, 0.39714283, 1.0568312, 0.2907628, 1.5685141, 0.16768852, 0.61210126, 0.98586655, 1.1046712, 1.2078205, 1.7421373, 2.496006, 0.92760146, 0.88244087, 0.65532076, 0.8470124, 1.7995712, 0.8606273, 1.4016334, 2.3958735, 0.19537266, 0.5321198, 0.7294288, 0.8684532, 0.83892864, 0.26634994, 0.20800395, 0.7260112, 1.0363214, 0.15258873, 0.90211594, 0.053402387, 0.7788027, 1.0333368, 0.3555852, 1.0366926, 0.07964839, 0.16077231, 3.522352, 0.27688995, 0.00021982436, 0.7223107, 0.82610726, 3.9605284, 0.05053067, 0.65977025, 0.84145033, 0.50521016, 0.11910061, 0.4793837, 0.21538007, 0.3462091, 0.6147092, 0.031657767, 1.1453059, 0.24956119, 0.34056053, 0.34786054, 0.23914443, 1.8851284, 0.5840727, 0.6989668, 1.2294513, 1.004756, 0.5917465, 0.54215616, 2.2130709, 1.1018748, 0.23037903, 1.5761229, 1.6243408, 2.284362, 1.6429347, 0.61232656, 1.0394143, 2.4824598, 1.1051464, 0.6524646, 0.72921795, 0.14327976, 1.3157442, 0.33479762, 0.29853818, 0.8019341, 2.5007734, 2.3300586, 1.0868722, 2.2332022, 3.5094109, 0.20698708, 0.89042276, 1.0956659, 0.27709845, 1.9716299, 0.5410289, 1.0682994, 2.6052153, 0.017384997, 0.19681701, 2.1666818, 1.8063338, 0, 1.0117967, 1.3232752, 0.76887965, 0.9254531, 0.6224948, 0.124384634, 0.12199459, 1.2560282, 1.1599848, 0.14367495, 0.3542317, 0.6713555, 3.0420148, 1.2660288, 0.99466354, 0.4737751, 1.6385413, 0.24804345, 1.1481134, 0.9065864, 0.44714493, 0.11285241, 0.7503702, 2.06637, 1.3308926, 1.4144576, 0.23024783, 2.17693, 0.92696553, 0.42260695, 0.6065765, 0.493033, 1.3598623, 0.32733208, 1.7669231, 0.4216712, 0.50093126, 0.18715636, 1.7219201, 1.1922625, 0.17717673, 2.0939617, 2.057768, 1.495407, 0.41895404, 1.5562449, 1.7782583, 0.87820816, 0.77433604, 1.5919698, 0.1144819, 0.46234792, 1.2808204, 1.3187611, 0.5125824, 0.513337, 0.37740508, 0.83706886, 0.44006014, 1.3057094, 0.03802338, 2.188563, 0.3678313, 1.7222576, 0.6024636, 0.37007087, 0.28555062, 3.8361866, 0.9191668, 4.7257214, 0.86186063, 0.9993915, 0.96669227, 0.3532458, 0.6866931, 2.3602064, 0, 0.2056383, 2.4587154, 0.042861037, 0.82800776, 0.6529068, 0.3967203, 1.868655, 0.9460937, 1.1837205, 1.4500946, 1.8959113, 0.86519396, 0.82331413, 4.0335813, 0.56043315, 1.6921061, 0.58855736, 0.8139183, 0.7798488, 2.3047276, 0.6631325, 1.4578179, 0.305908, 0.8721041, 1.5979319, 0.015131478, 0.38922033, 1.0052767, 3.8440528, 0.32247022, 0.8151561, 0.87171376, 0.13421649, 0.6355248, 1.2325251, 1.6233923, 0.1802736, 0.46415585, 0.17150053, 1.0214245, 0.21009389, 1.2911371, 0.96488935, 2.8683796, 0.53070515, 0.34876403, 0.45581517, 1.1123338, 1.0440307, 0.26969442, 2.4125302, 1.3589742, 0.02726134, 0.8600103, 1.2517201, 1.7006719, 1.3150104, 0.953819, 0.3832395, 0.07144398, 0.749085, 2.7939622, 0.5592818, 1.4262654, 3.3098087, 0.2639883, 2.0584235, 0.4497205, 0.59788, 1.4592214, 1.318464, 0.03657583, 0.8750956, 0.9408523, 0.7695476, 1.2654216, 0.8980266, 1.5655684, 0.11143153, 1.3046414, 0.22242889, 1.1419625, 0.4374631, 0.874789, 0.4190469, 0.79015505, 1.0835487, 1.2117171, 0.9641446, 0.5089759, 0.610905, 1.6724101, 0.22462544, 0.6053993, 1.4101142, 0.4332001, 1.6804571, 1.286533, 1.2245028, 0.63273704, 0.25341013, 2.0179412, 0.54279965, 2.0991244, 1.4784336, 0.18155058, 0.39408085, 0.48438162, 0.18602592, 1.0356576, 0.9811097, 0.5480961, 1.5728434, 0.5693074, 0.91288245, 0.33727407, 0.682558, 1.5288285, 0.8831701, 0.54606, 3.7301056, 0.17431755, 0.3543995, 0.55961907, 0.2158531, 0.5386003, 1.7862393, 1.5471468, 0.5800959, 0.52161986, 0.2464117, 0.2899748, 0.7698464, 0.37084234, 1.5299706, 1.3736608, 0.28755975, 0.67512333, 2.8389823, 1.1591072, 1.2255309, 1.910534, 0.75157404, 0.29212353, 0.6373311, 0.040704962, 0.51706433, 0.84839535, 0.7461782, 1.2058172, 1.0456731, 0.58166265, 1.224535, 0.6216662, 2.1437404, 0.18213871, 0.99813926, 1.5512772, 0.35995817, 0.8348874, 0.0142583605, 0.4776354, 0.062419, 0.08581212, 2.2226434, 0.003059417, 0.8461369, 0.8423871, 1.2901038, 0.802863, 2.0417483, 1.7885954, 0.05504907, 1.2524683, 0.8081914, 1.6463522, 0.51858944, 0.7009353, 0.7935545, 0.62712, 0.40228865, 0.34978637, 2.241804, 0.48492977, 0.083126865, 0.76880956, 1.1559882, 0.94708914, 0.08572338, 0.017294824, 0.76018596, 0.591434, 2.4830647, 0.030030781, 1.0688062, 1.2456058, 0.13197812, 1.2931501, 1.4935079, 3.1226735, 1.766136, 0.22590236, 0.66258, 0.71005833, 0.12922743, 0.40078154, 0.30267042, 0.3772143, 0.92004603, 2.6683218, 3.0525534, 2.2934308, 0.7189064, 0.69487077, 0.40092027, 2.1248286, 1.4997141, 0.071579486, 0.47367334, 1.6499391, 0.72399294, 0.27905795, 0.10314468, 0.28504065, 0.83922976, 0.9827863, 0.19212057, 1.4154702, 1.1745439, 1.3410126, 0.5667434, 1.1397814, 1.350914, 0.8374206, 1.3575891, 1.0636032, 1.07183, 0.62148714, 1.0731994, 0.32836547, 0.81391317, 1.3551121, 0.78526694, 3.4214873, 0.6427478, 0.5486614, 0.63106525, 0.03931777, 1.5521421, 0.77492285, 0.78028965, 0.16925104, 0.16362971, 0.5227755, 0.74902546, 1.2536595, 1.5668539, 0.8651197, 0.30603972, 0.0010306526, 0.18750568, 0.92045677, 0.6755328, 2.711918, 0.63420737, 0.24947095, 0.28376338, 0.8228282, 0.5491226, 1.4271353, 1.1783417, 0.5824004, 1.0609354, 0.34307742, 0, 0.51510197, 1.6525501, 3.9459465, 1.4983739, 0.5558791, 0.86497146, 1.9669708, 1.494741, 0.49563658, 0.31358182, 0.98991716, 0.4187789, 0.32399493, 4.689997, 1.9351839, 0.80692846, 0.6996632, 0.0099709, 1.0212506, 1.4398463, 1.1712853, 0.13174249, 0.9156199, 0.7966112, 1.8779736, 0.74644244, 0.8296018, 0.39796183, 0.6930059, 0.65418214, 0.8487619, 0.42967227, 0.7846646, 0.37768567, 0.6537132, 0.56071824, 2.2746198, 0.44270757, 1.1703327, 0.56499046, 3.0642426, 1.4092175, 0.85807216, 3.0904233, 0.48297668],
                    "colorSemanticData": [14946, 9929, 12521, 15704, 9639, 15206, 11375, 13188, 10808, 17295, 9602, 12118, 11121, 14235, 11490, 10823]
                }
            }, {
                "name": "Images/resultImages/2007_004902.jpg",
                "overallDistScore": 42.693977,
                "backforegrounddistance": 5.067544,
                "colordistance": 3.4866216,
                "semanticcolordistance": 0.73885864,
                "shapedistance": 13.965955,
                "HighLevelSemanticFeatureDistance": 20.173855,
                "mainFeatures": {
                    "shapesemantic": ["person", "person", "horse", "horse"],
                    "Shape": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 3, 1, 0, 6, 4, 4, 4, 1, 5, 2, 6, 3, 3, 3, 5, 5, 4, 2, 2, 5, 7, 4, 4, 1, 3, 5, 2, 1, 3, 3, 7, 4, 3, 4, 6, 5, 4, 3, 0, 2, 0, 4, 3, 1, 6, 6, 3, 2, 3, 2, 2, 7, 3, 2, 6, 2, 5, 2, 0, 1, 0, 0],
                    "Color": [35, 19, 31, 26, 15, 8, 15, 18, 18, 10, 15, 11, 18, 15, 21, 15, 15, 16, 17, 14, 14, 31, 13, 14, 17, 18, 17, 32, 17, 16, 15, 14, 14],
                    "BackgroundForeground": [[3, 11, 4, 2, 5, 29, 5, 13, 8, 6, 12, 6, 4, 3, 3, 7, 6, 0, 5, 13]],
                    "HighLevelSemanticFeature": [0.03820443, 0.29968905, 1.862748, 0.747729, 0.99896294, 2.3853338, 0.06948742, 2.0349672, 0.35846135, 0.14143889, 0.20966545, 0.40473568, 0.45551133, 1.6926508, 2.3005998, 1.3369308, 0.70802134, 0.33290914, 1.1864647, 2.4176369, 0, 0.50637734, 0.97910565, 1.3575487, 1.4380459, 1.1952828, 0.6640976, 0.3469636, 0.7743121, 1.3506923, 1.4646026, 0.12230333, 0.9808559, 0.1905812, 0.009608252, 0.046447996, 2.819444, 0.5375334, 0.6555438, 0.04690483, 0.41545612, 0.17690714, 3.5205264, 1.8210322, 0.43440288, 0.17496032, 0.5263667, 0.17307143, 0.15730351, 1.6468469, 0.9604962, 0.302536, 0.4711984, 0.9414835, 0.73445123, 0.7534228, 1.5717696, 0.34378156, 0.2713801, 0.16400006, 0.43328714, 1.6718365, 1.1420583, 0.6017863, 0.9684477, 0.11360248, 0.68448555, 0.01943749, 0.6860898, 1.4681753, 0.089934595, 0.37797275, 0.006389529, 0.5030259, 0.020075642, 0.3469878, 0.13800515, 1.83476, 0.591903, 0.042775515, 0.9382006, 0.8149655, 0.3318582, 2.9367108, 0.5013629, 0.45987508, 1.023606, 0.20730455, 0.16784778, 1.9474533, 1.2442539, 0.5240166, 1.3102107, 0.7715583, 2.1686594, 0.16612753, 0.8039143, 1.6579951, 2.0820687, 0.29217374, 0.4512389, 0.7723538, 0.0039246324, 0.57331866, 0.7711802, 1.984273, 0.48003116, 0.23751159, 0.040965527, 0.9757938, 0.7351444, 1.273566, 0.8033142, 1.8846579, 2.094799, 0.3947229, 0.8087115, 0.051545583, 0.4024375, 0.4409511, 5.7541604, 1.7223568, 0.8747292, 0.001314547, 1.239502, 1.8331347, 1.0555665, 1.9123961, 1.4736437, 0.04543534, 0.15414153, 0.57693094, 4.2341275, 1.249879, 0.025594847, 0.44713873, 0.3758778, 0.05469281, 0, 0.45658934, 2.083022, 0.03774183, 0.0242512, 0.05918244, 2.7436404, 0.5546087, 0.8304658, 0.022409473, 1.957335, 0.016487688, 0.8880138, 0.31215793, 0.02775016, 1.0070004, 0.18041982, 1.1334499, 1.9175521, 0.5702964, 1.620874, 0.115876995, 1.7930088, 0.047581058, 0.58325994, 0.6419564, 0.45907283, 0.23046696, 1.8169245, 0.009154696, 0.1078772, 1.8764851, 0.040410742, 0.53556705, 2.5622265, 0.4546462, 0.42153597, 0.17588603, 0.27145606, 1.863027, 0.096945405, 0.50919855, 0.5039067, 0.9195242, 1.2986454, 1.185958, 0.67205197, 0.42622676, 0.29358774, 0.7892342, 0.20920524, 0.42324603, 0.039665315, 1.4029614, 0.6605335, 0.30950817, 0.5387519, 1.3821349, 0.5815328, 0.2532971, 0.1253999, 0.24108498, 0.26459703, 1.6761001, 2.6452374, 0.17337583, 2.6782084, 1.3505987, 0.1571725, 1.0902784, 1.0486072, 2.3107686, 0.25997892, 1.4370844, 0.7897806, 0.15405545, 1.1844457, 0.04723897, 1.3128957, 1.3139069, 0.06360355, 2.2495837, 1.0077038, 3.0980213, 0.13994206, 0.4563807, 0.8251338, 1.6740855, 1.0493529, 0.5609353, 2.369123, 0.5224486, 2.2044773, 0.4826584, 0.61275107, 1.3711919, 0.32079178, 0, 1.3603624, 0.39174014, 0.79002964, 1.0569414, 0.9194073, 1.9095712, 1.5111058, 0.4400375, 0.91285866, 0.19336617, 1.0088255, 0.07686822, 0.5441033, 0.295121, 0.22878629, 0.0054363497, 0.106563464, 0.9882855, 0.14044, 0.1120093, 0.3447038, 0.004733425, 0.4486614, 0.04753607, 0.58054173, 0.14233825, 0.04150545, 2.4996402, 0.07282154, 1.3328711, 0.9949864, 0.17007267, 0.29302815, 0, 0.49476424, 0.785793, 3.488202, 0.094390005, 0.5779621, 0.81521046, 0.8734626, 2.123338, 0.044636346, 0.7480794, 0.41044885, 1.0447549, 0.4844008, 0.29070425, 1.0194157, 0.91194767, 1.4705051, 0.8177089, 0.27271903, 3.7245057, 0.13065171, 0.00369249, 1.5851107, 0.024735432, 0.0582994, 1.2122742, 0.07266277, 0.7647985, 0, 0.817718, 0.3180321, 0.19351764, 1.6358265, 1.6529729, 2.2733061, 2.3020625, 1.5211532, 0.50142515, 0.798719, 0.26678723, 0.048223954, 0.1708868, 1.0531722, 1.3191451, 0.0099887345, 1.3559103, 0.26010624, 0.20309964, 0.52046365, 1.4764513, 0.116826825, 0.3800612, 0.24056248, 0.10167617, 1.8955412, 0.5337323, 2.081247, 0.017208751, 0.08460586, 0.30374447, 0.73886216, 0.92486674, 0.18300453, 3.16256, 0.4868688, 0.06998662, 0.5891317, 0.15351155, 0.67239356, 1.4040308, 0.04240724, 1.9762177, 1.0359057, 0.680688, 0.5813661, 1.259755, 2.4703221, 1.166363, 0.6076112, 2.91715, 0.5011985, 0.016446125, 1.5860662, 0.26063386, 1.0874172, 0.06162469, 0.16159919, 3.1323073, 0.22806002, 1.4147627, 0.100493506, 1.7937135, 0.3068619, 0.14151815, 0.05400464, 1.0897756, 1.441247, 0.78574246, 3.2778852, 0.00830988, 0.9859708, 0.29244047, 0.14278778, 2.2604299, 3.1864705, 2.9683194, 0.4926014, 0.1242461, 0.34746814, 4.0721707, 1.2286078, 0.5559263, 0.93021244, 0.38733378, 1.4134446, 0.37513125, 0.37026885, 0.10195115, 1.6198615, 0.39697766, 0.731785, 2.088499, 0.19089077, 0.6349344, 0.18022329, 2.6491783, 0.10451266, 1.4593233, 1.2683268, 2.2558007, 3.4041219, 0, 1.1723219, 0.1655958, 0.18717964, 2.817989, 0.77281183, 0.037877925, 0.43349165, 2.8000863, 0.3414651, 0.021586511, 0.35572103, 0.031936146, 2.6576285, 1.264863, 1.2032226, 0.1687268, 3.7527456, 0, 0.7505689, 0.04241105, 0.8655996, 1.7353094, 1.0725849, 0.31994566, 0.09931138, 2.3062234, 0.19149092, 1.3582963, 1.4533039, 0.19759762, 1.4322321, 1.5338762, 0.030637473, 0.3579797, 1.0252308, 0.27314162, 1.589945, 3.3560708, 0.14338298, 0.39507434, 0.37100127, 2.3402305, 1.7974043, 0.9585342, 0.08293892, 0.19285992, 1.7170088, 0.76914495, 0.2551935, 1.4376998, 1.038729, 0.028717449, 0.19144197, 2.7576172, 1.044155, 0.10465104, 0.2944406, 1.2340258, 0.063608766, 0.18342617, 0.9594305, 0.6505638, 1.6605449, 1.3825759, 0.13979176, 0.9498973, 0.14075957, 0.015562587, 0.83168536, 0.23062651, 0.65645623, 2.5967946, 0.7200529, 0.45092812, 0.76987886, 0.21286112, 0.033827096, 2.7964542, 0.2322578, 4.937358, 1.1861156, 0.07991781, 0.5942462, 0.13244142, 0.09371351, 1.4886959, 0.32588524, 1.023359, 0.61698294, 0.4543615, 0.8088981, 0.34404296, 0.32523635, 0.010972571, 0.7169118, 1.533985, 0.08035474, 0.33019167, 0.35028115, 0.055716068, 1.5597872, 0.10696803, 0.501082, 0.8336359, 0.9191699, 0.20380788, 1.8774632, 0.18382663, 1.6453466, 0.0046574986],
                    "colorSemanticData": [51973, 2500, 1433, 5492, 12043, 12318, 8768, 11730, 11569, 8079, 13485, 8112, 11922, 5516, 13793, 8767]
                }
            }, {
                "name": "Images/resultImages/2007_006901.jpg",
                "overallDistScore": 43.77121,
                "backforegrounddistance": 6.113101,
                "colordistance": 5.4498615,
                "semanticcolordistance": 0.731864,
                "shapedistance": 12.714778,
                "HighLevelSemanticFeatureDistance": 19.49347,
                "mainFeatures": {
                    "shapesemantic": ["person", "person", "motorbike"],
                    "Shape": [1, 1, 0, 0, 0, 1, 1, 2, 3, 2, 1, 0, 1, 0, 3, 2, 1, 0, 0, 0, 2, 2, 3, 1, 1, 3, 4, 4, 2, 5, 1, 2, 3, 3, 4, 3, 3, 3, 1, 0, 1, 3, 4, 3, 2, 0, 5, 4, 4, 3, 0, 5, 4, 5, 3, 2, 3, 3, 5, 5, 0, 3, 2, 1, 3, 0, 5, 1, 2, 2, 0, 5, 1, 2, 2, 1, 4, 3, 4, 1],
                    "Color": [54, 16, 11, 24, 16, 23, 15, 18, 16, 20, 16, 15, 11, 15, 20, 16, 17, 17, 11, 15, 15, 27, 16, 17, 16, 16, 14, 40, 16, 14, 12, 16, 15],
                    "BackgroundForeground": [[8, 23, 4, 17, 19, 46, 8, 14, 4, 0, 12, 9, 4, 10, 7, 16, 7, 10, 11, 5]],
                    "HighLevelSemanticFeature": [0.6834439, 0.6396958, 0.18100715, 0.10139714, 0.07650808, 0.46410295, 0.086119786, 0.026361862, 1.28854, 0.4765544, 1.4174968, 0.52152866, 0.6637724, 3.5701656, 0.98173505, 1.1644793, 0.012982422, 0.12231212, 0.40666527, 0.8510602, 0.3149902, 0.5495419, 0.22389412, 0.7241236, 0.31611705, 0.33113316, 0.43746716, 3.3439765, 1.0404707, 1.3335791, 0.6309263, 0.56601405, 0.11668113, 0.45719066, 1.0947114, 0.13399543, 0.088847674, 0.54705805, 0.41711932, 0.21198566, 0.8784756, 0.1647511, 0.98849314, 3.112698, 0.7040604, 0.088938385, 0.55041486, 0.087914, 0.85343313, 0.34560797, 1.2764473, 0.12800014, 0.74018216, 0.29629213, 1.5715836, 0.35133043, 3.937105, 0.53542143, 0.29226935, 0.18390802, 0.95490295, 0.4491488, 2.375245, 2.2626255, 0.24573186, 0.3486978, 0.96704626, 0.9284998, 0.4166397, 0.47011065, 2.138017, 0.8055731, 0.75770426, 0.086671345, 0.7951322, 0.1697768, 0.6703209, 0.4752771, 0.68631256, 1.9811839, 0.72613937, 2.751902, 0.34384686, 3.9553144, 0.13207759, 0.56845754, 0.2535613, 0.3023245, 1.1875728, 0.8804406, 0.5504782, 0.19162428, 0.36543596, 1.9119219, 0.38865182, 1.0357016, 0.5816856, 0.64598715, 0.6431491, 0.09258833, 0.38672626, 1.7915949, 0.9410054, 0.30056778, 1.4972366, 0.67533875, 0.5567704, 0.017559769, 0.36111605, 0.81831354, 0.48328385, 0.7600245, 0.362329, 0.63254607, 1.6775695, 0.8655967, 1.2031025, 0.3376648, 0.2357055, 0, 1.9756068, 0.4207447, 0.33337894, 0.89540625, 1.5829772, 0.6052233, 0.64557886, 0.866555, 1.9655628, 0.21048087, 0.17835782, 1.4901351, 1.4310977, 0.11386796, 1.1250237, 1.1323797, 0.9046564, 0.2194413, 1.4159331, 0.08192451, 1.646077, 0.5394594, 1.7989119, 0.5385768, 0.29191765, 1.1266214, 0.22762826, 1.6642392, 0.91318953, 0.3420034, 0.1845037, 1.4962543, 1.5686402, 0.441611, 0.124296315, 0.09671191, 0.72497046, 0.8493652, 0.6587873, 0.043204036, 1.0035924, 0.24767958, 0.06392875, 1.6804838, 0.432577, 0.03284314, 4.4568253, 1.0221187, 0.53475016, 1.432408, 0.18633142, 0.53703845, 0.6834514, 0.8347063, 0.49042082, 0.40163964, 0.12545782, 1.0138708, 0.5077376, 1.3709484, 0.85292506, 0.06741136, 1.7221999, 0.5382726, 1.1284863, 1.1402068, 0.7315575, 0.48616716, 0.18557368, 1.1715361, 0.4214373, 0.2789105, 0.5801283, 1.75575, 1.2292626, 1.2323463, 0.08478753, 0.26242697, 0.00093700876, 0.7653982, 1.4628372, 0.21520616, 2.132217, 0.80020785, 0.23501591, 0.28215045, 0.72834444, 1.3869541, 0.39161646, 0.8809314, 0.07562083, 0.7755453, 0.24572206, 0.29386732, 0.44885936, 0.7878117, 0.85116434, 0.3067214, 0.68763536, 0.6862421, 0.1281331, 0.04962233, 0.12138856, 0, 0.20571783, 0.48477468, 2.4227848, 1.3702193, 1.1768742, 1.4113765, 0.7769462, 0.9499397, 1.3040315, 0.846241, 0.25595286, 0.029918099, 1.304862, 0.17464782, 0.37962902, 0.7741794, 0.007727112, 0.965432, 0.23811537, 1.2926906, 1.4154431, 0.006711821, 0.65930533, 0, 0.89846945, 2.1140153, 1.7576065, 0.15545462, 0.17742132, 0.62971145, 0.58553153, 0.39522, 0.44722027, 0.023064256, 0.5560161, 0.76058984, 0.4735706, 0.9380478, 0.8777582, 0.24078141, 0.47722766, 0.6752429, 0.0649033, 1.5315424, 2.843984, 0.0020936169, 0.25743303, 0.29617584, 0.21488324, 0.59131444, 0.10894525, 1.3718907, 0.67171866, 0.43536875, 0.56018066, 0.21251601, 1.1266791, 1.7371479, 0.1119189, 3.6779442, 1.3522564, 1.4853909, 0.1948558, 1.138023, 1.3225564, 1.0494478, 0.10734025, 0.4479103, 0.18267058, 0.52185196, 0.35831365, 0.25397983, 0.7070907, 0.11295783, 1.129593, 0.7216184, 0, 0.21508205, 0.08216009, 0.24414134, 5.8234525, 0.5793452, 0.08800211, 0.10738545, 0.32527226, 0.3332558, 0.015882822, 0.115745105, 1.7385637, 0.13560358, 0.6212333, 0.68757015, 0.2892115, 0.62343454, 0.72230583, 0.24148485, 0.12171401, 0.11131026, 0.7173228, 0.06530697, 0.13904582, 0.56893045, 1.5220219, 0.69917595, 0.26816824, 0.4328561, 1.9182006, 0.3985937, 0.76268345, 0.37093177, 1.2442588, 0.53645635, 1.167324, 0.032717016, 1.0704653, 0.05566588, 1.15537, 2.5980012, 0.7077031, 0.59114486, 0.31615135, 0.004189568, 1.126009, 0.59561294, 0.5753514, 0.6427239, 0.19661759, 0.063773796, 0.25851658, 0.6505644, 0.36962962, 0.56298184, 0.6297899, 1.3257986, 0.060858876, 0.45261714, 0, 0.40479088, 1.022871, 0.6899045, 0.058155295, 0.061552048, 0.9588249, 0.92813516, 1.2283185, 0.46147847, 2.146682, 0.25834706, 0.759808, 1.2819144, 0.7476637, 1.9086237, 1.3401313, 0.31335425, 0.014815766, 1.219481, 0.8535952, 0.9709011, 1.3696959, 1.1430693, 2.146543, 1.5350682, 2.5679517, 0.27871856, 0.49408773, 0.92431206, 1.3842595, 0.552487, 0.34362158, 0.97565836, 0.070691876, 0.09569905, 0.09450394, 0.37855515, 0.093903035, 0.025984647, 0.30702987, 0.71729076, 0.20209524, 0.5690941, 0.22898147, 0.13140297, 0.6706568, 0.5210979, 0.12487195, 0.20581934, 0.74195206, 0.13448797, 0.25178874, 1.3705268, 0.33797505, 0.55749863, 0.11510886, 0.3370523, 0.77311826, 0.27642855, 0.15293972, 0.6513922, 1.2126198, 1.541355, 0.55576706, 0.016309386, 0.48009774, 0.26678777, 0.68290055, 0.92749894, 0.71304655, 2.208644, 0.257737, 0.2579264, 0.3477402, 2.555602, 0.58120155, 0.5040977, 0.14136463, 2.48424, 0.28029382, 0.14972228, 0.36636913, 0.04233299, 0.9215087, 0.8500091, 2.9837596, 0.30143693, 0.2837328, 0.28245232, 0.9534364, 0.29383984, 0.2828341, 0.26640806, 0.18695906, 0.38821578, 1.1793306, 0.085717514, 0.061055522, 0.08196612, 1.7171279, 0.4374887, 0.18133907, 0.22863103, 1.1547554, 0.6813675, 0.051215034, 0.27369642, 1.0818489, 0.4093926, 0.2056169, 0.13340971, 0.11622311, 0.74842167, 0.5461395, 1.242172, 1.1578506, 0.15986745, 0.74619377, 0.15471137, 0.23263282, 2.4546726, 1.4683743, 0.5626736, 0.0033459396, 0.11650546, 0.538695, 0.9872493, 0.52073526, 0.66803056, 0.38037702, 1.2762623, 0.4974214, 0.37229425, 0.05624235, 0.025655523, 0.09255477, 0.41436297, 1.2204458, 1.616568, 0.46356216, 2.5306644, 0.13213442, 0.8132566, 0.57676196, 0.6316849, 0.8251487, 0.13288443, 0.07616277, 0.14576462, 1.3229913, 0.16812274],
                    "colorSemanticData": [14677, 20425, 16553, 11188, 19203, 15065, 16941, 13144, 18796, 15347, 13126, 17887, 15901, 11521, 13297, 16929]
                }
            }, {
                "name": "Images/resultImages/2007_003848.jpg",
                "overallDistScore": 42.433678,
                "backforegrounddistance": 8.301205,
                "colordistance": 3.3776326,
                "semanticcolordistance": 0.4559071,
                "shapedistance": 11.748682,
                "HighLevelSemanticFeatureDistance": 19.006159,
                "mainFeatures": {
                    "shapesemantic": ["train", "train", "aeroplane"],
                    "Shape": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 2, 0, 0, 1, 1, 4, 2, 0, 3, 1, 5, 1, 0, 3, 2, 1, 1, 0, 3, 2, 2, 1, 0, 1, 3, 5, 2, 0, 4, 1, 6, 2, 2, 4, 4, 2, 1, 2, 5, 1, 5, 2, 2, 3, 1, 5, 3, 4, 4, 0, 7, 1, 4, 4, 1, 7, 0, 0, 4],
                    "Color": [42, 18, 29, 28, 19, 24, 11, 15, 14, 8, 18, 10, 7, 14, 23, 12, 15, 19, 15, 14, 12, 27, 15, 18, 15, 16, 16, 36, 16, 13, 15, 15, 15],
                    "BackgroundForeground": [[0, 17, 6, 3, 30, 75, 13, 11, 8, 1, 27, 7, 20, 26, 12, 19, 1, 10, 17, 3]],
                    "HighLevelSemanticFeature": [0.64722604, 0.1935152, 1.5413331, 0.19237237, 2.5225472, 0.32314685, 2.1090198, 0.26680103, 0.1818381, 0.18029875, 0.74729073, 0.47333834, 0.1857581, 0.72993386, 0.6653163, 1.6097907, 0.036512703, 1.1740377, 1.5751334, 0.34649464, 0.18971604, 0.35262161, 5.013026, 2.595208, 1.2885, 0.29145613, 0.3037899, 0.9512295, 0.015459676, 1.0870554, 0.94241697, 0.07577924, 1.0508478, 0.09081974, 1.2735302, 0.34272364, 0.0033656773, 0.46830902, 0.002826502, 0.11230777, 0.19145252, 1.0526829, 1.3579978, 1.0632061, 0.00008835112, 1.3895667, 0.45478398, 0.3349744, 0.15859824, 0.08221832, 0.7091034, 4.1576915, 1.4998201, 2.3201783, 4.4395313, 0.020119412, 1.3567123, 0.15018545, 1.0982909, 1.5304055, 0.11839542, 1.2416583, 0.59248585, 0.7042565, 2.3499217, 0.48470333, 1.0614191, 0.005298668, 0.34071237, 0.5518538, 0, 0.061466858, 1.4663961, 0.118682, 0.21282952, 2.779303, 0.41877878, 0.1951142, 1.284022, 1.2417184, 0.02169411, 2.318788, 0.34352294, 0.58790433, 0.5549237, 5.932352, 0.024277339, 0.4763156, 0.9319832, 0, 1.4943819, 0.17299278, 0.95865995, 0.06421383, 0, 0.29781744, 0.03374135, 1.500881, 0.42317197, 0.0051590367, 0.18880947, 1.1632501, 0.23402464, 0.06320521, 0.940123, 3.334072, 2.2539222, 0.05921428, 0.030335236, 1.159827, 0.18599059, 1.2864217, 1.876824, 0.45339072, 0.14240056, 0.48339894, 2.0635047, 0.18396199, 0.15121764, 2.5801618, 0.3579725, 2.5049837, 0.3352094, 0.8924079, 1.0002806, 0.7593951, 0.01160009, 0.40172276, 0.003721399, 1.2461692, 0.40419608, 1.17287, 2.7904286, 0.48622513, 0.30272344, 0.9526, 0.34596798, 0.29839906, 0.2208771, 0.6855832, 0.2803837, 0.09437503, 0.39804447, 2.3225527, 0.73446256, 0.0072628697, 0.04916131, 0.38582772, 0.41136003, 2.6429462, 1.8876227, 0.086190425, 0.15059361, 1.1378103, 1.4348419, 0.028684536, 0.1358932, 0.3197346, 0.3853944, 0.21722919, 0.3349944, 0.4152209, 1.568139, 2.7326725, 0.38755873, 1.6155958, 1.4198222, 0.15101406, 1.174837, 0.5603285, 0.5728931, 0.32334653, 1.2985528, 0.3193139, 3.3972623, 0.9858699, 0.45738867, 0.013204065, 0.94257396, 0.71030295, 0.026734123, 1.7440649, 1.484396, 0.61985064, 0.053338766, 0, 0.17546761, 0.7007943, 0.3084433, 0.76141304, 3.8104448, 0.10358819, 0.0872427, 0.12052767, 0.06255724, 0.5040269, 0.11781467, 1.7112509, 0.07302117, 0.40215898, 0, 0.3775232, 1.36392, 0.12985831, 0.70130813, 1.574964, 0.1220873, 1.7266906, 1.7176802, 0.22065294, 0.8762543, 0.50745475, 0.7866038, 0.59555346, 0.37223157, 0.53668797, 2.474037, 0.37117615, 2.759367, 0.073422104, 0.08757842, 0.2732248, 0.26547208, 1.040044, 0.8062861, 1.0503157, 1.4737666, 0.82574844, 0.50671864, 0.21836568, 1.4739664, 1.207322, 0.5907793, 0, 2.0500827, 0.45225865, 0.069034025, 1.1963137, 0.66972685, 0.18293226, 1.05436, 0.84693176, 2.4867084, 0.93823886, 0.016882561, 0.8173249, 2.2814562, 1.0810528, 0.06757676, 0.068077534, 0.27908802, 0.0051053483, 0.004031223, 1.1315191, 2.4202197, 0.45155615, 0.19265594, 0.05594777, 4.7093124, 0.11891216, 1.6319768, 2.0381112, 0, 0.29682305, 0.3937168, 0.16154614, 0.37224898, 0.9469665, 1.976742, 0.15341607, 0.14580987, 2.2401273, 0.760271, 0.30616367, 0.5610192, 3.0685792, 0.29285026, 0.46492484, 0.744542, 0.19273473, 1.1015704, 1.3530278, 1.248223, 0.62865144, 0.85761005, 1.2113509, 0.25347647, 0.35846114, 1.0323849, 0.030047432, 1.82617, 0.7213478, 0.007693269, 1.6068332, 0.7796574, 0.4131966, 1.4198319, 0.14362109, 0.23970462, 0.4049966, 1.5755258, 0.6786044, 0.2213543, 0.26350865, 0.88908404, 0.0141658345, 0.098163076, 1.7722926, 0.45879596, 1.7804397, 0.8619654, 0.34996906, 2.4234316, 3.2603753, 0.3169337, 1.3779699, 0.47704583, 0.4070292, 0.08818906, 1.1541858, 0.3481983, 0.8195208, 0.3961275, 0.4002842, 2.3073082, 0.057878044, 0.009686818, 0.70937043, 0.6236643, 0.062581964, 0.6671361, 0.8982211, 0.27879873, 2.2333093, 0.58354497, 2.734395, 0.4589131, 1.6822778, 0.033351243, 0.41264996, 1.2438612, 0.83515036, 0.780437, 0.2179395, 0.041513808, 0.025182022, 0.16409592, 0.38241118, 0.33878356, 0.10767925, 0.005524059, 0.6593987, 2.1440957, 0.012037413, 0.05396375, 0.1830095, 0.6697808, 0.9019259, 0.7688248, 0.4429243, 0.19751006, 1.742843, 0.51925695, 1.3800249, 0.13433577, 0.30629012, 0.8286436, 1.8228948, 0.23744085, 0.9350925, 0.68799067, 0.38384897, 0.25234842, 0.9516218, 1.8871094, 0.31674814, 1.7572275, 0.42342287, 0.32927185, 0.06756286, 0.10369418, 0.019257307, 0.06450738, 1.1568687, 0.26604727, 0.11894812, 1.3981647, 0.6054593, 0.16226293, 0.77976716, 0.821805, 2.203696, 0.18298535, 0.85229766, 1.7309244, 0, 0.2629275, 0.17893955, 0.73393804, 0.2954182, 1.1477563, 0.25151524, 1.4708716, 4.112101, 0.3963041, 0.5994052, 0.91409373, 2.287237, 0.68338007, 2.1412227, 0.116627336, 2.2479188, 0.28773648, 0.6108596, 0.279399, 0, 0.06160962, 0.94808936, 0.075535655, 0.7033162, 0.47709817, 2.9503226, 1.6466421, 0.43605763, 0.36171988, 0.66178465, 0.27406532, 0.61510015, 0.0035959966, 0.23355573, 0.72549623, 0.5484318, 0.52721894, 3.7895284, 0.70744425, 1.6157414, 0.4437148, 0.2909218, 0, 0.23998888, 0.3267736, 0.27730075, 0.05640883, 0.5107669, 1.4952165, 0.18702939, 1.3577132, 1.813951, 0.4270475, 0.26556444, 0.9739128, 0, 0.15752454, 1.4004552, 0.6348918, 0.42399764, 0.8145996, 0.68328637, 0.014574076, 0.10337439, 0.0526509, 0.41427642, 1.292521, 0.5728839, 0.44481164, 0.5133731, 1.5671722, 0.8337954, 0.60504323, 0.219894, 3.0690942, 0.43216923, 0.4748016, 2.344959, 3.4160001, 1.2263639, 0.042408265, 0.557549, 1.7438233, 0.29453194, 0.56049776, 1.2472798, 0.9922656, 1.9623612, 2.22204, 1.6576357, 1.4535772, 1.0573368, 1.2069607, 0.81655943, 0.15089937, 0.19935717, 1.0746413, 1.0422796, 0.8099589, 0.99661297, 0.06822375, 0.96102285, 0.42765945, 0.91547555, 1.3736807, 0.12424397, 0.5826358, 2.248357, 0.04220646, 0.648345, 0.14724241, 1.049058, 0.07674587, 0.099958204, 0.49283585, 1.744252],
                    "colorSemanticData": [15401, 2503, 953, 4052, 6919, 5656, 2082, 7813, 4096, 5156, 6846, 5677, 5899, 4386, 5917, 4644]
                }
            }, {
                "name": "Images/resultImages/2007_009597.jpg",
                "overallDistScore": 44.261024,
                "backforegrounddistance": 9.532051,
                "colordistance": 2.6074436,
                "semanticcolordistance": 0.87288,
                "shapedistance": 11.751052,
                "HighLevelSemanticFeatureDistance": 20.370476,
                "mainFeatures": {
                    "shapesemantic": ["train"],
                    "Shape": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 3, 0, 0, 1, 1, 3, 1, 0, 2, 2, 2, 2, 2, 3, 3, 5, 3, 1, 4, 2, 5, 3, 1, 3, 3, 5, 6, 5, 4, 4, 6, 3, 3, 3, 4, 6, 5, 4, 2, 2, 5, 6, 4, 5, 2, 3, 4, 6, 7, 2, 4, 4, 6, 5, 0, 5, 4, 5, 5, 0, 4, 3, 5, 6],
                    "Color": [48, 19, 30, 19, 16, 13, 15, 15, 14, 13, 15, 15, 20, 16, 16, 15, 16, 15, 15, 14, 14, 29, 15, 20, 13, 16, 16, 32, 16, 13, 18, 16, 15],
                    "BackgroundForeground": [[26, 13, 22, 34, 12, 72, 16, 55, 16, 80, 12, 20, 23, 11, 35, 10, 31, 27, 31, 5]],
                    "HighLevelSemanticFeature": [0.93436736, 2.0953133, 3.1039336, 0.7717014, 0.014695589, 0.2031178, 0.4374565, 0.78620446, 0.07025737, 0.817217, 0.72163314, 0, 0.1552826, 1.9238591, 0.075020015, 0.15504028, 0.052798912, 1.8197999, 0.15004514, 0.04811795, 0.0030269094, 1.8356847, 0.9423951, 0.9654418, 0.050733965, 0.92535627, 0.71445066, 0.22262166, 0.062126286, 0.5777768, 2.7586508, 0.7621325, 0.8513108, 0.20377393, 1.408955, 0.038625937, 0.61839134, 1.0544431, 0.1634643, 0.06195642, 0.96472144, 0.18708268, 0.50935596, 0.82376355, 0, 0.8209658, 0.004242957, 0.029172644, 0.75162715, 0.97147197, 0.6211063, 0.052657753, 2.324399, 0.036198065, 0.08754209, 0.13345368, 0.7984907, 0.4266566, 0.6333337, 0.39043492, 0.0068003875, 0.66266865, 0.056008678, 1.017277, 1.9234786, 0.2972363, 0.683493, 1.2748973, 0.029788494, 0, 0.15673509, 1.0347553, 1.1413219, 0.5730694, 1.9517986, 2.4396753, 0.21682096, 0.2281061, 1.2001685, 0.052331578, 1.2654898, 0.70027417, 0.29643974, 0.3942808, 1.859761, 0.54950225, 0.7477864, 0.17609312, 3.5081997, 0.049856026, 0.008892921, 0.58954287, 0.23748791, 0.80277073, 0.11290939, 0.6492251, 0.35325027, 0.45746133, 0.42066216, 0.06816499, 1.1416235, 0.061117027, 0.31037655, 0.95500904, 1.0893288, 1.2869564, 0.8310079, 0.9751407, 0.27014092, 0.45410854, 0.03930618, 3.2513332, 0.5620574, 1.1637697, 0.09463684, 1.4687942, 0.89427304, 2.3851073, 0.5314788, 1.4716139, 0.6052633, 1.5568862, 0.22686645, 0.51171434, 0.3759863, 1.2367799, 0.28315642, 0.043107383, 0.06199645, 1.0055426, 2.4977112, 0.08751509, 1.2790387, 1.1237905, 0.50733465, 0.33588192, 0.064610116, 0.1657266, 0.0864023, 0.2705652, 0.3724495, 0.559744, 0.46045327, 1.6355078, 0.17467965, 0.51522183, 1.1002914, 0.0020363422, 0.6712041, 0.47993127, 0.945793, 0.033908397, 0.09136931, 0.45056945, 2.8857288, 0.00026788638, 0.052252695, 0.36532494, 1.6901233, 0.23231317, 1.6154418, 0.53993356, 0.41138405, 1.2566391, 0.9197136, 4.835161, 2.0660605, 0.84518796, 0.61136025, 0.2607479, 1.0262492, 0.000837056, 1.653444, 2.0138845, 2.685706, 0.55931044, 0.3937754, 0.060194783, 1.0938132, 0.12063437, 0.20922011, 3.2841892, 4.031751, 0.8835533, 0.47200862, 1.0264748, 0.08368664, 0.13061248, 0.37903896, 0.11600058, 0.40394834, 0.5092397, 1.4749877, 1.1546689, 0.011491822, 0.18709622, 0.19055693, 3.089968, 0.26325366, 1.7157292, 0.6945999, 0.98681027, 1.548576, 0.18457825, 0.15607803, 1.9916599, 0.005262883, 0.23042622, 0.16016616, 1.4222251, 0.58235705, 0.42615545, 0.5605297, 1.3992478, 0.06562945, 2.3852363, 0.099138156, 1.2525824, 2.6647947, 0.593896, 3.4067252, 0.16497353, 0.23696569, 4.242719, 0.9748212, 0.4180319, 3.51156, 0.3261824, 1.0178318, 0.69180506, 1.5662277, 0.3715466, 0.4779512, 1.1504118, 0.44320428, 0.3577113, 0.14801131, 1.7829843, 1.1164631, 0.10282688, 0.2755842, 0.95622057, 1.6295424, 0.23123671, 0.0032069944, 1.0738592, 0.5794082, 0.33726186, 1.1256217, 2.647421, 2.1583505, 0.80798566, 0.024772754, 0.93108135, 1.1655546, 0.51159304, 2.4834232, 0.8340643, 1.0059057, 0.44132435, 0.28172395, 0.26692024, 0.23227195, 0.1841404, 0.36005744, 2.6900434, 0.4823156, 0.2896222, 0.22969265, 1.0394552, 0.6356098, 1.6837748, 0.13257141, 0.40867794, 0.37874615, 1.3767767, 4.209415, 0.014297437, 0.08379912, 1.1604038, 0, 0, 0.6006146, 1.0252436, 0.9398264, 1.0052356, 0.12006833, 1.966806, 1.886669, 0.4204792, 0.141356, 0.78973675, 0.76746225, 0, 0.10723704, 0.60978884, 1.5328795, 1.1121168, 0.439098, 0.3864393, 0.46503878, 1.1756319, 0.3765292, 0.9925042, 0.7927043, 0.9138812, 0.22294414, 2.004275, 0.6796481, 0.04879082, 1.3278245, 0.97844696, 4.057497, 0.20374425, 0.05822528, 0.17721187, 0.401397, 0.106751814, 2.1350331, 1.2963823, 0.38724437, 0.6089505, 0.020123234, 0.80126494, 0.24543317, 1.3983526, 0.024513163, 0.26471943, 0.9872457, 0.36691663, 0.8088401, 0.53700626, 0.7448049, 2.2882419, 1.4903975, 0.6095292, 1.0295246, 0.7643494, 1.2400424, 0.07509341, 2.3736784, 0.58714616, 1.3544209, 0.50493747, 1.0569307, 0.45376578, 0.50722647, 0.37527093, 0.13863815, 1.192424, 0.1644785, 0.77249324, 0.3843904, 0, 0.1475287, 0.3070891, 0.11130638, 0.09738881, 3.2054894, 0.36441854, 0.0002217086, 1.1939337, 0.20882967, 2.6556644, 0, 0.17277272, 1.813674, 1.0780191, 0.09060088, 0.38627434, 2.8241994, 4.072214, 0.36385295, 0.6410886, 0.07300842, 0.22295746, 0.12576486, 1.4221274, 0.100789145, 0.6071659, 1.282035, 0.8275497, 0.91354746, 4.71845, 1.8769649, 0.96153784, 0.5107875, 1.0528338, 1.6652368, 2.1541913, 0.58598745, 6.563952, 0.26482797, 1.5153342, 0.32327262, 0.663371, 0.251509, 0.80173635, 0.7572465, 0.39015132, 0.7958555, 0.38783625, 1.8129604, 3.2042835, 0.018398147, 1.070553, 0.109103225, 5.398918, 0.3243009, 4.1640825, 0.07029866, 0.79264593, 0.16037154, 0.3089335, 0.08428142, 0.0025926707, 0.50495803, 0.2582837, 0.31014884, 1.0065805, 1.2198772, 1.9603837, 1.4814594, 1.2509217, 0.6574353, 0.19327791, 0.37653044, 5.843849, 1.4796855, 0.38852462, 0.009096533, 0.5699021, 1.2842015, 0.071323656, 1.1179811, 1.0859479, 0.9979103, 1.8028045, 0.42194661, 0, 2.983057, 1.4146632, 0, 0.40956187, 0.12703572, 0.24904124, 0.19432768, 0.21719208, 0.2854905, 0.01457226, 0.8154263, 0.6096972, 0.4021669, 1.1400175, 0.091603935, 0.53910685, 5.853778, 3.134971, 0.38285354, 0.1279826, 1.8235875, 0.025835346, 0.44339362, 0.0005817219, 1.2317681, 1.2273779, 0.31027064, 0.067894354, 0.5949101, 3.4394972, 3.489108, 2.510541, 0.5452585, 1.6474981, 0.57138, 1.2436882, 0.11131698, 0.03205529, 0.08450448, 0.05485772, 0.9256777, 2.3434885, 0.39937347, 1.3997633, 0.3045563, 2.4751568, 1.7220677, 0.6735941, 0.62055767, 0.06177088, 0.118642405, 0.1665672, 0.21638694, 1.2873365, 0.06663473, 0.1285492, 0.18518046, 0.7929573, 0.095838845, 0.040720187, 0.14757548, 0.29992774, 0.29610303, 2.2823322, 0.08051787, 0.6778826, 0.2950502, 2.0077796, 0.0015794392, 0.4926021, 0.069116235, 0.11606124],
                    "colorSemanticData": [15499, 7582, 16745, 14645, 9417, 10045, 11837, 9051, 9823, 13411, 10413, 12810, 13387, 8550, 15027, 9258]
                }
            }, {
                "name": "Images/resultImages/2007_001377.jpg",
                "overallDistScore": 45.045837,
                "backforegrounddistance": 6.530697,
                "colordistance": 8.424117,
                "semanticcolordistance": 0.82508194,
                "shapedistance": 12.965799,
                "HighLevelSemanticFeatureDistance": 17.125225,
                "mainFeatures": {
                    "shapesemantic": ["sheep", "bird", "dog", "bird"],
                    "Shape": [1, 1, 0, 0, 0, 2, 2, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 5, 1, 2, 2, 1, 2, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 4, 3, 2, 4, 2, 3, 2, 3, 3, 1, 7, 2, 2, 2, 1, 1, 1, 1, 1, 3, 1, 3, 2, 0, 2, 1, 0, 0, 0, 1, 6, 0, 0, 1, 2, 1, 0, 1, 2],
                    "Color": [30, 10, 19, 11, 14, 19, 22, 18, 14, 17, 19, 17, 15, 17, 16, 17, 18, 17, 14, 17, 14, 47, 16, 18, 16, 15, 16, 18, 16, 14, 15, 16, 14],
                    "BackgroundForeground": [[2, 1, 2, 0, 0, 1, 1, 0, 0, 7, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0]],
                    "HighLevelSemanticFeature": [0.2576494, 0.55813414, 0.7517105, 0.5552908, 0.56335247, 0.010430046, 0.069279626, 0.49261338, 1.7184484, 0.611019, 1.292354, 1.1734012, 0.10271381, 0.5953151, 0.93816274, 0.6822498, 1.4616543, 0.7433526, 0.007131158, 1.5476171, 0.65786767, 1.7246394, 1.1710927, 3.7068112, 1.0074116, 0.42630982, 0.43063277, 1.1587687, 0.7058527, 0.9275709, 0.22783425, 1.3820639, 1.0119027, 0.9948896, 0.4218806, 2.2039113, 0.78512245, 0.88893306, 1.6796645, 0.22945112, 0.092266634, 0.013343744, 0.005610746, 0.8812375, 1.0816249, 1.057351, 0.025230514, 1.6416172, 2.1540754, 1.4576366, 0.80770373, 1.4148047, 0.46849048, 0.12127462, 2.294176, 0.54585415, 2.4501853, 0.3751584, 0.061793774, 1.56804, 0.64484453, 0.1119329, 0.3109485, 0.22645323, 0.6315488, 0.48581555, 0.8302999, 0.020066904, 0.31070152, 0.17957674, 0.93724775, 0.28578302, 0.45163718, 0.08753326, 2.6764398, 1.4264373, 1.7891794, 0.6868299, 0.23808078, 0.7425332, 0.12997049, 0.26053193, 1.7156137, 0.11087491, 1.67878, 0.81940126, 0.5658845, 0.05839384, 0.35380632, 0.2177233, 1.384139, 0.5631534, 0.25449246, 0.5024873, 1.2131824, 1.237979, 0.6432491, 1.3495383, 1.6688648, 1.3116779, 1.1449566, 0.29611227, 0.08737081, 0.7699091, 3.4389982, 0.26166195, 0.83204746, 0.034651197, 0.46358362, 3.3613503, 0.13425462, 1.230457, 1.1721795, 0.43515092, 0.93280786, 0.032624226, 0.88909125, 1.0129719, 1.2920065, 0.24604952, 1.1334312, 1.7371871, 0.14949937, 0.036869917, 1.2636852, 0.11904082, 1.5439204, 0.55463225, 0.42758676, 0.14262122, 0.4180372, 0.9949778, 0.02313586, 1.8881596, 1.08248, 0.077140756, 0.8457527, 0.76846105, 0.58843625, 1.3014725, 0.5553915, 0.025987102, 2.0101159, 0.3170654, 0.0056035724, 0.06184971, 0.70478296, 0.040535446, 0.32104966, 1.6074597, 0.38295937, 0.6691712, 0.04950213, 1.2524173, 2.3116362, 0.18913458, 0.585706, 0.656044, 0.25656164, 1.585845, 0.9142795, 0.67263436, 1.8090671, 1.4523442, 1.9410372, 0.17535406, 0.18120582, 0.52650565, 4.594686, 0.4719851, 0.7221929, 0.08610183, 0.05686553, 0.31908205, 1.0746703, 0.39016312, 0.5742623, 0.046476014, 2.8400292, 0.016157681, 0.05695734, 0.12155769, 3.9673495, 1.3570207, 1.9976425, 2.8464694, 0.63959265, 0.4752974, 0.23933138, 1.3225404, 0.70696366, 0.7519037, 0.7832865, 3.3744078, 0.043310467, 0.061163984, 0.28359476, 0.55685407, 0.85336185, 0.36073676, 1.1926905, 0.48022807, 1.3708384, 2.057024, 1.4554082, 1.001913, 0.4099614, 0.14458552, 0.20351093, 1.9192474, 0.55556226, 1.5322427, 0.66946816, 0.7957944, 0.4274818, 0.47660485, 0.6144401, 0.034776267, 0.2792757, 0.33465838, 0.742949, 0.77473706, 0.70782983, 0.81749743, 0.08126484, 0.3957855, 0.5372146, 0.40500027, 0.37716296, 0.5791113, 0.3259023, 0.5395535, 0.058056295, 0.43931645, 0.0931001, 0.6228208, 0.15920009, 0.43126005, 0, 0.11710654, 0.8726773, 0.4904197, 0.8515031, 1.7654408, 0.60394377, 0.81094766, 1.6743091, 0.13367677, 1.4142058, 0.87044144, 0.34185234, 1.2718495, 0.09545655, 0.14645265, 2.0106025, 0.5205385, 2.7965107, 0.243421, 0.9431238, 0, 0.101727955, 1.2295071, 1.4448944, 0.17406768, 1.5970067, 1.380928, 0.60859257, 1.6333588, 0.89699596, 0.00412972, 0.3552996, 0.24505961, 2.909774, 1.5323398, 0.0024223304, 0.38233817, 0.018271161, 1.5726944, 0.4424672, 0.19260158, 0.116754785, 0.23860767, 0.17034633, 1.5051978, 0.837585, 1.8726492, 1.6578205, 0.38048697, 0.36590838, 0.16443546, 0.78521264, 1.218315, 0.034072775, 1.8199688, 2.9445791, 0.8022704, 1.1941644, 0.8169487, 1.6811632, 1.3839585, 0.378294, 2.2802136, 0.15906899, 0.33964765, 0.45181143, 0.037132908, 0.27850115, 1.350888, 0.22398077, 1.3743056, 1.2483021, 0.99092627, 2.5630944, 0.9164263, 0.6763141, 1.1106069, 0.3169682, 0.12267366, 0.40432727, 0.34674284, 0.55550045, 1.97007, 1.3588825, 1.506373, 1.1939133, 0.99590284, 0.86627555, 0.10379894, 0.25895447, 0.813918, 0, 0.09650105, 0.23831889, 0.18318851, 2.482037, 0.22094835, 0.8450476, 0.37838107, 0.9000044, 0.37150654, 0.52152044, 2.0874486, 1.2055509, 0.97479457, 1.6732306, 0.0680186, 0, 1.2892839, 0.73543566, 1.6763346, 1.3005866, 0.1802319, 0.24727403, 0.5168438, 0.13883789, 0.19974573, 0.1616781, 0.3665436, 2.4312665, 0.1558421, 1.1743293, 0.10626527, 0.3186272, 1.3256112, 0.6318261, 0.78264034, 1.2985886, 0.965859, 0.20262678, 0.78149027, 0.6666291, 0.33456844, 0.6172088, 0.23923256, 0.988381, 0.10892903, 0.6190168, 0.14986783, 0.9944998, 1.1900302, 0.006989383, 0.6327565, 2.980322, 1.6199951, 0.76325047, 0.13415618, 0.34205753, 3.8954983, 0.5218676, 0.47758928, 0.82093066, 1.6543381, 1.3029821, 0.92158514, 0.80046666, 1.3647493, 0.56198436, 2.258289, 1.2791786, 0.54866743, 0.30367887, 0.6903409, 0.25539148, 0.20368882, 0.20258693, 0.6194292, 0.24899922, 0.39733514, 1.5173123, 1.9377445, 0.012068697, 0.7494797, 2.213903, 0.07402266, 0.79379416, 1.9629776, 1.7916515, 0.698979, 0.29868382, 0.48202488, 0.030747041, 0.36671358, 0.8423566, 0.1718275, 0.38738212, 0.69285506, 0.70832115, 0.9293126, 1.099211, 0.14014064, 0.47731823, 2.8879862, 0.4968024, 2.3218234, 0.064214505, 1.7935083, 1.0054562, 0.38115096, 0.8651664, 0.032153938, 0.69832224, 0.07866717, 0.23849876, 0.37360114, 0.22588056, 0.13565046, 0.3387185, 0.44939154, 0.9432046, 0.2050665, 1.0663656, 0.01360921, 0.48336485, 1.4499602, 1.5359902, 0.5527897, 0.9723109, 0.13563542, 0.45873728, 0.45300588, 0.123097695, 0.22493517, 0.7761164, 0.3388886, 1.7863154, 0.53085554, 2.613568, 0.32263377, 0.32210925, 1.0272355, 0.46856228, 1.7766201, 0.00090325973, 1.208627, 0.2940345, 0.1559944, 0.30760515, 1.1701657, 1.6708685, 0.14713766, 2.7984443, 1.4147156, 0.7545331, 0.5766334, 0.16878022, 0.22250472, 3.188693, 0.19332716, 0.3751028, 0.024694627, 0.42109275, 0.059975754, 0.25683653, 0.08800774, 0.23535107, 0.013858764, 0.29863513, 1.1080458, 1.2307155, 0.94135356, 0.17656398, 0.13041753, 3.2009337, 1.008949, 0.21246578, 0.8525797, 0.31926057, 0.81195647, 1.1951712, 0.47916105, 1.8662522, 0.30521077],
                    "colorSemanticData": [7695, 9204, 7490, 8035, 20614, 7244, 14392, 10538, 7762, 10010, 13587, 11443, 12847, 23565, 2811, 15763]
                }
            }, {
                "name": "Images/resultImages/2007_001288.jpg",
                "overallDistScore": 40.838646,
                "backforegrounddistance": 7.1972213,
                "colordistance": 5.0181246,
                "semanticcolordistance": 0.84166664,
                "shapedistance": 14.343001,
                "HighLevelSemanticFeatureDistance": 14.2803,
                "mainFeatures": {
                    "shapesemantic": ["aeroplane", "aeroplane", "aeroplane", "aeroplane", "bird", "aeroplane"],
                    "Shape": [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 2, 3, 5, 0, 3, 4, 1, 7, 0, 1, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 3, 0, 1, 0, 0, 0, 0, 0, 0, 5, 1, 3, 2, 1, 4, 4, 4, 4, 1, 6, 1, 1, 2, 1, 6, 5, 2, 3],
                    "Color": [25, 14, 23, 16, 14, 15, 15, 14, 15, 16, 15, 15, 17, 15, 16, 15, 15, 16, 16, 16, 17, 33, 16, 19, 12, 16, 16, 27, 16, 12, 19, 15, 15],
                    "BackgroundForeground": [[53, 2, 16, 6, 0, 3, 11, 29, 9, 21, 2, 6, 48, 8, 3, 3, 8, 62, 8, 11]],
                    "HighLevelSemanticFeature": [1.4475453, 2.3397515, 1.3917613, 0.24811687, 0.68027115, 0.04911411, 0.8684914, 4.1981845, 0.321074, 0.62842816, 0.1931516, 0.96500057, 2.635049, 0.24947536, 0.31128168, 0.776493, 0.46787617, 0.549981, 1.3351765, 0.46000776, 0.71356916, 0.7814186, 1.3663142, 2.8182034, 1.259264, 1.4819707, 0.9935106, 0.55581933, 2.4049869, 0.27182454, 0.028443798, 2.50014, 1.4303294, 1.4865816, 2.4834013, 1.4294113, 0.9999212, 0.22127658, 0.13473678, 0.54126674, 0.19455014, 0.7903532, 0.040681407, 0.880115, 0.14165722, 0.66810405, 0.37360433, 0.13894846, 0.2477995, 0.39383167, 0.38058114, 0.7208232, 0.6564104, 0.26565614, 0.49052173, 0.09250814, 3.3940368, 0.013475769, 1.6776862, 2.9725394, 0.74752295, 0.42708004, 0.43898892, 1.1108618, 0.42016166, 0.63688517, 0.91831565, 0.20785655, 0.016321857, 0.6992722, 1.6560256, 0.037944473, 0.692211, 0.5525476, 0.16783424, 0.9306292, 0.9526543, 0.20249587, 0.44570613, 1.8229887, 0.90326667, 0.54394233, 0.0898121, 1.0287892, 0.44403774, 2.1272528, 0.22534238, 0.00095161004, 0.7360182, 0.4450705, 2.5616422, 1.5107478, 0.31528655, 0.062256288, 1.6766057, 0.23107466, 0.18372422, 0.59856135, 0.53105557, 0.27137664, 0.3706978, 1.0750684, 0.49464318, 0.18672588, 2.4902306, 0.344157, 0.5201571, 1.0920022, 0.9556719, 1.6867726, 0.22872823, 0.8091777, 0.9339683, 0.541047, 1.0443106, 0.25636905, 0.34968647, 0.78132915, 0.21333128, 0.7527546, 0.62657374, 0.51751137, 1.0483148, 0.2594807, 0.4973526, 0.008543944, 0.1338608, 0.51482373, 1.573164, 1.0135298, 2.2613738, 2.3567364, 0.48434338, 0.25772828, 0.0014876334, 0.9525475, 0.20646848, 0.39276272, 0.07681944, 0.52833, 0.69026303, 0.279709, 2.5105004, 0.73439515, 0.46508905, 0.58350444, 0.4117771, 0.17412765, 1.4075308, 3.0798612, 0.060255677, 0.37661892, 1.0617177, 0.04307737, 0.35504058, 0.07822782, 1.8708347, 1.3422164, 0.39866287, 0.65688705, 0.13523082, 0.45890996, 0.3523535, 0.26437172, 0.69627386, 1.192094, 0.59413534, 0.23885605, 0.4098681, 0.026573356, 0.42597228, 4.578426, 1.1444464, 0.54241973, 0.6542845, 0, 3.461067, 0.1421755, 1.1456003, 0.29870063, 0.14091212, 0.07756365, 6.390977, 1.2565219, 1.9452269, 0.057433926, 0.33882177, 0.30726713, 0.16366176, 0.08426494, 2.6066706, 0.39941296, 0.22278832, 2.5878193, 0.91528136, 1.1089007, 0.0024252243, 0.43648455, 0.03371569, 1.0568234, 0.8179876, 0.13328224, 1.5596005, 0.79195714, 0.28613085, 2.1196754, 2.5694792, 0, 0.47365236, 1.8036981, 0.056961667, 4.4244857, 0.77856517, 0.49011603, 2.536189, 0.90838194, 1.5108132, 0.2731999, 1.2648882, 0.49753344, 3.4457157, 0.21032125, 1.4373267, 0.23015374, 0.41560006, 0.20242925, 3.4749796, 1.1758183, 0.027935563, 2.132584, 2.3340054, 0.70698875, 1.1752216, 1.0504874, 0.759741, 0.36182213, 0.070039794, 1.1826844, 0.18506318, 3.383184, 0.24642698, 1.367278, 2.050313, 0.2972446, 0.039646324, 0.33493948, 1.2447442, 0.9091777, 1.3031988, 2.3157828, 0.43951365, 0.6779396, 0.28886226, 0.40774858, 1.6873974, 2.1974378, 0.2967234, 0.76539284, 0.63340133, 1.6636457, 0.33638012, 0.66951513, 0.98148024, 0.5061329, 0.15372072, 1.937767, 0.29261675, 1.0529368, 0.6114471, 1.5119201, 0.4615595, 1.4017172, 0.29230604, 0.5307181, 0.13095912, 0.038699083, 0.59218067, 1.6558827, 1.5273658, 0.30587104, 0.19588058, 0.17021409, 0.06019575, 0.23945764, 0.7782789, 0.010937979, 1.0760556, 0.2562431, 1.1366278, 0.23741342, 2.709035, 1.0789504, 0.28720134, 1.6155145, 0.6417268, 0.7544724, 0.44288892, 0.47398654, 0.9063512, 0.8950393, 0.072182015, 0.37573737, 0.10510626, 0.54297113, 0.9536766, 0.75961936, 0.16350129, 0.16890661, 0.09732637, 0.27160585, 1.5082287, 0.67839736, 2.7547238, 0.26290444, 0.7635012, 1.0345411, 0.12700668, 0.0038493865, 0.7895363, 1.4899063, 0.0014603034, 2.9346447, 0.6493349, 0.568756, 2.0742824, 0.29286793, 0.3300334, 1.2813137, 0.7559184, 1.0006458, 1.6660265, 0.7239011, 0.16278265, 0.106671676, 0.05211266, 0.6153545, 1.8120989, 0.36649197, 0.25201327, 0.7611306, 0.54609585, 2.0123303, 0.44939464, 0.3623531, 0.80888337, 0.001750215, 0.081714466, 1.3600017, 0.3087612, 2.0775042, 0.074841075, 0.45504344, 0.37121412, 0.6478641, 0.72258633, 0.23684755, 0.23784848, 0.50912136, 0.2262848, 0.77201605, 1.285291, 0.019452808, 2.0792122, 0.64185214, 0.13132648, 0.07049058, 0.23833509, 0.6702337, 0.4457478, 0.55519444, 1.2986363, 0.6469814, 0.8760123, 0.30234027, 2.746474, 0.67212594, 0.19898786, 0.50873506, 1.3279123, 0.10446408, 0.64921176, 0.25997153, 0.2845685, 1.782818, 2.0404294, 0.471266, 0.8217245, 0.5463183, 0.4350231, 0.7155593, 0.15506573, 3.3543384, 0.41561407, 0.06374687, 1.9491493, 1.6824595, 0.097170934, 0.6216185, 2.3010466, 0.99106044, 0.21177983, 1.1911566, 1.4385482, 0.7879615, 0.5541529, 1.3580703, 1.1867417, 0.8171108, 1.4441175, 0.6241401, 0.11844448, 0.60169, 1.0869025, 0.66364545, 0.6579028, 0.5497481, 0.21985249, 3.1682, 0.7877103, 0.57225144, 0.6342698, 1.2170655, 1.400392, 1.1436403, 0.6141934, 0.34327623, 0.067219555, 0.7325321, 0.45952356, 0.81230134, 0.6447923, 3.793174, 0.19588491, 2.4857018, 0.6066952, 3.0301085, 1.3108095, 1.7997645, 0.38952458, 0.99641216, 0.7960498, 0.7917906, 0.040205427, 0.02384903, 0.44704318, 0.21062334, 0.21444911, 0.16855577, 1.6192524, 0.20371251, 0.015353538, 0.07491621, 0.02062438, 1.6411787, 0.58074945, 0.44179964, 1.5534312, 0.4737883, 0.1452078, 0.15025353, 0.19990176, 0.6251992, 1.5277476, 0.13052016, 0.031532038, 0.6283144, 0.35803005, 0.89965284, 0.480507, 1.6758621, 1.3490037, 2.049481, 1.9183425, 0.26596645, 0.24738275, 0.2780167, 2.96841, 2.254615, 2.6009943, 1.0059001, 2.1265588, 2.492738, 0.20693472, 2.6330595, 0.26550055, 1.0733807, 2.0953786, 2.5006032, 0.23950565, 0.5570554, 0.046510093, 0.40782893, 0.4755766, 1.3511248, 0.48395285, 0.054386944, 0.33246294, 1.1614242, 0.2901771, 0.65687186, 0.67009026, 0.43108064, 0.33829927, 0.9365774, 0.04029872, 0.56006837, 0.7136588, 0.6298559, 0.7233541, 0.2152253, 1.5866045, 1.0900764],
                    "colorSemanticData": [8882, 16509, 7437, 17009, 4887, 12043, 11348, 13109, 3788, 12568, 10443, 15918, 5697, 9990, 13029, 8343]
                }
            }, {
                "name": "Images/resultImages/2007_000033.jpg",
                "overallDistScore": 0,
                "backforegrounddistance": 0,
                "colordistance": 0,
                "semanticcolordistance": 1,
                "shapedistance": 0,
                "HighLevelSemanticFeatureDistance": 0,
                "mainFeatures": {
                    "Shape": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 3, 3, 0, 6, 2, 0, 2, 1, 3, 0, 1, 1, 0, 3, 0, 0, 0, 2, 6, 4, 3, 3, 1, 7, 2, 3, 4, 3, 4, 6, 3, 4, 2, 4, 5, 4, 5, 3, 5, 4, 2, 3, 4, 1, 2, 4, 2, 6, 4, 2, 2, 2, 2, 4, 3, 3, 2],
                    "Color": [44, 10, 29, 19, 19, 18, 17, 12, 14, 8, 16, 17, 15, 14, 16, 15, 15, 16, 16, 12, 18, 30, 15, 17, 16, 16, 15, 33, 16, 14, 16, 15, 16],
                    "BackgroundForeground": [[28, 1, 12, 5, 8, 25, 5, 29, 1, 38, 13, 6, 14, 11, 4, 9, 4, 15, 4, 17]],
                    "HighLevelSemanticFeature": [0.13417432, 0.3165778, 0.2437123, 1.5262407, 1.4064927, 0.50975007, 1.444305, 0.6721891, 0.8563375, 1.1534377, 1.426978, 1.1115645, 0.39491618, 0.15237866, 1.1300813, 0.65488034, 0.6644389, 0.9068377, 1.6630446, 0.32811168, 0.9345322, 0.07145657, 2.2088957, 3.009502, 0.37803587, 0.3366922, 0.24657898, 0.14506777, 1.3957828, 1.2302271, 0.2510634, 2.3041425, 3.3641868, 1.1105574, 1.836179, 0.59477556, 1.8545873, 0.2389468, 1.1387305, 0.6356895, 0.81872135, 0.119935736, 1.0509703, 0.29590678, 0.10245019, 0.17223644, 0.8450201, 0.4007415, 1.9573154, 0.0034716835, 0.5321065, 0.8101708, 1.0503889, 0.36398005, 0.41409254, 0.16350475, 3.7543516, 0.15553688, 0.383009, 2.924513, 0.36985144, 0.22453193, 0.13044521, 1.4724661, 0.0072516026, 0.07034029, 1.2024413, 0.47381473, 0.31773356, 0.29558375, 0.18222499, 0.060184907, 2.5056038, 0.3680912, 0.5545287, 2.5041356, 0.7082311, 0.47385383, 1.32732, 0.32953757, 1.6582143, 1.0353364, 0.23137501, 0.29778922, 1.3264033, 0.39014763, 1.4729407, 0.32505846, 1.1224381, 1.6986518, 2.5374095, 0.42544645, 0.052697916, 0.10615979, 0.6714378, 0.50441694, 0.041194778, 0.137087, 0.6517743, 0.4502437, 0.0061159716, 1.6209366, 1.4007274, 0.83198404, 3.6215153, 0.22486997, 1.5182809, 0.37057364, 0.15842874, 2.0611598, 0.6901731, 0.93359274, 4.2094297, 0.5740207, 1.1700377, 0.59628767, 0.5918342, 1.1850839, 1.072855, 0.33465576, 0.4849387, 0.6542298, 1.4423542, 0.054369975, 0.32754087, 0.047022216, 0.14346153, 0.11287226, 0.8919367, 2.1713593, 1.3856413, 2.971364, 0.30077574, 0.48583424, 0.26117367, 0.3520756, 0.050783332, 0.2225501, 0.14706738, 0.40489888, 0.8980472, 0.738189, 1.9582694, 0.28015548, 0.8000936, 0.17551106, 0.6268896, 0.28227425, 3.3616138, 0.7066239, 0.18524376, 1.3275038, 0.58629227, 0.48069817, 0.636809, 2.625243, 2.7087145, 1.446348, 0.032077108, 0.29861516, 0.5327634, 0.9603228, 0.25173998, 0.2304939, 0.6946253, 0.11623837, 0.88346845, 1.3494307, 1.0650166, 0.39193177, 0.9255986, 0.7514267, 0.2215445, 1.5829711, 0.7125984, 0.4077804, 6.2639103, 0.9831596, 1.6430037, 0.60372967, 0.51031905, 0.05616463, 3.0314014, 0.08554895, 0.9632392, 1.0924165, 1.2118535, 0.6674497, 0, 0.055786736, 3.0893848, 0.73062, 0.22923431, 1.294957, 0.12634225, 0.29567984, 0.00045749362, 0.90293604, 1.1336813, 2.295568, 0.1326041, 0.70346755, 1.6283919, 0.18554148, 0.25724706, 1.7473501, 1.2350985, 0.09508925, 0.8873169, 0.11259042, 2.5130134, 3.3950024, 0.19718261, 0.19067211, 3.8789153, 0.79422855, 1.1947956, 0.6749642, 2.207293, 0.018641248, 2.4563057, 0.45531437, 2.0450442, 0.025446534, 1.4939443, 2.3962119, 1.9073858, 0.8578678, 0.008155464, 0.1750223, 1.1650717, 1.2809038, 0.17729598, 0.34871086, 1.2253766, 0.29407918, 0.52817804, 0.22815007, 0.1658722, 0.7468163, 0.9911004, 0.25189623, 0.48227498, 0.92913264, 0.27756393, 0.4394679, 1.4433386, 0.774574, 1.0052154, 0.27512485, 0.22350994, 1.632156, 0.49854013, 0.56860775, 3.5307026, 0.05248744, 0.74836475, 0.15187798, 1.1634339, 0.78868943, 0.52745324, 0.7565697, 0.014616184, 0.54537755, 0.39749205, 2.147668, 0.56728286, 0.020096723, 0.6352508, 0.72487164, 1.8776976, 0.10859038, 0.30080047, 0.069442116, 0.093981326, 0.31701306, 0.19449487, 0.37388486, 0.7332125, 0.7979812, 0.108584255, 0.12032223, 0.40830132, 1.0743083, 0.02633976, 0.019915916, 1.4506049, 0.5036461, 1.2377796, 0.77524126, 3.1468444, 0.14644726, 1.0389265, 1.8406501, 0.72651714, 2.2442946, 1.0323849, 0.082553826, 1.01551, 0.5530909, 0.050997198, 0.09479195, 0.08244128, 1.1417103, 0.22593796, 2.6140127, 0.9589721, 0.48959595, 0.9475473, 1.2554508, 1.3729218, 1.5097396, 2.6618726, 0.5899842, 0.18476517, 4.003844, 0.12729444, 0.6877994, 0.3544962, 0.8908805, 1.4137096, 5.0889363, 1.3340827, 0.5673622, 2.1072783, 0.15940112, 0.8305192, 0.12370259, 1.782833, 1.7716559, 1.8615148, 0.69441104, 0.43428054, 0.7900253, 0.24915244, 0.06622435, 0.84682435, 0.43612403, 0.25590727, 0.48379272, 0.14112759, 1.0013698, 0.57647336, 0.4944487, 0.047353588, 0.5608067, 1.3614285, 1.1221076, 0.54587233, 0.9174013, 0.4595484, 0.9721374, 0.4525019, 0.8022866, 0.76307064, 0.12616986, 1.1293523, 0.5481933, 0.07226221, 0.058626045, 1.182121, 0.3049224, 3.7937582, 1.1358614, 0.8885199, 0.9215256, 1.1640978, 0.6255438, 0.67640847, 0.5329732, 1.8235976, 2.975581, 1.77632, 0.29949558, 5.328487, 2.1093202, 0.6060678, 0.95486367, 0.61547834, 0.23108412, 0.47771508, 0.23205094, 0.35474095, 2.748122, 0.9887898, 0.19339165, 0.7523055, 1.5136276, 0.14301805, 0.4284916, 0.2828223, 4.4543753, 0.26766455, 0.010433949, 1.6761379, 1.8170158, 0.015634159, 1.359665, 6.4406624, 0.49821812, 0.26052102, 0.97811073, 1.5918229, 2.9314785, 0.11940709, 2.4937496, 0.91289246, 0.5052646, 1.0570259, 1.5557936, 0.30573377, 0.2010984, 1.0580629, 0.016992956, 0.31527954, 1.6074072, 0.67578566, 1.5996093, 1.2924947, 0.35918647, 1.1237931, 1.0282212, 2.0068634, 0.21186645, 0.007607361, 3.396598, 1.2517946, 0.27670404, 0.057800896, 1.344794, 0.6748713, 3.5209532, 0.8754264, 0.83647645, 0.0044622505, 2.612384, 1.9610473, 0.5774252, 0.5700759, 0.7489335, 0.43548647, 0.75844854, 0.028012976, 0.012292481, 0.2743118, 0.26243347, 0.28077152, 0.29071727, 0.83488697, 0.97113067, 0.47214672, 0.8822286, 0.5335133, 2.860959, 0.4651023, 0.21292864, 3.3904886, 0.23293827, 0.24709366, 0.021242691, 1.1073655, 0.03169901, 2.0860572, 1.1162983, 0.6832839, 2.5090554, 0.5634816, 1.0167576, 0.9874533, 1.0285108, 0.8433549, 2.0437036, 1.2717632, 1.8204656, 2.3268688, 0.5895505, 0.5910475, 0.8953718, 0.54868144, 1.742569, 3.0937145, 3.457995, 1.0327309, 3.3308403, 0.30953723, 0.31015438, 4.1659336, 0.874247, 0.017928343, 0.89128286, 0.22233714, 0.221303, 0.27198014, 0.1330483, 0.5253185, 0.2956858, 0.881125, 1.4633917, 0.013840684, 0.2913416, 0.68598884, 0.18848242, 1.1627477, 1.3974667, 0.21483739, 0.29339492, 2.2350166, 2.3557854, 2.8461149, 0.6025131, 1.0881437, 0.63930666],
                    "colorSemanticData": [10832, 12693, 11525, 11222, 13995, 11157, 10727, 12614, 8054, 11398, 12601, 12139, 10844, 10008, 12608, 10583]
                }
            }, {
                "name": "Images/resultImages/2007_008596.jpg",
                "overallDistScore": 42.864014,
                "backforegrounddistance": 5.611595,
                "colordistance": 4.903501,
                "semanticcolordistance": 0.7800328,
                "shapedistance": 13.308141,
                "HighLevelSemanticFeatureDistance": 19.040775,
                "mainFeatures": {
                    "shapesemantic": ["person", "horse"],
                    "Shape": [0, 0, 0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 3, 5, 3, 3, 3, 2, 6, 6, 6, 4, 1, 2, 5, 4, 1, 3, 1, 5, 4, 1, 5, 3, 2, 4, 2, 6, 4, 3, 4, 4, 3, 2, 3, 5, 0, 7, 5, 1, 2, 1, 7, 2, 0, 4, 1, 7, 1, 2, 3, 0, 5, 1, 3, 4, 0, 6, 3, 1, 4],
                    "Color": [46, 17, 26, 26, 15, 21, 14, 18, 15, 17, 10, 16, 11, 16, 12, 17, 14, 18, 14, 15, 14, 21, 14, 25, 18, 16, 14, 27, 16, 13, 12, 16, 14],
                    "BackgroundForeground": [[1, 8, 4, 4, 11, 14, 10, 9, 8, 4, 5, 9, 15, 8, 5, 5, 1, 3, 6, 0]],
                    "HighLevelSemanticFeature": [0.15893953, 0.13480344, 0.8872132, 0.38924423, 2.030079, 2.7817094, 0.39453325, 0.686865, 0.69966424, 0.81296587, 1.1508448, 1.8633788, 2.0194185, 0.33284172, 1.2416794, 1.2502825, 0.38406202, 0.20470186, 1.5292567, 1.0807672, 0.6347319, 0.28733528, 2.1827905, 1.1913214, 0.46152505, 0.7409234, 1.4193336, 0.25428948, 0.3513818, 1.6669347, 0.7012804, 0.17149214, 0.07002918, 1.8270274, 0.3743228, 0.05952697, 1.4236833, 0.45196226, 1.2718097, 0.74648917, 2.2907777, 0.2880876, 2.9218016, 2.9797878, 0.5462502, 0.0015644127, 0.72464293, 0, 0.026166279, 0.2393951, 0.45273834, 1.1925706, 0.12698525, 0.30435058, 2.6736355, 0.23775475, 0.83399093, 0.023205468, 1.0003327, 0.10803449, 2.367735, 1.9172298, 2.2624805, 2.8170693, 0.32383448, 1.20159, 1.1404613, 0.13944732, 0.06954535, 1.170115, 0.81498563, 0.94948435, 0.0024782978, 0.6222364, 1.3619422, 0.0061237374, 0.30406705, 0, 1.9086738, 0.59231716, 1.443746, 0.6803075, 0.56061697, 1.462599, 0.110675514, 1.5967946, 1.5488057, 1.3414038, 0.4969491, 0.75479764, 0.6581306, 0.75664645, 1.3565321, 0.87157255, 1.4547648, 0.87082136, 0.94298315, 0.5302299, 1.5442632, 0.747249, 1.381101, 0.52752525, 0.5810839, 0.8802602, 0.4963381, 1.2948253, 0.69622236, 0.56320304, 0.31562695, 1.3089861, 2.5874476, 1.246882, 0.56528944, 0.9942838, 0.44105682, 0.4590331, 0.82746965, 0.22155306, 0.20107785, 0.9066869, 3.2546272, 0.6658958, 0.7282265, 0.7312843, 1.7144763, 0.22932999, 0.70240766, 1.2374392, 2.675878, 1.2173998, 0.99349433, 0.7588111, 1.5592587, 1.522195, 0.48932788, 0.4809675, 0.9111288, 0.30049562, 1.1340919, 0.13042857, 0.87083715, 0.60601664, 0.27509114, 0.07599406, 1.8679968, 0.4472021, 0.912856, 0.2808175, 2.5323365, 0.90833706, 0.6691834, 2.0729377, 2.280234, 1.1238728, 0.3626892, 0.61038655, 0.3605637, 1.6607783, 1.219799, 1.0117638, 0.91816837, 1.2130675, 0.7243784, 1.5625134, 0.9609027, 0.018279498, 1.7764806, 1.7225374, 0.050903533, 1.556019, 0.24285713, 0.76964396, 1.33171, 1.0059847, 0.79663414, 0.034643155, 1.1239601, 2.2535424, 0.33880556, 0.15963395, 1.97055, 0.7618497, 2.2548797, 0.6353051, 1.8866577, 0.7040632, 1.0158947, 1.3274434, 1.1051389, 2.6879547, 0.50374305, 1.0809822, 0.5443026, 2.6951103, 0.04438463, 0.11195412, 1.5534126, 2.5135689, 0.71590847, 0.28061515, 0.57507, 1.5190567, 4.3983493, 1.3654312, 2.0129774, 0.65356344, 0.11347319, 0.6239091, 0.6356703, 0.30291423, 0.56080073, 1.7358112, 1.8333038, 0.038471617, 0.35068, 0.054099083, 0.60708153, 1.4635973, 0.7784638, 0.5286994, 0.04721627, 2.1744502, 0.06980802, 0.05703888, 0.77689105, 0.87927467, 2.8652294, 1.8414285, 1.2999432, 0.4429058, 1.6190113, 1.1836506, 1.4607528, 1.0152513, 0.9768527, 0.3717349, 0.80569017, 0.92135805, 0.36150527, 0.44846115, 0.48795953, 1.3740709, 0, 0.33084542, 0.44956005, 0.23126203, 1.7445754, 0.12513655, 0.18693478, 0.5155095, 0.59021455, 0.13746256, 1.0420763, 1.2615359, 1.3940192, 0.6157015, 0.035427272, 0.127193, 1.4239136, 0.12992695, 1.4487293, 0.7028568, 0.21203323, 3.0108786, 0.6412749, 1.0943322, 1.6766262, 0.09206803, 0.3640998, 0.1816553, 0.11316045, 2.67106, 0.35276973, 0.05213791, 0.513406, 2.6702607, 0.8152029, 1.0308614, 1.2568973, 2.2803957, 2.6538267, 0.35239166, 1.4886277, 0.6093229, 1.762075, 1.5517915, 0.18871199, 0.5561332, 0.71761966, 1.1495652, 1.6391845, 0.36035833, 3.1538515, 0.713712, 0.77921695, 1.123507, 0.10675538, 0.5058421, 0.75207293, 0.09538392, 0.21864429, 0.2423734, 0.4246156, 2.3928175, 1.3453771, 1.0939119, 1.0075011, 1.362256, 0.19283557, 3.852307, 0.25350025, 0.4776288, 2.1705055, 0.20615368, 0, 0.87553525, 2.2964785, 0.087818205, 0.6649996, 0.051106278, 1.0120856, 0.57455933, 0.090065345, 0.04759841, 0.6865957, 0.53164905, 0.23284285, 0.030770347, 0.31671712, 0.67867833, 2.612658, 1.4956053, 0.10590551, 0.6597527, 0.19810602, 0.61586905, 0.3398347, 0.25759768, 0.079933494, 0.121862434, 0.30538738, 0.7825154, 0.09495872, 0.117659956, 1.6163961, 0.30477348, 1.9664296, 0.9877777, 0.18226382, 3.0665722, 0.9548439, 0.16167928, 0.50797826, 0.29386193, 1.9634922, 0.24531756, 1.0036829, 1.7342525, 0.059392754, 0.6517652, 0.01016693, 0.6854604, 0.2629887, 0.0473822, 0.13233528, 1.0523624, 0.8429833, 2.1551604, 0.2664015, 0.29694968, 2.854896, 2.4349883, 0.6100124, 1.5158976, 3.62676, 4.146259, 0.30307928, 1.8615153, 1.1767066, 1.3549023, 0.21445464, 0.6755656, 1.842417, 1.4315119, 1.6507121, 1.028769, 0.27024361, 0.001305152, 0.05127971, 1.3708577, 0.822185, 0.6946581, 1.7234432, 0.18593065, 0.55424374, 1.3066417, 0.42476764, 3.6254518, 0.60787266, 0.0690166, 2.2950342, 1.0577329, 0.26812026, 0.14852059, 0.1970417, 0.35397983, 0.8370882, 0.46152714, 0.7301547, 1.7809778, 1.1012026, 0.6490395, 0.9063818, 0.008643464, 0.8435127, 0.6052604, 0.8788825, 0.007900901, 0.45329106, 0.32467133, 0.2853507, 1.0553648, 0.6820316, 0.8247421, 1.0153724, 0.41151837, 3.185957, 1.9421396, 0.04452893, 0.44807836, 0.5972039, 1.0680587, 1.3474005, 0.6101745, 0.026804266, 0.82269967, 1.0139934, 0.8041792, 2.2308137, 0.23718785, 0.5598112, 0.18032037, 0.18406612, 2.154399, 0.6453539, 0.9481693, 0.8454883, 0.4197961, 0.27651027, 0.12158315, 1.0117743, 0.8120296, 0.6350166, 0.6968913, 1.5553908, 0.45902568, 0.11953894, 2.2785707, 0.26462755, 0.028693415, 0.20902099, 0.5630037, 0.835749, 0.8293483, 0.0649183, 0.819752, 0.19253367, 0.41875878, 0.9547275, 0.094299, 0.88581944, 0.75647485, 1.2309674, 0.5963616, 1.2511138, 2.7459617, 0.40459287, 0.22679737, 0.06863401, 0.0040747463, 0.3028311, 3.3478642, 0.75019425, 1.0605199, 0.3333005, 2.2522032, 0.42254546, 1.5977545, 0.22320823, 1.5698338, 0.10106592, 1.0548168, 0.82115406, 1.528454, 1.4521481, 0.54701596, 2.4165893, 0.49909627, 0.30773485, 1.1913686, 0.96787786, 0.32672098, 1.0420817, 0.020924447, 1.5654365, 0.3179469, 0.86979777, 0.7061593, 0.35409185, 0.103480235, 0.5330562, 0.6338101],
                    "colorSemanticData": [18597, 6784, 13886, 12958, 4560, 7950, 13825, 2242, 6868, 18970, 16520, 6246, 12527, 7845, 10643, 10459]
                }
            }, {
                "name": "Images/resultImages/2007_005978.jpg",
                "overallDistScore": 40.10505,
                "backforegrounddistance": 4.6743984,
                "colordistance": 4.2579017,
                "semanticcolordistance": 0.7338743,
                "shapedistance": 13.762932,
                "HighLevelSemanticFeatureDistance": 17.409817,
                "mainFeatures": {
                    "shapesemantic": ["bus", "train", "boat", "boat", "train", "train"],
                    "Shape": [2, 0, 0, 0, 1, 1, 0, 0, 1, 0, 3, 0, 0, 0, 0, 0, 1, 4, 1, 0, 2, 4, 2, 3, 2, 3, 5, 4, 3, 2, 5, 3, 2, 2, 2, 2, 4, 4, 4, 2, 2, 7, 3, 5, 2, 2, 5, 6, 4, 3, 2, 4, 5, 5, 2, 1, 3, 3, 4, 1, 0, 7, 0, 2, 1, 0, 7, 2, 2, 1, 1, 5, 4, 2, 0, 0, 6, 4, 2, 0],
                    "Color": [34, 26, 30, 20, 15, 13, 15, 15, 11, 11, 13, 17, 14, 16, 15, 15, 15, 16, 16, 16, 13, 34, 14, 13, 15, 15, 15, 30, 17, 15, 16, 16, 16],
                    "BackgroundForeground": [[16, 16, 9, 7, 1, 12, 3, 13, 10, 9, 6, 7, 25, 3, 6, 10, 9, 11, 5, 6]],
                    "HighLevelSemanticFeature": [0.8765149, 1.127095, 1.8158768, 0.723674, 1.3858047, 0.074895054, 0.8197554, 1.3875608, 0.15608239, 0.5728984, 1.0843352, 0.40536103, 0.5031822, 1.1282345, 0.5000732, 0.5643396, 0.18824741, 0.4089685, 0.26342556, 0.15532142, 1.0270588, 0.8923478, 1.0702324, 1.1788963, 0.508959, 0.49148297, 0.056410037, 1.2353957, 0.22591116, 0.23629959, 0.768798, 0.1457347, 0.53501713, 0, 0.41524288, 0.4687865, 0.24224211, 0.33139116, 0.015996156, 1.0318823, 0.23935603, 0.4124893, 0.41217425, 0.70897895, 0.13127427, 0.45721588, 1.0200888, 0.20913759, 0.7907197, 0.106395364, 0.95384854, 2.7794268, 0.77431846, 0.9464035, 0.5814403, 0.38032457, 0.41191328, 0.115916975, 0.004436225, 0.16705377, 0.27128944, 0.59572285, 0.09977865, 0.9560422, 1.802798, 0.14465317, 0.7683327, 0.22203581, 0.16404316, 0.055823512, 0.18441467, 1.2849852, 0.25707588, 0.02238555, 0.0037443954, 1.1257077, 0.0020542266, 0.6247988, 0.009998235, 0.011292645, 0.7350505, 0.6646293, 0.025687607, 0.5330328, 1.1130149, 2.3584273, 0.20585504, 0.3624381, 1.5772232, 0.37457898, 0.5304704, 0.13249567, 0.3625557, 0.010208126, 0.3926932, 0.10186621, 1.2432586, 0.49327484, 0.20179181, 1.1579833, 0.37555745, 1.1018438, 0.58101827, 0.08396862, 0.71849257, 0.5013364, 0.16485411, 0.12273549, 0.31081483, 1.1075385, 0.07344503, 1.7099469, 1.483706, 0.16197623, 0.24889858, 0.22332273, 1.1011149, 0.3465342, 0.55630016, 1.0119735, 0.40134782, 0.14999804, 0.5812225, 1.4875119, 0.07533827, 1.4317636, 0.22887321, 1.2248738, 1.04464, 0.38841587, 1.0472476, 0.012483538, 0.79302955, 0.10334602, 0.37981617, 0.19604863, 0.92187315, 0.070622265, 0.6652488, 0.85164976, 1.659193, 0.057606317, 1.595667, 1.5643426, 0.56632924, 0.29281178, 0.1790122, 0.21837974, 0.15066995, 1.3403115, 0.8555995, 0.95619357, 0.004460044, 0.22355857, 0.06561607, 0.26811242, 0.19628519, 0.72532195, 1.6370853, 0.3092504, 0.5459971, 0.65480274, 0.58238506, 1.7020687, 0.9770247, 0.41513318, 2.0180357, 0.5545031, 1.3101848, 0.11741906, 0.05704074, 0.087397546, 0.4146903, 0.4214881, 1.3849837, 0.35122806, 0.3211402, 0.00094643416, 1.0556577, 0.4019371, 0.010669514, 0.51124734, 3.194, 1.2317488, 1.3137025, 0.08053449, 0.95447177, 0.9270018, 0.071784, 0.2537886, 0.8969606, 0.03550337, 0.108632214, 1.6018168, 0.07819988, 0.36902684, 0.090041086, 0.53890353, 0.12726861, 0.69340414, 0.31365746, 0.28402254, 1.1485012, 0.029591369, 0.62049055, 0.36179754, 0.28852525, 1.3180014, 3.3981905, 2.374902, 0.13550392, 1.8332068, 0.48883492, 2.2886305, 0.008920395, 0.38507298, 0.9508818, 0.06271507, 2.3252923, 0.0074301665, 0.9321851, 0.472244, 1.0119814, 0.76208377, 0.54678506, 1.3889856, 0.9130654, 0.32632405, 0.15032096, 0.55730534, 0.0034303276, 0.7558047, 0.23287012, 0.24228369, 0.006209508, 0.41668624, 0.14650981, 1.2212367, 0.12779622, 0.1494835, 0.7716003, 0.49891114, 0.46173683, 0.18673056, 0, 0.9804246, 0.2503546, 0.28180978, 0.28510392, 0.40394932, 0.787268, 0.069233485, 0.07288813, 0.72815275, 1.6064352, 0.22138499, 1.4325008, 0.0064046746, 0.8737466, 1.3879347, 1.0084707, 1.4170878, 0.87927276, 0.059396345, 0.33892253, 0.8038983, 0.002489858, 0.43861604, 3.0243409, 1.3831936, 0.06296774, 0.25166312, 0.045434207, 0.23000677, 0.25753716, 2.095236, 0.5264618, 0.634163, 0.7653671, 0.10419939, 0.26452565, 0.42386183, 0.37359834, 2.140254, 0.80803525, 0.5243134, 0.74846196, 2.5234337, 1.9758749, 0.21629065, 0.6942558, 0.44614795, 0.67769444, 0.79150915, 0.00032696675, 1.073084, 0.9975833, 0.31098205, 0.20278181, 0.26885074, 0.44024447, 0.6442801, 0.0014868792, 1.9091777, 2.0391674, 0.029232547, 0.16065972, 0.2030634, 0.46485028, 0.10570816, 0.23980051, 1.8091013, 2.5115633, 0.32757825, 0.6042915, 0.35656092, 0.31860587, 0.91728467, 0.4638087, 0.20110612, 0.33105904, 0.75495094, 0.035147432, 0.9267452, 0.6506166, 1.119534, 0.036064383, 0.24703678, 1.5115179, 0.6657785, 1.2003567, 0.33104667, 0.1463291, 1.1881623, 1.0273088, 0.717942, 2.8800397, 0.7290457, 0.46649045, 0.24423105, 1.3813384, 0.5735833, 1.0271953, 0.40311214, 0.32188994, 1.5582834, 0.03177909, 0.11579491, 2.183608, 0.6355612, 0.23858058, 0.07025098, 1.2266719, 0.7649293, 0, 0.18481287, 0.42261213, 0.055122864, 0.0552127, 0.34597832, 0.2099617, 1.0584207, 0.56409204, 1.2959874, 0.408794, 0.0019665726, 1.1630268, 0.45808372, 0.0101071205, 0.42495245, 0.18048005, 0.8400527, 0.48167878, 0.05175537, 1.646227, 0.15356643, 0.45778388, 0.18983015, 0.7360047, 1.0194035, 0.15062785, 0.40884182, 1.3127862, 2.0286176, 0.64189744, 0.8636404, 1.416979, 0.2224763, 0.33259264, 1.1390002, 0.31074998, 2.9211276, 0.13230006, 2.1675618, 0.8003627, 0.5425882, 0.3762497, 0.44899982, 0.16790105, 0.46588144, 0.27153933, 0.1257632, 0.8015028, 2.7232103, 0.76273626, 0.10938118, 0.09954097, 1.2361772, 0.64424384, 1.1195501, 0.5086764, 0.89444333, 1.6670935, 0.45530057, 0.20629774, 0.024919605, 0.21172467, 0.13498186, 0.09501594, 0.71434915, 0.58953434, 2.1717532, 0.8960263, 0.5134717, 0.7342446, 0.2874479, 0.83722407, 2.8303123, 1.2163712, 0.7316264, 0.0065425737, 0.5303178, 0.06677081, 1.5953252, 0.7420212, 1.5286723, 0.5502891, 0.5956686, 0.20210202, 0.12727723, 1.9819026, 1.2747085, 0.0025165726, 0.060804278, 0.10136723, 0.8407974, 0.9719635, 0.13703896, 0.7035542, 0.16579321, 0.32124624, 0.065848455, 1.1281064, 0.30507153, 0.7612715, 0.093288094, 2.5784123, 0.051413693, 0.33215216, 0.019392207, 0.020742748, 0.14901242, 1.3309774, 0.90546805, 0.04465809, 0.46214566, 0.31502888, 0.072479784, 0.23019837, 1.6286432, 1.6773586, 1.5633497, 0.40811935, 0.63562477, 0.1627112, 1.25378, 0.02494607, 0.5821215, 0.44113812, 0.31248528, 1.6509008, 0.9843287, 0.7239172, 1.6209586, 0.08093068, 0.6402966, 2.7214358, 0.39191958, 0.08682379, 0.22976081, 0.6030178, 0.9813662, 0.029137932, 0.21030627, 0.011415104, 0.25383654, 0.0009595648, 0.16958606, 0.025548754, 0.60161966, 0.63519037, 0.58262616, 0.12908006, 0.8375382, 0.2060051, 1.294247, 0.029554915, 1.2147937, 0.14181213, 2.0058932, 1.0088983, 0.40534768],
                    "colorSemanticData": [9221, 9843, 8590, 7577, 8258, 7583, 9388, 6770, 9255, 8532, 9060, 8009, 8189, 8922, 8805, 7498]
                }
            }, {
                "name": "Images/resultImages/2007_003872.jpg",
                "overallDistScore": 44.81067,
                "backforegrounddistance": 7.0292244,
                "colordistance": 2.9542856,
                "semanticcolordistance": 0.921936,
                "shapedistance": 13.503428,
                "HighLevelSemanticFeatureDistance": 21.323729,
                "mainFeatures": {
                    "shapesemantic": ["dog"],
                    "Shape": [0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 0, 3, 0, 4, 3, 3, 3, 0, 3, 4, 1, 2, 0, 5, 1, 0, 3, 0, 4, 2, 3, 3, 2, 3, 5, 2, 4, 2, 4, 2, 5, 3, 1, 4, 1, 2, 3, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    "Color": [36, 17, 23, 16, 16, 16, 16, 15, 16, 17, 16, 16, 16, 15, 15, 16, 16, 15, 16, 15, 14, 31, 15, 17, 15, 15, 16, 30, 16, 14, 16, 16, 15],
                    "BackgroundForeground": [[0, 1, 0, 5, 0, 0, 8, 0, 5, 0, 0, 1, 0, 0, 4, 3, 0, 0, 5, 2]],
                    "HighLevelSemanticFeature": [0.27973944, 0.23560481, 0.09152935, 0.5111405, 1.8509674, 0.539718, 0.6512953, 4.8952622, 0.560565, 1.7233421, 1.1885711, 0.10877642, 0, 1.8671062, 1.4034399, 1.3837025, 0.7199395, 0.07774766, 2.0474093, 0.6111836, 1.0312388, 0.6395441, 0.20440109, 1.7121378, 0.010437592, 1.701502, 0.19696341, 2.6471996, 4.655819, 0.79759496, 1.1934726, 2.4251328, 1.648057, 0.05819077, 0.75189614, 2.3837306, 0.18394034, 0.00020512816, 1.1115863, 1.5889752, 0.9367752, 0.039708514, 0.10744069, 0.7785258, 0.22040126, 0.008234086, 0.62127066, 0.20739001, 0.33899513, 0.21116854, 0.18337862, 0.52068675, 0.0080322875, 0.0028131944, 0.88905174, 0.06017207, 7.751249, 0.010748749, 1.6709269, 0.2891658, 1.3486761, 0.9180357, 0.6931783, 1.1505761, 0.1441942, 0.95216596, 0.19073194, 1.8566116, 0.67126787, 0.9920486, 0.00754385, 1.0265689, 0.022042165, 0.0695288, 0.4420094, 0.0180556, 0.42966914, 1.1661507, 1.5611677, 1.2421362, 0, 0.35063863, 0.14624354, 5.846331, 0.25316092, 0.8555035, 1.6103117, 0.9367453, 0.06711482, 0.25162938, 0, 0.19661249, 0, 0.08692659, 0.9321233, 0.6418282, 0.21290773, 0.022168947, 1.6032308, 0.4100764, 0.6471177, 3.4876955, 0.08901244, 0.01642406, 0.93367946, 0.15093085, 0.29982105, 0, 1.2448134, 0.2514845, 0.11588395, 0.076762095, 0.45248958, 0, 0.00003129852, 0.8902768, 0.5386307, 0.9249201, 0.11133187, 0.026061144, 1.1013631, 2.4680672, 0.06518048, 0.023919852, 0.21432158, 0.35280547, 0.7937911, 1.4792084, 3.3856547, 1.0250598, 1.0338998, 0.17322528, 2.8193047, 1.964464, 1.1032789, 0.11190673, 1.502525, 0.7163669, 1.3196766, 0.37291485, 0.93660474, 1.2760462, 1.8243911, 0.43311653, 0.8599401, 0.16495253, 0.18594727, 0.1348083, 2.7550218, 0.2826757, 2.152838, 0.38846228, 1.271496, 1.2621604, 1.183714, 0.18363556, 0.748819, 0.520256, 0.2489492, 0.75668097, 2.2709627, 0.9486546, 1.3693376, 0.91590655, 0.09204391, 0.013704888, 1.9967372, 0.64506173, 3.6910875, 0.09693096, 0.9203567, 0.8700155, 1.0426185, 2.8264506, 0.5765871, 0.071263, 0.046691645, 0.16271989, 0.2595821, 0.7679027, 0.8891415, 0.6206302, 2.209761, 0.2468932, 1.7767286, 0.023987042, 0.1806856, 0.6886149, 0.036415692, 1.776494, 0.6460333, 0.28971198, 0.512381, 0.43336236, 0.11712278, 0.26752272, 0.083229475, 0.19689733, 0.021721197, 0, 0.26357037, 0.0098321, 0.180207, 0.09361082, 1.3588984, 0.2919859, 0.24208544, 0.24735917, 0.16290571, 1.8077135, 0.40685573, 1.2613136, 2.938957, 0.47559863, 1.1738298, 0.69953775, 2.1319952, 2.0130532, 0.7289343, 2.359775, 0.62096244, 0.2245441, 0.5260955, 1.0707841, 0.0029166588, 0.17757002, 0.64503, 0.22864513, 1.434441, 0.014142216, 2.1557128, 0.15320341, 1.1911553, 0.013828083, 1.4169562, 0.13306099, 2.7013884, 0.030823812, 0.059687603, 1.2089802, 0.8414765, 0.02949594, 1.2339481, 0.30555022, 1.229074, 0.26989362, 1.3815124, 0.014033667, 0.56761926, 4.420536, 0.24277724, 0.8377304, 0.06047753, 0.31915498, 0.6264312, 0.12013236, 3.898331, 0.37719488, 2.0077636, 0.08885683, 0.5440216, 0.8164663, 0.3072692, 1.5231253, 0.58928216, 1.2131864, 0.5106215, 0.42084262, 0.66448665, 0.027173731, 0.0933193, 2.3110993, 0.34088808, 1.0582609, 1.550701, 0.3157391, 0.23725356, 0.12577726, 3.2317698, 0.40059242, 6.8717074, 0.06579396, 0.10529228, 1.4192944, 0.28892705, 1.9700571, 0.21264777, 0.056170095, 0.5642621, 0.4731499, 0.118876904, 0.22971238, 0.32675588, 0.17438397, 1.3952087, 0.81563145, 0.8129714, 0.09755942, 0.15744442, 0.966249, 0.107885934, 3.7270617, 0.71309423, 0.2684701, 2.3879278, 0.97454345, 0.5393325, 0.24642964, 0.029674053, 1.9935639, 0.4557753, 0.057708118, 0.3391338, 0.245249, 1.2103338, 1.1745777, 1.1302176, 1.8407404, 0.03812275, 0, 0.01334863, 0.2570315, 0.2714818, 1.3196816, 0.4643037, 0.6954129, 3.577044, 0.3264992, 1.2110975, 0.95901763, 0.3681035, 1.2549419, 0.12735811, 1.9036202, 0.04380263, 1.0300272, 0.54508287, 0.070687234, 0.0032521973, 0.59205276, 0, 0.09458105, 0.49948856, 0.86343205, 0.35873097, 0.8694454, 1.5105203, 0.12574035, 1.1354265, 0.99693096, 1.6042715, 0, 0.37288404, 1.7641389, 0.4278306, 0.19733505, 0.6131451, 1.4636474, 0.21434714, 0.034486372, 0.0980218, 0.9680799, 2.3366835, 0.55719316, 0.030149918, 0.0009886732, 2.9054852, 0.16336885, 0.9725655, 0.45055845, 1.4184719, 1.1283337, 0.8233492, 0.37557733, 1.2935895, 2.1723814, 0.5819503, 0.04096082, 0, 0.0029068552, 0.0063839518, 1.3393455, 1.2471272, 0.035319872, 1.6129409, 1.135418, 1.2379943, 0.096125126, 0.0101301735, 0.07471427, 1.6983258, 0.38561365, 0.14770417, 1.3897048, 0.04570618, 0.2635443, 0.30631158, 0.015750827, 0.28177977, 0.197111, 0.117625706, 0.18096441, 0.6595975, 0.12327401, 0.028378779, 0.027796727, 0.3642928, 2.533885, 0, 0.51986444, 1.8415396, 0.0066249054, 0.5271702, 0.017891303, 1.1104244, 0.27659, 0.5048409, 0.38314828, 1.7104099, 0.1189285, 0.85979414, 0.06667639, 0.37194535, 1.5696728, 1.2435508, 0.05990604, 2.723341, 0.049091414, 0.36620602, 1.2636323, 0.11934544, 0.50862473, 0.2181368, 1.4748387, 0.0020482978, 1.3448076, 0.2789094, 0.2642623, 0.23128508, 0.3083953, 0.26440594, 0.046823125, 0.6015747, 0.09243564, 0.2041987, 2.3709319, 0.70611614, 0.2974077, 0.76565677, 0.18413335, 0.096116036, 0.48474884, 0.06973538, 0.48598692, 1.3886786, 1.9582453, 0.6963923, 1.2403924, 0.9249094, 0.4131571, 0.96640676, 0.06524252, 0.4703865, 0.0852779, 0.33984396, 0.8568143, 0.879027, 0.6545472, 0, 0.41121596, 0.1698909, 0.16369398, 0.36351997, 1.1613146, 0.009710279, 0.17888322, 0.011397172, 1.3323649, 1.1788504, 0.6767677, 1.1160456, 1.5881953, 0.15804689, 1.3340791, 0.6990175, 2.854536, 0.03009857, 0.08401577, 0.57189083, 0.046658453, 1.249147, 0.49349517, 2.7384813, 0.9106888, 0.47268814, 3.050166, 0.47470537, 2.005992, 0.27506217, 1.7582579, 0.03649792, 1.0523928, 0.16049777, 0.001421856, 0.08659375, 0.4958949, 0.20062046, 0.12637487, 0.039584264, 0.47117794, 2.9949765, 0.14716633],
                    "colorSemanticData": [9712, 14617, 11751, 11141, 13488, 11152, 11409, 11793, 13954, 11899, 10679, 13789, 12374, 11429, 13411, 4902]
                }
            }, {
                "name": "Images/resultImages/2007_004190.jpg",
                "overallDistScore": 42.493355,
                "backforegrounddistance": 6.140033,
                "colordistance": 5.5684695,
                "semanticcolordistance": 0.90489066,
                "shapedistance": 12.339954,
                "HighLevelSemanticFeatureDistance": 18.4449,
                "mainFeatures": {
                    "shapesemantic": ["tvmonitor"],
                    "Shape": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 4, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 0, 0, 1, 4, 3, 2, 1, 2, 0, 2, 2, 1, 1, 0, 1, 0, 0, 0, 1, 4, 2, 5, 3, 2, 4, 4, 3, 5, 3, 3, 5, 2, 3, 4, 3, 3, 3, 5],
                    "Color": [16, 11, 26, 7, 14, 14, 15, 14, 17, 18, 15, 15, 16, 16, 14, 15, 16, 15, 16, 15, 15, 31, 17, 14, 13, 14, 17, 31, 14, 16, 17, 16, 14],
                    "BackgroundForeground": [[1, 4, 3, 8, 0, 4, 4, 13, 3, 2, 0, 2, 14, 2, 0, 0, 8, 1, 0, 0]],
                    "HighLevelSemanticFeature": [0.86531633, 1.5526836, 0.7257507, 0.7098342, 1.1016585, 0.94969505, 0.89761233, 0.36256206, 0.377169, 1.099099, 1.6986092, 0.41052803, 0.31872764, 0.16617164, 0.28844142, 0.32944018, 0.13697264, 1.2269546, 0.089601114, 1.2769264, 0.10086194, 0.7988788, 0.6179162, 3.5447898, 0.099488825, 0.007187786, 0.17329824, 0.6374562, 0.14615668, 1.1358778, 0.36163887, 0.7130259, 0.81379795, 0.24623068, 0.6933461, 0.21065903, 3.0334563, 0.7800018, 0.5880006, 0.22746946, 0.009208513, 0.123667695, 0.56475544, 0.06674343, 1.448023, 0.13760464, 0.92194545, 4.8383856, 0.0985357, 0.4066491, 0.3327885, 0.8021841, 0.4089691, 1.3834449, 1.1861905, 0.2720454, 0.45064875, 0.0037239608, 0.26103452, 0.39518857, 0.3468076, 0.01413465, 0.17648733, 0.3180618, 0.20203216, 0.89236295, 1.6297772, 0.5904494, 0.3595846, 0.57077336, 0.3270224, 0.03296922, 0.937974, 0.3758024, 0.123255536, 0.534586, 0.74891585, 0.15492351, 0.45487377, 1.562617, 0.361003, 2.0846577, 1.29106, 0.845224, 0.64368063, 0.12186137, 0.023087017, 0.35701525, 0.06251247, 0.69533765, 1.4720122, 0.31525278, 0.3005884, 0.42787337, 1.3674214, 0.11174022, 2.3986244, 0.10623054, 0.8979955, 0.067318976, 0.6499609, 0.8077418, 0.44772363, 0.47932094, 1.3587229, 0.032303497, 0.2782195, 0.08886937, 0.19329706, 3.8735104, 0.054945894, 0.76631147, 0.48088384, 0.9122737, 0.28923863, 0.5049659, 1.253712, 0.29689085, 0.5060356, 0, 0.0638139, 3.1130567, 0.7070893, 0.048369516, 0.4624467, 0.0024944714, 1.476357, 0.21103005, 1.2282727, 0.01810977, 0.6251247, 0.77820796, 1.0702527, 0.35826477, 0.689121, 1.4048209, 0.42224297, 0.54165375, 0.3958299, 0.008344838, 0.77095944, 0.3913401, 0.6637754, 0.7925141, 0.8342977, 0.7541956, 0.15333025, 1.0715252, 0.040857773, 0, 0.3456861, 1.1073457, 0.461149, 0.085119694, 0.19066055, 0.15177864, 0.23510692, 0.5774844, 0.15189865, 1.3336873, 3.1553652, 0, 0.68375725, 0.42782426, 0.11483009, 0.37199232, 0.3027216, 0.36890897, 0.16794504, 0.9204028, 0.38836482, 0.61896896, 0.17847203, 1.0020491, 0.78916824, 1.709703, 0.15923005, 0.35665587, 0.80887264, 0.5010382, 0.4992021, 0.33501217, 0.36057115, 0.5263642, 0.6769546, 0.09883236, 0.4101237, 1.2199838, 0.3360588, 0.220084, 2.1091642, 0.8994875, 0.99393266, 0.61227566, 0.8505119, 0.023258755, 0.116481654, 0.6004236, 1.3442736, 1.5142534, 0.12026201, 2.8586142, 0.3513678, 1.1767724, 0.34462434, 0.474593, 0.90633476, 0.15564713, 0.92261165, 0.28173697, 0.16049363, 0.08689371, 1.2857995, 0.7202497, 0.011816735, 0, 1.7027115, 0.6284565, 0.12790707, 0.24880949, 0.66780615, 0.5418401, 1.5727037, 0.10349801, 1.4151697, 0.20463672, 0.8626093, 0.45692945, 0.10013365, 0.6638718, 0.28270793, 0.14795066, 0.3333133, 0.577608, 1.2396094, 0.13407972, 0.07006454, 0.8866047, 0.050941736, 0.42423043, 0.07089799, 0, 1.3587414, 1.0647358, 0.42020863, 0.5343428, 0.15388006, 0.12029601, 1.1695349, 0.47053644, 0.029855728, 0.29605687, 0.36143836, 0.40874112, 0.6514099, 0.9224002, 0.28947014, 0.66404927, 0.333359, 0.026387827, 0.8539457, 1.0463579, 0.5822059, 0.25190148, 0.09372314, 1.6025687, 0.31115583, 2.0322845, 0.3758016, 0.17889746, 0.86855996, 0.30166528, 0.04024464, 1.5835254, 0.13954562, 1.1827215, 0.46695828, 0.6490282, 0.22599588, 0.04054562, 0.08651454, 0.029032225, 0.5457942, 0, 0.32618245, 0.17151748, 0.54665303, 0.39747095, 0.19349001, 0.05640602, 1.2862979, 0.0105177695, 0.05417757, 1.2513083, 1.2700101, 0, 2.6808887, 0.44742456, 0.84344894, 0.46740642, 0.07318735, 0.06639687, 0.53632337, 0.23400244, 0.105007686, 0.28200772, 0.3000566, 0.18257588, 0.5704228, 0.19527112, 1.9416274, 1.8417512, 0.37340617, 0.61163414, 0.7600393, 1.8015835, 0.4154653, 0.66103536, 0.07065711, 0.5261371, 0.3209054, 0.7492764, 1.3317459, 0.45093438, 0.21139252, 0.2068281, 0.9512897, 0.8503918, 0.5494782, 0.39350945, 0.42516717, 0.7908862, 2.1684332, 0.46637696, 0.76513577, 0.47814205, 0.9843971, 0.30112192, 0.8370283, 0.049892142, 0.09659399, 0.20537555, 0.664228, 0.5251035, 1.1310833, 0.41899088, 0.35246632, 0.1527806, 0.35549048, 0.24170645, 0.3350227, 0.0824396, 0.4827539, 0.9836655, 0.21617076, 0.6734806, 1.4615936, 1.2979635, 0.23673752, 0.17137812, 1.7710292, 0.5283285, 0.5459316, 0.6409324, 4.600999, 0.22694276, 0.9758987, 0.27316535, 2.1144276, 0.4052265, 0.019000793, 0.7952487, 0.53297377, 2.0493495, 0.21443763, 0.052165322, 0.1910417, 0.4607005, 0.44636697, 1.0586996, 0.058519326, 0.48845294, 1.3975489, 1.1332381, 0.4204726, 0.28145206, 0.1276425, 0.7113093, 0.21967024, 0.664397, 1.2226101, 0.15848835, 0.38257754, 0.2898133, 1.807024, 0.16557686, 0.2408827, 0.60291725, 1.1673188, 0.7610032, 0.13745637, 1.2246288, 0.14731841, 0.91778594, 2.8800952, 0.013116442, 1.3525991, 0.20419922, 0.107949436, 0.50397635, 0.14438766, 0.667138, 0.9168465, 0.62638396, 0.3330157, 0.35907707, 0.4719421, 0.19733539, 0.3557406, 0.3745089, 0.42217204, 0.6640649, 1.2957269, 0.66494185, 0.07201282, 1.1816883, 0.30453807, 0.08158737, 0.0770503, 0.7429888, 0.14121757, 0.62859464, 0.10886621, 2.7615337, 0.66244835, 0.5678705, 0.72792214, 0.052490048, 0.93157345, 0.07886838, 0.8872867, 0.14573845, 0.10040006, 0.5219044, 1.247887, 0.61897135, 2.2606328, 0.06301292, 0.10828653, 0.27319288, 0.8504581, 0.16596246, 1.155081, 1.1111158, 0.23171863, 0.1627428, 1.272106, 0.41349897, 0.1545199, 0.75351936, 0.5828095, 1.0077897, 0.52386546, 0.2987593, 0.5128236, 1.5240076, 1.1089497, 0.107513785, 0.4959414, 1.1721847, 0, 0.7838671, 0.63042814, 1.2730846, 0.33749467, 0.001781179, 0.044137027, 0.06029139, 1.2011039, 0.5083605, 0.24857949, 0.49525097, 0.20079067, 0.6606931, 3.1363726, 0.75328624, 0.14273928, 1.1785328, 0.47525215, 0.10398671, 1.7309114, 0.79172695, 0.18373431, 0.13316083, 0.21315643, 0.049920056, 1.8203635, 0.37157616, 0, 1.0188315, 0.44467103, 0.9298111, 0.07191232, 0.20714627, 0.07679395, 0.02515889, 0.54764795, 0.058274392, 1.4237753, 0.5355995, 0.71892476, 0.16584587],
                    "colorSemanticData": [7049, 19653, 12054, 9675, 14719, 13591, 9081, 11354, 9089, 14447, 10518, 11740, 9401, 10586, 11436, 13107]
                }
            }, {
                "name": "Images/resultImages/2007_002376.jpg",
                "overallDistScore": 34.564877,
                "backforegrounddistance": 3.3075674,
                "colordistance": 4.6826344,
                "semanticcolordistance": 0.7987377,
                "shapedistance": 13.349678,
                "HighLevelSemanticFeatureDistance": 13.224997,
                "mainFeatures": {
                    "shapesemantic": ["aeroplane"],
                    "Shape": [1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 7, 3, 4, 1, 0, 7, 1, 2, 2, 0, 6, 2, 2, 4, 0, 2, 1, 1, 1, 0, 7, 2, 4, 1, 0, 6, 4, 3, 3, 1, 6, 3, 3, 3, 1, 7, 0, 1, 0, 0, 6, 0, 1, 0, 0, 6, 0, 0, 0, 0, 4, 1, 0, 0, 0, 5, 0, 1, 0],
                    "Color": [33, 16, 27, 15, 16, 15, 15, 14, 16, 13, 14, 16, 14, 15, 15, 16, 15, 16, 18, 16, 17, 30, 15, 26, 12, 15, 16, 25, 17, 15, 14, 16, 15],
                    "BackgroundForeground": [[12, 16, 9, 2, 2, 26, 8, 41, 4, 45, 2, 14, 22, 9, 2, 17, 5, 11, 7, 17]],
                    "HighLevelSemanticFeature": [0.0046167686, 0.19761162, 0.43187368, 0.6386451, 0.39477447, 0.22072263, 0.5386249, 2.7674248, 0.44393066, 0.4067952, 0.2613221, 1.8988763, 1.9472647, 0.015757926, 0.71842575, 0.16236106, 0.3495332, 0.84694314, 1.1903046, 0.2181044, 0.7413043, 0.077699415, 1.8498026, 2.1745906, 0.40718877, 0.7974505, 0.18281119, 0.27186555, 1.4198018, 0.555259, 0.6958992, 4.2551007, 3.0253642, 0.86269385, 2.716055, 0.28767264, 1.5204581, 0.0033249008, 0.13703898, 0.0144763235, 0.58579296, 0, 0.03641421, 0.67333937, 0.018493826, 0.042199977, 0.08919641, 0, 0.27759054, 0.2622947, 1.298009, 0.6044571, 1.9112259, 0.22099297, 0.4512029, 0.1696603, 2.566442, 0.5129148, 0.09258648, 2.6240726, 0.32216933, 0.40848505, 0.39852536, 0.12436179, 2.1606903, 0.19896582, 0.2333517, 0.047100432, 0.059294425, 0.572068, 0.21255945, 0.100529596, 1.8827738, 0.18350162, 0.4970067, 1.7995688, 0.22514693, 0.3370209, 0.14614247, 0.3947891, 0.53422123, 1.0360657, 0, 1.0607191, 0.9280592, 0.8769068, 1.3022933, 0.7169635, 0.63222474, 0.048925452, 2.503523, 0.16963758, 0.19360606, 0.12053228, 0.15608735, 0.15838894, 0.3450753, 0.15476681, 0.20967686, 0.28202805, 0.10041351, 0.6602875, 2.3000364, 0.18916516, 2.266544, 1.2675575, 1.7480757, 0.052414466, 0.25853777, 0.26873165, 0.7525691, 0.24082367, 4.0615163, 1.322999, 0.5365503, 1.2764288, 1.7569147, 2.8636045, 0.18496989, 0.8120816, 1.1382855, 0.9740455, 3.2064888, 1.1113502, 0.20057191, 0.22109322, 0.2561513, 1.9450145, 2.0130136, 0.18724376, 0.2778071, 3.2824748, 0.6882678, 0.3217079, 0.0029781985, 1.3567529, 0.09348188, 0.18861014, 0.1561417, 0.67374575, 0.797603, 0.5485248, 2.2266717, 1.0695736, 0.9224203, 0.06908792, 0.42307603, 0.15886606, 1.8693475, 1.9263307, 0.072923005, 0.15838523, 0.08608422, 0.3398514, 1.5394744, 1.1908411, 3.527716, 0.303547, 0.014908362, 0.5428113, 0.86074066, 0.9970898, 0.5722132, 2.6751456, 0.26791704, 0.23712608, 1.0655401, 2.6838217, 0.48229086, 0.35326007, 0.26760104, 0.45871535, 0.45524698, 0.30736455, 0.07817498, 0, 5.752289, 0.4998727, 1.1996614, 0.84810495, 0.0540954, 0.33453828, 3.3342354, 0.6934519, 0.37741637, 1.3912191, 0.15550168, 0.050906677, 0.107213, 0.4193433, 3.1889813, 0.45519435, 0.9737961, 3.5052762, 0.3532658, 1.715716, 0.00760072, 0.69152194, 0, 0.90113497, 0.30225757, 0.18056484, 3.4635222, 0.6802418, 2.9361055, 1.449402, 1.5765518, 0.3060321, 0.61556005, 1.6244069, 1.2782036, 5.566211, 0.26472777, 0.15089424, 1.2277819, 0.9824659, 1.7928376, 0.06613167, 0.6061496, 1.1394525, 2.5964222, 4.045098, 1.7399067, 0.0060816943, 0.874267, 1.0983938, 2.3370173, 0.3375219, 0.5738404, 0.26058793, 1.6360631, 0.7651079, 0.35942575, 0.1477353, 1.5492067, 0.33371946, 0.12935716, 0.33907154, 0.103289865, 0.4124782, 0.94001615, 1.7919842, 0.49057072, 0.22804411, 0.0014901788, 0.71001476, 2.5427873, 1.1409602, 1.1076118, 0.20909831, 0.42921725, 0.1765532, 1.120442, 0.13900284, 1.3610162, 0.02131171, 0.08095776, 0.3431689, 0.1129296, 0.99124885, 0.26703176, 0.68953556, 0.15895502, 0.14031443, 0.5142675, 2.0441892, 0.43216982, 0.7659336, 0.78469235, 2.262128, 1.0821593, 0.211607, 0.8388759, 0.09699546, 0.0203147, 0.2485819, 0.47999486, 1.1721536, 1.8031032, 0.9291212, 0.80400664, 0.32730603, 1.0897523, 0.36713368, 0.40526062, 0.26911378, 0.17070258, 0.5081443, 0.9306755, 0.91685057, 3.226952, 1.0014243, 0.32805115, 1.6723541, 0.7603683, 2.8443978, 0.069725335, 0.44823483, 1.972814, 0.09899962, 0.12715812, 0.31473085, 0.72127956, 1.5272034, 0.14979704, 0.5942154, 0.53566086, 0.012810512, 0.08165711, 0.4623575, 1.0896744, 0.58821726, 0.5989891, 0.5725169, 0.027416382, 2.6667998, 0.119911395, 0.14361812, 0.07540397, 1.5798849, 0.30088124, 4.9424124, 0.23121464, 0.41786805, 3.3732698, 0.41037792, 0.59437305, 0.88365954, 0.18913162, 0.22628422, 2.9570432, 0.3575268, 0.11452916, 0.3054678, 0.20560125, 0.22043909, 1.0246068, 0.27979445, 0.34002963, 0.6259847, 0, 3.6538537, 0.24465296, 0.47534105, 0.059861846, 0.121212475, 0.30115947, 1.2732011, 0.58986455, 0.6832637, 0.18635769, 0.13586354, 0.019951334, 0.42999902, 0.6191991, 0.19375286, 0.09972996, 0.0643229, 1.090188, 0.35085726, 1.3096279, 0.20563221, 1.1894858, 0.27231765, 0.105090775, 0.05840109, 0.2614235, 1.3405238, 0.034273434, 1.7675015, 1.1063646, 2.389834, 1.5275602, 0.13012974, 5.11436, 5.11478, 1.7745091, 0.6288658, 0.04811136, 0.16864382, 0.20659725, 0, 0.22312324, 2.021927, 0.7898489, 0.057026867, 0.22682334, 2.2445247, 0.5185342, 0.4393243, 0.48416153, 3.2259617, 1.2453864, 0.10845182, 0.6563307, 3.3012545, 0.45244014, 1.5935339, 2.013647, 0.30306512, 2.009202, 0.48252878, 1.9666016, 2.1149123, 0.21576294, 1.2998395, 0.6752276, 0.13289674, 2.314501, 0.84000707, 0.32096386, 0.3659083, 0.5264573, 0.028286409, 0.9807886, 0.80402535, 1.1457071, 1.9776956, 0.16841449, 0.38410583, 1.052893, 1.3485103, 0.85276556, 0.20563062, 0.6396508, 3.250931, 0.85102355, 0.83069557, 0.042164423, 0.4623116, 0.54414207, 3.9062772, 0.15614222, 1.7752432, 0.5587252, 3.8214521, 1.6382883, 1.1422565, 0.23755354, 1.8701257, 0.5827177, 0.2024144, 1.0148939, 0.4747763, 0, 0.8258575, 0.25240335, 0.5501662, 0.9876958, 0.2536529, 0.22039783, 1.9841346, 0.27937046, 1.8229349, 0.36638945, 0.041696757, 0.70189315, 0.24905753, 0, 0.0013366683, 0.4757224, 0.85591286, 0.8979609, 0.11218126, 0.23104545, 0.2527476, 0.11159744, 0.8421699, 0.2813285, 0.09866546, 2.438214, 3.0255952, 1.0162958, 2.7910411, 1.4187927, 1.8558394, 0.669203, 0.8607188, 0.8832126, 0.885903, 0.8997633, 2.785205, 0.14984016, 5.1869845, 0.37192044, 1.1678528, 2.3630595, 1.3990779, 1.1277261, 0.33059213, 0.1662934, 0.005674957, 0.30667526, 0.29021558, 0.15412694, 0.17370048, 0.1966969, 0.5030512, 0.017755251, 0.0013269332, 1.04378, 0.22310747, 0.71988475, 0.27341157, 0.07664658, 0.058079097, 1.1508335, 1.4457747, 0.14070928, 0.3240622, 0.36381912, 0.2716253],
                    "colorSemanticData": [11118, 7547, 13622, 15714, 3254, 12777, 11644, 8726, 12906, 6386, 12805, 17541, 4769, 10469, 8136, 9086]
                }
            }],
            "QueryImgDetails": {
                "overallDistScore": 0,
                "backforegrounddistance": 0,
                "colordistance": 0,
                "semanticcolordistance": 0,
                "shapedistance": 0,
                "HighLevelSemanticFeatureDistance": 0,
                "mainFeatures": {
                    "shapesemantic": ["aeroplane", "aeroplane", "aeroplane", "aeroplane", "aeroplane", "aeroplane", "aeroplane"],
                    "Shape": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 3, 3, 0, 6, 2, 0, 2, 1, 3, 0, 1, 1, 0, 3, 0, 0, 0, 2, 6, 4, 3, 3, 1, 7, 2, 3, 4, 3, 4, 6, 3, 4, 2, 4, 5, 4, 5, 3, 5, 4, 2, 3, 4, 1, 2, 4, 2, 6, 4, 2, 2, 2, 2, 4, 3, 3, 2],
                    "Color": [44, 10, 29, 19, 19, 18, 17, 12, 14, 8, 16, 17, 15, 14, 16, 15, 15, 16, 16, 12, 18, 30, 15, 17, 16, 16, 15, 33, 16, 14, 16, 15, 16],
                    "BackgroundForeground": [[28, 1, 12, 5, 8, 25, 5, 29, 1, 38, 13, 6, 14, 11, 4, 9, 4, 15, 4, 17]],
                    "HighLevelSemanticFeature": [0.13417432, 0.3165778, 0.2437123, 1.5262407, 1.4064927, 0.50975007, 1.444305, 0.6721891, 0.8563375, 1.1534377, 1.426978, 1.1115645, 0.39491618, 0.15237866, 1.1300813, 0.65488034, 0.6644389, 0.9068377, 1.6630446, 0.32811168, 0.9345322, 0.07145657, 2.2088957, 3.009502, 0.37803587, 0.3366922, 0.24657898, 0.14506777, 1.3957828, 1.2302271, 0.2510634, 2.3041425, 3.3641868, 1.1105574, 1.836179, 0.59477556, 1.8545873, 0.2389468, 1.1387305, 0.6356895, 0.81872135, 0.119935736, 1.0509703, 0.29590678, 0.10245019, 0.17223644, 0.8450201, 0.4007415, 1.9573154, 0.0034716835, 0.5321065, 0.8101708, 1.0503889, 0.36398005, 0.41409254, 0.16350475, 3.7543516, 0.15553688, 0.383009, 2.924513, 0.36985144, 0.22453193, 0.13044521, 1.4724661, 0.0072516026, 0.07034029, 1.2024413, 0.47381473, 0.31773356, 0.29558375, 0.18222499, 0.060184907, 2.5056038, 0.3680912, 0.5545287, 2.5041356, 0.7082311, 0.47385383, 1.32732, 0.32953757, 1.6582143, 1.0353364, 0.23137501, 0.29778922, 1.3264033, 0.39014763, 1.4729407, 0.32505846, 1.1224381, 1.6986518, 2.5374095, 0.42544645, 0.052697916, 0.10615979, 0.6714378, 0.50441694, 0.041194778, 0.137087, 0.6517743, 0.4502437, 0.0061159716, 1.6209366, 1.4007274, 0.83198404, 3.6215153, 0.22486997, 1.5182809, 0.37057364, 0.15842874, 2.0611598, 0.6901731, 0.93359274, 4.2094297, 0.5740207, 1.1700377, 0.59628767, 0.5918342, 1.1850839, 1.072855, 0.33465576, 0.4849387, 0.6542298, 1.4423542, 0.054369975, 0.32754087, 0.047022216, 0.14346153, 0.11287226, 0.8919367, 2.1713593, 1.3856413, 2.971364, 0.30077574, 0.48583424, 0.26117367, 0.3520756, 0.050783332, 0.2225501, 0.14706738, 0.40489888, 0.8980472, 0.738189, 1.9582694, 0.28015548, 0.8000936, 0.17551106, 0.6268896, 0.28227425, 3.3616138, 0.7066239, 0.18524376, 1.3275038, 0.58629227, 0.48069817, 0.636809, 2.625243, 2.7087145, 1.446348, 0.032077108, 0.29861516, 0.5327634, 0.9603228, 0.25173998, 0.2304939, 0.6946253, 0.11623837, 0.88346845, 1.3494307, 1.0650166, 0.39193177, 0.9255986, 0.7514267, 0.2215445, 1.5829711, 0.7125984, 0.4077804, 6.2639103, 0.9831596, 1.6430037, 0.60372967, 0.51031905, 0.05616463, 3.0314014, 0.08554895, 0.9632392, 1.0924165, 1.2118535, 0.6674497, 0, 0.055786736, 3.0893848, 0.73062, 0.22923431, 1.294957, 0.12634225, 0.29567984, 0.00045749362, 0.90293604, 1.1336813, 2.295568, 0.1326041, 0.70346755, 1.6283919, 0.18554148, 0.25724706, 1.7473501, 1.2350985, 0.09508925, 0.8873169, 0.11259042, 2.5130134, 3.3950024, 0.19718261, 0.19067211, 3.8789153, 0.79422855, 1.1947956, 0.6749642, 2.207293, 0.018641248, 2.4563057, 0.45531437, 2.0450442, 0.025446534, 1.4939443, 2.3962119, 1.9073858, 0.8578678, 0.008155464, 0.1750223, 1.1650717, 1.2809038, 0.17729598, 0.34871086, 1.2253766, 0.29407918, 0.52817804, 0.22815007, 0.1658722, 0.7468163, 0.9911004, 0.25189623, 0.48227498, 0.92913264, 0.27756393, 0.4394679, 1.4433386, 0.774574, 1.0052154, 0.27512485, 0.22350994, 1.632156, 0.49854013, 0.56860775, 3.5307026, 0.05248744, 0.74836475, 0.15187798, 1.1634339, 0.78868943, 0.52745324, 0.7565697, 0.014616184, 0.54537755, 0.39749205, 2.147668, 0.56728286, 0.020096723, 0.6352508, 0.72487164, 1.8776976, 0.10859038, 0.30080047, 0.069442116, 0.093981326, 0.31701306, 0.19449487, 0.37388486, 0.7332125, 0.7979812, 0.108584255, 0.12032223, 0.40830132, 1.0743083, 0.02633976, 0.019915916, 1.4506049, 0.5036461, 1.2377796, 0.77524126, 3.1468444, 0.14644726, 1.0389265, 1.8406501, 0.72651714, 2.2442946, 1.0323849, 0.082553826, 1.01551, 0.5530909, 0.050997198, 0.09479195, 0.08244128, 1.1417103, 0.22593796, 2.6140127, 0.9589721, 0.48959595, 0.9475473, 1.2554508, 1.3729218, 1.5097396, 2.6618726, 0.5899842, 0.18476517, 4.003844, 0.12729444, 0.6877994, 0.3544962, 0.8908805, 1.4137096, 5.0889363, 1.3340827, 0.5673622, 2.1072783, 0.15940112, 0.8305192, 0.12370259, 1.782833, 1.7716559, 1.8615148, 0.69441104, 0.43428054, 0.7900253, 0.24915244, 0.06622435, 0.84682435, 0.43612403, 0.25590727, 0.48379272, 0.14112759, 1.0013698, 0.57647336, 0.4944487, 0.047353588, 0.5608067, 1.3614285, 1.1221076, 0.54587233, 0.9174013, 0.4595484, 0.9721374, 0.4525019, 0.8022866, 0.76307064, 0.12616986, 1.1293523, 0.5481933, 0.07226221, 0.058626045, 1.182121, 0.3049224, 3.7937582, 1.1358614, 0.8885199, 0.9215256, 1.1640978, 0.6255438, 0.67640847, 0.5329732, 1.8235976, 2.975581, 1.77632, 0.29949558, 5.328487, 2.1093202, 0.6060678, 0.95486367, 0.61547834, 0.23108412, 0.47771508, 0.23205094, 0.35474095, 2.748122, 0.9887898, 0.19339165, 0.7523055, 1.5136276, 0.14301805, 0.4284916, 0.2828223, 4.4543753, 0.26766455, 0.010433949, 1.6761379, 1.8170158, 0.015634159, 1.359665, 6.4406624, 0.49821812, 0.26052102, 0.97811073, 1.5918229, 2.9314785, 0.11940709, 2.4937496, 0.91289246, 0.5052646, 1.0570259, 1.5557936, 0.30573377, 0.2010984, 1.0580629, 0.016992956, 0.31527954, 1.6074072, 0.67578566, 1.5996093, 1.2924947, 0.35918647, 1.1237931, 1.0282212, 2.0068634, 0.21186645, 0.007607361, 3.396598, 1.2517946, 0.27670404, 0.057800896, 1.344794, 0.6748713, 3.5209532, 0.8754264, 0.83647645, 0.0044622505, 2.612384, 1.9610473, 0.5774252, 0.5700759, 0.7489335, 0.43548647, 0.75844854, 0.028012976, 0.012292481, 0.2743118, 0.26243347, 0.28077152, 0.29071727, 0.83488697, 0.97113067, 0.47214672, 0.8822286, 0.5335133, 2.860959, 0.4651023, 0.21292864, 3.3904886, 0.23293827, 0.24709366, 0.021242691, 1.1073655, 0.03169901, 2.0860572, 1.1162983, 0.6832839, 2.5090554, 0.5634816, 1.0167576, 0.9874533, 1.0285108, 0.8433549, 2.0437036, 1.2717632, 1.8204656, 2.3268688, 0.5895505, 0.5910475, 0.8953718, 0.54868144, 1.742569, 3.0937145, 3.457995, 1.0327309, 3.3308403, 0.30953723, 0.31015438, 4.1659336, 0.874247, 0.017928343, 0.89128286, 0.22233714, 0.221303, 0.27198014, 0.1330483, 0.5253185, 0.2956858, 0.881125, 1.4633917, 0.013840684, 0.2913416, 0.68598884, 0.18848242, 1.1627477, 1.3974667, 0.21483739, 0.29339492, 2.2350166, 2.3557854, 2.8461149, 0.6025131, 1.0881437, 0.63930666],
                    "colorSemanticData": [10832, 12693, 11525, 11222, 13995, 11157, 10727, 12614, 8054, 11398, 12601, 12139, 10844, 10008, 12608, 10583]
                }
            },
            "classification_result": [-0.006410239, -0.029677209, -0.016811265, -0.04085704],
            "classification_names": ["background_foreground", "color", "shape", "high_level_semantic_feature"]
        };
    });
});