$(document).ready(function() {

    function isSectionInView(id) {
        var currentScroll = $(document).scrollTop();
        var section = $("#section-" + id);
        var sectionMiddle = $(section).outerHeight(true) / 2;
        if (section.offset().top < (currentScroll + sectionMiddle) && (section.offset().top) > currentScroll - sectionMiddle) {
            return true;
        } else {
            return false;
        }
    }

    function updateMarkers() {
        $('.section-container').each(function() {
            //Change classes based on the section currently in view
            var id = $(this).attr('id').match(/\d+/g);
            if (isSectionInView(id)) {
                makeMarkerActive(id);
            } else {
                makeMarkerInactive(id);
            }
        });
        updateEventListeners();
    }

    function updateEventListeners() {
        //Remove all event listeners
        $(".active").off();

        //Reassign event listeners based on which markers are active or not
        $(".inactive").on('mouseenter', function() {
            var id = $(this).attr('id').match(/\d+/g);
            $(this).html(parseInt(id) + 1);
        });

        $(".inactive").on('mouseleave', function() {
            $(this).html('--');
        });

        //Add event listeners to inactive page markers to scroll to element on click
        $(".inactive").click(function() {
            var id = $(this).attr('id').match(/\d+/g);
            $('html, body').stop().animate({
                scrollTop: $("#section-" + id).position().top
            }, 600);
        });
    }

    function makeMarkerActive(id) {
        $('#page-marker-' + id).removeClass('inactive').addClass('active').html(parseInt(id) + 1);
    }

    function makeMarkerInactive(id) {
        $('#page-marker-' + id).removeClass('active').addClass('inactive').html('--');
    }


    //CONTROLLER

    //Add page markers that correspond to sections to the scrollbar
    $(".section-container").each(function(index) {
        $("#scroller").append('<p id="page-marker-' + index + '" class="page-marker inactive">--</p>')
    });

    updateMarkers();

    $(window).scroll(updateMarkers);
});