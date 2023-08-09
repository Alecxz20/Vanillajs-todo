import './index.css';

class Workspace {
  constructor(name) {
    this._name = name;
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
    const newArr = _workspaceBoard.filter(
      (item) => item.getName() !== element.getName()
    );
    _workspaceBoard.splice(0, _workspaceBoard.length);
    newArr.forEach((item) => _workspaceBoard.push(item));
  }

  (function initialState() {
    const inbox = new Workspace('Inbox');
    const work = new Workspace('Work');
    const study = new Workspace('Study');
    addToWorkspaceBoard(inbox, work, study);
  })();

  return {
    deleteItemWorkspace,
    addToWorkspaceBoard,
    getWorkspaceBoard,
  };
})();

const UI = (function () {
  (function navFunctionality() {
    const ham = document.querySelector('.ham');
    const menu = document.querySelector('.sidebarMenu');

    ham.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  })();
})();
