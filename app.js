function createCard(photo, property_type, name, price) {
	return `<div class="card">
				<img id="photo" src="${photo}" alt="photo">
				<div class="container">
					<div id="property_type">${property_type}</div>
					<div id="name">${name}</div>
					<div id="price">${price}</div>
				</div>
			</div>`

var xhr = new XMLHttpRequest();
xhr.onload = function () {
	if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Success!');
		var data = JSON.parse(xhr.responseText);		
		data.forEach(element => {
			console.log(element);
		});
	} else {
		console.log('Fail!');
	}
};
xhr.open('GET', 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72');
xhr.send();