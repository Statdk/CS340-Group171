SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;


CREATE OR REPLACE TABLE Items (
    itemID INT NOT NULL AUTO_INCREMENT,
    itemName CHAR(50) NOT NULL,
    quantityOwned INT NOT NULL,
    size INT NOT NULL,
    listPrice FLOAT NOT NULL,
    PRIMARY KEY (itemID)
);

INSERT INTO Items (itemName, quantityOwned, size, listPrice) VALUES
('skis', 30, 120, 60),
('skis', 30, 125, 60),
('skis', 40, 130, 60),
('skis', 50, 135, 60),
('skis', 60, 140, 60),
('skis', 70, 145, 60),
('skis', 80, 150, 60),
('skis', 90, 155, 60),
('skis', 90, 160, 60),
('skis', 90, 165, 60),
('skis', 90, 170, 60),
('skis', 90, 175, 60),
('skis', 70, 180, 60),
('skis', 60, 185, 60),
('skis', 60, 190, 60),
('snowboard', 20, 120, 60),
('snowboard', 20, 123, 60),
('snowboard', 25, 126, 60),
('snowboard', 30, 129, 60),
('snowboard', 35, 132, 60),
('snowboard', 40, 135, 60),
('snowboard', 45, 138, 60),
('snowboard', 50, 141, 60),
('snowboard', 55, 144, 60),
('snowboard', 55, 147, 60),
('snowboard', 55, 150, 60),
('snowboard', 55, 153, 60),
('snowboard', 55, 156, 60),
('snowboard', 55, 159, 60),
('snowboard', 55, 162, 60),
('snowboard', 50, 165, 60),
('snowboard', 45, 168, 60),
('snowboard', 35, 171, 60),
('skiBoots', 5, 22.5, 25),
('skiBoots', 10, 23, 25),
('skiBoots', 15, 23.5, 25),
('skiBoots', 15, 24, 25),
('skiBoots', 40, 24.5, 25),
('skiBoots', 55, 25, 25),
('skiBoots', 70, 25.5, 25),
('skiBoots', 70, 26, 25),
('skiBoots', 65, 26.5, 25),
('skiBoots', 55, 27, 25),
('skiBoots', 40, 27.5, 25),
('skiBoots', 40, 28, 25),
('skiBoots', 55, 28.5, 25),
('skiBoots', 80, 29, 25),
('skiBoots', 70, 29.5, 25),
('skiBoots', 70, 30, 25),
('skiBoots', 25, 30.5, 25),
('skiBoots', 35, 31, 25),
('skiBoots', 25, 31.5, 25),
('skiBoots', 35, 32, 25),
('skiBoots', 25, 32.5, 25),
('snowboardBoots', 5, 22.5, 25),
('snowboardBoots', 5, 23, 25),
('snowboardBoots', 10, 23.5, 25),
('snowboardBoots', 25, 24, 25),
('snowboardBoots', 35, 24.5, 25),
('snowboardBoots', 45, 25, 25),
('snowboardBoots', 50, 25.5, 25),
('snowboardBoots', 45, 26, 25),
('snowboardBoots', 35, 26.5, 25),
('snowboardBoots', 30, 27, 25),
('snowboardBoots', 25, 27.5, 25),
('snowboardBoots', 35, 28, 25),
('snowboardBoots', 55, 28.5, 25),
('snowboardBoots', 45, 28.5, 25),
('snowboardBoots', 50, 28.5, 25),
('snowboardBoots', 20, 28.5, 25),
('snowboardBoots', 25, 28.5, 25),
('snowboardBoots', 15, 28.5, 25),
('snowboardBoots', 5, 28.5, 25),
('skiPole', 30, 85, 5),
('skiPole', 40, 90, 5),
('skiPole', 50, 95, 5),
('skiPole', 60, 100, 5),
('skiPole', 60, 105, 5),
('skiPole', 60, 110, 5),
('skiPole', 80, 115, 5),
('skiPole', 80, 120, 5),
('skiPole', 80, 125, 5),
('skiPole', 70, 130, 5),
('skiPole', 50, 135, 5),
('skiPole', 40, 140, 5);


CREATE OR REPLACE TABLE Discounts (
    discountID INT NOT NULL AUTO_INCREMENT,
    discountType VARCHAR(50) NOT NULL,
    discountPercentage FLOAT NOT NULL,
    PRIMARY KEY (discountID)
);

INSERT INTO Discounts (discountType, discountPercentage) VALUES
('student', 10.00),
('weekday', 5.00),
('allWeek', 20.00),
('seasonPass', 50.00);


CREATE OR REPLACE TABLE SeasonDates (
  seasonDatesID int NOT NULL AUTO_INCREMENT,
  seasonStart datetime NOT NULL,
  seasonEnd datetime NOT NULL,

  PRIMARY KEY (seasonDatesID)
);

INSERT INTO SeasonDates (seasonDatesID, seasonStart, seasonEnd) VALUES
(2024, '2024-10-28', '2025-05-04'),
(2023, '2023-10-28', '2024-05-04'),
(2022, '2022-11-04', '2023-04-27');


CREATE OR REPLACE TABLE LiftPassTypes (
  liftPassID int NOT NULL AUTO_INCREMENT,
  category varchar(50) NOT NULL,
  listPrice float NOT NULL,

  PRIMARY KEY (liftPassID)
);

INSERT INTO LiftPassTypes (liftPassID, category, listPrice) VALUES
(1, 'oneDay', 80.00),
(2, 'twoDay', 150.00),
(3, 'threeDay', 220.00),
(4, 'oneWeek', 500.00),
(5, 'seasonPass', 700.00);


CREATE OR REPLACE TABLE Customers (
    customerID INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phoneNumber INT,
    PRIMARY KEY (customerID)
);

INSERT INTO Customers (customerID, firstName, lastName, email, phoneNumber) VALUES
(1, 'John', 'Smith', 'john@gmail.com', NULL),
(2, 'Jane', 'Doe', 'jayjay23@gmail.com', '1234567890'),
(3, 'Jesse', 'Takens', 'jesse@takens.cc', NULL),
(4, 'Adam', 'Green', 'adamgreen@icl.com', '9255295757');


CREATE OR REPLACE TABLE LiftPassTransactions (
    transactionID INT NOT NULL AUTO_INCREMENT,
    customerID INT NOT NULL,
    seasonDatesID int NOT NULL,
    liftPassID INT NOT NULL,
    saleDate DATETIME NOT NULL,

    PRIMARY KEY (transactionID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID),
    FOREIGN KEY (SeasonDatesID) REFERENCES SeasonDates(SeasonDatesID),
    FOREIGN KEY (liftPassID) REFERENCES LiftPassTypes(liftPassID)
);

INSERT INTO LiftPassTransactions (customerID, seasonDatesID, liftPassID, saleDate) VALUES
(1, 5, 2023, '2024-01-18'),
(2, 4, 2023, '2024-01-22'),
(3, 3, 2023, '2024-01-25'),
(4, 3, 2023, '2024-01-25'),
(3, 3, 2023, '2024-02-01');


CREATE OR REPLACE TABLE RentalTransactions (
    transactionID INT NOT NULL AUTO_INCREMENT,
    customerID INT NOT NULL,
    discountID INT,
    saleDate DATETIME NOT NULL,
    rentalDuration INT NOT NULL,

    PRIMARY KEY (transactionID),
    FOREIGN KEY (customerID) REFERENCES Customers(customerID),
    FOREIGN KEY (discountID) REFERENCES Discounts(discountID)
);

INSERT INTO RentalTransactions (customerID, discountID, saleDate, rentalDuration) VALUES
(1, 4, '2024-01-19', 2),
(2, 3, '2024-01-22', 7),
(3, 2, '2024-01-25', 3),
(3, NULL, '2024-02-01', 3);


CREATE OR REPLACE TABLE RentalItems (
    rentalID INT NOT NULL AUTO_INCREMENT,
    transactionID INT NOT NULL,
    itemID INT NOT NULL,
    quantityRented INT NOT NULL,

    PRIMARY KEY (rentalID),
    FOREIGN KEY (transactionID) REFERENCES RentalTransactions(transactionID),
    FOREIGN KEY (itemID) REFERENCES Items(itemID)
);

INSERT INTO RentalItems (transactionID, itemID, quantityRented) VALUES
(1, 31, 1),
(1, 71, 1),
(2, 25, 1),
(2, 61, 1),
(3, 10, 2),
(3, 80, 1),
(3, 46, 1),
(4, 10, 2),
(4, 46, 1);



SET FOREIGN_KEY_CHECKS=1;
COMMIT; 
