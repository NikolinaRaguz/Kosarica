const app = document.getElementById('root');
const container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);

var request = new XMLHttpRequest();
request.open('GET', 'https://api.myjson.com/bins/18lan4', true);
request.onload = function () {
    //JSON
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
        data.products.forEach(data => {
          const card = document.createElement('div');
          card.setAttribute('class', 'card');
          
              var product = document.createElement("p");
              product.className = "product";
              product.innerHTML = `<div class="product-image">
                                        <img src="${data.image}" alt="${data.name}">
                                     </div>
                                     <div class="product-name"> ${data.name}</div>
                                     <div class="product-price">${data.price.amount} ${data.price.currency + "/" + data.price.measureUnit}</div>
                                     <div class="product-add-to-cart">
                                       <a href="#0" class="button add-to-cart" data-id=${data.id}>Add to Cart</a>
                                     </div>
                                  </div> `;
               
        container.appendChild(card);
        card.appendChild(product);
        });
    }
    else {
            const errorMessage = document.createElement('sth');
            errorMessage.textContent = `it's not working`;
            app.appendChild(errorMessage);
          }
};

request.send();


