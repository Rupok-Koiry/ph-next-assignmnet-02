# Running the Application Locally

This guide will help you set up and run the `assignment-02` application locally on your machine.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (version 20 or higher)
- [npm](https://www.npmjs.com/get-npm) (version 6 or higher)

## Installation

1. **Clone the repository**:

    ```sh
    git clone https://github.com/Rupok-Koiry/ph-next-assignmnet-02
    cd assignment-02
    ```

2. **Install dependencies**:

    ```sh
    npm install
    ```

## Setting Up Environment Variables

Create a `.env` file in the root directory and add the required environment variables. For example:

DATABASE=mongodb://localhost:27017/yourdbname
PORT=3000

## Running the Application

To run the application in development mode with hot-reloading:

```sh
npm run dev
```