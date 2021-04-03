

document.querySelector('#admin-login-button').addEventListener('click', element=>{
  document.querySelector('.login-overlay').classList.add('show')
})

document.querySelector('#hide-overlay').addEventListener('click', element => {
  document.querySelector('.login-overlay').classList.remove('show')
})

//submit bet
document.querySelector('#submitBet').addEventListener('click', element => {
  if(document.querySelector("input[name='name']").value){
    document.querySelector('.prompt-message').innerText = ''
    let singleDOMBets = Array.from(document.querySelectorAll('.singleBet.locked'))
    let singleBets = {}
    singleDOMBets.forEach((item, i) => {
      singleBets[item.querySelector('select').value ]= Number(item.querySelector('input').value)
    });
    console.log('Single Bets===================')
    console.log(singleBets)

    fetch('bet', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: document.querySelector("input[name='name']").value,
        blackBet: document.querySelector("input[name='bet-black']").value,
        redBet: document.querySelector("input[name='bet-red']").value,
        evenBet: document.querySelector("input[name='bet-even']").value,
        oddBet: document.querySelector("input[name='bet-odd']").value,
        firstDBet: document.querySelector("input[name='bet-first-dozen']").value,
        secondDBet: document.querySelector("input[name='bet-second-dozen']").value,
        thirdDBet: document.querySelector("input[name='bet-third-dozen']").value,
        firstCBet: document.querySelector("input[name='bet-first-column']").value,
        secondCBet: document.querySelector("input[name='bet-second-column']").value,
        thirdCBet: document.querySelector("input[name='bet-third-column']").value,
        'singleBets': singleBets 
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      let winningsElement = document.querySelector('.winnings')
      winningsElement.innerText = Number(winningsElement.innerText)+Number(data.winnings)
      document.querySelector('.result').innerText = " "+ data.number +" "+ data.color
    })
  } else {
    document.querySelector('.prompt-message').innerText = 'Name required!'
  }

})

//Array represents single numbers that can be bet on.
let soloNumbersAvailable = new Array(36)
soloNumbersAvailable.fill(true)
console.log(soloNumbersAvailable)

let lockSingleBet = function(element){
  let button = element.currentTarget
  let tr = button.parentElement.parentElement
  let number = tr.querySelector('select')
  //if the value is lock, locks in values
  if(button.value==='lock'){
    button.value = 'remove'
    button.innerText = 'remove'

    tr.querySelector('input').disabled = true
    number.disabled = true
    soloNumbersAvailable[number.value-1] = false
    tr.classList.remove('unlocked')
    tr.classList.add('locked')
    console.log(soloNumbersAvailable)
  } else {
    soloNumbersAvailable[number.value-1] = true
    button.parentElement.parentElement.remove('')

  }

}



let addSoloBet = function(){
  if(soloNumbersAvailable.filter(item=>item).length && !document.querySelector('.unlocked')){
    let tr = document.createElement('tr')
    tr.classList.add('unlocked','singleBet')

    let buttonCell = document.createElement('td')
    buttonCell.classList.add('button-cell')
    let button = document.createElement('button')
    button.classList.add('single-bet-button')
    button.addEventListener('click',lockSingleBet)
    button.innerText = 'Lock'
    button.setAttribute('value','lock')

    let selectCell = document.createElement('td')
    selectCell.classList.add('select-cell')
    let select = document.createElement('select')
    select.classList.add('number-selection')
    soloNumbersAvailable.forEach((item,i)=>{
      if(item){
        let option = document.createElement('option')
        option.innerText = option.value = i+1
        select.appendChild(option)
      }
    })

    let betCell = document.createElement('td')
    let label = document.createElement('label')
    label.innerText = '$ '
    let input = document.createElement('input')
    input.setAttribute('type', 'number')
    input.setAttribute('min', 0)
    input.setAttribute('placeholder', 'Bet on this number')
    label.appendChild(input)

    buttonCell.appendChild(button)
    tr.appendChild(buttonCell)

    selectCell.appendChild(select)
    tr.appendChild(selectCell)

    betCell.appendChild(label)
    tr.appendChild(betCell)

    document.querySelector('#soloNumbers tbody').appendChild(tr)
  } else {
    console.log('lock in first! OR no numbers left')
  }
}
document.querySelector('#addSingle').addEventListener('click', addSoloBet)
addSoloBet()
