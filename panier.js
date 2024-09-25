const routeStart= 'https://tickethack-backend-three-beta.vercel.app/'



//***FONCTION UPDATECOUNTER***-----------------

function updateCounter() {

    fetch(`${routeStart}panier/unpaid`)
        .then(response => response.json())
        .then(data => {
            console.log(data.unpaidTrips);
            let allTrips = data.unpaidTrips;
            let priceCounter = 0;
            for (let trip of allTrips) { priceCounter += trip.price }
            //console.log(priceCounter);
            document.querySelector('#prixtotal').textContent = `total: ${priceCounter}€`;;

        })
}
//***FONCTION ACTIVATEDELETEBUTTONS***-----------------

function activateDeleteButtons() {

    let deletes = document.querySelectorAll('.buttondelete');//selection de tous les boutons delete

    for (let i = 0; i < deletes.length; i++) {
        deletes[i].addEventListener("click", function () { //ajout de l'écoute

            const userId = deletes[i].value;
            fetch(`${routeStart}panier`, //clic: suprimer div-id de la database
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ _id: userId })
                })
                .then(response => response.json())
                .then(() => {
                    console.log("trip removed from cart");
                    updateCounter();//clic: mettre à jour le compteur
                    console.log(this.parentNode.parentNode.parentNode.children.length);
                    if (this.parentNode.parentNode.parentNode.children.length>1){this.parentNode.parentNode.remove();}//clic: retirer l'élément parent   
                    else {this.parentNode.parentNode.remove();
                        displayEmptyCart();
                    }

                });


        })
    }//fin de la boucle
}
//-------------FONCTION AFFICHAGE PANIER VIDE-------------------------

function displayEmptyCart(){document.querySelector("#cart").innerHTML=
    
    `<div class="emptyBasket">
        <span class ="noBooking">No booking yet.</span>
        <span class ="noBooking">Why not plan a trip?</span>

    </div>`}

//-------------MISE A JOUR DU PANIER A L'AFFICHAGE---------------------

fetch(`${routeStart}panier`)//recuperation des voyages dans la database panier
    .then(response => response.json())
    .then(data => {
        console.log(data);


        if (data.alltrips.some(e=>!e.isPaid))  {
            let cumulatedPrice = 0;
            for (const trip of data.alltrips) {  //ajout des blocs = ajout du innerHTML

                if (!trip.isPaid) {

                    const correctedDate = new Date(trip.date);
                    let correctedHour = correctedDate.getHours();
                    if (Number(correctedHour) < 10) { correctedHour = "0" + correctedHour };
                    let correctedMinutes = correctedDate.getMinutes();
                    if (correctedMinutes < 10) { correctedMinutes = "0" + correctedMinutes };
                    const newTrip = `<div class="allerretourContainer">
                        <span>${trip.departure} > ${trip.arrival}</span>
                        <span>${correctedHour}:${correctedMinutes}</span>
                        <span>${trip.price}€</span>
                        <div class=buttonContainer>
                            <button class="buttondelete" value="${trip._id}">x</button>
                        </div>
                    </div>   `;

                    document.querySelector("#trajets").innerHTML += newTrip;
                    cumulatedPrice += trip.price
                }
            }//fin de la boucle

            document.querySelector('#prixtotal').textContent = `Total: ${cumulatedPrice}€`;//affichage du total initial
            activateDeleteButtons()//activer boutons delete

        }//fin du if(data.alltrips)
else {
    displayEmptyCart();
};
    
    })//fin du .then

//---------------------------------------------------------------------------------------------------------

function purchase() {
    fetch(`${routeStart}panier/book`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },//updater à isPaid = true les trips du panier
        })
        .then(response => response.json())
        .then(() => {
            console.log("trips paid");
            document.querySelector('#prixtotal').textContent = `total: 0€`//mettre à 0 le compteur
            window.location.assign("book.html")//renvoyer vers page 3
        });
};

document.querySelector("#button").addEventListener("click", purchase);