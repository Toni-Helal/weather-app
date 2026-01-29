# Weather App

A clean weather dashboard built with Next.js and the Open-Meteo API.

The application automatically switches between **Metric** and **Imperial** units every 10 seconds, with a single source of truth for all weather data.

## Features

- Real-time weather data (Open-Meteo)
- Metric / Imperial auto-switch (no user interaction)
- Temperature, wind, humidity, visibility
- Sunrise and sunset times
- Defensive rendering (no NaN / Invalid Date)
- Clean component architecture

## Technical Architecture

- API returns **metric data only**
- All unit conversions handled in the UI
- Single `unitSystem` state
- Stateless UI components
- No duplicated logic

## Tech Stack

- Next.js
- React
- Open-Meteo API
- CSS Modules

## Getting Started

```bash
npm install
npm run dev
