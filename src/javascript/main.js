"use strict"
import Chart from 'chart.js/auto';

//skapar variablar av knapp elementen i html
let openButton = document.getElementById("open-menu")
let closeButton = document.getElementById("close-menu")


//skapar en eventlistener som lyssnar efter när användare klickar på dessa element
openButton.addEventListener('click', toggleMenu)
closeButton.addEventListener('click', toggleMenu)
//function som kollar ifall mobilmenyn visas eller inte när man trycker på respektive knapp, om den inte visas så visas den och vice versa. Den ändrar knappens css ifall display är none till block annars ändras den till none
function toggleMenu(){
    let mobileMenuEl = document.getElementById("mobilemenu")
    let style = window.getComputedStyle(mobileMenuEl)

    if(style.display === "none") {
        mobileMenuEl.style.display = "block";
    } else{
        mobileMenuEl.style.display = "none"
    }
}

/**
 * Anropar funktionen init när sidan laddas in
 */

window.onload = init;

function init(){
    getAdmissionData()
}

/**
 * Hämtar in antagninsstatistiken från en extern URL och anropar sedan funktionerna med URLens data som argument
 * 
 * 
 * @async
 * @function
 */

async function getAdmissionData(){
    try{
        const response = await fetch('https://studenter.miun.se/~mallar/dt211g/');

        if (!response.ok){
            throw new Error ('Nätverksproblem - felaktigt svar från servern');
        }

    const data = await response.json();
    displayDiagram(data);
    displayStaple(data);
    } catch (error){
        console.error('Det uppstod ett fel:', error.message);
    }
}

/**
 * Skapar ett cirkeldiagram baserat på de mest populära programmen
 * @param {object[]} data - Array med objekt som innehåller ansökningsstatistiken till kurser och program.
 * @param {string} data[].type - Vad för typ objektet är "Program" eller "kurs"
 * @param {string} data[].name - Namnet på programmet eller kursen
 * @param {string} data[].applicantsTotal - Totalt antal sökande till programmet eller kursen
 */

function displayDiagram(data){
    
    const sortedData = data
        .filter(item => item.type ==='Program')
        .sort((a, b) => b.applicantsTotal - a.applicantsTotal)
        .slice(0, 6)

        const colors = ['#41afaa','#46eb4','#00a0e1','#e6a532','#d7642c','#af4b91']
        const labels = sortedData.map(item => item.name)
        const applicantsTotal = sortedData.map(item => Number(item.applicantsTotal))
        
        const diag = document.getElementById('cirkeldiagram').getContext('2d')
        new Chart(diag, {
            type:'pie',
            data:{
                labels: labels,
                datasets: [{
                    data: applicantsTotal,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            }
        })
}

/**
 * Skapar ett Stapeldiagram baserat på de mest populära kurserna
 * @param {object[]} data - Array med objekt som innehåller ansökningsstatistiken till kurser och program.
 * @param {string} data[].type - Vad för typ objektet är "Program" eller "kurs"
 * @param {string} data[].name - Namnet på programmet eller kursen
 * @param {string} data[].applicantsTotal - Totalt antal sökande till programmet eller kursen
 */

function displayStaple(data){
    
    const sortedData = data
        .filter(item => item.type ==='Kurs')
        .sort((a, b) => b.applicantsTotal - a.applicantsTotal)
        .slice(0, 5)

        const colors = ['#41afaa','#46eb4','#00a0e1','#e6a532','#d7642c','#af4b91']
        const labels = sortedData.map(item => item.name)
        const applicantsTotal = sortedData.map(item => Number(item.applicantsTotal))
        
        const diag = document.getElementById('stapeldiagram').getContext('2d')
        new Chart(diag, {
            type:'bar',
            data:{
                labels: labels,
                datasets: [{
                    data: applicantsTotal,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive:true,
                plugins:{
                    legend:{
                        position: 'top',
                    }
                }
            }
        })
}
/**
 * Hämtar sökknappen och lägger till en eventlistener för att anropa sökfunktionen
 * @constant {HTMLElement} searchBut - Sökknappen i DOM
 */
const searchBut = document.getElementById('searchbut')
searchBut.addEventListener('click', searchlocation)

/**
 * Funktion för att söka i kartan med hjälp av Openstreetmaps nominatim API
 * @async
 * @function searchlocation
 */

async function searchlocation(){
    let location = document.getElementById('locationinput').value;
    /**
     * Hämtar användarens inmatning och lägger det i en variabel
     * @type {string}
     */
    try{
        /**
         * Hämtar API baserat på vad användaren matat in
         */
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`);

        if (!response.ok){
            throw new Error ('Nätverksproblem - felaktigt svar från servern');
        }
    /**
     * omvandlar API-svaret till JSON
     */
    const data = await response.json();
    /**
     * Latitude från platsen, parsefloat för att parsea strängen till ett nummer
     * @type {number}
     */
    let lat = parseFloat(data[0].lat)
    let lon = parseFloat(data[0].lon)
    /**
     * iframe elementet där kartan visas
     * @constant {HTMLElement} map - iframe i DOM
     */
    let map = document.getElementById('mapcont')
    /**
     * Url som visarr kartan i iframen beserat på det hämtade korodinaterna
     * @constant {string} map.src - OpenStreetMap inbäddad kart url
     */
    map.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01},${lat-0.01},${lon+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lon}`

    } catch (error){
        console.error('Det uppstod ett fel:', error.message);

    }
}