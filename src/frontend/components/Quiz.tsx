import React, { useState, useEffect } from 'react';

// Modal component for entering school name
const Modal = ({ isOpen, onClose, onSubmit, schoolName, setSchoolName }: { isOpen: boolean, onClose: () => void, onSubmit: () => void, schoolName: string, setSchoolName: (v: string) => void }) => {
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
          <button onClick={onSubmit} style={{ background: 'linear-gradient(90deg,#6a8dff,#7fbcff)', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 16, cursor: 'pointer' }}>Submit</button>
          <button onClick={onClose} style={{ background: '#444', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 16, cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
import { useAuth } from '../context/AuthContext';
import { BackendAPI } from '../../backend/api';
import type { QuestionData } from '../../backend/types';

interface Blank {
  id: string;
  correctAnswer: string;
  explanation?: string;
}

interface QuizQuestion {
  id: number;
  htmlContent: string;
  blanks: Blank[];
  difficulty: 'easy' | 'medium' | 'hard';
}



interface QuizProps {
  questionId: number;
  onBack: () => void;
}

/**
 * Get default explanation for common HTML tags
 */
const getDefaultExplanation = (blankId: string, answer: string): string => {
  const explanations: { [key: string]: string } = {
    'html': 'The <html> tag is the root element that wraps all other elements on the page. It tells the browser that this is an HTML document.',
    'head': 'The <head> tag contains metadata about the document, such as the title, character encoding, and links to stylesheets.',
    'body': 'The <body> tag contains all the visible content of the webpage that users see in the browser.',
    'title': 'The <title> tag specifies the title that appears in the browser tab and is used for SEO.',
    'DOCTYPE': 'The <!DOCTYPE html> declaration tells the browser this is an HTML5 document and should be the first line in your HTML file.',
    'h1': 'The <h1> tag is used for main headings. There should typically be only one <h1> per page.',
    'h2': 'The <h2> tag is used for subheadings and helps organize content hierarchically.',
    'p': 'The <p> tag defines a paragraph of text. It automatically adds spacing above and below the text.',
    'a': 'The <a> tag creates a hyperlink. The href attribute specifies the URL to link to.',
    'img': 'The <img> tag embeds an image. The src attribute specifies the image file path.',
    'div': 'The <div> tag is a generic container used to group elements and apply styling with CSS.',
    'span': 'The <span> tag is an inline container used to apply styling to a portion of text.',
    'ul': 'The <ul> tag creates an unordered (bulleted) list.',
    'ol': 'The <ol> tag creates an ordered (numbered) list.',
    'li': 'The <li> tag defines a list item within <ul> or <ol> tags.',
    'form': 'The <form> tag creates a form for user input. The action attribute specifies where to send the form data.',
    'input': 'The <input> tag creates an interactive field where users can enter data.',
    'button': 'The <button> tag creates a clickable button that can submit forms or trigger actions.',
    'textarea': 'The <textarea> tag creates a multi-line text input field.',
    'label': 'The <label> tag associates text with form inputs, improving accessibility.',
    'table': 'The <table> tag creates a table for organizing data in rows and columns.',
    'tr': 'The <tr> tag defines a table row.',
    'td': 'The <td> tag defines a table data cell.',
    'th': 'The <th> tag defines a table header cell.',
    'header': 'The <header> tag represents the header section of a page or section.',
    'footer': 'The <footer> tag represents the footer section of a page or section.',
    'nav': 'The <nav> tag defines navigation links.',
    'article': 'The <article> tag represents self-contained content like a blog post.',
    'section': 'The <section> tag groups related content together.',
    'main': 'The <main> tag specifies the main content area of a document.',
    'strong': 'The <strong> tag indicates strong importance and displays text in bold. It\'s semantically meaningful.',
    'em': 'The <em> tag indicates emphasized text and displays it in italic. It\'s semantically meaningful.',
    'br': 'The <br> tag creates a line break. It\'s a self-closing tag.',
    'hr': 'The <hr> tag creates a horizontal line to separate content.',
    'meta': 'The <meta> tag provides metadata about the HTML document, like character encoding.',
    'link': 'The <link> tag links external resources like CSS stylesheets to the HTML document.',
    'script': 'The <script> tag embeds or references JavaScript code.',
    'style': 'The <style> tag contains CSS styling rules for the HTML document.',
  };

  return explanations[answer.toLowerCase()] || 
    `The <${answer}> tag is an important HTML element. Review the HTML reference to understand its purpose and proper usage.`;
};

/**
 * Get learning tips for beginners
 */
const getLearnignTip = (blankId: string, answer: string): string => {
  const tips: { [key: string]: string } = {
    'html': 'Every HTML document must start with <html> and end with </html>. Always use lowercase tag names.',
    'head': 'Never put visible content in the <head> - it\'s only for metadata. Put visible content in <body>.',
    'body': 'All content users see goes in the <body> tag. This is where you put headings, paragraphs, images, etc.',
    'title': 'The <title> appears in the browser tab, not on the page. It\'s important for SEO and accessibility.',
    'DOCTYPE': 'Always include <!DOCTYPE html> as the very first line. Without it, the page may not display correctly.',
    'h1': 'Use <h1> for your main page title only. Don\'t skip heading levels (don\'t jump from <h1> to <h3>).',
    'h2': 'Use <h2> for main sections. Proper heading hierarchy helps with accessibility and SEO.',
    'p': 'Use <p> for paragraphs of text. Don\'t use <br> to create multiple lines - that\'s what paragraphs are for.',
    'a': 'Always include the href attribute. href="#" links to nothing - use href="/" or a real URL.',
    'img': 'Always include an alt attribute describing the image. It helps accessibility and appears if the image fails to load.',
    'div': 'Use <div> for layout and grouping. For better structure, consider semantic tags like <section> or <article>.',
    'span': 'Use <span> for styling small inline portions of text, not for large content blocks.',
    'ul': 'Use <ul> for lists without order, like features or ingredients. Use <ol> for step-by-step instructions.',
    'ol': 'Use <ol> for ordered lists. The browser automatically numbers them.',
    'li': 'Every list item must be wrapped in <li> tags. <ul> and <ol> can only contain <li> elements.',
    'form': 'Every form needs a method attribute (GET or POST) and typically an action attribute.',
    'input': 'Always include a type attribute (text, email, password, etc.). Use a label with the for attribute for accessibility.',
    'button': 'If inside a form, the button will submit by default. Use type="button" to prevent submission.',
    'textarea': 'Use <textarea> instead of <input> for multi-line text. <textarea> rows and cols control size.',
    'label': 'Connect labels to inputs using the for attribute matching the input\'s id for better accessibility.',
    'table': 'Use tables for tabular data only, not for layout. Use CSS Grid or Flexbox for page layout.',
    'tr': 'Always nest <tr> in <thead>, <tbody>, or <tfoot> for better semantic structure.',
    'td': 'Use <td> for regular data cells and <th> for header cells. This improves accessibility.',
    'th': '<th> has special semantics for accessibility tools. Don\'t use <td> for headers.',
    'header': 'The <header> tag is semantic and doesn\'t automatically add styling. Use CSS to style it.',
    'footer': 'The <footer> is often used for copyright, links, and other bottom-of-page content.',
    'nav': 'Use <nav> only for major navigation sections. Not every link needs to be in a <nav>.',
    'article': 'Use <article> for self-contained content that makes sense on its own, like blog posts.',
    'section': 'Use <section> to group related content. Each <section> typically has a heading.',
    'main': 'There should be only one <main> element per page. It improves accessibility.',
    'strong': '<strong> and <b> look the same but <strong> is more semantic. Prefer <strong>.',
    'em': '<em> and <i> look the same but <em> is more semantic. Prefer <em>.',
    'br': 'Use <br> sparingly - usually for addresses or poems. Use <p> tags for regular text separation.',
    'hr': 'The <hr> tag represents a thematic break. Don\'t use it for decoration - use CSS borders instead.',
    'meta': 'The charset meta tag should come early in the <head>: <meta charset="UTF-8">',
    'link': 'Link CSS files in the <head> before closing </head> tag. Example: <link rel="stylesheet" href="style.css">',
    'script': 'It\'s often better to put <script> tags at the end of <body> for faster page load.',
    'style': 'While <style> works, it\'s better practice to use external CSS files for reusability.',
  };

  return tips[answer.toLowerCase()] || 
    'Pay attention to when and why you use this tag. Proper semantic HTML makes your code more accessible and maintainable.';
};


export const Quiz = ({ questionId, onBack }: QuizProps) => {
  const { user, logout } = useAuth();
  const [blankValues, setBlankValues] = useState<{ [key: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(1800);
  const [submitted, setSubmitted] = useState(false);
  const [checked, setChecked] = useState(true); // show comparison immediately on load
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
  const [fromTaskPreview] = useState(() => sessionStorage.getItem('studyAreaFromTaskPreview') === 'true');
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(new Set());

  // Modal state for Solve Task
  const [showModal, setShowModal] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Save pentathlon_quiz record (after modal submit)
  const handleSolveTask = async () => {
    setSaving(true);
    setSaveError(null);
    if (!schoolName) {
      setSaveError('Please enter your school name.');
      setSaving(false);
      return;
    }
    try {
      if (!user?.email || !question) {
        setSaveError('Missing required information.');
        setSaving(false);
        return;
      }
      // Save to pentathlon_quiz table
      const { error } = await BackendAPI.supabase.from('pentathlon_quiz').insert({
        school_name: schoolName,
        user_email: user.email,
        score: score,
        question_id: question.id
      });
      if (error) {
        setSaveError(error.message);
      } else {
        setShowModal(false);
        setSchoolName('');
        alert('Task solved and saved!');
      }
    } catch (e: any) {
      setSaveError(e?.message || 'Unknown error');
    }
    setSaving(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleExplanation = (blankId: string) => {
    setExpandedExplanations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blankId)) {
        newSet.delete(blankId);
      } else {
        newSet.add(blankId);
      }
      return newSet;
    });
  };


  // For input blanks UI
  // If autoCheck is true, every change triggers setChecked(true)
  const [autoCheck, setAutoCheck] = useState(false);
  const handleBlankChange = (blankId: string, value: string) => {
    if (!submitted) setBlankValues((prev) => ({ ...prev, [blankId]: value }));
    if (autoCheck) {
      setChecked(true);
    } else if (checked) {
      setChecked(false);
    }
  };

  const handleClear = () => {
    setBlankValues({});
    setChecked(false);
    setSubmitted(false);
    setScore(0);
    setAutoCheck(false);
  };


  const handleCheck = () => {
    setChecked(true);
    setAutoCheck(true);
  };

  // Track per-blank correctness for result display
  const [blankCorrectCount, setBlankCorrectCount] = useState(0);
  const [blankTotalCount, setBlankTotalCount] = useState(0);
  const [blankScore, setBlankScore] = useState(0);
  const handleSubmit = async () => {
    if (!question) return;
    // Build user HTML from blank values
    let userHtml = question.htmlContent;
    question.blanks.forEach(blank => {
      userHtml = userHtml.replace(new RegExp(`__${blank.id}__`, 'g'), blankValues[blank.id] || '');
    });
    const expected = generateHtmlOutput(question.htmlContent, {});
    // normalize whitespace for fair comparison
    const normalize = (str: string) => str.replace(/\s+/g, ' ').trim();
    const u = normalize(userHtml);
    const e = normalize(expected);
    let equal = 0;
    const maxLen = Math.max(u.length, e.length);
    for (let i = 0; i < Math.min(u.length, e.length); i++) {
      if (u[i] === e[i]) equal++;
    }
    const percentage = maxLen === 0 ? 100 : Math.round((equal / maxLen) * 100);
    const isCorrect = percentage >= 80;
    // Per-blank correctness
    let correctBlanks = 0;
    question.blanks.forEach(blank => {
      const userVal = (blankValues[blank.id] || '').trim();
      const correctVal = (blank.correctAnswer || '').trim();
      if (userVal === correctVal) correctBlanks++;
    });
    const totalBlanks = question.blanks.length;
    setBlankCorrectCount(correctBlanks);
    setBlankTotalCount(totalBlanks);
    setBlankScore(totalBlanks > 0 ? Math.round((100 / totalBlanks) * correctBlanks) : 100);
    setScore(percentage);
    setSubmitted(true);
    setAutoCheck(false);
    // Save to user_progress table
    if (user?.id && user?.email) {
      await BackendAPI.quiz.saveProgress(
        user.id,
        user.email,
        question.id,
        isCorrect ? 'correct' : 'wrong'
      );
      console.log('✓ Progress saved to user_progress table');
    }
    // Mark as solved if score >= 80%
    if (isCorrect && user?.id) {
      BackendAPI.storage.markSolved(user.id, question.id);
    }
  };

  const handleTryAgain = async () => {
    if (!question || !user?.id) return;
    setBlankValues({});
    setSubmitted(false);
    setChecked(false);
    setScore(0);
    setIsAlreadyCompleted(false);
    setTimeRemaining(1800);
    setAutoCheck(false);
    try {
      const { error } = await BackendAPI.supabase
        .from('user_progress')
        .update({
          [`question_${question.id}_status`]: null
        })
        .eq('user_id', user.id);
      if (error) {
        console.error('Error resetting progress:', error.message);
      } else {
        console.log(`✓ Question ${question.id} reset to fresh state`);
      }
    } catch (error: any) {
      console.error('Error resetting progress:', error?.message);
    }
  };

  const generateHtmlOutput = (htmlContent: string, blankValues: Record<string, string> = {}): string => {
    let output = htmlContent;
    
    // Replace blanks with provided values or correct answers
    question?.blanks.forEach((blank) => {
      const regex = new RegExp(`__${blank.id}__`, 'g');
      const value = blankValues[blank.id] !== undefined ? blankValues[blank.id] : blank.correctAnswer;
      output = output.replace(regex, value);
    });
    
    // inject a small style block so preview iframe text is always white
    // this is required because the iframe renders arbitrary HTML from the question,
    // which may contain its own colors. we override it for visibility on dark background.
    const style = `<style>html,body, * { color: #ffffff !important; background: transparent !important; }</style>`;
    return style + output;
  };

  // extract what user typed for a specific blank
  const getUserAnswerForBlank = (blank: Blank): string => {
    return blankValues[blank.id] || '';
  };

  // Load question from database
  useEffect(() => {
    const loadQuestion = async () => {
      setLoading(true);
      const questionData = await BackendAPI.questions.getById(questionId);
      setQuestion(questionData);
      
      // initialize editor with minimal skeleton; user types everything manually
      if (questionData) {
        // setUserCode removed: now using blankValues for all input
        setChecked(true);            // display comparison panels by default
        handleCheck();              // run check logic to populate output frames
      }

      // Check if question is already completed correctly
      if (user?.id && questionData) {
        const { data, error } = await BackendAPI.supabase
          .from('user_progress')
          .select()
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          const statusKey = `question_${questionId}_status` as keyof typeof data;
          const status = data[statusKey];
          
          if (status === 'correct') {
            // fill entire code with expected output so textarea shows correct version
            // setUserCode removed: now using blankValues for all input
            setIsAlreadyCompleted(true);
            setSubmitted(true);
            setScore(100);
            console.log('✓ Question already completed correctly');
          }
        }
      }
      
      setLoading(false);
      console.log('✓ Question loaded:', questionData?.title);
    };

    loadQuestion();
  }, [questionId, user?.id]);

  // Timer effect - must be before conditional returns
  useEffect(() => {
    if (loading || !question || submitted) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, question, submitted]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#ffffff', marginBottom: '20px' }}>Loading question...</div>
          <div style={{ width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  if (!question) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#ffffff' }}>Question not found</div>;
  }



  // Render input fields for all blanks in all questions
  const renderHtmlWithInputs = () => {
    if (!question) return null;
    // Split by lines, then for each line, split by blanks and render
    return question.htmlContent.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(__[A-Za-z0-9_]+__)/g);
      return (
        <div key={lineIdx} style={{ fontFamily: 'monospace', fontSize: 16, background: 'transparent', color: '#fff', padding: 0, borderRadius: 0, lineHeight: 1.5 }}>
          {parts.map((part, idx) => {
            const match = part.match(/^__([A-Za-z0-9_]+)__$/);
            if (match) {
              const blankId = match[1];
              return (
                <input
                  key={blankId + idx}
                  type="text"
                  value={blankValues[blankId] || ''}
                  onChange={e => handleBlankChange(blankId, e.target.value)}
                  disabled={submitted}
                  style={{
                    width: 80,
                    margin: '0 4px',
                    display: 'inline-block',
                    background: '#23272e',
                    color: '#d4d4d4',
                    border: '1px solid #444',
                    borderRadius: 4,
                    fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                    fontSize: 15,
                    outline: 'none',
                    boxShadow: 'none',
                    padding: '2px 6px',
                  }}
                  placeholder={blankId.replace('BLANK_', 'Blank ')}
                />
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </div>
      );
    });
  };

  // Render for all questions: input fields for blanks
  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <div className="header-left">
          <h1>HTML Practice - Q{question.id-30}</h1>
        </div>
        <div className="header-center">
          <div className="timer">
            <span className="timer-label">Time Remaining:</span>
            <span className="timer-value">{formatTime(timeRemaining)}</span>
          </div>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="quiz-content">
        <div className="quiz-center">
          <div className="html-preview">
            <h2>HTML Editor (Blanks)</h2>
            <div
              className="code-display"
              style={{
                fontFamily: 'Fira Mono, Menlo, Monaco, Consolas, monospace',
                fontSize: 15,
                background: '#1e1e1e',
                color: '#d4d4d4',
                padding: '18px 20px',
                borderRadius: 8,
                border: '1px solid #333',
                boxShadow: '0 2px 8px #0002',
                marginBottom: 12,
                overflowX: 'auto',
                minHeight: 320,
                maxHeight: 600,
                lineHeight: 1.6,
                whiteSpace: 'pre',
              }}
            >
              {renderHtmlWithInputs()}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 12 }}>
              <button className="clear-btn" onClick={handleClear} style={{ minWidth: 90 }}>Clear</button>
              <button className="check-btn" onClick={handleCheck} disabled={checked} style={{ minWidth: 90 }}>
                {checked ? '✓ Checked' : 'Check'}
              </button>
              <button className="submit-btn" onClick={handleSubmit} disabled={submitted} style={{ minWidth: 90 }}>Submit</button>
              <div style={{ flex: 1 }} />
              <button
                className="back-button"
                style={{ minWidth: 180, marginLeft: 'auto', background: 'linear-gradient(90deg,#6a8dff,#7fbcff)', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 24px', boxShadow: '0 2px 8px #0001', cursor: 'pointer' }}
                onClick={() => {
                  sessionStorage.removeItem('studyAreaFromTaskPreview');
                  onBack();
                }}
              >
                ← Back to {fromTaskPreview ? 'Task Preview' : 'Questions'}
              </button>
            </div>
          </div>

          <div className="blanks-section">
            {checked && !submitted ? (
              <div className="output-comparison">
                <div className="output-box">
                  <div className="output-header">
                    <h3>Your Output</h3>
                  </div>
                  <div className="output-content">
                    <iframe
                      srcDoc={(() => {
                        if (!question) return '';
                        let html = question.htmlContent;
                        question.blanks.forEach(blank => {
                          html = html.replace(new RegExp(`__${blank.id}__`, 'g'), blankValues[blank.id] || '');
                        });
                        // inject style for white text
                        return `<style>html,body, * { color: #ffffff !important; background: transparent !important; }</style>` + html;
                      })()}
                      title="Your Output"
                      style={{ width: '100%', height: '250px', border: 'none', borderRadius: '4px' }}
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </div>
                </div>
                <div className="output-box">
                  <div className="output-header">
                    <h3>Expected Output</h3>
                  </div>
                  <div className="output-content">
                    <iframe
                      srcDoc={(() => {
                        if (!question) return '';
                        // Build expected HTML by filling blanks with correct answers
                        let html = question.htmlContent;
                        question.blanks.forEach(blank => {
                          html = html.replace(new RegExp(`__${blank.id}__`, 'g'), blank.correctAnswer);
                        });
                        // inject style for white text
                        return `<style>html,body, * { color: #ffffff !important; background: transparent !important; }</style>` + html;
                      })()}
                      title="Expected Output"
                      style={{ width: '100%', height: '250px', border: 'none', borderRadius: '4px' }}
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="instructions-box">
                <h2>Instructions</h2>
                <p>Fill in all blanks above, then click <strong>Check</strong> or <strong>Submit</strong>.</p>
              </div>
            )}
          </div>

          {submitted && (
            <div className="result-box">
              {/* Completion Status Banner */}
              {score === 100 ? (
                <div className="completion-banner success">
                  <div className="banner-icon">🎉</div>
                  <div className="banner-content">
                    <h2>Perfect Score! Task Completed!</h2>
                    <p>Congratulations! You got all answers correct. Excellent work!</p>
                  </div>
                </div>
              ) : score >= 80 ? (
                <div className="completion-banner passed">
                  <div className="banner-icon">✅</div>
                  <div className="banner-content">
                    <h2>Task Completed Successfully!</h2>
                    <p>Great job! You passed with a good score. Review the explanations below to learn more.</p>
                  </div>
                </div>
              ) : (
                <div className="completion-banner failed">
                  <div className="banner-icon">📝</div>
                  <div className="banner-content">
                    <h2>Task Incomplete - Try Again</h2>
                    <p>You need at least 80% to complete this task. Review the explanations and try again!</p>
                  </div>
                </div>
              )}

              <div className="result-header">
                <h3>📊 Quiz Results</h3>
                <div className="score-display">
                  <p>Correct blanks: <strong>{blankCorrectCount} / {blankTotalCount}</strong></p>
                  <p>Per-blank score: <strong>{blankScore}%</strong></p>
                </div>
              </div>

              {/* we no longer display per-blank explanations when using full-code comparison */}

              {/* Action Buttons */}
              <div className="result-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                <button
                  className="solve-task-btn"
                  style={{
                    background: 'linear-gradient(90deg,#6a8dff,#7fbcff)',
                    color: '#fff',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: 12,
                    padding: '16px 36px',
                    fontSize: 20,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #0002',
                    margin: '0 auto',
                    minWidth: 200
                  }}
                  onClick={() => {
                    setShowModal(true);
                    setSchoolName('');
                    setSaveError(null);
                  }}
                >
                  Solve This Task
                </button>
              </div>
              {/* Modal for entering school name */}
              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleSolveTask}
                schoolName={schoolName}
                setSchoolName={setSchoolName}
              />
              {saveError && <div style={{ color: 'red', marginTop: 8 }}>{saveError}</div>}
              {saving && <div style={{ color: '#fff', marginTop: 8 }}>Saving...</div>}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
