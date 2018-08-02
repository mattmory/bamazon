const inquirer = require("inquirer");
const mysql = require("mysql");
const validator = require("validator");

var productList = [];

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
    // run the start function after the connection is made to prompt the user
    start();
});

function buildProductList(input, fn) {
    var query = connection.query("select item_id, product_name, price, stock_quantity from products  where stock_quantity > 0 order by product_name", function (err, res) {
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
            console.log("'~,* Welcome to Bamazon! *,~'");
            for (var i = 0; i < productList.length; i++) {
                var productName = productList[i].product_name;
                if (productName[productName.length - 1] == "s") { }
                else {
                    productName += "s"
                }
                console.log("We've got " + productName + " for $" + productList[i].product_price.toFixed(2) + ". Select Item ID " + productList[i].product_id + ".");
            }
            fn();
        }
    })
};

function exitProgram() {
    connection.end();
}

function removeFromInventory(item_id, item_quantity, fn) {
    var query = connection.query("update products set stock_quantity = ? where item_id = ?", [item_quantity, item_id], function (err, res) {
        if (err) { throw err; }
        else {
            //   fn();
        }
    });
}

function start() {
    productList = [];
    buildProductList("nope", getPrompt);
}

function getPrompt() {
    inquirer
        .prompt([{
            name: "itemToBuy",
            type: "input",
            message: "The Item ID of what you want to buy?",
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
            message: "How many would you like?",
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
                if (productList[i].product_id === parseInt(answer.itemToBuy)) {
                    productFound = true;
                    //check to see if enough stock is on hand
                    if (productList[i].stock_quantity >= parseInt(answer.quantity)) {
                        console.log("That will be $" + (productList[i].product_price * parseInt(answer.quantity)).toFixed(2) + ".");
                        removeFromInventory(parseInt(answer.itemToBuy), productList[i].stock_quantity - parseInt(answer.quantity), promptShopAgain);
                    }
                    else {
                        console.log("I'm sorry, we do not have enough stock on hand.")
                    }
                    i += productList.length;

                }
            }
            if (!productFound) { console.log("I'm sorry, I could not find that product.") }
            promptShopAgain();
        });

}

function promptShopAgain() {
    inquirer
        .prompt([{
            name: "shopAgain",
            type: "list",
            message: "Continue shopping?",
            choices: ["Yes", "No"]
        }])
        .then(function (answer) {
            if (answer.shopAgain === "Yes") {
                start();
            }
            else {
                console.log("Thank you come again!");
                exitProgram();

            }
        })
}


function exitProgram() {
    connection.end();
}