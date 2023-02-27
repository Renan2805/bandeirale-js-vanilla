
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
    nomes: [
      newPais.translations.por.common,
      newPais.name.common
    ],
    bandeira: newPais.flags.png
  }

  console.log('Resposta: ', pais.nomes)

  const imgBandeira = document.querySelector('#img_bandeira')
  const h2NomePais = document.querySelector('#nome_pais')
  const inputNome = document.querySelector('#ipt_nome')

  setTimeout(() => {
    imgBandeira.src = pais.bandeira
    const divChutes = document.querySelector('#chutes')
    divChutes.innerHTML = ''
    h2NomePais.innerText = ''
    inputNome.value = ''
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

function handleGuess(e, nomesPais = []) {
  e.preventDefault()

  const inputNome = document.querySelector('#ipt_nome')

  var guess = inputNome.value.toLowerCase()
  guess = formatarNomePais(guess)
  nomesPais = nomesPais.map(nome => nome.toLowerCase())
  nomesPais = nomesPais.map(nome => formatarNomePais(nome))

  const h2NomePais = document.querySelector('#nome_pais')

  criarChute(guess)

  inputNome.value = ''

  var correto = nomesPais.includes(guess)

  correto ? h2NomePais.innerText = nomesPais[0] : h2NomePais.innerText = ''

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

function formatarNomePais(nome) {
  if(typeof nome != "string") return nome
  return nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

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
  
  console.log(pais)

  var objPais = {
    nomes: [
      pais.translations.por.common,
      pais.name.common
    ],
    bandeira: pais.flags.png
  }

  console.log('Resposta: ', objPais.nomes)

  var score = 0

  var resposta;

  const h2NomePais = document.querySelector('#nome_pais')
  const btnGuess  = document.querySelector('#btn_guess')
  btnGuess.addEventListener('click', (e) => {
    resposta = handleGuess(e, objPais.nomes)
    if(resposta) {
      objPais = proximoPais(objPais, data) 
      score += 1
    }else {
      score = 0
    }
    setScore(score)
  })

  const btnDesistir = document.querySelector('#btn_desistir')
  btnDesistir.addEventListener('click', (e) => {
    e.preventDefault()
    var desistiu = confirm('Deseja desistir?')
    if(desistiu) {
      h2NomePais.innerText = objPais.nomes[0]
      objPais = proximoPais(objPais, data)
      score = 0
      setScore(score)
    }
  })

  

  h2NomePais.innerText = resposta ? resposta : ''

  const imgBandeira = document.querySelector('#img_bandeira')
  imgBandeira.src = objPais.bandeira
}

app()