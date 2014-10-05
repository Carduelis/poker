
var counting = true;
var time;
var startTime;
var blindsCounter = 0;

var bigblinds = [];
/* Данные по умолчанию */
store.set('time',{'minutes': 10, 'seconds': 00});
store.set('minblinds', [5,10,20,30,40,50,75,100,200,400,800]);
store.set('tournamentChips','500');
store.set('tournamentFee','100');
store.set('tournamentKnockout','knockoutOn');
store.set('tournamentPlayers','9');
store.set('tournamentType','sit-n-go-50');
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
	$('#simpleTimerSettings .submit .button').on('click', function(){
		alert('Пока ничего не сохраняется :(')
		var parent = $(this).parents('.content');
		parent.find('input').each(function(){

			if($(this).attr('data-index')) {
				// this means array

			} else {
				// not array
			}
		})
	});
	$('#sitNGoSettings .submit .button').on('click',function(){
		var parent = $(this).parents('.form');
		parent.find('input, select').each(function(){
			var id = $(this).attr('id');
			var value = $(this).val();
			store.set(id,value);
		});
	});
	/*
	$('#sitNGoSettings input,#sitNGoSettings select').each(function(){
		var id = $(this).attr('id');
		var value = $(this).val();
		store.set(id,value);
	});
	*/
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
	},1000)
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
	});


});
	$('#calculateTournament').on('click', function(){
		calculateAward(store.get('tournamentType'),store.get('tournamentKnockout'),store.get('tournamentPlayers'), store.get('tournamentFee'), store.get('tournamentChips'));
	})
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////
///////		Функции расчета
///////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

function calculateAward(tournamentType, knockOut, playersNum, playerFee, playerStack) {
	var bank = playerFee*playersNum;
	var totalChips = playerStack*playersNum;
	var result = '';
	var winners = 0;
	var gold = 0;
	var silver = 0; 
	var bronze = 0;
		
	if (tournamentType == 'sit-n-go') {
		if (playersNum <= 7) {
			winners = 2;
			gold = Math.round(bank*2/3);
			silver = Math.round(bank*1/3);	
		} else {
			winners = 3;
			gold = Math.round(bank*4/7);
			silver = Math.round(bank*2/7);
			bronze = Math.round(bank*1/7);
		}
		result+= '<sections id="calculating">';
		result+= '<h3>Победителей: <span class="accent">'+winners+'</span></h3>';
		result+= '<ul class="winners">'
		result+= '<li>Первое место: <span class="accent rouble">'+gold+'</span>'
		result+= '<li>Второе место: <span class="accent rouble">'+silver+'</span>'
	if (bronze) result+= '<li>Третье место: <span class="accent rouble">'+bronze+'</span>'
		result+= '</ul>'
		result+= '</section>'
	}
	if (tournamentType == 'sit-n-go-50') {
		//winners = integerDivision(playersNum,2);
		winners = 4;
		var chipCost, prize, knockOutPrize, totalKnockOutPrize;
		if (knockOut == 'knockoutOn') {
			prize = playerFee;
			knockOutPrize = Math.round(playerFee/5);
			totalKnockOutPrize = knockOutPrize*(playersNum-winners);
			chipCost = (bank-(winners*prize)-totalKnockOutPrize)/totalChips;
		} else {
			prize = playerFee;
			chipCost = (bank-(winners*prize))/totalChips;
		}
		result+= '<sections id="calculating">';
		result+= '<h3>О турнире</h3>'
		result+= '<ul class="about">'
		result+= '<li>Игроков: <span class="accent">'+playersNum+'</span>;'
		result+= '<li>Взнос по <span class="accent rouble">'+playerFee+'</span>;'
		result+= '<li>Первоначальный стек <span class="accent">'+playerStack+'</span>';
		result+= '</ul>'
		result+= '<h3>Победителей: <span class="accent">'+winners+'</span></h3>';
		result+= '<ul class="winners">'
		result+= '<li>Минимальный выигрыш составляет <span class="accent rouble">' + prize + '</span>'
		if (knockOut == 'knockoutOn') {
			result+= '<h3>Призы за выбивание</h3>';
			result+= '<li>Knock-out банк составляет: <span class="accent rouble">' + totalKnockOutPrize + '</span>'
			result+= '<li>За выбивание игрока по <span class="accent rouble">' + knockOutPrize + '</span>'
		}
		result+= '<li><h3>Расчет фишек</h3><table class="chips"><tbody>'
		result+= '<tr><td>За каждую фишку</td><td><span class="accent rouble">' + Math.round(chipCost*100)/100 + '</span></td></tr>'
		result+= '<tr><td>За каждые <span class="accent">5</span> фишек</td><td><span class="accent rouble">' + Math.round(chipCost*5*100)/100 + '</span></td></tr>'
		result+= '<tr><td>За каждые <span class="accent">10</span> фишек</td><td><span class="accent rouble">' + Math.round(chipCost*10*100)/100 + '</span></td></tr>'
		result+= '<tr><td>За каждые <span class="accent">20</span> фишек</td><td><span class="accent rouble">' + Math.round(chipCost*20*100)/100 + '</span></td></tr>'
		result+= '<tr><td>За каждые <span class="accent">50</span> фишек</td><td><span class="accent rouble">' + Math.round(chipCost*50*100)/100 + '</span></td></tr>'
		result+= '<tr><td>За каждые <span class="accent">100</span> фишек</td><td><span class="accent rouble">' + Math.round(chipCost*100*100)/100 + '</span></td></tr>'
		result+= '<tr><td>За каждые <span class="accent">200</span> фишек</td><td><span class="accent rouble">' + Math.round(chipCost*200*100)/100 + '</span></td></tr>'
		result+= '<tr><td>За каждые <span class="accent">500</span> фишек</td><td><span class="accent rouble">' + Math.round(chipCost*500*100)/100 + '</span></td></tr>'
		result+= '</tbody></table>'
		
		result+= '</ul>'
		result+= '</section>'

	}
	$('#calculating').remove();
	$('#sitNGoBlock .content').append(result);
}
function integerDivision(x, y){
    return (x-x%y)/y
}
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////
///////		Функции для таймера
///////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////

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