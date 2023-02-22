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

function handleGuess(e, nomePais = '') {
  e.preventDefault()

  var guess = ipt_nome.value.toLowerCase()
  nomePais = nomePais.toLowerCase()

  const h2NomePais = document.querySelector('#nome_pais')

  const divChutes = document.querySelector('#chutes')
  const rowChute = document.createElement('p')
  rowChute.classList.add('chute')
  rowChute.innerText = guess
  divChutes.appendChild(rowChute)

  var correto = guess == nomePais

  correto ? h2NomePais.innerText = nomePais : h2NomePais.innerText = ''

  return correto

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

async function app() {
  var data = await fetchData()

  var pais = getRandomCountry(data)
  console.log(pais)

  const objPais = {
    nome: pais.translations.por.common,
    bandeira: pais.flags.png
  }

  var resposta;

  btn_guess.addEventListener('click', (e) => {
    resposta = handleGuess(e, objPais.nome)
  })

  nome_pais.innerText = resposta
  img_bandeira.src = objPais.bandeira
}

app()