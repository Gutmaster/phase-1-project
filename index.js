const list = document.getElementById('currency-list')
const collection = document.getElementById('currency-collection')
const funds = document.getElementById('funds')
const search = document.getElementById('search')
let Funds = 0

document.addEventListener('DOMContentLoaded', function(){
    Funds = 100
    funds.innerText = `$${Funds}`
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
        alert(error.message);
    });
})

search.addEventListener('input', function(){
    Array.from(list.children).forEach((element) => {
        if(element.title.slice(0, search.value.length).toLowerCase() !== search.value.toLowerCase() &&
        element.id.slice(0, search.value.length).toLowerCase() !== search.value.toLowerCase())
        {
            element.style = 'display:none'
        }
        else
            element.style = 'display:inline-block'
    })
})

function hasCurrency(currency){
    return collection.querySelector(`#${currency}`) != null ? true : false
}

function createOwnedCurrencyCard(data, exchangedValue){
    let card = document.createElement('div')
    card.value = exchangedValue
    card.classList.add('owned-currency')
    card.id = data.currency
    
    let p = document.createElement('p')
    p.innerText = `${card.value} ${data.currency} (${data.country})`
    card.append(p)

    let form = document.createElement('form')
    let valueEntry = document.createElement('input')
    valueEntry.placeholder = `Amount of ${card.id}`
    valueEntry.classList.add("input-text")
    form.append(valueEntry)

    let btn = document.createElement('button')
    btn.innerText = 'Sell'
    form.append(btn)
    form.addEventListener('submit', () => {
        event.preventDefault()
        sellMoney(valueEntry.value, data.exchange_rate, card, data)
    })
    card.append(form)
    collection.append(card)
}

const buyMoney = function(USD, data){
    if(USD === 0 || isNaN(USD)){
        alert("Please enter an amount in USD.")
        return
    }
    else if(USD > Funds){
        alert("Insufficient funds!")
        return
    }
    Funds -= USD
    funds.innerText = `$${Funds}`
    let exchangedValue = data.exchange_rate*USD

    if(hasCurrency(data.currency)){
        const card = collection.querySelector(`#${data.currency}`)
        card.value += exchangedValue
        card.querySelector('p').innerText = `${card.value} ${data.currency} (${data.country})`
    }
    else{
        createOwnedCurrencyCard(data, exchangedValue)
    }
}

const sellMoney = function(amount, rate, card, data){
    if(amount > card.value){
        alert('Not enough funds to sell!')
        return
    }
    Funds += amount/rate
    funds.innerText = `$${Funds}`

    card.value -= amount
    if(card.value <= 0)
        card.remove()
    else{
        card.querySelector('p').innerText = `${card.value} ${data.currency}`
    }
}

function flipCard(p, data, savedString){
    if(p.value === "hidden"){
        p.innerText = savedString
        p.value = "visible"
    }
    else{
        p.innerText = `(${data.record_date})`
        p.value = 'hidden'
    }
}

function createCurrencyCard(data){
    let card = document.createElement('div',)
    card.classList.add('currency-card')
    card.id = data.currency
    card.title = data.country
    
    let country = document.createElement('p')
    country.innerText = `${data.country}`
    card.append(country)

    let span = document.createElement('span')
    span.style = 'block'
    let p = document.createElement('p')
    const savedString = `1 USD ≈ ${data.exchange_rate}  ${data.currency}  `
    p.style = "display:inline"
    p.value = 'visible'
    p.innerText = savedString
    span.append(p)

    let flipButton = document.createElement('button')
    flipButton.innerText = "?"
    flipButton.addEventListener('click', () => {flipCard(p, data, savedString)})
    span.append(flipButton)
    card.append(span)

    let form = document.createElement('form')
    form.append(document.createElement('br'))
    let valueEntry = document.createElement('input')
    valueEntry.placeholder = "Amount if USD"
    form.append(valueEntry)
    let buyButton = document.createElement('button')
    buyButton.innerText = "Buy!"
    form.append(buyButton)
    form.addEventListener('submit', () => {
        event.preventDefault()
        buyMoney(valueEntry.value, data)
    })
    card.append(form)

    list.append(card)
}