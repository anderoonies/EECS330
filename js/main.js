var m_names = new Array("Jan", "Feb", "Mar", 
"Apr", "May", "Jun", "Jul", "Aug", "Sep", 
"Oct", "Nov", "Dec");

$(document).ready(function() {
    Date.prototype.timeNow = function () {
     return (this.getHours() % 12 +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes()) + " " + ((this.getHours() < 12)? "am":"pm");
    }

    var newDate = new Date().timeNow();

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();
    curr_year = curr_year.toString().substr(2,2);


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

    $('#submit').click(function(e) {
        miles.push(parseInt($('#run-entry-distance').val()));
        run_dates.push(curr_date + "-" + m_names[curr_month] + '-' + curr_year);
        d3.selectAll('svg').remove();
        loadData();
    })

    $('.tab').click(function(e) {
        d3.selectAll('svg').remove();
    	$('.tab').removeClass('active');
    	$(this).addClass('active');
        if ($(this).attr('id')=='tab1') {
            $('link[data-role="path"]').attr('href', 'styles/path.css');
            $('.viewpane2').hide();
            $('.viewpane3').hide();
            $('.viewpane1').show(0, function(){
                loadData()
            });
        } else if ($(this).attr('id')=='tab2') {
            $('link[data-role="path"]').attr('href', '');
            $('.viewpane1').hide();
            $('.viewpane3').hide();
            $('.viewpane2').show();
            drawChart();
        } else if ($(this).attr('id')=='tab3') {
            $('link[data-role="path"]').attr('href', 'styles/path.css');
            $('.viewpane1').hide();
            $('.viewpane2').hide();
            $('.viewpane3').show(0, function() {
                loadData();
            });
        };
    })
});