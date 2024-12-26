# HueTrack

HueTrack is a habit-tracking web application that uses a color-coded calendar to help users monitor and maintain their habits. The app allows users to customize labels, track daily progress, and view statistics on habit consistency.

## Features

- **Color-coded Calendar**: Assign colors to represent different habit states.
- **Custom Labels**: Create and manage habit labels with titles and colors.
- **Statistics Dashboard**: View habit consistency and trends.
- **Dynamic UI**: Responsive and user-friendly interface using `styled-components`.
- **Notifications**: Get real-time feedback on actions using `react-notifications`.

## Installation

### Prerequisites

- Node.js and npm installed.
- Backend server and frontend React application directories set up.

### Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd huetrack

   ```

2. Install dependencies:
   npm install

3. Run the application:
   npm run watch

- This will concurrently run the server and client.

## Project Structure

- **`server`**: Backend server using Node.js with environment configurations via `dotenv`.
- **`client`**: Frontend React application using `styled-components` and `react-icons`.
- **Shared Dependencies**:
  - `axios`: For API requests.
  - `uuid`: For generating unique IDs.

## Scripts

- `npm run server`: Start the backend server.
- `npm run client`: Start the frontend client.
- `npm run watch`: Run the server and client concurrently.

## Environment Variables

Create a `.env` file in the `server` directory and include the following:

```env
PORT=5000
DATABASE_URL=<your-database-url>
```

Replace `<your-database-url>` with the connection string for your database.

## Author

Dyana Rahhal

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) License.

You are free to:

- **Learn and Share**: Copy and redistribute the material in any medium or format.

Under the following terms:

- **Attribution**: You must give appropriate credit, provide a link to the license, and indicate if changes were made.
  - Example: This work is based on HueTrack by Dyana Rahhal, licensed under the [Creative Commons Attribution-NonCommercial 4.0 International License](https://creativecommons.org/licenses/by-nc/4.0/legalcode).
- **Non-Commercial**: You may not use the material for commercial purposes.

For more information, see the [LICENSE](https://creativecommons.org/licenses/by-nc/4.0/legalcode) file.
