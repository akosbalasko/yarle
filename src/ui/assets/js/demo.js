current_color = $('.wizard-card').data('color');
full_color = true;

$(document).ready(function(){

     $('.fixed-plugin a, .fixed-plugin .badge').click(function(event){
      // Alex if we click on switch, stop propagation of the event, so the dropdown will not be hide, otherwise we set the  section active
        if($(this).hasClass('switch-trigger')){
            if(event.stopPropagation){
                event.stopPropagation();
            }
            else if(window.event){
               window.event.cancelBubble = true;
            }
        }
    });

    $('.fixed-plugin .badge').click(function(){

        $wizard = $('.wizard-card');
        $button_next = $('.wizard-card .wizard-footer').find('.pull-right :input');



        $(this).siblings().removeClass('active');
        $(this).addClass('active');

        var new_color = $(this).data('color');

        $wizard.fadeOut('fast', function(){

            $wizard.attr("data-color", new_color);
            $button_next.removeClass(converterColor(current_color)).addClass(converterColor(new_color));

            current_color = new_color;
            $wizard.fadeIn('fast');
        });
    });

    function converterColor(color){
        switch (color) {
            case 'blue':
                return 'btn-info';
                break;
            case 'orange':
                return 'btn-warning';
                break;
            case 'azure':
                return 'btn-primary';
                break;
            case 'red':
                return 'btn-danger';
                break;
            case 'green':
                return 'btn-success';
                break;
        }
    }
});
