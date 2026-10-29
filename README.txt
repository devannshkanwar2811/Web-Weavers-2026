CYBERTRACE — Web Weavers 2026 starter website
===========================================
This is a complete, working, offline-friendly, three-page educational website.

START:
1. Extract the entire CyberTrace folder.
2. Open index.html in Chrome, Edge, or another browser.
3. Click Start Investigation, click the suspicious details in the email,
   select Suspicious or Legitimate, and press Generate case report.
4. Use Back/Refresh to test the flow. It runs without a server.

FILES:
index.html        Homepage / introductory content
investigate.html  Interactive investigation
report.html       Evidence and score report
style.css         Layout, colors, responsive design, animations
common.js         Navigation and footer
investigate.js    Interactive clues and verdict logic
report.js         Result generation and scoring

PERSON 1: Edit index.html and style.css; person 2 edits investigate.js and
report.js. Discuss first before editing investigate.html or report.html.

HOW SCORING WORKS:
Each of the four evidence items is worth 15 points (60 points total).
Correctly judging the email suspicious is worth 40 points.
This scoring is educational, not a real security assessment.

SAFETY:
All email addresses, URLs, sender and recipient names are fictional.
No data is collected, transmitted, or saved to a server.

IMPORTANT:
If you use outside images/fonts later, ensure you have permission and
consider whether they will work offline at the competition venue.

VIBE LAYER (added)
==================
vibe.css / vibe.js add the cyberpunk effects on top of the original site:
matrix rain, glitch headings, boot terminal (once per session), custom cursor,
sound effects (toggle bottom-left), live HUD + terminal in the lab, confetti and
ranks on the report. Everything is vanilla JS, offline, no trackers.
Easter egg: Up Up Down Down Left Right Left Right B A.
To remove all effects, delete the vibe.css/vibe.js lines from the HTML files.


NEW FEATURES (October 2026)
- cases.js: ten distinct investigation scenarios shared by the Investigation Lab and Case Report.
- investigate.html + investigate.js: sequential ten-case investigation workflow; each report unlocks the next case.
- The standalone Practice Cases page has been removed; its scenarios now use the original Investigation Lab evidence-board format.
- analyze.html + analyze.js: local, rule-based message screening and browser speech synthesis.
- The analyzer does NOT connect to a generative AI model or remote service. It uses simple phrase matching, so results can be wrong.
- Text and supported uploads (.txt, .eml, .html/.htm, max 500 KB) are read in the browser and are not transmitted or saved by this demo.
- Speech uses the browser SpeechSynthesis API; availability and voice depend on browser/OS settings.
