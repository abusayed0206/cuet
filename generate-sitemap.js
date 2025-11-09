const fs = require('fs');
const path = require('path');

// Read and parse the CSV file
function parseCSV(filePath) {
  const csvContent = fs.readFileSync(filePath, 'utf-8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  const students = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      // Handle CSV parsing with potential commas in quoted fields
      const values = parseCSVLine(line);
      if (values.length >= 2 && values[1]) { // Make sure studentid exists
        const studentId = values[1].trim();
        if (studentId && studentId !== 'studentid') { // Skip header and empty IDs
          students.push({
            name: values[0] ? values[0].replace(/"/g, '') : '',
            studentid: studentId,
            department: values[2] || '',
            batch: values[5] || '',
            session: values[6] || ''
          });
        }
      }
    }
  }
  
  return students;
}

// Simple CSV line parser that handles quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // Add the last field
  return result;
}

// Generate sitemap XML
function generateSitemapXML(students, baseUrl = 'https://cuet.sayed.app') {
  const lastmod = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add main pages
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;
  
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/batch</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
  
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/search</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
  
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/halls</loc>\n`;
  xml += `    <lastmod>${lastmod}</lastmod>\n`;
  xml += `    <priority>0.7</priority>\n`;
  xml += `  </url>\n`;
  
  // Add student profile pages
  students.forEach(student => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${student.studentid}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <priority>0.6</priority>\n`;
    xml += `  </url>\n`;
  });
  
  xml += '</urlset>';
  return xml;
}

// Generate sitemap index XML
function generateSitemapIndex(numberOfSitemaps, baseUrl = 'https://cuet.sayed.app') {
  const lastmod = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (let i = 1; i <= numberOfSitemaps; i++) {
    xml += `    <sitemap>\n`;
    xml += `        <loc>${baseUrl}/sitemap_${i}.xml</loc>\n`;
    xml += `        <lastmod>${lastmod}</lastmod>\n`;
    xml += `    </sitemap>\n`;
  }
  
  xml += '</sitemapindex>';
  return xml;
}

// Main function
function generateSitemaps() {
  const csvFilePath = path.join(__dirname, 'public', 'cuet.csv');
  const publicDir = path.join(__dirname, 'public');
  
  console.log('Reading CSV file...');
  const students = parseCSV(csvFilePath);
  console.log(`Found ${students.length} students`);
  
  // Sort students by studentid for better organization
  students.sort((a, b) => a.studentid.localeCompare(b.studentid));
  
  // Split students into chunks for multiple sitemap files
  const studentsPerSitemap = 2000;
  const chunks = [];
  
  for (let i = 0; i < students.length; i += studentsPerSitemap) {
    chunks.push(students.slice(i, i + studentsPerSitemap));
  }
  
  console.log(`Creating ${chunks.length} sitemap files...`);
  
  // Generate sitemap files
  chunks.forEach((chunk, index) => {
    const sitemapNumber = index + 1;
    const sitemapXML = generateSitemapXML(chunk);
    const filePath = path.join(publicDir, `sitemap_${sitemapNumber}.xml`);
    
    fs.writeFileSync(filePath, sitemapXML);
    console.log(`Generated sitemap_${sitemapNumber}.xml with ${chunk.length} URLs`);
  });
  
  // Generate sitemap index
  const sitemapIndexXML = generateSitemapIndex(chunks.length);
  const indexPath = path.join(publicDir, 'sitemap_index.xml');
  
  fs.writeFileSync(indexPath, sitemapIndexXML);
  console.log(`Generated sitemap_index.xml with ${chunks.length} sitemaps`);
  
  // Also create a main sitemap.xml that points to the index
  const mainSitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>https://cuet.sayed.app/sitemap_index.xml</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    </sitemap>
</sitemapindex>`;
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemapXML);
  console.log('Generated main sitemap.xml');
  
  console.log('\\n✅ Sitemap generation completed!');
  console.log(`📊 Total students: ${students.length}`);
  console.log(`📄 Sitemap files: ${chunks.length}`);
  console.log(`🔗 URLs per sitemap: ~${studentsPerSitemap}`);
}

// Run the script
generateSitemaps();
