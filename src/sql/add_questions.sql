-- SQL script to insert additional questions
-- Run this file against your database to add the examples shown during the session.

-- Q31 Travel Blog – Heading Tags
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  31,
  'Travel Blog 	6 Heading Tags',
  'Read the travel blog snippet and fill in the two missing heading tags.',
  'easy',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Travel Blog</title>
</head>
<body>
    <h1>Adventures Around the World</h1>

    <h2>Exploring Europe</h2>
    <p>Europe offers a rich blend of history, culture, and cuisine.</p>

    <__BLANK_1__>France</__BLANK_1__>
    <p>From the Eiffel Tower in Paris to the lavender fields in Provence, France is magical.</p>

    <__BLANK_2__>Italy</__BLANK_2__>
    <p>Italy is famous for its art, architecture, and delicious pasta dishes.</p>

    <h5>Adventures in Asia</h5>
    <p>Asia offers diverse landscapes, from bustling cities to serene temples.</p>

    <h6>Japan</h6>
    <p>Experience cherry blossoms in spring and traditional tea ceremonies.</p>

</body>
</html>
$$,
  2
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (31, 'BLANK_1', 'h3', 1),
  (31, 'BLANK_2', 'h4', 2)
ON CONFLICT DO NOTHING;

-- Q32 Sunrise Restaurant – Heading Tags
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  32,
  'Restaurant Description 	6 Heading Tags',
  'Read the restaurant page snippet and fill in the two missing heading tags.',
  'easy',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Sunrise Restaurant Menu</title>
</head>
<body>

    <h1>Sunrise Restaurant Menu</h1>

    <h2>Starters</h2>
    <p>Welcome to Sunrise Restaurant, where we serve freshly prepared meals made with locally sourced ingredients. 
    Our goal is to provide a warm and friendly dining experience for families, friends, and food lovers. 
    We combine traditional recipes with modern flavors to create dishes that satisfy every taste.</p>

    <h2>Main Course</h2>
    <p>Our menu features a wide variety of dishes including fresh salads, homemade pasta, grilled specialties, 
    and delicious desserts. We also offer vegetarian and vegan options to ensure that every guest 
    can enjoy a satisfying meal. Seasonal specials are introduced regularly to keep our offerings exciting and unique.</p>

    <h3>Our Menu</h3>
    <p>Some of our customer favorites include creamy Alfredo pasta, wood-fired pizza, and our signature chocolate lava cake. 
    Each dish is carefully prepared using high-quality ingredients to deliver exceptional flavor and presentation.</p>

    <h4>Popular Dishes</h4>
    <p>Some of our customer favorites include creamy Alfredo pasta, wood-fired pizza, and our signature chocolate lava cake. 
    Each dish is carefully prepared using high-quality ingredients to deliver exceptional flavor and presentation.</p>

    <h6>Contact Us</h6>
    <p>We are open seven days a week and welcome reservations for special occasions, birthday parties, 
    and corporate events. Visit us at our downtown location or call us to book a table. 
    We look forward to serving you and making your dining experience truly memorable.</p>

</body>
</html>
$$,
  2
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (32, 'BLANK_1', 'h1', 1),
  (32, 'BLANK_2', 'p', 2)
ON CONFLICT DO NOTHING;

-- Q33 Centered Image – Layout Tags
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  33,
  'Centered Image 	6 Layout Tags',
  'Read the HTML and fill in the missing layout tags around the image.',
  'easy',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Centered Image</title>
</head>
<body bgcolor="lightyellow">

    <h1 align="center">My Favorite Image</h1>
    
    <center>
        <!-- local file paths are blocked by browser; use hosted image or placeholder -->
        <img src="https://via.placeholder.com/400x300" alt="Sample Image" width="400" height="300">
        <p><i><b><u>Favourite Image</u></b></i></p>
    </center>

</body>
</html>
$$,
  2
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (33, 'BLANK_1', 'h1', 1),
  (33, 'BLANK_2', 'p', 2)
ON CONFLICT DO NOTHING;

-- Q34 Scenery Description – Heading Tags (easy)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  34,
  'Scenery Description 	6 Heading Tags',
  'Fill in paragraph and heading tags for the scenery page.',
  'easy',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Beautiful Scenery</title>
</head>
<body>

    <center>
        <h1>Beautiful Scenery</h1>
    </center>

    <!-- replace with a real image hosted by app or external URL -->
    <img src="https://via.placeholder.com/500x300" width="500" height="300">

    <P>The village is a peaceful haven surrounded by green hills and colorful gardens. A clear river winds through the fields, reflecting the sunlight, while birds sing and flowers bloom all around. The fresh air and calm scenery make it a perfect escape from city life.</p>
</body>
</html>
$$,
  2
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (34, 'BLANK_1', 'h1', 1),
  (34, 'BLANK_2', 'p', 2)
ON CONFLICT DO NOTHING;

-- Q35 Course Page – Structure Tags (easy)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  35,
  'Course Page 	6 Structure Tags',
  'Look at the course page and fill in the missing heading and ordered-list tags.',
  'easy',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Computer Science Course</title>
</head>
<body>

    <__BLANK_1__><b>Introduction to Computer Science</b></__BLANK_1__>

    <h2>Course Topics</h2>
    <ul>
        <li>Basics of Programming</li>
        <li>Data Structures</li>
        <li>Web Development</li>
        <li>Database Management</li>
    </ul>

    <h2>Required Materials</h2>
    <ul>
        <li>Laptop</li>
        <li>Notebook</li>
        <li>Programming Textbook</li>
    </ul>

    <h2>Steps to Enroll</h2>
    <__BLANK_2__>
        <li>Fill out the online application form.</li>
        <li>Submit required documents.</li>
        <li>Pay the registration fee.</li>
        <li>Receive confirmation email.</li>
    </__BLANK_2__>

</body>
</html>
$$,
  2
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (35, 'BLANK_1', 'h1', 1),
  (35, 'BLANK_2', 'ol', 2)
ON CONFLICT DO NOTHING;

-- Q36 Navbar Links – Anchor Tags (medium)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  36,
  'Navbar Links 	6 Anchor Tags',
  'Complete the beginner navbar by filling in the missing heading and link tags.',
  'medium',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Simple Beginner Navbar</title>
</head>
<body bgcolor="lightyellow">

    <__BLANK_1__>My Simple Website</__BLANK_1__>

    <!-- Navigation Bar using Links -->
    <a href="#home">Home</a> | 
    <__BLANK_2__ href="#about">About</__BLANK_2__> | 
    <a href="#services">Services</a> | 
    <a href="#contact">Contact</a>

    <!-- Sections -->
    <h2 id="home">Home Section</h2>
    <p>Welcome to the Home section. This is where your main content goes.</p>

    <h2 id="about">About Section</h2>
    <p>About section tells users what your website is about.</p>

    <h2 id="services">Services Section</h2>
    <p>This section shows the services you provide.</p>

    <h2 id="contact">Contact Section</h2>
    <p>Here you can show how to contact you.</p>

</body>
</html>
$$,
  2
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (36, 'BLANK_1', 'h1', 1),
  (36, 'BLANK_2', 'a', 2)
ON CONFLICT DO NOTHING;

-- Q37 Navbar Page – Buttons & Heading (medium)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  37,
  'Navbar Page 	6 Buttons & Heading',
  'Study the simple navbar layout and fill in the missing heading and button tags.',
  'medium',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Simple Navbar with Buttons</title>
</head>
<body bgcolor="lightyellow">

    <__BLANK_1__>My Simple Website</__BLANK_1__>

    <!-- Navigation Bar using Buttons -->
    <button onclick="location.href='#home'">Home</button>
    <__BLANK_2__ onclick="location.href='#about'">About</__BLANK_2__>
    <button onclick="location.href='#services'">Services</button>
    <button onclick="location.href='#contact'">Contact</button>

    <!-- Sections -->
    <h2 id="home">Home Section</h2>
    <p>Welcome to the Home section. This is the main content area.</p>

    <h2 id="about">About Section</h2>
    <p>The About section tells users what your website is about.</p>

    <h2 id="services">Services Section</h2>
    <p>This section shows the services you provide.</p>

    <h2 id="contact">Contact Section</h2>
    <p>Here is the Contact section where users can get in touch.</p>

</body>
</html>
$$,
  2
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (37, 'BLANK_1', 'h1', 1),
  (37, 'BLANK_2', 'button', 2)
ON CONFLICT DO NOTHING;

-- Q38 Table Example – Markup Tags (medium)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  38,
  'Table Example 	6 Markup Tags',
  'Fill in the missing heading and table tags in the score sheet HTML.',
  'medium',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Simple Table Example</title>
</head>
<body>

    <__BLANK_1__>Student Scores</__BLANK_1__>

    <__BLANK_2__ border="1">
        <tr>
            <th>Name</th>
            <th>Subject</th>
            <th>Score</th>
        </tr>
        <tr>
            <td>Alice</td>
            <td>Math</td>
            <td>95</td>
        </tr>
        <tr>
            <td>Bob</td>
            <td>Science</td>
            <td>88</td>
        </tr>
        <tr>
            <td>Charlie</td>
            <td>English</td>
            <td>92</td>
        </tr>
    </__BLANK_2__>

</body>
</html>
$$,
  2
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (38, 'BLANK_1', 'h1', 1),
  (38, 'BLANK_2', 'table', 2)
ON CONFLICT DO NOTHING;

-- Q39 School Timetable – Table & Heading (medium)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  39,
  'School Timetable 	6 Table & Heading',
  'Fill in the missing heading and table tags in the weekly timetable HTML.',
  'medium',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>School Timetable</title>
</head>
<body>

    <__BLANK_1__>Weekly School Timetable</__BLANK_1__>

    <__BLANK_2__ border="1" cellspacing="0" cellpadding="10">
        <tr bgcolor="#ffcccb">
            <th>Time</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
        </tr>
        <tr bgcolor="#e6f7ff">
            <td>9:00 - 10:00</td>
            <td>Math</td>
            <td>English</td>
            <td>Science</td>
            <td>Math</td>
            <td>Art</td>
        </tr>
        <tr bgcolor="#fff2cc">
            <td>10:00 - 11:00</td>
            <td>History</td>
            <td>Math</td>
            <td>English</td>
            <td>Science</td>
            <td>Physical Ed.</td>
        </tr>
        <tr bgcolor="#e6f7ff">
            <td>11:00 - 12:00</td>
            <td>Science</td>
            <td>Art</td>
            <td>Math</td>
            <td>English</td>
            <td>History</td>
        </tr>
        <tr bgcolor="#fff2cc">
            <td>12:00 - 1:00</td>
            <td>Lunch</td>
            <td>Lunch</td>
            <td>Lunch</td>
            <td>Lunch</td>
            <td>Lunch</td>
        </tr>
        <tr bgcolor="#e6f7ff">
            <td>1:00 - 2:00</td>
            <td>English</td>
            <td>Science</td>
            <td>Art</td>
            <td>Math</td>
            <td>Music</td>
        </tr>
    </__BLANK_2__>

</body>
</html>
$$,
  2
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (39, 'BLANK_1', 'h1', 1),
  (39, 'BLANK_2', 'table', 2)
ON CONFLICT DO NOTHING;

-- Q40 Restaurant Menu Card – Advanced Table (hard)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  40,
  'Menu Card 	6 Advanced Table',
  'Examine the menu card and complete the three missing tags.',
  'hard',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Restaurant Menu Card</title>
</head>
<body bgcolor="lightyellow">
    <h1 align="center">Pizza Palace Menu</h1>
    <table border="1">
        <tr><th>Item</th><th>Price</th></tr>
        <__BLANK_1__>
        <tr><td>Cheeseburger</td><td>$5</td></tr>
        </__BLANK_1__>
        <tr><td>Fries</td><td>$2</td></tr>
        <tr><td>Soda</td><td>$1</td></tr>
    </table>
</body>
</html>
$$,
  3
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (40, 'BLANK_1', 'tr', 1),
  (40, 'BLANK_2', 'h1', 2),
  (40, 'BLANK_3', 'table', 3)
ON CONFLICT DO NOTHING;

-- Q41 Weekly Health Tracker 	6 Table Layout (hard)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  41,
  'Weekly Health Tracker 	6 Table Layout',
  'Complete the tracker by filling missing heading and table row tags.',
  'hard',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Health Tracker</title>
</head>
<body>
    <h1>Weekly Health Tracker</h1>
    <table border="1">
        <tr><th>Day</th><th>Activity</th><th>Steps</th></tr>
        <__BLANK_1__>
        <tr><td>Monday</td><td>Walking</td><td>7000</td></tr>
        </__BLANK_1__>
        <tr><td>Tuesday</td><td>Jogging</td><td>8000</td></tr>
        <tr><td>Wednesday</td><td>Yoga</td><td>4000</td></tr>
    </table>
</body>
</html>
$$,
  1
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (41, 'BLANK_1', 'tr', 1)
ON CONFLICT DO NOTHING;

-- Q42 Academic Subjects 	6 Table & Heading (hard)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  42,
  'Academic Subjects 	6 Table & Heading',
  'Fill in missing heading and table tag for subject list.',
  'hard',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Subjects List</title>
</head>
<body>
    <__BLANK_1__>Subjects Offered</__BLANK_1__>
    <table>
        <__BLANK_2__>
            <tr><td>Math</td></tr>
            <tr><td>Science</td></tr>
            <tr><td>History</td></tr>
        </__BLANK_2__>
    </table>
</body>
</html>
$$,
  2
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (42, 'BLANK_1', 'h1', 1),
  (42, 'BLANK_2', 'tbody', 2)
ON CONFLICT DO NOTHING;

-- Q43 Chat App Layout 	6 Div Structure (hard)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  43,
  'Chat App Layout 	6 Div Structure',
  'Complete the chat app skeleton with div container tags.',
  'hard',
  $$
<!DOCTYPE html>
<html>
<head>
    <title>Chat Application</title>
</head>
<body>
    <div class="chat-container">
        <__BLANK_1__>
            <h2>Messages</h2>
        </__BLANK_1__>
        <div class="chat-input">
            <input type="text" placeholder="Type a message"/>
            <button>Send</button>
        </div>
    </div>
</body>
</html>
$$,
  1
) ON CONFLICT DO NOTHING;

INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position)
VALUES
  (43, 'BLANK_1', 'div', 1)
ON CONFLICT DO NOTHING;