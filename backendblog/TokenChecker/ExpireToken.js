// Function to extract and display the expiration time of the JWT

const jwt = require("jsonwebtoken");

function getJwtExpirationTime(token) {
    try {
        // Decode the token without verifying to get the payload
        const decoded = jwt.decode(token);
        // console.log(decoded);
        if (decoded && decoded.exp) {
           
            const currentTime = Math.floor(Date.now() / 1000);
            const timeLeft = decoded.exp - currentTime;
            // console.log(timeLeft);

            if(timeLeft>0){
                console.log(`Time Left: ${Math.floor(timeLeft /60)} minutes ${timeLeft} seconds`)
                return timeLeft;
            }
            else {
                console.log("Expired");
            }
            
        }
        
    } catch (error) {
        console.error("Invalid Token");
        return null;
    }
}

module.exports = {getJwtExpirationTime};