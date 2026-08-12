# Project Ithaca - The Tech Odyssey

Welcome to **Project Ithaca**, the official technical event platform for NISB IEEE! 

This repository contains the full source code for the event platform, which consists of a React frontend and a Node.js/Express backend. 

---

## 🛠 Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: Supabase / PostgreSQL (AWS ready)
- **DevOps**: Docker, GitHub Actions

---

## 📌 Rules & GitHub Workflow for Teammates

Welcome to the team! Since many of us are working collaboratively on this project, we must follow a strict Git workflow to avoid losing work, breaking the app, or dealing with messy merge conflicts. 

**🚨 GOLDEN RULE: NEVER PUSH DIRECTLY TO `main`, `frontend`, or `backend` BRANCHES!**

### 1. Cloning the Repository (First Time Setup)
```bash
git clone <repository-url>
cd Project_Ithaca
```

### 2. Creating Your Own Branch (Before you start working)
Always create a new branch for the feature or fix you are working on. Use a descriptive name (e.g., `feat-login`, `fix-leaderboard`, `frontend-island1`).
```bash
git checkout -b <your-branch-name>
```

### 3. Saving Your Work
Once you've made some changes and want to save them to your branch:
```bash
git add .
git commit -m "Brief description of what you did"
```

### 4. Updating Your Branch (Important before pushing!)
Before you push your code, always make sure your branch is up-to-date with the main branch. This minimizes merge conflicts.
```bash
# Switch to main and pull latest changes
git checkout main
git pull origin main

# Switch back to your branch and merge main into it
git checkout <your-branch-name>
git merge main
```
*If you get a merge conflict during `git merge main`, VS Code will highlight the conflicting lines. Accept the correct changes, save the files, and run `git add .` followed by `git commit -m "Resolved merge conflicts"`.*

### 5. Pushing Your Code
Now push your branch to GitHub:
```bash
git push origin <your-branch-name>
```

### 6. Creating a Pull Request (PR)
Go to the GitHub repository in your browser. You will see a prompt to "Compare & pull request" for your branch. Create the PR and assign a senior developer or project lead to review it. **Do not merge it yourself.**

---

## 🐋 Docker & DevOps
For deployment and testing, we will use Docker and GitHub Actions. This ensures that what runs on your machine will run exactly the same way in production. 

- If you want to spin up the local environment, use the `docker-compose.yml` (will be added soon).
- GitHub actions will automatically test and build the images on every PR to the `main` branch.

Happy coding! If you're stuck with Git, ask for help before running random commands. 🚀
