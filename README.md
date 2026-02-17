# Manifest Breath

A portfolio site with 3D eyeball navigation.

**Live site:** https://iowyth.github.io/manifestbreath/

---

## Quick Start: Updating Content

All content is managed in one file: **`js/content.js`**

### Add a Publication

```javascript
{
    type: 'publication',
    title: 'Your Title',
    venue: 'Journal or Publisher Name',
    year: '2024',
    description: 'Brief description of the work.',
    link: 'https://link-to-paper.com'
},
```

### Add an Image

1. Put your image in the `images/` folder
2. Add to `content.js`:

```javascript
{
    type: 'image',
    title: 'Artwork Title',
    src: 'images/your-image.jpg',
    caption: 'Medium, Year'
},
```

### Add a Video

```javascript
{
    type: 'video',
    title: 'Video Title',
    embedUrl: 'https://player.vimeo.com/video/123456789',
    description: 'Description of the video.'
},
```

For YouTube, use: `https://www.youtube.com/embed/VIDEO_ID`

### Add a Code Project

```javascript
{
    type: 'code',
    title: 'Project Name',
    tech: ['JavaScript', 'Three.js', 'CSS'],
    description: 'What the project does.',
    repo: 'https://github.com/username/repo'
},
```

### Add General Text

```javascript
{
    type: 'text',
    title: 'Page Title',
    content: '<p>Your HTML content here.</p><p>Multiple paragraphs work.</p>'
},
```

---

## File Structure

```
manifestbreath/
├── index.html          # Main page (rarely edit)
├── css/
│   └── style.css       # Styles
├── js/
│   ├── main.js         # App logic (rarely edit)
│   └── content.js      # ALL CONTENT - edit this file
└── images/             # Put images here
```

---

## Deploying Changes

```bash
git add .
git commit -m "Update content"
git push
```

Changes appear on the live site within a few minutes.
