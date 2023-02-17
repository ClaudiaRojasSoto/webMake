
(function($, window, undefined) {

    $.fn.objectFitPolyfill = function(options) {

        // If the browser does support object-fit, we don't need to continue
        if ('objectFit' in document.documentElement.style !== false) {
           return;
        }

        // Setup options
        var settings = $.extend({
            "fit": "cover",
            "fixContainer": false,
        }, options);

        return this.each(function() {

            var $image = $(this);
            var $container = $image.parent();

            var coverAndPosition = function() {
                // If necessary, make the parent container work with absolutely positioned elements
                if (settings.fixContainer) {
                    $container.css({
                        "position": "relative",
                        "overflow": "hidden",
                    });
                }

                // Mathematically figure out which side needs covering, and add CSS positioning & centering
                $image.css({
                    "position": "absolute",
                    "height": $container.outerHeight(),
                    "width": "auto"
                });

                if (
                    settings.fit === "cover"   && $image.width() < $container.outerWidth() ||
                    settings.fit === "contain" && $image.width() > $container.outerWidth()
                ) {
                    $image.css({
                        "top": "50%",
                        "left": 0,
                        "height": "auto",
                        "width": $container.outerWidth(),
                        "marginLeft": 0,
                    }).css("marginTop", $image.height() / -2);
                } else {
                    $image.css({
                        "top": 0,
                        "left": "50%",
                        "marginTop": 0,
                    }).css("marginLeft", $image.width() / -2);
                }
            };

            // Init - wait for the image to be done loading first, otherwise dimensions will return 0
            $image.on("load", function(){
                coverAndPosition();
            });
            // IE will sometimes get cache-happy and not register onload.
            coverAndPosition();

            // Recalculate widths & heights on window resize
            $(window).resize(function() {
                coverAndPosition();
            });

        });

    };

})(jQuery, window);


jQuery( document ).ready( function( $ ){

    ///return false;

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    var is_mobile =  isMobile.any();


	var renderVideoTag = function( $s ) {
		var video_mp4   = $s.attr('data-mp4')  || '',
			video_webm  = $s.attr('data-webm') || '',
			video_ogv   = $s.attr('data-ogv')  || '';

		if ( video_mp4 || video_webm || video_ogv ) {
			var $v = $( '<video autoplay loop muted playsinline id="hero-video-player" class="fill-width">' );
			$s.prepend( $v );
			var obj = document.getElementById('hero-video-player');
			obj.addEventListener('loadeddata', function() {
				if( obj.readyState >= 1 ) {
					$s.find( '.hero-slideshow-wrapper' ).addClass( 'loaded');
					$s.find( '.slider-spinner').remove();
				}
			});
			$v.html( OnePress_Plus.browser_warning );
			if ( video_mp4 ) {
				$v.append( $( ' <source type="video/mp4"/>' ).attr( 'src', video_mp4 ) );
			}
			if ( video_webm ) {
				$v.append( $( ' <source type="video/webm"/>' ).attr( 'src', video_webm ) );
			}
			if ( video_ogv ) {
				$v.append( $( ' <source type="video/ogv"/>' ).attr( 'src', video_ogv ) );
			}

			$v.objectFitPolyfill();
		}
	}

    /**
     * Section video
     */
    $( '.video-section').each( function(){

        var $s = $( this);
        var fallback = $s.attr( 'data-fallback' ) || 'true';
		var bg = $s.attr('data-bg') || '';
        if ( is_mobile && bg !== '' ) {
			if( 'false' === fallback ) {
				renderVideoTag( $s );
			} else {
				if( bg ) {
					$( '.fill-width', $s).remove();
					$s.addClass( 'video-bg' );
					$s.css( 'backgroundImage', "url('"+bg+"')" );
					$s.find( '.hero-slideshow-wrapper' ).addClass( 'loaded');
					$s.find( '.slider-spinner').remove();
				}
            }
        } else {
            renderVideoTag( $s );
        }

    } );




    function pauseAllVideos()
    {
        if ( ! is_mobile ) {
            $('.section-projects iframe').each(function () {
                this.src = this.src; //causes a reload so it stops playing, music, video, etc.
            });
        }
    }




    /**
     * Projects section
     */
    $( '.project-wrapper').each( function(){
        var wrapper =  $( this );
        var wrapperWidth = wrapper.width();


        var calcItemIndex = function( numcol, currentIndex ){
            if ( numcol <= 1 ) {
                return currentIndex;
            }
            var c = 0;
            var nextIndex = 0;
            $( '.project-item', wrapper ).each(  function( i ){
                if ( c == numcol - 1 ) {
                    if ( nextIndex <= 0 ) {
                        if (i >= currentIndex) {
                            nextIndex = currentIndex + ( i - currentIndex ) ;
                        }
                    }
                    c = 0;
                } else {
                    c ++;
                }
            });
            return nextIndex ? nextIndex : currentIndex;
        };
        var closeAllProjects = function( not_id ){
            if ( ! is_mobile ) {
                $( '> .project-detail', wrapper ).each( function(){
                    var details = $( this );
                    var id = details.data( 'id' );
                    if ( typeof not_id === "undefined" || id != not_id ) {
                        var pr  = $( '.project-item[data-id="'+id+'"]');
                        details.removeClass( 'active opening' );
                        pr.removeClass( 'active' );
                        pr.append( details );
                    }
                } );
            }
        };

        $( window ).resize( function(){
			wrapperWidth = wrapper.width();
			
			var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
			if ( 'undefined' !== typeof fullscreenElement && $(fullscreenElement).is( 'iframe[src*="player.vimeo.com"], iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"], iframe[src*="dailymotion.com"], iframe[src*="kickstarter.com"][src*="video.html"], object, embed, video.wp-video-shortcode' ) ) {
				//Full screen mode by video.
			} else {
				closeAllProjects( );
			}
			
        } );

		var l = $( '.project-item.is-ajax', wrapper ).length;
		var adminBarHeight = 0;
		if ( $( '#wpadminbar').length > 0 ) {
			adminBarHeight = $( '#wpadminbar').height();
		}

        $( '.project-item.is-ajax', wrapper ).each(  function( projectIndex ){
            var project = $( this );
            project.data( 'index', projectIndex );

            project.on( 'click', function( e ){
                e.preventDefault();

                if ( project.hasClass( 'opening' ) ) {
                    return false;
                }

                project.addClass( 'opening' );

                var numcol = Math.round( wrapperWidth/ project.width() );
                var insertAfterIndex;
                if ( numcol > l ) {
                    insertAfterIndex = l -1;
                } else {
                    insertAfterIndex = calcItemIndex( numcol, projectIndex );
                }

                var insertAfter = $( '.project-item', wrapper).eq( insertAfterIndex );
                if ( insertAfter.length <= 0 ) {
                    insertAfter = project.next();
                }

                var projectDetails = null;
                pauseAllVideos();
                var  post_id =  project.data( 'id' ) || '';

                closeAllProjects( post_id );
                if ( project.hasClass( 'active' ) ) {
                    project.removeClass('active').css( 'height', 'auto' );
                    project.removeClass( 'loading').find( '.project-thumb').find( '.spinner' ).remove();
                } else {
                    project.addClass( 'loading').find( '.project-thumb').append( '<div class="spinner">' );
                    if ( $( '.project-expander', project ).length  > 0 ) {
                        project.addClass( 'active' );
                        project.removeClass( 'loading').find( '.spinner').remove();
                        projectDetails = $( '#project-details-id-'+post_id );
                        projectDetails.insertAfter( insertAfter );
                        setTimeout( function(){
                            projectDetails.addClass( 'active' );
                            project.removeClass( 'opening' );
                        }, 50 );

                    } else {
                        if (  post_id ) {
                            $.ajax( {
                                url: OnePress_Plus.ajax_url,
                                data: { action: 'onepress_plus_ajax', onepress_ajax_action: 'load_portfolio_details', post_id: post_id },
                                dataType: 'json',
                                type: 'post',
                                success:  function( data ){
                                    if( data.success ) {
                                        // Close all open projects before
                                        closeAllProjects( post_id );
                                        var c = $(  data.data );
                                        project.append( c );
                                        project.imagesLoaded(function () {
                                            // Gather all videos
                                            project.addClass( 'active' );
                                            project.removeClass( 'loading').find( '.spinner').remove();
                                            var $all_videos = c.find( 'iframe[src*="player.vimeo.com"], iframe[src*="youtube.com"], iframe[src*="youtube-nocookie.com"], iframe[src*="dailymotion.com"], iframe[src*="kickstarter.com"][src*="video.html"], object, embed, video.wp-video-shortcode' );
                                            $all_videos.each( function(){
                                                var $video = $(this);
                                                $video.wrap( '<div class="video-rp"/>' );
                                            } );

                                            projectDetails = $( '#project-details-id-'+post_id );
                                            projectDetails.insertAfter( insertAfter );
                                            setTimeout( function(){
                                                projectDetails.addClass( 'active' );
                                                project.removeClass( 'opening' );
                                            }, 50 );

                                        });

                                    }
                                }

                            });
                        }
                    }
                }
                $('html, body').animate({
                    scrollTop: project.offset().top - $( '#masthead').outerHeight() - adminBarHeight - 30
                }, 600);
            } );


        } );


        $( 'body' ).on( 'click', '.project-detail .project-trigger-close', function( e ){
            e.preventDefault();
            var details = $( this).closest( '.project-detail' );
            var id = details.data( 'id' );
            var project  = $( '.project-item[data-id="'+id+'"]');
            details.removeClass( 'active' );
            project.removeClass( 'active' );
            pauseAllVideos();
            $('html, body').animate({
                scrollTop: project.offset().top - $( '#masthead').outerHeight() - adminBarHeight - 30
            }, 600, function(){
               // $( window ).resize();
                project.append( project );
                project.removeClass( 'opening' );
            });

        } );

    } );



    /**
     * Section map
     *
     */

    $( '.onepress-map').each( function() {
        var mapArea = $( this )[0];

        var data =  $( this ).data( 'map' );
        if ( ! data ) {
            return ;
        }
        var settings = $.extend( {}, {
            'lat': false,
            'long' : false,
            'zoom' : 10,
            'maker' : '',
            'maker_w' : '',
            'maker_h' : '',
            'color' : '',
            'html' : '',
            'address' : '',
            'items_address' : {},
			'scrollwheel' : false,
			'map_info_default_open' : false,
        }, data );

        var center = {};
        var html = '';
        var centerIcon = null;
        var infowindow = null;

        if ( settings.lat && settings.long ) {
            center.lat = settings.lat;
            center.lng = settings.long;
        }

        var mapOptions = {
            zoom: settings.zoom || 12,
            center: center,
            controls: {
                panControl: true,
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: true,
                overviewMapControl: true
            },
            scrollwheel: settings.scrollwheel,
            maptype: 'ROADMAP',
        };


        var map = new google.maps.Map(mapArea, mapOptions);

		var in_customizer = false;
		if ( typeof wp !== 'undefined' ) {
			in_customizer =  typeof wp.customize !== 'undefined' ? true : false;
		}
		if ( in_customizer ) {
			var onepress_style_tag = $( '#onepress-style-inline-css' );
			if ( onepress_style_tag.length > 0 ) {
				var css_code = onepress_style_tag.html();
				onepress_style_tag.replaceWith( '<style class="replaced-style">'+css_code+'</style>' );
			}
		}

        if (settings.color != '') {
            var styles = [
                {
                    stylers: [
                        {hue: settings.color},
                        // {saturation: -20}
                    ]
                }, {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [
                        {lightness: 40},
                        {visibility: "simplified"}
                    ]

                }
            ];

            map.set('styles', styles);
        }


        if (settings.maker) {

            var iconsize = [64, 64], iconanchor = [32, 64];
            if (settings.maker_w && settings.maker_h) {
                iconsize = [settings.maker_w, settings.maker_h];
                iconanchor = [settings.maker_w / 2, settings.maker_h];
            }

            centerIcon = {
                url: settings.maker,
                size: new google.maps.Size(iconsize[0], iconsize[1]),
                anchor: new google.maps.Point(iconanchor[0], iconanchor[1])
            };

        }

        if (settings.address) {
            html += '<div class="map-address">' + settings.address + '</div>';
        }

        if (settings.html) {
            html += '<div class="map-extra-info">' + settings.html + '<div>';
        }

        if (html) {
            infowindow = new google.maps.InfoWindow({
                content: '<div class="gmap_marker">' + html + '</div>'
            });

            var marker = new google.maps.Marker({
                position: center,
                map: map,
                title: null,
                icon: centerIcon
            });
        }

		
		if ( settings.map_info_default_open ) {
			infowindow.open(map, marker);
		}
        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });

        // List address

        if (settings.items_address && settings.items_address.length) {

            $.each(settings.items_address, function (index, address) {
                var _html = '';
                if (address.address) {
                    _html += '<div class="map-address ">' + address.address + '</div>';
                }

                if (address.desc) {
                    _html += '<div class="map-extra-info">' + address.desc + '<div>';
                }

                var pos = {};
                pos.lat = address.lat;
                pos.lng = address.long;
                var icon;

                if (address.maker) {

                    var _iconsize = [64, 64], _iconanchor = [32, 64];
                    if (address.h && address.w) {
                        _iconsize = [address.w, address.h];
                        _iconanchor = [address.w / 2, address.h];
                    }

                    icon = {
                        url: address.maker,
                        size: new google.maps.Size(_iconsize[0], _iconsize[1]),
                        anchor: new google.maps.Point(_iconanchor[0], _iconanchor[1])
                    };
                } else if (centerIcon) {
                    icon = centerIcon;
                } else {
                    icon = null;
                }

                var _marker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: null,
                    icon: icon
                });

                var _infowindow = new google.maps.InfoWindow({
                    content: '<div class="gmap_marker">' + _html + '</div>'
                });

                _marker.addListener('click', function () {
                    _infowindow.open(map, _marker);
                });

            });
        }

	});


	$(".clients-carousel").each( function(){

		var wrap = $( this );
		var settings = wrap.data( 'settings' );
	
		wrap.owlCarousel({
			nav: settings.nav,
			dots: settings.dots,
			autoheight: false,
			navText: [ '<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>' ],
			responsiveBaseElement: document.body,
			responsiveRefreshRate: 200,
			responsive:{
				0:{
					items: settings.devices.mobile,
				},
				768:{
					items: settings.devices.tablet,
				},
				1100:{
					items: settings.devices.desktop,
					loop:false
				}
			}
		});

	} );
	



} ); // End document ready.
