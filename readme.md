# Bamazon

Bamazon Homework: Customer and Manager implementations

# Verification Links:
### Manager:
    https://drive.google.com/file/d/1sRVPQk0J1Mctsqbnrr6fedajLJi52Q0Q/view
### Customer: 
    https://drive.google.com/file/d/1FpW-hatqXzOOaw9WKNIZwp0NR_1ICXUm/view
    
# Database Schema
CREATE TABLE `products` (
  `item_id` int(10) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(30) NOT NULL,
  `department_name` varchar(30) NOT NULL,
  `price` float NOT NULL,
  `stock_quantity` int(10) NOT NULL,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `item_id` (`item_id`)) 

# Tech

##### Bamazon uses a number of open source projects to work properly:

* [MySQL] - MySQL
* [node.js] - evented I/O for the backend
* [inquirer] - Better than processargv!
* [validator] - Validation!





