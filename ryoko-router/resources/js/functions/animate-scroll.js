export default function() {
    $('.down').on("click", function() {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $anchor.parent().next().offset().top
        }, 500);
        return false;
    });
}
