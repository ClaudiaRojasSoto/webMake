jQuery( document ).ready( function( $ ){
    $('.section-op-slider').each( function(){

        var $slider = $( this );
        var  $wrapper =  $( this ).parent();
        var h = $slider.height();
		var settings = $slider.data( 'settings' ) || {};
		
		if ('objectFit' in document.documentElement.style !== true) {
			$slider.find('.item > img').css({
				'top': '50%',
				'left': '50%',
				'transform': 'translate(-50%, -50%)',
			});
		}

        settings.items = 1;

        var owl = $slider.owlCarousel( settings );

        owl.on('changed.owl.carousel', function(event) {
            $slider.height( '' );
            h = $slider.height();
            parallax();
        });

        owl.on('initialize.owl.carousel', function(event) {
            $slider.height( '' );
            h = $slider.height( );
            parallax();
        });

        function parallax(){

            if ( ! settings.parallax ) {
                return false;
            }

            var scrolled = $(window).scrollTop();
            var o = $wrapper.offset();
            var h = $slider.height();
            // $wrapper.height( h );
            if ( scrolled >= o.top ) {

                var diff = scrolled - o.top  ;

                var sliderHeight = h - diff;
                if ( sliderHeight < 0 ) {
                    sliderHeight = 0;
                }

                var _tt = diff  / 3.5;
                $slider.css( 'transform', 'translateY('+( _tt  )+'px)' );

                var $active = $( '.owl-item.active', owl ).eq( 0 );
                var active_content_height = $active.find( '.item--content' ).height();

                var op = 1 - ( diff * 1.8 / h);

                if (  active_content_height > sliderHeight  ) {
                    op = 0;
                }

                $( '.owl-dots', $slider ).css( 'transform', 'translateY('+( - _tt  )+'px)' );

                $( '.item--content, .owl-nav, .owl-dots', $slider ).css(  {
                    'opacity': op,
                } );

            } else {

                $slider.css( 'transform', 'translateY('+( 0 )+'px)' );
                $( '.owl-dots', $slider )
                $wrapper.height( 'auto' );
                $( '.item--content, .owl-nav, .owl-dots', $slider ).css(  {
                    'opacity' :   1 ,
                }  );
            }

        }

        $(window).scroll(function(){
            parallax();
        });

        $(window).resize(function(){
            parallax();
        });

    } );


});