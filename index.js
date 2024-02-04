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
    for(let i of list.children){
        if(i.title.slice(0, search.value.length).toLowerCase() !== search.value.toLowerCase() &&
        i.id.slice(0, search.value.length).toLowerCase() !== search.value.toLowerCase())
            i.hidden = true
        else
            i.hidden = false
    }
})

function hasCurrency(currency){
    return collection.querySelector(`#${currency}`) != null ? true : false
}

const buyMoney = function(USD, data){
    if(USD === 0 || isNaN(USD))
        return
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
        card.innerText = `${data.country}
        ${card.value} ${data.currency}`
    }
    else{
        let card = document.createElement('div')
        let btn = document.createElement('button')
        btn.addEventListener('click', () => sellMoney(exchangedValue, data.exchange_rate, card))
        btn.innerText = 'Sell'
        card.value = exchangedValue
        card.classList.add('owned-currency')
        card.id = data.currency
        card.innerText = `${data.country}
        ${card.value} ${data.currency}  `
        card.append(btn)
        collection.append(card)
    }
}

const sellMoney = function(amount, rate, card){
    Funds += amount/rate
    funds.innerText = `$${Funds}`
    card.remove()
}

function createCurrencyCard(data){
    let card = document.createElement('div',)
    card.innerHTML =
    `<form class="buy-currency-form">
        <input
        type="text"
        value=""
        placeholder="Amount of USD"
        class="input-text"
        />
        <br />
        <input
        type="click"
        name="submit"
        value="Buy!"
        class="submit"
        />
    </form>`
    card.classList.add('currency-card')
    card.id = data.currency
    card.title = data.country
    let button = card.querySelector('[name="submit"]')
    button.addEventListener('click', () => buyMoney(card.querySelector(`.input-text`).value, data))
    
    let p = document.createElement('p')
    p.innerText = `${data.country}
    ${data.exchange_rate}  ${data.currency} ≈ 1 USD`

    card.append(p)
    list.append(card)
}