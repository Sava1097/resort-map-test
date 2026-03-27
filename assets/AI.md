# AI Workflow Documentation

## Tools Used
- **Editor:** Cursor
- **Model:** Claude 3.5 Sonnet / GPT-4o

## Step-by-Step Process
1. **Project Scaffolding:** I used Cursor to generate the initial structure (Vite for frontend, Express for backend) and the root-level startup script.
2. **ASCII Parsing:** I prompted the AI to create a parser for the `map.ascii` file, converting it into a 2D grid for the React frontend.
3. **Core Logic:** I used prompts to implement the booking validation (checking against `bookings.json`) and the in-memory state management.
4. **Iterative Refinement:** I asked the AI to add a "Cancel Booking" feature and visual feedback (red color for booked cabanas).
5. **Testing:** AI helped generate Vitest suites for the backend API endpoints.
6.**Refactor** "Refactored the initial monolithic App component into a modular structure using a Custom Hook (useMap) for state/API logic and separated UI components (BookingModal). This improved code readability and maintainability."

## Key Prompts Example
- "Create an Express server that reads a map from a CLI argument --map and serves it as JSON."
- "Build a React component using CSS Grid to render map tiles based on their character type (W, p, #, etc.)."
- "Implement a POST /api/book endpoint that validates guestName and roomNumber."

## Reflections
The AI tool allowed me to focus on the architecture and business logic of the app, handling the repetitive boilerplate code. I manually reviewed all generated code to ensure it followed the requirements and handled errors correctly (e.g., the 401 error for invalid guests).