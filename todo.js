const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');
const itemsLeftElem = document.querySelector('.items-left')

const showAllBtnElem = document.querySelector('.show-all-btn');
const showActiveBtnElem = document.querySelector('.show-active-btn');
const showCompletedBtnElem = document.querySelector('.show-completed-btn');
const clearCompletedBtnElem = document.querySelector('.clear-completed-btn');

const checkAllBtnElem = document.querySelector('.check-all-btn');

let todos = [];
let leftItems = 0;
let showType = 'all'; // all  | active | complete
let id = 0;
let isCheckedAll = false;

const setTodos = (newTodos) => {
    todos = newTodos;
}

const getAllTodos = () => {
    return todos;
}

const getActiveTodos = () => {
    return todos.filter(todo => todo.isChecked === false);
}

const getCompletedTodos = () => {
    return todos.filter(todo => todo.isChecked === true );
}

const setLeftItems = () => {
    const leftTodos = getActiveTodos()
    itemsLeftElem.innerHTML = `${leftTodos.length} items left`
}

const checkTodo = (event) => {
    const checkboxElem = event.target;
    const todoItemElem = checkboxElem.parentNode;
    const todoId = parseInt(todoItemElem.dataset.id); 
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo,  isChecked: !todo.isChecked} : todo )
    setTodos(newTodos);
    paintTodos();
    checkIsCheckedAll()
    setLeftItems();
}

const deleteTodo = (event) => {
    const delBtnElem = event.target;
    const todoItemElem = delBtnElem.parentNode;
    todoListElem.removeChild(todoItemElem)
    const newTodos = getAllTodos().filter(todo => todo.id !== parseInt(todoItemElem.dataset.id) );
    setTodos(newTodos);
    setLeftItems();
}

const appendTodos = (text) => {
    const newId = id++;
    const newTodos = getAllTodos().concat({id: newId, isChecked: false, content: text })
    setTodos(newTodos)
    paintTodos();
    setLeftItems();
}
const updateTodo = (text, todoId) => {
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
    setTodos(newTodos);
    paintTodos();
}

const onDbclickTodo = (e) => {
    const todoElem = e.target;
    console.log(todoElem);
    const inputText = e.target.innerText;
    const todoItemElem = todoElem.parentNode;
    const inputElem = document.createElement('input');
    inputElem.value = inputText;
    inputElem.classList.add('edit-input');
    inputElem.addEventListener('keypress', (e)=>{
        if(e.key === 'Enter') {
            updateTodo(e.target.value, parseInt(todoItemElem.dataset.id));
            document.body.removeEventListener('click', onClickBody );
        }
    })

    const onClickBody = (e) => {
        if(e.target !== inputElem)  {
            todoItemElem.removeChild(inputElem);
            document.body.removeEventListener('click', onClickBody );
        }
    }
    
    document.body.addEventListener('click', onClickBody)
    todoItemElem.appendChild(inputElem);
}

const paintTodo = (_todo) => {
    const todoItemElem = document.createElement('li');
    todoItemElem.classList.add('todo-item');

    todoItemElem.setAttribute('data-id', _todo.id );

    const checkboxElem = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', checkTodo)

    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.addEventListener('dblclick', onDbclickTodo)
    todoElem.innerText = _todo.content;

    const delBtnElem = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click',  deleteTodo)
    delBtnElem.innerHTML = 'X';

    if(_todo.isChecked) {
        todoItemElem.classList.add('checked');
        checkboxElem.innerText = '✔';
    }

    todoItemElem.appendChild(checkboxElem);
    todoItemElem.appendChild(todoElem);
    todoItemElem.appendChild(delBtnElem);

    todoListElem.appendChild(todoItemElem);
}

const paintTodos = () => {
    todoListElem.innerHTML = null;

    switch (showType) {
        case 'all':
            const allTodos = getAllTodos();
            allTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'active': 
            const activeTodos = getActiveTodos();
            activeTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'completed': 
            const completedTodos = getCompletedTodos();
            completedTodos.forEach(todo => { paintTodo(todo);});
            break;
        default:
            break;
    }
}

const onClickShowTodosType = (e) => {
 
    const currentBtnElem = e.target;
    const newShowType = currentBtnElem.dataset.type;

    if ( showType === newShowType ) return;

    const preBtnElem = document.querySelector(`.show-${showType}-btn`);
    preBtnElem.classList.remove('selected');

    currentBtnElem.classList.add('selected')
    showType = newShowType
    
    paintTodos();
}

const clearCompletedTodos = () => {
    const newTodos = getActiveTodos()
    setTodos(newTodos)
    paintTodos();
    setLeftItems();
}

const checkAll = () => {
    checkAllBtnElem.classList.add('checked');
    const newTodos = getAllTodos().map(todo => ({...todo, isChecked: true }) )
    setTodos(newTodos)
}

const uncheckAll = () => {
    checkAllBtnElem.classList.remove('checked');
    const newTodos =  getAllTodos().map(todo => ({...todo, isChecked: false }) );
    setTodos(newTodos)
}

const getIsCheckedAll = () => {return isCheckedAll };
const setIsCheckedAll = (bool) => { isCheckedAll = bool};

const checkIsCheckedAll = () => {
    const currentAllTodos  = getAllTodos()
    const currentCompletedTodos = getCompletedTodos();
    if(currentAllTodos.length === currentCompletedTodos.length ){
        setIsCheckedAll(true);
        checkAllBtnElem.classList.add('checked');
    }else {
        setIsCheckedAll(false);
        checkAllBtnElem.classList.remove('checked');
    }
}

const onClickCheckAll = () => {
    if(!getAllTodos().length) return;

    const currentIsCheckedAll = getIsCheckedAll()
    const newIsCheckedAll = !currentIsCheckedAll;
    if(currentIsCheckedAll) { 
        uncheckAll();
        setIsCheckedAll(newIsCheckedAll);
    }else{
        checkAll();
        setIsCheckedAll(newIsCheckedAll);
    }
    paintTodos();
    setLeftItems();
}

const init = () => {
    todoInputElem.addEventListener('keypress', (e) =>{
        if( e.key === 'Enter' ){
            appendTodos(e.target.value); todoInputElem.value ='';
        }
    })

    showAllBtnElem.addEventListener('click', onClickShowTodosType);
    showActiveBtnElem.addEventListener('click', onClickShowTodosType);
    showCompletedBtnElem.addEventListener('click', onClickShowTodosType);
    clearCompletedBtnElem.addEventListener('click', clearCompletedTodos);
    checkAllBtnElem.addEventListener('click',  onClickCheckAll)
    setLeftItems();
}

init();