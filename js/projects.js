class Projects
{
    static _instance = null;

    constructor()
    {
        this.projects = [];
    }

    static getInstance()
    {
        if (Projects._instance === null)
        {
            Projects._instance = new Projects();
            Projects._instance.addEventListeners();
        }

        return Projects._instance;
    }

    getProjects()
    {
        fetch('./json/projects.json')
        .then(response => response.json())
        .then(data => {
            this.projects = data.projects;
            this.displayProjects();
        });
    }

    displayProjects()
    {
        const container = document.getElementById('projects-container');
        const keys = Object.keys(this.projects);

        keys.forEach(key => {
            const projectName = this.projects[key].name;
            const projectDescription = this.projects[key].description;
            const projectLink = this.projects[key].link;

            const project = document.createElement('div');
            project.classList.add('project');

            const name = document.createElement('h2');
            name.textContent = projectName; 
            project.appendChild(name);

            const description = document.createElement('p');
            description.textContent = projectDescription;
            project.appendChild(description);

            const link = document.createElement('a');
            link.textContent = 'View Project';
            link.href = projectLink;
            project.appendChild(link);

            container.appendChild(project);
        });
    }

    addEventListeners()
    {
        addEventListener('DOMContentLoaded', () => {
            this.getProjects();
        });
    }
}

const projects = Projects.getInstance();