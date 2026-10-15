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

function handleSearch(event) {
    // Förhindra att sidan laddas om.
    event.preventDefault();

    const searchTerm = searchInput.value.trim();

    // Visa ett felmeddelande om sökfältet är tomt.
    if (searchTerm === "") {
        errorElement.textContent = "Ange en sökfras.";
        return;
    }

    // Ta bort tidigare felmeddelande vid en giltig sökning.
    errorElement.textContent = "";
    console.log("Sökfras:", searchTerm);
}