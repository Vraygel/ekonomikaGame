let work = document.querySelectorAll('.work')
let buy = document.querySelectorAll('.buy')
let upgrade = document.querySelectorAll('.upgrade')
let score = document.querySelector('.score')
let profit = document.querySelector('.profit')


let timerId
let holding = []



// console.log(holding);

for (const item of work) {
	item.addEventListener('click', (event) => {
		let parent = event.target.parentElement // получаем родителя
		let calc = parent.getAttribute('level') * parent.getAttribute('bet')
		score.textContent = Number(score.textContent) + calc
		
	})

}


for (const item of buy) {


	let parent = item.parentElement // получаем родителя

	let price = parent.getAttribute('price') // получаем стоимость компании

	item.textContent = `Купить за: ${price}` //  записываем стоимость покупки

	item.addEventListener('click', (event) => {
		
		bayCompany(parent, event)
		
	})

}

function autoWork(calc) {
	timerId = setInterval(() => {
		score.textContent = Number(score.textContent) + calc
	}, 1000);
}

function bayCompany(parent, event) {
	let totalScore = Number(score.textContent) // получаем количество денег на счете
	let price = parent.getAttribute('price') // получаем стоимость компании
	let levelAtr = Number(parent.getAttribute('level')) // получаем уровень компании

	let upgradePrice = upgradePriceFunc(levelAtr, price) // получаум стоимость улучшения компании

	parent.querySelector('.upgrade').textContent = `Улучшить за: ${upgradePrice}` // получаем кнопку upgrade  и записываем в нее стоимость улучшения
	

	if (price <= totalScore) { 

		for (const item of parent.querySelectorAll('button')) {
			item.classList.add('active')
		}
		event.target.classList.remove('active')

		let bet =  Number(parent.getAttribute('bet')) // получаем начальную прибыль компании

		let obj = { // записываем в переменную obj данные компании
			name: parent.getAttribute('name'), // имя компании
			level: parent.getAttribute('level'), // уровень компании
			income: parent.getAttribute('income'), // доход компании (на первом уровне равен начальной прибыли)
			bet: parent.getAttribute('bet'), // начальная прибыль компании
			price: parent.getAttribute('price'), // стимость покупки компании
			id: parent.getAttribute('id'), // id компании
		}

		let profitAtr = Number(profit.getAttribute('profit')) // получаем значение атрибута profit (общий доход всех компаний с учетом уровня)

		let totalProfit = profitAtr + bet // расчитываем новый общий доход

		profit.textContent = totalProfit // показываем общий доход с учетом покупки новой компании

		profit.setAttribute('profit',  totalProfit) // устанавливаем в атрубут profit новые данные после покупки новой компании
		
		holding.push(obj) // добавляем в массив holding купленную компанию
		clearInterval(timerId) // сбрасываем ранее установленный интевал

		autoWork(totalProfit) // запускаем новый интевал с учетом нового дохода всех компаний

		score.textContent = totalScore - price

		console.log(holding);
	} else{
		alert('не достаточно денег на счете')
	}
}



for (const item of upgrade) {
	item.addEventListener('click', (event) =>{
		let parent = event.target.parentElement // получаем родителя

		upgradeCompany(parent, event)
		
	})
}


function upgradeCompany(parent, event) {
	let totalScore = Number(score.textContent) // получаем количество денег на счете
	let price = parent.getAttribute('price') // получаем стоимость компании
	let levelAtr = Number(parent.getAttribute('level')) // получаем уровень компании
	let levelUp
// debugger
	let upgradePrice = upgradePriceFunc(levelAtr, price) // получаем стоимость улучшения компании
	

	

	if (upgradePrice <= totalScore) {

		let upgradePriceNext = upgradePriceFunc(levelAtr + 1, price) // получаем стоимость улучшения компании на следуующем уровне компании

		parent.querySelector('.upgrade').textContent = `Улучшить за: ${upgradePriceNext}` // получаем кнопку upgrade  и записываем в нее стоимость улучшения
		
		let level = parent.querySelector('.level') // получаем тэг level в родителе
		let income = parent.querySelector('.income') // получаем тэг income в родителе

		let profitAtr = Number(profit.getAttribute('profit')) // получаем значение атрибута profit (общий доход всех компаний с учетом уровня)
		let bet =  Number(parent.getAttribute('bet')) // получаем начальную прибыль компании
		
		let betCalc = bet * levelAtr// расчитываем прибыль компании до абгрейда

		levelUp = levelAtr + 1 // увеличиваем уровень компании на 1

		level.textContent = levelUp // показываем новый уровень компании

		let calc = bet * levelUp // получаем новый доход компании

		income.textContent = calc // показываем новый доход компании

		let totalProfit = profitAtr - betCalc + calc // расчитываем новый общий доход (отнимаем доход компании до абгрейда и приибавляем доход компании после обгрейда)

		profit.textContent = totalProfit // показываем новый общий доход


		profit.setAttribute('profit', totalProfit) //  устанавливаем в атрибут profit новые данные после абгрейда компании
	
		parent.setAttribute('level', levelUp) // устанавливаем в атрибут level новый уровень компании

		holding[parent.getAttribute('id')].level = levelUp; // записываем в объект компании новый уровень компании
		
		clearInterval(timerId) // сбрасываем ранее установленный интевал

		autoWork(totalProfit)

		console.log(holding);

		score.textContent = totalScore - upgradePrice

	} else {
		alert('не достаточно денег на счете')
	}

	if (levelUp == 5) {
		event.target.classList.remove('active')
	}

	console.log(upgradePrice);
}



function upgradePriceFunc(levelAtr, price) { // расчитываем стоимость улучшения с учетом уровня компании
	console.log(levelAtr);
	console.log(price);

	price == 0 ? price = 1000 : price
	// debugger
	let priceUp
	switch(Number(levelAtr)) {
		case 1:
		priceUp = (price / 2)
		  break;
		  
		  case 2:
			priceUp = (price / 2) * 1.25
		  break;

		  case 3:
			priceUp = (price / 2) * 1.5
		  break;

		  case 4:
			priceUp = (price / 2) * 1.75
		  break;

	}

	return priceUp
}














// for (const item of buy) {
// 	item.addEventListener('click', (event) => {
// 		let parent = event.target.parentElement // получаем родителя
// 		let calc = Number(parent.getAttribute('bet'))
// 		let profitAtr = Number(profit.getAttribute('profit'))

// 		profit.textContent = Number(profit.textContent) + calc
// 		profit.setAttribute('profit',  Number(profitAtr) + calc )
// 		console.log(profit);

// 		for (const item of parent.querySelectorAll('button')) {
// 			item.classList.add('active')
// 		}
// 		event.target.classList.remove('active')

// 		let obj = {
// 			name: parent.getAttribute('name'),
// 			level: parent.getAttribute('level'),
// 			income: parent.getAttribute('income'),
// 			bet: parent.getAttribute('bet'),
// 			price: parent.getAttribute('price'),
// 			id: parent.getAttribute('id'),
// 		}

// 		holding.push(obj)


// 		clearInterval(timerId)
// 		console.log(Number(profit.getAttribute('profit')));
// 		autoWork(Number(profit.getAttribute('profit')))
// 		console.log(holding);
// 	})

// }



// for (const item of upgrade) {
// 	item.addEventListener('click', (event) =>{
// 		let parent = event.target.parentElement // получаем родителя
// 		let levelAtr = parent.getAttribute('level')
// 		console.log(levelAtr);
// 		let calc = (Number(levelAtr) + 1) * parent.getAttribute('bet')
		
// 		let profitAtr = Number(profit.getAttribute('profit'))
// 		console.log(profitAtr);

// 		profit.textContent = calc
// 		profit.setAttribute('profit', profitAtr + calc )
// 		console.log(profit);

// 		parent.setAttribute('level', Number(levelAtr) + 1)
		
// 		level.textContent = parent.getAttribute('level', Number(levelAtr) + 1)
// 		holding[parent.getAttribute('id')].level = Number(levelAtr) + 1;
		
		
// 		income.textContent = calc
// 		clearInterval(timerId)
// 		console.log(profitAtr);
// 		autoWork(profitAtr)
// 		console.log(holding);
// 	})
// }