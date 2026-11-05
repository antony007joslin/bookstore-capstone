-- PostgreSQL Initial Database Schema & Seed Data for Bookstore Capstone

-- Drop tables if exists in reverse dependency order
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS books CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;

-- 1. Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    image_url VARCHAR(255)
);

-- 2. Brands / Publishers Table
CREATE TABLE brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    logo_url VARCHAR(255)
);

-- 3. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    gift_points INT DEFAULT 100,
    role VARCHAR(50) DEFAULT 'ROLE_USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Addresses Table
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_name VARCHAR(150) NOT NULL,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'United States',
    is_default BOOLEAN DEFAULT false
);

-- 5. Books Table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150) NOT NULL,
    isbn VARCHAR(30) UNIQUE,
    publisher_id INT REFERENCES brands(id) ON DELETE SET NULL,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    discount_price NUMERIC(10, 2),
    stock_quantity INT DEFAULT 50,
    rating NUMERIC(2, 1) DEFAULT 4.5,
    reviews_count INT DEFAULT 120,
    cover_image VARCHAR(500),
    tentative_delivery_days INT DEFAULT 3,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_id INT REFERENCES addresses(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    gift_points_redeemed INT DEFAULT 0,
    final_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'CREDIT_CARD', 'DEBIT_CARD', 'GIFT_POINTS'
    payment_status VARCHAR(50) DEFAULT 'COMPLETED', -- 'PENDING', 'COMPLETED', 'FAILED'
    order_status VARCHAR(50) DEFAULT 'PROCESSING', -- 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
    delivery_estimate_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- =========================================================================
-- SEED DATA
-- =========================================================================

-- Insert Categories
INSERT INTO categories (id, name, description, icon, image_url) VALUES
(1, 'Technology & Programming', 'Software architecture, cloud, Java, React, and DevOps books.', 'Cpu', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80'),
(2, 'Fiction & Literature', 'Bestselling novels, classics, and contemporary fiction.', 'BookOpen', 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80'),
(3, 'Business & Management', 'Leadership, finance, entrepreneurship, and economics.', 'TrendingUp', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80'),
(4, 'Science & Nature', 'Physics, cosmology, biology, and scientific discoveries.', 'Compass', 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80'),
(5, 'Self-Help & Productivity', 'Personal growth, habit building, and mindfulness.', 'Smile', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');

SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- Insert Brands / Publishers
INSERT INTO brands (id, name, description, logo_url) VALUES
(1, 'O''Reilly Media', 'World renowned technical publisher and creator of iconic animal covers.', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80'),
(2, 'Penguin Random House', 'Global publisher of fiction, literature, and general interest books.', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'),
(3, 'Packt Publishing', 'Practical books and video courses for software developers and IT pros.', 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=200&q=80'),
(4, 'MIT Press', 'Academic publisher focusing on science, technology, economics, and art.', 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=200&q=80'),
(5, 'HarperCollins', 'Broad-spectrum commercial and literary publishing powerhouse.', 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=200&q=80');

SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands));

-- Insert Users
INSERT INTO users (id, username, email, password, full_name, phone, gift_points, role, created_at) VALUES
(1, 'johndoe', 'john.doe@example.com', 'password123', 'John Doe', '+1 (555) 019-2834', 250, 'ROLE_USER', NOW() - INTERVAL '30 days'),
(2, 'sarahsmith', 'sarah.smith@example.com', 'password123', 'Sarah Smith', '+1 (555) 019-5821', 180, 'ROLE_USER', NOW() - INTERVAL '15 days'),
(3, 'admin', 'admin@bookstore.com', 'admin123', 'Store Administrator', '+1 (555) 019-9999', 500, 'ROLE_ADMIN', NOW() - INTERVAL '60 days');

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Insert Addresses
INSERT INTO addresses (id, user_id, recipient_name, street_address, city, state, postal_code, country, is_default) VALUES
(1, 1, 'John Doe', '742 Evergreen Terrace', 'Springfield', 'OR', '97477', 'United States', true),
(2, 1, 'John Doe (Office)', '100 Innovation Way, Suite 400', 'Portland', 'OR', '97201', 'United States', false),
(3, 2, 'Sarah Smith', '1204 Elmwood Ave', 'Austin', 'TX', '78704', 'United States', true);

SELECT setval('addresses_id_seq', (SELECT MAX(id) FROM addresses));

-- Insert Books
INSERT INTO books (id, title, author, isbn, publisher_id, category_id, description, price, discount_price, stock_quantity, rating, reviews_count, cover_image, tentative_delivery_days, featured, created_at) VALUES
(1, 'Designing Data-Intensive Applications', 'Martin Kleppmann', '978-1449373320', 1, 1, 'The definitive guide to the principles and practicalities of distributed systems, storage, and processing.', 49.99, 42.50, 45, 4.9, 320, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 2, true, NOW()),
(2, 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', '978-0132350884', 1, 1, 'Even bad code can function. But if code isn''t clean, it can bring a development organization to its knees.', 44.99, 38.99, 60, 4.8, 480, 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=600&q=80', 2, true, NOW()),
(3, 'Spring Boot in Action', 'Craig Walls', '978-1617292545', 3, 1, 'Hands-on guide to building production-ready microservices and APIs with Java and Spring Boot framework.', 39.99, 34.99, 35, 4.7, 195, 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', 3, true, NOW()),
(4, 'Learning React: Modern Patterns for Developing Applications', 'Alex Banks & Eve Porcello', '978-1492051725', 1, 1, 'If you want to learn how to build efficient React applications, this is your complete hands-on guide.', 47.99, 41.99, 50, 4.7, 140, 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80', 2, false, NOW()),
(5, 'Introduction to Algorithms, 4th Edition', 'Thomas H. Cormen et al.', '978-0262046305', 4, 1, 'Comprehensive and rigorous reference textbook on algorithms, data structures, and computational complexity.', 89.99, 79.99, 20, 4.9, 510, 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80', 4, false, NOW()),
(6, 'Atomic Habits: An Easy & Proven Way to Build Good Habits', 'James Clear', '978-0735211292', 2, 5, 'No matter your goals, Atomic Habits offers a proven framework for improving every day.', 27.00, 19.99, 100, 4.9, 1250, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', 2, true, NOW()),
(7, 'Deep Work: Rules for Focused Success in a Distracted World', 'Cal Newport', '978-1455586691', 5, 5, 'Mastering the skill of deep work is the superpower for thriving in the modern digital economy.', 28.00, 22.50, 40, 4.8, 640, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', 3, false, NOW()),
(8, 'The Psychology of Money', 'Morgan Housel', '978-0857197689', 5, 3, 'Timeless lessons on wealth, greed, and happiness doing well with money has a little to do with how smart you are.', 24.99, 18.99, 75, 4.8, 890, 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80', 2, true, NOW()),
(9, 'Zero to One: Notes on Startups, or How to Build the Future', 'Peter Thiel', '978-0804139298', 2, 3, 'If you want to build a better future, you must believe in secrets and create fundamentally new things.', 27.00, 21.00, 60, 4.6, 420, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80', 3, false, NOW()),
(10, 'Good to Great: Why Some Companies Make the Leap... and Others Don''t', 'Jim Collins', '978-0066620992', 5, 3, 'Management study identifying the universal characteristics that take companies from good to enduring greatness.', 32.50, 26.00, 30, 4.7, 310, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', 3, false, NOW()),
(11, 'A Brief History of Time', 'Stephen Hawking', '978-0553380163', 2, 4, 'Hawking takes us to the edge of theoretical physics exploring black holes, time travel, and the origins of cosmos.', 22.00, 16.99, 55, 4.8, 780, 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80', 2, true, NOW()),
(12, 'Cosmos', 'Carl Sagan', '978-0345539434', 2, 4, 'A legendary journey across science, human civilization, and our tiny place in the boundless universe.', 25.00, 19.50, 45, 4.9, 620, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', 3, false, NOW()),
(13, 'To Kill a Mockingbird', 'Harper Lee', '978-0061120084', 5, 2, 'The unforgettable Pulitzer Prize-winning classic novel of a childhood in a sleepy Southern town and the crisis of conscience.', 18.99, 14.99, 85, 4.9, 1400, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80', 2, true, NOW()),
(14, '1984', 'George Orwell', '978-0451524935', 2, 2, 'The chilling dystopian novel about totalitarianism, surveillance, doublethink, and individual rebellion.', 17.99, 13.50, 90, 4.8, 1120, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80', 2, false, NOW()),
(15, 'The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 5, 2, 'The quintessential story of the Jazz Age, romantic obsession, disillusionment, and the American Dream.', 16.00, 12.00, 70, 4.6, 850, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', 2, false, NOW());

SELECT setval('books_id_seq', (SELECT MAX(id) FROM books));

-- Insert Sample Orders for John Doe (User 1)
-- Order 1: Recent Order placed 4 hours ago (CAN BE CANCELLED within 48h)
INSERT INTO orders (id, user_id, address_id, total_amount, discount_amount, gift_points_redeemed, final_amount, payment_method, payment_status, order_status, delivery_estimate_date, created_at) VALUES
(1001, 1, 1, 81.49, 10.00, 100, 71.49, 'CREDIT_CARD', 'COMPLETED', 'PROCESSING', NOW() + INTERVAL '3 days', NOW() - INTERVAL '4 hours');

INSERT INTO order_items (order_id, book_id, quantity, unit_price, subtotal) VALUES
(1001, 1, 1, 42.50, 42.50),
(1001, 2, 1, 38.99, 38.99);

-- Order 2: Past order placed 10 days ago (DELIVERED, cannot cancel, used for "Buy It Again" & recommendations)
INSERT INTO orders (id, user_id, address_id, total_amount, discount_amount, gift_points_redeemed, final_amount, payment_method, payment_status, order_status, delivery_estimate_date, created_at) VALUES
(1002, 1, 1, 40.99, 0.00, 0, 40.99, 'DEBIT_CARD', 'COMPLETED', 'DELIVERED', NOW() - INTERVAL '7 days', NOW() - INTERVAL '10 days');

INSERT INTO order_items (order_id, book_id, quantity, unit_price, subtotal) VALUES
(1002, 6, 1, 19.99, 19.99),
(1002, 9, 1, 21.00, 21.00);

SELECT setval('orders_id_seq', 1002);
