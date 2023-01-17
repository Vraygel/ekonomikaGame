let work = document.querySelectorAll('.work')
let buy = document.querySelectorAll('.buy')
let upgrade = document.querySelectorAll('.upgrade')
let score = document.querySelector('.score')
let profit = document.querySelector('.profit')
let clean = document.querySelector('.clean')



let timerId
let holding = [] // создаем массив holding для записи купленных компаний

let asset = { // создаем объект asset для записи активов компании (сумма на счету и доход всех компаний)
	score: 0,
	profit: 0
} 
holding.push(asset) //  добавляем в массив holding активы компании


clean.addEventListener('click', () => {

	localStorage.clear()
})
// console.log(holding);

for (const item of work) {
	item.addEventListener('click', (event) => {
		let parent = event.target.parentElement // получаем родителя
		let calc = parent.getAttribute('level') * parent.getAttribute('bet')
		score.textContent = Number(score.textContent) + calc

		holding[0].score = score.textContent; // записываем в массив holding новые данные счета

		setLocalStorage(holding)
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

function autoWork(calc, holding) {
	timerId = setInterval(() => {
		score.textContent = Number(score.textContent) + calc

		holding[0].score = score.textContent; // записываем в массив holding новые данные счета

		setLocalStorage(holding)
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
		
		holding[0].profit = totalProfit; // записываем в массив holding новый общий доход компаний

		holding.push(obj) // добавляем в массив holding купленную компанию

		score.textContent = totalScore - price // списываем со счета стоимость покупки

		holding[0].score = score.textContent; // записываем в массив holding новы данные счета

		setLocalStorage(holding) // записывем в LocalStorage новые данные holdingа

		clearInterval(timerId) // сбрасываем ранее установленный интевал

		autoWork(totalProfit, holding) // запускаем новый интевал с учетом нового дохода и данных всех компаний	

	} else{
		alert('не достаточно денег на счете')
	}
}

for (const item of upgrade) {
	item.addEventListener('click', (event) =>{
		let parent = event.target.parentElement // получаем родителя
		upgradeCompany(parent, event) // запускаем функцию апгрейда компании
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

		parent.setAttribute('income', calc) // устанавливаем в атрибут income новый доход компании

		holding[parent.getAttribute('id')].level = levelUp; // записываем в объект компании новый уровень компании
		holding[parent.getAttribute('id')].income = calc; // записываем в объект компании новый доход компании

		holding[0].profit = totalProfit; // записываем в массив holding новый общий доход компаний
		
		score.textContent = totalScore - upgradePrice // списываем со счета стоимость апгрейда

		holding[0].score = score.textContent; // записываем в массив holding новые данные счета

		clearInterval(timerId) // сбрасываем ранее установленный интервал

		autoWork(totalProfit, holding) // запускаем новый интевал с учетом нового дохода и данных всех компаний

		setLocalStorage(holding) // записывем в LocalStorage новые данные holdingа

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

function setLocalStorage(holding) {
	
	let json = JSON.stringify(holding) // преобразуем массив holding в формат JSON

	localStorage.setItem('user', json); // записываем в localStorage данные holdingа

	console.log(JSON.parse(json));
}