SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

CREATE OR REPLACE TABLE ItemPrices (
    itemID INT NOT NULL AUTO_INCREMENT,
    itemName CHAR(50) NOT NULL,
    listPrice FLOAT NOT NULL,
    PRIMARY KEY (itemID)
);

INSERT INTO ItemPrices (itemName, listPrice) VALUES
('skis', 60),
('snowboard', 60),
('skiBoots', 25),
('snowboardBoots', 25),
('skiPoles', 10);

CREATE OR REPLACE TABLE ItemQuantities (
    itemQuantityID INT NOT NULL AUTO_INCREMENT,
    itemID INT NOT NULL,
    quantityOwned INT NOT NULL,
    size INT NOT NULL,
    PRIMARY KEY (itemQuantityID),
    FOREIGN KEY (itemID) REFERENCES ItemPrices(itemID)
);

INSERT INTO ItemQuantities (itemID, quantityOwned, size) VALUES
(1, 30, 120),
(1, 30, 125),
(1, 40, 130),
(1, 50, 135),
(1, 60, 140),
(1, 70, 145),
(1, 80, 150),
(1, 90, 155),
(1, 90, 160),
(1, 90, 165),
(1, 90, 170),
(1, 90, 175),
(1, 70, 180),
(1, 60, 185),
(1, 60, 190),
(2, 20, 120),
(2, 20, 123),
(2, 25, 126),
(2, 30, 129),
(2, 35, 132),
(2, 40, 135),
(2, 45, 138),
(2, 50, 141),
(2, 55, 144),
(2, 55, 147),
(2, 55, 150),
(2, 55, 153),
(2, 55, 156),
(2, 55, 159),
(2, 55, 162),
(2, 50, 165),
(2, 45, 168),
(2, 35, 171),
(3, 5, 22.5),
(3, 10, 23),
(3, 15, 23.5),
(3, 15, 24),
(3, 40, 24.5),
(3, 55, 25),
(3, 70, 25.5),
(3, 70, 26),
(3, 65, 26.5),
(3, 55, 27),
(3, 40, 27.5),
(3, 40, 28),
(3, 55, 28.5),
(3, 80, 29),
(3, 70, 29.5),
(3, 70, 30),
(3, 25, 30.5),
(3, 35, 31),
(3, 25, 31.5),
(3, 35, 32),
(3, 25, 32.5),
(4, 5, 22.5),
(4, 5, 23),
(4, 10, 23.5),
(4, 25, 24),
(4, 35, 24.5),
(4, 45, 25),
(4, 50, 25.5),
(4, 45, 26),
(4, 35, 26.5),
(4, 30, 27),
(4, 25, 27.5),
(4, 35, 28),
(4, 55, 28.5),
(4, 45, 29),
(4, 50, 29.5),
(4, 20, 30),
(4, 25, 30.5),
(4, 15, 31),
(4, 25, 31.5),
(4, 15, 32),
(4, 5, 32.5),
(5, 30, 85),
(5, 40, 90),
(5, 50, 95),
(5, 60, 100),
(5, 60, 105),
(5, 60, 110),
(5, 80, 115),
(5, 80, 120),
(5, 80, 125),
(5, 70, 130),
(5, 50, 135),
(5, 40, 140);

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
    itemQuantityID INT NOT NULL,
    quantityRented INT NOT NULL,
    sizeRented INT NOT NULL,

    PRIMARY KEY (rentalID),
    FOREIGN KEY (transactionID) REFERENCES RentalTransactions(transactionID),
    FOREIGN KEY (itemQuantityID) REFERENCES ItemQuantities(itemQuantityID)
);

INSERT INTO RentalItems (transactionID, itemQuantityID, quantityRented, sizeRented) VALUES
(1, 31, 1, 165),
(1, 71, 1, 30.5),
(2, 25, 1, 147),
(2, 61, 1, 25.5),
(3, 10, 2, 165),
(3, 80, 1, 105),
(3, 46, 1, 28.5),
(4, 10, 2, 165),
(4, 46, 1, 28.5);
