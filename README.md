# README FOR THIS CODE


# Running your environments 
In order to run your code locally we will be hosting our frontend on port 3000 and our backend on port 4000 as defined in our code. This is all taken care of automatically. It is good practice to have multiple terminals open when working with full stack in order to monitor both your front and backend! You can do this by clicking the little + to the right of the terminal. You will then be able to open infinite terminals and initiate both a front and back end locally on your machine with the following steps.

How To Run Frontend 

- Ensure you have CD'd into the frontend with:
  ```bash
  cd frontend/
- Run the npm command to start the project locally
   ```bash
  npm start

How To Run Backend 
  - Ensure you have CD's into the backend with: 
    ```bash
    cd backend/
  - Run the npm command to start the backend locally
      ```bash
      npn run start
*Note: If you go into the backend folder there is also a preconfigured readme from nest to give you some context of their framework*


# Creating New Backend Folders
Since we are using nestJs we can actually use their inbuilt command from the terminal in the backend folder
  ```bash
  nest g module NAME
```
This will create a folder for that module and add it to the app.modules 


# Working with Prisma for Backend

When working with PostgreSQL and Prisma, the core operations revolve around the schema.prisma file. This file, located within the Prisma configuration, allows you to define data models, which correspond to tables in your database. For instance, the User model could be defined to hold user-related attributes:

```bash
model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  // Additional fields can be added as required.
}
```
After defining or updating your data models, Prisma provides a streamlined process to synchronize these changes with your actual database:

Migrating Changes to the Database:
Execute the following command to push your schema changes to the database and also generate TypeScript types for the defined models, ensuring type safety:

```bash
npx prisma migrate dev
```

Inspecting the Database with Prisma Studio:
Prisma Studio offers an interactive web-based interface to visualize and manage your database content. Launch it with:
```bash
npx prisma studio
```

This will open a browser window presenting a user-friendly interface for your database, allowing you to perform CRUD operations and more.

 
  
