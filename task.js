const readline = require("readline");

class User {
  constructor(id, username, emailid, password) {
    (this.id = id),
      (this.name = username),
      (this.emailid = emailid),
      (this.password = password);
  }
}

class UserMethods {
  constructor() {
    this.users = [];
    this.userId = 0;
  }

  addUser(username, emailid, password) {
    this.userId = this.userId + 1;
    const newUser = new User(this.userId, username, emailid, password);
    this.users.push(newUser);
    return newUser;
  }
  getAllUsers() {
    return this.users;
  }
}
class Project {
    constructor(id, name) {
      this.id = id;
      this.name = name;
    }
  }
class Task {
  constructor(id, title, description, duedate, prioritylevel, taskstatus,projectId) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.duedate = duedate;
    this.prioritylevel = prioritylevel;
    this.status = taskstatus;
    this.projectId = projectId;
  }
}

class TaskMethods {
  constructor() {
    this.tasks = [];
    this.projects=[]
    this.currentId = 0;
    this.currentProjectId = 0;
  }
  addProject(name) {
    this.currentProjectId += 1;
    const newProject = new Project(this.currentProjectId, name);
    this.projects.push(newProject);
    return newProject;
  }

  getAllProjects() {
    return this.projects;
  }

  getProjectById(id) {
    return this.projects.find(project => project.id === id);
  }

  getTasksByProjectId(projectId) {
    return this.tasks.filter(task => task.projectId === projectId);
  }
  getTaskById(idInput) {
    console.log(idInput);
    let task = this.tasks.find((task) => idInput == task.id);
    return task;
  }
  gettasklist() {
    return this.tasks;
  }
  create(title, description, duedate, prioritylevel, taskstatus,projectId) {
    this.currentId = this.currentId + 1;
    const newTask = new Task(
      this.currentId,
      title,
      description,
      duedate,
      prioritylevel,
      taskstatus,
      projectId
    );

    this.tasks.push(newTask);
    return this.tasks;
  }
  update(idInput, title, description, duedate, prioritylevel, taskstatus,projectId) {
    let task = this.tasks.find((task) => idInput == task.id);

    if (task) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.duedate = duedate || task.duedate;
      task.prioritylevel = prioritylevel || task.prioritylevel;
      task.taskstatus = taskstatus || task.status;
      task.projectId = projectId || task.projectId;
      return task;
    } else {
      return "Task not found";
    }
  }

  delete(idInput) {
    const index = this.tasks.findIndex((task) => idInput == task.id);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      return "Task deleted";
    } else {
      return "No task found";
    }
  }
  getDashboard() {
    const totalProjects = this.projects.length;
    const totalTasks = this.tasks.length;
    const taskStatusCounts = this.tasks.reduce((counts, task) => {
      counts[task.status] = (counts[task.status] || 0) + 1;
      return counts;
    }, {});

    return {
      totalProjects,
      totalTasks,
      taskStatusCounts
    };
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const newUser = new UserMethods();
const newTask = new TaskMethods();

const registerUser = () => {
  rl.question("Enter name", (username) => {
    rl.question("Enter email id", (emailid) => {
      rl.question("Enter Password", (password) => {
        let addNewUser = newUser.addUser(username, emailid, password);
        console.log("User registered", addNewUser);
        mainmenu();
      });
    });
  });
};

const showUserlist = () => {
  const users = newUser.getAllUsers();
  console.log("Users found:", users);
  mainmenu();
};
const addProject = () => {
    rl.question("Enter project name: ", (name) => {
      let newProject = newTask.addProject(name);
      console.log("Project added", newProject);
      mainmenu();
    });
  };
  const showProjects = () => {
    const projects = newTask.getAllProjects();
    if (projects.length === 0) {
      console.log("No projects found.");
      mainmenu();
      return;
    }
    
    projects.forEach(project => {
      console.log(`Project ID: ${project.id}, Name: ${project.name}`);
      const tasks = newTask.getTasksByProjectId(project.id);
      if (tasks.length > 0) {
        console.log("Tasks:");
        tasks.forEach(task => {
          console.log(`  Task ID: ${task.id}, Title: ${task.title}, Status: ${task.status}`);
        });
      } else {
        console.log("  No tasks found for this project.");
      }
      
    });
    mainmenu()
}
  const addTask = () => {
    rl.question("Enter title: ", (title) => {
      rl.question("Enter description: ", (description) => {
        rl.question("Enter duedate: ", (duedate) => {
          rl.question("Enter Priority Level: ", (prioritylevel) => {
            rl.question("Enter Status: ", (taskstatus) => {
              rl.question("Enter Project ID (optional, leave empty if not applicable): ", (projectId) => {
                let newaddTask = newTask.create(
                  title,
                  description,
                  duedate,
                  prioritylevel,
                  taskstatus,
                  projectId ? parseInt(projectId) : null
                );
                console.log("Task added", newaddTask);
                mainmenu();
              });
            });
          });
        });
      });
    });
  };
  
  const updateTask = () => {
    rl.question("Enter task ID to update: ", (idInput) => {
      const task = newTask.getTaskById(idInput);
      if (task) {
        rl.question(
          "Enter new title (leave empty to keep current): ",
          (title) => {
            rl.question(
              "Enter new description (leave empty to keep current): ",
              (description) => {
                rl.question(
                  "Enter new due date (YYYY-MM-DD, leave empty to keep current): ",
                  (duedate) => {
                    rl.question(
                      "Enter new priority level (low, medium, high, leave empty to keep current): ",
                      (prioritylevel) => {
                        rl.question(
                          "Enter new status (todo, in-progress, done, leave empty to keep current): ",
                          (taskstatus) => {
                            rl.question(
                              "Enter new Project ID (leave empty to keep current): ",
                              (projectId) => {
                                const updatedTask = newTask.update(
                                  idInput,
                                  title,
                                  description,
                                  duedate,
                                  prioritylevel,
                                  taskstatus,
                                  projectId ? parseInt(projectId) : null
                                );
                                console.log("Task updated:", updatedTask);
                                mainmenu();
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      } else {
        console.log("Task not found.");
        mainmenu();
      }
    });
  };
  

const deleteTask = () => {
  rl.question("Enter task id to delete : ", (id) => {
    const taskdeletion = newTask.delete(id);
    if (taskdeletion) {
      console.log("Task deleted");
      mainmenu();
    } else {
      console.log("Task not found");
    }
  });
};
const getAllTask = () => {
  const tasks = newTask.gettasklist();
  console.log("tasks found:", tasks);
  mainmenu();
};

const dashboard = () => {
    const { totalProjects, totalTasks, taskStatusCounts } = newTask.getDashboard();
  
    console.log(`Dashboard Overview:`);
    console.log(`Total Projects: ${totalProjects}`);
    console.log(`Total Tasks: ${totalTasks}`);
  
    console.log(`Task Status Counts:`);
    Object.keys(taskStatusCounts).forEach(status => {
      console.log(`  ${status}: ${taskStatusCounts[status]}`);
    });
  
    mainmenu();
  };
const mainmenu = () => {
    console.log("Main Menu");
    console.log("1. Add User");
    console.log("2. Show User List");
    console.log("3. Add Project");
    console.log("4. Show Projects");
    console.log("5. Add Task");
    console.log("6. Update Task");
    console.log("7. Delete Task");
    console.log("8. Get Task List");
    console.log("9. Dashboard");
    console.log("10. Exit");
  
    rl.question("Choose an option: ", (option) => {
      switch (option) {
        case "1":
          registerUser();
          break;
        case "2":
          showUserlist();
          break;
        case "3":
          addProject();
          break;
        case "4":
          showProjects();
          break;
        case "5":
          addTask();
          break;
        case "6":
          updateTask();
          break;
        case "7":
          deleteTask();
          break;
        case "8":
          getAllTask();
          break;
        case "9":
            dashboard();
            break;
        default:
          rl.close();
          break;
      }
    });
  };
  

mainmenu();
