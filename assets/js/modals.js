// Modal Functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "block";
        // Don't disable body scrolling - let modal scroll instead
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

// Close modal with close button
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    }
});

// Close modal with escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal');
        openModals.forEach(modal => {
            if (modal.style.display === 'block') {
                closeModal(modal.id);
            }
        });
    }
});

// Create modals container and inject all modal HTML
document.addEventListener('DOMContentLoaded', function() {
    const modalsContainer = document.getElementById('modals-container');
    
    const modalsHTML = `
        <!-- Experience Detail Modals -->
        <div id="modal1" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>AI Trainer - Software Developer | Outlier</h2>
                <p><strong>Duration:</strong> April 2025 - Present</p>
                <p><strong>Location:</strong> Remote</p>
                <h3>Key Responsibilities</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Developed and evaluated prompts across technical domains, including code-based inputs in C++, Python, SQL, and JavaScript</li>
                    <li>Reviewed AI-generated outputs for correctness, logic, and clarity in complex programming scenarios</li>
                    <li>Produced improved reference implementations for various software development tasks</li>
                    <li>Identified failure cases and explored prompt optimization strategies for enhanced AI performance</li>
                    <li>Maintained 4.5/5 average task submission feedback across all assigned projects</li>
                </ul>
            </div>
        </div>

        <div id="modal2" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>AI Trainer - Machine Learning | Handshake (MOVE Fellowship)</h2>
                <p><strong>Duration:</strong> Aug 2025 - Present</p>
                <p><strong>Location:</strong> Remote</p>
                <h3>Key Responsibilities</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Collaborated with leading researchers through the MOVE Fellowship on contract-based projects to evaluate and refine state-of-the-art LLMs</li>
                    <li>Executed data labeling, prompt evaluation, and error identification to enhance model accuracy and reasoning</li>
                    <li>Supported model refinement through precise, actionable feedback to improve overall AI system performance</li>
                    <li>Participated in structured testing and contextual analysis of advanced language models</li>
                </ul>
            </div>
        </div>

        <div id="modal3" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>CS Teaching Assistant | University of Illinois Chicago</h2>
                <p><strong>Duration:</strong> Jan 2025 - Present</p>
                <p><strong>Location:</strong> Chicago, IL</p>
                <h3>Key Responsibilities</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Teaching CS 109: Programming for Engineers with MATLAB, supporting 30+ students per term</li>
                    <li>Developing and grading assignments, projects, and exams</li>
                    <li>Conducting office hours and exam review sessions to boost student engagement and success</li>
                </ul>
            </div>
        </div>

        <div id="modal-eng-success" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Engineering Success Program Mentor (ENGR 100/101) | University of Illinois Chicago</h2>
                <p><strong>Duration:</strong> Aug 2025 - Present</p>
                <p><strong>Location:</strong> Chicago, IL (On-site)</p>
                <h3>Key Achievements</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Taught ENGR 100/101: Engineering Success Seminar series (2 terms), facilitating lab sessions and seminar discussions for 60+ students.</li>
                    <li>Graded and administered homework, projects, and labs; proctored examinations while delivering constructive, targeted feedback.</li>
                    <li>Boosted engagement through individualized support in office hours, online forums, and tailored exam-week reviews.</li>
                </ul>
            </div>
        </div>

        <div id="modal4" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Code Coach | The Coder School</h2>
                <p><strong>Duration:</strong> Jan 2025 - Present</p>
                <p><strong>Location:</strong> Lombard, IL</p>
                <h3>Key Responsibilities</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Mentoring students in Python, C++, Java, and web development technologies</li>
                    <li>Designing custom lesson plans, projects, and coding challenges for varying skill levels</li>
                    <li>Providing individualized feedback and support to foster student growth and interest in programming</li>
                    <li>Teaching fundamental programming concepts and best practices</li>
                </ul>
            </div>
        </div>

        <div id="modal5" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Deep Learning Research Intern | UIC ECE Department</h2>
                <p><strong>Duration:</strong> Jun 2024 - Aug 2024</p>
                <p><strong>Location:</strong> Chicago, IL</p>
                <h3>Key Projects & Achievements</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Developed custom CNN architecture for wildfire detection achieving 20-30% accuracy improvement over baseline models</li>
                    <li>Implemented complete video processing pipeline using PyTorch and OpenCV</li>
                    <li>Collaborated with faculty and graduate students on computer vision research deliverables</li>
                    <li>Conducted data preprocessing, model training, and performance evaluation</li>
                </ul>
            </div>
        </div>

        <div id="modal6" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Machine Learning Intern | STEMAway</h2>
                <p><strong>Duration:</strong> Jun 2023 - Sep 2023</p>
                <p><strong>Location:</strong> Remote</p>
                <h3>Key Projects & Achievements</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Built and deployed ML pipelines for automated data collection and analysis</li>
                    <li>Worked with AWS, GPT API, and web scraping tools to streamline data workflows</li>
                    <li>Improved platform usability and accessibility for end users</li>
                    <li>Contributed to machine learning model development and testing</li>
                </ul>
            </div>
        </div>

        <!-- Project Detail Modals -->
        <div id="project1" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>lamhaa.ai - AI-Powered Photo Management Platform</h2>
                <p><strong>Status:</strong> In Active Development</p>
                <h3>Project Overview</h3>
                <p style="color:#cccccc;font-family:'Fira Code',monospace;">Advanced AI-powered FastAPI application designed to revolutionize photo organization, ranking, and delivery for photographers, creators, and businesses.</p>
                <h3>Technical Architecture</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li><strong>Backend:</strong> FastAPI with async support for high-performance API endpoints</li>
                    <li><strong>AI/ML:</strong> Custom computer vision models for intelligent photo analysis and categorization</li>
                    <li><strong>Infrastructure:</strong> Docker containerization with scalable deployment architecture</li>
                    <li><strong>Features:</strong> Automated photo ranking, smart organization, and efficient delivery systems</li>
                </ul>
            </div>
        </div>

        <div id="project2" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>VisionMamba - Wildfire Detection System</h2>
                <p><strong>Status:</strong> Research Project Completed</p>
                <h3>Project Overview</h3>
                <p style="color:#cccccc;font-family:'Fira Code',monospace;">Advanced computer vision system for real-time wildfire detection using custom CNN architecture, developed during research internship at UIC ECE Department.</p>
                <h3>Technical Achievements</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li><strong>Performance:</strong> Achieved 20-30% accuracy improvement over baseline detection models</li>
                    <li><strong>Architecture:</strong> Custom CNN design optimized for wildfire pattern recognition</li>
                    <li><strong>Processing:</strong> Complete video processing pipeline with real-time capabilities</li>
                    <li><strong>Implementation:</strong> PyTorch framework with OpenCV integration for robust performance</li>
                </ul>
            </div>
        </div>

        <div id="project3" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Embedded Systems Portfolio</h2>
                <p><strong>Status:</strong> Completed</p>
                <h3>Project Overview</h3>
                <p style="color:#cccccc;font-family:'Fira Code',monospace;">ARM-based microcontroller projects with sensor integration and real-time systems programming using mixed C and assembly language.</p>
                <h3>Implementation Details</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li><strong>Platform:</strong> Tiva C Series microcontroller with ARM Cortex-M4F processor</li>
                    <li><strong>Programming:</strong> Low-level C and ARM assembly for hardware control</li>
                    <li><strong>Integration:</strong> Sensor interfacing and real-time data processing</li>
                    <li><strong>Applications:</strong> Embedded control systems and hardware interface projects</li>
                </ul>
            </div>
        </div>

        <div id="project4" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Data Structures & Algorithms Library</h2>
                <p><strong>Tech Stack:</strong> Modern C++, STL</p>
                <h3>Project Overview</h3>
                <p style="color:#cccccc;font-family:'Fira Code',monospace;">A comprehensive C++ library implementing fundamental data structures and algorithms, developed through coursework in Data Structures. Features practical applications from text processing to pathfinding, with emphasis on performance optimization and modern C++ practices.</p>
                
                <h3>Key Components</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li><strong>Search Engine:</strong> Document search tool with AND/OR logic using inverted index, implemented with sets and maps</li>
                    <li><strong>Custom HashMap:</strong> Open addressing implementation with linear probing, dynamic resizing based on load factor</li>
                    <li><strong>BST Implementation:</strong> Complete binary search tree with recursive operations and visualization tools</li>
                    <li><strong>Graph Navigator:</strong> OpenStreetMap-based pathfinding using Dijkstra's and A* algorithms</li>
                </ul>

                <h3>Technical Highlights</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Implemented advanced data structures: linked lists, circular vectors, hash tables, and binary trees</li>
                    <li>Focused on memory safety, OOP principles, and template design patterns</li>
                    <li>Extensive performance analysis and benchmarking against STL containers</li>
                    <li>Real-world applications including text analysis, path computation, and drawing systems</li>
                </ul>
            </div>
        </div>

        <div id="project5" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Web Development Collection</h2>
                <p><strong>Tech Stack:</strong> HTML, CSS, JavaScript, Responsive Design</p>
                <h3>Project Overview</h3>
                <p style="color:#cccccc;font-family:'Fira Code',monospace;">Collection of creative web projects showcasing modern design principles, interactive features, and responsive layouts for various use cases.</p>
                
                <h3>Featured Projects</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li><strong>Interactive Galleries:</strong> Dynamic photo and content presentation systems</li>
                    <li><strong>Landing Pages:</strong> Professional business and portfolio landing page designs</li>
                    <li><strong>Web Applications:</strong> Interactive tools and calculators with modern UI</li>
                    <li><strong>Responsive Templates:</strong> Mobile-first designs with cross-device compatibility</li>
                </ul>

                <h3>Technical Implementation</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Pure vanilla JavaScript for all interactions and animations</li>
                    <li>CSS Grid and Flexbox for responsive layout design</li>
                    <li>Modern web standards and accessibility best practices</li>
                    <li>Performance optimization and cross-browser compatibility</li>
                </ul>
            </div>
        </div>

        <!-- Additional Project Modals -->
        <div id="project-personal-projects" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>AI Album Finder 🎵</h2>
                <p><strong>Tech Stack:</strong> Python, Flask, REST API, Docker, JavaScript, Spotify API</p>
                <h3>Project Overview</h3>
                <p style="color:#cccccc;font-family:'Fira Code',monospace;">AI-powered music discovery and analysis platform that leverages Spotify's Web API and artificial intelligence for deep music insights, mood analysis, and personalized recommendations.</p>
                
                <h3>Key Features</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li><strong>Audio Analysis:</strong> Advanced audio feature extraction and mood profiling</li>
                    <li><strong>Smart Recommendations:</strong> AI-powered personalized music suggestions</li>
                    <li><strong>REST API:</strong> Flask-based backend with comprehensive endpoints</li>
                    <li><strong>Production Ready:</strong> Dockerized deployment with scalable infrastructure</li>
                </ul>

                <h3>Technical Implementation</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Integrated Spotify Web API for comprehensive music data access</li>
                    <li>Implemented machine learning algorithms for mood and preference analysis</li>
                    <li>Built responsive frontend with modern JavaScript and interactive UI</li>
                    <li>Containerized application using Docker for consistent deployment</li>
                </ul>
            </div>
        </div>

        <div id="project-coderschool" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Student Projects</h2>
                <p><strong>Tech Stack:</strong> Python, JavaScript, HTML/CSS, Web Development</p>
                <h3>Project Overview</h3>
                <p style="color:#cccccc;font-family:'Fira Code',monospace;">A curated repository of educational projects designed and taught to students at The CoderSchool, covering beginner to intermediate programming concepts.</p>
                
                <h3>Educational Focus</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li><strong>Python Fundamentals:</strong> Core programming concepts and data structures</li>
                    <li><strong>Web Development:</strong> HTML, CSS, and JavaScript projects</li>
                    <li><strong>Interactive Projects:</strong> Games, calculators, and creative applications</li>
                    <li><strong>Collaborative Learning:</strong> Team-based coding exercises and challenges</li>
                </ul>

                <h3>Teaching Methodology</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Hands-on project-based learning with immediate practical application</li>
                    <li>Progressive difficulty scaling from basic syntax to complex applications</li>
                    <li>Regular code reviews and pair programming sessions</li>
                    <li>Real-world problem solving and debugging techniques</li>
                </ul>
            </div>
        </div>

        <div id="project-portfolio-website" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Portfolio Website</h2>
                <p><strong>Tech Stack:</strong> HTML, CSS, JavaScript, Responsive Design</p>
                <h3>Project Overview</h3>
                <p style="color:#cccccc;font-family:'Fira Code',monospace;">This very website! A modern, responsive portfolio built from scratch featuring a unique Matrix-inspired theme and interactive elements.</p>
                
                <h3>Design Features</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li><strong>Matrix Theme:</strong> Custom terminal-style design with animated effects</li>
                    <li><strong>Interactive Timeline:</strong> Experience and education progression with modal details</li>
                    <li><strong>Project Showcase:</strong> Comprehensive project cards with filtering and search</li>
                    <li><strong>Responsive Design:</strong> Mobile-first approach with cross-device compatibility</li>
                </ul>

                <h3>Technical Implementation</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Pure vanilla JavaScript for all interactions and animations</li>
                    <li>CSS Grid and Flexbox for responsive layout design</li>
                    <li>Modal system for detailed project and experience information</li>
                    <li>Optimized for performance and accessibility standards</li>
                </ul>
            </div>
        </div>

        <div id="project-leetcode" class="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>LeetCode Solutions</h2>
                <p><strong>Tech Stack:</strong> Python, Java, Algorithms, Problem Solving</p>
                <h3>Project Overview</h3>
                <p style="color:#cccccc;font-family:'Fira Code',monospace;">Comprehensive collection of LeetCode problem solutions designed for technical interview preparation and algorithmic skill development.</p>
                
                <h3>Key Features</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li><strong>Multiple Languages:</strong> Solutions implemented in Python and Java with clean, readable code</li>
                    <li><strong>Detailed Explanations:</strong> Each solution includes approach explanation and complexity analysis</li>
                    <li><strong>Test Cases:</strong> Comprehensive test coverage to verify solution correctness</li>
                    <li><strong>Interview Focus:</strong> Optimized for technical interview scenarios and time constraints</li>
                </ul>

                <h3>Problem Categories</h3>
                <ul style="color:#cccccc;font-family:'Fira Code',monospace;padding-left:2rem;">
                    <li>Array and String manipulation with optimal time/space complexity</li>
                    <li>Dynamic Programming solutions for complex optimization problems</li>
                    <li>Tree and Graph algorithms including DFS, BFS, and shortest path</li>
                    <li>Data structure design and implementation challenges</li>
                </ul>
            </div>
        </div>
    `;
    
    modalsContainer.innerHTML = modalsHTML;
});
