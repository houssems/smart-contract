(function ($) {
    'use strict';

    // UPLOAD CLASS DEFINITION
    // ======================

    $('#js-upload-form').validate();

    var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');
    var inputFileElement = $('#js-upload-files');
    var selectedFileContainer = $('#selectedFile');
    var errorHandler = $('.section__upload--error');
    var previewDocument = $('#previewDocument');
    var fileNameEl = selectedFileContainer.find('.file-name');

    var selectedFiles;

    var creationDate = $('#creationDate');

    if (creationDate.text()) {
        creationDate.html(moment(creationDate.text()).format('DD/MM/YYYY HH:mm'));
    }

    $('#selectFile').click(function () {
        inputFileElement.trigger('click');
    });

    inputFileElement.change(function (e) {
        if (checkFileInput(e.target.files)) {
            setSelectedFile(e.target.files);
        } else {
            setSelectedFile([]);
        }
    });

    function setSelectedFile(files) {
        selectedFiles = files;
        if (selectedFiles.length > 0)
            fileNameEl.text(selectedFiles[0].name);
        else
            fileNameEl.text('');
    }

    if (fileNameEl) {
        fileNameEl.click(function () {
            var reader = new FileReader();

            reader.onload = function (e) {
                previewDocument.find('iframe').attr('src', e.target.result);
                previewDocument.modal("show");
            };

            reader.readAsDataURL(selectedFiles[0]);
        });
    }


    if (uploadForm) {
        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();
            orderSignerList();
            var uploadContainer = $('.upload-form');

            (!selectedFiles || (selectedFiles && selectedFiles.length === 0)) ?
                uploadContainer.addClass('invalid') :
                uploadContainer.removeClass('invalid');
            if ($('#js-upload-form').valid() && selectedFiles && selectedFiles.length && selectedFiles.length > 0) {
                displayLoadingBar();
                this.submit();
            }
        });
    }

    $('.loading-form').submit(displayLoadingBar);

    function checkFileInput(files) {
        errorHandler.hide();
        if (files.length > 1) {
            errorHandler.text('You can\'t select more than one file').show();
            return false;
        } else {
            var authorisedFileTypes = ['pdf', 'docx', 'doc'];
            var found = false;

            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                var ext = file.name.split('.').pop();
                if (authorisedFileTypes.indexOf(ext) === -1) {
                    found = true;
                    break;
                }
            }

            if (found) {
                errorHandler.text('Only document Word or PDF can be selected').show();
                return false;
            } else {
                errorHandler.hide();
            }
        }

        return true;
    }

    if (dropZone) {

        dropZone.ondrop = function (e) {
            e.preventDefault();
            this.className = 'upload-drop-zone';
            var files = e.dataTransfer.files;


            if (checkFileInput(files)) {
                $('#js-upload-files').prop('files', files);
                setSelectedFile(files);
            } else {
                $('#js-upload-files').prop('files', null);
                setSelectedFile([]);
            }
        };

        dropZone.ondragover = function () {
            this.className = 'upload-drop-zone drop';
            return false;
        };

        dropZone.ondragleave = function () {
            this.className = 'upload-drop-zone';
            return false;
        };
    }


    $('.select-contract').change(function (e) {
        console.log(e.target.value);
    });

    $.get('/users/all').done(function (users) {

        var html = '';
        users.map(function (user) {
            html += '<option value="' + user.ID + '">' + user.firstname + ' ' + user.lastname + '</option>'
        });

        $('#signataires-list').html(html).multiselect({
            title: "Select Signers"
        });
    });

    $('#verifyFingerPrint').click(function () {
        var docFingerPrint = $(this).data('id');

        $('.verify-errors').hide();
        displayLoadingBar();
        $.post('/signer/verify', {docFingerPrint: docFingerPrint})
            .done(function (data) {
                console.log(data);

                if (data && data.status) {
                    var status = parseInt(data.status);

                    if (status === 200) {
                        $('#confirmPinCode').modal("show");
                    } else {
                        $('.verify-errors').show().text(data.msg);
                    }
                }
            })
            .always(function () {
                hideLoadingBar();
            });
        ;
    });


    $('#pinCodeForm').submit(function (e) {

        e.preventDefault();
        var form = $(this);
        var action = form.attr("action");
        var formData = form.serializeArray();
        var data = {};
        $(formData).each(function (index, obj) {
            data[obj.name] = obj.value;
        });
        console.log(data);
        $('.pin-errors').hide();
        displayLoadingBar();

        $.post(action, data)
            .done(function (data) {
                console.log(data);

                if (data && data.docFingerPrint) {

                    var html = "<div class=\"panel panel-default\">" +
                        "        <div class=\"panel-heading\"><strong>Transaction details</strong></div>" +
                        "        <div class=\"panel-body\">" +


                        "            <div class=\"row\">" +
                        "                <div class=\"col col-xs-4\">Document finger print</div>" +
                        "                <div class=\"col col-xs-8\">" + data.docFingerPrint + "</div>" +
                        "            </div>" +

                        "            <div class=\"row\">" +
                        "                <div class=\"col col-xs-4\">Signer Id</div>" +
                        "                <div class=\"col col-xs-8\">" + data.signerId + "</div>" +
                        "            </div>" +

                        "            <div class=\"row\">" +
                        "                <div class=\"col col-xs-4\">Transaction Id</div>" +
                        "                <div class=\"col col-xs-8\">" + data.transactionId + "</div>" +
                        "            </div>" +


                        "        </div>" +
                        "    </div>";

                    $('#confirmPinCode').find('.modal-body').html(html);
                    $('#confirmPinCode').find('.modal-header h3').text('Thank you for confirming your Identity');
                } else if (data && data.msg) {
                    $('.pin-errors').show().text(data.msg);
                }


            })
            .always(function () {
                hideLoadingBar();
            });
    });

    function displayLoadingBar() {
        $('.loading-bar').show();
    }

    function hideLoadingBar() {
        $('.loading-bar').hide();
    }

    setNavigation();

    function setNavigation() {

        var path = window.location.pathname;
        path = path.replace(/\/$/, "");
        path = decodeURIComponent(path);

        $(".nav a").each(function () {
            var href = $(this).attr('href');
            if (path.substring(0, href.length) === href) {
                $(this).closest('li').addClass('active');
            }
        });
    }

    function orderSignerList() {
        var signerList = $('#signataires-list');
        if (signerList.length > 0) {
            var firstElement = signerList.find('option:first');
            var elements = $(".addedOption .text");

            for(var i = 0; i < elements.length; i++) {
                var elm = elements[i];
                var option = signerList.find('option:contains("' + elm.innerText + '")');
                $(option).insertBefore(firstElement);
            }
        }
    }

})(jQuery);
 

 