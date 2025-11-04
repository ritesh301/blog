#!/bin/bash

# Blogzy Deployment Preparation Script
# This script helps you prepare for deployment

echo "=================================="
echo "  Blogzy Deployment Preparation"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "⚠️  Git not initialized. Initializing..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

echo ""
echo "📋 Deployment Checklist:"
echo ""
echo "Step 1: Setup MongoDB Atlas"
echo "  → Visit: https://www.mongodb.com/cloud/atlas"
echo "  → Create free cluster"
echo "  → Get connection string"
echo ""

echo "Step 2: Create GitHub Repository"
echo "  → Visit: https://github.com/new"
echo "  → Name: blogzy"
echo "  → Public repository"
echo ""

echo "Step 3: Push to GitHub"
read -p "Enter your GitHub username: " github_user
read -p "Enter your repository name [blogzy]: " repo_name
repo_name=${repo_name:-blogzy}

echo ""
echo "Run these commands:"
echo ""
echo "  git add ."
echo "  git commit -m 'Initial commit - Ready for deployment'"
echo "  git remote add origin https://github.com/$github_user/$repo_name.git"
echo "  git branch -M main"
echo "  git push -u origin main"
echo ""

read -p "Do you want to run these commands now? (y/n): " run_git

if [ "$run_git" = "y" ] || [ "$run_git" = "Y" ]; then
    echo ""
    echo "🔄 Adding files..."
    git add .
    
    echo "💾 Committing..."
    git commit -m "Initial commit - Ready for deployment"
    
    echo "🔗 Adding remote..."
    git remote add origin https://github.com/$github_user/$repo_name.git
    
    echo "📤 Pushing to GitHub..."
    git branch -M main
    git push -u origin main
    
    echo ""
    echo "✅ Code pushed to GitHub!"
else
    echo ""
    echo "⏭️  Skipped git push. Run commands manually when ready."
fi

echo ""
echo "=================================="
echo "📖 Next Steps:"
echo "=================================="
echo ""
echo "1. Deploy Backend on Render:"
echo "   → https://dashboard.render.com/"
echo ""
echo "2. Deploy Frontend on Netlify:"
echo "   → https://app.netlify.com/"
echo ""
echo "3. Read full guide:"
echo "   → DEPLOYMENT_GUIDE.md"
echo ""
echo "=================================="
echo "✨ Good luck with deployment!"
echo "=================================="
