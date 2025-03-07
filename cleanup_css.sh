#!/bin/bash

# Script to clean up old CSS files after refactoring

# Move normalize.css to the base directory if it's not already there
if [ ! -f "css/base/normalize.css" ]; then
  mkdir -p css/base
  cp css/normalize.css css/base/normalize.css
fi

# List of files to remove
FILES_TO_REMOVE=(
  "css/main.css"
  "css/home.css"
  "css/shop.css"
  "css/cart.css"
  "css/product.css"
  "css/account.css"
  "css/blog.css"
  "css/checkout.css"
  "css/page-specific/template.css"
)

# Remove the files
for file in "${FILES_TO_REMOVE[@]}"; do
  if [ -f "$file" ]; then
    echo "Removing $file"
    rm "$file"
  else
    echo "$file does not exist, skipping"
  fi
done

# Remove empty directories
find css -type d -empty -delete

echo "CSS cleanup complete!" 