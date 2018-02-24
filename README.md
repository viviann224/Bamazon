# BAMAZON
**GETTING STARTED**:
1. Clone the repo: **https://github.com/viviann224/Bamazon.git**
2. In Terminal/Bash in the Bamazon file (location where the **README.md** is located) initialize the npm file via "*npm install*"
3. Run either the Customer Level or the Manager Level js file via Terminal/Bash
    * for **Customer Level** in Terminal/Bash type in "*node bamazonCustomer.js*"
    * for **Manger Level** in Terminal/Bash type in "*node bamazonManager.js*"

The program should run automatically.

![start](https://thumbs.gfycat.com/LastingPleasingCorydorascatfish-size_restricted.gif)

If the program is not running automatically, please make sure you have all the prerequisites listed below.

**STATEMENT OF PURPOSE**:
BAMAZON is a store like Amazon where the program runs on Node.js and uses the SQL database. BAMAZON  will take orders from the customers and update the stock from the store's inventory.

BAMAZON was created showcases the use of a SQL database  in a Node.js enviroment to reflect real life applications of database management skills and advanced level user input validation via npm package inquirer. BAMAZON has two level of use, a public level which is the "Customer Level" where the user  can buy items in the inventory and a "Manager Level" where the user can view the items for sale, view items that is low in inventory, the capability to update the inventory amount, and create a new item into the inventory.

**PREREQUISITES**:
- SQL Database (perfered on Sequel Pro)
- Node.js
- JavaScript
- Terminal / Bash / command line prompt
- Capability to run files in package.json (inquirer, mysql)
- Perfered viewing in English language :us:

**HOW TO USE**:
Here at BAMAZON  there are two modes, a customer and a manager level.
<p align="center">  <img height="200" src="/readMeImg/files.png" alt="choices"></p>


Customer Level | Manager Level
------------ | -------------
**Main Menu:** Lets the user either BUY or QUIT |  **Main Menu:** Lets the user  View Products for Sale, View Low Inventory, Add to inventory, Add New Products, or QUIT
**BUY:** asks user which item and quantity from inventory to buy if in stock a bill is created else tells user not enough in stock | **View Products for Sale:** displays the current products in the database
lets user buy an item  |   **View Low Inventory:** displays all items in the database that contains at least 5 eaches in stock
**QUIT** allows the user to terminate the program  | **Add to Inventory:** updates an current item by how much the user wants to give/take
|  **Add New Product:** allows the user to create new item into inventory with an id, name, department, price, and quantity
|  **QUIT** allows the user to terminate the program



**Customer Level**

![customerIntro](https://thumbs.gfycat.com/OrganicReadyChicken-size_restricted.gif)

> **BUY:** The inventory will display with the corresponding an id, name, department, price, and quantity then the user will be asked a list of items to choose from. Once picked, the user will be prompted with a question for quantity. Once the user finishes the inputs, the program will look into the database to determine a total bill or not enough in inventory then will go to the main menu for main options
>
> **QUIT:** Allows the user to terminate the program

**Manger Level**

![managerIntro](https://thumbs.gfycat.com/ImmenseUniformFieldmouse-size_restricted.gif)

>**View Products for Sale:** Reads data from the SQL database and displays all items from the database with an associated  id, name, department, price, and quantity.
>
>**View Low Inventory:** Reads the data from the SQL database and looks at each item's quantity. if the item's quanity is at least 5, then the item is displayed with the associated id, name, department, price, and quantity.
>
>**Add to Inventory:** The user will choose a list of re-exsisting data from the SQL database of items and gives the user an option to update the current inventory for the specified database.
>
>**Add New Product:** the program will ask for a new item request. The user will input an item request, the program checks the requested item against the current database to see if the item already exsists. The user will continue to prompt until there is a new item. If the item is new, then the user will be prompted with which department the item belongs, what is the associated price of the item, and how much is in the inventory for the item.
>
> **QUIT:** Allows the user to terminate the program

**BUILT WITH**:
- Sublime Text
-Sequel Pro

**VERSION**:
This is the first version of BAMAZON

**LICENSE**:
This project is licensed under GitHub.

**AUTHOR**:
- Vivian Tuong Nguyen - Initial work


**ACKNOWLEDGMENTS**:
All rights are reserved to Vivian Tuong Nguyen. Do not alter or manipulate content and images from Vivian Tuong Nguyen
Copyright   :copyright: 2018
