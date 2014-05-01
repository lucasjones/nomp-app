$(function () {
    function applyPlaceholdem() {
        setTimeout(function () {
            Placeholdem($('[placeholder]').not('.placeholdem_done').addClass('placeholdem_done'));
        }, 0);
    }

    function applyToolTipster() {
        $('.tooltip').not('.tooltip_done').addClass('tooltip_done').each(function () {
            var elem = $(this);
            elem.tooltipster({
                theme: 'tooltipster-light',
                position: elem.attr('tooltip-side') || 'top',
                offsetX: parseInt(elem.attr('offset-x')) || 0,
                offsetY: parseInt(elem.attr('offset-y')) || 0,
                updateAnimation: false,
                speed: 350,
                delay: 0
            });
        });
    }

    $(document).bind("DOMNodeInserted", function () {
        applyPlaceholdem();
        applyToolTipster();
    });
    applyPlaceholdem();
    applyToolTipster();
});
