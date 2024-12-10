const btnAddTask = document.querySelector('.btn-add-task');
const formAddTask = document.querySelector('.form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const taskListContainer = document.querySelector('.app__section-task-list');
const taskDescriptionDisplay = document.querySelector('#taskDescriptionDisplay');
const botaoFoco = document.getElementById('startFocusButton');
const displayTimer = document.getElementById('focusTimer');
 
let activeTaskIndex = null;
let tasks = JSON.parse(localStorage.getItem('tarefas')) || [];
 
//Variaveis do cronometro
let focusTimer;
let tempo = 0.1 * 60; //6 segundos
 
//Função para formatar o tempo do cronometro
function formatarTempo(tempo) {
    const minutos = Math.floor(tempo/60)
    const tempoSegundos = tempo % 60;
    return `${String(minutos).padStart(2, '0')}:${String(tempoSegundos).padStart(2,'0')}`
}
 
//Função para iniciar o cronometro
function iniciarCronometro() {
    botaoFoco.disabled = true; //desabilita o botão enquanto o cronometro está em andamento
    focusTimer = setInterval(() => {
        tempo--;
        displayTimer.textContent = formatarTempo(tempo)
 
        if(tempo <= 0) {
            clearInterval(focusTimer)// Para o fiat cronsmetro
            const evento = new CustomEvent('FocoFinalizado'); //Dispara evento customizado
            window.dispatchEvent(evento);
        }
    }, 1000);
}
 
window.addEventListener('FocoFinalizado', () => {
    //Marcar a tarefa como concluída
    const tarefaItem = taskListContainer.children[activeTaskIndex];
    tarefaItem.classList.add('task-completed'); //Adicionar a classe de css
 
    //Desabilitar o botao de editar
    const tarefaDescricao = tarefaItem.querySelector('app__section-task-list-item-description');
    tarefaDescricao.contentEditable = 'false'; //Desabilita a edição do texto de tarefas concluídas.
 
    //Aqui atualiza a interface para indicar que o foco foi concluído
    taskDescriptionDisplay.innerHTML = '<p><strong> Foco Finalizado! </strong></p>';
    focusTimer.textContent = '00:00'; //Reseta o cronometro
    botaoIniciarFoco.disabled = false; //Habilita o botao para reiniciar o foco
    tempo = 0.1 * 60; //Reseta o tempo para 6 segundos
 
    const previousActiveTask = taskListContainer.children[activeTaskIndex];
    previousActiveTask.classList.remove('active');
    taskDescriptionDisplay.innerHTML = '';
    activeTaskIndex = null
})
 
//Evento de clique no botâo para iniciar o foco
botaoFoco.addEventListener('click', () => {
    if(activeTaskIndex != null) {
        iniciarCronometro(); //
    } else {
        alert('Por favor, selecione uma tarefa :c');
    }
})
 
btnAddTask.addEventListener('click', () => {
    formAddTask.classList.toggle('hidden');
    textarea.focus(); // Foca na textarea quando o formulário for exibido
});
 
function renderTasks() {
    taskListContainer.innerHTML = ''; // Limpa a lista atual
 
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('app__section-task-list-item');
 
        const taskDescription = document.createElement('p');
        taskDescription.classList.add('app__section-task-list-item-description');
        taskDescription.textContent = task.description;
 
        const editBotao = document.createElement('button');
        editBotao.classList.add('app_button-edit');
        editBotao.textContent = "editar";
 
        editBotao.addEventListener('click', () => {
            const novaTarefa = prompt('Edite a descrição da tarefa ', task.description);
 
            if (novaTarefa != null && novaTarefa.trim() !== '') {
                tasks[index].description = novaTarefa.trim();
                localStorage.setItem('tarefas', JSON.stringify(tasks));
                renderTasks();
            }
        });
 
        // Alternando a tarefa ativa
        taskItem.addEventListener('click', () => {
            if (activeTaskIndex === index) {
                activeTaskIndex = null;
                taskItem.classList.remove('active');
                taskDescriptionDisplay.innerHTML = '';
            } else {
                if (activeTaskIndex != null) {
                    const previousActiveTask = taskListContainer.children[activeTaskIndex];
                    previousActiveTask.classList.remove('active');
                }
                activeTaskIndex = index;
                taskItem.classList.add('active');
                taskDescriptionDisplay.innerHTML = `
                    <p><strong>Descrição da Tarefa Ativa:</strong> ${task.description}</p>`;
            }
        });
 
        taskItem.append(taskDescription, editBotao);
        taskListContainer.appendChild(taskItem);
    });
}
 
formAddTask.addEventListener('submit', function (event) {
    event.preventDefault();
 
    const taskDescription = textarea.value.trim();
 
    if (taskDescription) {
        const newTask = { description: taskDescription };
        tasks.push(newTask);
        localStorage.setItem('tarefas', JSON.stringify(tasks));
        textarea.value = '';
        formAddTask.classList.add('hidden');
        renderTasks();
    }
});
 
window.addEventListener('load', () => {
    renderTasks();
});