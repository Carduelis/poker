
var counting = true;
var time;
var startTime;
var blindsCounter = 0;

var bigblinds = [];
/* Данные по умолчанию */
store.set('time',{'minutes': 1, 'seconds': 30});
store.set('minblinds', [5,10,20,30,40,50,75,100,200,400,800]);
	
	// Большие блайнды делаются легко
	
getBigBlinds();
function getBigBlinds() {
	for (var i = store.get('minblinds').length - 1; i >= 0; i--) {
		bigblinds[i] = store.get('minblinds')[i] *2
	};
	store.set('bigblinds', bigblinds);
}

/* Вывод данных в html */
$(document).ready(function(){
	$('.seconds').text(timeToSeconds(time));
	$('.minutes').text(timeToMinutes(time));

	$('#minutes').attr('value','10');
	$('#seconds').attr('value','00');
	var html ='';
	for (var i = 0; i < store.get('minblinds').length; i++) {
		html+= "<label><span>Круг №"+(i+1)+"</span><input data-name='minblinds' data-index=" +i+ " value=" + store.get('minblinds')[i] + " type='number'></label>"
	};
	$('#simpleTimerSettings .blinds').append(html);

});

/* Запоминаем новые данные */

$(document).ready(function(){
	$('.submit .button').on('click', function(){
		alert('Пока ничего не сохраняется :(')
		var parent = $(this).parents('.content');
		parent.find('input').each(function(){

			if($(this).attr('data-index')) {
				// this means array

			} else {
				// not array

			}
		})
	})
});


/* Счетчик времени */ 
time = store.get('time').minutes*60+store.get('time').seconds
startTime = time; // запомнили начальное время для подсчета шага в градусах
var timer = function(){
	setTimeout(function(){
		if (counting == true) {
			time--;
			worker(time, startTime);
		}
		timer();
	},500)
};

function worker(currentTime, startTime) {
	//console.info(startTime+' '+currentTime);
	var degree = -45;
	currentdegree = -currentTime;
	degree = degree+currentdegree*360/startTime;
	if (degree < -225) {
		$('.dial-mask.first').css('transform','rotate('+degree+'deg)');
	} else {
		$('.dial-mask.first').css('transform','rotate(-225deg)');
		$('.dial-mask.second').addClass('half');
		$('.dial-mask.second').css('transform','rotate('+degree+'deg)');
	}
	$('.seconds').text(timeToSeconds(currentTime));
	$('.minutes').text(timeToMinutes(currentTime));
	if (currentTime == 0) {
		$('.timer').addClass('timeIsOut');
		resetTimer();
		playTada();
		blindsCounter++;
		appendBlinds();
	}
}

$(document).ready(function(){
	document.addEventListener("touchstart", function(){}, true);


	$('.timer').one('click', function(){
		pauseResume();
		timer();
		showControls();
		playTada();
	});
	$('.timer').on('click',function(){
		pauseResume();
		$(this).toggleClass('playing');
	})
});


function startOver() {
		playTada();
	resetTimer();
	blindsCounter = 0;
	appendBlinds();
}
function nextBlinds() {
		playTada();
	resetTimer();
	blindsCounter++;
	appendBlinds();
}
function prevBlinds() {
		playTada();
	resetTimer();
	blindsCounter--;
	appendBlinds();
}

function showControls() {
	$('.actions').fadeIn();
}
function resetTimer() {
	time = startTime;
	setTimeout(function(){
		$('.timer').removeClass('timeIsOut');
	},1000);
	$('.dial-mask').removeAttr('style').removeClass('half');
}
function playTada() {
	$('#player').get(0).play();
}
function appendBlinds() {
	$('.min-blind').text(store.get('minblinds')[blindsCounter]);
	$('.max-blind').text(store.get('bigblinds')[blindsCounter]);
}


function pauseResume() {
	if ((counting) || (time == 0)) {
		counting = false
	} else {
		counting = true
	}
}
function timeToSeconds(seconds) {
	var minutes = Math.floor(seconds / 60);
	seconds = time - minutes * 60;
	if (seconds < 10) {
		seconds = '0'+seconds;
	}
	return seconds
}
function timeToMinutes(seconds) {
	var minutes = Math.floor(seconds / 60);
	seconds = time - minutes * 60;
	if (minutes < 10) {
		minutes = '0'+minutes;
	}
	return minutes
}

$('.tabs a').on('click',function() {
  var thisLink = $(this);
  var openBlockId = thisLink.attr('id');
  var openBlockId = openBlockId+'Block';
  var openBlock = $('section.view#'+openBlockId);
  openBlock.toggle();
  thisLink.toggleClass('active');
  $('section.view').not(openBlock).hide();
  $('.tabs a').not(thisLink).removeClass('active');
});