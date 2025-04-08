# Rate Limit Proxy Frontend

This is a simple UI/frontend application for communicating with the [Rate Limit Proxy backend](https://github.com/rahulvijay5/rate-limit-proxy). It was created for the InducedAI assignment.

## Features

- **User Authentication**: Users can log in and register.
- **API Application Management**: Users can create, edit, and delete API applications.
- **Rate Limit Proxy Support**: Users can configure their applications to use the rate limit proxy.
- **Testing Functionality**: Users can test their API applications directly from the UI.
- **Ease of Access**: API keys are easily accessible for users.

## Getting Started

To set up this project on your local machine, follow these steps:

### Prerequisites

Make sure you have the following installed on your computer:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A code editor (like [Visual Studio Code](https://code.visualstudio.com/))

### Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/rahulvijay5/rate-limit-proxy-fe.git
cd rate-limit-proxy-fe
```

### Install Dependencies

Next, install the required dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run the Development Server

Now, you can run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page auto-updates as you edit the files.

## Usage

1. **Login/Register**: Use the login or register functionality to create an account or log in.
2. **Create New API App**: After logging in, you can create a new API application to manage rate limiting for a third-party API.
3. **Edit API App**: You can edit the details of your created API applications.
4. **Test API App**: Test your API applications directly from the UI.
5. **Delete API App**: You can delete any API application you no longer need.

