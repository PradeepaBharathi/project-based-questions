const readline = require('readline');

class Taxi {
    constructor(id) {
        this.id = id;
        this.currentLocation = 'A'; 
        this.earnings = 0;
        this.isAvailable = true;
    }

    
    updateLocation(newLocation, distance) {
        this.currentLocation = newLocation;
        this.earnings += this.calculateFare(distance);
    }


    calculateFare(distance) {
        if (distance <= 5) {
            return 100;
        } else {
            return 100 + (distance - 5) * 10;
        }
    }
}

class Point {
    constructor(name, distanceFromA) {
        this.name = name;
        this.distanceFromA = distanceFromA;
    }
}

class BookingSystem {
    constructor(numTaxis) {
        this.taxis = [];
        this.points = [];
        this.initializeTaxis(numTaxis);
        this.initializePoints();
    }

    initializeTaxis(numTaxis) {
        for (let i = 1; i <= numTaxis; i++) {
            this.taxis.push(new Taxi(i));
        }
    }

    initializePoints() {
        const pointNames = ['A', 'B', 'C', 'D', 'E', 'F'];
        const distances = [0, 15, 30, 45, 60, 75];
        for (let i = 0; i < pointNames.length; i++) {
            this.points.push(new Point(pointNames[i], distances[i]));
        }
    }

    
    findNearestAvailableTaxi(currentPoint, dropPoint) {
        let nearestTaxi = null;
        let minDistance = Infinity;
        for (let taxi of this.taxis) {
            if (taxi.isAvailable) {
                const distance = this.calculateDistance(currentPoint, taxi.currentLocation) + this.calculateDistance(taxi.currentLocation, dropPoint);
                if (distance < minDistance) {
                    nearestTaxi = taxi;
                    minDistance = distance;
                }
            }
        }
        return nearestTaxi;
    }

    
    calculateDistance(point1, point2) {
        const p1 = this.points.find(p => p.name === point1);
        const p2 = this.points.find(p => p.name === point2);
        return Math.abs(p1.distanceFromA - p2.distanceFromA);
    }

    
    bookTaxi(pickupPoint, dropPoint) {
        let availableTaxi = this.taxis.find(taxi => taxi.isAvailable && taxi.currentLocation === pickupPoint);

        if (!availableTaxi) {
            availableTaxi = this.findNearestAvailableTaxi(pickupPoint, dropPoint);
        }

        if (availableTaxi) {
            const distance = this.calculateDistance(pickupPoint, dropPoint);
            const fare = availableTaxi.calculateFare(distance);
            availableTaxi.updateLocation(dropPoint, distance);
            availableTaxi.isAvailable = false;
            console.log(`Taxi ${availableTaxi.id} booked from ${pickupPoint} to ${dropPoint} fare amount id ${fare}`);
            return availableTaxi;
        } else {
            console.log('No taxis available.');
            return null;
        }
    }
}


const bookingSystem = new BookingSystem(4);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function promptUser() {
    rl.question('Enter pickup point: ', (pickupPoint) => {
        rl.question('Enter drop point: ', (dropPoint) => {
            bookingSystem.bookTaxi(pickupPoint, dropPoint);
            promptUser(); 
                });
    });
}

promptUser();


