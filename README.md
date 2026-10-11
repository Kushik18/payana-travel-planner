# Payana — AI Travel Itinerary Generator

Payana is a highly advanced, modern travel planner web application specifically tailored for exploring the diverse landscapes, heritage, and culture of Karnataka. It provides users with highly customizable, day-by-day travel itineraries based on their personal preferences, mood, budget, and travel duration.

The application is split into two distinct panels: a feature-rich User Interface for travelers to plan, save, and experience their trips, and a comprehensive Admin Dashboard for content management, user moderation, and platform analytics.

---

## ✨ Comprehensive Feature Breakdown & Mechanics

### 👤 User-Facing Features

#### 1. AI Trip Planner (Mood-Based Chatbot Interface)

- **What it does:** Offers a conversational, intuitive interface where users can define their travel vibe (e.g., romantic, adventurous, relaxed) rather than manually filtering through lists.
- **How it works:** Located in `MoodForm.js`, this component collects user preferences across multiple dimensions and sends them to the Spring Boot backend (`PlanApi`), returning a highly curated list of recommended places.

#### 2. Manual Itinerary Builder (Questionnaire-Based)

- **What it does:** A structured, step-by-step planning tool for users who know exactly what they want.
- **How it works:** Implemented via `McqClassification.js` and `questions.js`, users answer a series of multiple-choice questions regarding budget, categories, district, and duration.

#### 3. Interactive Timeline & Itinerary Visualization

- **What it does:** Transforms a raw list of destinations into a logical, sequential day-by-day travel timeline.
- **How it works:** Utilizes `MCQResult.js`, `ItineraryDisplay.js`, and `RouteMapComponent.js` to group places into daily chunks, calculate distances using latitude/longitude, and visually plot the path using an interactive map.

#### 4. My Journeys (Saved Itineraries & Progress Tracking)

- **What it does:** Acts as a personal travel diary and planner repository.
- **How it works:** Users can save generated itineraries (`MyItineraries.js`), mark places as "Visited" to track progress, and submit ratings and written reviews.

#### 5. Secure User Authentication & Profile Management

- **What it does:** Manages user registration, login, and personalized statistics.
- **How it works:** Utilizes Spring Security and JWTs (`Login.js`, `Register.js`, `ProtectedRoute.js`) and calculates engagement metrics based on user activity (`Profile.js`).

#### 6. AI Travel Guide

- **What it does:** Acts as a virtual assistant to answer specific travel-related questions.
- **How it works:** Located in `AITravelGuide.jsx`, it helps users explore specific details about destinations and provides instant conversational feedback.

#### 7. Budget & Expense Management

- **What it does:** Comprehensive financial tracking for the trip, from planning to execution.
- **How it works:** Through `BudgetPlanner.jsx`, `ExpenseTracker.jsx`, and `ExpenseAnalytics.jsx`, users can define trip budgets, track on-the-go expenses, and view detailed analytical breakdowns of their spending.

#### 8. Festival Engine

- **What it does:** Discovers and highlights local cultural events and festivals.
- **How it works:** Implemented via `FestivalEngine.jsx`, this dynamically injects upcoming regional festivals into the user's view, enhancing their cultural experience.

#### 9. Hidden Gems Explorer

- **What it does:** Uncovers lesser-known, off-the-beaten-path destinations.
- **How it works:** Located in `HiddenGemsExplorer.jsx`, it provides recommendations tailored for travelers seeking unique, uncrowded experiences.

#### 10. Packing Assistant

- **What it does:** Helps users pack smartly based on their destination and trip style.
- **How it works:** `PackingAssistant.jsx` generates intelligent packing lists to ensure travelers don't forget essential items.

#### 11. Route Optimizer

- **What it does:** Ensures the travel path is logical and time-efficient.
- **How it works:** `RouteOptimizer.jsx` works alongside the interactive timeline to suggest the most optimal travel route between multiple points of interest.

#### 12. Weather Widget

- **What it does:** Provides real-time weather forecasts for selected destinations.
- **How it works:** `WeatherWidget.jsx` fetches and displays local climate conditions, helping users plan their activities accordingly.

---

### 🔑 Admin Management Features

#### 1. Overview Dashboard

- **What it does:** Provides administrators with a high-level operational view of the platform.
- **How it works:** Located in `AdminDashboard.js`, it queries the backend for platform-wide metrics (total registered users, total itineraries generated, active events) and presents them using visual charts. Restricted by `AdminProtectedRoute.js`.

#### 2. Itinerary & Place Content Management (CRUD)

- **What it does:** The core content management system allowing admins to dictate what destinations are available to users.
- **How it works:** Through `UpdItinerary.js` and `ViewItineraries.js`, admins can Create, Read, Update, and Delete (CRUD) destinations, inputting precise coordinates and categorizations.

#### 3. Regional Events Management

- **What it does:** Allows admins to schedule and advertise local festivals, fairs, or pop-up events.
- **How it works:** Using `UpdEvents.js`, admins can link specific events to districts, assigning start and end dates, descriptions, and map locations.

#### 4. User Moderation & Management

- **What it does:** Maintains the integrity and quality of the platform's community aspects.
- **How it works:** Through `ManageUsers.js`, admins can view all registered users and perform administrative actions (e.g., account deletion or suspension).

#### 5. Feedback Moderation

- **What it does:** Moderates user-submitted ratings and reviews.
- **How it works:** Using `AdminFeedbacks.js`, admins review user feedback, with the authority to approve, feature, or remove reviews.

#### 6. Admin Profile Management

- **What it does:** Manages administrator account details.
- **How it works:** `AdminProfile.js` provides admins with a dedicated interface to update their credentials and personal admin information.

---

## 🛠️ Deep Dive into Technologies Used

### Frontend Architecture

- **React.js (v19):** The core UI library powering the component-based architecture.
- **React Router Dom (v7):** Handles all client-side routing, enabling seamless Single Page Application (SPA) navigation. Utilized for creating complex nested routes and implementing `ProtectedRoute` logic based on authentication state.
- **Framer Motion:** Integrates premium micro-animations. Used extensively in components like `CinematicIntro.jsx` and `HeroSection.jsx` to provide stagger transitions, smooth page loads, and engaging hover effects, creating a dynamic user experience.
- **Axios:** The chosen HTTP client. Configured globally to intercept requests and append JWT authorization headers, as well as intercepting responses to handle token expiration gracefully.
- **Styling (Vanilla CSS & Bootstrap):** A hybrid approach using React-Bootstrap for rapid, responsive grid layouts and robust components, heavily customized with Vanilla CSS (`index.css`, `CinematicIntro.css`, `HeroSection.css`) for bespoke theme design tokens, glassmorphism effects, and color palettes.
- **React Toastify:** Provides non-intrusive, interactive user feedback notifications (e.g., "Itinerary Saved Successfully", "Login Failed").

### Backend Architecture

- **Java (v17+):** The robust platform programming language.
- **Spring Boot (v3.2.5):** The foundational framework for the backend REST API. chosen for its auto-configuration and rapid development capabilities.
- **Spring Security & JWT:** Implements a stateless authentication mechanism. Spring Security filters intercept incoming requests, validate the JWT signature, and authorize access to endpoints based on user roles (USER vs. ADMIN).
- **Spring Data JPA & Hibernate:** Handles all Database Object-Relational Mapping (ORM). Interfaces in the `Repository` directory automatically generate SQL queries, drastically reducing boilerplate code when interacting with the MySQL database.
- **MySQL:** The persistent relational database storing all users, destinations, itineraries, events, and reviews.

---

## 🚀 Running the Project Locally

To run Payana locally, both the Spring Boot API and the React frontend must be running simultaneously.

### 1. Start the Spring Boot Backend (Port 8080)

The backend provides all data and authentication services.

- **Directory**: `PlanApi`
- **Run Command**:

  ```powershell
  cd PlanApi
  .\mvnw spring-boot:run
  ```

  _Wait for the console to display "Started PlanApiApplication"._

### 2. Start the React Frontend (Port 3000)

The frontend serves the user interface and communicates with the backend API.

- **Directory**: `itinerary_ui`
- **Run Command**:

  ```powershell
  cd itinerary_ui
  npm install  # (If running for the first time)
  npm start
  ```

  _This will automatically open `http://localhost:3000` in your default browser._

---

## 🔑 Demo Login Credentials

For testing and demonstration purposes, use the following pre-configured credentials:

**Standard User Profile:**

- **Email:** `tester_123@gmail.com`
- **Password:** `password123`
  _(Grants access to trip planning, saved itineraries, and user profile)_

**Administrator Profile:**

- **Email:** `admin@gmail.com`
- **Password:** `Admin@123`
  _(Grants access to the Admin Dashboard, content management, and moderation tools)_

> [!TIP]
> **Auto-Seeding Logic:** These default accounts are automatically created in your MySQL database on startup via the `PasswordMigration.java` script if they do not already exist, ensuring you never get locked out of a fresh database deployment.

---

## 🌍 Massive Karnataka Database Expansion

The core value of Payana is its data. The backend now comes equipped with an enormous real-world dataset covering every single district in Karnataka:

- **775+ Curated Locations:** The application contains over 775 unique tourist destinations, temples, waterfalls, beaches, and resorts spanning all 31 districts.
- **Automated Geocoding:** A custom `geocode_places.js` script integrates with OpenStreetMap Nominatim API to automatically resolve and populate the exact Latitude and Longitude for accurate mapping and routing calculations.
- **Live Google Image Scraping:** A robust background engine (`fetch_images_google.js`) dynamically searches Google Images and fetches the exact, original high-resolution photograph for every location to power the UI cards.

---

## 🛠️ Applied Hotfixes & Bug Tracking

### Architectural Routing Fixes

- **Dashboard "My Itineraries" Route:** `src/Components/Dashboard.js` was modified to map correctly to `/Main/my-itineraries` instead of `/my-itineraries`, aligning with the nested routing structure.
- **Dashboard "AI Trip Planner" Route:** `src/Components/Dashboard.js` was updated to map to `/Main/mood-form` instead of `/mood-form`.
- **Profile Logout Redirection:** Fixed an issue in `src/Components/Profile.js` where user logout redirected to `/Login`. It now correctly redirects to the root path `/`.
- **Admin Sidebar Logout Redirection:** Corrected in `src/AdminComponent/Amain.js` to redirect admin logouts to `/AdminLogin`, ensuring admins remain within the admin portal context.

### Database Integrity Bug Fixes

- **Save Itinerary Constraint Fix (`PlanApi/src/main/java/Travel_planApi/PlanApi/Controller/TripPlaceController.java`):**
  - **The Bug:** Users encountered a `Failed to save itinerary` error. The MySQL database enforces a `NOT NULL` constraint on the `rating` column within the itineraries table, but the initial save payload from the frontend did not include a rating.
  - **The Solution:** Implemented a backend fallback within the `saveItinerary` endpoint. If the incoming payload lacks a rating, the system automatically injects a default rating of `5` to satisfy the schema constraint and allow the save operation to succeed.

  ```java
  if (tripItinerary.getRating() == null) {
      tripItinerary.setRating(5);
  }
  ```

---

## 🗺️ System Architecture & Page Breakdown

This section provides a comprehensive, page-by-page breakdown of the Payana platform as of its final build. It is split into two primary segments: the **User Block** (end-user features) and the **Admin Block** (administrative management).

### 1. The User Block
The User Block encompasses all public-facing and authenticated pages designed for tourists and travelers planning their journey through Karnataka.

#### Public Routes
- **`/` (Landing Page)**: The public entry point of the platform. Features a luxurious hero section, high-level highlights of the platform's capabilities (AI planning, routing, weather), a showcase of popular destinations, and call-to-action buttons directing users to register or log in.
- **`/Login`**: The standard user authentication portal. Includes hidden dummy fields to successfully bypass aggressive browser autofill.
- **`/Register`**: The sign-up portal for new users to create a standard profile.

#### Protected User Dashboard (`/Main/*`)
All routes under `/Main` are protected by a JWT-based `ProtectedRoute` wrapper. The `Main.js` component acts as a shell, providing the top navigation bar and rendering the following sub-pages:

- **Dashboard (`/Main`)**: The central hub. Displays personalized welcome messaging, live statistical counters (Trips Planned, Places Explored), and a luxury grid of 10 actionable feature cards that navigate to the specific tools below.
- **AI Travel Guide (`/Main/ai-guide`)**: A ChatGPT-style conversational interface. Users can chat with the Payana AI to ask complex, open-ended questions about Karnataka's culture, food, transport, and hidden secrets.
- **AI Trip Planner (`/Main/mood-form`)**: A dynamic wizard where users input their current "mood" (e.g., Adventure, Heritage, Nature), travel companions (Kids, Adults, Both), and preferred district. The backend cross-references the local database to generate a highly curated list of recommendations.
- **Manual Itinerary (`/Main/ItineraryDisplay`)**: A traditional filtering interface. Users manually select a district and category (e.g., Beaches, Temples) to browse all available destinations in the database and add them to their trip.
- **My Journeys (`/Main/my-itineraries`)**: The user's personal travel vault. Displays all previously saved AI-generated or manually curated itineraries, allowing users to revisit or delete past trip plans.
- **Budget Planner (`/Main/budget-planner`)**: A financial estimation tool. Users input their destination, days, and travel style (Budget, Standard, Luxury). The tool calculates estimated breakdowns for food, transport, and accommodation.
- **Packing Assistant (`/Main/packing-assistant`)**: A utility that generates a dynamic, interactive packing checklist based on the user's destination, expected weather, and planned activities. Users can check off items and download the list as a PDF.
- **Route Optimizer (`/Main/route-optimizer`)**: A logistical tool utilizing a TSP (Traveling Salesperson Problem) algorithm. Users add multiple stops, and the tool calculates the most efficient geographical sequence to visit them, minimizing travel time and distance.
- **Weather Forecast (`/Main/weather`)**: Integrates directly with the OpenMeteo API. Users select a Karnataka district to instantly view live geocoded 5-day weather forecasts, allowing them to plan around monsoon rains or summer heat.
- **Festival Engine (`/Main/festivals`)**: A cultural calendar showcasing Karnataka's major events (Dasara, Kambala, Hampi Utsav). Provides dates, locations, and cultural significance to help users time their visits.
- **Hidden Gems (`/Main/hidden-gems`)**: A curated explorer for offbeat and lesser-known destinations that aren't typically found in standard tourist guides (e.g., secret waterfalls, remote peaks).
- **Expense Tracker (`/Main/expenses`)**: A real-time ledger where users can actively log their trip expenses categorized by Food, Fuel, Hotel, and Shopping.
- **Expense Analytics (`/Main/expense-analytics`)**: The visual companion to the Expense Tracker. Generates dynamic pie charts and bar graphs to help users visualize their spending habits and see where their budget went.
- **Profile (`/Main/Profile`)**: User account management. Allows users to view their account details, submit platform feedback directly to the admins, and securely log out.

### 2. The Admin Block
The Admin Block is a strictly restricted portal designed for platform managers to moderate content, view analytics, and manage the core database.

#### Admin Authentication
- **`/AdminLogin`**: A separate authentication portal specifically for administrators, isolated from the standard user login to prevent accidental cross-auth.

#### Protected Admin Dashboard (`/admin/*`)
All routes under `/admin` are protected by the `AdminProtectedRoute` wrapper. The `Amain.js` component provides the persistent sidebar navigation.

- **Admin Dashboard (`/admin`)**: The high-level command center. Displays key system metrics, quick-action cards, and an overview of recent platform activity.
- **Manage Users (`/admin/manageusers`)**: A moderation panel listing all registered users. Admins can review user details, block abusive accounts, or delete accounts entirely.
- **Add Itinerary (`/admin/upditinerary`)**: The primary data entry tool. Admins can manually add new tourist destinations to the core database.
- **View/Edit Itineraries (`/admin/viewitineraries`)**: A comprehensive table of the 775+ destinations currently in the database. Admins can search, filter, edit existing details, or delete outdated locations.
- **Manage Events (`/admin/updevents`)**: A panel to publish time-sensitive travel alerts, promotional events, or state-wide announcements that may affect tourism.
- **User Feedbacks (`/admin/feedbacks`)**: An inbox for reviewing feedback, bug reports, or feature requests submitted by end-users via their Profile page.
- **Manage Festivals (`/admin/updfestivals`)**: A dedicated CRUD interface for managing the data that powers the user-facing Festival Engine.
- **Manage Hidden Gems (`/admin/updhiddengems`)**: A dedicated CRUD interface for curating and updating the offbeat locations featured in the Hidden Gems Explorer.
- **System Statistics (`/admin/statistics`)**: A detailed analytics dashboard showing platform usage, most popular queried districts, user growth trends, and API utilization.
- **Reports (`/admin/reports`)**: A utility to generate, view, and export systemic reports (e.g., Monthly User Signups, Database Health) for external stakeholders.
- **System Settings (`/admin/systemsettings`)**: A configuration panel for managing global variables, toggling features on/off, or updating third-party API keys.
- **Admin Profile (`/admin/adminprofile`)**: Account management for the currently logged-in administrator, including the secure logout functionality.

---

## 📁 Directory Structure & Deep File Details

To provide full transparency on every single detail within the project, here is the complete structural breakdown of all core modules, scripts, and components.

### 1. Root Directory (`payana-v1.1.2/`)

- `PlanApi/`: The Spring Boot Java backend containing all REST APIs, data seeding scripts, and server configuration.
- `itinerary_ui/`: The React-based frontend web application.
- `payana/`: Static asset directory containing images and promotional videos (e.g. `videoplayback (1).mp4`, `.jpg`, `.avif`).
- `README.md`: This comprehensive documentation file.

### 2. Backend Module (`PlanApi/`)

This module powers the logic, security, and database connectivity.

- `src/main/java/Travel_planApi/PlanApi/`: Contains controllers, models, repositories, and security configurations.
- `src/main/resources/`: Contains the `application.properties` (database credentials) and static templates.
- `pom.xml`: Maven dependencies including Spring Web, Spring Security, Spring Data JPA, and MySQL Driver.
- `boot_output.txt` / `compile_output.txt`: Logs from the Spring Boot application initialization and Maven compilation processes.
- **Node.js Utility & Seeding Scripts:**
  - `clean_db.js`: Script to wipe database records for clean testing environments.
  - `fetch_images.js` / `fetch_images_google.js`: Background engines to dynamically scrape Google Images for high-quality location photos.
  - `geocode_places.js`: Integrates with OpenStreetMap to fetch exact coordinates (Lat/Lng) for all destinations in the database.
  - `parse_and_seed.js`, `seed_budget_data.sql`, `seed_data.sql`: Scripts responsible for structuring and inserting initial district, destination, and budget data into the MySQL instance.
  - `restore_itineraries.js`: Backup restoration tool for saved trips.
  - `db_backup.json`: A full JSON dump of the database state.
  - `places_raw.txt`: Raw text data used as the source for seeding locations.
  - `test_admin.json`, `test_login.json`, `test_register.json`: Postman-style JSON payloads used to test authentication endpoints.
  - `event-api.crt`: SSL Certificate for secure API communication.

### 3. Frontend Module (`itinerary_ui/`)

This module provides the interactive user experience, split between standard users and administrators.

- `package.json` / `package-lock.json`: Node dependencies including React Router, Framer Motion, Axios, and React-Bootstrap.
- `.env`: Environment variables (API base URLs).
- `public/`: Public static assets (favicon, index.html).
- `src/`:
  - `App.js`: The root component managing application state and route definitions.
  - `api/`: Axios interceptors and API configuration (handles JWT injection).
  - `assets/`: UI assets, icons, and local imagery.
  - `Components/`:
    - Contains all user-facing UI components: `CinematicIntro.jsx`, `HeroSection.jsx`, `MoodForm.js`, `McqClassification.js`, `Dashboard.js`, `ItineraryDisplay.js`, `RouteMapComponent.js`, `AITravelGuide.jsx`, `BudgetPlanner.jsx`, and more.
    - Also includes authentication flows (`Login.js`, `Register.js`, `Profile.js`, `ProtectedRoute.js`).
  - `AdminComponent/`:
    - Contains all administrator-facing UI components: `Amain.js`, `AdminDashboard.js`, `UpdItinerary.js`, `ViewItineraries.js`, `ManageUsers.js`, `AdminFeedbacks.js`, `UpdEvents.js`.
    - Includes `AdminLogin.js` and `AdminProtectedRoute.js` to strictly gate access to these tools.
  - `replace_jsx.py` / `process_frames.js`: Build and formatting helper scripts.
  - `index.css`: Global design tokens, custom font imports, glassmorphism utility classes, and customized scrollbars.

---

**Powered by AI, designed for explorers.**
