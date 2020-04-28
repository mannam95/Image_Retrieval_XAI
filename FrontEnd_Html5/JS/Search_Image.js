define(['jquery'], function($) {
    $(function() {

        // store all the variables as an object properties
        var pageDetails = {
            data: 'Testing',
            imageName: '',
            duplicateImageName: '',
            displayImageCharacterslen: 15,
            currentBrowserURL: $(location).attr('href'),
            idDetails: ['#MainDiv', '#hideLabelId', '#fileUploadID', '#fileNameId', '#fileImgID', '#SearchBtn']
        };

        //When everything is loaded what to do first
        $(document).ready(function() {
            try {
                //loader before loading the data
                // $('body').addClass("loading");
                $(pageDetails.idDetails[0]).show();
                $(pageDetails.idDetails[1]).hide();
            } catch (error) {
                alert(JSON.stringify(error));
            }

        });

        //detect change events when the user browses for an image
        $(pageDetails.idDetails[2]).change(function(e) {
            try {
                if (this.files && this.files.length > 0) {
                    if (filesizevalidation(pageDetails.idDetails[2])) {
                        pageDetails.duplicateImageName = pageDetails.imageName = e.target.value.split('\\').pop();
                        if (pageDetails.imageName.length > pageDetails.displayImageCharacterslen) {
                            pageDetails.duplicateImageName = pageDetails.imageName.slice(0, 4) + '....' + pageDetails.imageName.slice(pageDetails.imageName.length - 6, pageDetails.imageName.length)
                        }
                        $(pageDetails.idDetails[3]).text(pageDetails.duplicateImageName);
                        $(pageDetails.idDetails[1]).show();

                    } else {
                        alert("Invalid File! Please select a valid file");
                    }
                }
            } catch (error) {
                alert(JSON.stringify(error));
            }
        });

        //remove the file context when the user clicks on remove image symbol and hide
        $(pageDetails.idDetails[4]).click(function() {
            try {
                $(pageDetails.idDetails[2]).val('');
                $(pageDetails.idDetails[1]).hide();
                pageDetails.duplicateImageName = pageDetails.imageName = '';
            } catch (error) {
                alert(JSON.stringify(error));
            }
        });

        //On click of the search button
        $(pageDetails.idDetails[5]).click(function() {
            try {
                if ($(pageDetails.idDetails[2]).val() == '' || $(pageDetails.idDetails[2]).val() == null || $(pageDetails.idDetails[2]).val() == undefined) {
                    alert("Please select an image");
                } else {
                    console.log("Proceed further");
                }
            } catch (error) {
                alert(JSON.stringify(error));
            }
        });

        //this function will validate the file whether it is an image or not and valid file or not
        function filesizevalidation(fileuploadid) {
            var fileMinSize = 0;
            var fileValidation = false;
            var fileInput = $(fileuploadid);
            for (var i = 0; i < fileInput[0].files.length; i++) {
                if (fileInput[0].files[i].size > fileMinSize) {
                    fileValidation = true;
                } else {
                    fileValidation = false;
                    break;
                }
            }
            return fileValidation;
        }

    });

});