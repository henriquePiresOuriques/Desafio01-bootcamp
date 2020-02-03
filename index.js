const express = require ('express');

const server = express();

server.use(express.json());

/**
 * A variável "projects" pode ser "const" porque um "array"
 * pode receber adições ou exclusões mesmo sendo uma constante.
 */
const projects = [];

function checkProjectExcists(req, res, next) {
    const { id } = req.params;

    const project = projects.find(p => p.id == id);

    if(!project) {
        return res.status(400).json({ error: 'Project does not exists' });
    }

    return next();
}

function countReq(req, res, next) {
    console.count("Número de requisições");

    return next();
}

server.use(countReq);

server.post('/projects', countReq, (req,res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
});

server.get('/projects', countReq, (req,res) => {
    return res.json(projects);
});

server.put('/projects/:id', checkProjectExcists, countReq, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);
});

server.delete('/projects/:id', checkProjectExcists, countReq, (req,res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);

    projects.splice(projectIndex, 1);
  
    return res.send();
});

server.post('/projects/:id/tasks', checkProjectExcists, countReq, (req, res) => {
    const { title } = req.body;
    const { id } = req.params;

    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project)
});

server.listen(3000);