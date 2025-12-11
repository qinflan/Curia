# Welcome to our Curia app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Navigate to client directory

   ```bash
   cd client
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Start the app

   ```bash
   npx expo start
   ```
   or
   ```bash
   npm start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Run the Node server and MongoDB database locally with Docker Desktop

Ensure you have installed Docker Desktop on your machine.

1) Navigate to server directory

```bash
cd server
```

2) Build and run the Docker containers

 ```bash
 docker-compose up --build
 ```
 
3) Now you can make requests to the development server at http://localhost:3000/api/
