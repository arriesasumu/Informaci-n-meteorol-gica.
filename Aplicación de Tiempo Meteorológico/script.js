const form = document.querySelector(".top-section form");
const input = document.querySelector("#place-input");
const msg = document.querySelector(".msg");
const list = document.querySelector(".cards .cities");
const apikey = "9063d1c0e40941811c486e55a2d9066d";

form.addEventListener("submit", e => {
    e.preventDefault();
    let inputVal = input.value.trim();

    const listItems = list.querySelectorAll(".city");
    const listItemsArray = Array.from(listItems);

    if (listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter(el => {
            let content = "";
            if (inputVal.includes(",")) {
                if (inputVal.split(",")[1].length > 2) {
                    inputVal = inputVal.split(",")[0];
                    content = el.querySelector(".city-name span").textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city-name span").textContent.toLowerCase();
                }
            } else {
                content = el.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content === inputVal.toLowerCase();
        });

        if (filteredArray.length > 0) {
            msg.textContent = `You already know the weather for ${
                filteredArray[0].querySelector(".city-name span").textContent
            }. Please be more specific with the country code.`;
            form.reset();
            input.focus();
            return;
        }
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apikey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { main, weather, sys, name } = data;
            const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

            const li = document.createElement("li");
            li.classList.add("city");
            const markup = `
    <h2 class="city-name" data-name="${name},${sys.country}">
        <span>${name}</span>
        <span class="country-badge">${sys.country}</span>
    </h2>
    <div class="city-temp-row">
        <span class="city-temp">${Math.round(main.temp)}</span>
        <span class="temp-badge"><span class="degree">°C</span></span>
    </div>
    <figure>
        <img class="city-icon" src="${icon}" alt="${weather[0].description}">
        <figcaption>${weather[0].description}</figcaption>
    </figure>
`;
            li.innerHTML = markup;
            list.appendChild(li);
        })
        .catch(() => {
            msg.textContent = "Please search for a valid city";
        });

    msg.textContent = "";
    form.reset();
    input.focus();
});


