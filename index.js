let work = document.querySelectorAll('.work')
let buy = document.querySelectorAll('.buy')
let score = document.querySelector('.score')

let holding = []

let obj = {
	name: 'Название компании',
	level: 'Уровень компании',
	bet: 'Начальная ставка'
}

// console.log(holding);

for (const item of work) {
	item.addEventListener('click', () => {
		score.textContent = Number(score.textContent) + 10 
	})
	
}


for (const item of buy) {
	item.addEventListener('click', (event) => {
		event.target.classList.remove('active')

		
		autoWork()
	})
	
}

function autoWork() {
	setInterval(() => {
		score.textContent = Number(score.textContent) + 10 
	}, 1000);
}
