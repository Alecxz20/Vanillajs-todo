import './index.css';

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
    const inbox = new Workspace('Inbox', './assets/icons8-inbox-50.png');
    const work = new Workspace('Work', './assets/icons8-suitcase-64.png');
    const study = new Workspace('Study', './assets/icons8-study-64.png');
    addToWorkspaceBoard(inbox, work, study);
  })();

  return {
    deleteItemWorkspace,
    addToWorkspaceBoard,
    getWorkspaceBoard,
  };
})();

const UI = (function () {
  function listItem(name, img) {
    return `
        <div class="li-left">
            <img src=${img} alt='${name} icon' />
            <p>${name}</p>
        </div>
        <img class="li-right" src="./assets/icons8-close-48.png" alt="close icon" />
    `;
  }

  (function renderSidebarMenu() {
    const projects = document.querySelector('.projects');

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
      const text = document.querySelector('#inputWorkspace');
      const item = new Workspace(text.value);
      database.addToWorkspaceBoard(item);

      const htmlEl = document.createElement('li');
      htmlEl.innerHTML = listItem(
        item.getName(),
        './assets/icons8-stack-50.png'
      );

      htmlEl.childNodes[3].addEventListener('click', closeItem);

      projects.appendChild(htmlEl);

      text.value = '';
    });

    function closeItem(e) {
      database.deleteItemWorkspace(e.target.parentNode.innerText);
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    }

    closeBtn.forEach((item) => {
      item.addEventListener('click', closeItem);
    });
  })();
})();
