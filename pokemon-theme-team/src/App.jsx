import axios from 'axios'
import './App.css'

function App() {
  // Puts a card (picture + name) on the page
  const generateCard = (pokemon) => {
    const card = document.createElement('div')
    card.className = 'card'

    const img = document.createElement('img')
    img.src = pokemon.sprites.front_default
    img.alt = pokemon.name
    card.appendChild(img)

    const h3 = document.createElement('h3')
    h3.textContent = pokemon.name
    card.appendChild(h3)

    document.querySelector('#team-container').appendChild(card)
  }

  // Runs when the button is clicked
  const buildTeam = async () => {
    const button = document.querySelector('#team-button')
    const message = document.querySelector('#message')
    const container = document.querySelector('#team-container')

    // 1. Get ready: clear old team, show loading, disable button
    container.innerHTML = ''
    message.textContent = 'Loading...'
    button.disabled = true

    try {
      // 2. Get one random Pokemon
      const randomId = Math.floor(Math.random() * 1025) + 1
      const firstResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
      const firstPokemon = firstResponse.data

      // 3. Read its type
      const typeName = firstPokemon.types[0].type.name

      // 4. Get the list of all Pokemon with that type
      const typeResponse = await axios.get(`https://pokeapi.co/api/v2/type/${typeName}`)
      const sameTypeNames = typeResponse.data.pokemon
        .filter((entry) => Number(entry.pokemon.url.split('/')[6]) <= 1025)
        .map((entry) => entry.pokemon.name)
        .filter((name) => name !== firstPokemon.name)

      // 5. Pick 5 random names from that list
      const fiveNames = sameTypeNames.sort(() => Math.random() - 0.5).slice(0, 5)

      // 6. Get the data for each of the 5
      const team = [firstPokemon]
      for (const name of fiveNames) {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        team.push(response.data)
      }

      // 7. Show all 6
      team.forEach((pokemon) => generateCard(pokemon))
      message.textContent = `Theme: ${typeName}`
    } catch (error) {
      console.error('Request failed:', error.message)
      message.textContent = 'Something went wrong. Please try again.'
    } finally {
      button.disabled = false
    }
  }

  return (
    <>
      <h1>Pokemon Theme Team</h1>
      <button id="team-button" onClick={buildTeam}>Build a Team</button>
      <p id="message"></p>
      <div id="team-container"></div>
    </>
  )
}

export default App