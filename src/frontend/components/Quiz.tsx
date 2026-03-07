import React, { useState, useEffect } from 'react';
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
  // store full HTML including blank markers; user types over blanks manually
  const [userCode, setUserCode] = useState('');
  // populate output when question loads

  const [timeRemaining, setTimeRemaining] = useState(1800);
  const [submitted, setSubmitted] = useState(false);
  const [checked, setChecked] = useState(true); // show comparison immediately on load
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
  const [fullscreenCard, setFullscreenCard] = useState<'your' | 'expected' | null>(null);
  const [fromTaskPreview] = useState(() => sessionStorage.getItem('studyAreaFromTaskPreview') === 'true');
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(new Set());
  // hint state removed per request

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

  // hint functionality has been removed; users now type entire code manually

  const handleCodeChange = (value: string) => {
    setUserCode(value);
    if (checked) {
      setChecked(false);
    }
  };

  const handleClear = () => {
    // reset editor to fresh skeleton
    setUserCode('<!DOCTYPE html>\n<html>\n</html>');
    setChecked(false);
    setSubmitted(false);
    setScore(0);
  };

  const handleCheck = () => {
    setChecked(true);
  };
  const handleSubmit = async () => {
    if (!question) return;

    // compare entire userCode against expected complete HTML
    const expected = generateHtmlOutput(question.htmlContent, {});

    // normalize whitespace for fair comparison
    const normalize = (str: string) => str.replace(/\s+/g, ' ').trim();
    const u = normalize(userCode);
    const e = normalize(expected);

    // count matching characters up to the longer length
    let equal = 0;
    const maxLen = Math.max(u.length, e.length);
    for (let i = 0; i < Math.min(u.length, e.length); i++) {
      if (u[i] === e[i]) equal++;
    }
    const percentage = maxLen === 0 ? 100 : Math.round((equal / maxLen) * 100);
    const isCorrect = percentage >= 80;

    setScore(percentage);
    setSubmitted(true);
    setFullscreenCard('expected');

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

    // Reset all states to start fresh
    setUserCode('<!DOCTYPE html>\n<html>\n</html>');
    setSubmitted(false);
    setChecked(false);
    setScore(0);
    setIsAlreadyCompleted(false);
    setTimeRemaining(1800);

    // Reset question status to NULL in user_progress
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
    
    return output;
  };

  // extract what user typed for a specific blank by looking at where placeholder was
  const getUserAnswerForBlank = (blank: Blank): string => {
    if (!question) return '';
    const placeholder = `__${blank.id}__`;
    const idx = question.htmlContent.indexOf(placeholder);
    if (idx === -1) return '';
    const prefix = question.htmlContent.slice(0, idx);
    const suffix = question.htmlContent.slice(idx + placeholder.length);
    // find prefix position in userCode
    const start = userCode.indexOf(prefix);
    if (start === -1) return '';
    const afterPrefix = start + prefix.length;
    const end = userCode.indexOf(suffix, afterPrefix);
    if (end === -1) {
      return userCode.slice(afterPrefix).trim();
    }
    return userCode.slice(afterPrefix, end).trim();
  };

  // Load question from database
  useEffect(() => {
    const loadQuestion = async () => {
      setLoading(true);
      const questionData = await BackendAPI.questions.getById(questionId);
      setQuestion(questionData);
      
      // initialize editor with minimal skeleton; user types everything manually
      if (questionData) {
        setUserCode('<!DOCTYPE html>\n<html>\n</html>');
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
            setUserCode(generateHtmlOutput(questionData.htmlContent, {}));
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
          <div style={{ fontSize: '18px', color: '#667eea', marginBottom: '20px' }}>Loading question...</div>
          <div style={{ width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  if (!question) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>Question not found</div>;
  }


  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <div className="header-left">
          <h1>Quiz Practice - Q{question.id}</h1>
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
            <h2>HTML Editor / Preview</h2>
            <div className="code-display">
              <textarea
                className="code-editor"
                value={userCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Type the complete HTML here, replacing the __BLANK_x__ placeholders with your answers"
                disabled={submitted}
                rows={15}
              />
              {/* blank hints removed; user types entire HTML directly */}
            </div>
            <div className="button-group">
              <button className="clear-btn" onClick={handleClear}>Clear</button>
              <button className="check-btn" onClick={handleCheck} disabled={checked}>
                {checked ? '✓ Checked' : 'Check'}
              </button>
              <button className="submit-btn" onClick={handleSubmit}>Submit</button>
              <button className="show-answer-btn secondary" onClick={() => {
                if (question) {
                  const expected = generateHtmlOutput(question.htmlContent, {});
                  setUserCode(expected);
                  setChecked(true);
                  // do NOT mark as submitted or set score; this is just a preview
                }
              }}>Show Answer</button>
            </div>
            <button className="back-button" onClick={() => {
              sessionStorage.removeItem('studyAreaFromTaskPreview');
              onBack();
            }}>← Back to {fromTaskPreview ? 'Task Preview' : 'Questions'}</button>
          </div>

          <div className="blanks-section">
            {/* always render overlays if user requested fullscreen */}
            {fullscreenCard === 'your' && (
              <div className="fullscreen-overlay">
                <div className="fullscreen-card">
                  <button className="fullscreen-close" onClick={() => setFullscreenCard(null)}>✕ Close</button>
                  <div className="fullscreen-content">
                    <iframe
                      srcDoc={userCode}
                      title="Your Output"
                      style={{ width: '100%', height: 'auto', border: 'none', borderRadius: '4px' }}
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </div>
                </div>
              </div>
            )}

            {fullscreenCard === 'expected' && (
              <div className="fullscreen-overlay">
                <div className="fullscreen-card">
                  <button className="fullscreen-close" onClick={() => setFullscreenCard(null)}>✕ Close</button>
                  <div className="fullscreen-content">
                    <iframe
                      srcDoc={generateHtmlOutput(question.htmlContent, {})}
                      title="Expected Output"
                      style={{ width: '100%', height: 'auto', border: 'none', borderRadius: '4px' }}
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </div>
                </div>
              </div>
            )}

            {checked && !submitted ? (
              <div className="output-comparison">
                <div className="output-box">
                  <div className="output-header">
                    <h3>Your Output</h3>
                    <button className="fullscreen-btn" onClick={() => setFullscreenCard('your')} title="Fullscreen">⛶</button>
                  </div>
                  <div className="output-content">
                    <iframe
                      srcDoc={userCode}
                      title="Your Output"
                      style={{ width: '100%', height: '200px', border: 'none', borderRadius: '4px' }}
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </div>
                </div>
                <div className="output-box">
                  <div className="output-header">
                    <h3>Expected Output</h3>
                    <button className="fullscreen-btn" onClick={() => setFullscreenCard('expected')} title="Fullscreen">⛶</button>
                  </div>
                  <div className="output-content">
                    <iframe
                      srcDoc={generateHtmlOutput(question.htmlContent, {})}
                      title="Expected Output"
                      style={{ width: '100%', height: '200px', border: 'none', borderRadius: '4px' }}
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2>Instructions</h2>
                <p>Please type the complete HTML code above, then click <strong>Check</strong> or <strong>Submit</strong>.</p>
              </>
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
                    <p>Similarity to expected code: <strong className={score === 100 ? 'perfect-score' : score >= 80 ? 'good-score' : 'needs-improvement'}>{Math.round(score)}%</strong></p>
                  </div>
                </div>

                {/* we no longer display per-blank explanations when using full-code comparison */}

                {/* Action Buttons */}
                <div className="result-actions">
                  {score >= 80 ? (
                    <>
                      <button className="next-question-btn" onClick={onBack}>
                        ✓ Task Finished - View All Questions
                      </button>
                      <button className="try-again-btn secondary" onClick={handleTryAgain}>
                        Practice Again
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="try-again-btn primary" onClick={handleTryAgain}>
                        🔄 Try Again to Complete Task
                      </button>
                      <button className="back-to-questions-btn" onClick={onBack}>
                        Back to Questions
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    
  );
};
