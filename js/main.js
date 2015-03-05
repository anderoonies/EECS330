$(document).ready(function() {
    Date.prototype.timeNow = function () {
     return (this.getHours() % 12 +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes()) + " " + ((this.getHours() < 12)? "am":"pm");
    }

    var newDate = new Date().timeNow();

    $('#time-header').text(newDate);

    $('#plus-sign').click(function() {
        $('#run-entry').css('display', 'block');
    });

    $('html').click(function (e) {
    	 var d = e.target;

	    // if this node is not the one we want, move up the dom tree
	    while (d != null && (!((d['id'] == 'run-entry') || (d['id']== 'plus-sign')))) {
	      d = d.parentNode;
	    }

	    // at this point we have found our containing div or we are out of parent nodes
	    var insideMyDiv = (d != null && ((d['id'] == 'run-entry') || (d['id']== 'plus-sign')));

        if (!insideMyDiv) {
            $('#run-entry').css('display', 'none');
        }
    });

    $('.tab').click(function(e) {
    	$('.tab').removeClass('active');
        d3.selectAll('svg').remove();
    	$(this).addClass('active');
        if ($(this).attr('id')=='tab2') {
            $('link[data-role="path"]').attr('href', '');
            $('.viewpane1').hide();
            $('.viewpane3').hide();
            $('.viewpane2').show();            
        } else if ($(this).attr('id')=='tab1') {
            $('link[data-role="path"]').attr('href', 'styles/path.css');
            $('.viewpane2').hide();
            $('.viewpane3').hide();
            $('.viewpane1').show();
            $('.viewpane1').ready(function(){
                loadData();
            })
        } else if ($(this).attr('id')=='tab3') {
            $('link[data-role="path"]').attr('href', 'styles/path.css');
            $('.viewpane2').hide();
            $('.viewpane3').show();
            $('.viewpane1').hide();
            $('.viewpane3').ready(function(){
                loadData();
            })
        };
    })
});