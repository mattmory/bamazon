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
            console.log("'~,* Welcome to Bamazon! *,~'");
            for (var i = 0; i < productList.length; i++) {
                var productName = productList[i].product_name;
                if (productName[productName.length - 1] == "s") { }
                else {
                    productName += "s"
                }
                console.log("We've got " + productName + " for $" + productList[i].product_price.toFixed(2));
            }
            fn();
        }
    })
};


function start() {
    buildProductList("nope", getPrompt);
}

function getPrompt() {
    console.log("Ready for prompt");
}
      /* inquirer
      .prompt({
        name: "postOrBid",
        type: "rawlist",
        message: "Would you like to [POST] an auction or [BID] on an auction?",
        choices: ["POST", "BID"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.postOrBid.toUpperCase() === "POST") {
          //postAuction();
        }
        else {
          //bidAuction();
        }
      }); */


