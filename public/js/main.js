(function($) {
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

    inputFileElement.change(function(e){
        setSelectedFile(e.target.files);
    });

    function setSelectedFile(files) {
        selectedFiles = files;
        selectedFileContainer.children().eq(1).text(selectedFiles[0].name);
    }

    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var uploadContainer = $('.upload-form');

        !selectedFiles ? uploadContainer.addClass('invalid'): uploadContainer.removeClass('invalid');
        if ($('#js-upload-form').valid() && selectedFiles) {
            this.submit();
        }
    });

    dropZone.ondrop = function(e) {
        e.preventDefault();
        this.className = 'upload-drop-zone';
        $('#js-upload-files').prop('files', e.dataTransfer.files);
        setSelectedFile(e.dataTransfer.files);
    };

    dropZone.ondragover = function() {
        this.className = 'upload-drop-zone drop';
        return false;
    };

    dropZone.ondragleave = function() {
        this.className = 'upload-drop-zone';
        return false;
    };

    $.get('/users/all').done(function (users) {

        var html = '';
        users.map(function (user) {
            html += '<option value="' + user._id + '">' + user.name + '</option>'
        });

        $('#signataires-list').html(html).multiselect();
    })
})(jQuery);
 

 