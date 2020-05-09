let page = 1;
let cards_page = 4;
let max_page = 0;
let cards = [];

var ready = (callback) => {
	if (document.readyState != "loading") callback();
	else document.addEventListener("DOMContentLoaded", callback);
}

ready(() => { 
	fetch('https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72')
	.then((response) => {
		response.json().then((data) => {
			cards = data;
			max_page = Math.round(cards.length / cards_page);
			console.log(`cards.length: ${cards.length}`);
			console.log(`max_page: ${max_page}`);
			updatePage(page);
		});
	}).catch(error => {
    	console.log('Fail!');
	});	
});

const updateCards = () => {
	removeItems('cards');
	createCards(cards);
}

const createItem = (tag, class_name, parent_id, atributes) => {
	let element = document.createElement(tag);
	if (class_name !== undefined && class_name !== null) element.classList.add(class_name);
	if (atributes !== undefined) {
		for (let [key, value] of Object.entries(atributes)) {
			key == 'textContent' ? element.textContent = value : element.setAttribute(key, value);
		  }
	}
	document.getElementById(`${parent_id}`).appendChild(element);
	return element
}

const createCard = (property) => {
	let { photo, property_type, name, price } = property;
	let id = createId(name);
	let divCard = createItem('div', 'card', 'cards', { id: `card_${id}` });
	createItem('img', 'photo', `card_${id}`, { src: photo });
	createItem('div', null, `card_${id}`, { id: `container_${id}` });
	createItem('div', 'property_type', `container_${id}`, { textContent: property_type });
	createItem('div', 'name', `container_${id}`, { textContent: name });
	createItem('div', 'price', `container_${id}`, { textContent: `R$ ${price}/noite` });
}

const createCards = (data) => {
	console.log(`createCards: ${cards_page * (page - 1)} - ${cards_page * (page - 1) + cards_page}`);
	data.slice(cards_page * (page - 1), cards_page * (page - 1) + cards_page).forEach(property => {
		createCard(property);
	});
}

const removeItems = (id) => {
	document.getElementById(id).textContent = '';
}

// Funcao para criar um id para cada registro
const createId = (s) => {
	var id = 0, i, chr;
	for (i = 0; i < s.length; i++) {
		chr = s.charCodeAt(i);
		id = ((id << 5) - id) + chr;
		id |= 0;
	}
	return id;
}

const updatePage = (new_page) => {
	page = new_page;
	updateCards();
	removeItems('pagination');
	if (page > 1) createItem('a', null, 'pagination', { href: '#', onclick: `updatePage(${page - 1})`, textContent: '<<' });
	for (let i = 1; i <= max_page; i++) {
		createItem('a', i == page ? 'active' : null, 'pagination', { href: '#', onclick: `updatePage(${i})`, textContent: i });
	}
	if (page < max_page) createItem('a', null, 'pagination', { href: '#', onclick: `updatePage(${page+ 1})`, textContent: '>>' });
}
