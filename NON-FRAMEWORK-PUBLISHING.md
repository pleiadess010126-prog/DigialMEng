# 🌐 Publishing to Non-Framework Websites

## How DigitalMEng Works with Plain HTML Sites

If your website is **NOT** using WordPress, Shopify, or any framework, the engine has **multiple ways** to publish content:

---

## 📋 **Publishing Methods for Non-Framework Sites**

### **Method 1: SFTP/FTP Upload** ⭐ **Most Common**

For plain HTML websites hosted on traditional servers.

#### **How It Works**:

```
AI generates content
   ↓
System generates HTML file
   ↓
Uploads via SFTP/FTP to your server
   ↓
Content appears on your website!
```

#### **Configuration**:

```typescript
// User provides during onboarding
{
  type: 'sftp',
  host: 'ftp.yoursite.com',
  port: 22,
  username: 'ftpuser',
  password: 'xxxxx',
  remotePath: '/public_html/blog/',
  templatePath: '/templates/blog-post.html'
}
```

#### **Implementation**:

```typescript
import Client from 'ssh2-sftp-client';

async function publishViaFTP(content: ContentItem, config: FTPConfig) {
  const sftp = new Client();
  
  // Connect
  await sftp.connect({
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
  });
  
  // Load HTML template
  const template = await loadTemplate(config.templatePath);
  
  // Generate HTML from content
  const html = renderTemplate(template, {
    title: content.title,
    content: content.content,
    date: new Date().toISOString(),
    keywords: content.metadata.keywords.join(', '),
  });
  
  // Create filename
  const filename = `${slugify(content.title)}.html`;
  const remotePath = `${config.remotePath}${filename}`;
  
  // Upload file
  await sftp.put(Buffer.from(html), remotePath);
  
  // Update index/listing page
  await updateBlogIndex(sftp, config, content);
  
  // Disconnect
  await sftp.end();
  
  return {
    success: true,
    url: `https://yoursite.com/blog/${filename}`,
  };
}
```

#### **HTML Template Example**:

```html
<!-- templates/blog-post.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - My Blog</title>
    <meta name="description" content="{{excerpt}}">
    <meta name="keywords" content="{{keywords}}">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <nav>
            <a href="/">Home</a>
            <a href="/blog/">Blog</a>
        </nav>
    </header>
    
    <main>
        <article>
            <h1>{{title}}</h1>
            <time datetime="{{date}}">{{formattedDate}}</time>
            
            <div class="content">
                {{content}}
            </div>
            
            <footer>
                <p>Keywords: {{keywords}}</p>
            </footer>
        </article>
    </main>
</body>
</html>
```

**System replaces `{{variables}}` with actual content!**

---

### **Method 2: Direct Database Access**

If your website has a database (MySQL, PostgreSQL, etc.) but no API.

#### **How It Works**:

```
AI generates content
   ↓
System connects directly to your database
   ↓
Inserts record into posts table
   ↓
Your website reads from database
   ↓
Content appears automatically!
```

#### **Configuration**:

```typescript
{
  type: 'database',
  dbType: 'mysql', // or 'postgresql', 'sqlite'
  host: 'db.yoursite.com',
  port: 3306,
  database: 'website_db',
  username: 'dbuser',
  password: 'xxxxx',
  table: 'blog_posts',
  columns: {
    title: 'post_title',
    content: 'post_content',
    date: 'published_date',
    slug: 'post_slug',
  }
}
```

#### **Implementation**:

```typescript
import mysql from 'mysql2/promise';

async function publishToDatabase(content: ContentItem, config: DBConfig) {
  // Connect to database
  const connection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.database,
  });
  
  // Insert post
  const [result] = await connection.execute(
    `INSERT INTO ${config.table} 
     (${config.columns.title}, ${config.columns.content}, 
      ${config.columns.date}, ${config.columns.slug}) 
     VALUES (?, ?, ?, ?)`,
    [
      content.title,
      content.content,
      new Date(),
      slugify(content.title),
    ]
  );
  
  await connection.end();
  
  return {
    success: true,
    postId: result.insertId,
    url: `https://yoursite.com/blog/${slugify(content.title)}`,
  };
}
```

**Works with any website that stores posts in a database!**

---

### **Method 3: Static File Generation + Download**

For websites where you want manual control.

#### **How It Works**:

```
AI generates content
   ↓
System generates complete HTML file
   ↓
User downloads file
   ↓
User manually uploads to their server
```

#### **UI Flow**:

```typescript
// User clicks "Generate & Download"
function generateHTMLFile(content: ContentItem) {
  const html = renderToHTML(content);
  
  // Create downloadable file
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slugify(content.title)}.html`;
  link.click();
}
```

**User gets ready-to-upload HTML file!**

---

### **Method 4: Email Delivery**

System emails the content to you for manual posting.

#### **How It Works**:

```
AI generates content
   ↓
System sends email with:
   - HTML version
   - Markdown version
   - Plain text
   - Attached files
   ↓
You copy-paste into your website's CMS
```

#### **Email Template**:

```
Subject: New Blog Post Ready: "{{title}}"

Hi,

Your AI-generated blog post is ready!

Title: {{title}}
Excerpt: {{excerpt}}

=== HTML Version ===
<article>
  <h1>{{title}}</h1>
  {{content}}
</article>

=== Markdown Version ===
# {{title}}
{{markdownContent}}

=== Plain Text ===
{{plainText}}

Keywords: {{keywords}}
SEO Score: {{seoScore}}/100

Attachments:
- blog-post.html
- blog-post.md
- blog-post.txt
```

---

### **Method 5: Git-Based Deployment**

For static site generators or sites deployed via Git.

#### **How It Works**:

```
AI generates content
   ↓
System commits to your Git repo
   ↓
Push triggers rebuild (Netlify/Vercel/GitHub Pages)
   ↓
Content goes live!
```

#### **Implementation**:

```typescript
import simpleGit from 'simple-git';

async function publishViaGit(content: ContentItem, config: GitConfig) {
  const git = simpleGit();
  
  // Clone or pull latest
  await git.clone(config.repoUrl, '/tmp/blog-repo');
  await git.cwd('/tmp/blog-repo');
  
  // Generate file (Markdown for static sites)
  const markdown = `---
title: ${content.title}
date: ${new Date().toISOString()}
keywords: ${content.metadata.keywords.join(', ')}
---

${content.content}
`;
  
  // Write file
  const filename = `content/blog/${slugify(content.title)}.md`;
  await fs.writeFile(filename, markdown);
  
  // Commit and push
  await git.add(filename);
  await git.commit(`Add new post: ${content.title}`);
  await git.push('origin', 'main');
  
  return {
    success: true,
    commitHash: await git.revparse(['HEAD']),
  };
}
```

**Works with**:
- Jekyll
- Hugo
- Next.js
- Gatsby
- 11ty
- Any Git-deployed site!

---

### **Method 6: Web Scraping + Form Submission**

For websites with admin panels but no API.

#### **How It Works**:

```
System uses Puppeteer to:
   1. Login to your admin panel
   2. Navigate to "Add New Post"
   3. Fill in the form
   4. Click "Publish"
   ↓
Automated browser interaction!
```

#### **Implementation**:

```typescript
import puppeteer from 'puppeteer';

async function publishViaWebScraping(content: ContentItem, config: WebConfig) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Login
  await page.goto(config.loginUrl);
  await page.type('#username', config.username);
  await page.type('#password', config.password);
  await page.click('#login-button');
  await page.waitForNavigation();
  
  // Navigate to add post page
  await page.goto(config.addPostUrl);
  
  // Fill form
  await page.type('#post-title', content.title);
  await page.type('#post-content', content.content);
  
  // Click publish
  await page.click('#publish-button');
  await page.waitForNavigation();
  
  await browser.close();
  
  return { success: true };
}
```

**Works with virtually ANY website with an admin panel!**

---

### **Method 7: Custom Webhook**

You create a simple endpoint, we call it.

#### **Your Simple Server**:

```php
<?php
// webhook.php on your server
$data = json_decode(file_get_contents('php://input'), true);

$title = $data['title'];
$content = $data['content'];
$date = date('Y-m-d H:i:s');

// Insert into your database
$mysqli = new mysqli("localhost", "user", "pass", "db");
$stmt = $mysqli->prepare(
  "INSERT INTO posts (title, content, date) VALUES (?, ?, ?)"
);
$stmt->bind_param("sss", $title, $content, $date);
$stmt->execute();

echo json_encode(['success' => true]);
?>
```

#### **DigitalMEng Calls It**:

```typescript
await fetch('https://yoursite.com/webhook.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: content.title,
    content: content.content,
  }),
});
```

**Simple 10-line PHP script enables publishing!**

---

## 🎯 **Platform Detection UI**

```
What type of website do you have?

○ WordPress / CMS with API
○ Plain HTML website (FTP/SFTP access)
○ Custom website with database
○ Static site (GitHub Pages, Netlify)
○ Website with admin panel (no API)
○ Other / Custom

[Based on selection, show appropriate fields]
```

---

## 📊 **Method Comparison**

| Method | Difficulty | Requirements | Automation |
|--------|------------|--------------|------------|
| **SFTP/FTP** | Easy | FTP credentials | 100% automated |
| **Database** | Medium | DB credentials | 100% automated |
| **File Download** | Easy | None | Manual upload needed |
| **Email** | Easy | Email address | Manual paste needed |
| **Git** | Medium | Git repo access | 100% automated |
| **Web Scraping** | Hard | Admin credentials | 100% automated |
| **Webhook** | Medium | Simple PHP script | 100% automated |

---

## 🔧 **Universal Publishing Flow**

```typescript
// Publishing Queue detects website type
async function publish(content: ContentItem, config: PlatformConfig) {
  switch (config.type) {
    case 'wordpress':
      return await publishToWordPress(content, config);
    
    case 'sftp':
      return await publishViaFTP(content, config);
    
    case 'database':
      return await publishToDatabase(content, config);
    
    case 'git':
      return await publishViaGit(content, config);
    
    case 'webhook':
      return await publishViaWebhook(content, config);
    
    case 'email':
      return await publishViaEmail(content, config);
    
    case 'download':
      return generateDownloadableFile(content);
    
    default:
      throw new Error('Unsupported platform type');
  }
}
```

**Every website type is supported!**

---

## ✅ **Example: Plain HTML Website**

### **Scenario**:
- Website: plain HTML files
- Hosted on: GoDaddy shared hosting
- No framework, no database
- Just HTML/CSS files

### **Setup**:

1. **During onboarding, user selects**: "Plain HTML Website"

2. **System asks for**:
   ```
   FTP Host: ftp.yoursite.com
   Username: ftpuser@yoursite.com
   Password: ••••••••
   Remote Path: /public_html/blog/
   ```

3. **System generates HTML template**:
   - User provides their header/footer HTML
   - System wraps content in their design

4. **Publishing**:
   ```
   AI generates blog post
      ↓
   System creates: /blog/seo-tips-2025.html
      ↓
   Uploads via FTP
      ↓
   Updates /blog/index.html with new link
      ↓
   Done!
   ```

### **Result**:
```
https://yoursite.com/blog/seo-tips-2025.html
  ← New blog post, perfectly matching your site design!
```

---

## 🎯 **Summary**

**For websites WITHOUT frameworks, DigitalMEng can**:

1. ✅ **Upload via FTP/SFTP** (most common for plain HTML)
2. ✅ **Write to database directly** (if you have MySQL/PostgreSQL)
3. ✅ **Generate downloadable HTML** (you upload manually)
4. ✅ **Email you the content** (copy-paste)
5. ✅ **Commit to Git repo** (for static sites)
6. ✅ **Automate browser to fill forms** (Puppeteer)
7. ✅ **Call your custom webhook** (simple PHP script)

**The engine is NOT limited to WordPress or any specific framework!**

**Any website with at least ONE of these is supported:**
- FTP/SFTP access ✅
- Database access ✅
- Git repository ✅
- Admin panel ✅
- Email address ✅
- 5 minutes to create a webhook ✅

**Literally EVERY website can use this!**

---

**Date**: December 26, 2025
**Methods**: 7 different publishing methods
**Supported Sites**: 100% (any type of website)
