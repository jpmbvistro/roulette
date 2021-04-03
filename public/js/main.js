

document.querySelector('#admin-login-button').addEventListener('click', element=>{
  document.querySelector('.login-overlay').classList.add('show')
})

document.querySelector('#hide-overlay').addEventListener('click', element => {
  document.querySelector('.login-overlay').classList.remove('show')
})

const boardTranslation = {
  32:360/37*1,
  15:360/37*2,
  19:360/37*3,
  4:360/37*4,
  21:360/37*5,
  2:360/37*6,
  25:360/37*7,
  17:360/37*8,
  34:360/37*9,
  6:360/37*10,
  27:360/37*11,
  13:360/37*12,
  36:360/37*13,
  11:360/37*14,
  30:360/37*15,
  8:360/37*16,
  23:360/37*17,
  10:360/37*18,
  5:360/37*19,
  24:360/37*20,
  16:360/37*21,
  33:360/37*22,
  1:360/37*23,
  20:360/37*24,
  14:360/37*25,
  31:360/37*26,
  9:360/37*27,
  22:360/37*28,
  18:360/37*29,
  29:360/37*30,
  7:360/37*31,
  28:360/37*32,
  12:360/37*33,
  35:360/37*34,
  3:360/37*35,
  26:360/37*36,
}

//submit bet
document.querySelector('#submitBet').addEventListener('click', element => {
  if(document.querySelector("input[name='name']").value){
    document.querySelector('.roulette-board-container').style.transition = '0s'
    document.querySelector('.roulette-board-container').style.transform = 'rotate(0deg)'
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
      document.querySelector('.roulette-board-container').style.transition = 'all 3s ease-out'
      console.log(`Degrees: ${boardTranslation[data.number]}`)
      document.querySelector('.roulette-board-container').style.transform = `rotate(${1080+(360-boardTranslation[data.number])}deg)`

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
