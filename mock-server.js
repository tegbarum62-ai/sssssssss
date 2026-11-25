const http = require('http');
const url = require('url');

const PORT = 8080;

// Roles
const roles = [
    { id: 1, name: 'ROLE_JOBSEEKER', description: 'Job Seeker' },
    { id: 2, name: 'ROLE_EMPLOYER', description: 'Employer' },
    { id: 3, name: 'ROLE_ADMIN', description: 'Administrator' }
];

// In-Memory Companies
let companies = [
    {
        id: 1,
        userId: 4,
        name: 'TechCorp Solutions',
        description: 'Leading global technology solutions provider specializing in cloud computing, modern web platforms, and AI engineering.',
        industry: 'Technology',
        location: 'Seattle, WA',
        website: 'https://techcorp.com',
        phone: '+1 206-555-0100',
        size: '250-500 employees',
        status: 'APPROVED',
        foundedYear: 2018
    },
    {
        id: 2,
        userId: 5,
        name: 'Innovate Solutions Inc',
        description: 'Innovation-driven software consultancy crafting high-performance enterprise applications.',
        industry: 'Software Development',
        location: 'Austin, TX',
        website: 'https://innovatesolutions.io',
        phone: '+1 512-555-0182',
        size: '50-100 employees',
        status: 'APPROVED',
        foundedYear: 2020
    },
    {
        id: 3,
        userId: 6,
        name: 'Future AI Labs',
        description: 'Next-generation generative AI research and intelligent automation systems.',
        industry: 'Artificial Intelligence',
        location: 'San Francisco, CA',
        website: 'https://futureai.org',
        phone: '+1 415-555-0199',
        size: '10-50 employees',
        status: 'PENDING',
        foundedYear: 2023
    }
];

// In-Memory Users
let users = [
    {
        id: 1,
        email: 'admin@jobportal.com',
        password: 'password123',
        role: 'ADMIN',
        firstName: 'System',
        lastName: 'Admin',
        isVerified: true,
        status: 'Active',
        joined: '2024-01-15',
        phone: '+1 800-555-0101',
        location: 'Washington, DC'
    },
    {
        id: 2,
        email: 'john.doe@email.com',
        password: 'password123',
        role: 'JOBSEEKER',
        firstName: 'John',
        lastName: 'Doe',
        isVerified: true,
        status: 'Active',
        joined: '2024-02-10',
        phone: '+1 415-555-0133',
        location: 'San Francisco, CA',
        bio: 'Senior Software Engineer with 5+ years specializing in React, TypeScript, and distributed backend microservices.',
        jobSeekerStatus: 'Actively Looking',
        headline: 'Full Stack & Cloud Engineer'
    },
    {
        id: 4,
        email: 'techcorp@company.com',
        password: 'password123',
        role: 'EMPLOYER',
        firstName: 'TechCorp',
        lastName: 'Hiring Team',
        isVerified: true,
        status: 'Active',
        joined: '2024-03-01',
        phone: '+1 206-555-0100',
        location: 'Seattle, WA'
    },
    {
        id: 5,
        email: 'innovate@company.com',
        password: 'password123',
        role: 'EMPLOYER',
        firstName: 'Innovate',
        lastName: 'Recruiter',
        isVerified: true,
        status: 'Active',
        joined: '2024-03-15',
        phone: '+1 512-555-0182',
        location: 'Austin, TX'
    },
    {
        id: 6,
        email: 'alice.smith@example.com',
        password: 'password123',
        role: 'JOBSEEKER',
        firstName: 'Alice',
        lastName: 'Smith',
        isVerified: true,
        status: 'Active',
        joined: '2024-04-05',
        phone: '+1 312-555-0199',
        location: 'Chicago, IL',
        bio: 'Creative UX/UI designer and front-end developer passionate about accessible web products.',
        jobSeekerStatus: 'Open to Opportunities',
        headline: 'Lead Product Designer'
    }
];

// In-Memory Jobs
let jobs = [
    {
        id: 1,
        company_id: 1,
        company: companies[0],
        companyName: 'TechCorp Solutions',
        title: 'Senior Full Stack Developer',
        description: 'We are seeking an experienced Senior Full Stack Developer to lead development on our cloud application suites. You will design, develop, test, and deploy resilient web apps using modern architectural patterns.',
        skillsRequired: 'React, Node.js, TypeScript, PostgreSQL, Docker',
        location: 'Seattle, WA',
        jobType: 'FULL_TIME',
        workMode: 'HYBRID',
        category: 'Software Development',
        salaryMin: 120000,
        salaryMax: 160000,
        status: 'ACTIVE',
        applicationCount: 5,
        openings: 2,
        createdAt: '2026-11-20T10:00:00Z',
        applicationDeadline: '2026-12-31'
    },
    {
        id: 2,
        company_id: 1,
        company: companies[0],
        companyName: 'TechCorp Solutions',
        title: 'DevOps & Cloud Engineer',
        description: 'Join our infrastructure team to automate CI/CD pipelines, optimize AWS Kubernetes clusters, and implement site reliability engineering best practices.',
        skillsRequired: 'Docker, Kubernetes, AWS, Terraform, CI/CD',
        location: 'Seattle, WA',
        jobType: 'FULL_TIME',
        workMode: 'REMOTE',
        category: 'DevOps',
        salaryMin: 110000,
        salaryMax: 145000,
        status: 'ACTIVE',
        applicationCount: 3,
        openings: 1,
        createdAt: '2026-11-21T11:00:00Z',
        applicationDeadline: '2026-12-25'
    },
    {
        id: 3,
        company_id: 2,
        company: companies[1],
        companyName: 'Innovate Solutions Inc',
        title: 'Lead Frontend Developer',
        description: 'Design and build high-performance client experiences. Collaborate closely with product managers and backend architects to deliver responsive web portals.',
        skillsRequired: 'React, Redux, JavaScript ES6+, HTML5, CSS3/SCSS',
        location: 'Austin, TX',
        jobType: 'FULL_TIME',
        workMode: 'REMOTE',
        category: 'Frontend Development',
        salaryMin: 95000,
        salaryMax: 125000,
        status: 'ACTIVE',
        applicationCount: 4,
        openings: 2,
        createdAt: '2026-11-22T09:30:00Z',
        applicationDeadline: '2026-12-28'
    },
    {
        id: 4,
        company_id: 2,
        company: companies[1],
        companyName: 'Innovate Solutions Inc',
        title: 'UX/UI Designer',
        description: 'Seeking an empathetic UX/UI Designer to craft engaging design systems, user flows, and wireframes for mobile and desktop applications.',
        skillsRequired: 'Figma, Adobe XD, Wireframing, Rapid Prototyping, User Research',
        location: 'Austin, TX',
        jobType: 'FULL_TIME',
        workMode: 'HYBRID',
        category: 'Design',
        salaryMin: 80000,
        salaryMax: 110000,
        status: 'ACTIVE',
        applicationCount: 2,
        openings: 1,
        createdAt: '2026-11-23T14:15:00Z',
        applicationDeadline: '2026-12-20'
    },
    {
        id: 5,
        company_id: 1,
        company: companies[0],
        companyName: 'TechCorp Solutions',
        title: 'AI / Machine Learning Engineer',
        description: 'Deploy cutting-edge machine learning and NLP models into scalable production services. Work with LLMs and prompt engineering pipelines.',
        skillsRequired: 'Python, PyTorch, LangChain, FastAPI, Docker',
        location: 'Seattle, WA',
        jobType: 'FULL_TIME',
        workMode: 'REMOTE',
        category: 'Artificial Intelligence',
        salaryMin: 140000,
        salaryMax: 185000,
        status: 'PENDING',
        applicationCount: 0,
        openings: 1,
        createdAt: '2026-11-25T08:00:00Z',
        applicationDeadline: '2027-01-15'
    }
];

// In-Memory Applications with full CV / Resume attachments
let applications = [
    {
        id: 1,
        jobId: 1,
        jobTitle: 'Senior Full Stack Developer',
        companyName: 'TechCorp Solutions',
        applicantId: 2,
        applicantName: 'John Doe',
        applicantEmail: 'john.doe@email.com',
        applicantPhone: '+1 415-555-0133',
        location: 'San Francisco, CA',
        headline: 'Senior Full Stack & Cloud Engineer',
        status: 'SUBMITTED',
        appliedDate: '2026-11-21',
        appliedAt: '2026-11-21 14:30',
        coverLetter: 'I have 5+ years of experience leading React, TypeScript, and microservice backend systems. I am excited to apply for the Senior Full Stack role at TechCorp Solutions.',
        cv: {
            title: 'Senior Full Stack Engineer',
            summary: 'Experienced Software Engineer with over 5 years developing scalable cloud services, web applications, and intuitive user interfaces. Adept in modern JavaScript/TypeScript ecosystems, React, Node.js, and containerized deployment.',
            experience: 'Senior Software Engineer at CloudScale Technologies (2022-Present); Full Stack Developer at WebSphere Innovations (2019-2022)',
            education: 'B.S. in Computer Science - University of California, Berkeley (2019)',
            skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'RESTful APIs', 'Jest'],
            uploadedFileName: 'John_Doe_Senior_Developer_Resume.pdf',
            uploadedFileSize: '245 KB',
            uploadedAt: '2026-11-20'
        },
        interviewDetails: null
    },
    {
        id: 2,
        jobId: 2,
        jobTitle: 'DevOps & Cloud Engineer',
        companyName: 'TechCorp Solutions',
        applicantId: 2,
        applicantName: 'John Doe',
        applicantEmail: 'john.doe@email.com',
        applicantPhone: '+1 415-555-0133',
        location: 'San Francisco, CA',
        headline: 'Senior Full Stack & Cloud Engineer',
        status: 'SHORTLISTED',
        appliedDate: '2026-11-22',
        appliedAt: '2026-11-22 10:15',
        coverLetter: 'I am AWS certified and have automated production Kubernetes deployments for high-scale microservices.',
        cv: {
            title: 'DevOps & Cloud Solutions Engineer',
            summary: 'Infrastructure and automation specialist skilled in AWS, Docker, Kubernetes, and CI/CD pipelines.',
            experience: 'Cloud Operations Lead at CloudScale Technologies (2022-Present)',
            education: 'B.S. in Computer Science - UC Berkeley',
            skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux', 'Python'],
            uploadedFileName: 'John_Doe_DevOps_Cloud_Resume.pdf',
            uploadedFileSize: '210 KB',
            uploadedAt: '2026-11-22'
        },
        interviewDetails: null
    },
    {
        id: 3,
        jobId: 3,
        jobTitle: 'Lead Frontend Developer',
        companyName: 'Innovate Solutions Inc',
        applicantId: 6,
        applicantName: 'Alice Smith',
        applicantEmail: 'alice.smith@example.com',
        applicantPhone: '+1 312-555-0199',
        location: 'Chicago, IL',
        headline: 'Lead Product Designer & Frontend Specialist',
        status: 'INTERVIEW_SCHEDULED',
        appliedDate: '2026-11-23',
        appliedAt: '2026-11-23 16:45',
        coverLetter: 'Passionate about building responsive, accessible design systems and state-of-the-art client apps.',
        cv: {
            title: 'Lead Frontend Engineer & UI/UX Specialist',
            summary: 'UI/UX engineer passionate about scalable frontend architecture, React ecosystems, and accessible design.',
            experience: 'Frontend Lead at DesignPro Studio (2021-Present)',
            education: 'B.A. in Interactive Digital Media - Northwestern University',
            skills: ['React', 'CSS3/SCSS', 'Figma', 'TypeScript', 'Responsive Web Design', 'Accessibility (a11y)'],
            uploadedFileName: 'Alice_Smith_Design_Frontend_Resume.pdf',
            uploadedFileSize: '315 KB',
            uploadedAt: '2026-11-23'
        },
        interviewDetails: {
            date: '2026-12-02',
            time: '14:00 EST',
            mode: 'Google Meet',
            link: 'https://meet.google.com/xyz-job-portal',
            notes: 'Technical discussion and portfolio walkthrough with engineering leads.'
        }
    }
];

// Pending Employers for Admin Verification
let pendingEmployers = [
    {
        id: 101,
        companyName: 'Apex Innovations LLC',
        companyDescription: 'Next-generation cloud automation and workflow management platform.',
        email: 'hr@apexinnovations.io',
        phone: '+1 555-0199',
        businessRegistrationNumber: 'BRN-2026-8841',
        tinNumber: 'TIN-994821',
        taxClearanceCertificate: 'tax_clearance_cert_apex.pdf',
        businessLicenseDocument: 'business_license_apex.pdf',
        commercialRegistrationDocument: 'commercial_reg_apex.pdf',
        registeredAt: '2026-11-24'
    },
    {
        id: 102,
        companyName: 'Quantum Dynamics Corp',
        companyDescription: 'Quantum computing algorithm design and simulation systems.',
        email: 'contact@quantumdynamics.org',
        phone: '+1 555-0245',
        businessRegistrationNumber: 'BRN-2026-9012',
        tinNumber: 'TIN-883109',
        taxClearanceCertificate: 'tax_cert_quantum.pdf',
        businessLicenseDocument: 'license_quantum.pdf',
        commercialRegistrationDocument: 'cr_quantum.pdf',
        registeredAt: '2026-11-25'
    }
];

// Audit Logs
let auditLogs = [
    { id: 1, timestamp: '2026-11-25 18:45:12', actor: 'admin@jobportal.com', action: 'APPROVE_EMPLOYER', details: 'Approved TechCorp Solutions business credentials', ip: '192.168.1.10' },
    { id: 2, timestamp: '2026-11-25 18:30:00', actor: 'techcorp@company.com', action: 'POST_JOB', details: 'Posted job: Senior Full Stack Developer (ID #1)', ip: '192.168.1.15' },
    { id: 3, timestamp: '2026-11-25 18:15:22', actor: 'john.doe@email.com', action: 'APPLY_JOB', details: 'Submitted application for Job #1', ip: '192.168.1.24' },
    { id: 4, timestamp: '2026-11-25 17:50:41', actor: 'admin@jobportal.com', action: 'SECURITY_CONFIG', details: 'Updated JWT expiration window to 24h', ip: '192.168.1.10' },
    { id: 5, timestamp: '2026-11-25 17:20:10', actor: 'techcorp@company.com', action: 'UPDATE_COMPANY', details: 'Updated company description and headquarters location', ip: '192.168.1.15' }
];

// Notifications
let notifications = [
    {
        id: 1,
        userId: 2,
        title: 'Application Shortlisted',
        message: 'TechCorp Solutions has shortlisted your application for DevOps & Cloud Engineer.',
        type: 'APPLICATION_STATUS',
        isRead: false,
        createdAt: '2026-11-24T12:00:00Z'
    },
    {
        id: 2,
        userId: 2,
        title: 'New Matching Job',
        message: 'A new job matching your preferences: "AI / Machine Learning Engineer" was just posted.',
        type: 'JOB_ALERT',
        isRead: false,
        createdAt: '2026-11-25T08:30:00Z'
    },
    {
        id: 3,
        userId: 4,
        title: 'New Applicant',
        message: 'John Doe applied for your Senior Full Stack Developer position.',
        type: 'NEW_APPLICATION',
        isRead: false,
        createdAt: '2026-11-21T14:30:00Z'
    }
];

// Job Seeker CV
let userCVs = {
    2: {
        template: 'Modern Professional',
        uploadedFile: {
            name: 'John_Doe_Senior_Developer_Resume.pdf',
            size: '245 KB',
            uploadedAt: '2026-11-24',
            downloadUrl: '#'
        },
        sections: {
            personal: {
                name: 'John Doe',
                email: 'john.doe@email.com',
                phone: '+1 415-555-0133',
                location: 'San Francisco, CA',
                title: 'Senior Full Stack Engineer',
                website: 'https://johndoe.dev'
            },
            summary: 'Experienced Software Engineer with over 5 years developing scalable cloud services, web applications, and intuitive user interfaces. Adept in modern JavaScript/TypeScript ecosystems, React, Node.js, and containerized deployment.',
            experience: [
                {
                    role: 'Senior Software Engineer',
                    company: 'CloudScale Technologies',
                    duration: '2022 - Present',
                    description: 'Architected distributed web portals handling 10M+ monthly requests. Reduced API latency by 35% through Redis caching and query optimization.'
                },
                {
                    role: 'Full Stack Developer',
                    company: 'WebSphere Innovations',
                    duration: '2019 - 2022',
                    description: 'Developed interactive customer-facing web apps with React, Bootstrap, and Node.js REST APIs.'
                }
            ],
            education: [
                {
                    degree: 'B.S. in Computer Science',
                    school: 'University of California, Berkeley',
                    year: '2019'
                }
            ],
            skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'RESTful APIs', 'Git', 'Bootstrap 5', 'Jest'],
            certifications: ['AWS Certified Solutions Architect - Associate', 'Meta Certified Front-End Developer']
        }
    }
};

// Job Alerts preferences
let userAlerts = {
    2: {
        alertsEnabled: true,
        keywords: 'React, Node.js, Cloud, DevOps',
        location: 'Remote',
        type: 'Full-time',
        emailAlert: true,
        pushAlert: true
    }
};

// Admin System Settings
let systemSettings = {
    websiteName: 'ET job connect',
    supportEmail: 'support@etjobconnect.com',
    language: 'English',
    maintenanceMode: false,
    allowEmployerSelfRegistration: true,
    requireEmployerVerification: true,
    requireJobApproval: true,
    emailAlertsEnabled: true
};

const server = http.createServer((req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    if (path.endsWith('/') && path.length > 1) {
        path = path.substring(0, path.length - 1);
    }

    console.log(`${req.method} ${path}`);

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        let payload = {};
        try {
            payload = body ? JSON.parse(body) : {};
        } catch (e) {
            // Raw body or non-JSON
        }

        const sendJSON = (statusCode, data) => {
            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
        };

        const addAuditLog = (actor, action, details) => {
            auditLogs.unshift({
                id: auditLogs.length + 1,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                actor: actor || 'system@jobportal.com',
                action,
                details,
                ip: req.socket.remoteAddress || '127.0.0.1'
            });
        };

        // ================= AUTH ROUTES =================
        if (path === '/api/auth/login' && req.method === 'POST') {
            const { email, password } = payload;
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                if (user.status === 'Suspended') {
                    return sendJSON(403, { message: 'Your account has been suspended. Please contact admin support.' });
                }
                addAuditLog(user.email, 'USER_LOGIN', `User ${user.email} logged in successfully`);
                return sendJSON(200, {
                    accessToken: 'mock-jwt-token-' + user.role,
                    tokenType: 'Bearer',
                    userId: user.id,
                    email: user.email,
                    role: 'ROLE_' + user.role.toUpperCase(),
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isVerified: user.isVerified !== undefined ? user.isVerified : true
                });
            } else {
                return sendJSON(401, { message: 'Invalid email or password' });
            }
        }

        if (path === '/api/auth/register' && req.method === 'POST') {
            const userData = payload;
            const existing = users.find(u => u.email === userData.email);
            if (existing) {
                return sendJSON(400, { message: 'User with this email already exists' });
            }

            userData.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
            const isEmployer = (userData.role || '').toUpperCase() === 'EMPLOYER';
            userData.isVerified = !isEmployer; // Employers require verification by admin
            userData.status = 'Active';
            userData.joined = new Date().toISOString().split('T')[0];
            users.push(userData);

            if (isEmployer) {
                const comp = {
                    id: companies.length + 1,
                    userId: userData.id,
                    name: userData.companyName || `${userData.firstName}'s Company`,
                    description: userData.companyDescription || 'Employer company registered on portal',
                    industry: 'Technology',
                    location: 'United States',
                    website: 'https://example.com',
                    phone: '+1 555-0100',
                    size: '10-50 employees',
                    status: 'PENDING',
                    foundedYear:2026
                };
                companies.push(comp);

                pendingEmployers.push({
                    id: userData.id,
                    companyName: comp.name,
                    companyDescription: comp.description,
                    email: userData.email,
                    phone: '+1 555-0100',
                    businessRegistrationNumber: `BRN-${Date.now().toString().slice(-6)}`,
                    tinNumber: `TIN-${Date.now().toString().slice(-6)}`,
                    taxClearanceCertificate: 'tax_clearance.pdf',
                    businessLicenseDocument: 'business_license.pdf',
                    commercialRegistrationDocument: 'commercial_registration.pdf',
                    registeredAt: new Date().toISOString().split('T')[0]
                });
            }

            addAuditLog(userData.email, 'USER_REGISTER', `New user registered with role ${userData.role}`);
            return sendJSON(201, { message: 'User registered successfully' });
        }

        // ================= USER PROFILE ROUTES =================
        if (path === '/api/user/profile' && req.method === 'GET') {
            const email = parsedUrl.query.email || 'john.doe@email.com';
            const user = users.find(u => u.email === email) || users[1];
            return sendJSON(200, user);
        }

        if (path === '/api/user/profile' && req.method === 'PUT') {
            const email = payload.email || 'john.doe@email.com';
            const index = users.findIndex(u => u.email === email);
            if (index !== -1) {
                users[index] = { ...users[index], ...payload };
                addAuditLog(email, 'UPDATE_PROFILE', 'User updated personal profile details');
                return sendJSON(200, users[index]);
            }
            return sendJSON(404, { message: 'User not found' });
        }

        // ================= EMPLOYER COMPANY ROUTES =================
        if (path === '/api/employer/company' && req.method === 'GET') {
            return sendJSON(200, companies[0]);
        }

        if (path === '/api/employer/company' && req.method === 'PUT') {
            companies[0] = { ...companies[0], ...payload };
            jobs.forEach(j => {
                if (j.company_id === companies[0].id) {
                    j.companyName = companies[0].name;
                }
            });
            addAuditLog('techcorp@company.com', 'UPDATE_COMPANY', 'Employer updated company profile');
            return sendJSON(200, companies[0]);
        }

        // ================= JOB POSTING & MANAGEMENT =================
        if (path === '/api/jobs' && req.method === 'GET') {
            const query = parsedUrl.query;
            let filteredJobs = jobs.filter(j => j.status === 'ACTIVE' || query.all === 'true');

            if (query.keyword) {
                const kw = query.keyword.toLowerCase();
                filteredJobs = filteredJobs.filter(j =>
                    j.title.toLowerCase().includes(kw) ||
                    j.description.toLowerCase().includes(kw) ||
                    (j.skillsRequired || '').toLowerCase().includes(kw) ||
                    (j.companyName || '').toLowerCase().includes(kw)
                );
            }
            if (query.location) {
                filteredJobs = filteredJobs.filter(j =>
                    j.location.toLowerCase().includes(query.location.toLowerCase())
                );
            }
            if (query.category && query.category !== 'All') {
                filteredJobs = filteredJobs.filter(j => j.category === query.category);
            }

            return sendJSON(200, {
                content: filteredJobs,
                totalElements: filteredJobs.length,
                totalPages: 1,
                size: 100,
                number: 0
            });
        }

        if (path === '/api/jobs' && req.method === 'POST') {
            const newJob = {
                id: jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1,
                company_id: companies[0].id,
                company: companies[0],
                companyName: payload.companyName || companies[0].name,
                title: payload.title || 'Untitled Role',
                description: payload.description || 'No description provided.',
                skillsRequired: payload.skillsRequired || payload.skills || '',
                location: payload.location || 'Remote',
                category: payload.category || 'Software Development',
                jobType: payload.jobType || 'FULL_TIME',
                workMode: payload.workMode || 'REMOTE',
                salaryMin: payload.salaryMin ? Number(payload.salaryMin) : 60000,
                salaryMax: payload.salaryMax ? Number(payload.salaryMax) : (payload.salaryMin ? Number(payload.salaryMin) * 1.25 : 90000),
                applicationDeadline: payload.applicationDeadline || payload.deadline || '2027-01-31',
                status: 'ACTIVE',
                applicationCount: 0,
                openings: payload.openings ? Number(payload.openings) : 1,
                createdAt: new Date().toISOString()
            };
            jobs.unshift(newJob);
            addAuditLog('techcorp@company.com', 'CREATE_JOB', `Employer created new job post: ${newJob.title} (ID #${newJob.id})`);
            return sendJSON(201, newJob);
        }

        if (path.startsWith('/api/jobs/') && req.method === 'GET') {
            const id = parseInt(path.split('/').pop());
            const job = jobs.find(j => j.id === id);
            if (job) {
                return sendJSON(200, job);
            }
            return sendJSON(404, { message: 'Job not found' });
        }

        if (path.startsWith('/api/jobs/') && req.method === 'PUT') {
            const id = parseInt(path.split('/').pop());
            const index = jobs.findIndex(j => j.id === id);
            if (index !== -1) {
                jobs[index] = { ...jobs[index], ...payload };
                addAuditLog('techcorp@company.com', 'UPDATE_JOB', `Updated job details for #${id} - ${jobs[index].title}`);
                return sendJSON(200, jobs[index]);
            }
            return sendJSON(404, { message: 'Job not found' });
        }

        if (path.startsWith('/api/jobs/') && req.method === 'DELETE') {
            const id = parseInt(path.split('/').pop());
            const index = jobs.findIndex(j => j.id === id);
            if (index !== -1) {
                const title = jobs[index].title;
                jobs.splice(index, 1);
                addAuditLog('techcorp@company.com', 'DELETE_JOB', `Deleted job #${id} - ${title}`);
                return sendJSON(200, { message: 'Job post deleted successfully' });
            }
            return sendJSON(404, { message: 'Job not found' });
        }

        // ================= EMPLOYER SPECIFIC JOBS =================
        if (path === '/api/employer/jobs' && req.method === 'GET') {
            const employerJobs = jobs.filter(j => j.company_id === companies[0].id);
            return sendJSON(200, employerJobs);
        }

        if (path === '/api/employer/jobs' && req.method === 'POST') {
            const newJob = {
                id: jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1,
                company_id: companies[0].id,
                company: companies[0],
                companyName: companies[0].name,
                ...payload,
                status: payload.status || 'ACTIVE',
                applicationCount: 0,
                createdAt: new Date().toISOString()
            };
            jobs.unshift(newJob);
            addAuditLog('techcorp@company.com', 'CREATE_JOB', `Employer posted job: ${newJob.title}`);
            return sendJSON(201, newJob);
        }

        if (path.startsWith('/api/employer/jobs/') && req.method === 'DELETE') {
            const id = parseInt(path.split('/').pop());
            const index = jobs.findIndex(j => j.id === id);
            if (index !== -1) {
                jobs.splice(index, 1);
                return sendJSON(200, { message: 'Job deleted successfully' });
            }
            return sendJSON(404, { message: 'Job not found' });
        }

        if (path === '/api/employer/stats' && req.method === 'GET') {
            const employerJobs = jobs.filter(j => j.company_id === companies[0].id);
            return sendJSON(200, {
                totalPosted: employerJobs.length,
                activeJobs: employerJobs.filter(j => j.status === 'ACTIVE').length,
                closedJobs: employerJobs.filter(j => j.status === 'CLOSED').length,
                totalApplicants: applications.length,
                shortlistedCount: applications.filter(a => a.status === 'SHORTLISTED').length,
                interviewsScheduled: applications.filter(a => a.status === 'INTERVIEW_SCHEDULED').length,
                approvedCount: applications.filter(a => a.status === 'APPROVED').length
            });
        }

        // ================= APPLICATIONS & RECRUITMENT =================
        if (path.startsWith('/api/applications/apply/') && req.method === 'POST') {
            const jobId = parseInt(path.split('/').pop());
            const job = jobs.find(j => j.id === jobId);
            if (job) {
                const alreadyApplied = applications.find(a => a.jobId === jobId && a.applicantId === 2);
                if (alreadyApplied) {
                    return sendJSON(400, { message: 'You have already submitted an application for this position.' });
                }

                job.applicationCount = (job.applicationCount || 0) + 1;
                const newApp = {
                    id: applications.length > 0 ? Math.max(...applications.map(a => a.id)) + 1 : 1,
                    jobId: job.id,
                    jobTitle: job.title,
                    companyName: job.companyName || job.company?.name || 'TechCorp Solutions',
                    applicantId: 2,
                    applicantName: 'John Doe',
                    applicantEmail: 'john.doe@email.com',
                    applicantPhone: '+1 415-555-0133',
                    location: 'San Francisco, CA',
                    headline: 'Senior Full Stack & Cloud Engineer',
                    status: 'SUBMITTED',
                    appliedDate: new Date().toISOString().split('T')[0],
                    appliedAt: new Date().toLocaleString(),
                    coverLetter: payload.coverLetter || 'I am excited to apply for this position and contribute my skills.',
                    cv: {
                        title: userCVs[2]?.sections?.personal?.title || 'Senior Full Stack Engineer',
                        summary: userCVs[2]?.sections?.summary || 'Experienced Software Engineer with 5+ years.',
                        experience: 'Senior Software Engineer at CloudScale Technologies (2022-Present)',
                        education: 'B.S. in Computer Science - UC Berkeley',
                        skills: userCVs[2]?.sections?.skills || ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
                        uploadedFileName: userCVs[2]?.uploadedFile?.name || 'John_Doe_Resume.pdf',
                        uploadedFileSize: userCVs[2]?.uploadedFile?.size || '245 KB',
                        uploadedAt: userCVs[2]?.uploadedFile?.uploadedAt || '2026-11-24'
                    },
                    interviewDetails: null
                };
                applications.unshift(newApp);

                // Add notification for Employer
                notifications.unshift({
                    id: notifications.length + 1,
                    userId: 4,
                    title: 'New Applicant Received',
                    message: `${newApp.applicantName} applied for ${job.title}`,
                    type: 'NEW_APPLICATION',
                    isRead: false,
                    createdAt: new Date().toISOString()
                });

                addAuditLog('john.doe@email.com', 'APPLY_JOB', `Applied for job: ${job.title} (#${job.id})`);
                return sendJSON(200, { message: 'Application submitted successfully!', application: newApp });
            }
            return sendJSON(404, { message: 'Job not found' });
        }

        if (path === '/api/applications/my-applications' && req.method === 'GET') {
            const userApps = applications.filter(a => a.applicantId === 2);
            return sendJSON(200, userApps);
        }

        if (path === '/api/employer/applications' && req.method === 'GET') {
            return sendJSON(200, applications);
        }

        // Status update with notification to applicant
        if (path.startsWith('/api/employer/applications/') && path.endsWith('/status') && req.method === 'PUT') {
            const segments = path.split('/');
            const id = parseInt(segments[segments.length - 2]);
            const app = applications.find(a => a.id === id);
            if (app) {
                const oldStatus = app.status;
                app.status = payload.status;
                if (payload.notes) app.notes = payload.notes;

                let title = `Application Status: ${payload.status}`;
                let message = `Your application for ${app.jobTitle} at ${app.companyName} is now ${payload.status}.`;

                if (payload.status === 'APPROVED') {
                    title = '🎉 Application Approved!';
                    message = `Congratulations! TechCorp Solutions has approved and accepted your application for ${app.jobTitle}. The team will reach out with onboarding details.`;
                } else if (payload.status === 'SHORTLISTED') {
                    title = '⭐ Profile Shortlisted';
                    message = `Great news! You have been shortlisted by ${app.companyName} for the ${app.jobTitle} position.`;
                } else if (payload.status === 'REJECTED') {
                    title = 'Application Update';
                    message = `Thank you for your interest in ${app.companyName}. Your application for ${app.jobTitle} was not selected to move forward at this time.`;
                }

                if (payload.customMessage) {
                    message = `${message} Message from employer: "${payload.customMessage}"`;
                }

                // Notify job seeker
                notifications.unshift({
                    id: notifications.length + 1,
                    userId: app.applicantId,
                    title,
                    message,
                    type: 'APPLICATION_STATUS',
                    isRead: false,
                    createdAt: new Date().toISOString()
                });

                addAuditLog('techcorp@company.com', 'UPDATE_APPLICATION_STATUS', `Changed applicant #${id} (${app.applicantName}) status from ${oldStatus} to ${payload.status}`);
                return sendJSON(200, app);
            }
            return sendJSON(404, { message: 'Application not found' });
        }

        // Schedule interview
        if (path.startsWith('/api/employer/applications/') && path.endsWith('/schedule-interview') && req.method === 'POST') {
            const segments = path.split('/');
            const id = parseInt(segments[segments.length - 2]);
            const app = applications.find(a => a.id === id);
            if (app) {
                app.status = 'INTERVIEW_SCHEDULED';
                app.interviewDetails = {
                    date: payload.date || '2026-12-05',
                    time: payload.time || '10:00 AM EST',
                    mode: payload.mode || 'Google Meet',
                    link: payload.link || 'https://meet.google.com/et-job-interview',
                    notes: payload.notes || 'Please be prepared to discuss your past projects and technical approach.'
                };

                notifications.unshift({
                    id: notifications.length + 1,
                    userId: app.applicantId,
                    title: '📅 Interview Scheduled!',
                    message: `An interview for ${app.jobTitle} at ${app.companyName} has been arranged for ${app.interviewDetails.date} at ${app.interviewDetails.time} via ${app.interviewDetails.mode}.`,
                    type: 'INTERVIEW',
                    isRead: false,
                    createdAt: new Date().toISOString()
                });

                addAuditLog('techcorp@company.com', 'SCHEDULE_INTERVIEW', `Arranged interview with ${app.applicantName} for ${app.jobTitle}`);
                return sendJSON(200, { message: 'Interview scheduled successfully', application: app });
            }
            return sendJSON(404, { message: 'Application not found' });
        }

        // ================= CV / RESUME BUILDER & UPLOAD =================
        if (path === '/api/jobseeker/cv' && req.method === 'GET') {
            const cv = userCVs[2] || {
                template: 'Modern Professional',
                uploadedFile: null,
                sections: {
                    personal: { name: 'John Doe', email: 'john.doe@email.com', phone: '+1 415-555-0133' },
                    summary: 'Experienced Software Engineer',
                    experience: [],
                    education: [],
                    skills: []
                }
            };
            return sendJSON(200, cv);
        }

        if (path === '/api/jobseeker/cv' && (req.method === 'PUT' || req.method === 'POST')) {
            userCVs[2] = { ...userCVs[2], ...payload };
            addAuditLog('john.doe@email.com', 'UPDATE_CV', 'Job seeker updated their CV builder profile');
            return sendJSON(200, { message: 'CV saved successfully', cv: userCVs[2] });
        }

        // Upload CV File endpoint
        if (path === '/api/jobseeker/cv/upload' && req.method === 'POST') {
            const fileName = payload.fileName || 'John_Doe_Uploaded_CV.pdf';
            const fileSize = payload.fileSize || '320 KB';
            const uploadedFile = {
                name: fileName,
                size: fileSize,
                uploadedAt: new Date().toISOString().split('T')[0],
                downloadUrl: '#'
            };
            if (!userCVs[2]) userCVs[2] = {};
            userCVs[2].uploadedFile = uploadedFile;

            // Also update applicant's CV on existing applications
            applications.forEach(a => {
                if (a.applicantId === 2 && a.cv) {
                    a.cv.uploadedFileName = fileName;
                    a.cv.uploadedFileSize = fileSize;
                }
            });

            addAuditLog('john.doe@email.com', 'UPLOAD_CV', `Uploaded CV document: ${fileName}`);
            return sendJSON(200, { message: 'CV document uploaded successfully!', uploadedFile });
        }

        // ================= ALERTS & NOTIFICATIONS =================
        if (path === '/api/notifications' && req.method === 'GET') {
            const userId = parseInt(parsedUrl.query.userId || 2);
            const userNotes = notifications.filter(n => n.userId === userId || userId === 1);
            return sendJSON(200, userNotes);
        }

        if (path === '/api/notifications/read-all' && req.method === 'POST') {
            notifications.forEach(n => { n.isRead = true; });
            return sendJSON(200, { message: 'All notifications marked as read' });
        }

        if (path === '/api/jobseeker/alerts' && req.method === 'GET') {
            return sendJSON(200, userAlerts[2] || {});
        }

        if (path === '/api/jobseeker/alerts' && req.method === 'PUT') {
            userAlerts[2] = { ...userAlerts[2], ...payload };
            return sendJSON(200, userAlerts[2]);
        }

        // ================= CAREER ANALYTICS =================
        if (path === '/api/jobseeker/analytics' && req.method === 'GET') {
            const myApps = applications.filter(a => a.applicantId === 2);
            return sendJSON(200, {
                totalApplications: myApps.length,
                shortlistedCount: myApps.filter(a => a.status === 'SHORTLISTED').length,
                interviewsScheduled: myApps.filter(a => a.status === 'INTERVIEW_SCHEDULED').length,
                underReviewCount: myApps.filter(a => a.status === 'SUBMITTED' || a.status === 'REVIEWED').length,
                approvedCount: myApps.filter(a => a.status === 'APPROVED').length,
                rejectedCount: myApps.filter(a => a.status === 'REJECTED').length,
                profileStrength: 88,
                savedCVsCount: 2,
                activeJobAlertsCount: 5,
                recentActivities: [
                    { title: 'Applied to Senior Full Stack Developer', date: 'Nov 21', status: 'Submitted' },
                    { title: 'Shortlisted by TechCorp Solutions', date: 'Nov 22', status: 'Shortlisted' },
                    { title: 'CV Profile & Document Updated', date: 'Nov 24', status: 'Completed' }
                ]
            });
        }

        // ================= ADMIN DASHBOARD ROUTES =================
        if (path === '/api/admin/stats' && req.method === 'GET') {
            return sendJSON(200, {
                users: users.length,
                jobs: jobs.length,
                companies: companies.length,
                alerts: pendingEmployers.length,
                activeJobs: jobs.filter(j => j.status === 'ACTIVE').length,
                pendingJobs: jobs.filter(j => j.status === 'PENDING').length,
                totalApplications: applications.length
            });
        }

        if (path === '/api/admin/settings' && req.method === 'GET') {
            return sendJSON(200, systemSettings);
        }

        if (path === '/api/admin/settings' && req.method === 'PUT') {
            systemSettings = { ...systemSettings, ...payload };
            addAuditLog('admin@jobportal.com', 'UPDATE_SETTINGS', 'Administrator updated system configurations');
            return sendJSON(200, systemSettings);
        }

        if (path === '/api/admin/users' && req.method === 'GET') {
            return sendJSON(200, users);
        }

        if (path.startsWith('/api/admin/users/') && path.endsWith('/status') && req.method === 'PUT') {
            const segments = path.split('/');
            const id = parseInt(segments[segments.length - 2]);
            const user = users.find(u => u.id === id);
            if (user) {
                user.status = payload.status;
                addAuditLog('admin@jobportal.com', 'CHANGE_USER_STATUS', `Changed user ${user.email} status to ${payload.status}`);
                return sendJSON(200, user);
            }
            return sendJSON(404, { message: 'User not found' });
        }

        if (path.startsWith('/api/admin/users/') && path.endsWith('/role') && req.method === 'PUT') {
            const segments = path.split('/');
            const id = parseInt(segments[segments.length - 2]);
            const user = users.find(u => u.id === id);
            if (user) {
                user.role = payload.role;
                addAuditLog('admin@jobportal.com', 'CHANGE_USER_ROLE', `Updated ${user.email} role to ${payload.role}`);
                return sendJSON(200, user);
            }
            return sendJSON(404, { message: 'User not found' });
        }

        if (path.startsWith('/api/admin/users/') && req.method === 'DELETE') {
            const id = parseInt(path.split('/').pop());
            if (id === 1) {
                return sendJSON(403, { message: 'The master administrator account cannot be deleted.' });
            }
            const index = users.findIndex(u => u.id === id);
            if (index !== -1) {
                const deletedEmail = users[index].email;
                users.splice(index, 1);
                addAuditLog('admin@jobportal.com', 'DELETE_USER', `Deleted user account ${deletedEmail} (ID #${id})`);
                return sendJSON(200, { message: 'User deleted successfully' });
            }
            return sendJSON(404, { message: 'User not found' });
        }

        // Employer Verifications
        if (path === '/api/admin/employers/pending' && req.method === 'GET') {
            return sendJSON(200, pendingEmployers);
        }

        if (path.startsWith('/api/admin/users/') && (path.endsWith('/approve') || path.endsWith('/reject')) && req.method === 'POST') {
            const segments = path.split('/');
            const id = parseInt(segments[segments.length - 2]);
            const action = segments[segments.length - 1];

            pendingEmployers = pendingEmployers.filter(e => e.id !== id);
            const user = users.find(u => u.id === id);
            if (user) {
                user.isVerified = (action === 'approve');
            }
            const comp = companies.find(c => c.userId === id);
            if (comp) {
                comp.status = action === 'approve' ? 'APPROVED' : 'REJECTED';
            }
            addAuditLog('admin@jobportal.com', `${action.toUpperCase()}_EMPLOYER`, `${action === 'approve' ? 'Approved' : 'Rejected'} employer verification for user ID #${id}`);
            return sendJSON(200, { message: `Employer ${action}d successfully` });
        }

        // Job Approval Queue & Job Moderation
        if (path === '/api/admin/jobs/pending' && req.method === 'GET') {
            const pendingJobs = jobs.filter(j => j.status === 'PENDING');
            return sendJSON(200, pendingJobs);
        }

        if (path.startsWith('/api/admin/jobs/') && (path.endsWith('/approve') || path.endsWith('/reject')) && req.method === 'POST') {
            const segments = path.split('/');
            const id = parseInt(segments[segments.length - 2]);
            const action = segments[segments.length - 1];
            const job = jobs.find(j => j.id === id);
            if (job) {
                job.status = (action === 'approve') ? 'ACTIVE' : 'REJECTED';
                addAuditLog('admin@jobportal.com', `${action.toUpperCase()}_JOB`, `${action === 'approve' ? 'Approved' : 'Rejected'} job post #${id} - ${job.title}`);
                return sendJSON(200, { message: `Job ${action}d successfully`, job });
            }
            return sendJSON(404, { message: 'Job not found' });
        }

        if (path === '/api/admin/jobs' && req.method === 'GET') {
            return sendJSON(200, jobs);
        }

        if (path.startsWith('/api/admin/jobs/') && req.method === 'DELETE') {
            const id = parseInt(path.split('/').pop());
            const index = jobs.findIndex(j => j.id === id);
            if (index !== -1) {
                const title = jobs[index].title;
                jobs.splice(index, 1);
                addAuditLog('admin@jobportal.com', 'DELETE_JOB', `Admin deleted job post #${id} - ${title}`);
                return sendJSON(200, { message: 'Job deleted successfully' });
            }
            return sendJSON(404, { message: 'Job not found' });
        }

        if (path === '/api/admin/applications' && req.method === 'GET') {
            return sendJSON(200, applications);
        }

        if (path === '/api/admin/audit-logs' && req.method === 'GET') {
            return sendJSON(200, auditLogs);
        }

        if (path === '/api/admin/companies' && req.method === 'GET') {
            return sendJSON(200, companies);
        }

        return sendJSON(404, { message: `Not Found: ${req.method} ${path}` });
    });
});

server.listen(PORT, () => {
    console.log(`Backend API Server running at http://localhost:${PORT}/api`);
});
