//requires mysql npm before running
var mysql = require("mysql");
//requires inquirer npm before running
var inquirer = require("inquirer");
var columnify = require("columnify")


// create a connection with the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
	//throw an error if no connection
  if (err) throw err;
   //if we make a connect display
  console.log("connected as id " + connection.threadId);
  //close connection
  displaySaleItems();
  //connection.end();
  //lets proceed with the program
  // run the start function after the connection is made to prompt the user

});
//display all items for sale
function displaySaleItems() 
{
  console.log("diplaying all items for sale...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

console.log("item_id  product_name  department_name  price  stock_quantity");
    for (var i = 0; i < res.length; i++) 
    {

    	// Include the ids, names, and prices of products for sale.
      console.log(res[i].item_id + " \t " + res[i].product_name + " \t " + res[i].department_name + " \t " + res[i].price + " \t " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");

    // Log all results of the SELECT statement
    //console.log(res);
    connection.end();
  });
}
//get database on js


// Then create a Node application called bamazonCustomer.js.
// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.
// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

//display all of the items available for sale. 
//Include the ids, names, and prices of products for sale.
