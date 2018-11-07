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

        if ($('#js-upload-form').valid()) {
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
    $('#signataires-list').multiselect();
})(jQuery);
 

 