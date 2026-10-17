"use strict";
/*
 * Laboration 6 - Receptsökaren
 * Namn: Maida Erovic
 */

// Hämta element för sökning och visning av recept.
const searchForm = document.querySelector("#searchform");
const searchInput = document.querySelector("#search");
const errorElement = document.querySelector("#error");
const messageElement = document.querySelector("#message");
const recipeElement = document.querySelector("#recipe");

// Lyssna på när användaren skickar sökformuläret.
searchForm.addEventListener("submit", handleSearch);

async function handleSearch(event) {
    // Förhindra att sidan laddas om.
    event.preventDefault();

    const searchTerm = searchInput.value.trim();

    // Visa ett felmeddelande om sökfältet är tomt.
    if (searchTerm === "") {
        errorElement.textContent = "Ange en sökfras.";
        return;
    }

    // Rensa tidigare meddelanden och recept inför en ny sökning.
    errorElement.textContent = "";
    messageElement.textContent = "";
    recipeElement.replaceChildren();

    try {
        const recipes = await fetchRecipes(searchTerm);

        if (recipes.length === 0) {
            messageElement.textContent =
                "Inget recept hittades. Prova en annan sökfras.";
            return;
        }

        // Visa det första receptet på webbsidan.
        displayRecipe(recipes[0]);
    } catch (error) {
        // Ta bort eventuellt recept och visa ett tydligt felmeddelande.
        recipeElement.replaceChildren();

        messageElement.textContent =
            "Det gick inte att hämta recept. Försök igen senare.";

        console.error("Fel vid hämtning av recept:", error);
    }
}

// Hämta recept som matchar användarens sökfras.
async function fetchRecipes(searchTerm) {
    const url =
        "https://dummyjson.com/recipes/search?q=" +
        encodeURIComponent(searchTerm);

    const response = await fetch(url);

    // Kontrollera att servern har skickat ett lyckat svar.
    if (!response.ok) {
        throw new Error(`HTTP-fel: ${response.status}`);
    }

    // Omvandla JSON-svaret till ett JavaScript-objekt.
    const data = await response.json();

    // Kontrollera att svaret innehåller en array med recept.
    if (!Array.isArray(data.recipes)) {
        throw new Error("API-svaret saknar en giltig receptlista.");
    }

    return data.recipes;
}
// Skapa och visa receptets namn, bild och grundläggande information.
function displayRecipe(recipe) {
    // Ta bort tidigare recept.
    recipeElement.replaceChildren();

    const article = document.createElement("article");

    const heading = document.createElement("h3");
    heading.textContent = recipe.name;

    const image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.name;

    const info = document.createElement("div");
    info.classList.add("recipe-info");

    info.appendChild(createInfoParagraph("Servings:", recipe.servings));
    info.appendChild(
        createInfoParagraph("Prep time:", `${recipe.prepTimeMinutes} minutes`)
    );
    info.appendChild(
        createInfoParagraph("Cooking time:", `${recipe.cookTimeMinutes} minutes`)
    );
    info.appendChild(createInfoParagraph("Difficulty:", recipe.difficulty));

    article.appendChild(heading);
    article.appendChild(image);
    article.appendChild(info);

    recipeElement.appendChild(article);
}

// Skapa ett informationsstycke med en fet etikett och ett värde.
function createInfoParagraph(label, value) {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = label;
    paragraph.appendChild(strong);
    paragraph.appendChild(document.createTextNode(` ${value}`));

    return paragraph;
}