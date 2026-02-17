/**
 * CONTENT CONFIGURATION
 * =====================
 * Add your content here. Each item will appear as a card.
 * The intro page always shows first; other pages are shuffled.
 *
 * CONTENT TYPES:
 *
 * 1. intro - Title screen (always first)
 *    { type: 'intro', title: 'Your Name', content: '<p>Tagline</p>' }
 *
 * 2. publication - Academic work, articles, books
 *    { type: 'publication', title: 'Title', venue: 'Journal Name', year: '2024', description: 'About...', link: 'https://...' }
 *
 * 3. text - General text content
 *    { type: 'text', title: 'Title', content: '<p>Your HTML content here</p>' }
 *
 * 4. image - Single image with caption
 *    { type: 'image', title: 'Title', src: 'images/photo.jpg', caption: 'Optional caption' }
 *
 * 5. video - Embedded video (YouTube, Vimeo)
 *    { type: 'video', title: 'Title', embedUrl: 'https://www.youtube.com/embed/VIDEO_ID', description: 'Optional description' }
 *
 * 6. code - Coding project
 *    { type: 'code', title: 'Project Name', tech: ['JavaScript', 'Three.js'], description: 'About...', repo: 'https://github.com/...' }
 */

const pages = [

    // ═══════════════════════════════════════════════════════════════
    // INTRO (always shows first)
    // ═══════════════════════════════════════════════════════════════
    {
        type: 'intro',
        title: 'iowyth hezel ulthiin',
        content: '<p>scholar · artist</p><p>weaver of worlds</p>'
    },

    // ═══════════════════════════════════════════════════════════════
    // PUBLICATIONS
    // ═══════════════════════════════════════════════════════════════
    {
        type: 'publication',
        title: 'The Phenomenology of Dissensus',
        venue: 'Review of Education, Pedagogy, and Cultural Studies',
        year: '2024',
        description: 'An exploration of epistemic communities and the phenomenology of belief in alternative cosmologies.',
        link: 'https://www.tandfonline.com/doi/full/10.1080/10714413.2024.2427894'
    },
    {
        type: 'publication',
        title: 'Before and After Gravity',
        venue: 'Canadian Journal of Theology, Mental Health and Disability',
        year: '2024',
        description: 'A series of intimate drawings exploring the sublime as a site of queer spiritual connection.',
        link: 'https://jps.library.utoronto.ca/index.php/cjtmhd/article/view/44515'
    },
    {
        type: 'publication',
        title: 'The Witch: A Pedagogy of Immanence',
        venue: 'Dio Press (Monograph)',
        year: '2023',
        description: 'A journey through trauma to resilience, seeking seeds of an Indigenous way of being within settler culture.',
        link: 'https://www.diopress.com/the-witch'
    },
    {
        type: 'publication',
        title: 'The Capitol Riots',
        venue: 'Routledge (Co-edited)',
        year: '2022',
        description: 'Digital Media, Disinformation, and Democracy Under Attack.',
        link: 'https://www.routledge.com/The-Capitol-Riots-Digital-Media-Disinformation-and-Democracy-Under-Attack/Jeppesen-Hoechsmann-ulthiin-VanDyke-McKee/p/book/9781032246864'
    },
    {
        type: 'publication',
        title: 'Body as Prism',
        venue: 'Canadian Journal of Environmental Education',
        year: '2020',
        description: 'Somatic pedagogy in the development of embodied ecological awareness.',
        link: 'https://cjee.lakeheadu.ca/article/view/1655'
    },

    // ═══════════════════════════════════════════════════════════════
    // ABOUT / TEXT PAGES
    // ═══════════════════════════════════════════════════════════════
    {
        type: 'text',
        title: 'About',
        content: '<p>I am a performance artist and PhD student whose practice moves between dance, voice, illustration, and writing—examining participatory culture through a métis-crip-queer lens.</p><p>My work focuses on building horizontal power relations through community-based praxis, integrating creative expression with social justice and the utopic visioning of radical social alternatives.</p>'
    },

    // ═══════════════════════════════════════════════════════════════
    // IMAGES - Uncomment and edit to add
    // ═══════════════════════════════════════════════════════════════
    // {
    //     type: 'image',
    //     title: 'Artwork Title',
    //     src: 'images/artwork.jpg',
    //     caption: 'Medium, Year'
    // },

    // ═══════════════════════════════════════════════════════════════
    // VIDEOS
    // ═══════════════════════════════════════════════════════════════
    {
        type: 'video',
        title: 'Waves',
        embedUrl: 'https://player.vimeo.com/video/187204270',
        description: ''
    },

    // ═══════════════════════════════════════════════════════════════
    // CODE PROJECTS - Uncomment and edit to add
    // ═══════════════════════════════════════════════════════════════
    // {
    //     type: 'code',
    //     title: 'Project Name',
    //     tech: ['JavaScript', 'Three.js', 'CSS'],
    //     description: 'A brief description of what this project does.',
    //     repo: 'https://github.com/username/repo'
    // },

];
