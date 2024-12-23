const routeStart = "https://tickethack-backend-three-beta.vercel.app/";
fetch(`${routeStart}panier`)
  .then((response) => response.json())
  .then((data) => {
    if (data.alltrips.some((e) => e.isPaid)) {
      document.querySelector("#cart").innerHTML = `
            <span id = topText>My bookings</span>
            <div id="trajets">
            </div>
            <div id = separationLine></div>
            <span id = "bottomText">Enjoy your travels with Tickethack!</span>
            `;
      for (const trip of data.alltrips) {
        if (trip.isPaid) {
          momentUntilDepart = moment(trip.date).fromNow();
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
                        <span id="villes">${trip.departure} > ${trip.arrival}</span>
                        <span id="heure">${correctedHour}:${correctedMinutes}</span>
                        <span id="prix">${trip.price}€</span>
                        <span>Departure ${momentUntilDepart}</span>
                    </div>   `;

          document.querySelector("#trajets").innerHTML += newTrip;
        }
      }
    }
  });
