# Product Requirements Document (PRD)

## Project Name

**RecruitConnect** *(Working Title)*

## Overview

RecruitConnect is a web application that allows prospective college
athletes to quickly find publicly available recruiting contact
information for college athletic programs.

Instead of searching through dozens of athletic websites, an athlete can
search for a college and immediately view the coaching staff's
recruiting contact information.

The MVP focuses exclusively on providing searchable coach/recruiter
contact information for NCAA softball programs.

## Problem Statement

High school athletes spend significant time searching individual college
athletic websites to locate recruiting contact information.

Every school structures its athletics website differently, making the
process slow and frustrating.

RecruitConnect centralizes publicly available recruiting contact
information into one searchable interface.

## Goals

-   Search for a college by name.
-   View softball recruiting contacts.
-   View coach names.
-   View coach titles.
-   View email addresses.
-   View phone numbers (when available).
-   View NCAA division.
-   View athletics website.

The system should automatically gather this information using a web
scraper.

## Out of Scope (MVP)

-   User accounts
-   Authentication
-   Admin dashboard
-   Favorites
-   Saved schools
-   AI features
-   Email templates
-   Messaging
-   Scholarship information
-   Camps
-   Recruiting questionnaires
-   Multiple sports
-   Paid subscriptions

## Tech Stack

### Frontend

-   React
-   Vite

### Backend

-   Node.js
-   Express

### Database

-   PostgreSQL

### Scraper

-   Node.js
-   Cheerio
-   Playwright (when JavaScript rendering is required)

## Architecture

### Frontend

Responsible for search and displaying results.

### Backend API

Responsible for reading/writing PostgreSQL and serving data.

### Scraper

Standalone application responsible for gathering and normalizing
publicly available coach contact information.

## Database

### schools

  Field
  ---------------
  id
  school_name
  division
  state
  athletics_url
  created_at
  updated_at

### sports

  Field
  ------------
  id
  school_id
  sport_name

### contacts

  Field
  ------------
  id
  sport_id
  coach_name
  title
  email
  phone
  updated_at

## API Endpoints

-   `GET /schools`
-   `GET /schools/search?q=`
-   `GET /schools/:id`
-   `GET /schools/:id/contacts`

## Frontend Pages

### Home

-   Search bar
-   Search results

### School Details

Displays: - School name - Division - State - Athletics website -
Softball contacts - Coach name - Title - Email - Phone

## Scraper Requirements

-   Standalone Node.js application
-   Visit athletics website
-   Locate softball coaching staff page
-   Extract coach names
-   Extract titles
-   Extract email addresses
-   Extract phone numbers
-   Normalize data
-   Save to PostgreSQL
-   Continue processing if one school fails
-   Log errors without terminating

## Initial Data Source

No manual coach data entry.

Use a seed file containing only: - School name - NCAA division - State -
Athletics website URL

## Search Requirements

-   Search by school name
-   Case insensitive
-   Partial matches
-   Fast database-backed results

## Non-Functional Requirements

-   Responsive UI
-   Search under 250ms
-   Restartable scraper
-   No duplicate contacts
-   Idempotent updates
-   Error logging

## Project Structure

``` text
/frontend
/backend
/scraper
/docs
```

## Development Roadmap

### Milestone 1 - Project Setup

-   Initialize repository
-   Create frontend
-   Create backend
-   Configure PostgreSQL
-   Configure environment variables

### Milestone 2 - Database

-   Create schema
-   Create migrations
-   Verify relationships

### Milestone 3 - Scraper MVP

-   Build scraper
-   Scrape one school
-   Extract contacts
-   Output structured JSON

### Milestone 4 - Database Integration

-   Save scraped data
-   Prevent duplicates
-   Update existing contacts

### Milestone 5 - Bulk Scraping

-   Read school seed list
-   Iterate through schools
-   Populate database

### Milestone 6 - Backend API

-   School search endpoint
-   School details endpoint
-   Contacts endpoint

### Milestone 7 - Frontend

-   Search interface
-   Results page
-   School details page
-   Contact display

## Success Criteria

A user can:

1.  Search for a college.
2.  Open the school page.
3.  View publicly available softball recruiting contact information
    without visiting the school's athletics website.
