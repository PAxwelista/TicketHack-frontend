function updateCounter(){

    fetch('http://localhost:3000/panier')
    .then(response => response.json())
    .then(data => {
        
            const trips= data.alltrips;
            let priceCounter=0;
            for (let trip of trips) {priceCounter+=trip.price} 
            console.log(priceCounter) ;
            document.querySelector('#prixtotal').textContent = `total: ${priceCounter}€`;;   
            
    })
}   

function activateDeleteButtons(){

let deletes = document.querySelectorAll('.buttondelete');//selection de tous les boutons delete

for (let i = 0; i < deletes.length; i++) {deletes[i].addEventListener("click",function(){ //ajout de l'écoute

    const userId = deletes[i].value;
        fetch(`http://localhost:3000/panier`, //suprimer id de la database
            {method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({_id:userId})
        })
            .then(response=>response.json())
            .then(()=>{console.log("trip removed from cart");
                    this.parentNode.remove();//retirer l'élément parent
                    updateCounter();//mettre à jour le compteur
            });

    
})}//fin de la boucle
}

//------------------------------------------------------------------

fetch('http://localhost:3000/panier')//recuperation des voyages dans la database panier
    .then(response => response.json())
    .then(data => {
        console.log(data);


        if (data.alltrips) {
            let cumulatedPrice = 0;
            for (const trip of data.alltrips) {  //ajout des blocs = ajout du innerHTML
                
                if (!trip.isPaid){
               
                    const correctedDate = new Date(trip.date);
                    let correctedHour = correctedDate.getHours();
                    if (Number(correctedHour)<10){correctedHour="0"+correctedHour};
                    let correctedMinutes = correctedDate.getMinutes();
                    if (correctedMinutes<10){correctedMinutes="0"+correctedMinutes};
                    const newTrip = `<div class="allerretourContainer">
                        <span id="villes">${trip.departure} > ${trip.arrival}</span>
                        <span id="heure">${correctedHour}:${correctedMinutes}</span>
                        <span id="prix">${trip.price}€</span>
                        <button class="buttondelete" value="${trip._id}">x</button>
                    </div>   `;

                document.querySelector("#trajets").innerHTML += newTrip;
                cumulatedPrice += trip.price
                }
            }//fin de la boucle

            document.querySelector('#prixtotal').textContent = `total: ${cumulatedPrice}€`;//affichage du total initial

            let deletes = document.querySelectorAll('.buttondelete');//selection de tous les boutons delete
            
            for (let i = 0; i < deletes.length; i++) {deletes[i].addEventListener("click",function(){ //ajout de l'écoute

                const userId = deletes[i].value;
                    fetch(`http://localhost:3000/panier`, //clic: suprimer id de la database
                        {method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({_id:userId})
                    })
                        .then(response=>response.json())
                        .then(()=>{console.log("trip removed from cart");
                                this.parentNode.remove();//clic: retirer l'élément parent
                                updateCounter();//clic: mettre à jour le compteur

                        });

                
            })//fin de la boucle
            
            }
        }
    })//fin du .then

//---------------------------------------------------------------------------------------------------------
