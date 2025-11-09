const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to get all student IDs from D1 database using wrangler
async function getStudentIdsFromD1() {
  try {
    console.log('Fetching student IDs from D1 database...');
    
    // Execute wrangler command to get all student IDs
    const command = 'npx wrangler d1 execute reformcuet --remote --command="SELECT studentid FROM students ORDER BY studentid"';
    const output = execSync(command, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
    
    // Parse the output - wrangler returns results in a specific format
    // Extract student IDs from the output
    const lines = output.split('\n');
    const studentIds = [];
    let inResultsSection = false;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Look for the results section
      if (trimmed.includes('studentid') || trimmed.includes('───')) {
        inResultsSection = true;
        continue;
      }
      
      // Skip empty lines and section markers
      if (!trimmed || trimmed.startsWith('─') || trimmed.startsWith('│')) {
        continue;
      }
      
      // Extract student ID (7 digits)
      if (inResultsSection && /^\d{7}$/.test(trimmed)) {
        studentIds.push(trimmed);
      }
    }
    
    console.log(`Found ${studentIds.length} student IDs from D1 database`);
    return studentIds;
  } catch (error) {
    console.error('Error fetching from D1:', error.message);
    console.log('Falling back to CSV file...');
    return getStudentIdsFromCSV();
  }
}

// Fallback: Read from CSV file
function getStudentIdsFromCSV() {
  const csvFilePath = path.join(__dirname, 'public', 'cuet.csv');
  
  if (!fs.existsSync(csvFilePath)) {
    console.error('CSV file not found!');
    return [];
  }
  
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const lines = csvContent.split('\n');
  const studentIds = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const values = parseCSVLine(line);
      if (values.length >= 2 && values[1]) {
        const studentId = values[1].trim();
        if (studentId && studentId !== 'studentid' && /^\d{7}$/.test(studentId)) {
          studentIds.push(studentId);
        }
      }
    }
  }
  
  console.log(`Found ${studentIds.length} student IDs from CSV file`);
  return studentIds;
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
  
  result.push(current);
  return result;
}

// Generate sitemap XML for a chunk of student IDs
function generateSitemapXML(studentIds, baseUrl = 'https://cuet.sayed.app', includeStaticPages = false) {
  const lastmod = new Date().toISOString().split('T')[0];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add static pages only in the first sitemap
  if (includeStaticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>1.0</priority>\n`;
    xml += `  </url>\n`;
    
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/batch</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
    
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/search</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
    
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/privacy</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.5</priority>\n`;
    xml += `  </url>\n`;
  }
  
  // Add student profile pages
  studentIds.forEach(studentId => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/${studentId}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
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
    xml += `  <sitemap>\n`;
    xml += `    <loc>${baseUrl}/sitemap_${i}.xml</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    xml += `  </sitemap>\n`;
  }
  
  xml += '</sitemapindex>';
  return xml;
}

// Main function
async function generateSitemaps() {
  console.log('🚀 Starting sitemap generation...\n');
  
  const publicDir = path.join(__dirname, 'public');
  
  // Get student IDs from D1 database
  const studentIds = await getStudentIdsFromD1();
  
  if (studentIds.length === 0) {
    console.error('❌ No student IDs found!');
    return;
  }
  
  console.log(`📊 Total students: ${studentIds.length}`);
  
  // Sort student IDs for better organization
  studentIds.sort();
  
  // Split student IDs into chunks for multiple sitemap files (max 50,000 URLs per sitemap)
  const studentsPerSitemap = 2000;
  const chunks = [];
  
  for (let i = 0; i < studentIds.length; i += studentsPerSitemap) {
    chunks.push(studentIds.slice(i, i + studentsPerSitemap));
  }
  
  console.log(`📄 Creating ${chunks.length} sitemap files...\n`);
  
  // Generate sitemap files
  chunks.forEach((chunk, index) => {
    const sitemapNumber = index + 1;
    const includeStaticPages = (index === 0); // Include static pages only in the first sitemap
    const sitemapXML = generateSitemapXML(chunk, 'https://cuet.sayed.app', includeStaticPages);
    const filePath = path.join(publicDir, `sitemap_${sitemapNumber}.xml`);
    
    fs.writeFileSync(filePath, sitemapXML);
    console.log(`✅ Generated sitemap_${sitemapNumber}.xml with ${chunk.length} student URLs${includeStaticPages ? ' + 4 static pages' : ''}`);
  });
  
  // Generate sitemap index
  const sitemapIndexXML = generateSitemapIndex(chunks.length);
  const indexPath = path.join(publicDir, 'sitemap_index.xml');
  
  fs.writeFileSync(indexPath, sitemapIndexXML);
  console.log(`\n✅ Generated sitemap_index.xml with ${chunks.length} sitemaps`);
  
  // Also create a main sitemap.xml that points to the index
  const mainSitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://cuet.sayed.app/sitemap_index.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemapXML);
  console.log('✅ Generated main sitemap.xml\n');
  
  console.log('🎉 Sitemap generation completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Total students: ${studentIds.length}`);
  console.log(`   - Sitemap files: ${chunks.length}`);
  console.log(`   - URLs per sitemap: ~${studentsPerSitemap}`);
  console.log(`   - Static pages: 4 (home, batch, search, privacy)`);
}

// Run the script
generateSitemaps().catch(console.error);
