const collection = document.getElementById('toy-collection')
const button = document.getElementById('new-toy-btn')

function createCurrencyCard(data){
    let card = document.createElement('div', )
    card.classList.add('currencyCard')
    console.log(card.className.style)
    let country = document.createElement('p')
    country.innerText = data.country
    
    let currency = document.createElement('p')
    currency.innerText = data.currency
    
    card.append(country)
    card.append(currency)
    collection.append(card)
}

button.addEventListener('click', function(){
    return fetch("https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/rates_of_exchange")
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        for(let c of data.data){
            createCurrencyCard(c)
        }
    })
    .catch(function (error) {
        console.log("Error message:", error.message);
        let p = document.createElement('p');
        p = error.message;
        console.log(p);
        document.querySelector('body').append(p);
    });
})
