import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HTML_TAGS_REFERENCE } from '../utils/htmlTagsReference';

interface TagsPageProps {
  onBack: () => void;
  onViewReferences: () => void;
}

const getRenderingExample = (tagName: string): string => {
  const examples: { [key: string]: string } = {
    'h1': '<h1>This is a Heading 1</h1><p>Main title of the page</p>',
    'h2': '<h2>This is a Heading 2</h2><p>Subheading - smaller than H1</p>',
    'h3': '<h3>This is a Heading 3</h3><p>Sub-subheading</p>',
    'p': '<p>This is a paragraph. Paragraphs have space above and below them.</p><p>This is another paragraph.</p>',
    'strong': '<p>This is <strong>very important text</strong> in a sentence.</p>',
    'em': '<p>This is <em>emphasized text</em> in a sentence.</p>',
    'a': '<a href="https://example.com" style="color: blue; text-decoration: underline;">Click here to visit Example.com</a>',
    'img': '<img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Crect fill=%27%23ddd%27 width=%27100%27 height=%27100%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%23999%27 font-size=%2714%27%3EImage%3C/text%3E%3C/svg%3E" alt="Sample Image" style="width: 100px; border: 1px solid #ccc;">',
    'br': '<p>Line 1<br>Line 2<br>Line 3</p>',
    'hr': '<p>Content before the line</p><hr style="border: none; border-top: 2px solid #999;"><p>Content after the line</p>',
    'ul': '<ul style="margin-left: 20px;"><li>First item</li><li>Second item</li><li>Third item</li></ul>',
    'ol': '<ol style="margin-left: 20px;"><li>First step</li><li>Second step</li><li>Third step</li></ol>',
    'div': '<div style="background: #f0f0f0; padding: 20px; border: 1px solid #ccc; margin: 10px 0;">This is a div container</div>',
    'span': '<p>This is a <span style="background: #ffff00; padding: 2px 4px;">highlighted span</span> in text.</p>',
    'button': '<button style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Click Me</button>',
    'input': '<input type="text" placeholder="Enter your name" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; width: 200px;">',
    'table': '<table style="border-collapse: collapse; width: 100%;"><tr><th style="border: 1px solid #ddd; padding: 8px; background: #f0f0f0;">Name</th><th style="border: 1px solid #ddd; padding: 8px; background: #f0f0f0;">Age</th></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">John</td><td style="border: 1px solid #ddd; padding: 8px;">25</td></tr></table>',
  };

  return examples[tagName.toLowerCase()] || `<${tagName}>Content</${tagName}>`;
};

export const TagsPage = ({ onBack, onViewReferences }: TagsPageProps) => {
  const { user, logout } = useAuth();
  const [expandedTag, setExpandedTag] = useState<string | null>(null);


  // show all tags (no filtering)
  const filteredTags = HTML_TAGS_REFERENCE;

  return (
    <div className="study-container">
      <header className="study-header">
        <nav className="w3schools-nav">
          <div className="nav-logo">
            <span className="logo-text">AUSDAV</span>
          </div>
          <div className="nav-menu">
            <button className="nav-item" onClick={onBack}>Tutorials</button>
            <button className="nav-item" onClick={onViewReferences}>References</button>
            <button className="nav-item active">Tags</button>
          </div>
          <div className="nav-right">
            {/* username hidden on tags page */}
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </nav>
      </header>

      <div className="page-header">
        <div className="page-title">
          <h1>HTML Tags Reference</h1>
          <p>Browse and search all HTML tags with examples</p>
        </div>
      </div>

      <div className="tags-page-container">
        {/* no controls: all tags shown regardless of category */}

        {filteredTags.length === 0 ? (
          <div className="no-results">
            <p>No tags found.</p>
          </div>
        ) : (
          <div className="tags-list">
            {filteredTags.map(tag => (
              <div key={tag.name} className="tag-card">
                <div className="tag-header-clickable" onClick={() => setExpandedTag(expandedTag === tag.name ? null : tag.name)}>
                  <span className="tag-expand-icon">{expandedTag === tag.name ? '▼' : '▶'}</span>
                  <div className="tag-header">
                    <h3 className="tag-name">&lt;{tag.name}&gt;</h3>
                    <span className="tag-category">{tag.category}</span>
                  </div>
                </div>
                <p className="tag-description">{tag.description}</p>
                
                {tag.syntax && (
                  <div className="tag-syntax">
                    <strong>Syntax:</strong>
                    <code>{tag.syntax}</code>
                  </div>
                )}

                {tag.commonAttributes && tag.commonAttributes.length > 0 && (
                  <div className="tag-attributes">
                    <strong>Common Attributes:</strong>
                    <div className="attribute-list">
                      {tag.commonAttributes.map((attr: string, i: number) => (
                        <span key={i} className="attribute-badge">{attr}</span>
                      ))}
                    </div>
                  </div>
                )}

                {tag.example && (
                  <div className="tag-example">
                    <strong>Example:</strong>
                    <pre><code>{tag.example}</code></pre>
                  </div>
                )}

                {tag.notes && (
                  <div className="tag-notes">
                    <strong>💡 Note:</strong> {tag.notes}
                  </div>
                )}

                {expandedTag === tag.name && (
                  <div className="tag-rendering">
                    <strong>Visual Preview:</strong>
                    <div 
                      className="rendering-container"
                      dangerouslySetInnerHTML={{ __html: getRenderingExample(tag.name) }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
