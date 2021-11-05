const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');

let todos = [];
let id = 0;

const setTodos = (newTodos) => {
    todos = newTodos;
}

const getAllTodos = () => {
    return todos;
}

const appendTodos = (text) => {
    const newId = id++;
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text })
    // const newTodos = [...getAllTodos(), {id: newId, isCompleted: false, content: text }]
    setTodos(newTodos)
    paintTodos();
}

// const deleteTodo = (event) => {
//     const delBtnElem = event.target; // 삭제 버튼 요소
//     const todoItemElem = delBtnElem.parentNode; // 'delBtn'의 부모인 'todo-item'
    
//     const targetTodoId = parseInt(todoItemElem.dataset.id) // dataset은 string이기 때문에 parseInt()로 int형으로 변경
//     const newTodos = getAllTodos().filter(todo => todo.id !== targetTodoId );
//     setTodos(newTodos);
    
//     todoListElem.removeChild(todoItemElem) // 'todo-list'에서 삭제하고자 하는 'todo-item' 삭제
// }

const deleteTodo = (todoId) => {
    console.log(todoId);
    // const delBtnElem = event.target; // 삭제 버튼 요소
    // const todoItemElem = delBtnElem.parentNode; // 'delBtn'의 부모인 'todo-item'
    
    // const targetTodoId = parseInt(todoItemElem.dataset.id) // dataset은 string이기 때문에 parseInt()로 int형으로 변경
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId );
    setTodos(newTodos);
    paintTodos()
    
    // todoListElem.removeChild(todoItemElem) // 'todo-list'에서 삭제하고자 하는 'todo-item' 삭제
}

// const checkTodo = (event) => {
//     const checkboxElem = event.target;
//     const todoItemElem = checkboxElem.parentNode;
//     const targetTodoId = parseInt(todoItemElem.dataset.id) // dataset은 string이기 때문에 parseInt()로 int형으로 변경
//     const newTodos = getAllTodos().map(todo => todo.id === targetTodoId ? {...todo,  isCompleted: !todo.isCompleted} : todo )
//     setTodos(newTodos);
//     paintTodos();
//     // checkIsCheckedAll()
//     // setLeftItems();
// }

const checkTodo = (todoId) => {
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo,  isCompleted: !todo.isCompleted} : todo )
    setTodos(newTodos);
    paintTodos();
}

const paintTodos = () => {
    todoListElem.innerHTML = null; //todoListElem 요소 안의 HTML 초기화
	const allTodos = getAllTodos() // todos 배열 가져오기

    allTodos.forEach(todo => { 
        const todoItemElem = document.createElement('li');
        todoItemElem.classList.add('todo-item');

        todoItemElem.setAttribute('data-id', todo.id );

        const checkboxElem = document.createElement('div');
        checkboxElem.classList.add('checkbox');
        checkboxElem.addEventListener('click', () => checkTodo(todo.id))
    
        const todoElem = document.createElement('div');
        todoElem.classList.add('todo');
        // todoElem.addEventListener('dblclick', onDbclickTodo)
        todoElem.innerText = todo.content;
    
        const delBtnElem = document.createElement('button');
        delBtnElem.classList.add('delBtn');
        delBtnElem.addEventListener('click', () =>  deleteTodo(todo.id))
        delBtnElem.innerHTML = 'X';

        if(todo.isCompleted) {
            todoItemElem.classList.add('checked');
            checkboxElem.innerText = '✔';
        }

        todoItemElem.appendChild(checkboxElem);
        todoItemElem.appendChild(todoElem);
        todoItemElem.appendChild(delBtnElem);

        todoListElem.appendChild(todoItemElem);
    })
}

const init = () => {
    todoInputElem.addEventListener('keypress', (e) =>{
        if( e.key === 'Enter' ){
            appendTodos(e.target.value); todoInputElem.value ='';
        }
    })
}

init()