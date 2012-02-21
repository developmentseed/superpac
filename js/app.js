var m;
var mm = com.modestmaps;
var baselayer = 'mapbox.world-bright';
var borders = 'djohnson.superpacs';
var nationalPointData = '';
var subNationalPointData = '';
var activeLayer = '';
var layers = [
        baselayer,
        activeLayer,
        borders,
        nationalPointData,
        subNationalPointData
    ];

wax.tilejson('http://api.tiles.mapbox.com/v2/' + layers + '.jsonp', function(tilejson) {
    tilejson.minzoom = 2;
      tilejson.maxzoom = 7;
    m = new mm.Map('map', new wax.mm.connector(tilejson), null, [
        new mm.MouseHandler(),
        new mm.TouchHandler()
        ]
    );
    m.setCenterZoom(new mm.Location(36,-94), 4);
    tilejson.attribution = 'Powered by open source <a href="http://tilemill.com" target="_blank"> TileMill</a> ';
    wax.mm.legend(m, tilejson).appendTo(m.parent);
    wax.mm.interaction(m, tilejson);
    wax.mm.attribution(m, tilejson).appendTo(m.parent);
    wax.mm.zoomer(m, tilejson).appendTo($('#controls')[0]);
    wax.mm.bwdetect(m, {
        auto: true,
        png: '.png64?'
    });
});

$(document).ready(function()
{
    //set the originals
    var originalWinWidth = $(window).width();
 
    //set the original font size
    var originalFontSize = 30;
 
    //set the ratio of change for each size change
    var ratioOfChange = 50;
 
    //set the font size using jquery
    $("about").css("font-size", originalFontSize);
 
    $(window).resize(function()
    {
        //get the width and height as the window resizes
        var winWidth = $(window).width();
 
        //get the difference in width
        var widthDiff = winWidth - originalWinWidth;
 
        //check if the window is larger or smaller than the original
        if(widthDiff > 0)
        {
            //our window is larger than the original so increase font size
            var pixelsToIncrease = Math.round(widthDiff / ratioOfChange);
 
            //calculate the new font size
            var newFontSize = originalFontSize + pixelsToIncrease;
 
            //set new font size
            $("about").css("font-size", newFontSize);
        }
        else
        {
            //our window is smaller than the original so decrease font size
            var pixelsToDecrease = Math.round(Math.abs(widthDiff) / ratioOfChange);
 
            //calculate the new font size
            var newFontSize = originalFontSize - pixelsToDecrease;
 
            //set the new font size
            $("about").css("font-size", newFontSize);
        }
    })
});

function refreshMap(layers) {
    wax.tilejson('http://api.tiles.mapbox.com/v2/' + layers + '.jsonp', function (tilejson) {
          tilejson.minzoom = 2;
          tilejson.maxzoom = 7;
          m.setProvider(new wax.mm.connector(tilejson));
          $('.wax-legends').remove();
          wax.mm.legend(m, tilejson).appendTo(m.parent);
          interaction.remove();
          wax.mm.interaction(m, tilejson);
      });
}

// TODO: Change this
$(document).ready(function () {

    // Layer Selection
    $('ul.layers li a').click(function (e) {
        e.preventDefault();
        if (!$(this).hasClass('active')) {
            $('ul.layers li a').removeClass('active');
            $(this).addClass('active');
            var activeLayer = $(this).attr('data-layer');
            layers = [
                baselayer,
                activeLayer,
                borders,
                nationalPointData,
                subNationalPointData
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