## How to run

`bun dev`

- What did you choose to mock the API and why?
  - Using Promises with setTimeouts with 3 functions to submit the file, get the task status and cancel the task
  - This is the simplest and quickest solution without using external libraries to keep the app lightweight and simple
- If you used an AI tool, what parts did it help with?
  - Used when encountering issues and for peer reviewing to improve code
- What tradeoffs or shortcuts did you take?
  - Due to time restrictions took the following shortcuts;
    - Using shadcn for components
    - Using a simple hash map for storing tasks in memory. Next best step besides using a database is to just store in localstorage
- What would you improve or add with more time?
  - Styling, issues with the setup of tailwind with shadcn components not rendering with the expected styling,
- What was the trickiest part and how did you debug it?
  - Managing the business logic of the task made sure to have console logs thoughout the steps
