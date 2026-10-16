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

        // Visa det första receptet i konsolen.
        // Receptet ska senare skrivas ut på webbsidan.
        console.log(recipes[0]);
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