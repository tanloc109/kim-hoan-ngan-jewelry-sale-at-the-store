![Screenshot 2024-12-02 222256](https://github.com/user-attachments/assets/301eec13-5daf-4954-ab9f-0b6369b225a7)![Screenshot 2024-12-02 222256](https://github.com/user-attachments/assets/e76ec17b-56b3-4af0-996a-6061cfc39ef9)- Description: This project aims to assist employees, managers, and store owners in easily managing daily transaction flows at Kim Hoan Ngan Jewelry Store. The system facilitates sales management, inventory tracking, and revenue reporting efficiently

- Technologies Used:
  + Backend: Spring Boot, Spring Security JWT, Spring Data JPA, Restful API, Spring Mail
  + Database: SQL Server
  + Tools: Firebase Storage, Azure, Swagger UI
 
- Features:
  + Authentication and authorization with Spring Security JWT
  + Daily revenue report generation and email delivery using Spring Mail
  + Password recovery via email token
  + Firebase Storage integration for storing product images and bank transfer images
  + Revenue reports dashboard
  + Product filtering, selection, and ordering
  + Payment processing and warranty certificate generation
  + CRUD operations for all database tables
  + API deployment using Azure
  + Best practice APIs have filters, sort, paginations
    
- Architecture: 3-Layer Architecture
  
- Account:
  + Staff [staff, 12345]
  + Manager [manager, 12345]
  + Admin [admin, 12345]

- Some STAFF screens in this project:

+ Login Screen:
  ![Screenshot 2024-12-02 221928](https://github.com/user-attachments/assets/db8e9706-4d49-4af2-aef5-9f55257ff3e6)

+ Screen Orders:
![Screenshot 2024-12-02 221953](https://github.com/user-attachments/assets/15241913-43d1-4cc8-b15e-154ea3fe7151)

+ Screen Order Detail
![Screenshot 2024-12-02 222015](https://github.com/user-attachments/assets/44ec5ad4-4b99-4c6b-8eb4-3ce52fa2e739)

+ Bill:
![Screenshot 2024-12-02 222022](https://github.com/user-attachments/assets/3118ecc6-bef2-4ede-9339-46d148df03d2)

+ Exported bill to pdf:
![Screenshot 2024-12-02 222033](https://github.com/user-attachments/assets/224cd88a-58c4-4a3c-a8d2-d3b734a05166)

+ Store info:
![Screenshot 2024-12-02 222053](https://github.com/user-attachments/assets/df1d1738-f2bc-4887-954b-8870cdc82f73)

+ Screen products:
![Screenshot 2024-12-02 222101](https://github.com/user-attachments/assets/f8416831-39f2-4a07-853d-eded1092a327)
![Screenshot 2024-12-02 222212](https://github.com/user-attachments/assets/46dce789-f479-4706-81d4-4c7efc56a59b)

+ Screen orders wait to pay:
![Screenshot 2024-12-02 222221](https://github.com/user-attachments/assets/e44adc07-ab84-4dad-a9d4-040f4bb51050)

+ Order detail:
![Screenshot 2024-12-02 222228](https://github.com/user-attachments/assets/54b12fa6-61a5-4df1-a21c-d07e5d216e77)

+ Screen orders to get warranty:
![Screenshot 2024-12-02 222244](https://github.com/user-attachments/assets/2f7ba2b2-81fa-44e9-84b9-e662972e73ee)

+ Order Detail:
![Screenshot 2024-12-02 222250](https://github.com/user-attachments/assets/152a95a1-fe77-4aab-bd26-d14f622d457b)

+ Screen List Warranties:
![Screenshot 2024-12-02 222256](https://github.com/user-attachments/assets/c20a3fbe-daec-4d59-90e7-99177471fad8)

+ Screen Warranty Detail:
![Screenshot 2024-12-02 222305](https://github.com/user-attachments/assets/6d1b184a-8f93-416d-a643-ec1ddac953ca)

+ Exported File Warranty:
![Screenshot 2024-12-02 222312](https://github.com/user-attachments/assets/c2b80bce-808b-4a64-9715-53b8d5d3cfe6)

+ Screen Price of Gold:
![Screenshot 2024-12-02 222319](https://github.com/user-attachments/assets/e12e02b5-d14f-41e2-af1c-dd277d3cc1fd)

- Some MANAGER screens:

+ Store Revenue Report:
![Screenshot 2024-12-02 222424](https://github.com/user-attachments/assets/3887f6ce-917a-4235-926d-d33d72f97bf1)
![Screenshot 2024-12-02 222429](https://github.com/user-attachments/assets/4296662e-60ca-4f63-aff2-d293cc50f0c8)

+ Order Management:
![Screenshot 2024-12-02 222458](https://github.com/user-attachments/assets/2abe2e0c-bb2a-4339-83cb-5ec587cbe0de)

+ Payement Management:
![Screenshot 2024-12-02 222507](https://github.com/user-attachments/assets/dbe8edcb-8920-4c44-81d4-91ad44899345)

+ Product Management:
![Screenshot 2024-12-02 222516](https://github.com/user-attachments/assets/8fd8aac8-f26c-42c3-9bb4-5bc17168399e)
![Screenshot 2024-12-02 222535](https://github.com/user-attachments/assets/9a0b8206-baf0-460b-b555-fb765e33f35d)
![Screenshot 2024-12-02 222543](https://github.com/user-attachments/assets/8c8c9a56-5ba3-4233-b63d-fb8aaf75affe)

+ Warranty Management:
![Screenshot 2024-12-02 222556](https://github.com/user-attachments/assets/242dcd8d-cf1a-471a-8873-3f6227bd9263)
![Screenshot 2024-12-02 222603](https://github.com/user-attachments/assets/4a48f843-4f09-44cd-9c92-4481f0d499aa)

+ Customer Management:
![Screenshot 2024-12-02 222608](https://github.com/user-attachments/assets/278cd357-935c-4dc3-b619-ee877ed173f2)

+  Gold Management:
![Screenshot 2024-12-02 222621](https://github.com/user-attachments/assets/f6135147-1309-4b3d-9caf-d31d7a01ad8e)

+ Category:
![Screenshot 2024-12-02 222611](https://github.com/user-attachments/assets/e6f0e87f-6a51-40c0-a557-ffa993eae8c7)

- Some ADMIN screens:

+ User Management
![Screenshot 2024-12-02 222641](https://github.com/user-attachments/assets/e6e97d43-07b3-4e27-854a-577e481bfddd)

+ Role Management:
![Screenshot 2024-12-02 222646](https://github.com/user-attachments/assets/bf55f56f-5a46-4f62-a085-6eee6ed4278a)

+ Config Store Info:
![Screenshot 2024-12-02 222701](https://github.com/user-attachments/assets/4adee234-74c3-4f89-9448-9b2d5dd09989)




