/**
 * CONTENT CONFIGURATION
 * =====================
 *
 * Content is organized in separate files for easy editing:
 *   js/content/publications.js  - Academic work
 *   js/content/texts.js         - About, poems, essays
 *   js/content/media.js         - Videos and images
 *   js/content/interactive.js   - Embedded visualizations
 *
 * The intro page is defined here (always shows first).
 * All other content is shuffled randomly.
 */

// Intro page (always first)
const intro = {
    type: 'intro',
    title: 'iowyth hezel ulthiin',
    content: '<p>scholar · artist</p><p>weaver of worlds</p>'
};

// Combine all content
// Each array is defined in its own file (loaded before this one)
const pages = [
    intro,
    ...publications,
    ...texts,
    ...media,
    ...interactive,
];
