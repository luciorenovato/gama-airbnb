const createItem = (tag, class_name, parent_id, atributes) => {
	let element = document.createElement(tag);
	if (class_name !== undefined) element.classList.add(class_name);
	if (atributes !== undefined) {
		for (let [key, value] of Object.entries(atributes)) {
			key == 'textContent' ? element.textContent = value : element.setAttribute(key, value);
		  }
	}
	console.log(`document.getElementById(${parent_id}).appendChild(${element})`);
	document.getElementById(`${parent_id}`).appendChild(element);
}

const createCard = (property) => {
	let { photo, property_type, name, price } = property;
	let id = createId(name);
	createItem('div', 'card', 'cards', { id: `card_${id}` });
	createItem('img', 'photo', `card_${id}`, { src: photo });
	createItem('div', null, `card_${id}`, { id: `container_${id}` });
	createItem('div', 'property_type', `container_${id}`, { textContent: property_type });
	createItem('div', 'name', `container_${id}`, { textContent: name });
	createItem('div', 'price', `container_${id}`, { textContent: `R$ ${price}/noite` });
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

fetch('https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72')
	.then((response) => {
		response.json().then((data) => { 			
			data.forEach(property => {
				createCard(property);
			});
		});
	}).catch(error => {
    	console.log('Fail!');
	});