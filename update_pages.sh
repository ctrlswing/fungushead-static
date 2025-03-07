#!/bin/bash

# Script to update all HTML pages with the new branding

# Update favicon and logo in all HTML files in the pages directory
for file in pages/*.html; do
  # Add favicon if not present
  if ! grep -q "fungushead-favicon-coral.png" "$file"; then
    sed -i '' 's|<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">|<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">\n    <link rel="icon" type="image/png" href="../images/logos/fungushead-favicon-coral.png">|' "$file"
  fi
  
  # Update header logo
  sed -i '' 's|<img src="../images/logos/fungushead-logo.png" alt="Fungushead Logo">|<img src="../images/logos/fungushead-logo-long-black.png" alt="Fungushead Logo">|' "$file"
  
  # Add footer logo if not present
  sed -i '' 's|<div class="footer-column">|<div class="footer-column">\n                    <div class="footer-logo">\n                        <img src="../images/logos/fungushead-logo-long-white.png" alt="Fungushead Logo" width="200">\n                    </div>|' "$file"
done

echo "All pages updated successfully!" 