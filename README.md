🌿 Rif Herbal Life – Product Catalog Application

A full-stack product catalog application built for a small-scale herbal business.
This system helps manage products, quantities, pricing, and descriptions with a clean and scalable architecture.

🚀 Features

📦 Product catalog management

⚖️ Quantity handling (ml / grams handled separately)

💰 Price management

📝 Product description support

🖼️ Image URL support

🔍 Ready for future enhancements like variants, filters, and inventory tracking

🛠️ Tech Stack
Backend

Java

Spring Boot

Spring Data JPA

REST APIs

MySQL

Frontend

Angular

TypeScript

HTML5 / CSS3

Tools

Git & GitHub

Maven

VS Code / IntelliJ

📂 Project Structure
rif-herbal-life/
│
├── backend/
│   ├── src/main/java/
│   ├── src/main/resources/
│   └── pom.xml
│
├── frontend/
│   ├── src/app/
│   ├── angular.json
│   └── package.json
│
└── README.md

🧩 Database Design (Core Fields)
Field Name	Description
product_name	Name of the product
quantity_value	Numeric quantity (e.g., 250)
quantity_unit	Unit (ml / grams)
price	Product price
description	Product details
image_url	Image link
⚙️ Setup Instructions
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/rif-herbal-life.git

2️⃣ Backend Setup (Spring Boot)
cd backend
mvn clean install
mvn spring-boot:run


✔ Server runs on:

http://localhost:8080

3️⃣ Frontend Setup (Angular)
cd frontend
npm install
ng serve


✔ Application runs on:

http://localhost:4200

🔐 Configuration

Update database credentials in:

backend/src/main/resources/application.properties


Example:

spring.datasource.url=jdbc:mysql://localhost:3306/rif_herbal
spring.datasource.username=root
spring.datasource.password=yourpassword

🧪 API Example

Create Product

POST /api/products


Get All Products

GET /api/products

🌱 Future Enhancements

Product variants (100ml, 250ml, 500ml)

Inventory stock management

Admin authentication

Search & filter options

E-commerce checkout

Cloud deployment (Render / Netlify)

🤝 Contribution

Contributions are welcome!
Feel free to fork the repository and submit a pull request.

📄 License

This project is licensed under the MIT License.

👨‍💻 Author

Mohamed Ijas
Java Full Stack Developer
🔗 GitHub: https://github.com/mdijas2000
