# Web Scraping Project: thegioididong.com Product Data Extraction

## Overview

This project aims to scrape product data from the website [thegioididong.com](https://www.thegioididong.com/), a popular electronics retailer in Vietnam. The script uses Puppeteer, a Node.js library, to automate the process of navigating through the website, handling pagination, and extracting product information. The extracted data is then formatted into a JSON array containing the product name, original price, sale price, and discount rate.

## Features

- **Automated Navigation**: The script automatically navigates through the product listing pages, handling the "Load More" button to load additional products.
- **Data Extraction**: Extracts detailed product information including name, original price, sale price, and discount rate.
- **JSON Output**: Converts the extracted data into a JSON array for easy consumption and further processing.
