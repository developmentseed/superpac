var m, interaction;
var mm = com.modestmaps;
var baselayer = 'djohnson.world-dark';
var borders = 'mapbox.world-borders-light';
var subNationalPointData = '';
var activelayer = 'djohnson.superpacs-final';
var layers = [
        baselayer,
        borders,
        activelayer
    ];

_.each(['totals','obama','romney', 'gingrich', 'paul', 'santorum'], function(candidate) {

    $('#' + candidate).click(function(e) {
       
        $('.description').hide();
        $('#' + candidate + '-description').show();
    });
});


wax.tilejson('http://api.tiles.mapbox.com/v2/' + layers + '.jsonp', function(tilejson) {
    tilejson.minzoom = 3;
      tilejson.maxzoom = 5;
    m = new mm.Map('map', new wax.mm.connector(tilejson), null, [
        new mm.MouseHandler(),
        new mm.TouchHandler()
        ]
       
    );
    m.setCenterZoom(new mm.Location(32,-95), 4);
     tilejson.attribution = 'Powered by open source <a href="http://tilemill.com" target="_blank"> TileMill</a> ';
        wax.mm.legend(m, tilejson).appendTo(m.parent);
        interaction = wax.mm.interaction(m, tilejson);
        wax.mm.attribution(m, tilejson).appendTo(m.parent);
        wax.mm.zoomer(m, tilejson).appendTo($('#controls')[0]);
        wax.mm.bwdetect(m, {
            auto: true,
            png: '.png64?'
        });
    });
   


function refreshMap(layers) {
       wax.tilejson('http://api.tiles.mapbox.com/v2/' + layers + '.jsonp', function(tilejson) {
              tilejson.minzoom = 2;
              tilejson.maxzoom = 7;
              m.setProvider(new wax.mm.connector(tilejson));
              $('.wax-legends').remove();
              wax.mm.legend(m, tilejson).appendTo(m.parent);
              interaction.remove();
              interaction = wax.mm.interaction(m, tilejson);
          });
    }

// TODO: Change this
$(document).ready(function () {

    // Layer Selection
    $('ul li a').click(function (e) {
        e.preventDefault();
        if (!$(this).hasClass('active')) {
            $('ul li a').removeClass('active');
            
            $(this).addClass('active');
     
            var activelayer = $(this).attr('data-layer');
            layers = [
                baselayer,
                borders,
                activelayer
            ];
            refreshMap(layers);
        }
    });

    // Embed Code
    $('a.share').click(function(e){
        e.preventDefault();
        $('#share, #overlay').addClass('active');

        var twitter = 'http://twitter.com/intent/tweet?status=' +
        '1,000 Days Interactive Map ' + encodeURIComponent(window.location);
        var facebook = 'https://www.facebook.com/sharer.php?t=1000%20Days%20Interactive%20Map&u=' +
        encodeURIComponent(window.location);

        document.getElementById('twitter').href = twitter;
        document.getElementById('facebook').href = facebook;

        var center = m.pointLocation(new mm.Point(m.dimensions.x/2,m.dimensions.y/2));
        var embedUrl = 'http://api.tiles.mapbox.com/v2/' + layers + '/mm/zoompan,tooltips,legend,bwdetect.html#' + m.coordinate.zoom +
                        '/' + center.lat + '/' + center.lon;
        $('#embed-code-field textarea').attr('value', '<iframe src="' + embedUrl +
            '" frameborder="0" width="650" height="500"></iframe>');

        $('#embed-code')[0].tabindex = 0;
        $('#embed-code')[0].select();
    });

    // Trigger close buttons with the escape key
    $(document.documentElement).keydown(function (e) {
        if (e.keyCode === 27) { $('a.close').trigger('click'); }
    });

    $('a.close').click(function (e) {
        e.preventDefault();
        $('#share, #overlay').removeClass('active');
    });
});