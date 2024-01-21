# MERN Stack IoT Dashboard

React.js dashboard - material ui - iot

<img src="./screenshots/sensor-1.png?raw=true" width=80% height=80%>

## Getting started

#### Step 1: Clone the repository

```bash
git clone https://github.com/johnvan7/mern-iot-dashboard.git
```

```bash
cd mern-iot-dashboard
```

#### Step 2: Setup your MongoDB database

- Create a new MongoDB database and obtain its connection URI.

#### Step 3: Edit the Environment File

- In the /backend directory of the project, create a new file named .env and copy the contents of template.env into it.
- Edit the MONGO_URI variable and replace it with the connection URI of your MongoDB database.
- Edit the JWT_SECRET variable and replace it with a secret string of your choice.


  Do the same for frontend (optional).

#### Step 4: Install Backend Dependencies

In your terminal, navigate to the /backend directory

```bash
cd backend
```

and run the following command to install the backend dependencies:

```bash
npm install
```

#### Step 5: Start the Backend Server

Now run the following command in the same terminal to start the backend server:

```bash
npm run dev
```

This command will start the backend server, and it will listen for incoming requests.

#### Step 6: Install Frontend Dependencies

Open a new terminal window and navigate to the /frontend directory of the project.

```bash
cd frontend
```

```bash
npm install
```

#### Step 9: Run the Frontend Server

Now run the following command in the same terminal to start the frontend server:

```bash
npm run dev
```

Now open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Screenshots

<img src="./screenshots/sensor-2.png?raw=true" width=80% height=80%>

<img src="./screenshots/chart.jpg?raw=true" width=80% height=80%>

<img src="./screenshots/dashboard.png?raw=true" width=80% height=80%>

<img src="./screenshots/sensors.png?raw=true" width=80% height=80%>

<img src="./screenshots/login.png?raw=true" width=40% height=40%>  <img src="./screenshots/otp.png?raw=true" width=38% height=38%>
