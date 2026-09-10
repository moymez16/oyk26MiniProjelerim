import { useState, useEffect } from "react";
import "./App.css";

const STAT_LABELS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

function formatLabel(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatPokemonId(id) {
  return `#${String(id).padStart(3, "0")}`;
}

function getIdFromUrl(url) {
  const parts = url.replace(/\/$/, "").split("/");
  return parts[parts.length - 1];
}

function getArtworkUrl(pokemon) {
  return pokemon.sprites?.other?.home?.front_default || pokemon.sprites?.front_default || "";
}

function PokemonDetail({ pokemon }) {
  const artworkUrl = getArtworkUrl(pokemon);
  const primaryType = pokemon.types[0]?.type.name ?? "normal";

  return (
    <article className="pokemon-detail">
      <div className="detail-hero">
        <div className="detail-artwork" data-type={primaryType}>
          {artworkUrl ? (
            <img src={artworkUrl} alt={formatLabel(pokemon.name)} />
          ) : (
            <p className="artwork-fallback">No artwork available</p>
          )}
        </div>

        <header className="detail-header">
          <p className="detail-id">{formatPokemonId(pokemon.id)}</p>
          <h2>{formatLabel(pokemon.name)}</h2>
          <ul className="type-list">
            {pokemon.types.map((entry) => (
              <li key={entry.type.name} className="type-badge" data-type={entry.type.name}>
                {formatLabel(entry.type.name)}
              </li>
            ))}
          </ul>
        </header>
      </div>

      <section className="detail-section">
        <h3>Profile</h3>
        <dl className="profile-grid">
          <div>
            <dt>Height</dt>
            <dd>{pokemon.height / 10} m</dd>
          </div>
          <div>
            <dt>Weight</dt>
            <dd>{pokemon.weight / 10} kg</dd>
          </div>
          <div>
            <dt>Base XP</dt>
            <dd>{pokemon.base_experience ?? "—"}</dd>
          </div>
          <div>
            <dt>Abilities</dt>
            <dd>
              {pokemon.abilities.map((entry, index) => (
                <span key={entry.ability.name}>
                  {index > 0 ? ", " : ""}
                  {formatLabel(entry.ability.name)}
                  {entry.is_hidden ? " (hidden)" : ""}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      <section className="detail-section">
        <h3>Stats</h3>
        <dl className="stats-list">
          {pokemon.stats.map((entry) => (
            <div key={entry.stat.name} className="stat-row">
              <dt>{STAT_LABELS[entry.stat.name] ?? formatLabel(entry.stat.name)}</dt>
              <dd>{entry.base_stat}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}

function App() {
  const [pokemonsList, setPokemonsList] = useState(null);
  const [currentPageApiUrl, setCurrentPageApiUrl] = useState("https://pokeapi.co/api/v2/pokemon/");
  const [selectedPokemonApiUrl, setSelectedPokemonApiUrl] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [themeTypes, setThemeTypes] = useState(null);

  useEffect(() => {
    fetch(currentPageApiUrl)
      .then((response) => response.json())
      .then((data) => setPokemonsList(data));
  }, [currentPageApiUrl]);

  useEffect(() => {
    if (selectedPokemonApiUrl === null) return;

    fetch(selectedPokemonApiUrl)
      .then((response) => response.json())
      .then((data) => {
        setSelectedPokemon(data);
        const types = data.types.map((entry) => entry.type.name);
        setThemeTypes({
          primary: types[0] ?? "normal",
          secondary: types[1] ?? types[0] ?? "normal",
        });
      });
  }, [selectedPokemonApiUrl]);

  return (
    <div
      className="pokedex"
      data-theme={themeTypes?.primary}
      data-theme-secondary={
        themeTypes && themeTypes.secondary !== themeTypes.primary
          ? themeTypes.secondary
          : undefined
      }
    >
      <header className="pokedex-header">
        <h1>Pokédex</h1>
      </header>

      <div className="pokedex-body">
        <aside className="list-panel">
          {pokemonsList === null ? (
            <p className="panel-status">Loading...</p>
          ) : (
            <>
              <div className="list-toolbar">
                <button
                  type="button"
                  onClick={() => setCurrentPageApiUrl(pokemonsList.previous)}
                  disabled={pokemonsList.previous === null}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPageApiUrl(pokemonsList.next)}
                  disabled={pokemonsList.next === null}
                >
                  Next
                </button>
              </div>

              <ul className="pokemon-list">
                {pokemonsList.results.map((pokemon) => (
                  <li key={pokemon.name}>
                    <button
                      type="button"
                      className={selectedPokemonApiUrl === pokemon.url ? "is-selected" : ""}
                      onClick={() => {
                        setSelectedPokemonApiUrl(pokemon.url);
                        setSelectedPokemon(null);
                      }}
                    >
                      <span className="list-id">{formatPokemonId(getIdFromUrl(pokemon.url))}</span>
                      <span className="list-name">{formatLabel(pokemon.name)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>

        <main className="detail-panel">
          {selectedPokemonApiUrl === null ? (
            <p className="panel-status">Select a Pokémon to see its details.</p>
          ) : selectedPokemon === null ? (
            <p className="panel-status">Loading details...</p>
          ) : (
            <PokemonDetail pokemon={selectedPokemon} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
