const inquirer = require("inquirer");
const mysql = require("mysql");
const validator = require("validator");

var productList = [];
const lowInventoryLevel = 5;

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "bamazon",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("'~,* Welcome to Bamazon Manager! *,~'");
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    productList = [];
    buildProductList("nope", getPrompt);
}

function buildProductList(input, fn) {
    var query = connection.query("select item_id, product_name, price, stock_quantity from products order by product_name", function (err, res) {
        if (err) throw err;
        else {
            for (var i = 0; i < res.length; i++) {
                productList[i] = {
                    product_name: res[i].product_name,
                    product_id: res[i].item_id,
                    product_price: res[i].price,
                    stock_quantity: res[i].stock_quantity
                }
            }
            fn();
        }
    })
};

function getPrompt() {
    inquirer
        .prompt([{
            name: "actionToDo",
            type: "list",
            message: "What would you like to do today?",
            choices: ["View all products", "View low inventory", "Add to Inventory", "Add Product"]
        }])
        .then(function (answer) {
            if (answer.actionToDo === "View all products") {
                console.log("** Displaying current inventory:");
                for (var i = 0; i < productList.length; i++) {
                    var productName = productList[i].product_name;
                    if (productName[productName.length - 1] == "s") { }
                    else {
                        productName += "s"
                    }
                    console.log("We currently have " + productList[i].stock_quantity + " of " + productName + " for $" + productList[i].product_price.toFixed(2) + ".");
                }
                promptManageAgain();
            }
            else if (answer.actionToDo === "View low inventory") {
                console.log("** Displaying producs with less than " + lowInventoryLevel + " units on hand:");
                for (var i = 0; i < productList.length; i++) {
                    var productName = productList[i].product_name;
                    if (productName[productName.length - 1] == "s") { }
                    else {
                        productName += "s"
                    }
                    if (productList[i].stock_quantity <= lowInventoryLevel)
                        console.log("We currently have " + productList[i].stock_quantity + " of " + productName + " for $" + productList[i].product_price.toFixed(2) + ".");
                }
                promptManageAgain();

            }
            else if (answer.actionToDo === "Add to Inventory") {
                updateInventory("nope",promptManageAgain);
            }
            else {
                addNewItem("nope", promptManageAgain);
            }
        });

}

function addNewItem(temp, fn) {
    console.log("** New Product Addition:");
    inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "Product Name"

            }
            , {
                name: "department",
                type: "list",
                message: "Select Department:",
                choices: ["Wireless", "Electronics", "Books", "Food"]
            },
            {
                name: "quantity",
                type: "input",
                message: "How many are in inventory?",
                validate: function (value) {
                    if (isNaN(parseInt(value)) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "price",
                type: "input",
                message: "Sale Price",
                validate: function (value) {
                    if (isNaN(parseFloat(value)) === false) {
                        return true;
                    }
                    return false;
                }
            }])
        .then(function (answer) {
            var stringQuery = "insert into products (product_name,department_name,price,stock_quantity) " +
                "values ('" + answer.productName + "','" + answer.department + "'," + answer.price + "," + answer.quantity + ")";
            query = connection.query(stringQuery, function (err, res) {
                if (err) throw err;
                fn();
            })
        })
}

function updateInventory(temp, fn) {
    console.log("** Inventory Update:");
    for (var i = 0; i < productList.length; i++) {
        var productName = productList[i].product_name;
        if (productName[productName.length - 1] == "s") { }
        else {
            productName += "s"
        }
        console.log("We currently have " + productList[i].stock_quantity + " of " + productName + " for $" + productList[i].product_price.toFixed(2) + ". Select Item ID " + productList[i].product_id + " to manage.");
    }
    inquirer
        .prompt([{
            name: "itemToUpdate",
            type: "input",
            message: "The Item ID of what you want to update?",
            validate: function (value) {
                if (isNaN(parseInt(value)) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "What is the new quantity on hand?",
            validate: function (value) {
                if (isNaN(parseInt(value)) === false) {
                    return true;
                }
                return false;
            }
        }
        ])
        .then(function (answer) {
            var productFound = false;
            for (var i = 0; i < productList.length; i++) {
                if (productList[i].product_id === parseInt(answer.itemToUpdate)) {
                    productFound = true;
                    //check to see if enough stock is on hand
                    var stringQuery = "update products set stock_quantity = " + answer.quantity + " where item_id = " + answer.itemToUpdate;
                    query = connection.query(stringQuery, function (err, res) {
                        if (err) throw err;
                    })
                    i += productList.length;
                }
            }
            if (!productFound) { console.log("I'm sorry, I could not find that product.") }
            fn();
        })
    
}


function promptManageAgain() {
    inquirer
        .prompt([{
            name: "manageAgain",
            type: "list",
            message: "Continue managing?",
            choices: ["Yes", "No"]
        }])
        .then(function (answer) {
            if (answer.manageAgain === "Yes") {
                start();
            }
            else {
                console.log("Go do some real work!");
                exitProgram();

            }
        })
}

function exitProgram() {
    connection.end();
}