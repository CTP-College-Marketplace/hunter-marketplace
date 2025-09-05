# Hunter Marketplace 🏫💸  

## Overview  
Hunter students need a safe and simple way to buy, sell, and exchange items like textbooks, furniture, and electronics. Current platforms (Facebook Marketplace, Craigslist, group chats) are too broad, unreliable, and unverified.  

**Hunter Marketplace** is a **campus-only platform** where students with a `@hunter.cuny.edu` email can list and browse items securely.  

---

## Core Features  
- **Student Verification** – Signup restricted to `@hunter.cuny.edu`.  
- **Listings** – Post items with images, price, and category.  
- **Search & Filters** – Find items by category or keyword.  
- **Messaging** – Chat between buyer and seller within the app.  
- **Safety Tools** – Report or block suspicious listings.  

---

## Tech Stack  
- **Frontend:** React + Next.js + TypeScript + TailwindCSS  
- **Backend:** Next.js API routes / AWS Lambda  
- **Database:** PostgreSQL (Aurora) + Drizzle ORM  
- **Storage:** AWS S3 (images)  
- **Auth:** AWS Cognito with Hunter email domain restriction  
- **Deployment:** AWS (Lambda/Fargate, DynamoDB optional for messaging)  
- **CI/CD:** GitHub Actions + LocalStack for testing  

---

## Why It Matters  
- Solves a **real problem** for Hunter students.  
- Keeps the marketplace **safe and exclusive** to the campus.  
- Teaches the team **modern web dev, AWS, and CI/CD** skills.  
- Can **scale to all CUNY schools** after proving success at Hunter.  
