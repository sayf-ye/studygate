    USE master;
    ALTER DATABASE apu_ebookstore SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE apu_ebookstore;

    CREATE DATABASE apu_ebookstore;
    USE apu_ebookstore;

    CREATE TABLE publishers (
        publisher_id INT PRIMARY KEY,
        publisher_name VARCHAR(120) NOT NULL,
        contact_email VARCHAR(120) NOT NULL,
        contact_phone VARCHAR(30) NOT NULL,
        city VARCHAR(60) NOT NULL,
        country VARCHAR(60) NOT NULL
    );

    CREATE TABLE genres (
        genre_id INT PRIMARY KEY,
        genre_name VARCHAR(60) NOT NULL UNIQUE,
        description VARCHAR(255)
    );

    CREATE TABLE books (
        book_id INT PRIMARY KEY,
        title VARCHAR(180) NOT NULL,
        publisher_id INT NOT NULL,
        publication_date DATE NOT NULL,
        price DECIMAL(8,2) NOT NULL CHECK (price > 0),
        quantity_on_hand INT NOT NULL CHECK (quantity_on_hand >= 0),
        page_count INT,
        language_code VARCHAR(30) DEFAULT 'English',
        created_at DATE NOT NULL,
        availability_status VARCHAR(20) DEFAULT 'ACTIVE',
        FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id)
    );

    CREATE TABLE book_genres (
        book_id INT NOT NULL,
        genre_id INT NOT NULL,
        PRIMARY KEY (book_id, genre_id),
        FOREIGN KEY (book_id) REFERENCES books(book_id),
        FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
    );

    CREATE TABLE members (
        member_id INT PRIMARY KEY,
        first_name VARCHAR(60) NOT NULL,
        last_name VARCHAR(60) NOT NULL,
        gender VARCHAR(15) NOT NULL CHECK (gender IN ('Male','Female','Non-Binary')),
        email VARCHAR(120) NOT NULL UNIQUE,
        phone VARCHAR(30) NOT NULL,
        street_address VARCHAR(255) NOT NULL,
        city VARCHAR(80) NOT NULL,
        state_region VARCHAR(80) NOT NULL,
        postal_code VARCHAR(12) NOT NULL,
        country VARCHAR(60) NOT NULL,
        registration_date DATE NOT NULL
    );

    CREATE TABLE manager_orders (
        manager_order_id INT PRIMARY KEY,
        publisher_id INT NOT NULL,
        order_date DATE NOT NULL,
        expected_delivery_date DATE,
        status VARCHAR(25) NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
        FOREIGN KEY (publisher_id) REFERENCES publishers(publisher_id)
    );

    CREATE TABLE manager_order_items (
        manager_order_item_id INT PRIMARY KEY,
        manager_order_id INT NOT NULL,
        book_id INT NOT NULL,
        quantity_ordered INT NOT NULL CHECK (quantity_ordered > 0),
        unit_cost DECIMAL(8,2) NOT NULL CHECK (unit_cost >= 0),
        received_quantity INT NOT NULL DEFAULT 0,
        FOREIGN KEY (manager_order_id) REFERENCES manager_orders(manager_order_id),
        FOREIGN KEY (book_id) REFERENCES books(book_id)
    );

    CREATE TABLE customer_orders (
        order_id INT PRIMARY KEY,
        member_id INT NOT NULL,
        order_date DATE NOT NULL,
        status VARCHAR(30) NOT NULL,
        subtotal_amount DECIMAL(10,2) NOT NULL CHECK (subtotal_amount >= 0),
        shipping_fee DECIMAL(8,2) NOT NULL CHECK (shipping_fee >= 0),
        total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
        FOREIGN KEY (member_id) REFERENCES members(member_id)
    );

    CREATE TABLE payments (
        payment_id INT PRIMARY KEY,
        order_id INT NOT NULL UNIQUE,
        payment_method VARCHAR(40) NOT NULL,
        payment_status VARCHAR(30) NOT NULL,
        payment_date DATE NOT NULL,
        amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
        FOREIGN KEY (order_id) REFERENCES customer_orders(order_id)
    );

    CREATE TABLE customer_order_items (
        order_item_id INT PRIMARY KEY,
        order_id INT NOT NULL,
        book_id INT NOT NULL,
        quantity INT NOT NULL CHECK (quantity > 0),
        unit_price DECIMAL(8,2) NOT NULL CHECK (unit_price > 0),
        discount_amount DECIMAL(8,2) NOT NULL DEFAULT 0,
        FOREIGN KEY (order_id) REFERENCES customer_orders(order_id),
        FOREIGN KEY (book_id) REFERENCES books(book_id)
    );

    CREATE TABLE deliveries (
        delivery_id INT PRIMARY KEY,
        order_id INT NOT NULL,
        dispatched_date DATE,
        expected_delivery DATE,
        delivered_date DATE,
        status VARCHAR(30) NOT NULL,
        tracking_number VARCHAR(80),
        courier_name VARCHAR(80),
        FOREIGN KEY (order_id) REFERENCES customer_orders(order_id)
    );

    CREATE TABLE feedback (
        feedback_id INT PRIMARY KEY,
        member_id INT NOT NULL,
        book_id INT NOT NULL,
        rating INT NOT NULL CHECK (rating BETWEEN 0 AND 10),
        comment VARCHAR(400),
        feedback_date DATE NOT NULL,
        FOREIGN KEY (member_id) REFERENCES members(member_id),
        FOREIGN KEY (book_id) REFERENCES books(book_id),
        UNIQUE (member_id, book_id)
    );



    -- Insert publishers
    INSERT INTO publishers VALUES
    (1,'Penguin Random House','contact@penguinrandomhouse.com','+1-212-782-9000','New York','USA'),
    (2,'HarperCollins','info@harpercollins.com','+1-212-207-7000','New York','USA'),
    (3,'Simon & Schuster','contact@simonandschuster.com','+1-212-698-7000','New York','USA'),
    (4,'Hachette Book Group','info@hachettebookgroup.com','+1-212-364-1100','New York','USA'),
    (5,'Macmillan Publishers','contact@macmillan.com','+1-646-307-5151','New York','USA');

    -- Insert genres
    INSERT INTO genres VALUES
    (1,'Fiction','Literary and general fiction works'),
    (2,'Science Fiction','Speculative fiction with scientific themes'),
    (3,'Fantasy','Fiction featuring magical or supernatural elements'),
    (4,'Mystery','Fiction involving crime solving and suspense'),
    (5,'Romance','Fiction focusing on romantic relationships'),
    (6,'Thriller','Fast-paced suspenseful fiction'),
    (7,'Non-Fiction','Factual works and informational books'),
    (8,'Biography','Life stories and memoirs');

    -- Insert books
    INSERT INTO books VALUES
    (1001,'The Great Adventure',1,'2024-01-15',29.99,50,320,'English','2024-01-01','ACTIVE'),
    (1002,'Mystery of the Night',2,'2024-02-20',24.99,35,280,'English','2024-02-01','ACTIVE'),
    (1003,'Galactic Odyssey',3,'2024-03-10',34.99,40,450,'English','2024-03-01','ACTIVE'),
    (1004,'Dragon Kingdom',4,'2024-04-05',27.99,60,380,'English','2024-04-01','ACTIVE'),
    (1005,'Silent Hunter',5,'2024-05-12',22.99,45,290,'English','2024-05-01','ACTIVE'),
    (1006,'Love in Paris',1,'2024-06-18',19.99,55,250,'English','2024-06-01','ACTIVE'),
    (1007,'Einstein: A Life',2,'2024-07-22',31.99,30,520,'English','2024-07-01','ACTIVE'),
    (1008,'Future World',3,'2024-08-14',28.99,25,340,'English','2024-08-01','ACTIVE'),
    (1009,'The Lost City',4,'2024-09-08',26.99,70,310,'English','2024-09-01','ACTIVE'),
    (1010,'Dark Secrets',5,'2024-10-03',23.99,40,275,'English','2024-10-01','ACTIVE');

    -- Insert members
    INSERT INTO members VALUES
    (5001,'Ahmad','Rahman','Male','ahmad.rahman@email.com','+60-12-345-6789','123 Jalan Bukit','Kuala Lumpur','Wilayah Persekutuan','50000','Malaysia','2025-01-15'),
    (5002,'Sarah','Tan','Female','sarah.tan@email.com','+60-12-456-7890','456 Jalan Merdeka','Petaling Jaya','Selangor','47800','Malaysia','2025-02-20'),
    (5003,'Wei Ming','Lee','Male','weiming.lee@email.com','+60-12-567-8901','789 Jalan Harmoni','Penang','Penang','10450','Malaysia','2025-03-10'),
    (5004,'Priya','Kumar','Female','priya.kumar@email.com','+60-12-678-9012','321 Jalan Damai','Johor Bahru','Johor','80000','Malaysia','2025-04-05'),
    (5005,'Muhammad','Ali','Male','muhammad.ali@email.com','+60-12-789-0123','654 Jalan Sentosa','Ipoh','Perak','30000','Malaysia','2025-05-12'),
    (5006,'Jessica','Wong','Female','jessica.wong@email.com','+60-12-890-1234','987 Jalan Sejahtera','Malacca','Malacca','75000','Malaysia','2025-06-01'),
    (5007,'Raj','Patel','Male','raj.patel@email.com','+60-12-901-2345','147 Jalan Bahagia','Kota Kinabalu','Sabah','88000','Malaysia','2025-06-15'),
    (5008,'Emily','Chen','Female','emily.chen@email.com','+60-12-012-3456','258 Jalan Ceria','Kuching','Sarawak','93000','Malaysia','2025-07-01');

    -- Insert customer_orders
    INSERT INTO customer_orders VALUES
    (6001,5001,'2025-07-05','Delivered',145.00,10.00,155.00),
    (6002,5002,'2025-07-18','Delivered',144.00,10.00,154.00),
    (6003,5003,'2025-08-02','Delivered',147.00,10.00,157.00),
    (6004,5004,'2025-08-15','Delivered',111.00,10.00,121.00),
    (6005,5005,'2025-08-28','Processing',72.00,10.00,82.00),
    (6006,5006,'2025-09-03','Delivered',123.00,10.00,133.00),
    (6007,5007,'2025-09-10','Delivered',132.00,10.00,142.00),
    (6008,5008,'2025-09-25','Cancelled',41.00,10.00,51.00),
    (6009,5001,'2025-10-01','Delivered',122.50,10.00,132.50),
    (6010,5002,'2025-10-06','Processing',80.00,10.00,90.00);

    INSERT INTO book_genres VALUES
    (1001,1),(1001,7),(1002,1),(1003,2),(1004,3),(1005,6),
    (1006,5),(1007,8),(1008,2),(1009,1),(1010,4);

    INSERT INTO payments VALUES
    (1,6001,'FPX Online Banking','Paid','2025-07-05',155.00),
    (2,6002,'Credit Card','Paid','2025-07-18',154.00),
    (3,6003,'Credit Card','Paid','2025-08-02',157.00),
    (4,6004,'Debit Card','Paid','2025-08-15',121.00),
    (5,6005,'FPX Online Banking','Pending','2025-08-28',82.00),
    (6,6006,'Credit Card','Paid','2025-09-03',133.00),
    (7,6007,'Credit Card','Paid','2025-09-10',142.00),
    (8,6008,'Debit Card','Refunded','2025-09-25',51.00),
    (9,6009,'Credit Card','Paid','2025-10-01',132.50),
    (10,6010,'FPX Online Banking','Pending','2025-10-06',90.00);

    -- Insert customer_order_items
    INSERT INTO customer_order_items VALUES
    (1,6001,1001,2,29.99,0),
    (2,6001,1002,3,24.99,0),
    (3,6001,1006,1,19.99,0),
    (4,6002,1003,2,34.99,0),
    (5,6002,1004,2,27.99,0),
    (6,6002,1005,1,22.99,0),
    (7,6003,1007,2,31.99,0),
    (8,6003,1008,2,28.99,0),
    (9,6003,1009,1,26.99,0),
    (10,6004,1010,2,23.99,0);

    -- Insert deliveries
    INSERT INTO deliveries VALUES
    (1,6001,'2025-07-06','2025-07-10','2025-07-09','Delivered','TRK001','DHL'),
    (2,6002,'2025-07-19','2025-07-23','2025-07-22','Delivered','TRK002','FedEx'),
    (3,6003,'2025-08-03','2025-08-07','2025-08-06','Delivered','TRK003','DHL'),
    (4,6004,'2025-08-16','2025-08-20','2025-08-19','Delivered','TRK004','Pos Laju'),
    (5,6005,'2025-08-29','2025-09-02',NULL,'In Transit','TRK005','DHL'),
    (6,6006,'2025-09-04','2025-09-08','2025-09-07','Delivered','TRK006','FedEx'),
    (7,6007,'2025-09-11','2025-09-15','2025-09-14','Delivered','TRK007','Pos Laju'),
    (8,6008,NULL,NULL,NULL,'Cancelled',NULL,NULL),
    (9,6009,'2025-10-02','2025-10-06','2025-10-05','Delivered','TRK009','DHL'),
    (10,6010,'2025-10-07','2025-10-11',NULL,'Pending','TRK010','FedEx');

    -- Insert feedback
    INSERT INTO feedback VALUES
    (1,5001,1001,9,'Excellent adventure book!','2025-07-15'),
    (2,5001,1002,8,'Great mystery, kept me guessing','2025-07-20'),
    (3,5002,1003,10,'Best sci-fi I have read this year','2025-07-28'),
    (4,5002,1004,7,'Good fantasy story','2025-08-05'),
    (5,5003,1007,9,'Fascinating biography','2025-08-15'),
    (6,5003,1008,8,'Interesting future concepts','2025-08-20'),
    (7,5004,1010,6,'Decent mystery but predictable','2025-08-25'),
    (8,5004,1009,7,'Solid detective story','2025-09-01'),
    (9,5005,1005,10,'Amazing thriller','2025-09-10'),
    (10,5006,1006,9,'Inspiring read','2025-09-15');

    -- Insert manager_orders
    INSERT INTO manager_orders VALUES
    (1,1,'2025-01-10','2025-01-20','Delivered',1500.00),
    (2,2,'2025-02-15','2025-02-25','Delivered',1200.00),
    (3,3,'2025-03-20','2025-03-30','Delivered',1800.00),
    (4,4,'2025-04-10','2025-04-20','Delivered',1350.00),
    (5,5,'2025-05-15','2025-05-25','Delivered',900.00),
    (6,1,'2025-06-20','2025-06-30','Delivered',1100.00),
    (7,2,'2025-07-10','2025-07-20','Delivered',800.00),
    (8,3,'2025-08-15','2025-08-25','Processing',1600.00),
    (9,4,'2025-09-10','2025-09-20','Delivered',1250.00),
    (10,5,'2025-10-15','2025-10-25','Pending',950.00);

    -- Insert manager_order_items
    INSERT INTO manager_order_items VALUES
    (1,1,1001,50,15.00,50),
    (2,1,1006,40,10.00,40),
    (3,2,1002,45,12.50,45),
    (4,2,1007,30,16.00,30),
    (5,3,1003,50,17.50,50),
    (6,3,1008,40,14.50,40),
    (7,3,1009,35,13.50,35),
    (8,4,1004,55,14.00,55),
    (9,5,1005,40,11.50,40),
    (10,5,1010,35,12.00,35);

    -- Queries
    --i. Book(s) with the highest rating
    SELECT b.book_id, b.title, f.rating
    FROM books b
    JOIN feedback f ON b.book_id = f.book_id
    WHERE f.rating = (
        SELECT MAX(rating) FROM feedback
    );


    --ii. Total number of feedback per member
    SELECT m.member_id,
           CONCAT(m.first_name, ' ', m.last_name) AS member_name,
           COUNT(f.feedback_id) AS total_feedback
    FROM members m
    LEFT JOIN feedback f ON m.member_id = f.member_id
    GROUP BY m.member_id, m.first_name, m.last_name;

    --iii. Total number of books published by each publisher
    SELECT p.publisher_id,
           p.publisher_name,
           COUNT(b.book_id) AS total_books
    FROM publishers p
    LEFT JOIN books b ON p.publisher_id = b.publisher_id
    GROUP BY p.publisher_id, p.publisher_name;


    --iv. Total number of books ordered by store manager from each publisher

    SELECT p.publisher_id,
           p.publisher_name,
           SUM(moi.quantity_ordered) AS total_books_ordered
    FROM publishers p
    JOIN manager_orders mo ON p.publisher_id = mo.publisher_id
    JOIN manager_order_items moi ON mo.manager_order_id = moi.manager_order_id
    GROUP BY p.publisher_id, p.publisher_name;



    --v. Books where quantity is more than average quantity

    SELECT book_id, title, quantity_on_hand
    FROM books
    WHERE quantity_on_hand >
          (SELECT AVG(quantity_on_hand) FROM books);



    --vi. Bestselling book(s) for each month
    SELECT ranked.year, ranked.month, ranked.book_id, ranked.title, ranked.total_sold
    FROM (
        SELECT YEAR(co.order_date) AS year,
               MONTH(co.order_date) AS month,
               b.book_id,
               b.title,
               SUM(coi.quantity) AS total_sold,
               RANK() OVER (PARTITION BY YEAR(co.order_date), MONTH(co.order_date) ORDER BY SUM(coi.quantity) DESC) AS rnk
        FROM customer_orders co
        JOIN customer_order_items coi ON co.order_id = coi.order_id
        JOIN books b ON coi.book_id = b.book_id
        GROUP BY YEAR(co.order_date), MONTH(co.order_date), b.book_id, b.title
    ) ranked
    WHERE ranked.rnk = 1
    ORDER BY ranked.year, ranked.month;


    --vii. Member(s) who spent the most, grouped by gender
    SELECT ranked.gender, ranked.member_id, ranked.member_name, ranked.total_spent
    FROM (
        SELECT m.gender,
               m.member_id,
               CONCAT(m.first_name, ' ', m.last_name) AS member_name,
               SUM(co.total_amount) AS total_spent,
               RANK() OVER (PARTITION BY m.gender ORDER BY SUM(co.total_amount) DESC) AS rnk
        FROM members m
        JOIN customer_orders co ON m.member_id = co.member_id
        GROUP BY m.gender, m.member_id, m.first_name, m.last_name
    ) ranked
    WHERE ranked.rnk = 1;


    --viii. Total members by gender
    SELECT gender, COUNT(*) AS total_members
    FROM members
    GROUP BY gender;


    --ix. Purchased books not delivered
    SELECT m.member_id,
           m.street_address,
           m.phone,
           b.book_id,
           b.title,
           coi.quantity,
           co.order_date,
           d.status
    FROM deliveries d
    JOIN customer_orders co ON d.order_id = co.order_id
    JOIN members m ON co.member_id = m.member_id
    JOIN customer_order_items coi ON co.order_id = coi.order_id
    JOIN books b ON coi.book_id = b.book_id
    WHERE d.status <> 'Delivered';


    --x. Sales not completed by members
    SELECT CONCAT(m.first_name, ' ', m.last_name) AS member_name,
           b.title AS product_name,
           coi.quantity,
           co.total_amount,
           co.order_date
    FROM customer_orders co
    JOIN members m ON co.member_id = m.member_id
    JOIN customer_order_items coi ON co.order_id = coi.order_id
    JOIN books b ON coi.book_id = b.book_id
    WHERE co.status IN ('Processing', 'Cancelled');

    --xi. Genre with highest number of books

    SELECT TOP 1 g.genre_name, COUNT(bg.book_id) AS total_books
    FROM genres g
    JOIN book_genres bg ON g.genre_id = bg.genre_id
    GROUP BY g.genre_name
    ORDER BY total_books DESC;


    --xii. Number of books with worst rating, grouped by genre
    SELECT g.genre_name,
           COUNT(DISTINCT b.book_id) AS worst_rated_books
    FROM feedback f
    JOIN books b ON f.book_id = b.book_id
    JOIN book_genres bg ON b.book_id = bg.book_id
    JOIN genres g ON bg.genre_id = g.genre_id
    WHERE f.rating = (SELECT MIN(rating) FROM feedback)
    GROUP BY g.genre_name;


    --xiii. Books added in last 3 months
    SELECT book_id, title, created_at
    FROM books
    WHERE created_at >= DATEADD(MONTH, -3, GETDATE());


    --xiv. Members who did not purchase in October 2025
    SELECT m.member_id,
           CONCAT(m.first_name, ' ', m.last_name) AS member_name
    FROM members m
    WHERE m.member_id NOT IN (
        SELECT DISTINCT member_id
        FROM customer_orders
        WHERE order_date BETWEEN '2025-10-01' AND '2025-10-31'
    );

    --xv. Sales for past four months, ordered by month DESC
    SELECT FORMAT(order_date, 'yyyy-MM') AS sales_month,
           SUM(total_amount) AS total_sales
    FROM customer_orders
    WHERE order_date >= DATEADD(MONTH, -4, GETDATE())
    GROUP BY FORMAT(order_date, 'yyyy-MM')
    ORDER BY sales_month DESC;
