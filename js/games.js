

let games;

const gamesContainer = document.getElementById('games-container');

async function loadGames()
{
    const response = await fetch('./json/games.json');
    const data = await response.json();
    games = data.consoles;

    createGames();
}

function createGames()
{
    const consoleKeys = Object.keys(games);

    if(consoleKeys.length > 0)
    {
        consoleKeys.forEach(consoleName => {
            const gameList = games[consoleName];

            const gameKeys = Object.keys(gameList);

            const consoleContainer = document.createElement('div');
            consoleContainer.classList.add('console-container');

            const consoleTitle = document.createElement('h2');
            consoleTitle.textContent = consoleName;
            consoleTitle.classList.add('console-title');
            consoleContainer.appendChild(consoleTitle);

            gameKeys.forEach(gameName => {
                const game = gameList[gameName];
            
                const gameRelease = game.release;
                const gameGenre = game.genre;

                const gameContainer = document.createElement('div');
                gameContainer.classList.add('game-container');

                const gameTitleElement = document.createElement('h3');
                gameTitleElement.textContent = gameName;
                gameTitleElement.classList.add('game-title');
                gameContainer.appendChild(gameTitleElement);

                const gameReleaseElement = document.createElement('p');
                gameReleaseElement.textContent = gameRelease;
                gameReleaseElement.classList.add('game-release');
                gameContainer.appendChild(gameReleaseElement);

                const gameGenreElement = document.createElement('p');
                gameGenreElement.textContent = gameGenre;
                gameGenreElement.classList.add('game-genre');
                gameContainer.appendChild(gameGenreElement);

                consoleContainer.appendChild(gameContainer);
            });

            gamesContainer.appendChild(consoleContainer);
        });
    }
}

loadGames();