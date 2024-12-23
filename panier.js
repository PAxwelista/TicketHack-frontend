const routeStart = "https://tickethack-backend-three-beta.vercel.app/";

function updateCounter() {
  fetch(`${routeStart}panier/unpaid`)
    .then((response) => response.json())
    .then((data) => {
      let allTrips = data.unpaidTrips;
      let priceCounter = 0;
      for (let trip of allTrips) {
        priceCounter += trip.price;
      }
      if (allTrips.length) {
        document.querySelector(
          "#prixtotal"
        ).textContent = `total: ${priceCounter}€`;
      }
    });
}
function activateDeleteButtons() {
  let deletes = document.querySelectorAll(".buttondelete");

  for (let i = 0; i < deletes.length; i++) {
    deletes[i].addEventListener("click", function () {
      const userId = deletes[i].value;
      fetch(`${routeStart}panier`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: userId }),
      })
        .then((response) => response.json())
        .then(() => {
          updateCounter();

          if (this.parentNode.parentNode.parentNode.children.length > 1) {
            this.parentNode.parentNode.remove();
          } else {
            this.parentNode.parentNode.remove();
            displayEmptyCart();
          }
        });
    });
  }
}

function displayEmptyCart() {
  document.querySelector("#cart").innerHTML = `<div class="emptyBasket">
        <span class ="noBooking">No booking yet.</span>
        <span class ="noBooking">Why not plan a trip?</span>

    </div>`;
}

fetch(`${routeStart}panier`)
  .then((response) => response.json())
  .then((data) => {
    if (data.alltrips.some((e) => !e.isPaid)) {
      let cumulatedPrice = 0;
      for (const trip of data.alltrips) {
        if (!trip.isPaid) {
          const correctedDate = new Date(trip.date);
          let correctedHour = correctedDate.getHours();
          if (Number(correctedHour) < 10) {
            correctedHour = "0" + correctedHour;
          }
          let correctedMinutes = correctedDate.getMinutes();
          if (correctedMinutes < 10) {
            correctedMinutes = "0" + correctedMinutes;
          }
          const newTrip = `<div class="allerretourContainer">
                        <span>${trip.departure} > ${trip.arrival}</span>
                        <span>${correctedHour}:${correctedMinutes}</span>
                        <span>${trip.price}€</span>
                        <div class=buttonContainer>
                            <button class="buttondelete" value="${trip._id}">x</button>
                        </div>
                    </div>   `;

          document.querySelector("#trajets").innerHTML += newTrip;
          cumulatedPrice += trip.price;
        }
      }

      document.querySelector(
        "#prixtotal"
      ).textContent = `Total: ${cumulatedPrice}€`;
      activateDeleteButtons();
    } else {
      displayEmptyCart();
    }
  });
function purchase() {
  fetch(`${routeStart}panier/book`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then(() => {
      document.querySelector("#prixtotal").textContent = `total: 0€`;
      window.location.assign("book.html");
    });
}

document.querySelector("#button").addEventListener("click", purchase);
