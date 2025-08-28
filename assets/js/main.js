// Enhanced Terminal System with Website Navigation
const fileSystem = {
    '/': ['about', 'experience', 'education', 'projects', 'contact', 'skills', 'resume.pdf', 'home'],
    '/about': ['bio.txt', 'skills.json', 'interests.md', 'timeline.log'],
    '/experience': ['current_roles.txt', 'research.txt', 'teaching.txt', 'mentorship.txt'],
    '/education': ['uic.txt', 'coursework.txt', 'gpa.txt', 'degree_plan.txt'],
    '/projects': ['lamhaa.ai/', 'VisionMamba/', 'DSA_Library/', 'Embedded_Systems/', 'Web-Dev/'],
    '/projects/lamhaa.ai': ['README.md', 'requirements.txt', 'main.py'],
    '/projects/VisionMamba': ['model.py', 'dataset.py', 'train.py', 'results.json'],
    '/skills': ['programming.txt', 'frameworks.txt', 'tools.txt', 'certifications.txt']
};

// Terminal functionality variables
let currentPath = '/';
let commandHistory = [];
let historyIndex = 0;


const enhancedTerminalCommands = {
    help: () => {
        return '<div style="color: #00ff41;">PORTFOLIO TERMINAL HELP<br><br>Navigation: ls, cd, pwd, tree<br>Content: cat, grep, head, tail<br>System: whoami, ps, top, date, version, clear, history<br>Contact: email, linkedin, github, resume, cv<br><br>Type "commands" for a simple list or "man &lt;command&gt;" for detailed help.</div>';
    },

    // Enhanced help with better formatting
    helpme: () => {
        const sections = [
            '<div style="color: #ffff00; font-weight: bold;">PORTFOLIO TERMINAL v1.0</div>',
            '<div style="color: #888888; margin: 10px 0;">═══════════════════════════════════════</div>',
            '',
            '<div style="color: #ffff00;">📂 NAVIGATION COMMANDS</div>',
            '<div style="margin-left: 20px;">',
            '  <span style="color: #00ccff;">ls</span>      - List available sections',
            '  <span style="color: #00ccff;">cd</span>      - Change to section (cd about, cd projects)',
            '  <span style="color: #00ccff;">pwd</span>     - Show current location',
            '  <span style="color: #00ccff;">tree</span>    - Display site structure',
            '</div>',
            '',
            '<div style="color: #ffff00;">📖 CONTENT EXPLORATION</div>',
            '<div style="margin-left: 20px;">',
            '  <span style="color: #00ccff;">cat</span>     - Read files (cat bio.txt)',
            '  <span style="color: #00ccff;">grep</span>    - Search within files',
            '  <span style="color: #00ccff;">head</span>    - Show first lines',
            '  <span style="color: #00ccff;">tail</span>    - Show last lines',
            '</div>',
            '',
            '<div style="color: #ffff00;">⚡ SYSTEM & UTILITIES</div>',
            '<div style="margin-left: 20px;">',
            '  <span style="color: #00ccff;">whoami</span>  - Display user info',
            '  <span style="color: #00ccff;">date</span>    - Show current date/time',
            '  <span style="color: #00ccff;">version</span> - Portfolio version info',
            '  <span style="color: #00ccff;">clear</span>   - Clear terminal',
            '  <span style="color: #00ccff;">history</span> - Command history',
            '</div>',
            '',
            '<div style="color: #ffff00;">🔗 CONTACT & LINKS</div>',
            '<div style="margin-left: 20px;">',
            '  <span style="color: #00ccff;">email</span>   - Contact via email',
            '  <span style="color: #00ccff;">linkedin</span>- LinkedIn profile',
            '  <span style="color: #00ccff;">github</span>  - GitHub repositories',
            '  <span style="color: #00ccff;">resume</span>  - Download resume PDF',
            '  <span style="color: #00ccff;">cv</span>      - Download CV PDF',
            '</div>',
            '',
            '<div style="color: #ff6b6b;">💡 TIP: Try "ls" to see sections, then "cd &lt;section&gt;"</div>',
            '<div style="color: #888888;">Use ↑↓ arrow keys for command history</div>'
        ];
        
        return '<div style="color: #00ff41; font-family: monospace; line-height: 1.4;">' + sections.join('<br>') + '</div>';
    },

    man: (args) => {
        const cmd = args[0];
        const manPages = {
            'help': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">HELP(1)                    Portfolio Manual                    HELP(1)</span>

<span style="color: #00ccff;">NAME</span>
       help - display available commands in Akbar's portfolio terminal

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">help</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Displays a comprehensive list of all available commands in this 
       interactive portfolio terminal, organized by category.

<span style="color: #00ccff;">CATEGORIES</span>
       <span style="color: #ffff00;">Navigation:</span> Commands to explore different sections
       <span style="color: #ffff00;">Content:</span> Commands to read files and information
       <span style="color: #ffff00;">System:</span> System information and utilities
       <span style="color: #ffff00;">Contact:</span> Commands to reach out and connect

<span style="color: #00ccff;">SEE ALSO</span>
       ls(1), man(1), tree(1)
</div>`,

            'ls': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">LS(1)                      Portfolio Manual                      LS(1)</span>

<span style="color: #00ccff;">NAME</span>
       ls - list portfolio sections and available files

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">ls</span> [<span style="color: #00ccff;">-l</span>] [<span style="color: #00ccff;">-a</span>] [<span style="color: #00ccff;">-h</span>]

<span style="color: #00ccff;">DESCRIPTION</span>
       Lists available sections of Akbar's portfolio that you can navigate
       to, along with readable files containing detailed information.

<span style="color: #00ccff;">OPTIONS</span>
       <span style="color: #00ccff;">-l</span>     Use long listing format with descriptions
       <span style="color: #00ccff;">-a</span>     Show all entries (currently unused)
       <span style="color: #00ccff;">-h</span>     Human-readable file sizes (currently unused)

<span style="color: #00ccff;">SECTIONS AVAILABLE</span>
       <span style="color: #00ff41;">about/</span>      Personal background and professional journey
       <span style="color: #00ff41;">experience/</span> Work history and professional roles
       <span style="color: #00ff41;">education/</span>  Academic background and achievements
       <span style="color: #00ff41;">projects/</span>   Portfolio of completed technical projects
       <span style="color: #00ff41;">skills/</span>     Technical expertise and competencies
       <span style="color: #00ff41;">contact/</span>    Ways to connect and get in touch

<span style="color: #00ccff;">FILES AVAILABLE</span>
       <span style="color: #ffffff;">bio.txt</span>           Professional summary and overview
       <span style="color: #ffffff;">resume.pdf</span>        Complete resume document
       <span style="color: #ffffff;">skills.json</span>       Technical skills in JSON format
       <span style="color: #ffffff;">current_roles.txt</span> Active professional positions
       <span style="color: #ffffff;">gpa.txt</span>           Academic performance metrics

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">ls</span>         Show available sections and files
       <span style="color: #ffffff;">ls -l</span>      Show detailed view with descriptions

<span style="color: #00ccff;">SEE ALSO</span>
       cd(1), cat(1), tree(1)
</div>`,

            'cd': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">CD(1)                      Portfolio Manual                      CD(1)</span>

<span style="color: #00ccff;">NAME</span>
       cd - navigate to different sections of the portfolio

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">cd</span> [<span style="color: #00ccff;">section</span>]
       <span style="color: #ffffff;">cd</span> <span style="color: #00ccff;">~</span>
       <span style="color: #ffffff;">cd</span> <span style="color: #00ccff;">..</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Changes the current section and scrolls the webpage to that section.
       This command provides seamless navigation through Akbar's portfolio.

<span style="color: #00ccff;">ARGUMENTS</span>
       <span style="color: #00ccff;">section</span>    Name of the portfolio section to visit
       <span style="color: #00ccff;">~</span>          Return to home section
       <span style="color: #00ccff;">..</span>         Go back to previous section

<span style="color: #00ccff;">AVAILABLE SECTIONS</span>
       <span style="color: #ffffff;">about</span>       Learn about Akbar's background
       <span style="color: #ffffff;">experience</span>  View professional work history
       <span style="color: #ffffff;">education</span>   See academic achievements
       <span style="color: #ffffff;">projects</span>    Explore technical projects
       <span style="color: #ffffff;">skills</span>      Review technical expertise
       <span style="color: #ffffff;">contact</span>     Find contact information

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">cd projects</span>     Navigate to projects section
       <span style="color: #ffffff;">cd about</span>        Go to about section
       <span style="color: #ffffff;">cd ~</span>            Return to home
       <span style="color: #ffffff;">cd ..</span>           Go back one section

<span style="color: #00ccff;">SEE ALSO</span>
       ls(1), pwd(1), tree(1)
</div>`,

            'cat': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">CAT(1)                     Portfolio Manual                     CAT(1)</span>

<span style="color: #00ccff;">NAME</span>
       cat - display contents of portfolio files

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">cat</span> <span style="color: #00ccff;">filename</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Displays the contents of files containing detailed information about
       Akbar's professional background, skills, and experience.

<span style="color: #00ccff;">AVAILABLE FILES</span>
       <span style="color: #ffffff;">bio.txt</span>           Complete professional summary
       <span style="color: #ffffff;">resume.pdf</span>        Resume download information
       <span style="color: #ffffff;">skills.json</span>       Technical skills in JSON format
       <span style="color: #ffffff;">current_roles.txt</span> Current professional positions
       <span style="color: #ffffff;">gpa.txt</span>           Academic performance details
       <span style="color: #ffffff;">README.md</span>         Project documentation (lamhaa.ai)
       <span style="color: #ffffff;">requirements.txt</span>  Technical dependencies

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">cat bio.txt</span>           Read professional biography
       <span style="color: #ffffff;">cat skills.json</span>       View technical skills data
       <span style="color: #ffffff;">cat current_roles.txt</span> See active work positions
       <span style="color: #ffffff;">cat gpa.txt</span>           Check academic performance

<span style="color: #00ccff;">SEE ALSO</span>
       ls(1), head(1), tail(1), grep(1)
</div>`,

            'version': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">VERSION(1)                 Portfolio Manual                 VERSION(1)</span>

<span style="color: #00ccff;">NAME</span>
       version - display portfolio version and update information

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">version</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Displays the current version of Akbar's portfolio website along with
       the last update date and recent changes made to the site.

<span style="color: #00ccff;">INFORMATION DISPLAYED</span>
       <span style="color: #ffff00;">Current Version:</span>    Version number (e.g., v1.0)
       <span style="color: #ffff00;">Last Updated:</span>       Date of most recent update
       <span style="color: #ffff00;">Recent Changes:</span>     List of latest improvements and fixes

<span style="color: #00ccff;">VERSION HISTORY</span>
       <span style="color: #ffffff;">v1.0</span>    Initial portfolio launch with Matrix theme

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">version</span>        Display current version information

<span style="color: #00ccff;">SEE ALSO</span>
       help(1), about(1)
</div>`,

            'pwd': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">PWD(1)                     Portfolio Manual                     PWD(1)</span>

<span style="color: #00ccff;">NAME</span>
       pwd - print working directory (current portfolio section)

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">pwd</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Displays the current section of the portfolio you are viewing.
       Returns the path to help you understand your current location.

<span style="color: #00ccff;">OUTPUT FORMAT</span>
       <span style="color: #ffffff;">/</span>           Root directory (home section)
       <span style="color: #ffffff;">/about</span>      About section
       <span style="color: #ffffff;">/projects</span>   Projects section
       <span style="color: #ffffff;">/experience</span> Experience section

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">pwd</span>         Show current section

<span style="color: #00ccff;">SEE ALSO</span>
       cd(1), ls(1), tree(1)
</div>`,

            'tree': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">TREE(1)                    Portfolio Manual                    TREE(1)</span>

<span style="color: #00ccff;">NAME</span>
       tree - display portfolio structure in tree format

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">tree</span> [<span style="color: #00ccff;">-a</span>]

<span style="color: #00ccff;">DESCRIPTION</span>
       Shows the complete structure of Akbar's portfolio in a visual
       tree format, making it easy to understand the organization.

<span style="color: #00ccff;">OPTIONS</span>
       <span style="color: #00ccff;">-a</span>     Show all files including hidden ones

<span style="color: #00ccff;">STRUCTURE DISPLAYED</span>
       <span style="color: #ffff00;">Sections:</span>    All major portfolio areas
       <span style="color: #ffff00;">Files:</span>       Available content files
       <span style="color: #ffff00;">Projects:</span>    Individual project directories

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">tree</span>        Display full portfolio structure
       <span style="color: #ffffff;">tree -a</span>     Show all files including hidden

<span style="color: #00ccff;">SEE ALSO</span>
       ls(1), cd(1), pwd(1)
</div>`,

            'grep': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">GREP(1)                    Portfolio Manual                    GREP(1)</span>

<span style="color: #00ccff;">NAME</span>
       grep - search for patterns within portfolio files

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">grep</span> <span style="color: #00ccff;">pattern</span> <span style="color: #00ccff;">filename</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Searches for text patterns within portfolio files and returns
       matching lines. Case-insensitive search through file contents.

<span style="color: #00ccff;">ARGUMENTS</span>
       <span style="color: #00ccff;">pattern</span>     Text pattern to search for
       <span style="color: #00ccff;">filename</span>    File to search within

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">grep python skills.json</span>    Find Python references
       <span style="color: #ffffff;">grep UIC bio.txt</span>          Search for UIC mentions
       <span style="color: #ffffff;">grep AI current_roles.txt</span> Find AI-related content

<span style="color: #00ccff;">SEE ALSO</span>
       cat(1), head(1), tail(1)
</div>`,

            'head': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">HEAD(1)                    Portfolio Manual                    HEAD(1)</span>

<span style="color: #00ccff;">NAME</span>
       head - display first lines of portfolio files

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">head</span> <span style="color: #00ccff;">filename</span> [<span style="color: #00ccff;">lines</span>]

<span style="color: #00ccff;">DESCRIPTION</span>
       Shows the first few lines of a portfolio file, useful for
       previewing content without reading the entire file.

<span style="color: #00ccff;">ARGUMENTS</span>
       <span style="color: #00ccff;">filename</span>    File to read from
       <span style="color: #00ccff;">lines</span>       Number of lines to show (default: 5)

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">head bio.txt</span>        Show first 5 lines
       <span style="color: #ffffff;">head bio.txt 3</span>      Show first 3 lines
       <span style="color: #ffffff;">head skills.json</span>    Preview skills file

<span style="color: #00ccff;">SEE ALSO</span>
       cat(1), tail(1), grep(1)
</div>`,

            'tail': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">TAIL(1)                    Portfolio Manual                    TAIL(1)</span>

<span style="color: #00ccff;">NAME</span>
       tail - display last lines of portfolio files

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">tail</span> <span style="color: #00ccff;">filename</span> [<span style="color: #00ccff;">lines</span>]

<span style="color: #00ccff;">DESCRIPTION</span>
       Shows the last few lines of a portfolio file, useful for
       viewing the end of content or recent additions.

<span style="color: #00ccff;">ARGUMENTS</span>
       <span style="color: #00ccff;">filename</span>    File to read from
       <span style="color: #00ccff;">lines</span>       Number of lines to show (default: 5)

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">tail bio.txt</span>        Show last 5 lines
       <span style="color: #ffffff;">tail bio.txt 3</span>      Show last 3 lines
       <span style="color: #ffffff;">tail current_roles.txt</span> View recent roles

<span style="color: #00ccff;">SEE ALSO</span>
       cat(1), head(1), grep(1)
</div>`,

            'whoami': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">WHOAMI(1)                  Portfolio Manual                  WHOAMI(1)</span>

<span style="color: #00ccff;">NAME</span>
       whoami - display current user information

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">whoami</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Returns the current user identifier for the portfolio system.
       Always returns 'akbar@portfolio-system' indicating you are
       viewing Akbar's interactive portfolio terminal.

<span style="color: #00ccff;">OUTPUT</span>
       <span style="color: #ffffff;">akbar@portfolio-system</span>

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">whoami</span>      Show current user

<span style="color: #00ccff;">SEE ALSO</span>
       date(1), uname(1)
</div>`,

            'date': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">DATE(1)                    Portfolio Manual                    DATE(1)</span>

<span style="color: #00ccff;">NAME</span>
       date - display current date and time

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">date</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Shows the current date and time in local format.
       Useful for timestamping and knowing current system time.

<span style="color: #00ccff;">OUTPUT FORMAT</span>
       Returns date and time in locale-specific format
       Example: "8/27/2025, 3:45:22 PM"

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">date</span>        Show current date and time

<span style="color: #00ccff;">SEE ALSO</span>
       whoami(1), version(1)
</div>`,

            'history': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">HISTORY(1)                 Portfolio Manual                 HISTORY(1)</span>

<span style="color: #00ccff;">NAME</span>
       history - display command history

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">history</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Shows the last 10 commands executed in the terminal session.
       Helps track your navigation and exploration of the portfolio.

<span style="color: #00ccff;">OUTPUT</span>
       Lists recently executed commands, one per line
       Maximum of 10 most recent commands shown

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">history</span>     Show recent commands

<span style="color: #00ccff;">NAVIGATION</span>
       Use ↑↓ arrow keys to cycle through command history

<span style="color: #00ccff;">SEE ALSO</span>
       help(1), clear(1)
</div>`,

            'clear': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">CLEAR(1)                   Portfolio Manual                   CLEAR(1)</span>

<span style="color: #00ccff;">NAME</span>
       clear - clear the terminal screen

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">clear</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Clears all previous output from the terminal screen,
       providing a clean workspace for continued exploration.

<span style="color: #00ccff;">BEHAVIOR</span>
       Removes all previous terminal output
       Provides fresh terminal environment
       Command history is preserved

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">clear</span>       Clear terminal screen

<span style="color: #00ccff;">SEE ALSO</span>
       history(1), help(1)
</div>`,

            'ps': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">PS(1)                      Portfolio Manual                      PS(1)</span>

<span style="color: #00ccff;">NAME</span>
       ps - show running processes in portfolio system

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">ps</span> [<span style="color: #00ccff;">-aux</span>]

<span style="color: #00ccff;">DESCRIPTION</span>
       Displays currently running processes in the portfolio system,
       showing simulated system processes and active components.

<span style="color: #00ccff;">OPTIONS</span>
       <span style="color: #00ccff;">-aux</span>   Show all processes with detailed information

<span style="color: #00ccff;">PROCESSES SHOWN</span>
       <span style="color: #ffff00;">portfolio-cli</span>    Interactive terminal interface
       <span style="color: #ffff00;">matrix-bg</span>        Background animation system
       <span style="color: #ffff00;">nav-tracker</span>     Navigation and scroll tracking

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">ps</span>         Show basic process list
       <span style="color: #ffffff;">ps -aux</span>    Show detailed process information

<span style="color: #00ccff;">SEE ALSO</span>
       top(1), whoami(1)
</div>`,

            'top': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">TOP(1)                     Portfolio Manual                     TOP(1)</span>

<span style="color: #00ccff;">NAME</span>
       top - display system resource usage and statistics

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">top</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Shows real-time system resource usage including CPU, memory,
       and portfolio-specific metrics in an interactive display.

<span style="color: #00ccff;">INFORMATION DISPLAYED</span>
       <span style="color: #ffff00;">CPU Usage:</span>       Current processor utilization
       <span style="color: #ffff00;">Memory:</span>          RAM usage and availability
       <span style="color: #ffff00;">Load Average:</span>    System load statistics
       <span style="color: #ffff00;">Processes:</span>       Running portfolio components

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">top</span>         Display system resource monitor

<span style="color: #00ccff;">SEE ALSO</span>
       ps(1), uname(1)
</div>`,

            'email': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">EMAIL(1)                   Portfolio Manual                   EMAIL(1)</span>

<span style="color: #00ccff;">NAME</span>
       email - open email client to contact Akbar

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">email</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Opens the default email client with Akbar's email address
       pre-filled, ready for you to send a message.

<span style="color: #00ccff;">BEHAVIOR</span>
       Opens mailto: link in default email application
       Pre-fills recipient: akbaraman797@gmail.com
       Opens in new tab/window

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">email</span>       Open email client to contact Akbar

<span style="color: #00ccff;">SEE ALSO</span>
       linkedin(1), github(1)
</div>`,

            'linkedin': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">LINKEDIN(1)                Portfolio Manual                LINKEDIN(1)</span>

<span style="color: #00ccff;">NAME</span>
       linkedin - open Akbar's LinkedIn profile

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">linkedin</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Opens Akbar's LinkedIn profile in a new tab, allowing you
       to view his professional network and career details.

<span style="color: #00ccff;">PROFILE CONTAINS</span>
       <span style="color: #ffff00;">Professional History:</span>  Detailed work experience
       <span style="color: #ffff00;">Connections:</span>          Professional network
       <span style="color: #ffff00;">Recommendations:</span>      Colleague endorsements
       <span style="color: #ffff00;">Skills:</span>               Endorsed technical abilities

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">linkedin</span>    Open LinkedIn profile

<span style="color: #00ccff;">SEE ALSO</span>
       email(1), github(1)
</div>`,

            'github': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">GITHUB(1)                  Portfolio Manual                  GITHUB(1)</span>

<span style="color: #00ccff;">NAME</span>
       github - open Akbar's GitHub profile and repositories

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">github</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Opens Akbar's GitHub profile showing his code repositories,
       contributions, and open source projects.

<span style="color: #00ccff;">PROFILE CONTAINS</span>
       <span style="color: #ffff00;">Repositories:</span>        Public code projects
       <span style="color: #ffff00;">Contributions:</span>       Activity and commit history
       <span style="color: #ffff00;">Languages:</span>           Programming language usage
       <span style="color: #ffff00;">Projects:</span>            Featured development work

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">github</span>      Open GitHub profile

<span style="color: #00ccff;">SEE ALSO</span>
       email(1), linkedin(1), resume(1)
</div>`,

            'resume': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">RESUME(1)                  Portfolio Manual                  RESUME(1)</span>

<span style="color: #00ccff;">NAME</span>
       resume - download Akbar's professional resume

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">resume</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Opens and downloads Akbar's professional resume in PDF format.
       Contains comprehensive information about education, experience,
       projects, and technical skills.

<span style="color: #00ccff;">RESUME SECTIONS</span>
       <span style="color: #ffff00;">Education:</span>           University of Illinois Chicago
       <span style="color: #ffff00;">Experience:</span>          Professional work history
       <span style="color: #ffff00;">Projects:</span>            Key technical projects
       <span style="color: #ffff00;">Skills:</span>              Programming languages and tools

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">resume</span>      Download resume PDF

<span style="color: #00ccff;">SEE ALSO</span>
       cv(1), linkedin(1), email(1)
</div>`,

            'cv': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">CV(1)                      Portfolio Manual                      CV(1)</span>

<span style="color: #00ccff;">NAME</span>
       cv - download Akbar's curriculum vitae

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">cv</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Opens and downloads Akbar's curriculum vitae in PDF format.
       Alias for the resume command, providing the same document.

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">cv</span>        Download CV PDF

<span style="color: #00ccff;">SEE ALSO</span>
       resume(1), linkedin(1), email(1)
</div>`,

            'uname': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">UNAME(1)                   Portfolio Manual                   UNAME(1)</span>

<span style="color: #00ccff;">NAME</span>
       uname - display system information

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">uname</span> [<span style="color: #00ccff;">-a</span>]

<span style="color: #00ccff;">DESCRIPTION</span>
       Displays portfolio system information including operating system,
       hostname, and version details.

<span style="color: #00ccff;">OPTIONS</span>
       <span style="color: #00ccff;">-a</span>     Show all system information

<span style="color: #00ccff;">INFORMATION SHOWN</span>
       <span style="color: #ffff00;">System:</span>            Portfolio OS
       <span style="color: #ffff00;">Version:</span>           Current system version
       <span style="color: #ffff00;">Architecture:</span>      x86_64 (simulated)
       <span style="color: #ffff00;">Hostname:</span>          portfolio-system

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">uname</span>       Show basic system info
       <span style="color: #ffffff;">uname -a</span>    Show all system information

<span style="color: #00ccff;">SEE ALSO</span>
       whoami(1), date(1), top(1)
</div>`,

            'which': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">WHICH(1)                   Portfolio Manual                   WHICH(1)</span>

<span style="color: #00ccff;">NAME</span>
       which - locate commands in the portfolio system

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">which</span> <span style="color: #00ccff;">command</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Displays the location where a command would be executed from,
       or indicates if a command is available in the portfolio system.

<span style="color: #00ccff;">ARGUMENTS</span>
       <span style="color: #00ccff;">command</span>     Name of command to locate

<span style="color: #00ccff;">OUTPUT</span>
       Shows "/usr/local/bin/command" for available commands
       Returns error message for unavailable commands

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">which ls</span>      Locate ls command
       <span style="color: #ffffff;">which cat</span>     Locate cat command
       <span style="color: #ffffff;">which vim</span>     Check if vim is available

<span style="color: #00ccff;">SEE ALSO</span>
       help(1), man(1)
</div>`,

            'find': `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">FIND(1)                    Portfolio Manual                    FIND(1)</span>

<span style="color: #00ccff;">NAME</span>
       find - search for files in portfolio directories

<span style="color: #00ccff;">SYNOPSIS</span>
       <span style="color: #ffffff;">find</span> <span style="color: #00ccff;">pattern</span>

<span style="color: #00ccff;">DESCRIPTION</span>
       Searches for files matching a pattern across all portfolio
       sections and returns their locations.

<span style="color: #00ccff;">ARGUMENTS</span>
       <span style="color: #00ccff;">pattern</span>     File name or pattern to search for

<span style="color: #00ccff;">SEARCH SCOPE</span>
       All portfolio sections and subdirectories
       File names are matched using pattern matching
       Case-insensitive search

<span style="color: #00ccff;">EXAMPLES</span>
       <span style="color: #ffffff;">find bio</span>         Find files containing "bio"
       <span style="color: #ffffff;">find .txt</span>        Find all .txt files
       <span style="color: #ffffff;">find skills</span>      Find skills-related files

<span style="color: #00ccff;">SEE ALSO</span>
       grep(1), ls(1), tree(1)
</div>`
        };
        
        if (!cmd) {
            return `<span style="color: #ff6b6b;">What manual page do you want?</span>
<span style="color: #888888;">Usage: man <command>
Available pages: ${Object.keys(manPages).join(', ')}</span>`;
        }
        
        return manPages[cmd] || `<span style="color: #ff6b6b;">No manual entry for '${cmd}'</span>
<span style="color: #888888;">Available pages: ${Object.keys(manPages).join(', ')}
Try 'help' for command overview</span>`;
    },

    pwd: () => currentPath,

    ls: (args) => {
        const showAll = args.includes('-a');
        const longFormat = args.includes('-l');
        const humanReadable = args.includes('-h');
        
        const sections = [
            { name: 'about', desc: 'Personal background and bio', icon: '👤', size: '2.1KB', color: '#FFD700' },
            { name: 'experience', desc: 'Professional work history', icon: '💼', size: '4.8KB', color: '#32CD32' },
            { name: 'education', desc: 'Academic background and achievements', icon: '🎓', size: '1.9KB', color: '#87CEEB' },
            { name: 'projects', desc: 'Portfolio of completed projects', icon: '🚀', size: '7.2KB', color: '#FF6347' },
            { name: 'skills', desc: 'Technical skills and expertise', icon: '⚡', size: '3.1KB', color: '#9370DB' },
            { name: 'contact', desc: 'Get in touch and connect', icon: '📧', size: '1.5KB', color: '#20B2AA' }
        ];
        
        const files = [
            { name: 'bio.txt', desc: 'Professional summary', icon: '📄', size: '847B', color: '#FFFFFF' },
            { name: 'resume.pdf', desc: 'Latest resume document', icon: '📋', size: '2.4MB', color: '#FFA500' },
            { name: 'skills.json', desc: 'Technical skills data', icon: '🔧', size: '1.2KB', color: '#00CED1' },
            { name: 'current_roles.txt', desc: 'Active professional roles', icon: '💼', size: '543B', color: '#98FB98' },
            { name: 'gpa.txt', desc: 'Academic performance info', icon: '📊', size: '278B', color: '#DDA0DD' }
        ];
        
        if (longFormat) {
            let output = `<div style="color: #00ff41; font-family: 'Courier New', monospace; line-height: 1.6;">
╭─────────────────────────────────────────────────────────────────────────────────╮
│ <span style="color: #ffff00; font-weight: bold;">📁 PORTFOLIO SECTIONS</span> <span style="color: #888888;">(navigate with 'cd &lt;section&gt;')</span>                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ <span style="color: #888888;">Permissions  Links Owner    Group     Size     Date Modified   Name & Description</span>      │
├─────────────────────────────────────────────────────────────────────────────────┤\n`;
            
            sections.forEach(section => {
                const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                output += `│ <span style="color: #00ccff;">drwxr-xr-x</span>    <span style="color: #888888;">1</span> <span style="color: #00ff41;">akbar</span>    <span style="color: #00ff41;">portfolio</span> <span style="color: #ffff00;">${section.size.padEnd(8)}</span> <span style="color: #888888;">${date} 12:00</span> <span style="color: ${section.color};">${section.icon} ${section.name}/</span>\n`;
                output += `│   <span style="color: #888888;">↳ ${section.desc}</span>\n`;
            });
            
            output += `├─────────────────────────────────────────────────────────────────────────────────┤
│ <span style="color: #ffff00; font-weight: bold;">📄 AVAILABLE FILES</span> <span style="color: #888888;">(read with 'cat &lt;filename&gt;')</span>                      │
├─────────────────────────────────────────────────────────────────────────────────┤\n`;

            files.forEach(file => {
                const date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
                output += `│ <span style="color: #00ccff;">-rw-r--r--</span>    <span style="color: #888888;">1</span> <span style="color: #00ff41;">akbar</span>    <span style="color: #00ff41;">portfolio</span> <span style="color: #ffff00;">${file.size.padEnd(8)}</span> <span style="color: #888888;">${date} 12:00</span> <span style="color: ${file.color};">${file.icon} ${file.name}</span>\n`;
                output += `│   <span style="color: #888888;">↳ ${file.desc}</span>\n`;
            });
            
            output += `╰─────────────────────────────────────────────────────────────────────────────────╯
<span style="color: #ff6b6b;">💡 Tips:</span> <span style="color: #00ccff;">cd projects</span> to explore work • <span style="color: #00ccff;">cat bio.txt</span> to read bio • <span style="color: #00ccff;">man ls</span> for help</div>`;
            
            return output;
        } else {
            let output = `<div style="color: #00ff41; font-family: 'Courier New', monospace; line-height: 1.8;">
╭─────────────────────────────────────────────────────────────╮
│ <span style="color: #ffff00; font-weight: bold;">�️  PORTFOLIO OVERVIEW</span>                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ <span style="color: #ffff00;">📁 Sections to explore:</span>                               │\n`;
            
            // Display sections in a grid-like format
            for (let i = 0; i < sections.length; i += 2) {
                const section1 = sections[i];
                const section2 = sections[i + 1];
                
                if (section2) {
                    output += `│   <span style="color: ${section1.color};">${section1.icon} ${section1.name}/</span>${''.padEnd(12 - section1.name.length)} <span style="color: ${section2.color};">${section2.icon} ${section2.name}/</span>\n`;
                } else {
                    output += `│   <span style="color: ${section1.color};">${section1.icon} ${section1.name}/</span>\n`;
                }
            }
            
            output += `│                                                             │
│ <span style="color: #ffff00;">📄 Files to read:</span>                                    │\n`;
            
            // Display files in a grid-like format
            for (let i = 0; i < files.length; i += 2) {
                const file1 = files[i];
                const file2 = files[i + 1];
                
                if (file2) {
                    output += `│   <span style="color: ${file1.color};">${file1.icon} ${file1.name}</span>${''.padEnd(20 - file1.name.length)} <span style="color: ${file2.color};">${file2.icon} ${file2.name}</span>\n`;
                } else {
                    output += `│   <span style="color: ${file1.color};">${file1.icon} ${file1.name}</span>\n`;
                }
            }
            
            output += `│                                                             │
├─────────────────────────────────────────────────────────────┤
│ <span style="color: #ff6b6b;">💡 Quick start:</span>                                       │
│   • <span style="color: #00ccff;">ls -l</span>           Show detailed file listing             │
│   • <span style="color: #00ccff;">cd projects</span>     Navigate to projects section         │
│   • <span style="color: #00ccff;">cat bio.txt</span>     Read professional biography          │
│   • <span style="color: #00ccff;">tree</span>            View complete portfolio structure    │
│   • <span style="color: #00ccff;">help</span>            Show all available commands          │
╰─────────────────────────────────────────────────────────────╯
</div>`;
            return output;
        }
    },

    tree: (args) => {
        return `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">🌳 PORTFOLIO WEBSITE STRUCTURE</span>
<span style="color: #00ccff;">portfolio-website/</span>
├── <span style="color: #00ff41;">📁 about/</span>          <span style="color: #888888;"># Personal background and journey</span>
├── <span style="color: #00ff41;">📁 experience/</span>     <span style="color: #888888;"># Professional work history</span>
├── <span style="color: #00ff41;">📁 education/</span>      <span style="color: #888888;"># Academic achievements</span>
├── <span style="color: #00ff41;">📁 projects/</span>       <span style="color: #888888;"># Showcase of completed work</span>
│   ├── <span style="color: #ffffff;">🚀 lamhaa.ai/</span>      <span style="color: #888888;"># AI-powered visual asset management</span>
│   ├── <span style="color: #ffffff;">💻 portfolio-site/</span> <span style="color: #888888;"># This interactive website</span>
│   └── <span style="color: #ffffff;">🔧 embedded-projects/</span> <span style="color: #888888;"># Hardware/firmware projects</span>
├── <span style="color: #00ff41;">📁 skills/</span>         <span style="color: #888888;"># Technical expertise overview</span>
├── <span style="color: #00ff41;">📁 contact/</span>        <span style="color: #888888;"># Ways to get in touch</span>
├── <span style="color: #ffffff;">📄 bio.txt</span>         <span style="color: #888888;"># Professional summary</span>
├── <span style="color: #ffffff;">📋 resume.pdf</span>      <span style="color: #888888;"># Latest CV document</span>
├── <span style="color: #ffffff;">🔧 skills.json</span>     <span style="color: #888888;"># Technical skills data</span>
├── <span style="color: #ffffff;">💼 current_roles.txt</span> <span style="color: #888888;"># Active professional positions</span>
└── <span style="color: #ffffff;">📊 gpa.txt</span>         <span style="color: #888888;"># Academic performance metrics</span>

<span style="color: #ff6b6b;">💡 Navigation tips:</span>
  • Use '<span style="color: #00ccff;">cd <section></span>' to explore each area
  • Use '<span style="color: #00ccff;">cat <file></span>' to read file contents
  • Use '<span style="color: #00ccff;">ls -l</span>' for detailed file listings
</div>`;
    },

    cd: (args) => {
        const target = args[0] || '/';
        const sectionMap = {
            '/': 'home',
            '/about': 'about',
            '/experience': 'experience',
            '/education': 'education',
            '/projects': 'projects',
            '/contact': 'contact',
            '/skills': 'skills',
            'about': 'about',
            'experience': 'experience',
            'education': 'education',
            'projects': 'projects',
            'contact': 'contact',
            'skills': 'skills',
            'home': 'home'
        };
        
        if (target === '~' || target === '/') {
            currentPath = '/';
            document.getElementById('cliPath').textContent = '~';
            const el = document.getElementById('home');
            if (el) el.scrollIntoView({behavior:'smooth'});
            return 'Changed to root directory';
        }
        
        if (target === '..') {
            if (currentPath !== '/') {
                currentPath = currentPath.split('/').slice(0, -1).join('/') || '/';
                document.getElementById('cliPath').textContent = currentPath === '/' ? '~' : currentPath;
                const el = document.getElementById(sectionMap[currentPath]);
                if (el) el.scrollIntoView({behavior:'smooth'});
            }
            return `Changed to ${currentPath}`;
        }
        
        // Handle direct section names without requiring path format
        if (sectionMap[target]) {
            const newPath = target.startsWith('/') ? target : `/${target}`;
            if (fileSystem[newPath] || ['about', 'experience', 'education', 'projects', 'contact', 'skills', 'home'].includes(target)) {
                currentPath = newPath;
                document.getElementById('cliPath').textContent = currentPath === '/' ? '~' : currentPath;
                const el = document.getElementById(sectionMap[target]);
                if (el) el.scrollIntoView({behavior:'smooth'});
                return `Changed to ${currentPath}`;
            }
        }
        
        const newPath = currentPath === '/' ? `/${target}` : `${currentPath}/${target}`;
        if (fileSystem[newPath]) {
            currentPath = newPath;
            document.getElementById('cliPath').textContent = currentPath === '/' ? '~' : currentPath;
            const el = document.getElementById(sectionMap[currentPath]);
            if (el) el.scrollIntoView({behavior:'smooth'});
            return `Changed to ${currentPath}`;
        }
        return `cd: ${target}: No such directory`;
    },

    cat: (args) => {
        const file = args[0];
        if (!file) return 'cat: missing file operand\nTry \'cat --help\' for more information.';
        
        const fileContents = {
            'bio.txt': 'Computer Engineering professional specializing in AI/ML, embedded systems, and full-stack development.\nCurrently pursuing Joint BS/MS at UIC with 6+ professional roles and research experience.',
            'resume.pdf': 'PDF document - Contact akbaraman797@gmail.com for latest resume\nSize: 2.4MB\nLast modified: Aug 26, 2025',
            'current_roles.txt': 'Active Professional Roles:\n• AI Trainer - Outlier & Handshake\n• Teaching Assistant - UIC ECE Department\n• Code Coach - TheCoderSchool\n• Research Assistant - UIC Computer Vision Lab',
            'skills.json': '{\n  "languages": ["Python", "C++", "JavaScript", "C", "Java", "ARM Assembly"],\n  "frameworks": ["PyTorch", "TensorFlow", "FastAPI", "Docker", "AWS"],\n  "domains": ["AI/ML", "Embedded Systems", "Web Development", "Computer Vision"],\n  "tools": ["Linux", "Git", "MATLAB", "Altium Designer", "Node.js"]\n}',
            'gpa.txt': 'Academic Performance:\nCurrent GPA: 3.65/4.0\nExpected BS: May 2027\nExpected MS: May 2028\nDean\'s List: Fall 2023, Spring 2024',
            'README.md': '# lamhaa.ai\nAI-powered visual asset management platform\n\n## Features\n- Smart photo organization\n- Duplicate detection\n- Burst grouping\n- Quality assessment\n\n## Tech Stack\nPython, FastAPI, PyTorch, OpenCV, CLIP, BLIP',
            'requirements.txt': 'torch>=1.9.0\nopencv-python>=4.5.0\ntransformers>=4.0.0\nfastapi>=0.68.0\nuvicorn>=0.15.0\nnumpy>=1.21.0\npillow>=8.3.0'
        };
        
        return fileContents[file] || `cat: ${file}: No such file or directory`;
    },

    grep: (args) => {
        if (args.length < 2) return 'grep: missing pattern or file\nUsage: grep <pattern> <file>';
        const [pattern, file] = args;
        const content = enhancedTerminalCommands.cat([file]);
        
        if (content.startsWith('cat:')) return content; // File not found
        
        const lines = content.split('\n');
        const matches = lines.filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
        
        return matches.length > 0 ? matches.join('\n') : `grep: no matches found for '${pattern}'`;
    },

    head: (args) => {
        const file = args[0];
        const lines = parseInt(args[1]) || 10;
        const content = enhancedTerminalCommands.cat([file]);
        
        if (content.startsWith('cat:')) return content;
        
        return content.split('\n').slice(0, lines).join('\n');
    },

    tail: (args) => {
        const file = args[0];
        const lines = parseInt(args[1]) || 10;
        const content = enhancedTerminalCommands.cat([file]);
        
        if (content.startsWith('cat:')) return content;
        
        const allLines = content.split('\n');
        return allLines.slice(-lines).join('\n');
    },

    ps: (args) => {
        const showAll = args.includes('aux') || args.includes('-aux');
        const processes = [
            'PID TTY      TIME CMD',
            '  1 ?        00:00:01 systemd',
            '  2 ?        00:00:00 kthreadd', 
            '123 pts/0    00:00:00 bash',
            '456 pts/0    00:00:00 node',
            '789 pts/0    00:00:02 portfolio-site',
            '999 pts/0    00:00:00 ps'
        ];
        
        return showAll ? processes.join('\n') : processes.slice(-3).join('\n');
    },

    top: () => {
        return `top - ${new Date().toLocaleTimeString()} up 2 days, 14:32, 1 user, load average: 0.15, 0.10, 0.05
Tasks: 127 total,   1 running, 126 sleeping,   0 stopped,   0 zombie
%CPU(s):  2.3 us,  1.1 sy,  0.0 ni, 96.6 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND
  789 akbar     20   0  123456  45678   12345 S   5.9  2.3   0:02.34 portfolio-site
  456 akbar     20   0   98765  23456    8901 S   1.3  1.1   0:01.23 node
  123 akbar     20   0   45678   8901    2345 S   0.3  0.4   0:00.12 bash`;
    },

    uname: (args) => {
        if (args.includes('-a')) {
            return 'Linux portfolio-system 5.15.0 #1 SMP Tue Aug 26 12:00:00 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux';
        }
        return 'Linux';
    },

    which: (args) => {
        const cmd = args[0];
        const paths = {
            'ls': '/bin/ls',
            'cat': '/bin/cat',
            'grep': '/bin/grep',
            'cd': 'shell builtin',
            'pwd': '/bin/pwd'
        };
        return paths[cmd] || `which: no ${cmd} in (/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin)`;
    },

    touch: (args) => {
        const file = args[0];
        if (!file) return 'touch: missing file operand';
        return `touch: created '${file}' (simulated)`;
    },

    mkdir: (args) => {
        const dir = args[0];
        if (!dir) return 'mkdir: missing operand';
        return `mkdir: created directory '${dir}' (simulated)`;
    },

    curl: (args) => {
        const url = args[0];
        if (!url) return 'curl: no URL specified';
        
        if (url.includes('github.com/ak23bar')) {
            return 'HTTP/1.1 200 OK\nContent-Type: text/html\n\n<title>ak23bar (Akbar Aman) · GitHub</title>\nPublic repositories and contributions...';
        }
        
        return `curl: (6) Could not resolve host: ${url}`;
    },

    ping: (args) => {
        const host = args[0] || 'localhost';
        return `PING ${host} (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.123 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.089 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.156 ms
--- ${host} ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss`;
    },

    goto: (args) => {
        const section = args[0];
        const sections = ['home', 'about', 'experience', 'education', 'projects', 'contact'];
        
        if (!section) return `goto: Available sections: ${sections.join(', ')}`;
        
        if (sections.includes(section)) {
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
                return `Navigating to ${section} section...`;
            }
        }
        
        return `goto: Section '${section}' not found`;
    },

    scroll: (args) => {
        const direction = args[0];
        switch (direction) {
            case 'top':
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return 'Scrolled to top';
            case 'bottom':
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                return 'Scrolled to bottom';
            case 'up':
                window.scrollBy({ top: -300, behavior: 'smooth' });
                return 'Scrolled up';
            case 'down':
                window.scrollBy({ top: 300, behavior: 'smooth' });
                return 'Scrolled down';
            default:
                return 'scroll: Usage - scroll [up|down|top|bottom]';
        }
    },

    find: (args) => {
        const query = args.join(' ').toLowerCase();
        if (!query) {
            return `<span style="color: #ff6b6b;">find: missing search query</span>
<span style="color: #888888;">Usage: find <search_term>
Example: find "machine learning"</span>`;
        }
        
        const searchableContent = {
            'bio.txt': 'Computer Engineering professional specializing in AI/ML, embedded systems, and full-stack development. Currently pursuing Joint BS/MS at UIC with 6+ professional roles and research experience.',
            'skills.json': 'Python C++ JavaScript C Java ARM Assembly PyTorch TensorFlow FastAPI Docker AWS AI ML Embedded Systems Web Development Computer Vision Linux Git MATLAB Altium Designer Node.js',
            'current_roles.txt': 'AI Trainer Outlier Handshake Teaching Assistant UIC ECE Department Code Coach TheCoderSchool Research Assistant UIC Computer Vision Lab',
            'gpa.txt': 'Academic Performance Current GPA 3.65 Expected BS May 2027 Expected MS May 2028 Deans List Fall 2023 Spring 2024',
            'README.md': 'lamhaa.ai AI-powered visual asset management platform Smart photo organization Duplicate detection Burst grouping Quality assessment Python FastAPI PyTorch OpenCV CLIP BLIP'
        };
        
        const sectionContent = {
            'about': 'Personal background professional journey computer engineering UIC artificial intelligence machine learning',
            'experience': 'professional work history AI trainer teaching assistant code coach research assistant computer vision embedded systems',
            'education': 'academic background achievements University Illinois Chicago electrical computer engineering joint degree',
            'projects': 'portfolio technical projects lamhaa.ai wildfire detection VisionMamba DSA library embedded systems ARM',
            'skills': 'technical expertise Python C++ JavaScript PyTorch TensorFlow machine learning artificial intelligence',
            'contact': 'get in touch connect email LinkedIn GitHub akbaraman797 gmail com'
        };
        
        const results = [];
        
        // Search in files
        Object.entries(searchableContent).forEach(([file, content]) => {
            if (content.toLowerCase().includes(query)) {
                results.push(`📄 ${file} - contains "${query}"`);
            }
        });
        
        // Search in sections
        Object.entries(sectionContent).forEach(([section, content]) => {
            if (content.toLowerCase().includes(query)) {
                results.push(`📁 ${section}/ - section contains "${query}"`);
            }
        });
        
        if (results.length === 0) {
            return `<span style="color: #ff6b6b;">find: No matches for '${query}'</span>
<span style="color: #888888;">Try searching for: "AI", "Python", "projects", "education", etc.</span>`;
        }
        
        return `<div style="color: #00ff41;">Found ${results.length} matches for "${query}":</div>
${results.map(r => `<span style="color: #ffffff;">${r}</span>`).join('\n')}

<span style="color: #888888;">Use 'cat <file>' to read files or 'cd <section>' to visit sections</span>`;
    },

    open: (args) => {
        const target = args[0];
        const links = {
            github: 'https://github.com/ak23bar',
            linkedin: 'https://linkedin.com/in/akbar-aman-94b1b6263',
            email: 'mailto:akbaraman797@gmail.com'
        };
        
        if (links[target]) {
            window.open(links[target], '_blank');
            return `Opening ${target}...`;
        }
        
        return `open: Unknown target '${target}'. Available: github, linkedin, email`;
    },

    history: () => commandHistory.slice(-10).join('\n'),

    clear: () => '',

    whoami: () => 'akbar@portfolio-system',

    date: () => new Date().toLocaleString(),

    email: () => {
        window.open('mailto:akbaraman797@gmail.com', '_blank');
        return 'Opening email client...';
    },

    linkedin: () => {
        window.open('https://linkedin.com/in/akbar-aman-94b1b6263', '_blank');
        return 'Opening LinkedIn profile...';
    },

    github: () => {
        window.open('https://github.com/ak23bar', '_blank');
        return 'Opening GitHub profile...';
    },

    resume: () => {
        window.open('assets/files/Akbar_Resume.pdf', '_blank');
        return 'Opening resume PDF...';
    },

    cv: () => {
        window.open('assets/files/Akbar_Resume.pdf', '_blank');
        return 'Opening CV PDF...';
    },

    // Debug command to test terminal functionality
    test: () => {
        return `<div style="color: #00ff41;">
Terminal test successful!<br>
Available commands: ${Object.keys(enhancedTerminalCommands).join(', ')}<br>
Current path: ${currentPath}<br>
Command history length: ${commandHistory.length}
</div>`;
    },

    // Simple help alternative
    commands: () => {
        return `<div style="color: #00ff41;">
Available commands:<br>
ls, cd, pwd, tree, cat, grep, head, tail<br>
whoami, ps, top, date, version, clear, history<br>
email, linkedin, github, resume, cv, help, man<br>
Type 'man &lt;command&gt;' for detailed help.
</div>`;
    },

    // System status check
    status: () => {
        const commandList = Object.keys(enhancedTerminalCommands);
        const commandCount = commandList.length;
        return `<div style="color: #00ff41;">
<div style="color: #ffff00;">TERMINAL STATUS</div>
<div style="color: #888888;">═════════════════</div>
System: Portfolio OS v1.0<br>
Commands loaded: ${commandCount}<br>
Current path: ${currentPath}<br>
History entries: ${commandHistory.length}<br>
<br>
<div style="color: #00ccff;">Available Commands:</div>
${commandList.join(', ')}<br>
<br>
<div style="color: #ffff00;">All systems operational! 🚀</div>
</div>`;
    }

};

// Terminal CLI Functions
function openTerminalCli() {
    const cli = document.getElementById('terminalCli');
    const output = document.getElementById('terminalCliContent');
    
    cli.classList.add('active');
    cli.style.zIndex = 100001;
    
    // Add welcome message if terminal is empty
    if (!output.innerHTML.trim()) {
        output.innerHTML = `<div class="cli-output" style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">🖥️  Welcome to Akbar's Interactive Portfolio Terminal</span>
<span style="color: #888888;">─────────────────────────────────────────────────</span>
<span style="color: #00ccff;">System:</span> Portfolio OS v1.0 | <span style="color: #00ccff;">User:</span> akbar@portfolio-system
<span style="color: #888888;">Type 'help' for available commands, 'ls' to see sections, 'tree' for structure</span>
<span style="color: #ff6b6b;">💡 Tip: Use 'cd projects' to explore my work, 'cat bio.txt' to learn more!</span>
</div>`;
    }
    
    document.getElementById('cliInput').focus();
}

function closeTerminalCli() {
    const cli = document.getElementById('terminalCli');
    cli.classList.remove('active');
}

function toggleTerminalCli() {
    const cli = document.getElementById('terminalCli');
    if (cli.classList.contains('active')) {
        closeTerminalCli();
    } else {
        openTerminalCli();
    }
}

function executeEnhancedCommand(command) {
    const output = document.getElementById('terminalCliContent');
    const [cmd, ...args] = command.trim().split(' ');
    
    // Add to history
    commandHistory.push(command);
    historyIndex = commandHistory.length;
    
    const inputLine = `<div class="cli-output"><span style="color:#ff0040; font-weight: bold;">akbar@portfolio-system</span><span style="color:#00ff41;">:</span><span style="color:#6495ED;">${currentPath === '/' ? '~' : currentPath}</span><span style="color:#00ff41;">$</span> <span style="color: #ffffff;">${command}</span></div>`;
    
    if (cmd.toLowerCase() === 'clear') {
        output.innerHTML = `<div class="cli-output" style="color: #00ff41; font-family: 'Courier New', monospace;">
<span style="color: #ffff00;">🖥️  Welcome to Akbar's Portfolio Terminal</span>
<span style="color: #888888;">Type 'help' for available commands, 'ls' to see sections</span>
</div>`;
        return;
    }

    const cmdFunc = enhancedTerminalCommands[cmd.toLowerCase()];
    let response;
    
    if (cmdFunc) {
        try {
            response = typeof cmdFunc === 'function' ? cmdFunc(args) : cmdFunc;
        } catch (error) {
            console.error('Error executing command:', cmd, error);
            response = `<span style="color: #ff6b6b;">Error executing command: ${error.message}</span>`;
        }
    } else {
        response = `<span style="color: #ff6b6b;">bash: ${cmd}: command not found</span>
<span style="color: #888888;">Type 'help' for available commands or 'ls' to see sections</span>`;
    }
    
    // Check if response is empty or undefined
    if (!response || response.trim() === '') {
        response = `<span style="color: #ffff00;">Command '${cmd}' executed but returned no output</span>`;
    }
    
    output.innerHTML += inputLine + `<div class="cli-output" style="margin-bottom:1rem; line-height: 1.4;">${response}</div>`;
    output.scrollTop = output.scrollHeight;
}

// Enhanced AI Assistant
const aiResponses = [
    { keywords: ['akbar', 'about', 'who'], response: 'Akbar Aman is a Computer Engineering professional at UIC, specializing in AI/ML, embedded systems, and full-stack development. He has 6+ professional roles spanning research, teaching, and industry applications.' },
    { keywords: ['experience', 'work', 'job', 'career'], response: 'Akbar currently holds multiple roles: AI Trainer at Outlier and Handshake, Teaching Assistant and Mentor at UIC, and Code Coach at TheCoderSchool. He has research experience in deep learning and computer vision at UIC ECE Department.' },
    { keywords: ['skills', 'technical', 'programming', 'languages'], response: 'Technical expertise includes: Python, C++, C, JavaScript, Java, ARM Assembly, MATLAB, AI/ML frameworks (PyTorch, TensorFlow), Linux, FastAPI, Docker, AWS, circuit design, and signal processing.' },
    { keywords: ['education', 'degree', 'university', 'school'], response: 'Akbar is pursuing a Joint BS in Computer Engineering and MS in Electrical and Computer Engineering at University of Illinois Chicago, with a current GPA of 3.65. Expected graduation: BS May 2027, MS May 2028.' },
    { keywords: ['projects', 'portfolio', 'code', 'github'], response: 'Key projects include: lamhaa.ai (AI-powered photo organization platform), VisionMamba (wildfire detection CNN), DSA library in C++, embedded systems with ARM, and various web applications. Check his GitHub: ak23bar' },
    { keywords: ['contact', 'email', 'reach', 'hire'], response: 'Contact Akbar at akbaraman797@gmail.com for opportunities, collaborations, or his resume. Also available on LinkedIn (akbar-aman-94b1b6263) and GitHub (ak23bar).' },
    { keywords: ['ai', 'machine learning', 'ml', 'deep learning'], response: 'Akbar has extensive AI/ML experience including: AI training and validation at Outlier/Handshake, computer vision research (wildfire detection), PyTorch/TensorFlow projects, and building AI-powered applications like lamhaa.ai.' },
    { keywords: ['teaching', 'mentor', 'instructor'], response: 'Akbar is actively involved in education as a TA for CS 109 (MATLAB), Engineering Success Program Mentor, and Code Coach teaching Python, C++, Java, and web development to students of all levels.' },
    { keywords: ['matrix', 'linux', 'terminal'], response: 'Welcome to the Matrix! This portfolio showcases Akbar\'s love for Linux and terminal environments. Try the interactive terminal (CLI icon) for system commands, or explore the Matrix-themed interface.' },
    { keywords: ['help', 'commands', 'what can you do'], response: 'I can provide information about Akbar\'s professional experience, technical skills, education, projects, and career. Ask me about his work, skills, background, or how to contact him!' }
];

function findAIResponse(input) {
    const lowerInput = input.toLowerCase();
    for (let item of aiResponses) {
        if (item.keywords.some(keyword => lowerInput.includes(keyword))) {
            return item.response;
        }
    }
    return 'I\'d be happy to help! You can ask me about Akbar\'s professional experience, technical skills, projects, education, or how to contact him. What specific aspect would you like to know more about?';
}

function openAI() {
    document.getElementById('aiModal').classList.add('open');
    document.getElementById('aiInput').focus();
}

function closeAI() {
    document.getElementById('aiModal').classList.remove('open');
}

function addAIMessage(message, isUser = false) {
    const chatArea = document.getElementById('aiChatArea');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${isUser ? 'user' : 'assistant'}`;
    messageDiv.textContent = message;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Matrix Rain Effect
function createMatrixRain() {
    const matrixRain = document.getElementById('matrixRain');
    const characters = '01アカサタナハマヤラワABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789αβγδεζηθικλμνξοπρστυφχψω∞∑∫√∂∇≈≠≤≥±÷×→←↑↓∈∉∩∪∅∀∃';

    for (let i = 0; i < 50; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDuration = (Math.random() * 3 + 5) + 's';
        column.style.animationDelay = Math.random() * 2 + 's';

        let columnText = '';
        for (let j = 0; j < 20; j++) {
            const char = characters[Math.floor(Math.random() * characters.length)];
            columnText += `<span class="matrix-char">${char}</span>`;
        }
        column.innerHTML = columnText;
        matrixRain.appendChild(column);
    }
}

// Matrix rain for loading screen
function createLoadingMatrixRain() {
    const loadingMatrixRain = document.getElementById('loading-matrix-rain');
    if (!loadingMatrixRain) return;
    
    loadingMatrixRain.innerHTML = '';
    const chars = '01アカバルアマンコンピュータエンジニアリングαβγδεζηθικλμνξοπρστυφχψωΔΣΩπλμθ∞∑∫√∂∇≈≠≤≥±÷×→←↑↓∈∉∩∪∅∀∃ℝℤℕℚℂ';
    const columns = Math.floor(window.innerWidth / 20);
    
    for (let c = 0; c < columns; c++) {
        const col = document.createElement('div');
        col.style.cssText = `
            position: absolute;
            left: ${c * 20}px;
            top: -100px;
            width: 20px;
            height: calc(100vh + 200px);
            font-family: 'Share Tech Mono', monospace;
            font-size: 14px;
            color: #00ff41;
            text-shadow: 0 0 5px #00ff41;
            animation: matrix-fall ${3 + Math.random() * 4}s linear infinite;
            animation-delay: ${Math.random() * 2}s;
            overflow: hidden;
            opacity: ${0.4 + Math.random() * 0.6};
        `;
        
        let rain = '';
        const numChars = Math.ceil((window.innerHeight + 200) / 16);
        for (let r = 0; r < numChars; r++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            rain += char + '<br>';
        }
        col.innerHTML = rain;
        loadingMatrixRain.appendChild(col);
    }
}

// Scroll Progress
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = scrolled + '%';
}

// Section visibility animation
function checkSectionVisibility() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
            section.classList.add('visible');
        }
    });
}

// Utility functions
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function downloadResume() {
    window.open('assets/files/Akbar_Resume.pdf', '_blank');
    return 'Opening resume PDF...';
}

function toggleMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
        mobileNav.classList.remove('open');
        document.body.classList.remove('noscroll');
    } else {
        mobileNav.classList.add('open');
        document.body.classList.add('noscroll');
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Terminal functionality
    document.querySelectorAll('.quick-action[title="Terminal"]').forEach(btn => {
        btn.onclick = function(e) {
            e.stopPropagation();
            openTerminalCli();
        };
    });
    
    const terminalCloseBtn = document.querySelector('#terminalCli .terminal-cli-header button');
    if (terminalCloseBtn) {
        terminalCloseBtn.onclick = function(e) {
            e.stopPropagation();
            closeTerminalCli();
        };
    }

    // Enhanced input handling with history
    const cliInput = document.getElementById('cliInput');
    if (cliInput) {
        cliInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim();
                if (command) {
                    executeEnhancedCommand(command);
                    this.value = '';
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    this.value = commandHistory[historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    this.value = commandHistory[historyIndex] || '';
                } else {
                    historyIndex = commandHistory.length;
                    this.value = '';
                }
            }
        });
    }

    // AI Assistant form
    const aiForm = document.getElementById('aiForm');
    if (aiForm) {
        aiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const input = document.getElementById('aiInput');
            const message = input.value.trim();
            
            if (message) {
                addAIMessage(message, true);
                input.value = '';
                
                setTimeout(() => {
                    const response = findAIResponse(message);
                    addAIMessage(response, false);
                }, 500 + Math.random() * 1000);
            }
        });
    }

    // Close AI modal when clicking outside
    const aiModal = document.getElementById('aiModal');
    if (aiModal) {
        aiModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAI();
            }
        });
    }

    // Matrix rain setup
    createMatrixRain();
    createLoadingMatrixRain();
    window.addEventListener('resize', createLoadingMatrixRain);
    
    checkSectionVisibility();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + Shift + T for terminal
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyT') {
            e.preventDefault();
            toggleTerminalCli();
        }
        // Ctrl + Shift + A for AI assistant
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyA') {
            e.preventDefault();
            openAI();
        }
        // Escape to close modals
        if (e.key === 'Escape') {
            closeAI();
            const terminalCli = document.getElementById('terminalCli');
            if (terminalCli) terminalCli.classList.remove('active');
            const mobileNav = document.getElementById('mobileNav');
            if (mobileNav) mobileNav.classList.remove('open');
            document.body.classList.remove('noscroll');
        }
    });
});

// Loading screen: matrix rain streams first, then text animates
window.addEventListener('DOMContentLoaded', function() {
    createLoadingMatrixRain();
    window.addEventListener('resize', createLoadingMatrixRain);
});
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    const lines = document.querySelectorAll('.loading-line');
    const matrixEnter = document.querySelector('.loading-matrix-enter');
    // Animate text after background is already streaming
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = 1;
        }, index * 500);
    });
    setTimeout(() => {
        if (matrixEnter) matrixEnter.style.opacity = 1;
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
                document.body.style.overflow = ''; // Ensure scrolling is enabled
            }, 600);
        }, 1200);
    }, lines.length * 500 + 700);

    // Fallback: Force hide loading screen after 5 seconds
    setTimeout(() => {
        if (loading && loading.style.display !== 'none') {
            loading.style.display = 'none';
            document.body.style.overflow = '';
        }
    }, 5000);

    // Ensure timeline items are clickable
    setTimeout(() => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.style.pointerEvents = 'auto';
            item.style.zIndex = '10';
        });
    }, 1000);
});

// Version Management System
const versionConfig = {
    current: "1.0",
    lastUpdated: "August 27, 2025",
    changelog: [
        "Initial portfolio launch with Matrix theme",
        "Complete terminal CLI with Linux-like commands",
        "Interactive navigation and smooth animations",
        "Comprehensive project showcase"
    ]
};

// Initialize version display
function initVersionDisplay() {
    const versionNumber = document.getElementById('versionNumber');
    const versionTooltip = document.getElementById('versionTooltip');
    
    if (versionNumber) {
        versionNumber.textContent = versionConfig.current;
    }
    
    // Update tooltip content
    if (versionTooltip) {
        const versionDetails = versionTooltip.querySelector('.version-details');
        if (versionDetails) {
            versionDetails.innerHTML = `
                <div class="version-title">Portfolio Version ${versionConfig.current}</div>
                <div class="version-date">Last Updated: ${versionConfig.lastUpdated}</div>
                <div class="version-changes">
                    <div class="change-title">Latest Updates:</div>
                    <ul>
                        ${versionConfig.changelog.map(change => `<li>${change}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }
}

// Add version command to terminal
enhancedTerminalCommands.version = () => {
    return `<div style="color: #00ff41; font-family: 'Courier New', monospace;">
╭─────────────────────────────────────────────────────────────╮
│                    📦 VERSION INFORMATION                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  <span style="color: #ff0040;">Current Version:</span> <span style="color: #00ccff;">v${versionConfig.current}</span>                              │
│  <span style="color: #ff0040;">Last Updated:</span> <span style="color: #ffff00;">${versionConfig.lastUpdated}</span>                   │
│                                                             │
│ <span style="color: #ffff00;">🔹 RECENT CHANGES</span>                                    │
${versionConfig.changelog.map(change => `│  <span style="color: #00ccff;">▸</span> ${change.padEnd(57)}│`).join('\n')}
│                                                             │
╰─────────────────────────────────────────────────────────────╯
</div>`;
};

// Function to update version (for future use)
function updateVersion(newVersion, updateDate, changes) {
    versionConfig.current = newVersion;
    versionConfig.lastUpdated = updateDate;
    versionConfig.changelog = changes;
    initVersionDisplay();
    
    // Save to localStorage for persistence
    localStorage.setItem('portfolioVersion', JSON.stringify(versionConfig));
}

// Load version from localStorage if available
function loadVersionConfig() {
    const savedVersion = localStorage.getItem('portfolioVersion');
    if (savedVersion) {
        try {
            const parsed = JSON.parse(savedVersion);
            Object.assign(versionConfig, parsed);
        } catch (e) {
            console.log('Using default version config');
        }
    }
}

// Event listeners for scroll effects
window.addEventListener('scroll', () => {
    updateScrollProgress();
    checkSectionVisibility();
    
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Initialize version display when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadVersionConfig();
    initVersionDisplay();
    initEngineerTypeAnimation();
});

// Engineer Type Typing Animation
function initEngineerTypeAnimation() {
    const engineerTypes = [
        'Computer',
        'Software',
        'Hardware',
        'Full Stack',
        'ML',
        'Data Science',
        'Signal Processing',
        'Embedded',
        'AI',
        'Systems',
        'Robotics',
        'Cybersecurity'
    ];
    
    let currentIndex = 0;
    let isDeleting = false;
    let currentText = '';
    let typeSpeed = 100;
    
    const element1 = document.getElementById('engineerType');
    const element2 = document.getElementById('engineerTypeAbout');
    
    function type() {
        const currentWord = engineerTypes[currentIndex];
        
        if (isDeleting) {
            currentText = currentWord.substring(0, currentText.length - 1);
            typeSpeed = 50;
        } else {
            currentText = currentWord.substring(0, currentText.length + 1);
            typeSpeed = 100;
        }
        
        // Update both elements with "Engineer" suffix
        if (element1) element1.textContent = currentText + ' Engineer';
        if (element2) element2.textContent = currentText + ' Engineer';
        
        if (!isDeleting && currentText === currentWord) {
            // Pause at end of word
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % engineerTypes.length;
            typeSpeed = 300;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start the animation after a short delay
    setTimeout(type, 2000);
}
