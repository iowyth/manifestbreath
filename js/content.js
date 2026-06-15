/**
 * CONTENT CONFIGURATION (GRID STRUCTURE)
 * ======================================
 *
 * Content is organized in a 2D grid:
 *   Columns: papers (0), books (1), iowyth/home (2), videos (3), coding (4)
 *   Rows: Row 0 is the title/intro page of that column, followed by item rows.
 */

// Intro page (Column 2, Row 0 - Central Landing Page)
const intro = {
    type: 'intro',
    title: 'iowyth hezel ulthiin',
    content: '<p>scholar · artist</p><p>weaver of worlds</p>'
};

// Filter papers vs books
const papersList = publications.filter(p => p.category === 'paper');
const booksList = publications.filter(p => p.category === 'book');

// Text/About page
const aboutPage = texts.find(t => t.title === 'About') || {
    type: 'text',
    title: 'About',
    content: '<p>I am a performance artist and PhD student whose practice moves between dance, voice, illustration, and writing—examining participatory culture through a métis-crip-queer lens.</p><p>My work focuses on building horizontal power relations through community-based praxis, integrating creative expression with social justice and the utopic visioning of radical social alternatives.</p>'
};

// Connect page (Contact Page inside card)
const connectPage = {
    type: 'contact',
    title: 'Connect',
    emailUser: 'iowyth.ulthiin',
    emailDomain: 'gmail.com',
    substackUrl: 'https://iowyth.substack.com'
};

// The structured Grid
const grid = [
    {
        id: 'papers',
        title: 'papers',
        items: [
            { type: 'column-title', title: 'papers' },
            ...papersList
        ]
    },
    {
        id: 'books',
        title: 'books',
        items: [
            { type: 'column-title', title: 'books' },
            ...booksList
        ]
    },
    {
        id: 'iowyth',
        title: 'iowyth',
        items: [
            intro,
            aboutPage,
            connectPage
        ]
    },
    {
        id: 'videos',
        title: 'videos',
        items: [
            { type: 'column-title', title: 'videos' },
            ...media
        ]
    },
    {
        id: 'coding',
        title: 'coding',
        items: [
            { type: 'column-title', title: 'coding' },
            ...interactive
        ]
    }
];
