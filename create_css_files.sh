#!/bin/bash

# Script to create CSS files for all pages

# Array of page names
pages=("cart" "checkout" "blog" "account" "product")

# Create CSS files for each page
for page in "${pages[@]}"; do
  cat > "css/${page}.css" << EOF
/* 
 * Fungushead - ${page^} Page Styles
 * This file contains styles specific to the ${page} page
 */

/* Import the template styles */
@import 'page-specific/template.css';

/* ===== ${page^} Page Specific Styles ===== */
/* Add page-specific styles here */
EOF

  echo "Created css/${page}.css"
done

echo "All CSS files created successfully!" 