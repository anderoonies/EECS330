$(document).ready(function() {
    $('#plus-sign').click(function() {
        $('#run-entry').css('display', 'block');
    });

    $('html').click(function (e) {
        console.log(e.target.id)
        if (!((e.target.id == 'run-entry')||(e.target.id == 'plus-sign'))) {
            $('#run-entry').css('display', 'none');
        }
    });
});