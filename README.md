# Minor Project: E-Learning Platform

The **E-Learning Platform** is a full-stack web application that supports user authentication, payments via Stripe, and video storage and retrieval. This project utilizes Node.js, MySQL, and Stripe for payment processing, and provides a robust backend API along with a frontend interface.

---

## Key Features

- **User Authentication** with JWT
- **Stripe Payment Integration**
- **Video Management** with cloud storage
- **Course Management** for managing educational content

---

## Prerequisites

Before getting started, ensure you have the following tools and services installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://npmjs.com/) or [Yarn](https://yarnpkg.com/)
- A compatible [MySQL](https://www.mysql.com/) database
- A [Stripe](https://stripe.com) account for payment processing

---

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repository-name.git
   cd your-repository-name
   ```

2. **Set up environment variables:**

Create a .env file in the root of your project with the following variables:

```bash
    PORT=8080
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=""
    DB_NAME=
    JWT_SECRET=""
    EMAIL_USER=""
    EMAIL_PASS=""
    FRONTEND_URL=localhost:3000
    BASE_URL=localhost:8080
    STRIPE_SECRET=""
    REACT_APP_STRIPE_PUBLIC_KEY=""
    SAS_TOKEN=
    VEDIO_ACCOUNT_NAME=""
    CONTAINER_NAME=""
    STRIPE_SERVER_SECRET_KEY=""
    ENDPOINT_SECRET=""
```

3. **Clone the repository:**

   ```bash
   npm install
   ```
