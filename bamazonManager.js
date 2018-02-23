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
  inquirer
    .prompt({
      name: "menu",
      type: "rawlist",
      message: "[MANAGER LEVEL] Would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory","Add to Inventory", "Add New Product", "QUIT"]
    })
    .then(function(answer) 
    {
      // based on their answer, either call the bid or the post functions
      switch(answer.menu) 
      {

        case "View Products for Sale":
            displaySaleItems();
            break;
        case "View Low Inventory":
            displayLowIneventory();
            break;
        case "Add to Inventory":
            updateInventory();
            break;
        case "Add New Product":
            createInventory();
            break;
        case "QUIT":
            console.log("\nTHAT was painful to hear, Please come again to BAMAZON!\n");
            connection.end();
            break;
        default:
            start();
            break;
      }

    });
}

function createInventory() 
{
  connection.query("SELECT * FROM products", function(err, results) 
  {
    if (err) throw err;
   // prompt for info about the item being put up for auction
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
      var query = connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.name,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.inventory
        },
        function(err, res) {
          console.log(res.affectedRows + " product inserted!\n");
          start();
        }
      );
    });
  });
}

function updateInventory() 
{
  connection.query("SELECT * FROM products", function(err, results) 
  {
    if (err) throw err;
   // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        message: "Which item do you want?",
          name: "name",
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
        name: "amt",
        type: "input",
        message: "How many do you want to add to the current inventory?",
        validate: function(value) 
        {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) 
    {
      console.log("Updating item eaches...\n");

       //var chosenItem;
        for (var i = 0; i < results.length; i++) 
        {
          if (results[i].product_name === answer.name) {
            var chosenItem = results[i];
          }
        }
      var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: parseInt(chosenItem.stock_quantity)+ parseInt(answer.amt)
          },
          {
            product_name: answer.name
          }
        ],
        function(err, res) {
          console.log(res.affectedRows + " products updated!\n");
          // Call deleteProduct AFTER the UPDATE completes
          start();
        }
      );
    });
  });
}

function displayLowIneventory()
{
  console.log("diplaying all items with stock_quantity greater than or equal to 5 eaches...\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

console.log("item_id  product_name  department_name  price  stock_quantity");
console.log("-------------------------------------------------------------");
    for (var i = 0; i < res.length; i++) 
    {
      if(res[i].stock_quantity>=5)
    {
    // Include the ids, names, and prices of products for sale.
      console.log(res[i].item_id + " \t " + res[i].product_name + " \t " + res[i].department_name + " \t " + res[i].price + " \t " + res[i].stock_quantity);
    }
    
    }
    console.log("-------------------------------------------------------------");
     start();
    //requestOrder();
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
     start();
    //requestOrder();
  });
}