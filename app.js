async function fetchData() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all')

    if(!response.ok) {
      throw new Error(`Erro HTTP. Status: ${response.status}, ${response.statusText}`)
    }

    if(response.status == 200) {
      var data = await response.json()
      
      return data
    }

  } catch (error) {
    console.error(error)
  }
}

function proximoPais(pais, paises) {
  const newPais = getRandomCountry(paises)
  
  pais = {
    nome: newPais.translations.por.common,
    bandeira: newPais.flags.png
  }

  console.log('Resposta: ', pais.nome)

  setTimeout(() => {
    img_bandeira.src = pais.bandeira
    const divChutes = document.querySelector('#chutes')
    divChutes.innerHTML = ''
    nome_pais.innerText = ''
    ipt_nome.value = ''
  }, 1000)

  return pais
}

function criarChute(chute) {
  const divChutes = document.querySelector('#chutes')
  const rowChute = document.createElement('p')
  rowChute.classList.add('chute')
  rowChute.innerText = chute
  divChutes.appendChild(rowChute)
}

function handleGuess(e, nomePais = '') {
  e.preventDefault()

  var guess = ipt_nome.value.toLowerCase()
  nomePais = nomePais.toLowerCase()

  const h2NomePais = document.querySelector('#nome_pais')

  criarChute(guess)

  // '0' ==  0 true
  //  0  ==  0 true
  // '0' === 0 false

  var correto = guess == nomePais

  correto ? h2NomePais.innerText = nomePais : h2NomePais.innerText = ''

  return correto

}

function desistir() {
  return confirm('Deseja desistir?')
}

/*
Math.random() retorna um numero psêudoaleatório entre 0 e 1.
O numero então é multiplicado pelo tamanho do array dos paises
Usando Math.floor() o produto da multiplicação é arredondado para o numero inteiro menor
Então a função retorna um elemento aleatório do array 
*/

function getRandomCountry(arr) {
  if(!Array.isArray(arr)) {
    console.error('Argumento tem que ser um array.')
    return
  }
  return arr[Math.floor(Math.random() * arr.length)]
}

function setScore(newScore) {
  const h2Score = document.querySelector('#h2_score')
  h2Score.innerText = newScore
}

async function app() {
  
  var data = await fetchData()
  
  var pais = getRandomCountry(data)
  
  var objPais = {
    nome: pais.translations.por.common,
    bandeira: pais.flags.png
  }

  console.log('Resposta: ', objPais.nome)

  var score = 0

  var resposta;

  btn_guess.addEventListener('click', (e) => {
    resposta = handleGuess(e, objPais.nome)
    if(resposta) {
      objPais = proximoPais(objPais, data) 
      score += 1
    }else {
      score = 0
    }
    setScore(score)
  })

  btn_desistir.addEventListener('click', (e) => {
    e.preventDefault()
    var desistiu = confirm('Deseja desistir?')
    if(desistiu) {
      objPais = proximoPais(objPais, data)
      score = 0
      setScore(score)
    }
  })

  nome_pais.innerText = resposta
  img_bandeira.src = objPais.bandeira
}

app()