
CREATE DATABASE products;

USE bamazon;

CREATE TABLE products(
  -- id INT NOT NULL AUTO_INCREMENT,
  item_id INTEGER(10) NOT NULL,
  product_name VARCHAR(20) NOT NULL,
  department_name VARCHAR(20) NOT NULL,
  price INTEGER DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0
 -- PRIMARY KEY (id)
);
USE bamazon;
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES ("00001", "BullDog Treats", "DOG Depo", 10.00, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES ("00002", "Wet Wipes", "House Depo", 20.00, 10);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES ("00003", "Dog Food", "DOG Depo", 50.00, 7);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES ("00004", "Dog Bed", "DOG Depo", 80.00, 3);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES ("00005", "Car Seat", "Baby Depo", 120.00, 1);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES ("00006", "Cookie Cutter", "House Depo", 1, 20);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES ("00007", "Bib", "Baby Depo", 1, 20);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES ("00008", "Espresso Machine", "House Depo", 500, 2);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES ("00009", "Dog Shampoo", "Dog Depo", 5, 13);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) 
VALUES ("000010", "Frying Pan", "House Depo", 50, 7);



