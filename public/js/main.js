(function ($) {
    'use strict';

    // UPLOAD CLASS DEFINITION
    // ======================

    $('#js-upload-form').validate();

    var dropZone = document.getElementById('drop-zone');
    var uploadForm = document.getElementById('js-upload-form');
    var inputFileElement = $('#js-upload-files');
    var selectedFileContainer = $('#selectedFile');

    var selectedFiles;

    $('#selectFile').click(function () {
        inputFileElement.trigger('click');
    });

    inputFileElement.change(function (e) {
        setSelectedFile(e.target.files);
    });

    function setSelectedFile(files) {
        selectedFiles = files;
        selectedFileContainer.children().eq(1).text(selectedFiles[0].name);
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var uploadContainer = $('.upload-form');

            !selectedFiles ? uploadContainer.addClass('invalid') : uploadContainer.removeClass('invalid');
            if ($('#js-upload-form').valid() && selectedFiles) {
                this.submit();
            }
        });
    }

    if (dropZone) {
        dropZone.ondrop = function (e) {
            e.preventDefault();
            this.className = 'upload-drop-zone';
            $('#js-upload-files').prop('files', e.dataTransfer.files);
            setSelectedFile(e.dataTransfer.files);
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
})(jQuery);
 

 