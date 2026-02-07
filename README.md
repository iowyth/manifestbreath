# Manifest Breath - Portfolio Site

A horizontal-scrolling portfolio site for iowyth hezel ulthiin.

**Live site:** https://iowyth.github.io/manifestbreath/

---

## Quick Start: Updating Content

### Update Your Bio (About Section)
1. Open `index.html`
2. Find the `ABOUT SECTION` comment
3. Edit the text inside the `<p>` tags
4. Delete the pink placeholder note when done

### Add a Publication
1. Open `index.html`
2. Find `<!-- ADD MORE PUBLICATIONS HERE -->`
3. Copy this template and paste above that comment:

```html
<article class="publication-card">
    <span class="publication-year">2024</span>
    <h3 class="publication-title">Your Title</h3>
    <p class="publication-venue">Journal or Conference Name</p>
    <p class="publication-abstract">Brief description.</p>
    <a href="https://link-to-paper.com" class="publication-link">Read →</a>
</article>
```

### Add Portfolio Works (Easy Way - works.json)

The portfolio loads automatically from `works.json`. Just edit that file:

```json
[
    {
        "id": "my-photo",
        "type": "image",
        "src": "images/my-photo.jpg",
        "title": "Photo Title"
    },
    {
        "id": "my-video",
        "type": "vimeo",
        "vimeoId": "123456789",
        "title": "Video Title"
    }
]
```

**For images:**
1. Add image to `images/` folder
2. Add entry to `works.json` with `"type": "image"`
3. Create `works/my-photo.html` (copy from `works/work-01.html`)

**For Vimeo videos:**
1. Get your Vimeo video ID (the number in `vimeo.com/123456789`)
2. Add entry to `works.json` with `"type": "vimeo"` and `"vimeoId"`
3. Create `works/my-video.html` (copy from `works/vimeo-template.html`)
4. Thumbnail is fetched automatically from Vimeo

### Add Portfolio Works (Manual Way)

If you prefer editing HTML directly:

1. Add your image to the `images/` folder (e.g., `images/my-work.jpg`)
2. Copy `works/work-01.html` to a new file (e.g., `works/my-work.html`)
3. In the new file, update the image path:
   ```html
   <img src="../images/my-work.jpg" alt="Work title" class="work-media">
   ```
4. In `index.html`, find `<!-- ADD MORE WORKS HERE -->` and add:
   ```html
   <a href="works/my-work.html" class="gallery-item">
       <div class="gallery-thumb" style="background-image: url('images/my-work.jpg'); background-size: cover;"></div>
   </a>
   ```

Note: If `works.json` exists, it will override the HTML gallery.

### Update Contact Info
1. Open `index.html`
2. Find the `CONTACT SECTION` comment
3. Update the `mailto:` link with your email
4. Update social media URLs

---

## Customizing Colors

Open `css/style.css` and look at the top. All colors are defined as variables:

```css
--lime: #a4e542;        /* Accent color, buttons, active states */
--water-deep: #1a3a4a;  /* Sidebar, hero background */
--off-white: #faf9f7;   /* Main background */
```

Change any hex code to update colors site-wide.

### Quick Color Swaps

**Make it more blue:**
```css
--lime: #42a5e5;
--lime-light: #76c5f0;
--lime-dark: #3282b8;
```

**Make it more pink:**
```css
--lime: #e542a5;
--lime-light: #f076c5;
--lime-dark: #b832a0;
```

---

## File Structure

```
manifestbreath/
├── index.html          ← Main page (edit content here)
├── works.json          ← Portfolio items (easiest way to update)
├── css/
│   └── style.css       ← Styles (edit colors at top)
├── js/
│   └── main.js         ← Scroll + portfolio loading
├── images/             ← Put your images here
│   └── (your images)
└── works/              ← Individual portfolio pages
    ├── work-01.html    ← Template for images
    ├── vimeo-template.html  ← Template for Vimeo videos
    └── (more works)
```

---

## Deploying Changes

After editing files locally:

```bash
git add .
git commit -m "Update content"
git push
```

Changes appear on the live site within a few minutes.

---

## Changing Fonts

1. Go to [Google Fonts](https://fonts.google.com/)
2. Choose your fonts
3. Copy the `<link>` tag
4. Replace the font link in `index.html` (around line 14-16)
5. Update `css/style.css` at the top:
   ```css
   --font-display: 'Your Display Font', serif;
   --font-body: 'Your Body Font', sans-serif;
   ```
