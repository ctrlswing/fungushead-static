#!/bin/bash

# Script to update all HTML pages to use consistent header and footer includes
# Use this whenever you add new pages to ensure they use the same include system

# Change to the script directory
cd "$(dirname "$0")"

update_page() {
  local file=$1
  local is_root=$2
  local updated=false
  
  echo "Processing $file..."
  
  # Add includes.js script if not present
  if ! grep -q "includes.js" "$file"; then
    echo "  Adding includes.js script"
    if [ "$is_root" = true ]; then
      sed -i '' 's|<link rel="icon" type="image/png" href="images/logos/fungushead-favicon-coral.png">|<link rel="icon" type="image/png" href="images/logos/fungushead-favicon-coral.png">\n    <script src="js/includes.js" defer></script>|' "$file"
    else
      sed -i '' 's|<link rel="icon" type="image/png" href="../images/logos/fungushead-favicon-coral.png">|<link rel="icon" type="image/png" href="../images/logos/fungushead-favicon-coral.png">\n    <script src="../js/includes.js" defer></script>|' "$file"
    fi
    updated=true
  fi
  
  # Update header if needed
  if ! grep -q "header-include" "$file"; then
    echo "  Adding header include"
    sed -i '' '/<header id="site-header">/,/<\/header>/c\
    <!-- Header will be inserted here -->\
    <div id="header-include"></div>' "$file"
    updated=true
  fi
  
  # Update footer if needed
  if ! grep -q "footer-include" "$file"; then
    echo "  Adding footer include"
    sed -i '' 's|</body>|    <!-- Footer Include -->\n    <div id="footer-include"></div>\n\n</body>|' "$file"
    updated=true
  fi
  
  # Remove manual footer loading script if it exists
  if grep -q "fetch.*footer.*html" "$file"; then
    echo "  Removing manual footer loading script"
    sed -i '' '/fetch.*footer.*html/,/});/d' "$file"
    updated=true
  fi
  
  if [ "$updated" = true ]; then
    echo "  Updated $file"
  else
    echo "  No changes needed for $file"
  fi
}

# Update root index.html
echo "Updating root index.html..."
update_page "index.html" true

# Update all HTML files in the pages directory
echo "Updating pages in pages directory..."
for file in pages/*.html; do
  update_page "$file" false
done

# Look for HTML files in subdirectories
echo "Looking for HTML files in subdirectories..."
find pages -name "*.html" -not -path "pages/includes/*" | while read file; do
  if [[ "$file" != "pages/"* ]]; then
    update_page "$file" false
  fi
done

echo "All pages updated successfully!" 