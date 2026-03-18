import React, { useMemo, useState, useEffect } from 'react';
import Prism from 'prismjs';

// Modal for entering school name (reusable)
const SchoolNameModal = ({ isOpen, onClose, onSubmit, schoolName, setSchoolName, saving, saveError }: {
  isOpen: boolean,
  onClose: () => void,
  onSubmit: () => void,
  schoolName: string,
  setSchoolName: (v: string) => void,
  saving: boolean,
  saveError: string | null
}) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#23272e', padding: 32, borderRadius: 12, minWidth: 340, boxShadow: '0 4px 24px #0008', color: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ margin: 0 }}>Enter School Name</h2>
        <input
          type="text"
          value={schoolName}
          onChange={e => setSchoolName(e.target.value)}
          placeholder="School Name"
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #444', background: '#1e1e1e', color: '#fff', fontSize: 16 }}
        />
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button onClick={onSubmit} style={{ background: 'linear-gradient(90deg,#6a8dff,#7fbcff)', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 16, cursor: 'pointer' }} disabled={saving}>Submit</button>
          <button onClick={onClose} style={{ background: '#444', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 16, cursor: 'pointer' }} disabled={saving}>Cancel</button>
        </div>
        {saveError && <div style={{ color: 'red', marginTop: 8 }}>{saveError}</div>}
        {saving && <div style={{ color: '#fff', marginTop: 8 }}>Saving...</div>}
      </div>
    </div>
  );
};

import 'prismjs/components/prism-markup'; // HTML highlighting
import 'prismjs/themes/prism-tomorrow.css'; // dark theme similar to VS Code

import { useAuth } from '../context/AuthContext';
import { BackendAPI } from '../../backend/api';
import type { QuestionData } from '../../backend/types';
import { HTMLTagsReference } from './HTMLTagsReference';

interface StudyAreaProps {
  onBack: () => void;
  onSelectQuestion: (questionId: number) => void;
  onViewReferences: () => void;
  onViewTags: () => void;
}

export const StudyArea = ({ onBack, onSelectQuestion, onViewReferences, onViewTags }: StudyAreaProps) => {
  const { user, logout } = useAuth();
  // State for school name modal (must be inside component)
  const [showSchoolModal, setShowSchoolModal] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [savingSchool, setSavingSchool] = useState(false);
  const [saveSchoolError, setSaveSchoolError] = useState<string | null>(null);
  const [pendingTaskId, setPendingTaskId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(() => {
    // Restore selected task from sessionStorage
    const saved = sessionStorage.getItem('studyAreaSelectedTaskId');
    return saved ? parseInt(saved) : null;
  });
  const [showingHtmlQuiz, setShowingHtmlQuiz] = useState(false);
  // sidebar is initially closed on narrow screens; toggled via hamburger
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const tasksRef = React.useRef<HTMLDivElement>(null);
  
  // Load questions from database
  useEffect(() => {
    const loadQuestions = async () => {
      const allQuestions = await BackendAPI.questions.getAll();
      setQuestions(allQuestions);
      setTasksLoaded(true);
    };
    loadQuestions();
  }, []);
  
  // Save selected task ID to sessionStorage
  useEffect(() => {
    if (selectedTaskId !== null) {
      sessionStorage.setItem('studyAreaSelectedTaskId', selectedTaskId.toString());
    } else {
      sessionStorage.removeItem('studyAreaSelectedTaskId');
    }
  }, [selectedTaskId]);
  
  const lessons = useMemo(() => ([
    {
      id: 'intro',
      title: 'HTML Introduction',
      heading: 'What is HTML?',
      difficulty: 'easy',
      bullets: [
        'HTML stands for Hyper Text Markup Language',
        'HTML is the standard markup language for creating Web pages',
        'HTML describes the structure of a Web page',
        'HTML consists of a series of elements',
        'HTML elements tell the browser how to display the content',
        'HTML elements label pieces of content such as "this is a heading", "this is a paragraph", "this is a link", etc.'
      ],
      exampleTitle: 'A Simple HTML Document',
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Title</title>
  </head>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
  </body>
</html>`,
      tips: [
        '💡 HTML is not a programming language - it\'s a markup language that tells browsers how to display content',
        '💡 All modern websites use HTML5, the current standard of HTML',
        '💡 HTML works best when combined with CSS for styling and JavaScript for interactivity'
      ],
      bestPractices: [
        '✓ Always use proper indentation to make your code readable',
        '✓ Use semantic HTML tags that describe the content\'s meaning',
        '✓ Keep your HTML structure clean and organized',
        '✓ Use lowercase for all HTML tags and attributes'
      ],
      commonMistakes: [
        {
          mistake: '❌ Forgetting the <!DOCTYPE html> declaration',
          why: 'The DOCTYPE tells the browser this is an HTML5 document. Without it, the browser may render incorrectly.',
          correct: '✅ Always start with <!DOCTYPE html>'
        },
        {
          mistake: '❌ Not closing tags properly (e.g., <p>Text instead of <p>Text</p>)',
          why: 'Open tags must be closed. Unclosed tags can cause layout issues and invalid HTML.',
          correct: '✅ Always close your tags: <p>Text</p>'
        },
        {
          mistake: '❌ Missing <html>, <head>, or <body> tags',
          why: 'These are essential container tags that structure your document.',
          correct: '✅ Use proper document structure with all main tags'
        }
      ]
    },
    {
      id: 'editors',
      title: 'HTML Editors',
      heading: 'HTML Editors',
      bullets: [
        'HTML files can be created using a simple text editor.',
        'Popular editors: VS Code, Notepad++, Sublime Text',
        'You can also use Windows Notepad or TextEdit (Mac)',
        'Step 1: Open a text editor',
        'Step 2: Write HTML code',
        'Step 3: Save the file with .html extension (e.g., index.html)',
        'Step 4: Open the file in your web browser to view the result'
      ],
      exampleTitle: 'Steps to Create HTML File',
      code: `Step 1: Open your text editor
Step 2: Type your HTML code
Step 3: Save as "index.html"
Step 4: Open index.html in your browser`
    },
    {
      id: 'basic',
      title: 'HTML Basic',
      heading: 'HTML Basic Elements',
      difficulty: 'easy',
      bullets: [
        'HTML headings are defined with <h1> to <h6> tags',
        'HTML paragraphs are defined with the <p> tag',
        'HTML links are defined with the <a> tag',
        'HTML images are defined with the <img> tag',
        'The <br> tag inserts a single line break',
        'The <hr> tag defines a thematic break in an HTML page (horizontal line)'
      ],
      exampleTitle: 'Basic tags example',
      code: `<h1>Main Title</h1>
<h2>Subtitle</h2>
<p>This is a paragraph with some text.</p>
<p>Another paragraph here.</p>
<a href="https://example.com" target="_blank" rel="noopener">Visit Website</a>
<br />
<img src="image.jpg" alt="Description of image" />
<hr />`,
      tips: [
        '💡 Use <h1> for the main page title - each page should have only ONE <h1>',
        '💡 Use <h2>-<h6> for sub-headings to create a proper document structure',
        '💡 Always provide meaningful alt text for images for accessibility',
        '💡 Use rel="noopener" when opening links in new tabs for security'
      ],
      bestPractices: [
        '✓ Use proper heading hierarchy: h1 → h2 → h3 (don\'t skip levels)',
        '✓ Always add alt text to images (it helps screen readers and SEO)',
        '✓ Use meaningful link text - avoid "click here" and use descriptive text',
        '✓ Use semantic HTML elements to give meaning to your content'
      ],
      commonMistakes: [
        {
          mistake: '❌ Using multiple <h1> tags on one page',
          why: 'A page should have one main <h1> for SEO and accessibility. Use <h2>, <h3> for sub-headings.',
          correct: '✅ Use only one <h1> per page, use <h2>-<h6> for sections'
        },
        {
          mistake: '❌ Forgetting alt text on images (<img src="photo.jpg">)',
          why: 'Alt text helps screen readers and shows if image fails to load. Essential for accessibility.',
          correct: '✅ Always add alt text: <img src="photo.jpg" alt="Description">'
        },
        {
          mistake: '❌ Not specifying href in links (<a>Link</a>)',
          why: 'Links need an href attribute to know where to navigate.',
          correct: '✅ Always include href: <a href="url">Link</a>'
        }
      ]
    },
    {
      id: 'elements',
      title: 'HTML Elements',
      heading: 'HTML Elements',
      bullets: [
        'An HTML element is defined by a start tag, some content, and an end tag',
        'The HTML element syntax: <tagname>Content goes here...</tagname>',
        'The start tag is <tagname>',
        'The end tag is </tagname> (note the forward slash)',
        'Some HTML elements have no content (like <br>). These are called empty elements.',
        'Empty elements do not have an end tag',
        'HTML elements can be nested (elements can contain other elements)'
      ],
      exampleTitle: 'Element structure examples',
      code: `<!-- Normal element with content -->
<p>This is a paragraph.</p>

<!-- Self-closing element -->
<img src="photo.jpg" alt="A photo" />
<br />

<!-- Nested elements -->
<div>
  <h2>Heading inside div</h2>
  <p>Paragraph inside div.</p>
</div>`
    },
    {
      id: 'attributes',
      title: 'HTML Attributes',
      heading: 'HTML Attributes',
      bullets: [
        'All HTML elements can have attributes',
        'Attributes provide additional information about elements',
        'Attributes are always specified in the start tag',
        'Attributes usually come in name/value pairs like: name="value"',
        'The href attribute specifies the URL for a link',
        'The src attribute specifies the path to an image',
        'The alt attribute provides alternate text for an image',
        'The class attribute specifies one or more class names for an element',
        'The id attribute specifies a unique id for an element',
        'The style attribute specifies an inline CSS style for an element'
      ],
      exampleTitle: 'Attributes in action',
      code: `<a href="https://example.com" title="Go to Example" class="external-link" target="_blank">Visit</a>

<img src="photo.jpg" alt="Beach sunset" width="300" height="200" />

<p id="intro" class="text-large" style="color: blue;">Welcome!</p>

<input type="text" placeholder="Enter name" required />`
    },
    {
      id: 'headings',
      title: 'HTML Headings',
      heading: 'HTML Headings',
      bullets: [
        'HTML headings are defined with the <h1> to <h6> tags',
        '<h1> defines the most important heading',
        '<h6> defines the least important heading',
        '<h1> headings should be used for main headings',
        '<h2> to <h6> should be used for subheadings',
        'Search engines use headings to index the structure and content of your web pages',
        'Users often skim a page by its headings'
      ],
      exampleTitle: 'Headings hierarchy',
      code: `<h1>Main Page Title</h1>
<h2>Section 1</h2>
<h3>Subsection 1.1</h3>
<h3>Subsection 1.2</h3>
<h2>Section 2</h2>
<h3>Subsection 2.1</h3>
<h4>Detail 2.1.1</h4>
<h4>Detail 2.1.2</h4>`
    },
    {
      id: 'paragraphs',
      title: 'HTML Paragraphs',
      heading: 'HTML Paragraphs',
      bullets: [
        'The HTML <p> element defines a paragraph',
        'A paragraph always starts on a new line',
        'Browsers automatically add some white space before and after a paragraph',
        'The <br> tag defines a line break',
        'Use <br> if you want a line break without starting a new paragraph',
        'HTML will remove extra spaces - multiple spaces count as one space'
      ],
      exampleTitle: 'Paragraph examples',
      code: `<p>This is a paragraph.</p>
<p>This is another paragraph.</p>

<p>
  This paragraph has<br />
  a line break in the middle.
</p>

<p style="color: blue; font-size: 18px;">
  This paragraph has custom styling.
</p>`
    },
    {
      id: 'links',
      title: 'HTML Links',
      heading: 'HTML Links',
      bullets: [
        'HTML links are defined with the <a> tag',
        'The href attribute specifies the destination address',
        'Syntax: <a href="url">link text</a>',
        'The target attribute specifies where to open the linked document',
        'target="_blank" opens the link in a new browser window or tab',
        'Use href="#id" to link to an element with a specific id within the same page',
        'Use href="mailto:email@example.com" to create an email link',
        'Links can be styled with CSS to change colors and appearance'
      ],
      exampleTitle: 'Link examples',
      code: `<!-- External link -->
<a href="https://example.com" target="_blank" rel="noopener">Visit Example</a>

<!-- Link to another page -->
<a href="about.html">About Us</a>

<!-- Link to section on same page -->
<a href="#contact">Jump to Contact</a>

<!-- Email link -->
<a href="mailto:info@example.com">Send Email</a>

<!-- Phone link -->
<a href="tel:+1234567890">Call Us</a>`
    },
    {
      id: 'images',
      title: 'HTML Images',
      heading: 'HTML Images',
      bullets: [
        'HTML images are defined with the <img> tag',
        'The <img> tag is empty, it contains attributes only',
        'The src attribute specifies the path (URL) to the image',
        'The alt attribute provides alternate text for an image',
        'Alt text is displayed if the image cannot be displayed',
        'Always specify the width and height of an image',
        'Syntax: <img src="url" alt="description" width="" height="">'
      ],
      exampleTitle: 'Image examples',
      code: `<!-- Basic image -->
<img src="photo.jpg" alt="Beach sunset" />

<!-- Image with dimensions -->
<img src="logo.png" alt="Company logo" width="200" height="100" />

<!-- Image from URL -->
<img src="https://example.com/image.jpg" alt="Remote image" />

<!-- Clickable image -->
<a href="page.html">
  <img src="button.png" alt="Click here" />
</a>`
    },
    {
      id: 'lists',
      title: 'HTML Lists',
      heading: 'HTML Lists',
      bullets: [
        'HTML lists allow you to group related items together',
        'An unordered list starts with the <ul> tag. Each list item starts with <li>',
        'The list items are marked with bullets (small black circles) by default',
        'An ordered list starts with the <ol> tag. Each list item starts with <li>',
        'The list items in ordered lists are marked with numbers by default',
        'HTML also supports description lists using <dl>, <dt>, and <dd> tags'
      ],
      exampleTitle: 'List examples',
      code: `<!-- Unordered list (bullets) -->
<ul>
  <li>Apple</li>
  <li>Banana</li>
  <li>Orange</li>
</ul>

<!-- Ordered list (numbers) -->
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>

<!-- Nested list -->
<ul>
  <li>Fruits
    <ul>
      <li>Apple</li>
      <li>Banana</li>
    </ul>
  </li>
  <li>Vegetables</li>
</ul>`
    },
    {
      id: 'tables',
      title: 'HTML Tables',
      heading: 'HTML Tables',
      bullets: [
        'HTML tables allow you to arrange data into rows and columns',
        'A table in HTML consists of table cells inside rows and columns',
        'The <table> tag defines an HTML table',
        'Each table row is defined with a <tr> tag',
        'Each table header is defined with a <th> tag',
        'Each table data/cell is defined with a <td> tag',
        'Table headers are bold and centered by default'
      ],
      exampleTitle: 'Table example',
      code: `<table border="1">
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Ana</td>
      <td>20</td>
      <td>NYC</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>25</td>
      <td>LA</td>
    </tr>
  </tbody>
</table>`
    },
    {
      id: 'block-inline',
      title: 'HTML Block & Inline',
      heading: 'Block and Inline Elements',
      bullets: [
        'Every HTML element has a default display value',
        'The two most common display values are block and inline',
        'A block-level element always starts on a new line',
        'A block-level element always takes up the full width available',
        'Examples of block elements: <div>, <p>, <h1>-<h6>, <form>, <header>, <footer>',
        'An inline element does not start on a new line',
        'An inline element only takes up as much width as necessary',
        'Examples of inline elements: <span>, <a>, <img>, <strong>, <em>'
      ],
      exampleTitle: 'Block and inline examples',
      code: `<!-- Block elements -->
<div>This div takes full width</div>
<p>This paragraph starts on new line</p>

<!-- Inline elements -->
<p>This is <span style="color: red;">inline text</span> inside.</p>
<p>Visit <a href="#">this link</a> in the paragraph.</p>

<!-- Mixed -->
<div>
  <p>Block paragraph with <strong>inline bold</strong> text.</p>
  <span>Inline span here</span>
</div>`
    },
    {
      id: 'div',
      title: 'HTML Div',
      heading: 'The Div Element',
      bullets: [
        'The <div> element is used as a container for other HTML elements',
        'The <div> element is a block-level element',
        'The <div> element has no required attributes',
        'The <div> element is often used with class or id attributes',
        'The <div> element can be used to group elements for styling purposes (using CSS)',
        'The <div> element is commonly used for layout purposes'
      ],
      exampleTitle: 'Div examples',
      code: `<!-- Basic div -->
<div>
  <h2>Title</h2>
  <p>Content here</p>
</div>

<!-- Div with class for styling -->
<div class="card">
  <img src="photo.jpg" alt="Photo" />
  <h3>Card Title</h3>
  <p>Card description</p>
</div>

<!-- Nested divs for layout -->
<div class="container">
  <div class="header">Header</div>
  <div class="content">Main content</div>
  <div class="footer">Footer</div>
</div>`
    },
    {
      id: 'classes-id',
      title: 'HTML Classes & Id',
      heading: 'Classes and Id Attributes',
      bullets: [
        'The class attribute specifies one or more class names for an element',
        'The class attribute is mostly used to point to a class in a style sheet',
        'Multiple HTML elements can share the same class',
        'To define multiple classes for an element, separate the class names with a space',
        'The id attribute specifies a unique id for an HTML element',
        'The value of the id attribute must be unique within the HTML document',
        'The id attribute is used to point to a specific style declaration in CSS'
      ],
      exampleTitle: 'Class and ID examples',
      code: `<!-- Elements with classes -->
<p class="intro">Introduction paragraph</p>
<p class="intro highlight">Highlighted intro</p>
<p class="highlight">Another highlight</p>

<!-- Element with id -->
<div id="main-content">
  <h1 id="page-title">Title</h1>
  <p class="text">Content</p>
</div>

<!-- Link to id (anchor) -->
<a href="#main-content">Jump to main content</a>`
    },
    {
      id: 'forms',
      title: 'HTML Forms',
      heading: 'HTML Forms',
      bullets: [
        'An HTML form is used to collect user input',
        'The <form> element defines an HTML form',
        'The <input> element is the most common form element',
        'The type attribute defines the type of input (text, password, email, number, etc.)',
        'The <label> element defines a label for form elements',
        'The <textarea> element defines a multi-line input field',
        'The <select> element defines a drop-down list',
        'The <button> element defines a clickable button'
      ],
      exampleTitle: 'Form example',
      code: `<form action="/submit" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required />
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required />
  
  <label for="age">Age:</label>
  <input type="number" id="age" name="age" min="1" max="120" />
  
  <label for="message">Message:</label>
  <textarea id="message" name="message" rows="4"></textarea>
  
  <button type="submit">Send</button>
</form>`
    },
    {
      id: 'styles',
      title: 'HTML Styles',
      heading: 'HTML Styles',
      bullets: [
        'The HTML style attribute is used to add styles to an element',
        'Syntax: <tagname style="property:value;">',
        'The property is a CSS property. The value is a CSS value',
        'Common style properties: color, background-color, font-size, font-family, text-align',
        'Use semicolon (;) to separate multiple style properties'
      ],
      exampleTitle: 'Style examples',
      code: `<p style="color: red;">Red text</p>

<p style="color: blue; font-size: 20px;">Blue text, 20px size</p>

<div style="background-color: yellow; padding: 10px; border: 2px solid black;">
  Styled box
</div>

<h2 style="text-align: center; color: green; font-family: Arial;">
  Centered green heading
</h2>`
    },
    {
      id: 'layout',
      title: 'HTML Layout',
      heading: 'HTML Layout Elements',
      bullets: [
        'HTML has several semantic elements that define different parts of a web page',
        '<header> - Defines a header for a document or section',
        '<nav> - Defines a set of navigation links',
        '<section> - Defines a section in a document',
        '<article> - Defines independent, self-contained content',
        '<aside> - Defines content aside from the content (like a sidebar)',
        '<footer> - Defines a footer for a document or section',
        '<main> - Specifies the main content of a document'
      ],
      exampleTitle: 'Layout example',
      code: `<header>Site Header</header>
<nav>Menu</nav>
<main>
  <section>Content</section>
</main>
<footer>Footer</footer>`
    },
    {
      id: 'semantics',
      title: 'HTML Semantics',
      heading: 'HTML Semantic Elements',
      bullets: [
        'A semantic element clearly describes its meaning to both the browser and the developer',
        'Examples of semantic elements: <form>, <table>, <article>, <header>, <footer>',
        '<article> - Defines independent, self-contained content',
        '<aside> - Defines content aside from the page content',
        '<figure> - Specifies self-contained content, like illustrations or diagrams',
        '<figcaption> - Defines a caption for a <figure> element',
        'Semantic HTML makes web pages more informative and easier to read for developers and search engines'
      ],
      exampleTitle: 'Semantic example',
      code: `<article>
  <h2>News</h2>
  <p>Story text...</p>
</article>`
    },
    {
      id: 'head',
      title: 'HTML Head',
      heading: 'The HTML Head Element',
      bullets: [
        'The <head> element is a container for metadata (data about data)',
        'The <head> element is placed between the <html> tag and the <body> tag',
        'The <title> element defines the title of the document',
        'The <meta> element is used to specify character set, page description, keywords, author, and viewport',
        'The <link> element defines the relationship between the current document and an external resource',
        'The <style> element contains style information for a document',
        'The <script> element is used to define client-side JavaScript'
      ],
      exampleTitle: 'Complete head example',
      code: `<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Learn HTML basics" />
  <meta name="keywords" content="HTML, tutorial, beginner" />
  <meta name="author" content="Your Name" />
  <title>My Page - Learn HTML</title>
  <link rel="stylesheet" href="styles.css" />
  <link rel="icon" href="favicon.ico" />
  <script src="script.js"></script>
</head>`
    },
    {
      id: 'computer-code',
      title: 'HTML Computercode',
      heading: 'HTML Computer Code Elements',
      bullets: [
        'HTML contains several elements for defining computer code and keyboard input',
        'The <code> element defines a piece of computer code',
        'The <pre> element defines preformatted text (preserves spaces and line breaks)',
        'The <kbd> element defines keyboard input',
        'The <samp> element defines sample output from a computer program',
        'The <var> element defines a variable in programming or math'
      ],
      exampleTitle: 'Code example',
      code: `<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd></p>
<pre><code>const x = 10;</code></pre>`
    },
    {
      id: 'entities',
      title: 'HTML Entities',
      heading: 'HTML Entities',
      bullets: [
        'Some characters are reserved in HTML',
        'If you use the less than (<) or greater than (>) signs in your text, the browser might mix them with tags',
        'Character entities are used to display reserved characters in HTML',
        'An entity looks like this: &entity_name; OR &#entity_number;',
        'Common entities: &lt; (less than), &gt; (greater than), &amp; (ampersand), &quot; (quotation mark)',
        'Non-breaking space: &nbsp; prevents line breaks at that position'
      ],
      exampleTitle: 'Entity example',
      code: `&lt;p&gt;5 &gt; 3 &amp; 2 &lt; 4&lt;/p&gt;`
    },
    {
      id: 'symbols',
      title: 'HTML Symbols',
      heading: 'HTML Symbols',
      bullets: [
        'Symbols that are not present on your keyboard can be added using entities',
        'Many mathematical, technical, and currency symbols are not available on a normal keyboard',
        'To add such symbols, use an HTML entity name or number',
        'Common symbols: &copy; (©), &reg; (®), &trade; (™), &euro; (€), &cent; (¢)',
        'If no entity name exists, you can use an entity number (decimal or hexadecimal reference)'
      ],
      exampleTitle: 'Symbols example',
      code: `&copy; 2026 My Site &nbsp; &reg; &nbsp; &trade;`
    },
    {
      id: 'emojis',
      title: 'HTML Emojis',
      heading: 'HTML Emojis',
      bullets: [
        'Emojis are characters from the UTF-8 character set',
        'To display an emoji, you can use an emoji HTML entity',
        'Since emojis are characters, they can be copied, displayed, and sized just like any other characters',
        'The charset must be UTF-8 to display emojis correctly',
        'Example: &#128512; displays 😀'
      ],
      exampleTitle: 'Emoji example',
      code: `<meta charset="UTF-8" />
<p>Learning HTML is fun 😀</p>`
    },
    {
      id: 'charsets',
      title: 'HTML Charsets',
      heading: 'HTML Character Sets',
      bullets: [
        'To display an HTML page correctly, a web browser must know which character set to use',
        'The charset is specified in the <meta> tag',
        'UTF-8 covers almost all of the characters and symbols in the world',
        'Always declare the character encoding in your HTML documents',
        'Syntax: <meta charset="UTF-8">'
      ],
      exampleTitle: 'Charset example',
      code: `<meta charset="UTF-8" />`
    },
    {
      id: 'responsive',
      title: 'HTML Responsive',
      heading: 'Responsive Web Design',
      bullets: [
        'Responsive web design makes your web page look good on all devices',
        'Responsive web design uses only HTML and CSS',
        'The viewport is the user visible area of a web page',
        'Set the viewport: <meta name="viewport" content="width=device-width, initial-scale=1.0">',
        'This gives the browser instructions on how to control the page dimensions and scaling'
      ],
      exampleTitle: 'Responsive basics',
      code: `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`
    },
    {
      id: 'style-guide',
      title: 'HTML Style Guide',
      heading: 'HTML Coding Conventions',
      bullets: [
        'Always declare the document type: <!DOCTYPE html>',
        'Use lowercase element names (recommended by W3C)',
        'Close all HTML elements',
        'Use lowercase attribute names',
        'Always quote attribute values',
        'Always specify alt, width, and height for images',
        'Avoid long code lines (easier to read)'
      ],
      exampleTitle: 'Clean formatting',
      code: `<div class="card">
  <img src="photo.jpg" alt="Profile photo" />
  <p>Short description.</p>
</div>`
    },
    {
      id: 'url-encode',
      title: 'HTML URL Encode',
      heading: 'HTML URL Encoding',
      bullets: [
        'URLs can only be sent over the Internet using the ASCII character set',
        'URL encoding converts characters into a format that can be transmitted over the Internet',
        'URL encoding replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits',
        'URLs cannot contain spaces. URL encoding normally replaces a space with a plus (+) sign or %20',
        'Common encodings: space (%20), ! (%21), " (%22), # (%23), $ (%24)'
      ],
      exampleTitle: 'URL encode example',
      code: `https://example.com/search?q=hello%20world&lang=en`
    },
    {
      id: 'xhtml',
      title: 'HTML vs. XHTML',
      heading: 'HTML vs. XHTML',
      bullets: [
        'XHTML stands for EXtensible HyperText Markup Language',
        'XHTML is a stricter, more XML-based version of HTML',
        'XHTML is HTML defined as an XML application',
        'In XHTML, all elements must be properly closed',
        'In XHTML, all elements must be in lowercase',
        'XHTML documents must have one root element',
        'Most pages today are written in HTML5'
      ],
      exampleTitle: 'XHTML style',
      code: `<br />
<img src="image.jpg" alt="Desc" />`
    },
    {
      id: 'semantic',
      title: 'HTML Semantic Elements',
      heading: 'Semantic HTML Elements',
      bullets: [
        'Semantic HTML elements clearly describe their meaning to both the browser and developer',
        '<article> - Defines independent, self-contained content',
        '<section> - Defines a section in a document',
        '<nav> - Defines navigation links',
        '<header> - Defines a header for a document or section',
        '<footer> - Defines a footer for a document or section',
        '<aside> - Defines content aside from the page content',
        '<main> - Specifies the main content of a document'
      ],
      exampleTitle: 'Semantic HTML structure',
      code: `<header>
  <nav><a href="#">Home</a></nav>
</header>
<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>
  <aside>Related info</aside>
</main>
<footer>Copyright 2024</footer>`
    },
    {
      id: 'meta',
      title: 'HTML Meta Tags',
      heading: 'Meta Tags for SEO and Display',
      bullets: [
        'Meta tags provide metadata about the HTML document',
        'Metadata is not displayed on the page, but used by browsers and search engines',
        'charset - Specifies the character encoding',
        'viewport - Controls layout on mobile browsers',
        'description - Provides a short description of the page',
        'keywords - Lists keywords for search engines',
        'author - Specifies the author of the document'
      ],
      exampleTitle: 'Common meta tags',
      code: `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description">
  <meta name="keywords" content="html, css, javascript">
  <meta name="author" content="John Doe">
</head>`
    },
    {
      id: 'canvas',
      title: 'HTML Canvas',
      heading: 'Drawing Graphics with Canvas',
      bullets: [
        'The canvas element is used to draw graphics on a web page',
        'Canvas is a container for graphics and must be drawn with JavaScript',
        'Canvas provides methods for drawing paths, boxes, circles, text, and images',
        'The canvas element has only two attributes: width and height',
        'Canvas coordinates start at (0,0) in the top-left corner',
        'Use getContext("2d") to access the drawing context'
      ],
      exampleTitle: 'Simple canvas drawing',
      code: `<canvas id="myCanvas" width="200" height="200"></canvas>
<script>
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#667eea";
  ctx.fillRect(20, 20, 150, 100);
</script>`
    },
    {
      id: 'video',
      title: 'HTML Video & Audio',
      heading: 'Embedding Video and Audio',
      bullets: [
        'The <video> tag is used to embed video files in a web page',
        'The <audio> tag is used to embed audio files',
        'Both support multiple file formats for better browser compatibility',
        'Common video formats: MP4, WebM, Ogg',
        'Common audio formats: MP3, WAV, OGG',
        'Video and audio elements provide built-in player controls',
        'Use the controls attribute to display playback controls'
      ],
      exampleTitle: 'Video and Audio tags',
      code: `<video width="400" controls>
  <source src="movie.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<audio controls>
  <source src="song.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>`
    },
    {
      id: 'geo',
      title: 'HTML Geolocation',
      heading: 'Get User Location with Geolocation API',
      bullets: [
        'Geolocation API is used to get the geographical position of a user',
        'The position is only available if the user approves it',
        'Uses getCurrentPosition() to get the current position',
        'Returns latitude and longitude coordinates',
        'Can track user movement with watchPosition()',
        'Requires HTTPS in production (for security)',
        'Accuracy varies depending on the device and network'
      ],
      exampleTitle: 'Get user coordinates',
      code: `<script>
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      console.log("Latitude: " + lat);
      console.log("Longitude: " + lon);
    },
    function(error) {
      console.error("Error getting location: " + error.message);
    }
  );
} else {
  console.log("Geolocation is not supported");
}
</script>`
    },
    {
      id: 'drag',
      title: 'HTML Drag and Drop',
      heading: 'Implementing Drag and Drop',
      bullets: [
        'Drag and Drop is a common feature in modern web applications',
        'Make any HTML element draggable with draggable="true"',
        'ondragstart - Happens when user starts dragging',
        'ondrop - Happens when dragged element is dropped',
        'ondragover - Specifies where elements can be dropped',
        'Use dataTransfer to pass data between dragged and drop zones',
        'preventDefault() must be called in ondragover to allow dropping'
      ],
      exampleTitle: 'Drag and Drop example',
      code: `<div id="source" draggable="true">Drag me</div>
<div id="target"></div>

<script>
  const source = document.getElementById("source");
  const target = document.getElementById("target");
  
  source.ondragstart = (e) => {
    e.dataTransfer.setData("text", e.target.id);
  };
  
  target.ondragover = (e) => e.preventDefault();
  target.ondrop = (e) => {
    const id = e.dataTransfer.getData("text");
    target.appendChild(document.getElementById(id));
  };
</script>`
    },
    {
      id: 'storage',
      title: 'HTML Web Storage',
      heading: 'Storing Data in the Browser',
      bullets: [
        'Web Storage allows you to store data on the client side',
        'localStorage - Data persists even after closing the browser',
        'sessionStorage - Data is deleted when the browser tab is closed',
        'Much larger storage capacity than cookies',
        'Data is stored as key-value pairs',
        'Access data with getItem(), setItem(), removeItem()',
        'Useful for saving user preferences and application state'
      ],
      exampleTitle: 'Using localStorage',
      code: `<script>
// Save data
localStorage.setItem("username", "John");
localStorage.setItem("theme", "dark");

// Get data
const user = localStorage.getItem("username");

// Remove specific data
localStorage.removeItem("theme");

// Clear all data
localStorage.clear();
</script>`
    },
    {
      id: 'web-worker',
      title: 'HTML Web Workers',
      heading: 'Running Scripts in Background',
      bullets: [
        'Web Workers run JavaScript in the background',
        'Prevents long scripts from blocking user interaction',
        'Workers run in separate threads',
        'Main thread and worker communicate via messages',
        'Use postMessage() to send data to worker',
        'Use onmessage to receive data from worker',
        'Workers cannot access DOM or window object'
      ],
      exampleTitle: 'Simple Web Worker',
      code: `// Create worker
const worker = new Worker("worker.js");

// Send data to worker
worker.postMessage({x: 10, y: 20});

// Receive data from worker
worker.onmessage = function(event) {
  console.log("Result: " + event.data);
};`
    }
  ]), []);
  
  // HTML Quiz Questions Data
  const htmlQuizQuestions = useMemo(() => ([
    { id: 1, type: 'multiple', question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], correct: 0 },
    { id: 2, type: 'multiple', question: 'Which tag is used for the largest heading?', options: ['<h1>', '<h6>', '<heading>', '<head>'], correct: 0 },
    { id: 3, type: 'multiple', question: 'Which tag is used to define a paragraph?', options: ['<p>', '<para>', '<paragraph>', '<pg>'], correct: 0 },
    { id: 4, type: 'blanks', question: 'The <_____ > tag is used to create a hyperlink.', answer: 'a' },
    { id: 5, type: 'multiple', question: 'What is the correct way to create an image?', options: ['<img src="image.jpg">', '<image src="image.jpg">', '<img href="image.jpg">', '<picture src="image.jpg">'], correct: 0 },
    { id: 6, type: 'blanks', question: 'The <_____ > tag is used to create a line break.', answer: 'br' },
    { id: 7, type: 'multiple', question: 'Which attribute specifies alternate text for an image?', options: ['alt', 'title', 'description', 'text'], correct: 0 },
    { id: 8, type: 'blanks', question: 'Use the <_____ > tag to define a list item.', answer: 'li' },
    { id: 9, type: 'multiple', question: 'Which tag defines an unordered list?', options: ['<ul>', '<ol>', '<list>', '<li>'], correct: 0 },
    { id: 10, type: 'multiple', question: 'What does the <head> tag contain?', options: ['Metadata and title information', 'Main content of the page', 'Navigation links', 'Footer information'], correct: 0 },
    { id: 11, type: 'blanks', question: 'The <!_____ html> declaration tells the browser the document is HTML5.', answer: 'DOCTYPE' },
    { id: 12, type: 'multiple', question: 'Which tag is used to define a table?', options: ['<table>', '<tab>', '<tbl>', '<tr>'], correct: 0 },
    { id: 13, type: 'blanks', question: 'Use <_____ > tag to define a table row.', answer: 'tr' },
    { id: 14, type: 'multiple', question: 'Which tag is used to define a form?', options: ['<form>', '<input>', '<field>', '<data>'], correct: 0 },
    { id: 15, type: 'blanks', question: 'Use <_____ > tag to define a submit button.', answer: 'button' },
    { id: 16, type: 'multiple', question: 'What is the purpose of the alt attribute?', options: ['Provide alternate text for images', 'Align the image', 'Make the image alternate colors', 'Define image size'], correct: 0 },
    { id: 17, type: 'blanks', question: 'The <_____ > tag is used to define the document title.', answer: 'title' },
    { id: 18, type: 'multiple', question: 'Which tag is used for the smallest heading?', options: ['<h6>', '<h1>', '<h3>', '<h4>'], correct: 0 },
    { id: 19, type: 'blanks', question: 'Use the <_____ > tag to define a division or section of HTML.', answer: 'div' },
    { id: 20, type: 'multiple', question: 'What is the correct way to add a comment in HTML?', options: ['<!-- comment -->', '<! comment !>', '// comment', '/* comment */'], correct: 0 },
    { id: 21, type: 'blanks', question: 'The <_____ > tag defines metadata about an HTML document.', answer: 'meta' },
    { id: 22, type: 'multiple', question: 'Which tag is used to define a strong emphasis?', options: ['<strong>', '<bold>', '<b>', '<emphasis>'], correct: 0 },
    { id: 23, type: 'blanks', question: 'Use <_____ > tag to define an unordered list.', answer: 'ul' },
    { id: 24, type: 'multiple', question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], correct: 0 },
    { id: 25, type: 'blanks', question: 'The <_____ > tag defines an ordered list.', answer: 'ol' },
    { id: 26, type: 'multiple', question: 'Which attribute specifies the URL of the link?', options: ['href', 'url', 'link', 'src'], correct: 0 },
    { id: 27, type: 'blanks', question: 'Use <_____ > tag to define an emphasized text.', answer: 'em' },
    { id: 28, type: 'multiple', question: 'What is the purpose of the charset meta tag?', options: ['Specify character encoding', 'Define colors', 'Set page width', 'Enable JavaScript'], correct: 0 },
    { id: 29, type: 'blanks', question: 'The <_____ > tag defines a hyperlink reference.', answer: 'a' },
    { id: 30, type: 'multiple', question: 'Which tag is used to define the body of a document?', options: ['<body>', '<content>', '<main>', '<page>'], correct: 0 }
  ]), []);

  const [activeLessonId, setActiveLessonId] = useState(lessons[0].id);
  const [userCode, setUserCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizPage, setCurrentQuizPage] = useState(0);
  
  const questionsPerPage = 2;
  const totalQuizPages = Math.ceil(htmlQuizQuestions.length / questionsPerPage);
  const startIdx = currentQuizPage * questionsPerPage;
  const endIdx = startIdx + questionsPerPage;
  const currentPageQuestions = htmlQuizQuestions.slice(startIdx, endIdx);
  
  // Calculate quiz score
  const calculateQuizScore = () => {
    let score = 0;
    htmlQuizQuestions.forEach(q => {
      const answer = quizAnswers[q.id];
      if (q.type === 'multiple') {
        if (answer === (q as any).correct?.toString()) score++;
      } else {
        if (answer?.toLowerCase().trim() === (q as any).answer?.toLowerCase()) score++;
      }
    });
    return score;
  };
  
  const handleQuizSubmit = () => {
    setQuizScore(calculateQuizScore());
    setQuizSubmitted(true);
  };
  
  // Determine if showing lesson or task
  const isShowingTask = selectedTaskId !== null;
  const selectedTask = questions.find(q => q.id === selectedTaskId);
  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) || lessons[0];
  
  // Get current lesson index
  const currentLessonIndex = lessons.findIndex((lesson) => lesson.id === activeLessonId);
  const isFirstLesson = currentLessonIndex === 0;
  const isLastLesson = currentLessonIndex === lessons.length - 1;
  
  // Navigation handlers
  const goToPreviousLesson = () => {
    if (!isFirstLesson) {
      setActiveLessonId(lessons[currentLessonIndex - 1].id);
    }
  };
  
  const goToNextLesson = () => {
    if (!isLastLesson) {
      setActiveLessonId(lessons[currentLessonIndex + 1].id);
    }
  };

  // Update user code when lesson changes
  React.useEffect(() => {
    setUserCode(activeLesson.code);
    setShowPreview(false);
  }, [activeLessonId, activeLesson.code]);

  // highlight lesson code block after render
  useEffect(() => {
    Prism.highlightAll();
  }, [activeLesson.code]);
  
  // Scroll to tasks section when returning from a quiz
  React.useEffect(() => {
    const shouldScrollToTasks = sessionStorage.getItem('studyAreaScrollToTasks');
    if (shouldScrollToTasks === 'true' && tasksRef.current) {
      setTimeout(() => {
        tasksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        sessionStorage.removeItem('studyAreaScrollToTasks');
      }, 100);
    }
  }, []);

  return (
    <div className="study-container">
      <header className="study-header">
        <nav className="w3schools-nav">
          <div className="nav-left">
            <div className="nav-brand">
              <span className="brand-logo">AUSDAV</span>
            </div>
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="nav-menu">
              <button className="nav-item active">Tutorials</button>
              <button className="nav-item" onClick={onViewReferences}>References</button>
              <button className="nav-item" onClick={onViewTags}>Tags</button>
            </div>
          </div>
          <div className="nav-right">
            
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </nav>
      </header>

      <div className="study-content">
        <div className="study-layout">
          <aside className={`study-sidebar fixed left-0 top-0 h-full z-50 w-[240px] sm:w-[260px] bg-[#020617]/80 backdrop-blur-xl border-r border-white/10 rounded-r-2xl shadow-[0_0_40px_rgba(59,130,246,0.15)] p-6 space-y-4 transition-transform duration-300 overflow-y-auto relative ${sidebarOpen ? 'sidebar-open translate-x-0' : 'translate-x-[-100%]'}`} aria-label="HTML topics">
            <button 
              className="sidebar-close-btn absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20 transition"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            
            <div className="sidebar-title text-blue-400 font-semibold tracking-wider text-sm uppercase mb-6">HTML Topics</div>
            <ul className="topic-list space-y-2">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <button
                    className={`topic-item relative isolate flex items-center w-full px-4 py-3 rounded-full text-slate-300 transition-all duration-300 hover:text-white hover:bg-white/5 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] ${lesson.id === activeLessonId && !isShowingTask && !showingHtmlQuiz ? "active bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.7)] before:content-[''] before:absolute before:inset-0 before:bg-blue-500/20 before:blur-xl before:rounded-full before:-z-10" : ''}`}
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      setSelectedTaskId(null);
                      setShowingHtmlQuiz(false);
                      setSidebarOpen(false);
                    }}
                  >
                    {lesson.title}
                  </button>
                </li>
              ))}
            </ul>
            
            {tasksLoaded || questions.length > 0 ? (
              <>
                <div ref={tasksRef} className="sidebar-title mt-6 text-blue-400 font-semibold tracking-wider text-sm uppercase">HTML Tasks</div>
                <ul className="topic-list space-y-2">
                  {questions.length > 0 ? (
                    questions.map((question) => (
                      <li key={`task-${question.id}`}>
                        <button
                          className={`topic-item relative isolate flex items-center w-full px-4 py-3 rounded-full text-slate-300 transition-all duration-300 hover:text-white hover:bg-white/5 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] ${selectedTaskId === question.id && !showingHtmlQuiz ? "active bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.7)] before:content-[''] before:absolute before:inset-0 before:bg-blue-500/20 before:blur-xl before:rounded-full before:-z-10" : ''}`}
                          onClick={() => {
                            setSelectedTaskId(question.id);
                            setShowingHtmlQuiz(false);
                            setSidebarOpen(false);
                          }}
                        >
                          {question.title}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li style={{ padding: '8px 12px', color: '#999', fontSize: '12px' }}>
                      Loading tasks...
                    </li>
                  )}
                </ul>
              </>
            ) : null}
            
            <div className="sidebar-title mt-6 text-blue-400 font-semibold tracking-wider text-sm uppercase">Quiz</div>
            <ul className="topic-list space-y-2">
              <li>
                <button
                  className={`topic-item relative isolate flex items-center w-full px-4 py-3 rounded-full text-slate-300 transition-all duration-300 hover:text-white hover:bg-white/5 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] ${showingHtmlQuiz ? "active bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.7)] before:content-[''] before:absolute before:inset-0 before:bg-blue-500/20 before:blur-xl before:rounded-full before:-z-10" : ''}`}
                  onClick={() => {
                    setShowingHtmlQuiz(true);
                    setSelectedTaskId(null);
                    setActiveLessonId('');
                    setSidebarOpen(false);
                  }}
                >
                  HTML Quiz (30 Questions)
                </button>
              </li>
            </ul>
          </aside>

          <main className="study-main">
            {showingHtmlQuiz ? (
              <>
                <section className="study-section">
                  <h2 className="quiz-header-title">HTML Quiz</h2>
                  <p className="quiz-header-desc">30 questions covering HTML concepts. Select the correct answer or fill in the blank.</p>
                  <p className="quiz-header-progress">Question {startIdx + 1} - {Math.min(endIdx, htmlQuizQuestions.length)} of {htmlQuizQuestions.length}</p>
                  {quizSubmitted && (
                    <div className="quiz-result-box">
                      <h3 className="quiz-result-title">Quiz Completed!</h3>
                      <p className="quiz-result-score">Score: <strong>{quizScore}/{htmlQuizQuestions.length}</strong> ({Math.round((quizScore / htmlQuizQuestions.length) * 100)}%)</p>
                    </div>
                  )}
                </section>
                
                <div className="quiz-container">
                  {currentPageQuestions.map((q, idx) => {
                    const globalIdx = startIdx + idx;
                    return (
                      <div key={q.id} className="quiz-question-block">
                        <h4 className="quiz-question-title">Q{globalIdx + 1}. {q.question}</h4>
                        
                        {q.type === 'multiple' ? (
                          <div className="quiz-options">
                            {(q as any).options?.map((option: string, optIdx: number) => (
                              <label key={optIdx} className="quiz-option-label">
                                <input
                                  type="radio"
                                  name={`q${q.id}`}
                                  value={optIdx.toString()}
                                  checked={quizAnswers[q.id] === optIdx.toString()}
                                  onChange={(e) => {
                                    setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                                    if (quizSubmitted) setQuizSubmitted(false);
                                  }}
                                  disabled={quizSubmitted}
                                />
                                <span className="quiz-option-text">{option}</span>
                                {quizSubmitted && optIdx === q.correct && <span className="quiz-correct-mark">✓</span>}
                                {quizSubmitted && quizAnswers[q.id] === optIdx.toString() && optIdx !== q.correct && <span className="quiz-wrong-mark">✗</span>}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={quizAnswers[q.id] || ''}
                              onChange={(e) => {
                                setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                                if (quizSubmitted) setQuizSubmitted(false);
                              }}
                              disabled={quizSubmitted}
                              placeholder="Type your answer..."
                              className="quiz-input"
                            />
                            {quizSubmitted && (
                              <div className="quiz-answer-feedback">
                                {quizAnswers[q.id]?.toLowerCase().trim() === (q as any).answer?.toLowerCase() ? (
                                  <span className="quiz-correct-text">✓ Correct</span>
                                ) : (
                                  <div className="quiz-incorrect-text">
                                    <span>✗ Incorrect. Answer: <strong>{q.answer}</strong></span>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="lesson-navigation">
                  <button 
                    className="nav-btn prev-btn"
                    onClick={() => setCurrentQuizPage(Math.max(0, currentQuizPage - 1))}
                    disabled={currentQuizPage === 0 || quizSubmitted}
                  >
                    ← Previous
                  </button>
                  
                  {currentQuizPage === totalQuizPages - 1 ? (
                    !quizSubmitted ? (
                      <button 
                        className="solve-task-btn"
                        onClick={handleQuizSubmit}
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <button 
                        className="solve-task-btn"
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                          setQuizScore(0);
                          setCurrentQuizPage(0);
                        }}
                      >
                        Retake Quiz
                      </button>
                    )
                  ) : null}
                  
                  <button 
                    className="nav-btn next-btn"
                    onClick={() => setCurrentQuizPage(Math.min(totalQuizPages - 1, currentQuizPage + 1))}
                    disabled={currentQuizPage === totalQuizPages - 1 || quizSubmitted}
                  >
                    Next →
                  </button>
                </div>
              </>
            ) : isShowingTask && selectedTask ? (
              <>
                <section className="study-section">
                  <h2>{selectedTask.title}</h2>
                  <p style={{ color: '#666', marginBottom: '16px' }}><strong>Difficulty:</strong> <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '4px', backgroundColor: selectedTask.difficulty === 'easy' ? '#4caf50' : selectedTask.difficulty === 'medium' ? '#ff9800' : '#f44336', color: 'white' }}>{selectedTask.difficulty.charAt(0).toUpperCase() + selectedTask.difficulty.slice(1)}</span></p>
                  <p style={{ color: '#333', marginBottom: '20px' }}><strong>Description:</strong> {selectedTask.description}</p>
                </section>
                
                <section className="study-section">
                  <h3>Task Details</h3>
                  {/* instead of showing the raw HTML with blanks, present a human-friendly explanation */}
                  <p>{selectedTask.description}</p>
                </section>
                
                <div className="lesson-navigation">
                  <button 
                    className="nav-btn prev-btn"
                    onClick={() => {
                      const currentIndex = questions.findIndex(q => q.id === selectedTaskId);
                      if (currentIndex > 0) {
                        setSelectedTaskId(questions[currentIndex - 1].id);
                      }
                    }}
                    disabled={selectedTaskId === questions[0]?.id}
                  >
                    ← Previous Task
                  </button>
                  <button
                    className="nav-btn solve-task-btn"
                    onClick={() => {
                      setPendingTaskId(selectedTaskId);
                      setShowSchoolModal(true);
                      setSchoolName('');
                      setSaveSchoolError(null);
                    }}
                  >
                    Solve This Task
                  </button>
                        {/* School Name Modal for Solve Task */}
                        <SchoolNameModal
                          isOpen={showSchoolModal}
                          onClose={() => setShowSchoolModal(false)}
                          onSubmit={async () => {
                            setSavingSchool(true);
                            setSaveSchoolError(null);
                            if (!schoolName) {
                              setSaveSchoolError('Please enter your school name.');
                              setSavingSchool(false);
                              return;
                            }
                            try {
                              if (!user?.email || !pendingTaskId) {
                                setSaveSchoolError('Missing user or task info.');
                                setSavingSchool(false);
                                return;
                              }
                              // Save to pentathlon_quiz table
                              const { error } = await BackendAPI.supabase.from('pentathlon_quiz').insert({
                                school_name: schoolName,
                                user_email: user.email,
                                score: 0,
                                question_id: pendingTaskId
                              });
                              if (error) {
                                setSaveSchoolError(error.message);
                              } else {
                                setShowSchoolModal(false);
                                setSchoolName('');
                                setPendingTaskId(null);
                                // Store that we came from task preview
                                sessionStorage.setItem('studyAreaFromTaskPreview', 'true');
                                onSelectQuestion(pendingTaskId);
                              }
                            } catch (e: any) {
                              setSaveSchoolError(e?.message || 'Unknown error');
                            }
                            setSavingSchool(false);
                          }}
                          schoolName={schoolName}
                          setSchoolName={setSchoolName}
                          saving={savingSchool}
                          saveError={saveSchoolError}
                        />
                  <button 
                    className="nav-btn next-btn"
                    onClick={() => {
                      const currentIndex = questions.findIndex(q => q.id === selectedTaskId);
                      if (currentIndex < questions.length - 1) {
                        setSelectedTaskId(questions[currentIndex + 1].id);
                      }
                    }}
                    disabled={selectedTaskId === questions[questions.length - 1]?.id}
                  >
                    Next Task →
                  </button>
                </div>
              </>
            ) : (
              <>
                { /* Breadcrumb removed per user request */ }
                
                <section className="study-section">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2>{activeLesson.heading}</h2>
                    {activeLesson.difficulty && (
                      <span className={`difficulty-badge difficulty-${activeLesson.difficulty}`}>
                        {activeLesson.difficulty.charAt(0).toUpperCase() + activeLesson.difficulty.slice(1)}
                      </span>
                    )}
                  </div>
                  <ul className="study-bullets">
                    {activeLesson.bullets.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            {activeLesson.code && (
              <section className="study-section">
                <div className="code-header">
                  <h3>{activeLesson.exampleTitle}</h3>
                </div>
                <pre className="study-code">
                  <button 
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(activeLesson.code);
                      setCopiedCode(activeLesson.code);
                      setTimeout(() => setCopiedCode(null), 2000);
                    }}
                    title="Copy code to clipboard"
                  >
                    {copiedCode === activeLesson.code ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    )}
                  </button>
                  <code className="language-html">{activeLesson.code}</code>
                </pre>
              </section>
            )}

            {activeLesson.commonMistakes && (
              <section className="study-section">
                <h3>⚠️ Common Mistakes</h3>
                <div className="mistakes-container">
                  <div className="mistake-card">
                    {activeLesson.commonMistakes.map((item, index) => (
                      <div key={index} className="mistake-item">
                        <p className="mistake-text">{item.mistake}</p>
                        <p className="mistake-why"><strong>Why:</strong> {item.why}</p>
                        <p className="mistake-correct">{item.correct}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeLesson.tips && (
              <section className="study-section">
                <h3>💡 Tips & Notes</h3>
                <div className="tips-container">
                  <div className="tip-box">
                    {activeLesson.tips.map((tip, index) => (
                      <p key={index} className="tip-item">{tip}</p>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeLesson.bestPractices && (
              <section className="study-section">
                <h3>✓ Best Practices</h3>
                <div className="best-practices-container">
                  <div className="practice-box">
                    {activeLesson.bestPractices.map((practice, index) => (
                      <p key={index} className="practice-item">{practice}</p>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {activeLesson.code && activeLesson.id !== 'intro' && activeLesson.id !== 'editors' && (
              <section className="study-section">
                <h3>✏️ Try It Yourself!</h3>
                <p className="try-instructions">
                  Edit the code below and click "Preview" to see the result. Experiment and learn!
                </p>
                <textarea
                  className="try-editor"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={10}
                  placeholder="Type your HTML code here..."
                  spellCheck={false}
                />
                <div className="try-actions">
                  <button 
                    className="nav-btn next-btn"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                  <button 
                    className="nav-btn next-btn"
                    onClick={() => setUserCode(activeLesson.code)}
                  >
                    Reset Code
                  </button>
                </div>
                {showPreview && (
                  <div className="try-preview">
                    <h4>Preview:</h4>
                    <div 
                      className="preview-output"
                      dangerouslySetInnerHTML={{ __html: userCode }}
                    />
                  </div>
                )}
              </section>
            )}

            <section className="study-section">
              <h3>📌 Key Takeaways</h3>
              <div className="key-takeaways">
                <ul className="takeaways-list">
                  {activeLesson.bullets.slice(0, 3).map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
            
            <div className="lesson-navigation">
              <button 
                className="nav-btn prev-btn" 
                onClick={goToPreviousLesson}
                disabled={isFirstLesson}
              >
                ← Previous
              </button>
              <button 
                className="nav-btn next-btn" 
                onClick={goToNextLesson}
                disabled={isLastLesson}
              >
                Next →
              </button>
            </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>

  );
};
