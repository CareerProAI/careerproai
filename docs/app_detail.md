# Google Stitch Prompt: Professional AI Resume & LinkedIn Job Matching Platform

## Project Overview

Design and generate a **modern, production-quality web application UI** for an AI-powered Resume Analysis and LinkedIn Job Discovery platform.

The UI must feel like a premium Google product, following **Google Material Design 3 (Material You)** principles with excellent spacing, typography, accessibility, and responsive layouts.

The design should be clean, elegant, minimal, and enterprise-grade.

---

# Design Style

Create a UI that looks comparable to:

* Google Cloud Console
* Google Gemini
* Google AI Studio
* Google Drive
* Notion
* Linear
* Vercel Dashboard

Use:

* Material Design 3
* Rounded corners (12–16px)
* Soft shadows
* White/light background
* Professional blue accent colors
* Beautiful cards
* Smooth animations
* Responsive layouts
* Excellent whitespace
* Modern icons
* Clean typography
* Dashboard-style interface

The application should look like software built by Google.

---

# Target Users

* Job seekers
* Software Engineers
* Data Scientists
* AI Engineers
* Product Managers
* Students
* Recruiters

---

# Main Navigation

Left Sidebar

* Dashboard
* Resume
* Resume Analysis
* Job Search
* AI Matching
* Saved Jobs
* Applications
* Analytics
* Settings

Top Navigation

* Search
* Notifications
* Profile Menu
* Theme Switch
* User Avatar

---

# Dashboard

Display professional cards showing:

* Resume Status
* Resume Score
* Skills Detected
* Experience
* Education
* Matching Jobs
* Saved Jobs
* Applications
* AI Recommendations

Include:

* Recent Activity
* Resume Health
* Skills Overview
* Job Match Summary

Use charts and statistics cards.

---

# Resume Upload Page

Create a beautiful drag-and-drop upload area.

Requirements

Supported formats:

* PDF
* DOCX

Features

* Drag & Drop
* Browse Files
* Upload Progress
* File Preview
* Remove File
* Replace Resume
* Upload History

After upload:

Show

* Resume Name
* Upload Date
* File Size
* Processing Status

---

# AI Resume Analysis

After uploading, the backend will send the resume to the Grok API.

The UI should display loading animations while processing.

Once complete, display:

## Personal Information

* Name
* Email
* Phone
* Address
* LinkedIn
* GitHub
* Portfolio

---

## Experience

Beautiful timeline showing

* Company
* Position
* Duration
* Responsibilities

---

## Education

Cards for

* Degree
* Institution
* Graduation Year

---

## Skills

Categorize skills

Technical Skills

Soft Skills

Languages

Frameworks

Databases

Cloud

AI/ML

DevOps

Tools

Display skills as colorful chips.

---

## Certifications

Card list.

---

## Projects

Professional project cards containing

* Title
* Description
* Technologies
* GitHub
* Live URL

---

## Resume Insights

AI-generated

* Resume Score
* ATS Score
* Missing Skills
* Weak Sections
* Suggested Improvements
* Strengths
* Recommended Certifications

---

# Database

The backend will extract structured resume information using the Grok API and store it in a SQLite database.

Expected tables include:

* users
* resumes
* resume_skills
* experience
* education
* certifications
* projects
* languages
* social_links
* resume_analysis
* job_matches

The UI should visualize this structured data elegantly.

---

# LinkedIn Job Search

Create a professional job discovery page.

The backend will fetch jobs from LinkedIn.

Display jobs in beautiful cards.

Each card should show:

* Company Logo
* Company Name
* Job Title
* Location
* Remote/Hybrid/Onsite
* Employment Type
* Experience Required
* Salary (if available)
* Posted Date
* Skills Required
* Job Description Preview

Buttons

* View Details
* Save Job
* Apply
* Compare

Filters

* Keyword
* Location
* Experience
* Salary
* Remote
* Company
* Date Posted
* Employment Type

Sorting

* Relevance
* Latest
* Salary
* Best Match

---

# AI Job Matching

Compare the analyzed resume with available jobs.

Display

Overall Match %

Missing Skills

Matching Skills

Experience Match

Education Match

AI Recommendation

Priority Score

Visualize the match using:

* Circular progress indicators
* Skill comparison charts
* Match badges

Each job should include

* Match Score
* Why it matches
* Missing Skills
* Suggested Resume Improvements

---

# Saved Jobs

Display

* Saved Date
* Match Score
* Company
* Status

Allow

* Remove
* Apply
* Notes

---

# Applications

Track applications.

Columns

* Company
* Job Title
* Applied Date
* Status
* Interview
* Offer
* Rejected

Timeline view preferred.

---

# Analytics

Create beautiful charts showing

* Resume Strength
* Skills Distribution
* Applications per Month
* Interview Rate
* Offer Rate
* Match Scores
* Top Skills
* Skill Gaps

Use modern dashboards.

---

# Settings

Include

* Profile
* Resume Management
* API Keys
* Notification Settings
* Theme
* Security
* Account

---

# Loading States

Design elegant loading screens.

Include

* Skeleton loaders
* Progress indicators
* Smooth transitions

---

# Empty States

Design friendly illustrations for

* No Resume
* No Jobs
* No Saved Jobs
* No Applications

---

# Error States

Professional error messages with retry buttons.

---

# Mobile Design

Create a fully responsive experience.

Support

Desktop

Tablet

Mobile

---

# Accessibility

Follow WCAG guidelines.

* Keyboard navigation
* Screen reader support
* Proper contrast
* Accessible forms

---

# UI Components

Design reusable components

* Buttons
* Cards
* Tables
* Chips
* Dialogs
* Drawers
* Forms
* Charts
* Tabs
* Accordions
* Tooltips
* Snackbars

---

# Animations

Use subtle, premium animations.

Examples

* Card hover
* Smooth page transitions
* Upload animation
* Progress animation
* Loading shimmer
* Button ripple
* Drawer animation

---

# Backend Integration Assumptions

The frontend should be designed assuming these backend capabilities:

1. Users upload PDF or DOCX resumes.
2. The backend extracts text from the uploaded file.
3. The extracted content is analyzed using the Grok API.
4. Structured resume data is stored in a SQLite database.
5. The backend retrieves job listings from LinkedIn (or another compliant job data source/API).
6. The frontend consumes REST APIs to display resume insights, job listings, and AI match results.

Design the UI to gracefully handle loading, success, and error states for every API interaction.

---

# Deliverables

Generate a complete high-fidelity UI including:

* Login page
* Dashboard
* Resume Upload
* Resume Analysis
* Resume Details
* LinkedIn Job Search
* Job Details
* AI Job Matching
* Saved Jobs
* Applications Tracker
* Analytics Dashboard
* Settings
* Responsive mobile layouts
* Component library
* Light mode and Dark mode
* Professional icons
* Production-ready design system

The final result should resemble a polished enterprise SaaS product that could realistically be shipped by Google, with consistent Material Design 3 styling, exceptional user experience, and a premium visual aesthetic throughout.

One note: the requirement **"fetch all jobs from LinkedIn"** is generally not feasible or permitted unless you use LinkedIn's official APIs and comply with their terms of service. For a production application, it's better to specify **"retrieve available job listings via LinkedIn's official API (or another authorized job data provider)"** rather than "fetch all jobs." This makes the prompt technically realistic and easier for developers to implement.
