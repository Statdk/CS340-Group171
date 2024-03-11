# Running

1. `npm install`
2. `npm start`

Port is configurable by a constant in `app.js`.

`npm test` will run with nodemon, rebooting the server on file changes.

# Todo List (for Step 6)

-   ### Git changes:
    -   ~~add library dependency to readme~~
    -   delete old master
-   ### UI/CRUD changes:
    -   Fix date formatting to YYYY-MM-DD
        - Fix update not populating date
    -   Add placeholder descriptions next to box aswell, maybe
    -   Adding to rental-items: create a new rental-transaction if the added transactionID is new
    -   Fix lift pass tables?
    -   Fix filter in RT
    -   Dropdowns on FKs for new / filter / update
    -   Add all data validation
        - emails, phone numbers, prices, percentages, FK dropdowns, negatives
    -   Join FK (like Customer ID and Discount ID in RT)
    -   Handle duplicate rows?
    -   Detil on home page (maybe just summary paste)
        - Intro for each table, sentance summary for clarity (can also point out which tables fulfill M:N req)
-   ### files(to be submitted) changes: (https://canvas.oregonstate.edu/courses/1946034/assignments/9456223)
    -   backend code (file)
        - no node_modules
        - remove user & pass from db-connector
        - Add citations to readme?
    -   PDF
        - Executive Summary (max 1pg)
        - Project and Database Outlines
        - ER Diagram
        - Schema
        - Sample Data   
        - UI Screen Shots with Informative Titles     
    -   DDL.sql
    -   DML.sql
    -   URL.txt (http://flip1.engr.oregonstate.edu:3805/index.html)
    -   comment on submission with URL
-   ### PDF changes:
    -   Update for new Ed reviews
    -   Update summary if needed
    -   URL in headers
    -   UI screenshots