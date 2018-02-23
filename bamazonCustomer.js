//requires mysql npm before running
var mysql = require("mysql");
//requires inquirer npm before running
var inquirer = require("inquirer");

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
  if (err) throw err;
  console.log("logged in");
  // run the start function after the connection is made to prompt the user
  
  start();
});

// function which prompts the user for what action they should take
function start() {
  console.log("\n=======================Main Page=======================");
  inquirer
    .prompt({
      name: "buyOrQuit",
      type: "rawlist",
      message: "Welcome to BAMAZON, How may I get your order?\n",
      choices: ["BUY", "QUIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.buyOrQuit.toUpperCase() === "BUY") 
      {
        displaySaleItems();
        
      }
      else {
        console.log("\nTHAT was painful to hear, Please come again to BAMAZON!\n");
        connection.end();
      }
    });
}

function endConnection()
{
  connection.end();
}

function requestOrder()
{
  // query the database for all items being auctioned
  connection.query("SELECT * FROM products", function(err, results) 
  {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([
        {
          message: "Which item do you want?",
          name: "choice",
          type: "list",
          choices: function() 
          {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) 
            {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          }
          
        },
        {
          name: "bid",
          type: "input",
          message: "How many would you like?",
          validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
         }
        }
      ])
      .then(function(answer) 
      {
         // get the information of the chosen item
        //var chosenItem;
        for (var i = 0; i < results.length; i++) 
        {
          if (results[i].product_name === answer.choice) {
            var chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.stock_quantity >= parseInt(answer.bid)) 
        {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: chosenItem.stock_quantity -answer.bid
              },
              {
                item_id: chosenItem.item_id
              }
            ],
            function(error) {
              if (error) throw err;
              var total=parseFloat(answer.bid*chosenItem.price);
              console.log("\nYour TOTAL is: $"+total);
              console.log("Thank you for buying at BAMAZON. Order placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("\nInsufficient quantity!\nI am sorry we do not have enough in inventory. Please find something else :(.\n ..going back to the main page");
          start();
        }
        
      });
    });
}


//display all items for sale
function displaySaleItems() 
{
  console.log("diplaying all items for sale...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

console.log("item_id  product_name  department_name  price  stock_quantity");
console.log("-------------------------------------------------------------");
    for (var i = 0; i < res.length; i++) 
    {

      // Include the ids, names, and prices of products for sale.
      console.log(res[i].item_id + " \t " + res[i].product_name + " \t " + res[i].department_name + " \t " + res[i].price + " \t " + res[i].stock_quantity);
    }
    console.log("-------------------------------------------------------------");

    requestOrder();
  });
}