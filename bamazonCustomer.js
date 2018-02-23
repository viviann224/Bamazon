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
  //if error occurs, throw error for the user
  if (err) throw err;
  //else run the start function after the connection 
  //is made to prompt the user
  start();
});

// function which prompts the user for what action they should take (buy or quit)
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
      //if the user wants to buy display the sales items and begin buying
      if (answer.buyOrQuit.toUpperCase() === "BUY") 
      {
        displaySaleItems();
        
      }
      //else terminate the program and tell the user goodbye
      else {
        console.log("\nTHAT was painful to hear, Please come again to BAMAZON!\n");
        connection.end();
      }
    });
}

//request order will ask the user for an item and quantity
//requestOrder will then check if there is enough in inventory
//if there is enough in inventory go ahead and bill the user and update inventory
//else will tell user there was not enough in inventory and takes the user back to the
//main menu to make new decision
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
          //goes through the database and displays all items for user to choose
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
          //checks the user input and verifies that is a valid integer number
          if (isNaN(value) === false) {
            return true;
          }
          return false;
         }
        }
      ])
      //after the user answers the series of question the program checks the inventory
      .then(function(answer) 
      {
         //uses a linear search to find the item in the database and store it for later use
        for (var i = 0; i < results.length; i++) 
        {
          if (results[i].product_name === answer.choice) 
          {  var chosenItem = results[i];}
        }

        //if the stock is more than the user's request, go ahead and start the billing process
        if (chosenItem.stock_quantity >= parseInt(answer.bid)) 
        {
          //go ahead and talk to the database to update the amount
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
              //if there is an error go ahead and throw the error for the user
              if (error) throw err;
              //else lets calculate the total for the user
              var total=parseFloat(answer.bid*chosenItem.price);
              //display the bill for the user and thank them for shopping at BAMAZON
              console.log("\nYour TOTAL is: $"+total);
              console.log("Thank you for buying at BAMAZON. Order placed successfully!");
              //then go to the main menu
              start();
            }
          );
        }
        else 
        {
          //there was an insufficent quanntity based on the requested amount
          //apologize to the user and and start over
          console.log("\nInsufficient quantity!\nI am sorry we do not have enough in inventory. Please find something else :(.\n ..going back to the main page");
          //go to the main menu for the user to decide the next action
          start();
        }
        
     });
  });
}

//function display all items for sale
function displaySaleItems() 
{
  console.log("diplaying all items for sale...\n");
  //go ahead and talk to the database to search for all the items in the database
  connection.query("SELECT * FROM products", function(err, res) {
  	//if there is an error go ahead and throw an error to the user
    if (err) throw err;
    //displays the main content
	console.log("item_id  product_name  department_name  price  stock_quantity");
	console.log("-------------------------------------------------------------");
    for (var i = 0; i < res.length; i++) 
    {
      //displays the ids, names, and prices of products for sale.
      console.log(res[i].item_id + " \t " + res[i].product_name + " \t " + res[i].department_name + " \t " + res[i].price + " \t " + res[i].stock_quantity);
    }
    console.log("-------------------------------------------------------------");
    //then calls display order for the user to order an item
    requestOrder();
  });
}