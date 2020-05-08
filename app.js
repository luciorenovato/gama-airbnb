function createCard(id, photo, type, name, price) {
	return `<div id="card_${id}" class="card">
				<img class="photo" src="${photo}" alt="photo">
				<div id="container_${id}" class="container">
					<div class="type">${type}</div>
					<div class="name">${name}</div>
					<div class="price"><b>R$ ${price}</b>/noite</div>
				</div>
			</div>`
}

function createCard2(id, photo, type, name, price) {
/*	
	var divCard = document.createElement("div");
	divCard.classList.add("card");
	divCard.textContent = 'aaa';
	divCard.id = `card_${id}`;
	console.log(divCard);
	document.getElementById('cards').appendChild(divCard);


	let imgPhoto = document.createElement("img");
	imgPhoto.classList.add("photo");
	imgPhoto.alt = "photo";
	imgPhoto.src = photo;
	document.querySelector(`#card_${id}`).appendChild(imgPhoto);

	let divContainer = document.createElement("div");
	divContainer.id = `container_${id}`;
	document.querySelector(`#card_${id}`).appendChild(divContainer);

	let divType = document.createElement("div");
	divType.classList.add("type");
	divType.textContent = type;
	document.querySelector(`#container_${id}`).appendChild(divType);

	let divName = document.createElement("div");
	divName.classList.add("name");
	divName.textContent = name;
	document.querySelector(`#container_${id}`).appendChild(divName);

	let divPrice = document.createElement("div");
	divPrice.classList.add("price");
	divPrice.textContent = price;
	document.querySelector(`#container_${id}`).appendChild(divPrice);
	*/
}

createId = function(s) {
	var id = 0, i, chr;
	for (i = 0; i < s.length; i++) {
		chr = s.charCodeAt(i);
		id = ((id << 5) - id) + chr;
		id |= 0;
	}
	return id;
}

var xhr = new XMLHttpRequest();
xhr.onload = function () {
	if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Success!');
		var data = JSON.parse(xhr.responseText);		
		data.forEach(property => {			
			document.getElementById('cards').innerHTML += createCard(createId(property.name), property.photo, property.property_type, property.name, property.price);
		});
	} else {
		console.log('Fail!');
	}
};
xhr.open('GET', 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72');
xhr.send();