//requires mysql npm before running
var mysql = require("mysql");
//requires inquirer npm before running
var inquirer = require("inquirer");

// create a connection with the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  //username
  user: "root",

  //password
  password: "",
  //specified database
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  //if error display error
  if (err) throw err;
  //else run the start function after the connection 
  //is made to prompt the user
  start();
});

// function which prompts the user to choose option from menu or quit
function start() {
  console.log("\n=======================Main Page=======================");
  inquirer
    .prompt({
      name: "menu",
      type: "rawlist",
      message: "[MANAGER LEVEL] Would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory","Add to Inventory", "Add New Product", "QUIT"]
    })
    .then(function(answer) 
    {
      // based on their answer, call for the specified function
      switch(answer.menu) 
      {
        //call displaySaleItems() and display products
        case "View Products for Sale":
            displaySaleItems();
            break;
        //call displayLowInventory() and display products with quanity>=5
        case "View Low Inventory":
            displayLowIneventory();
            break;
        //call updateInventory() and update eaches for specified item
        case "Add to Inventory":
            updateInventory();
            break;
        //call createInventory() and create new item
        case "Add New Product":
            createInventory();
            break;
        //Quit program and display goodbye
        case "QUIT":
            console.log("\nTHAT was painful to hear, Please come again to BAMAZON!\n");
            connection.end();
            break;
        //defaults will start up start function again
        default:
            start();
            break;
      }
  });
}

//function which checks the item if the inventory is new, verifies quanities for eaches and amount,
// asks user for a department. 
//if all is valid the program will ask user to create inventory
function createInventory() 
{
  //look at data from the products table from the database
  connection.query("SELECT * FROM products", function(err, results) 
  { //if error display error for user
    if (err) throw err;
   //if no error asks user for a series of questions to create new inventory
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What item do you want to add?",
        //check to see if item is already in inventory
        validate: function(value) 
        {
          for (var i = 0; i < results.length; i++) 
          {
            if(results[i].product_name.toLowerCase()==value.toLowerCase())
            { 
              console.log("\nI am sorry that is already in inventory, please try again!");
              return false;
            }
          }
          return true;
        }
      },
      {
        name: "department",
        type: "input",
        message: "Which department is the item in?",
        //check to see if item is already in inventory
        validate: function(value) 
        {
            if(value=="")
            { 
              console.log("\nI am sorry that was not a valid department, please try again!");
              return false;
            }
          return true;
        }
      },
       {
        name: "price",
        type: "input",
        message: "How much for each item?",
        validate: function(value) {
          //verifies the answer was a number
          if (isNaN(value) === false) {
            return true;
          }
          console.log("\nI am sorry that was not a valid value for the item, please try again!");
          return false;
        }
      },
      {
        name: "inventory",
        type: "input",
        message: "How many do you have in inventory to start?",
        validate: function(value) {
          //verifies the answer was a price
          if (isNaN(value) === false) {
            return true;
          }
          console.log("\nI am sorry that was not a valid value amount, please try again!");
          return false;
        }
      },
    ])
    //if this is a new item lets go ahead and add it!
    .then(function(answer) 
    {
      console.log("Creating a new item...\n");
      //talk to the database
      var query = connection.query(
        //give a set of instructions to create a new item in the database
        "INSERT INTO products SET ?",
        {
          product_name: answer.name,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.inventory
        },
        function(err, res) {
          //if not error tell user how many items created
          console.log(res.affectedRows + " item created!\n");
          //then go back to the main menu
          start();
        }
      );
    });
  });
}
//function update inventory goes through the database and 
//give the user all the options of items to update inventory
//then the user can update the value of the inventory
function updateInventory() 
{
  //talk to the database to get all the items in the database
  connection.query("SELECT * FROM products", function(err, results) 
  { //if error display error for user
    if (err) throw err;
   //if there is a connection go ahead and ask user a series 
   //of questions to update inventory
  inquirer
    .prompt([
      {
        message: "Which item do you want?",
          name: "name",
          type: "list",
          //go ahead and create an array for user to pick item to update
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
        name: "amt",
        type: "input",
        message: "How many do you want to add to the current inventory?",
        //go ahead and check if the user has a valid number
        validate: function(value) 
        {
          if (isNaN(value) === false) {
            return true;
          }
         console.log("\nI am sorry that was not a valid value for the item, please try again!");
          return false;
        }
      }
    ])
    //once the user completes the series of questions lets go ahead and update
    .then(function(answer) 
    {
      console.log("Updating item eaches...\n");

       //first find the item in the database by using an linear search
        for (var i = 0; i < results.length; i++) 
        {
          if (results[i].product_name === answer.name) {
            var chosenItem = results[i];
          }
        }
        //once item is found lets go ahead and update the eaches
      var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          { //stock_quantity= current quantity + updated amount
            stock_quantity: parseInt(chosenItem.stock_quantity)+ parseInt(answer.amt)
          },
          {
            product_name: answer.name
          }
        ],
        function(err, res) {
          //if no error go ahead and update the user with the update
          console.log(res.affectedRows + " item eaches updated!\n");
          //then go back to the main menu
          start();
        }
      );
    });
  });
}
//the function displayLowInventory checks the inventory of each item in the database
//and only displays the items that have the quantity of 5 or more in stock_quantity
function displayLowIneventory()
{
  console.log("diplaying all items with stock_quantity greater than or equal to 5 eaches...\n");
  //talk to the database and search for each product
  connection.query("SELECT * FROM products", function(err, res) {
    //if an error go ahead and display it to the user
    if (err) throw err;
    //display the main content
    console.log("item_id  product_name  department_name  price  stock_quantity");
    console.log("-------------------------------------------------------------");
    for (var i = 0; i < res.length; i++) 
    { //if the stock is >=5 display it
      if(res[i].stock_quantity>=5)
    {
    // Include the ids, names, and prices of products for sale.
      console.log(res[i].item_id + " \t " + res[i].product_name + " \t " + res[i].department_name + " \t " + res[i].price + " \t " + res[i].stock_quantity);
    }
    //else do not add to the list
    }
    console.log("-------------------------------------------------------------");
     //once done go back to the main
     start();
  });
}

//displays all items for sale
function displaySaleItems() 
{
  console.log("diplaying all items for sale...\n");
  //go ahead and talk to the database
  connection.query("SELECT * FROM products", function(err, res) {
    //if error go ahead and throw an error for the user
    if (err) throw err;
    //display the main content
    console.log("item_id  product_name  department_name  price  stock_quantity");
    console.log("-------------------------------------------------------------");
    for (var i = 0; i < res.length; i++) 
    {
      // displays the ids, names, and prices of products for sale.
      console.log(res[i].item_id + " \t " + res[i].product_name + " \t " + res[i].department_name + " \t " + res[i].price + " \t " + res[i].stock_quantity);
    }
    console.log("-------------------------------------------------------------");
     //once done with the display go ahead and return to the main menu
     start();
  });
}