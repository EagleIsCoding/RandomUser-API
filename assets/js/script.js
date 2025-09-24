let nbUsers = 5;
let endpoint = `https://randomuser.me/api/?results=${nbUsers}&nat=fr`;

fetch(endpoint)
    .then(function (response) {
        if (response.status !== 200) {
            console.log("Il y a un problème avec l'API. Code: " + response.status);
            return;
        }
        response.json().then(async function (data) {
            const userListDiv = document.getElementById('user-table');
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Photo</th>
                        <th>Nom</th>
                        <th>Date de naissance</th>
                        <th>Téléphone</th>
                        <th>Email</th>
                        <th>Ville</th>
                        <th>Adresse</th>
                        <th>Météo</th>
                        <th>Pays</th>
                        <th>Drapeau</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            const tbody = table.querySelector('tbody');

            // Boucle pour chaque utilisateur et création des lignes du tableau
            for (let i = 0; i < nbUsers; i++) {
                let user = data.results[i];
                let lat = user.location.coordinates.latitude;
                let lon = user.location.coordinates.longitude;
                let openWeatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=927d2d83eaee07a3316b153501069bed&units=metric`;

                // On récupère la météo pour chaque utilisateur
                let weatherText = '...';
                const weatherResponse = await fetch(openWeatherEndpoint);
                if (weatherResponse.ok) {
                    const weatherData = await weatherResponse.json();
                    console.log(weatherData);
                    weatherText = `${weatherData.main.temp}°C`;
                } else {
                    weatherText = 'N/A';
                }

                let countryCode = user.nat ? user.nat.toLowerCase() : '';
                let flagUrl = countryCode ? `https://flagcdn.com/256x192/${countryCode}.png` : '';

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${user.picture.medium}" alt="Photo de ${user.name.first}"></td>
                    <td>${user.name.first} ${user.name.last}</td>
                    <td>${new Date(user.dob.date).toLocaleDateString('fr-FR')}</td>
                    <td>${user.phone}</td>
                    <td>${user.email}</td>
                    <td>
                        <a href="https://www.google.com/maps/search/?api=1&query=${user.location.city},${user.location.country}" target="_blank">${user.location.city}</a>
                    </td>
                    <td>${user.location.street.number} ${user.location.street.name}</td>
                    <td>${weatherText}</td>
                    <td>${user.location.country}</td>
                    <td><img src="${flagUrl}" alt="Drapeau ${user.location.country}"></td>
                `;
                tbody.appendChild(row);
            }

            userListDiv.appendChild(table);
        });
    });
