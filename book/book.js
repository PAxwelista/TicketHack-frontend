fetch ('http://localhost:3000/panier')
.then(response=>response.json())
.then (data=>{
    console.log(data);
    

    if (data.alltrips){
    let cumulatedPrice=0;
    for (const trip of data.alltrips){
   
    const correctedDate = new Date(trip.date);
    const newTrip= `<div class="allerretourContainer">
                    <span id="villes">${trip.departure} > ${trip.arrival}</span>
                    <span id="heure">${correctedDate.getHours()}:${correctedDate.getMinutes()}</span>
                    <span id="prix">${trip.price}€</span>
                    <button class="buttondelete" id=${trip.departure}>x</button>
                </div>   `;
    
document.querySelector("#trajets").innerHTML+=newTrip;
cumulatedPrice += trip.price

}
document.querySelector('#prixtotal').textContent=`total: ${cumulatedPrice}€`
    }
})
