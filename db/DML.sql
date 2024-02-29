 -- Commands to view all database contents
SELECT * FROM Customers;
SELECT * FROM LiftPassTransactions;
SELECT * FROM RentalTransactions;
SELECT * FROM RentalItems;
SELECT * FROM LiftPassTypes;
SELECT * FROM Discounts;
SELECT * FROM SeasonDates;
SELECT * FROM Items;

 -- Commands to get specific entry information when we already have the ID
SELECT * FROM Customers WHERE customerID = :ID;
SELECT * FROM LiftPassTransactions WHERE transactionID = :ID;
SELECT * FROM RentalTransactions WHERE transactionID = :ID;
SELECT * FROM RentalIems WHERE rentalID = :ID;
SELECT * FROM LiftPassTypes WHERE liftPassID = :ID;
SELECT * FROM Discounts WHERE discountID = :ID;
SELECT * FROM SeasonDates WHERE seasonDatesID = :ID;
SELECT * FROM Items WHERE itemID = :ID;

-- Get a List of Pass Types and their ID's
SELECT liftPassID, category FROM LiftPassTypes


 -- Customer Search/Filter Query
SELECT * FROM Customers WHERE
    (:first IS NULL OR firstName like :first)  AND
    (:last IS NULL OR lastName like :last)     AND
    (:email IS NULL OR email = :email)         AND
    (:phone IS NULL OR phoneNumber = :phone)

 -- Search for items by size and/or name
SELECT * FROM Items WHERE
    (:name IS NULL OR itemName = :name) AND
    (:size IS NULL OR size = :size)

 -- Filtered Lift Pass Transactions merged with liftpass Types
SELECT transactionID, customerID, seasonDatesID, category, listPrice, saleDate 
FROM LiftPassTransactions 
WHERE
    (:transactionID IS NULL OR transactionID = :transactionID)  AND
    (:customerID IS NULL OR customerID = :customerID)           AND
    (:seasonDatesID IS NULL OR seasonDatesID = :seasonDatesID)  AND
    (:liftPassType IS NULL OR category = :liftPassType)         AND
    (:date IS NULL OR saleDate = :date)
LEFT JOIN LiftPassTypes ON LiftPassTransactions.liftPassID = LiftPassTypes.liftPassID;


 -- Liftpass transactions merged with Liftpass types
SELECT transactionID, customerID, seasonDatesID, category, listPrice, saleDate 
FROM LiftPassTransactions 
LEFT JOIN LiftPassTypes ON LiftPassTransactions.liftPassID = LiftPassTypes.liftPassID;
 -- Rental Transactions detailed
SELECT RentalItems.rentalID, RentalTransactions.transactionID, RentalTransactions.customerID, 
RentalTransactions.discountID, Items.itemName, Items.size, RentalItems.quantityRented, RentalTransactions.saleDate, 
RentalTransactions.rentalDuration
FROM RentalTransactions
INNER JOIN RentalItems ON RentalTransactions.transactionID = RentalItems.transactionID
INNER JOIN Items ON RentalItems.itemID = Items.itemID;
 -- Rental Transactions detailed but looks nice
SELECT Customers.firstName, Customers.lastName, Discounts.discountType, Discounts.discountPercentage,
RentalTransactions.saleDate, Items.itemName, Items.size, RentalItems.quantityRented,
Items.listPrice, RentalTransactions.rentalDuration
FROM RentalTransactions
LEFT JOIN RentalItems ON RentalTransactions.transactionID = RentalItems.transactionID
INNER JOIN Items ON RentalItems.itemID = Items.itemID
INNER JOIN Customers ON RentalTransactions.customerID = RentalTransactions.customerID
INNER JOIN Discounts ON RentalTransactions.discountID = Discounts.discountID
ORDER BY RentalTransactions.saleDate DESC, Customers.lastName ASC;


 -- Statements to create single entries if we have IDs
INSERT INTO Customers (firstName, lastName, email, phoneNumber) VALUES
    (:first, :last, :email, :phone);
INSERT INTO LiftPassTransactions (customerID, seasonDatesID, liftPassID, saleDate) VALUES
    (:customerID, :seasonID, :passID, :date);
INSERT INTO RentalTransactions (customerID, discountID, saleDate, rentalDuration) VALUES
    (:customerID, :discountID, :date, :duration);
INSERT INTO RentalItems (transactionID, itemQuantityID, quantityRented, sizeRented) VALUES
    (:transactionID, :quantityID, :quantity, :size);
INSERT INTO LiftPassTypes (category, listPrice) VALUES
    (:category, :price);
INSERT INTO Discounts (discountType, discountPercentage) VALUES
    (:type, :percentage);
INSERT INTO SeasonDates (seasonDatesID, seasonStart, seasonEnd) VALUES
    (:yearStart, :start, :end);
INSERT INTO Items (itemName, quantityOwned, size, listPrice) VALUES
    (:name, :quantity, :size, :price);


 -- Edit Entries by ID
UPDATE Customers
SET firstName = :first, lastName = :last, email = :email, phone = :phone
WHERE customerID = :ID;

UPDATE LiftPassTransactions
SET customerID = :customerID, seasonDatesID = :seasonID, liftPassID = :passID, saleDate = :date;
WHERE transactionID = :ID;

UPDATE RentalTransactions
SET customerID = :customerID, discountID = :discountID, saleDate = :date, rentalDuration = :duration
WHERE transactionID = :ID;

UPDATE RentalItems
SET transactionID = :transactionID, itemQuantityID = :quantityID, quantityRented = :quantity, sizeRented = :size
WHERE rentalID = :ID;

UPDATE LiftPassTypes
SET category = :category, listPrice = :price
WHERE listPassID = :ID;

UPDATE Discounts
SET discountType = :type, discountPercentage = :percentage
WHERE discountID = :ID;

UPDATE SeasonDates
SET seasonStart = :start, seasonEnd = :end
WHERE seasonDatesID = :ID;

UPDATE Items
SET itemName = :name, quantityOwned = :quantity, size = :size, listPrice = :price
WHERE itemID = :ID;


 -- Delete Entries by ID
DELETE FROM Customers WHERE customerID = :ID;
DELETE FROM LiftPassTransactions WHERE transactionID = :ID;
DELETE FROM RentalTransactions WHERE transactionID = :ID;
DELETE FROM RentalIems WHERE rentalID = :ID;
DELETE FROM LiftPassTypes WHERE liftPassID = :ID;
DELETE FROM Discounts WHERE discountID = :ID;
DELETE FROM SeasonDates WHERE seasonDatesID = :ID;
DELETE FROM Items WHERE itemID = :ID;
