document.querySelector("button").addEventListener("click" , ()=>{
    const departure = document.querySelector("#departureInput").value;
    const arrival  = document.querySelector("#arrivalInput").value;
    const date = document.querySelector("#dateInput").value;
    
    fetch("http://localhost:3000/trips",{
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
        document.querySelector("#resultBox").innerHTML += `
        <div class = "trip">
            <span class = "tripInfo" >${trip.departure} > ${trip.arrival}</span>
            <span class = "tripInfo">13:34</span>
            <span class = "tripInfo">${trip.price}€</span>
            <button id = ${trip._id} class = "bookButton">Book</button>
        </div>
        `;
    }
    initBookBtn()


}

function initBookBtn(){
    const bookBtns = document.querySelectorAll(".bookButton")
    for (const bookBtn of bookBtns){
        bookBtn.addEventListener("click", function(){
            fetch(`http://localhost:3000/trips/${this.id}`)
                .then(response=>response.json())
                .then(data=>console.log(data))
        })
    }
}