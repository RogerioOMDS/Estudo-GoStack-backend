const express = require('express');
const { uuid, isUuid } = require('uuidv4'); /* unique universal id */
const cors = require('cors');

const app = express();

app.use(cors());

/* Para o express saber que vai receber JSON */
app.use(express.json());

const projects = [];

/* Middleware */
function logRequest(request, response, next) {
    const{ method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`
    
    console.log(logLabel)

    return next(); /* chamada do próximo middleware */
}

function validateProjectId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({error: 'Invalid project ID.'})
    }

    return next();
}

app.use(logRequest)
app.use('/projects/:id', validateProjectId) /* estou escolhendo onde quero o middleware */

app.get('/projects', (request, response) => {/* não precisa ser "/algura_coisa" */
    //return response.send("show"); /* este permite retornar um texto */
    // const {title, owner} = request.query;

    // console.log(title);
    // console.log(owner);

    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;
    
    return response.json(results)
})

app.post('/projects', (request,response) => {
    const {title, owner} = request.body;
    
    const project = { id: uuid(), title, owner}

    projects.push(project)

    return response.json(project)
})

app.put('/projects/:id',/* validateProjectId, */ (request, response) => {
    const { id } = request.params; //assim ele resgata só o número
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: "Project not found."})
    } 

    const project = {
        id, 
        title,
        owner
    };

    projects[projectIndex] = project;

    return response.json(project)
})

app.delete('/projects/:id',/* validateProjectId, */ (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: "Project not found."})
    } 

    projects.splice(projectIndex, 1);

    return response.status(204).send();
})

app.listen(3333,()=> {
    console.log('Back-end started!')
});  /* adiciono uma função no segundo parâmetro para avisar quando ir ao ar */