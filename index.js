// let wrap__enterprises = document.querySelectorAll('.wrap__enterprises') // вся компания
let enterprises_item = document.querySelectorAll('.enterprises_item') // все данные компании
let wrap_clear = document.querySelector('.wrap_clear')
let wrap_notEnough = document.querySelector('.wrap_notEnough')

let work = document.querySelectorAll('.work') //кнопки "заработать"
let buy = document.querySelectorAll('.buy') //кнопки покупки копании
let upgrade = document.querySelectorAll('.upgrade') // кнопки улучшения компании
let score = document.querySelector('.score') // сумма на счету
let profit = document.querySelector('.profit') // доход всех компаний
let clean = document.querySelector('.clean') //кнопка "начать заново"

let totalScore // количество денег на счете
let price  // стоимость компании
let levelAtr //  уровень компании
let bet // начальную прибыль компании
let upgradePrice // стоимость улучшения компании
let timerId // id setIntervala
let holding = [] // создаем массив holding для записи купленных компаний

let asset = { // создаем объект asset для записи активов компании (сумма на счету и доход всех компаний)
	score: 0,
	profit: 0
}

if (localStorage.getItem('user')) {
	holding = JSON.parse(localStorage.getItem('user'))
	score.textContent = holding[0].score
	profit.textContent = holding[0].profit

	totalProfit = holding[0].profit

	autoWork(totalProfit, holding)

	enterprises_item.forEach((item, index) => {

		try {

			available = holding[index + 1].available

		} catch (err) {

			available = 0
		}

		if (available == true) {

			console.log(item);

			let income = item.querySelector('.income') // получаем тэг income в родителе

			income.textContent = holding[index + 1].income // записываем доход компании из сохраненного ранее holding в localStorage

			item.setAttribute('income', holding[index + 1].income) // устанавливаем в атрибут income данные из сохраненного ранее income в localStorage

			let level = item.querySelector('.level')// получаем тэг level в родителе

			level.textContent = holding[index + 1].level // записываем уровень компании из сохраненного ранее holding в localStorage

			item.setAttribute('level', holding[index + 1].level) // устанавливаем в атрибут level данные из сохраненного ранее income в localStorage

			let buttonAll = item.querySelectorAll('button') // находим все кнопки в каждой компании

			let upgradePriceNext = upgradePriceFunc(+holding[index + 1].level, holding[index + 1].price) // получаем стоимость улучшения компании на следуующем уровне компании

			item.querySelector('.upgrade').textContent = `Улучшить за: ${upgradePriceNext}` // получаем кнопку upgrade  и записываем в нее стоимость улучшения

			for (const iterator of buttonAll) {
				iterator.classList.add('active')

				if (holding[index + 1].level == 5) {
					buttonAll[2].classList.remove('active')
				}
			}
			buttonAll[0].classList.remove('active')
		}
	})


} else {
	holding.push(asset) //  добавляем в массив holding активы компании
}

function wrap_notEnoughFunc() {
	wrap_notEnough.classList.add('active')
	let button = wrap_notEnough.querySelector('button')
	button.addEventListener('click', () => {
		wrap_notEnough.classList.remove('active')
	})
}

clean.addEventListener('click', () => {

	wrap_clear.classList.add('active')
	let button = wrap_clear.querySelectorAll('button')

	button.forEach((element, index) => {
		element.addEventListener('click', () => {
			if (index == 0) {
				clearInterval(timerId)
				localStorage.clear()
				wrap_clear.classList.remove('active')
				location.reload()
			} else {
				wrap_clear.classList.remove('active')
			}
		})
	})
})

	for (const item of work) {
		item.addEventListener('click', (event) => {
			let parent = event.target.parentElement.parentElement// получаем родителя

			let calc = parent.getAttribute('level') * parent.getAttribute('bet')
			score.textContent = Number(score.textContent) + calc

			holding[0].score = score.textContent; // записываем в массив holding новые данные счета

			setLocalStorage(holding)
		})
	}

	for (const item of buy) {

		let parent = item.parentElement.parentElement // получаем родителя

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

	function getLetFunc(parent) { // получаем данные компании

		totalScore = Number(score.textContent) // получаем количество денег на счете
		price = parent.getAttribute('price') // получаем стоимость компании
		levelAtr = Number(parent.getAttribute('level')) // получаем уровень компании
		bet = Number(parent.getAttribute('bet')) // получаем начальную прибыль компании
		upgradePrice = upgradePriceFunc(levelAtr, price) // получаем стоимость улучшения компании

		return [totalScore, price, levelAtr, bet, upgradePrice]
	}

	function bayCompany(parent, event) {

		let getLet = getLetFunc(parent)

		totalScore = getLet[0] // получаем количество денег на счете
		price = getLet[1] // получаем стоимость компании
		levelAtr = getLet[2] // получаем уровень компании
		bet = getLet[3] // получаем начальную прибыль компании
		upgradePrice = getLet[4] // получаем стоимость улучшения компании

		parent.querySelector('.upgrade').textContent = `Улучшить за: ${upgradePrice}` // получаем кнопку upgrade  и записываем в нее стоимость улучшения

		if (price <= totalScore) {

			for (const item of parent.querySelectorAll('button')) {
				item.classList.add('active')
			}
			event.target.classList.remove('active')

			let obj = { // записываем в переменную obj данные компании
				name: parent.getAttribute('name'), // имя компании
				level: parent.getAttribute('level'), // уровень компании
				income: parent.getAttribute('income'), // доход компании (на первом уровне равен начальной прибыли)
				bet: parent.getAttribute('bet'), // начальная прибыль компании
				price: parent.getAttribute('price'), // стимость покупки компании
				id: parent.getAttribute('id'), // id компании
				available: '1', // available компании
			}
			parent.setAttribute('available', 1) // устанавливаем в атрибут available - 1 (мы купили компанию)

			let totalProfit = Number(profit.textContent) + bet // расчитываем новый общий доход

			profit.textContent = totalProfit // показываем общий доход с учетом покупки новой компании

			holding[0].profit = totalProfit; // записываем в массив holding новый общий доход компаний

			holding.push(obj) // добавляем в массив holding купленную компанию

			score.textContent = totalScore - price // списываем со счета стоимость покупки

			holding[0].score = score.textContent; // записываем в массив holding новые данные счета

			setLocalStorage(holding) // записывем в LocalStorage новые данные holdingа

			clearInterval(timerId) // сбрасываем ранее установленный интевал

			autoWork(totalProfit, holding) // запускаем новый интевал с учетом нового дохода и данных всех компаний	

		} else {
			wrap_notEnoughFunc()
		}
	}

	for (const item of upgrade) {
		item.addEventListener('click', (event) => {
			let parent = event.target.parentElement.parentElement // получаем родителя
			upgradeCompany(parent, event) // запускаем функцию апгрейда компании
		})
	}

	function upgradeCompany(parent, event) {
		let getLet = getLetFunc(parent)

		totalScore = getLet[0] // получаем количество денег на счете
		price = getLet[1] // получаем стоимость компании
		levelAtr = getLet[2] // получаем уровень компании
		bet = getLet[3] // получаем начальную прибыль компании
		upgradePrice = getLet[4] // получаем стоимость улучшения компании

		let levelUp

		if (upgradePrice <= totalScore) {

			let upgradePriceNext = upgradePriceFunc(levelAtr + 1, price) // получаем стоимость улучшения компании на следуующем уровне компании

			parent.querySelector('.upgrade').textContent = `Улучшить за: ${upgradePriceNext}` // получаем кнопку upgrade  и записываем в нее стоимость улучшения

			let level = parent.querySelector('.level') // получаем тэг level в родителе
			let income = parent.querySelector('.income') // получаем тэг income в родителе

			let betCalc = bet * levelAtr// расчитываем прибыль компании до абгрейда

			levelUp = levelAtr + 1 // увеличиваем уровень компании на 1

			level.textContent = levelUp // показываем новый уровень компании

			let calc = bet * levelUp // получаем новый доход компании

			income.textContent = calc // показываем новый доход компании

			let totalProfit = Number(profit.textContent) - betCalc + calc // расчитываем новый общий доход (отнимаем доход компании до абгрейда и приибавляем доход компании после обгрейда)

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
			wrap_notEnoughFunc()
		}

		if (levelUp == 5) {
			event.target.classList.remove('active')
		}

		console.log(upgradePrice);
	}

	function upgradePriceFunc(levelAtr, price) { // расчитываем стоимость улучшения с учетом уровня компании
		// console.log(levelAtr);
		// console.log(price);

		price == 0 ? price = 1000 : price
		// debugger
		let priceUp
		switch (Number(levelAtr)) {
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