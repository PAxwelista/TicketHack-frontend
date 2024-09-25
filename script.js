const routeStart = "https://tickethack-backend-three-beta.vercel.app/"

document.querySelector("button").addEventListener("click" , ()=>{
    const departure = document.querySelector("#departureInput").value;
    const arrival  = document.querySelector("#arrivalInput").value;
    const date = document.querySelector("#dateInput").value;
    
    fetch(`${routeStart}trips`,{
        method : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({departure,arrival,date})
    })
        .then(response=>response.json())
        .then(data=> SetResultTrip(data))
})

function SetResultTrip(obj){
    if (!obj.result){
        document.querySelector("#resultBox").innerHTML =`
        <img id = "resultImg" src= "images/train.png" alt="train">
        <span id = "findText">It's time to book your future trip.</span>
        `;
        document.querySelector("#resultBox").style.justifyContent = "center";
        document.querySelector("#resultBox").style.alignItems = "center";
        document.querySelector("#resultImg").src = "images/notfound.png";
        document.querySelector("#findText").textContent = "No trip found.";
        return;
    }
    document.querySelector("#resultBox").innerHTML = "";
    document.querySelector("#resultBox").style.justifyContent = "start";
    document.querySelector("#resultBox").style.alignItems = "stretch";
    for (const trip of obj.trips){
        let hours = new Date(trip.date).getHours();
        hours = hours < 10 ? "0"+hours : hours;
        let minutes = new Date(trip.date).getMinutes();
        minutes = minutes < 10 ? "0"+minutes : minutes;
        document.querySelector("#resultBox").innerHTML += `
        <div class = "trip">
            <span class = "tripInfo" >${trip.departure} > ${trip.arrival}</span>
            <span class = "tripInfo">${hours}:${minutes}</span>
            <span class = "tripInfo">${trip.price}€</span>
            <button id = ${trip._id} class = "bookButton">Book</button>
        </div>
        `;
    }
    initBookBtn();
}

function initBookBtn(){
    const bookBtns = document.querySelectorAll(".bookButton")
    for (const bookBtn of bookBtns){
        bookBtn.addEventListener("click", function(){
            fetch(`${routeStart}trips/${this.id}`)
                .then(response=>response.json())
                .then(data=>{saveTripToCart(data)})
        })
    }
}

function saveTripToCart(data){
    fetch(`${routeStart}panier` , {
        method : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            departure : data.trip.departure,
            arrival : data.trip.arrival,
            date : data.trip.date,
            price : data.trip.price
        })
    }).then(()=>window.location.assign("panier.html"))
    
}