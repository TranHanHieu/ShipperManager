$(document).ready(function() {
     //----- OPEN
     $("#btnLogin").on('click', function(e)  {
        $('[data-popup="popup-1"]').fadeIn(350);
            e.preventDefault();
    });

    //----- CLOSE
    $('[data-popup-close]').on('click', function(e)  {
        $('[data-popup="popup-1"]').fadeOut(350);
            e.preventDefault();
    });
});