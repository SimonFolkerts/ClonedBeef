$(document).ready(function() {

    //Inactive page markers string
    var inactiveText = '--';


    //Scroll a specified section to the top of the view
    function scrollToSection(target, smooth) {
        var id = $(target).attr('id').match(/\d+/g);
        var stepHeading = $("#step-heading-" + id);
        var stepTop = $(stepHeading).offset().top;
        $('html, body').stop().animate({
            scrollTop: stepTop - $(window).height() / 9
        }, (smooth ? 600 : 0));
    }

    //Check whether the specified section is in view, true or false
    function isSectionInView(id) {
        var stepHeading = $("#step-heading-" + id);
        //Scroll position
        var currentScroll = $(document).scrollTop();
        //If the middle is in view then true
        if ((stepHeading.offset().top < currentScroll + $(window).height()) && (stepHeading.offset().top > currentScroll)) {
            return true;
        } else {
            return false;
        }
    }

    //Check all sections, if in view is true, set styling to 'active'
    //This function executes in this particular order to minimise time spent between
    //removing the class and then reapplying it, preserving smooth functionality.
    function updateMarkers() {
        var active = '';
        var markers = $('.section-container');
        //Select teh marker to be made active
        markers.each(function() {
            //Get current section id number
            var id = $(this).attr('id').match(/\d+/g);
            //Select active
            if (isSectionInView(id)) {
                active = id;
            }
        });
        if ($('#page-marker-' + active).hasClass("inactive")) {
            //If the selected marker was previously inactive, clear all markers
            markers.each(function() {
                var id = $(this).attr('id').match(/\d+/g);
                makeMarkerInactive(id);
            });
            //Apply active style to selected marker
            makeMarkerActive(active);
        }

        //Update click listeners
        updateEventListeners();
    }

    function updateEventListeners() {
        //Remove all event listeners
        $(".active").off();

        //Reassign event listeners based on which markers are active or not
        $(".inactive").on('mouseenter', function() {
            var id = $(this).attr('id').match(/\d+/g);
            $(this).html(parseInt(id));
        });
        $(".inactive").on('mouseleave', function() {
            $(this).html(inactiveText);
        });

        //(re-)add event listeners to inactive page markers to scroll to element on click
        $(".inactive").click(function() {
            scrollToSection($(this), true);
        });
    }

    //Remove inactive, add active class
    function makeMarkerActive(id) {
        $('#page-marker-' + id).removeClass('inactive').addClass('active').html(parseInt(id));
    }

    //Vice versa
    function makeMarkerInactive(id) {
        $('#page-marker-' + id).removeClass('active').addClass('inactive').html(inactiveText);
    }

    function parallaxDisplace() {
        //Parallax effect
        var layers = document.getElementsByClassName("parallax");
        var layer, speed, yPos;
        for (var i = 0; i < layers.length; i++) {
            layer = layers[i];
            var top = ($(layer).parent().offset().top) - ($(window).scrollTop());
            speed = layer.getAttribute('data-speed');
            var yPos = -(top * speed / 100);
            $(layer).css({
                'transform': 'translateY(' + yPos + 'px)'
            });

        }
    }

    //Randomise the position, size and speed of the floater and parallax elements
    $(function() {
        $(".background-floater").each(function() {
            var sizeAndSpeed = (Math.floor(Math.random() * 40 + 15));
            $(this).css({
                'left': (Math.floor(Math.random() * 150 - 50)) + '%',
                'top': (Math.floor(Math.random() * 100) - 50) + '%',
                'font-size': (sizeAndSpeed * 50) + '%',
                'opacity': sizeAndSpeed / 60
            });
            $(this).parent().attr('data-speed', -sizeAndSpeed + 100);
        });
    });

    //Add special rules for the first and last entry for tidyness
    $(".section-container:last").addClass("last");

    $(".section-container:first").addClass("first");



    //########## CONTROLLER ##########//

    //Add page markers that correspond to sections to the scrollbar
    $(".section-container").each(function(index) {
        $("#scroller").append('<p id="page-marker-' + (index + 1) + '" class="page-marker inactive">' + inactiveText + '</p>')
    });

    //Add onScroll events
    $(window).scroll(function() {
        parallaxDisplace();
        updateMarkers();
    });

    //Initial marker update
    updateMarkers();

    //Do scroll to 
    $(window).scrollTop(0).scrollTop(1);
    scrollToSection($("#section-1"), false);
});