// we just want this file to be self contained.

const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors } = require('./seedHelpers');
const adventureSites = require('../models/sites')

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/Xplore');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "correction error:"))
db.once("open", () => {
    console.log("Database Connected")
})


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await adventureSites.deleteMany({});
    for (let i = 0; i < 70; i++) {
        const random1000 = Math.floor(Math.random() * 190);
        const price = Math.floor(Math.random() * 400) + 150;

        const site = new adventureSites({
            author : '64889e68999790cf194004be',
            location: `${cities[random1000].name}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',          
            price,
            geometry: {
              type: "Point",
              coordinates: [
                cities[random1000].lon,
                cities[random1000].lat
              ]
          },
            images: [
                {
                  url: 'https://res.cloudinary.com/djud9fq8h/image/upload/v1687268608/Xplore/i8jo50e52wpk48ygcoay.jpg',
                  filename: 'Xplore/i8jo50e52wpk48ygcoay'
                 
                },
                {
                  url: 'https://res.cloudinary.com/djud9fq8h/image/upload/v1687348841/Xplore/mmg9p1weath108c8dadd.jpg',
                  filename: 'Xplore/mmg9p1weath108c8dadd'
                }
              ]
        })
        await site.save();
    }
}

//async function returns a promise
seedDB().then(() => {
    mongoose.connection.close();
})