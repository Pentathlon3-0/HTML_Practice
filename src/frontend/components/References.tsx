import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface ReferencesProps {
  onBack: () => void;
  onViewTags: () => void;
}

export const References = ({ onBack, onViewTags }: ReferencesProps) => {
  const { user, logout } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'tags' | 'attributes' | 'events'>('tags');

  const htmlTags = [
    { tag: '<!DOCTYPE>', description: 'Defines the document type', category: 'Basic' },
    { tag: '<html>', description: 'Defines an HTML document', category: 'Basic' },
    { tag: '<head>', description: 'Contains metadata/information for the document', category: 'Basic' },
    { tag: '<title>', description: 'Defines a title for the document', category: 'Basic' },
    { tag: '<body>', description: 'Defines the document\'s body', category: 'Basic' },
    { tag: '<h1> to <h6>', description: 'Defines HTML headings', category: 'Formatting' },
    { tag: '<p>', description: 'Defines a paragraph', category: 'Formatting' },
    { tag: '<br>', description: 'Inserts a single line break', category: 'Formatting' },
    { tag: '<hr>', description: 'Defines a thematic change in the content', category: 'Formatting' },
    { tag: '<a>', description: 'Defines a hyperlink', category: 'Links' },
    { tag: '<img>', description: 'Defines an image', category: 'Images' },
    { tag: '<div>', description: 'Defines a section in a document', category: 'Layout' },
    { tag: '<span>', description: 'Defines a section in a document', category: 'Layout' },
    { tag: '<ul>', description: 'Defines an unordered list', category: 'Lists' },
    { tag: '<ol>', description: 'Defines an ordered list', category: 'Lists' },
    { tag: '<li>', description: 'Defines a list item', category: 'Lists' },
    { tag: '<table>', description: 'Defines a table', category: 'Tables' },
    { tag: '<tr>', description: 'Defines a table row', category: 'Tables' },
    { tag: '<td>', description: 'Defines a table cell', category: 'Tables' },
    { tag: '<th>', description: 'Defines a table header', category: 'Tables' },
    { tag: '<form>', description: 'Defines an HTML form for user input', category: 'Forms' },
    { tag: '<input>', description: 'Defines an input control', category: 'Forms' },
    { tag: '<button>', description: 'Defines a clickable button', category: 'Forms' },
    { tag: '<select>', description: 'Defines a drop-down list', category: 'Forms' },
    { tag: '<textarea>', description: 'Defines a multiline input control', category: 'Forms' },
    { tag: '<label>', description: 'Defines a label for an input element', category: 'Forms' },
    { tag: '<header>', description: 'Defines a header for a document or section', category: 'Semantic' },
    { tag: '<footer>', description: 'Defines a footer for a document or section', category: 'Semantic' },
    { tag: '<nav>', description: 'Defines navigation links', category: 'Semantic' },
    { tag: '<article>', description: 'Defines an article', category: 'Semantic' },
    { tag: '<section>', description: 'Defines a section in a document', category: 'Semantic' },
    { tag: '<aside>', description: 'Defines content aside from the page content', category: 'Semantic' },
    { tag: '<main>', description: 'Specifies the main content of a document', category: 'Semantic' },
  ];

  const htmlAttributes = [
    { attribute: 'class', description: 'Specifies one or more class names for an element', usage: 'class="example"' },
    { attribute: 'id', description: 'Specifies a unique id for an element', usage: 'id="unique-id"' },
    { attribute: 'style', description: 'Specifies an inline CSS style for an element', usage: 'style="color:red;"' },
    { attribute: 'href', description: 'Specifies the URL of the page the link goes to', usage: 'href="url"' },
    { attribute: 'src', description: 'Specifies the URL of the image/media', usage: 'src="image.jpg"' },
    { attribute: 'alt', description: 'Specifies an alternate text for an image', usage: 'alt="description"' },
    { attribute: 'title', description: 'Specifies extra information about an element', usage: 'title="tooltip"' },
    { attribute: 'type', description: 'Specifies the type of element', usage: 'type="text"' },
    { attribute: 'value', description: 'Specifies the value of an input element', usage: 'value="default"' },
    { attribute: 'name', description: 'Specifies the name of an element', usage: 'name="fieldname"' },
    { attribute: 'placeholder', description: 'Specifies a short hint in an input field', usage: 'placeholder="hint"' },
    { attribute: 'disabled', description: 'Specifies that an element should be disabled', usage: 'disabled' },
    { attribute: 'required', description: 'Specifies that an input field must be filled out', usage: 'required' },
    { attribute: 'target', description: 'Specifies where to open the linked document', usage: 'target="_blank"' },
  ];

  const htmlEvents = [
    { event: 'onclick', description: 'Fires when the user clicks on an element', usage: 'onclick="myFunction()"' },
    { event: 'onchange', description: 'Fires when the value of an element changes', usage: 'onchange="handleChange()"' },
    { event: 'onmouseover', description: 'Fires when the mouse pointer moves over an element', usage: 'onmouseover="hover()"' },
    { event: 'onmouseout', description: 'Fires when the mouse pointer moves out of an element', usage: 'onmouseout="unhover()"' },
    { event: 'onload', description: 'Fires when an element has loaded', usage: 'onload="init()"' },
    { event: 'onfocus', description: 'Fires when an element gets focus', usage: 'onfocus="focused()"' },
    { event: 'onblur', description: 'Fires when an element loses focus', usage: 'onblur="blurred()"' },
    { event: 'onsubmit', description: 'Fires when a form is submitted', usage: 'onsubmit="validate()"' },
  ];

  return (
    <div className="study-container">
      <header className="study-header">
        <nav className="w3schools-nav">
          <div className="nav-logo">
            <span className="logo-text">AUSDAV</span>
          </div>
          <div className="nav-menu">
            <button className="nav-item" onClick={onBack}>Tutorials</button>
            <button className="nav-item active">References</button>
            <button className="nav-item" onClick={onViewTags}>Tags</button>
          </div>
          <div className="nav-right">
            {/* username not shown on reference pages */}
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </nav>
      </header>

      <div className="reference-page-container">
        <div className="reference-tabs">
          <button 
            className={`ref-tab ${selectedCategory === 'tags' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('tags')}
          >
            Tags
          </button>
          <button 
            className={`ref-tab ${selectedCategory === 'attributes' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('attributes')}
          >
            Attributes
          </button>
          <button 
            className={`ref-tab ${selectedCategory === 'events' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('events')}
          >
            Events
          </button>
        </div>

        <div className="reference-content-area">
          {selectedCategory === 'tags' && (
            <div className="reference-table-container">
              <h2>HTML Tags Reference</h2>
              <p className="reference-intro">A complete list of all HTML tags in alphabetical order.</p>
              <table className="reference-table">
                <thead>
                  <tr>
                    <th>Tag</th>
                    <th>Description</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {htmlTags.map((item, index) => (
                    <tr key={index}>
                      <td data-label="Tag"><code>{item.tag}</code></td>
                      <td data-label="Description">{item.description}</td>
                      <td data-label="Category"><span className="category-badge">{item.category}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedCategory === 'attributes' && (
            <div className="reference-table-container">
              <h2>HTML Attributes Reference</h2>
              <p className="reference-intro">Common HTML attributes that can be used with most elements.</p>
              <table className="reference-table">
                <thead>
                  <tr>
                    <th>Attribute</th>
                    <th>Description</th>
                    <th>Usage Example</th>
                  </tr>
                </thead>
                <tbody>
                  {htmlAttributes.map((item, index) => (
                    <tr key={index}>
                      <td data-label="Attribute"><code>{item.attribute}</code></td>
                      <td data-label="Description">{item.description}</td>
                      <td data-label="Usage Example"><code className="usage-code">{item.usage}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedCategory === 'events' && (
            <div className="reference-table-container">
              <h2>HTML Events Reference</h2>
              <p className="reference-intro">HTML event attributes used to trigger JavaScript functions.</p>
              <table className="reference-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Description</th>
                    <th>Usage Example</th>
                  </tr>
                </thead>
                <tbody>
                  {htmlEvents.map((item, index) => (
                    <tr key={index}>
                      <td data-label="Event"><code>{item.event}</code></td>
                      <td data-label="Description">{item.description}</td>
                      <td data-label="Usage Example"><code className="usage-code">{item.usage}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
