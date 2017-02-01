$(document).ready(function() {

    $('html, body').scrollTop(0).scrollTop(1).scrollTop(0);
    //Add page markers that correspond to sections to the scrollbar
    $(".section-container").each(function(index) {
        $("#scroller").append('<p id="page-marker-' + index + '" class="page-marker">--</p>')
    });

    //Add event listeners to the page markers to scroll to element on click
    var id;
    $(".page-marker").click(function() {
        id = $(this).attr('id').match(/\d+/g); //Get number from scroll marker id
        $('html, body').stop().animate({
            scrollTop: $("#section-" + id).position().top
        }, 600);
    });

    $(window).scroll(function() {
        var currentScroll = $(document).scrollTop();
        $(".section-container").each(function() {
            if ($(this).offset().top < (currentScroll + $(this).outerHeight(true) / 2)) {
                var id = $(this).attr('id').match(/\d+/g);
                $('#page-marker-' + id).addClass('page-marker-current').html('0' + (parseInt(id) + 1));
            } else {
                $('#page-marker-' + id).removeClass('page-marker-current').html('--');
            }
        });
        console.log("\n\n\n");
    });


});