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
                getDefImagesUrl: 'http://localhost:3000/defaultImages',
                urlkey: 'urld',
                imgUrlKey: 'imgurl',
                cookiesKey: 'sessiondata'
            },
            //colorConstants: ['Black', 'Maroon', 'Green', 'Olive', 'Navy', 'Purple', 'Teal', 'Silver', 'Grey', 'Red', 'Lime', 'Yellow', 'Blue', 'Fuchsia', 'Aqua', 'White'],
            colorConstants: ["Black", "White", "Red", "Lime", "Blue", "Yellow", "Cyan", "Magenta", "Silver", "Gray", "Maroon", "Olive", "Green", "Purple", "Teal", "Navy"],
            semanticsConstants: ['aeroplane', 'bicycle', 'bird', 'boat', 'bottle', 'bus', 'car', 'cat', 'chair', 'cow', 'diningtable', 'dog', 'horse', 'motorbike', 'person', 'pottedplant', 'sheep', 'sofa', 'train', 'tvmonitor'],
            constantDetails: ['colorConstants', 'semanticsConstants'],
            excludedFeatures: ['shapesemantic', 'colorSemanticData'],
            normalizeFeatures: ['overallDistScore', 'backforegrounddistance', 'colordistance', 'semanticcolordistance', 'shapedistance', 'HighLevelSemanticFeatureDistance'],
            normalizeFeatures2: ['backforegrounddistance', 'colordistance', 'shapedistance', 'HighLevelSemanticFeatureDistance'],
            globalFeaturesExp: ['background_foreground', 'color', 'shape', 'high_level_semantic_feature'],
            explainFeatures: ['overAllColor', 'overAllSize', 'similarity_for_obj'],
            explainFeatureNames: ['color', 'shape', 'Objects'],
            endpointresult: null,
            cookiesObj: [],
            startTime: '',
            endTime: '',
            randomNumber1: '',
            randomNumber2: '',
            randomNumSum: '',
            checkedCount: 0,
            checkedIDDetails: [],
            colorexpflag: false,
            shapeexpflag: false,
            numToWords1: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'],
            numToWords2: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Nineth', 'Tenth'],
            singularClasses: ['person', 'bird', 'cat', 'cow', 'dog', 'horse', 'sheep', 'aeroplane', 'bicycle', 'boat', 'bus', 'car', 'motorbike', 'train', 'bottle', 'chair', 'dining table', 'potted plant', 'sofa', 'tv/monitor'],
            pluralClasses: ['persons', 'birds', 'cats', 'cows', 'dogs', 'horses', 'sheeps', 'aeroplanes', 'bicycles', 'boats', 'buses', 'cars', 'motorbikes', 'trains', 'bottles', 'chairs', 'dining tables', 'potted plants', 'sofas', 'tv"s/monitors']
        };

        //When everything is loaded what to do first
        $(document).ready(function () {
            try {

                //check cookies
                checkCookies();

                // pageDetails.endpointresult = newJsonData.Data;
                // reOrderData(newJsonData);

                // createCaptcha();

                // $("#captcha_app_div").modal({ backdrop: 'static', keyboard: false });



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
                    //loader before loading the data
                    $('body').addClass("loading");

                    $(pageDetails.idDetails[0]).css("display", "block");
                    $(pageDetails.idDetails[1]).hide();

                    var getSlideSucc = getSlideShowData();

                    getSlideSucc.done(function () {
                        $('.carousel').carousel();
                        $('body').removeClass("loading");
                    });
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

        //When the user click captcha refresh
        $("#captchaRefresh").click(function () {
            try {
                createCaptcha();
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });

        //when the user submits the captcha
        $("#captchaBtnId").click(function () {
            try {

                validateCaptcha();

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });

        //generate the captcha function
        function createCaptcha() {
            try {

                pageDetails.randomNumber1 = getRandomInt(9);
                $('#captchanumber1').text(pageDetails.randomNumber1);

                pageDetails.randomNumber2 = getRandomInt(90);
                $('#captchanumber2').text(pageDetails.randomNumber2);

                pageDetails.randomNumSum = pageDetails.randomNumber1 + pageDetails.randomNumber2;

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //validate the entered captcha
        function validateCaptcha() {
            try {
                if (Number($('#captchaResult').val()) === Number(pageDetails.randomNumSum)) {

                    $("#captcha_app_div").modal('hide');

                    //loader before loading the data
                    $('body').addClass("loading");

                    $(pageDetails.idDetails[0]).css("display", "block");
                    $(pageDetails.idDetails[1]).hide();

                    var getSlideSucc = getSlideShowData();

                    getSlideSucc.done(function () {
                        $('.carousel').carousel();
                        $('body').removeClass("loading");
                    });
                } else {
                    createCaptcha();
                    $('#captchawarnId').show();
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

                    //If cookies are present then verify captcha
                    createCaptcha();
                    $("#captcha_app_div").modal({ backdrop: 'static', keyboard: false });

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

        //gets the data from server about default Images
        function getSlideShowData() {
            var deferred = $.Deferred();
            try {
                $.ajax({
                    url: pageDetails.serverHostedDetails.getDefImagesUrl,
                    type: 'GET',
                    // dataType: 'json', // added data type
                    success: function (res) {
                        generateSlideShow(JSON.parse(res));
                        deferred.resolve();
                    },
                    error: function (errres) {
                        swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Problem with GET Default Images server!!!',
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

        //make slide show dynamically
        function generateSlideShow(slideData) {
            try {

                var slideDivData = '';

                for (var s1 = 0; s1 < slideData.length; s1++) {
                    slideDivData = slideDivData + '<div class="col-sm-3"><div class="card"><div class="card-body">' +
                        '<h3 class="card-title">' + slideData[s1].className + '</h3>' +
                        '<div id="' + slideData[s1].className + 'Carousel" class="carousel slide" data-ride="carousel">';

                    //create the indicators
                    slideDivData = slideDivData + '<ol class="carousel-indicators">';
                    for (var s2 = 0; s2 < slideData[s1].imageUrls.length; s2++) {
                        if (s2 == 0) {
                            slideDivData = slideDivData + '<li data-target="#' + slideData[s1].className + 'Carousel" data-slide-to="' + s2 + '" class="active"></li>';
                        } else {
                            slideDivData = slideDivData + '<li data-target="#' + slideData[s1].className + 'Carousel" data-slide-to="' + s2 + '"></li>';
                        }
                    }
                    slideDivData = slideDivData + '</ol>';

                    //Start the carousel div
                    slideDivData = slideDivData + '<div class="carousel-inner">';

                    //append the image urls
                    for (s3 = 0; s3 < slideData[s1].imageUrls.length; s3++) {
                        if (s3 == 0) {
                            slideDivData = slideDivData + '<div class="item active">' +
                                '<img class="carImgHeight" src="' + slideData[s1].imageUrls[s3] + '"></img>' +
                                '</div>';
                        } else {
                            slideDivData = slideDivData + '<div class="item">' +
                                '<img class="carImgHeight" src="' + slideData[s1].imageUrls[s3] + '"></img>' +
                                '</div>';
                        }
                    }

                    //End of carousel div
                    slideDivData = slideDivData + '</div>';

                    // Left and right controls Start
                    slideDivData = slideDivData + '<a class="left carousel-control" data-target="#' + slideData[s1].className + 'Carousel" data-slide="prev" href="javascript:;">' +
                        '<span class="glyphicon glyphicon-chevron-left"></span>' +
                        '<span class="sr-only">Previous</span>' +
                        '</a>';

                    slideDivData = slideDivData + '<a class="right carousel-control" data-target="#' + slideData[s1].className + 'Carousel" data-slide="next" href="javascript:;">' +
                        '<span class="glyphicon glyphicon-chevron-right"></span>' +
                        '<span class="sr-only">Next</span>' +
                        '</a>';
                    // Left and right controls End

                    slideDivData = slideDivData + '</div></div></div></div>';
                }

                $('#slideShowDiv').empty();
                $('#slideShowDiv').append(slideDivData);
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
                                //Do nothing
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
                            //Do nothing
                        });

                    } else {
                        $('#url_box').val('');
                        swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Please enter a valid image URL!'
                        });
                    }
                    // var getvalSucc = validateURL();
                    // getvalSucc.done(function () {
                    //     $('#carsContainerID').hide();
                    //     pageDetails.imageName = pageDetails.duplicateImageName = filename;
                    //     if ((pageDetails.imageName.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi) != null) && ((pageDetails.supportedImageFormats.indexOf((pageDetails.imageName.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi)[0]).toUpperCase())) >= 0)) {

                    //         var getretSucc = returnDataFromServer(false);
                    //         getretSucc.done(function () {
                    //             // $('#url_box').val('');
                    //             var htmlPreview = '<img style="max-height:100%;max-width:100%;margin:auto;" id="previewImgID" src="' + pageDetails.imageUrl + '" />';
                    //             $('#viewPartdiv').empty();
                    //             $('#viewPartdiv').append(htmlPreview);
                    //             $('#queryImageID').show();
                    //             $('body').removeClass("loading");
                    //         }).fail(function () {
                    //             //Do nothing
                    //         });

                    //     } else {
                    //         $('#url_box').val('');
                    //         swal.fire({
                    //             icon: 'error',
                    //             title: 'Oops...',
                    //             text: 'Please enter a valid image URL!'
                    //         });
                    //     }

                    // });
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
        // $('.carImgHeight').click(function () {
        $(document).on('click', '[class^="carImgHeight"]', function () {
            $('body').addClass("loading");
            searchImage(this.src);
        });

        // detect when the accoirdion is clicked and collapse all other than the current one
        $(document).on('click', '[id^="ExpBtnID"]', function () {
            try {

                if ($('#' + this.id).attr('aria-expanded') == 'true') {
                    $("[id^='ExpID']").removeClass('in');

                    var getcurrentid = this.id;
                    getcurrentid = Number(getcurrentid.replace("ExpBtnID", "") - 1);

                    var resImgNam = $('#resImgID' + (getcurrentid + 1)).attr('src').split('/').pop().split('#')[0].split('?')[0];
                    var eventTrackObj = {
                        eventName: 'Explain-Button-Clicked',
                        resultImageName: resImgNam,
                        baseImageName: pageDetails.imageName,
                        resultRowNumber: (getcurrentid + 1)
                    };
                    setCookies(eventTrackObj);

                    prepareExpData(getcurrentid);

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

        function prepareExpData(currentaccID) {
            try {

                var createRankList = [];
                var tempIndCount = 0;

                $.each(pageDetails.explainFeatures, function (ind, currValue) {
                    createRankList[tempIndCount] = [];
                    createRankList[tempIndCount].push(pageDetails.explainFeatureNames[ind]);
                    createRankList[tempIndCount++].push(pageDetails.endpointresult.SemanticData.similarity_arr[currentaccID][currValue]);
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
                        ': ' + (createRankList[li1][1] * 100).toFixed(2) + '%' +
                        '<div style="padding-top: 10px;"><div class="progress" style="height: 13px;margin-bottom: 0px">' +
                        '<div class="progress-bar" role="progressbar" style="width: ' + (createRankList[li1][1] * 100).toFixed(2) + '%" aria-valuenow="' + (createRankList[li1][1] * 100).toFixed(2) + '" aria-valuemin="0" aria-valuemax="100"></div>' +
                        '</div></div>' +
                        // '<div style="padding-top: 5px;"><input type="range" min="1" max="100" value="' + (createRankList[li1][1] * 100).toFixed(2) + '" disabled></div>' +
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

                CreateDatatable('irtexdbID', pageDetails.endpointresult.SemanticData.similarity_arr);

                changePaginationStyle('irtexdbID');

                // $("[id^='accordion']").accordion({ header: "h3", collapsible: true, active: false, heightStyle: "content" });
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
                            "data": "base_name_original",
                            "className": 'thirdColumnClass',
                            render: function (data, type, row) {
                                return '<div class="row match-row trsingleDiv">' +
                                    '<div class="col-xs-1 col-sm-1 match-thumb imgVerCenter" style="justify-content: center;">' +
                                    '<input type="checkbox" id="selectIndex' + row.ID + '">' +
                                    '</div>' +
                                    '<div class="col-xs-3 col-sm-3 match-thumb imgVerCenter">' +
                                    '<img class="tableImgClass" id="resImgID' + (row.ID + 1) + '" src="' + getImgURL(data) + '"/>' +
                                    '</div>' +
                                    '<div class="col-xs-6 col-sm-6 match-details">' +
                                    '<div class="match">' +
                                    '<div style="width:100%;">' +
                                    '<div>' +
                                    '<div class="row" style="padding-top: 1.5em;">' +
                                    '<div class="col-xs-8 col-sm-6 col-md-4 col-lg-4">' +

                                    //disabling the explain button with conditional operator check
                                    (((Number(row.similarity_for_obj) != Number(0.0)) && row.sim_per_facet.length > 0) ? ('<input class="ExplainBtnClass" data-toggle="collapse" type="button" id="ExpBtnID' + (row.ID + 1) + '" data-target="#ExpID' + (row.ID + 1) + '" value="Explain">') : ('<input class="ExpDisBtnClass" data-toggle="collapse" type="button" id="ExpBtnID' + (row.ID + 1) + '" data-target="#ExpID' + (row.ID + 1) + '" value="Explain" disabled>')) +

                                    '</div>' +
                                    '<div class="col-xs-2 col-sm-3 col-md-3 col-lg-3">' +

                                    //disabling the visual explain button conditional operator check
                                    (((Number(row.similarity_for_obj) != Number(0.0)) && row.sim_per_facet.length > 0) ? ('<input class="VisualBtnClass" data-target="#exampleModalCenter" data-toggle="modal" type="button" value="Visual Explanation" id="VisualBtn' + (row.ID + 1) + '">') : ('<input class="ExpDisBtnClass" data-target="#exampleModalCenter" data-toggle="modal" type="button" value="Visual Explanation" id="VisualBtn' + (row.ID + 1) + '" disabled>')) +

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
                    "pagingType": "simple_numbers"
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

        //Gets the original image url from topscores
        function getImgURL(base_name_original) {
            try {
                var tempResImgName1 = base_name_original.split('\\').pop().split('#')[0].split('?')[0];

                for (var g1 = 0; g1 < pageDetails.endpointresult.Data.topScores.length; g1++) {
                    var currImgName1 = pageDetails.endpointresult.Data.topScores[g1].name.split('/').pop().split('#')[0].split('?')[0];

                    if (tempResImgName1 == currImgName1) {
                        return pageDetails.endpointresult.Data.topScores[g1].name;
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

        // cnhanges the style of the paf´gination filter
        function changePaginationStyle() {
            try {
                var liTemp = '';
                $.each($('#irtexdbID_length').children().children().children(), function (index) {
                    liTemp = liTemp + '<li><a id="liSelect' + index + '" selectVal=' + this.value + '>Showing ' + this.text + ' entries</a></li>'
                });

                $('#selectlisttable').empty();
                $('#selectlisttable').append(liTemp);
                $('#irtexdbID_length').hide();

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        // detect when the user wants to change the pagination
        $(document).on('click', '[id^="liSelect"]', function () {
            try {
                $('#selectListBtn').empty();
                $('#selectListBtn').append(this.text + '<span class="caret"></span>');
                pageDetails.tabledetails.page.len($('#' + this.id).attr('selectVal')).draw();
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        });

        // when the user clicks on next page or previous page scroll to top
        $(document).on('click', '.paginate_button', function () {
            try {
                window.scrollTo(0, 0);
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
        $(document).on('click', '[id^="VisualBtn"]', function () {
            try {
                var getcurrentid = this.id;
                pageDetails.extractCurResind = Number(getcurrentid.replace("VisualBtn", "") - 1);
                // visualPopUp(extractindex);

                var resImgNam = $('#resImgID' + (pageDetails.extractCurResind + 1)).attr('src').split('/').pop().split('#')[0].split('?')[0];
                var eventTrackObj = {
                    eventName: 'Compare-Button-Clicked',
                    resultImageName: resImgNam,
                    baseImageName: pageDetails.imageName,
                    resultRowNumber: (pageDetails.extractCurResind + 1)
                };
                setCookies(eventTrackObj);

                pageDetails.singlediffarray = [];
                pageDetails.singlefirstlevedata = [];

                //commenting the zing chart
                // //calling the function that calculates the visual display data
                // calculatesingleVisualData(pageDetails.extractCurResind);

                // //calling the function that prepares data for visual display
                // prepareData();

                // makechartconfig();

                compSImages(pageDetails.extractCurResind);
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
                //.Data.topScores
                pageDetails.endpointresult = reOrderData(serverRes);
                pageDetails.mainTableData = pageDetails.endpointresult.Data.topScores;
                pageDetails.baseImagedata = pageDetails.endpointresult.Data.QueryImgDetails;
                pageDetails.checkedCount = 0;
                pageDetails.checkedIDDetails = [];
                $('#gblCmpBtn').hide();
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
                for (var g3Temp1 = 0; g3Temp1 < pageDetails.endpointresult.Data['classification_result'].length; g3Temp1++) {
                    newTempData[g3Temp1] = {
                        name: pageDetails.endpointresult.Data['classification_names'][g3Temp1],
                        weightData: pageDetails.endpointresult.Data['classification_result'][g3Temp1]
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

        //New functions for new explanation

        //Reorders the data from server which is SemanticData
        function reOrderData(changeData) {
            try {
                var newData = changeData;
                var zeroOverAll = [];

                //for loop adds the overll color, size, overall data
                for (var n1 = 0; n1 < newData.SemanticData.similarity_arr.length; n1++) {

                    if ((Number(newData.SemanticData.similarity_arr[n1].similarity_for_obj) != 0.0) && newData.SemanticData.similarity_arr[n1].sim_per_facet.length > 0) {

                        var tempOCol = 0;
                        var tempOSize = 0;
                        var avgOCol = 0;
                        var avgOSize = 0;
                        var n2 = 0

                        for (n2 = 0; n2 < newData.SemanticData.similarity_arr[n1].sim_per_facet.length; n2++) {
                            tempOCol = tempOCol + newData.SemanticData.similarity_arr[n1].sim_per_facet[n2].sim_for_color;
                            tempOSize = tempOSize + newData.SemanticData.similarity_arr[n1].sim_per_facet[n2].sim_for_shape;
                        }

                        avgOCol = (tempOCol / newData.SemanticData.similarity_arr[n1].sim_per_facet.length);
                        avgOSize = (tempOSize / newData.SemanticData.similarity_arr[n1].sim_per_facet.length);

                        newData.SemanticData.similarity_arr[n1]['overAllColor'] = (avgOCol);
                        newData.SemanticData.similarity_arr[n1]['overAllSize'] = (avgOSize);

                        newData.SemanticData.similarity_arr[n1]['overAll'] = (((avgOCol * 0.15) + (avgOSize * 0.15) + (newData.SemanticData.similarity_arr[n1]['similarity_for_obj'] * 0.70)));

                        // newData.SemanticData.similarity_arr[n1]['overAll'] = ((avgOCol + avgOSize + newData.SemanticData.similarity_arr[n1]['similarity_for_obj']) / 3);
                    } else {
                        newData.SemanticData.similarity_arr[n1]['overAll'] = 0;
                    }
                }

                //sorts based on overAll
                newData.SemanticData.similarity_arr = sortArrayByObj(newData.SemanticData.similarity_arr, 'overAll', true);

                //splits the array from where overeall is 0
                var n3 = 0;
                for (n3 = 0; n3 < newData.SemanticData.similarity_arr.length; n3++) {
                    if (newData.SemanticData.similarity_arr[n3]['overAll'] == 0) {
                        zeroOverAll = newData.SemanticData.similarity_arr.splice(n3);
                        break;
                    }
                }

                //get the overall distance score for the images where overAll is 0
                for (var n4 = 0; n4 < zeroOverAll.length; n4++) {
                    //change to single forward slash
                    var tempResImgName = zeroOverAll[n4].base_name_original.split('\\').pop().split('#')[0].split('?')[0];


                    for (var n5 = 0; n5 < newData.Data.topScores.length; n5++) {
                        var currImgName = newData.Data.topScores[n5].name.split('/').pop().split('#')[0].split('?')[0];

                        if (tempResImgName == currImgName) {
                            zeroOverAll[n4]['zeroOverAll'] = newData.Data.topScores[n5].overallDistScore;
                            break;
                        }
                    }
                }

                //sorts the overall items where it is 0 based on overallDistancescore from top_scores
                zeroOverAll = sortArrayByObj(zeroOverAll, 'zeroOverAll', true);

                newData.SemanticData.similarity_arr = newData.SemanticData.similarity_arr.concat(zeroOverAll);

                //adds the new index object named ID
                for (var n6 = 0; n6 < newData.SemanticData.similarity_arr.length; n6++) {
                    newData.SemanticData.similarity_arr[n6]['ID'] = n6;
                }
                console.log(newData);

                return newData;
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //makes the visual explanation
        function compSImages(imgInd) {
            try {
                var resURL = pageDetails.endpointresult.SemanticData.similarity_arr[imgInd].base_img;
                var queURL = pageDetails.endpointresult.SemanticData.similarity_arr[imgInd].query_img;

                var diffObjs = pageDetails.endpointresult.SemanticData.similarity_arr[imgInd].sim_per_facet;

                var cmpDiv = '<div class="container">';


                //generate tabs data
               // var tabsBody = '<div>';

                var tempObjCount = 0;
                var tempIndCount = [];
                var tempColorCount = [];
                var tempShapeCount = [];
                for (var c2 = 0; c2 < diffObjs.length; c2++) {
                    tempIndCount.push(diffObjs[c2].similarity_of_obj_type.length);
                    tempColorCount[c2] = 0;
                    tempShapeCount[c2] = 0;
                    for (var c4 = 0; c4 < diffObjs[c2].similarity_of_obj_type.length; c4++) {
                        tempObjCount++;
                        var curr2Obj = diffObjs[c2].similarity_of_obj_type[c4];
                        tempColorCount[c2] = Number(tempColorCount[c2]) + Number((((curr2Obj.color_distance) * 100).toFixed(2)));
                        tempShapeCount[c2] = Number(tempShapeCount[c2]) + Number((((curr2Obj.size_distance) * 100).toFixed(2)));
                    }
                }

                var nlpData = '';
                if (tempObjCount > 1) {
                    nlpData = '<div><h3>In total there are ' + tempObjCount + ' similar objects between the images.</h3>';
                } else {
                    nlpData = '<div><h3>In total there is ' + tempObjCount + ' similar object between the images.</h3>';
                }

                //nlpData = nlpData + '<div class="row" style="margin-left: -15px; margin-right: 13px; display: inline-block;">';

                //makes the header data in visualization
                var tabHead = '<h4>';

                if (tempIndCount.length == 1) {
                    var curObj = firstCaps(diffObjs[0].similarity_of_obj_type[0].cat);

                    if (tempIndCount[0] == 1) {
                        tabHead = tabHead + 'There is ' + pageDetails.numToWords1[tempIndCount[0]-1] + ' ' + curObj + ' detected in both the images.';
                    } else {
                        tabHead = tabHead + 'There are ' + pageDetails.numToWords1[tempIndCount[0]-1] + ' ' + pageDetails.pluralClasses[pageDetails.singularClasses.indexOf(curObj)] + ' detected in both the images.';
                    }
                } else {
                    tabHead = tabHead + 'There are ';

                    for (var c7 = 0; c7 < tempIndCount.length; c7++) {

                        var curObj = firstCaps(diffObjs[c7].similarity_of_obj_type[0].cat);

                        if ((c7 + 1) == tempIndCount.length) {
                            if(tempIndCount[c7] == 1){
                                tabHead = tabHead + ' and ' + pageDetails.numToWords1[tempIndCount[c7]-1] + ' ' + curObj + ' detected in both the images.';
                            } else {
                                tabHead = tabHead + ' and ' + pageDetails.numToWords1[tempIndCount[c7]-1] + ' ' + pageDetails.pluralClasses[pageDetails.singularClasses.indexOf(curObj)] + ' detected in both the images.';
                            }
                        } else {
                            if(tempIndCount[c7] == 1){
                                tabHead = tabHead + pageDetails.numToWords1[tempIndCount[c7]-1] + ' ' + curObj + ', ';
                            } else {
                                tabHead = tabHead + pageDetails.numToWords1[tempIndCount[c7]-1] + ' ' + pageDetails.pluralClasses[pageDetails.singularClasses.indexOf(curObj)] + ', ';
                            }
                        }

                    }
                }

                tabHead = tabHead + '</h4></div>';

                nlpData += tabHead;

                nlpData += '<div><ul>';

                for (var c5 = 0; c5 < diffObjs.length; c5++) {

                    var tempcurr2Obj = diffObjs[c5].similarity_of_obj_type[0].cat;

                    nlpData += '<li>Among the '+ firstCaps(pageDetails.pluralClasses[pageDetails.singularClasses.indexOf(tempcurr2Obj)]) +' there is '+ (tempColorCount[c5]/diffObjs[c5].similarity_of_obj_type.length).toFixed(2) +'% similarity in color, '+ (tempShapeCount[c5]/diffObjs[c5].similarity_of_obj_type.length).toFixed(2)  +'% similarity in shape. <ul>';

                    for (var c6 = 0; c6 < diffObjs[c5].similarity_of_obj_type.length; c6++) {
                        var curr2Obj = diffObjs[c5].similarity_of_obj_type[c6];

                        

                        if (diffObjs[c5].similarity_of_obj_type.length > 1) {
                            // nlpData += '<li>' + firstCaps(curr2Obj.cat) + (c6 + 1) + ' is represented in ' + curr2Obj.color_name + ' box with ' + (((curr2Obj.color_distance) * 100).toFixed(2)) + '% of color and ' + (((curr2Obj.size_distance) * 100).toFixed(2)) + '% of shape match.</li>';
                            nlpData += '<li>The '+ pageDetails.numToWords2[c6] + ' ' + firstCaps(curr2Obj.cat) + ' is been highlighted by ' + curr2Obj.color_name + ' box in both the images and has ' + (((curr2Obj.color_distance) * 100).toFixed(2)) + '% of color, ' + (((curr2Obj.size_distance) * 100).toFixed(2)) + '% of shape similarity.</li>';
                        } else {
                            // nlpData += '<li>' + firstCaps(curr2Obj.cat) + ' is represented in ' + curr2Obj.color_name + ' box with ' + (((curr2Obj.color_distance) * 100).toFixed(2)) + '% of color and ' + (((curr2Obj.size_distance) * 100).toFixed(2)) + '% of shape match.</li>';
                            nlpData += '<li>The ' + firstCaps(curr2Obj.cat) + ' is been highlighted by ' + curr2Obj.color_name + ' box in both the images and has ' + (((curr2Obj.color_distance) * 100).toFixed(2)) + '% of color, ' + (((curr2Obj.size_distance) * 100).toFixed(2)) + '% of shape similarity.</li>';
                        }

                    }

                    nlpData += '</ul></li>';

                }

                nlpData += '</div></ul>';





                //commented for generating NLP text instead of table text 

                //generate UL list data
                /*var tabsUl = '<ul>';
                for (var c2 = 0; c2 < diffObjs.length; c2++) {
                    tabsUl = tabsUl + '<li><a href="#tabs-' + c2 + '">' + firstCaps(diffObjs[c2].similarity_of_obj_type[0].cat) + '</a></li>'
                }
                tabsUl = tabsUl + '</ul>';*/

                //generate ul specific tabs data
                // var tabsUlData = '';
                /*for (var c3 = 0; c3 < diffObjs.length; c3++) {
                    tabsUlData = tabsUlData + '<div id="tabs-' + c3 + '">';
                    tabsUlData = tabsUlData + '<p>';

                    var tabsUlTableData = '';
                    tabsUlTableData = tabsUlTableData + '<table class="table tabTableCls"><thead class="thead-dark">' +
                        '<tr><th scope="col">#</th><th scope="col">Similar Object</th><th scope="col">Marked Box Color</th><th scope="col">% Color Match</th><th scope="col">% Shape Match</th></tr></thead>';

                    tabsUlTableData = tabsUlTableData + '<tbody>';

                    for (var c4 = 0; c4 < diffObjs[c3].similarity_of_obj_type.length; c4++) {
                        var curr2Obj = diffObjs[c3].similarity_of_obj_type[c4];
                        tabsUlTableData = tabsUlTableData + '<tr>';

                        tabsUlTableData = tabsUlTableData + '<th scope="row">' + (c4 + 1) + '</th>';
                        tabsUlTableData = tabsUlTableData + '<td scope="row">' + firstCaps(curr2Obj.cat) + (c4 + 1) + '</td>';
                        tabsUlTableData = tabsUlTableData + '<td scope="row">' + curr2Obj.color_name + '</td>';
                        tabsUlTableData = tabsUlTableData + '<td scope="row">' + (((curr2Obj.color_distance) * 100).toFixed(2)) + '</td>';
                        tabsUlTableData = tabsUlTableData + '<td scope="row">' + (((curr2Obj.size_distance) * 100).toFixed(2)) + '</td>';

                        tabsUlTableData = tabsUlTableData + '</tr>';
                    }

                    tabsUlTableData = tabsUlTableData + '</tbody>';

                    tabsUlTableData = tabsUlTableData + '</table>';

                    tabsUlData = tabsUlData + tabsUlTableData + '</p>';
                    tabsUlData = tabsUlData + '</div>';
                }*/

                // tabsBody = tabsBody + tabsUl + tabsUlData + '</div>';

                cmpDiv = cmpDiv + nlpData + '</div>';

                cmpDiv = cmpDiv + '<div class="row"><div class="col-container"><div class="colNew"><div class="row" style="justify-content: center;"><img class="cmpCls col-xs-8 col-sm-8 col-xl-8 col-md-8 col-lg-8 col-8" id="cmpQueImg" src="' + queURL + '"></div><div class="row cmpCaption"><span class="labelCls otherlbl">Query Image</span></div></div>';
                cmpDiv = cmpDiv + '<div class="colNew"><div class="row" style="justify-content: center;"><img class="cmpCls col-xs-8 col-sm-8 col-xl-8 col-md-8 col-lg-8 col-8" id="cmpResImg" src="' + resURL + '"></div><div class="row cmpCaption"><span class="labelCls otherlbl">Result Image</span></div></div></div></div>';

                cmpDiv = cmpDiv + '</div>';

                $('#visualdialog').empty();
                $('#visualdialog').append(cmpDiv);

                // $("#tabs").tabs();
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //detect when the compare check box is cchecked
        $(document).on('click', '[id^="selectIndex"]', function () {

            var getcurrentid = this.id;
            var tempID = Number(getcurrentid.replace("selectIndex", ""));

            if (this.checked) {
                pageDetails.checkedCount++;
                if (pageDetails.checkedCount > 0 && pageDetails.checkedCount < 4) {
                    pageDetails.checkedIDDetails.push(tempID);
                } else if (pageDetails.checkedCount > 3) {
                    pageDetails.checkedCount--;
                    $("#" + this.id).prop("checked", false);
                    swal.fire({
                        icon: 'info',
                        title: 'Oops...',
                        text: 'Maximum 3 can be compared!',
                    });
                }
            } else {
                pageDetails.checkedCount--;
                pageDetails.checkedIDDetails.splice(pageDetails.checkedIDDetails.indexOf(tempID), 1);
            }

            if (pageDetails.checkedIDDetails.length > 1 && pageDetails.checkedIDDetails.length < 4) {
                $('#gblCmpBtn').show();
            } else {
                $('#gblCmpBtn').hide();
            }
            pageDetails.checkedIDDetails.sort();
        });

        $(document).on('click', '[id^="gblCmpBtn"]', function () {
            multipleCimages();
        });

        //makes the comparision between images
        function multipleCimages() {
            try {

                var mData = '<div class="container"><div class="row">';

                var mTabData = '<table class="table table-hover table-fixed">';


                //Build Table Head Data
                var mTabHeadData = '<thead><tr><th scope="col" style="width:11%;vertical-align: middle;text-align: center;float:left;border-bottom: 0;margin-top: 10em;">Image-Details</th>';

                mTabHeadData = mTabHeadData + '<th scope="col">' +
                    '<div class="row" style="justify-content: center;vertical-align: middle;">';

                for (var m1 = 0; m1 < pageDetails.checkedIDDetails.length; m1++) {
                    var resURL = pageDetails.endpointresult.SemanticData.similarity_arr[pageDetails.checkedIDDetails[m1]].base_img;
                    var queURL = pageDetails.endpointresult.SemanticData.similarity_arr[pageDetails.checkedIDDetails[m1]].query_img;

                    mTabHeadData = mTabHeadData + '<div class="col-xs-3 col-sm-3 col-xl-3 col-md-3 col-lg-3 col-3">' +
                        '<div class="row"><img class="col-xs-12 col-sm-12 col-xl-12 col-md-12 col-lg-12 col-12" src="' + queURL + '"></div>' +
                        '<div class="row" style="margin-top: 1em;"><img class="col-xs-12 col-sm-12 col-xl-12 col-md-12 col-lg-12 col-12" src="' + resURL + '"></div>' +
                        // '<img class="col-xs-12 col-sm-12 col-xl-12 col-md-12 col-lg-12 col-12" src="' + resURL + '">' +
                        '</div>';
                }
                mTabHeadData = mTabHeadData + '</div>';

                mTabHeadData = mTabHeadData + '<div class="row" style="justify-content: center;">';

                for (var m2 = 0; m2 < pageDetails.checkedIDDetails.length; m2++) {
                    var resURL = pageDetails.endpointresult.SemanticData.similarity_arr[pageDetails.checkedIDDetails[m2]].base_img;

                    mTabHeadData = mTabHeadData + '<div style="text-align: center;padding-left: 11%;" class="col-xs-3 col-sm-3 col-xl-3 col-md-3 col-lg-3 col-3">' +
                        'Image_Rank_' + (pageDetails.checkedIDDetails[m2] + 1) +
                        '</div>';
                }
                mTabHeadData = mTabHeadData + '</div></th>';

                mTabHeadData = mTabHeadData + '</tr></thead>';
                //End Of Table Head Data

                //Build Table Body Data

                mTabHeadData = mTabHeadData + '<tbody>';

                //Zero Row
                mTabHeadData = mTabHeadData + '<tr><td style="width:11%;vertical-align: middle;text-align: center;float: left;">Types of objects</td><td><div class="row" style="justify-content: center;vertical-align: middle;">';

                for (var m3 = 0; m3 < pageDetails.checkedIDDetails.length; m3++) {
                    var NuObj = pageDetails.endpointresult.SemanticData.similarity_arr[pageDetails.checkedIDDetails[m3]].sim_per_facet;
                    mTabHeadData = mTabHeadData + '<div style="text-align: center;" class="col-xs-3 col-sm-3 col-xl-3 col-md-3 col-lg-3 col-3">' +
                        '<div class="row" style="justify-content: center;"><h3>' + NuObj.length + '</h3></div>' +
                        // makeTabs(pageDetails.endpointresult.SemanticData.similarity_arr[pageDetails.checkedIDDetails[m3]].sim_per_facet, 'tabs'+m3) + 
                        '</div>';
                }
                mTabHeadData = mTabHeadData + '</div></td></tr>';

                //First Row
                mTabHeadData = mTabHeadData + '<tr><td style="width:11%;vertical-align: middle;text-align: center;float: left;">Total Similar objects</td><td><div class="row" style="justify-content: center;vertical-align: middle;">';

                for (var m3 = 0; m3 < pageDetails.checkedIDDetails.length; m3++) {
                    var NuObj = pageDetails.endpointresult.SemanticData.similarity_arr[pageDetails.checkedIDDetails[m3]].sim_per_facet;
                    var objLen = 0;
                    for (var m31 = 0; m31 < NuObj.length; m31++) {
                        objLen = objLen + NuObj[m31].similarity_of_obj_type.length;
                    }
                    mTabHeadData = mTabHeadData + '<div style="text-align: center;" class="col-xs-3 col-sm-3 col-xl-3 col-md-3 col-lg-3 col-3">' +
                        '<div class="row" style="justify-content: center;"><h3>' + objLen + '</h3></div>' +
                        // makeTabs(pageDetails.endpointresult.SemanticData.similarity_arr[pageDetails.checkedIDDetails[m3]].sim_per_facet, 'tabs'+m3) + 
                        '</div>';
                }
                mTabHeadData = mTabHeadData + '</div></td></tr>';

                //Second Row
                mTabHeadData = mTabHeadData + '<tr><td style="width:11%;vertical-align: middle;text-align: center;float: left;">% Color Match</td><td><div class="row" style="justify-content: center;vertical-align: middle;">';

                for (var m4 = 0; m4 < pageDetails.checkedIDDetails.length; m4++) {
                    var resURL = pageDetails.endpointresult.SemanticData.similarity_arr[pageDetails.checkedIDDetails[m4]].base_img;
                    mTabHeadData = mTabHeadData + '<div style="text-align: center;" class="col-xs-3 col-sm-3 col-xl-3 col-md-3 col-lg-3 col-3">' +
                        '<div class="col-xs-12 col-sm-12 col-xl-12 col-md-12 col-lg-12 col-12">' +
                        mImagesAcc(pageDetails.checkedIDDetails[m4], 'color_distance') +
                        '</div>' +
                        '</div>';
                }
                mTabHeadData = mTabHeadData + '</div></td></tr>';

                //Third Row
                mTabHeadData = mTabHeadData + '<tr><td style="width:11%;vertical-align: middle;text-align: center;float: left;">% Shape Match</td><td><div class="row" style="justify-content: center;vertical-align: middle;">';

                for (var m5 = 0; m5 < pageDetails.checkedIDDetails.length; m5++) {
                    var resURL = pageDetails.endpointresult.SemanticData.similarity_arr[pageDetails.checkedIDDetails[m5]].base_img;
                    mTabHeadData = mTabHeadData + '<div style="text-align: center;" class="col-xs-3 col-sm-3 col-xl-3 col-md-3 col-lg-3 col-3">' +
                        '<div class="col-xs-12 col-sm-12 col-xl-12 col-md-12 col-lg-12 col-12">' +
                        mImagesAcc(pageDetails.checkedIDDetails[m5], 'size_distance') +
                        '</div>' +
                        '</div>';
                }
                mTabHeadData = mTabHeadData + '</div></td></tr>';

                mTabHeadData = mTabHeadData + '</tbody>';

                //End Of Table Body Data

                mTabData = mTabData + mTabHeadData + '</table>';

                mData = mData + mTabData + '</div></div>';

                $('#visualdialog').empty();
                $('#visualdialog').append(mData);

                // $('#exampleModalCenter').css('overflow-y', 'hidden')

                $('[id^="tabs"]').tabs();

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //creates the accordion for comparision
        function mImagesAcc(currObjInd, flagobj) {
            try {
                pageDetails.shapeexpflag = false;
                pageDetails.colorexpflag = false;
                var oCol = ((pageDetails.endpointresult.SemanticData.similarity_arr[currObjInd].overAllColor) * 100).toFixed(2);
                var oSiz = ((pageDetails.endpointresult.SemanticData.similarity_arr[currObjInd].overAllSize) * 100).toFixed(2);
                var accDiv = '';
                accDiv = accDiv + '<div>';

                //Accordion button
                accDiv = accDiv + '<div class="row">' +
                    '<input class="CmpTExplainBtnClass" data-toggle="collapse" type="button" id="cmpNBtn' + flagobj + currObjInd + '" data-target="#cmpBody' + flagobj + currObjInd + '" value="Overall ' + (flagobj == 'color_distance' ? 'Color' : 'Shape') + ' % is ' + (flagobj == 'color_distance' ? ((oCol=="NaN" || oCol==undefined)?0:oCol) : ((oSiz=="NaN" || oSiz==undefined)?0:oSiz)) + '"></input>';
                accDiv = accDiv + '</div>';

                //Accordion Body
                accDiv = accDiv + '<div class="row">';
                accDiv = accDiv + '<div id="cmpBody' + flagobj + currObjInd + '" class="collapse">';
                accDiv = accDiv + '<div style="height: auto !important;">';
                accDiv = accDiv + '<ul class="list-group" style="width: fit-content;">';

                for (var mi1 = 0; mi1 < pageDetails.endpointresult.SemanticData.similarity_arr[currObjInd].sim_per_facet.length; mi1++) {
                    var curTObj = pageDetails.endpointresult.SemanticData.similarity_arr[currObjInd].sim_per_facet;
                    for (var mi2 = 0; mi2 < curTObj[mi1].similarity_of_obj_type.length; mi2++) {
                        accDiv = accDiv + '<li class="list-group-item">'+ (flagobj == 'color_distance' ? 'Color' : 'Shape') +' % of ' + curTObj[mi1].similarity_of_obj_type[mi2].cat + ' in ' + curTObj[mi1].similarity_of_obj_type[mi2].color_name + ' box is ' + ((curTObj[mi1].similarity_of_obj_type[mi2][flagobj]) * 100).toFixed(2) + '</li>';
                    }
                }

                accDiv = accDiv + '</ul>';
                accDiv = accDiv + '</div>';
                accDiv = accDiv + '</div>';
                accDiv = accDiv + '</div>';

                accDiv = accDiv + '</div>';

                return accDiv;

            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //detects the accordion in comparision and expands all color
        $(document).on('click', '[id^="cmpNBtncolor_distance"]', function () {

            if (pageDetails.colorexpflag) {
                pageDetails.colorexpflag = false;
                $("[id^='cmpBodycolor_distance']").removeClass('in');
            } else {
                $("[id^='cmpBodycolor_distance']").addClass('in');
                pageDetails.colorexpflag = true;
            }
        });

        //detects the accordion in comparision and expands all shape
        $(document).on('click', '[id^="cmpNBtnsize_distance"]', function () {

            if (pageDetails.shapeexpflag) {
                pageDetails.shapeexpflag = false;
                $("[id^='cmpBodysize_distance']").removeClass('in');
            } else {
                $("[id^='cmpBodysize_distance']").addClass('in');
                pageDetails.shapeexpflag = true;
            }

        });

        function makeTabs(diffObjs, tabid) {
            try {

                //generate tabs data
                var tabsBody = '<div id="' + tabid + '" class="row col-xs-12 col-sm-12 col-xl-12 col-md-12 col-lg-12 col-12" style="display: inline-block;">';

                //generate UL list data
                var tabsUl = '<ul>';
                for (var c2 = 0; c2 < diffObjs.length; c2++) {
                    tabsUl = tabsUl + '<li><a href="#tabs-' + c2 + '">' + firstCaps(diffObjs[c2].similarity_of_obj_type[0].cat) + '</a></li>'
                }
                tabsUl = tabsUl + '</ul>';

                //generate ul specific tabs data
                var tabsUlData = '';
                for (var c3 = 0; c3 < diffObjs.length; c3++) {
                    tabsUlData = tabsUlData + '<div id="tabs-' + c3 + '" class"row">';
                    tabsUlData = tabsUlData + '<p>';

                    var tabsUlTableData = '';
                    tabsUlTableData = tabsUlTableData + '<table class="table tabTableCls"><thead class="thead-dark">' +
                        '<tr><th scope="col">#</th><th scope="col">Similar Object</th><th scope="col">Marked Box Color</th><th scope="col">% Color Match</th><th scope="col">% Shape Match</th></tr></thead>';

                    tabsUlTableData = tabsUlTableData + '<tbody>';

                    for (var c4 = 0; c4 < diffObjs[c3].similarity_of_obj_type.length; c4++) {
                        var curr2Obj = diffObjs[c3].similarity_of_obj_type[c4];
                        tabsUlTableData = tabsUlTableData + '<tr>';

                        tabsUlTableData = tabsUlTableData + '<th scope="row">' + (c4 + 1) + '</th>';
                        tabsUlTableData = tabsUlTableData + '<td scope="row">' + firstCaps(curr2Obj.cat) + (c4 + 1) + '</td>';
                        tabsUlTableData = tabsUlTableData + '<td scope="row">' + curr2Obj.color_name + '</td>';
                        tabsUlTableData = tabsUlTableData + '<td scope="row">' + (((curr2Obj.color_distance) * 100).toFixed(2)) + '</td>';
                        tabsUlTableData = tabsUlTableData + '<td scope="row">' + (((curr2Obj.size_distance) * 100).toFixed(2)) + '</td>';

                        tabsUlTableData = tabsUlTableData + '</tr>';
                    }

                    tabsUlTableData = tabsUlTableData + '</tbody>';

                    tabsUlTableData = tabsUlTableData + '</table>';

                    tabsUlData = tabsUlData + tabsUlTableData + '</p>';
                    tabsUlData = tabsUlData + '</div>';
                }

                tabsBody = tabsBody + tabsUl + tabsUlData + '</div>';
                return tabsBody;
            } catch (error) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    footer: JSON.stringify(error)
                });
            }
        }

        //End Of New functions for new explanation

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
    });
});