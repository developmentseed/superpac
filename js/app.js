var m, interaction, mm = com.modestmaps;
var baselayer = 'mapbox.world-blank-bright';
var borders = 'djohnson.usa_borders';
var activelayer = 'djohnson.all_superpacs';
var layers = [
        baselayer,
        borders,
        activelayer
    ];


wax.tilejson('http://api.tiles.mapbox.com/v2/' + layers + '.jsonp', function(tilejson) {
        tilejson.minzoom = 3;
        tilejson.maxzoom = 6;
        b = new mm.Map('map', new wax.mm.connector(tilejson), null, null);
        m = new mm.Map('map', new wax.mm.connector(tilejson), null, [
            new mm.MouseHandler(),
            new mm.TouchHandler()
            ]
    );
        m.setCenterZoom(new mm.Location(38,-76), 4);
        tilejson.attribution = 'Maps made with open source <a href="http://tilemill.com" target="_blank"> TileMill</a>.  <a href="http://reporting.sunlightfoundation.com/super-pacs/file-downloads/"> Data</a> from the Sunlight Foundation from <a href="http://www.fec.gov/data/IndependentExpenditure.do?format=html&election_yr=2012"/>FEC</a>, Februrary 22, 2012.<br /> Data covers November 22, 2011 to February 22, 2012.';

        myTooltip = new wax.tooltip;
        myTooltip.getTooltip = function(feature, context) {
            return $('#tooltips').html('<div class="inner">' + feature + '</div>').get(2);
        }
        myTooltip.hideTooltip = function(feature, context) {
            $('#tooltips').html('');
        }

        interaction = wax.mm.interaction(m, tilejson, {callbacks: myTooltip,clickAction: ['full', 'teaser', 'location']});
           tilejson.minzoom = 3;
           tilejson.maxzoom = 6;
           m.addCallback("drawn", function (m) {
             b.setCenterZoom(m.getCenter(), m.getZoom());
           });
           m.setProvider(new wax.mm.connector(tilejson));
        wax.mm.attribution(m, tilejson).appendTo(m.parent);
        wax.mm.zoomer(m, tilejson).appendTo($('#controls')[0]);
        wax.mm.bwdetect(m, {
            auto: true,
            png:'.png64?'
        });
    });
   



function refreshMap(layers) {
    
       wax.tilejson('http://api.tiles.mapbox.com/v2/' + layers + '.jsonp', function(tilejson) {
               tilejson.minzoom = 3;
               tilejson.maxzoom = 5;
               m.setProvider(new wax.mm.connector(tilejson));
               $('#tooltips').empty();
               interaction.remove();
               legend = wax.mm.legend(m, tilejson).appendTo(document.getElementById('tooltips'));
               interaction = wax.mm.interaction(m, tilejson,{callbacks: myTooltip,clickAction: ['full', 'teaser', 'location']});
          });
    }


$(document).ready(function () {
   $('.description').hide();
   $('#description-totals').show();

    // Layer Selection
    $('a.candidate-tab').click(function(e) {
        $('a.candidate-tab').removeClass('active');
        $(e.currentTarget).addClass('active');
        var candidate = $(e.currentTarget).attr('id');
        $('.description').hide();
        $('#description-' + candidate).show();
          
    });
});

$('ul li a').click(function (e) {
      if (!$(this).hasClass('active')) {
      $('ul li a').removeClass('active');
     
       $(this).addClass('active');
   
            var activeLayer = $(this).attr('data-layer');
            layers = [
                baselayer,
                borders,
                activeLayer
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
