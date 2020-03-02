//Required node packages
const express = require("express");
const path = require("path");
const fs = require("fs");
const port = 3000;

//absolute path to my index.html file. 
//__dirname is the absolute path of the directory containing the currently executing file.
const indexPath = path.join(__dirname, 'views/index.html');
//absolute path to my about.html file. 
const aboutPath = path.join(__dirname, 'views/about.html');

//define express inside of a variable
const app = express();

//define my static server files directory, in this case the 'public' folder
app.use(express.static(__dirname + '/public'));
//It parses incoming and outgoing requests with JSON payloads(it means it converts them into JSON-formatted text)
app.use(express.json());
//a '/' request will send you to the index.html file
app.get('/', (req, res) => res.sendFile(indexPath))
//an '/about' request will send you to the about.html file
app.get('/about', (req, res) => res.sendFile(aboutPath))

function getToppings() {
    //grab the toppings json from the data folder on root
    const toppingsJSON = fs.readFileSync(path.join(__dirname, '/data/toppings.json'));
    console.log(__dirname+ 'data/toppings.json')
    //parse the toppings json
    const toppings = JSON.parse(toppingsJSON);
    return toppings
}

function addTopping(topping) {
    //read from the toppings json before adding a topping
    const toppings = getToppings();
    //add the topping to the 'pizzaToppings' item in the json
    toppings.pizzaToppings.push(topping);
    //update the pizzaToppings file with the new toppings
    fs.writeFileSync(path.join(__dirname, '/data/toppings.json'), JSON.stringify(toppings));
    return toppings
}

function deleteTopping(deleteTopping) {
    //read from the toppings json before deleting a topping
    const toppings = getToppings();
    //Only keep the toppings that are different from the deleteTopping variable
    toppings.pizzaToppings = toppings.pizzaToppings.filter(topping => topping !== deleteTopping);
    //update the pizzaToppings file with the new toppings
    fs.writeFileSync(path.join(__dirname, '/data/toppings.json'), JSON.stringify(toppings));
    console.log( path.join(__dirname, "/data/toppings.json"))
    return toppings
}

app.get("/toppings", (req, res) => {
    //read from the toppings json
    const toppings = getToppings();
    // Updated list will be returned by API
    res.json(toppings);
});

app.post("/toppings", (req, res) => {
    //grab the 'topping' from the POST request. The request must be in the {"topping":"whatever"} format.
    const topping = req.body.topping;
    //add the topping to the toppings list
    const toppings = addTopping(topping);
    // Updated list will be returned by API
    res.json(toppings);
});

app.delete("/toppings/:name", (req, res) => {
    //set the name at the end of the request as the name of the topping to delete
    const toppingToDelete = req.params.name;
    //update the toppings file after deleting the topping
    const toppings = deleteTopping(toppingToDelete);
    // Updated list will be returned by API
    res.json(toppings);
});

//Open the port
app.listen(port, () => console.log(`Server app listening on port ${port}!`))