import './index.css';
import favicon from '../public/assets/icons8-check-mark-32.png';
import inboxIcon from '../public/assets/icons8-inbox-50.png';
import workIcon from '../public/assets/icons8-suitcase-64.png';
import studyIcon from '../public/assets/icons8-study-64.png';
import plusIcon from '../public/assets/icons8-plus-64.png';
import closeIcon from '../public/assets/icons8-close-48.png';
import logo from '../public/assets/icons8-check-mark-48.png';

class Workspace {
  constructor(name = 'Default', img = './assets/icons8-stack-50.png') {
    this._name = name;
    this._img = img;
  }

  getImg() {
    return this._img;
  }

  getName() {
    return this._name;
  }
  addTask(item) {
    this.tasks.push(item);
  }
  tasks = [];
}

class Task {
  constructor(name, date) {
    this._name = name;
    this._date = date;
  }

  getName() {
    return this._name;
  }
  getDate() {
    return this._date;
  }
}

const database = (function () {
  const _workspaceBoard = [];

  function getWorkspaceBoard() {
    return _workspaceBoard;
  }

  function addToWorkspaceBoard(...items) {
    items.forEach((item) => _workspaceBoard.push(item));
  }

  function deleteItemWorkspace(element) {
    const newArr = _workspaceBoard.filter((item) => item.getName() !== element);
    _workspaceBoard.splice(0, _workspaceBoard.length);
    newArr.forEach((item) => _workspaceBoard.push(item));
  }

  (function initialState() {
    const inbox = new Workspace('Inbox', `${inboxIcon}`);
    const work = new Workspace('Work', `${workIcon}`);
    const study = new Workspace('Study', `${studyIcon}`);
    addToWorkspaceBoard(inbox, work, study);
  })();

  return {
    deleteItemWorkspace,
    addToWorkspaceBoard,
    getWorkspaceBoard,
  };
})();

const UI = (function () {
  document.querySelector('.headerIcon').src = logo;
  document.querySelector('.fav').href = favicon;

  function listItem(name, img) {
    return `
        <div class="li-left">
            <img src=${img} alt='${name} icon' />
            <p>${name}</p>
        </div>
        <img class="li-right" src=${closeIcon} alt="close icon" />
    `;
  }

  (function renderSidebarMenu() {
    const projects = document.querySelector('.projects');
    document.querySelector('.sidebarBtnIcon').src = plusIcon;
    database.getWorkspaceBoard().forEach((item) => {
      const htmlElement = document.createElement('li');
      htmlElement.innerHTML = listItem(item.getName(), item.getImg());
      projects.appendChild(htmlElement);
    });
  })();

  (function navFunctionality() {
    const ham = document.querySelector('.ham');
    const menu = document.querySelector('.sidebarMenu');

    ham.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  })();

  (function sidebarsListeners() {
    const sidebarBtn = document.querySelector('.sidebarBtn');
    const sidebarAddCancel = document.querySelector('.sidebarAddCancel');
    const closeBtn = document.querySelectorAll('.li-right');
    const projects = document.querySelector('.projects');

    sidebarBtn.addEventListener('click', () => {
      sidebarBtn.classList.add('hide');
      sidebarAddCancel.classList.remove('hide');
    });

    document.querySelector('.cancel').addEventListener('click', () => {
      sidebarBtn.classList.remove('hide');
      sidebarAddCancel.classList.add('hide');
    });

    document.querySelector('.add').addEventListener('click', () => {
      let isEmpty;
      database.getWorkspaceBoard().length === 0
        ? (isEmpty = true)
        : (isEmpty = false);
      const text = document.querySelector('#inputWorkspace');
      const item = new Workspace(text.value);
      database.addToWorkspaceBoard(item);

      const htmlEl = document.createElement('li');
      htmlEl.innerHTML = listItem(
        item.getName(),
        './assets/icons8-stack-50.png'
      );

      htmlEl.childNodes[3].addEventListener('click', closeItem);
      htmlEl.addEventListener('click', changeWorkspace);

      projects.appendChild(htmlEl);

      sidebarBtn.classList.remove('hide');
      sidebarAddCancel.classList.add('hide');

      text.value = '';

      if (isEmpty) {
        const content = document.querySelector('.content');
        const deleteElement = document.querySelector('.main');
        deleteElement.remove();

        const data = database.getWorkspaceBoard()[0];
        content.appendChild(MainUI(data));
      }
    });

    function closeItem(e) {
      e.stopPropagation();
      database.deleteItemWorkspace(e.target.parentNode.innerText);
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);

      if (
        e.target.parentNode.innerText.trim() ===
        document.querySelector('.content__title').innerText
      ) {
        if (database.getWorkspaceBoard().length <= 0) {
          const content = document.querySelector('.content');
          const deleteElement = document.querySelector('.main');
          deleteElement.remove();
          const main = document.createElement('div');
          main.classList.add('main');
          content.appendChild(main);
        } else {
          const deleteElement = document.querySelector('.main');
          deleteElement.remove();

          const content = document.querySelector('.content');
          const data = database.getWorkspaceBoard()[0];

          content.appendChild(MainUI(data));
        }
      }
    }

    closeBtn.forEach((item) => {
      item.addEventListener('click', closeItem);
    });

    //Main

    function createDomElement(type, css) {
      const element = document.createElement(type);
      element.classList.add(css);
      return element;
    }

    function MainUI(data) {
      const tasks = data.tasks;
      const name = data.getName();
      const main = createDomElement('div', 'main');

      const h2 = createDomElement('h2', 'content__title');
      h2.innerText = name;
      main.appendChild(h2);

      const ul = createDomElement('ul', 'task__container');

      tasks.forEach((item) => {
        const taskName = item.getName();
        const taskDate = item.getDate();

        const li = createDomElement('li', 'task');

        const firstDiv = createDomElement('div', 'task__left');
        const checkbox = createDomElement('input', 'radio-btn');
        checkbox.type = 'checkbox';
        const p = createDomElement('p', 'task__p');
        p.innerText = taskName;
        firstDiv.appendChild(checkbox);
        firstDiv.appendChild(p);
        li.appendChild(firstDiv);

        const secondDiv = createDomElement('div', 'task__right');
        const date = createDomElement('p', 'date__p');
        date.innerText = taskDate;
        secondDiv.appendChild(date);
        const close = createDomElement('img', 'img__close');
        close.src = closeIcon;
        close.addEventListener('click', deleteTaskToDatabase);
        secondDiv.appendChild(close);
        li.appendChild(secondDiv);
        ul.appendChild(li);
      });
      main.insertAdjacentElement('beforeend', ul);

      const addTask = createDomElement('div', 'addTask');
      const addTaskImg = createDomElement('img', 'addTaskImg');
      addTaskImg.src = plusIcon;
      const AddTaskP = createDomElement('p', 'AddTaskP');
      AddTaskP.innerText = 'Add Task';
      addTask.addEventListener('click', addNewTaskBtn);
      addTask.appendChild(addTaskImg);
      addTask.appendChild(AddTaskP);
      main.insertAdjacentElement('beforeend', addTask);

      const addTaskInput = createDomElement('div', 'addTaskInput');

      const firstContainer = createDomElement('div', 'firstContainer');

      const addTaskInputText = createDomElement('input', 'addTaskInputText');
      addTaskInputText.type = 'text';
      const addTaskInputDate = createDomElement('input', 'addTaskInputDate');
      addTaskInputDate.type = 'date';
      firstContainer.appendChild(addTaskInputText);
      firstContainer.appendChild(addTaskInputDate);
      addTaskInput.appendChild(firstContainer);
      addTaskInput.style.opacity = 0;

      const secondContainer = createDomElement('div', 'inputBtn');
      const firstBtn = createDomElement('button', 'cancel');
      firstBtn.innerText = 'Cancel';
      firstBtn.id = 'cancel';
      firstBtn.addEventListener('click', closeAddUIFunction);
      const secondBtn = createDomElement('button', 'add');
      secondBtn.id = 'add';
      secondBtn.innerText = 'Add';
      secondBtn.addEventListener('click', addTaskToDatabase);
      secondContainer.appendChild(firstBtn);
      secondContainer.appendChild(secondBtn);
      addTaskInput.appendChild(secondContainer);

      main.insertAdjacentElement('beforeend', addTaskInput);

      return main;
    }

    (function renderMain() {
      const content = document.querySelector('.content');
      const data = database.getWorkspaceBoard()[0];

      content.appendChild(MainUI(data));
    })();

    function changeWorkspace(e) {
      e.stopPropagation();
      const content = document.querySelector('.content');
      const data = database
        .getWorkspaceBoard()
        .filter((item) => item.getName() === e.target.innerText);

      const deleteElement = document.querySelector('.main');
      deleteElement.remove();

      content.appendChild(MainUI(...data));
      document.querySelector('.sidebarMenu').classList.remove('active');
    }

    (function workspaceEventListener() {
      const list = document.querySelectorAll('.projects li');
      list.forEach((item) => {
        item.addEventListener('click', changeWorkspace);
      });
    })();

    function addNewTaskBtn(e) {
      e.stopPropagation();

      const addTaskInput = document.querySelector('.addTaskInput');
      const addTask = document.querySelector('.addTask');

      addTask.style.display = 'none';
      addTaskInput.style.opacity = 1;
    }

    function closeAddUIFunction() {
      const addTaskInput = document.querySelector('.addTaskInput');
      const addTask = document.querySelector('.addTask');
      addTask.style.display = 'flex';
      addTaskInput.style.opacity = 0;
    }

    (function closeAddUI() {
      const cancelBtn = document.querySelector('#cancel');
      cancelBtn.addEventListener('click', closeAddUIFunction);
    })();

    (function addTaskToDatabaseBtn() {
      const addTaskBtn = document.querySelector('#add');
      addTaskBtn.addEventListener('click', addTaskToDatabase);
    })();

    function addTaskToDatabase() {
      const text = document.querySelector('.content__title').innerText;
      const index = database
        .getWorkspaceBoard()
        .findIndex((item) => item.getName() === text);

      const stringDate = document
        .querySelector('.addTaskInputDate')
        .value.split('-')
        .reverse()
        .join('-');

      const stringTask = document.querySelector('.addTaskInputText').value;

      database
        .getWorkspaceBoard()
        [index].tasks.push(new Task(stringTask, stringDate));

      const deleteElement = document.querySelector('.main');
      deleteElement.remove();

      const content = document.querySelector('.content');
      const newData = database.getWorkspaceBoard()[index];

      content.appendChild(MainUI(newData));
    }

    (function deleteTaskToDatabaseBtn() {
      const addTaskBtn = document.querySelectorAll('.img__close');
      addTaskBtn.forEach((item) => {
        item.addEventListener('click', deleteTaskToDatabase);
      });
    })();

    function deleteTaskToDatabase(e) {
      // Delete to UI
      e.target.parentNode.parentNode.remove();

      // Delete to database
      const text = document.querySelector('.content__title').innerText;
      const index = database
        .getWorkspaceBoard()
        .findIndex((item) => item.getName() === text);

      const newDatabase = database
        .getWorkspaceBoard()
        [index].tasks.filter((item) => {
          return (
            item.getName() !==
            e.target.parentNode.parentNode.firstChild.lastChild.innerText
          );
        });
      database.getWorkspaceBoard()[index].tasks = newDatabase;
    }
  })();
})();
