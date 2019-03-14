import { SearchTask } from './../search-task';
import { Component, OnInit } from '@angular/core';
import { Task } from './task';
import { TaskService } from '../task.service';
import { Options } from 'ng5-slider';


@Component({
  selector: 'app-task-manager-component',
  templateUrl: './task-manager-component.component.html',
  styleUrls: ['./task-manager-component.component.css']
})
export class TaskManagerComponentComponent implements OnInit {

  tasks: Array<Task>;
  task: Task;
  addTaskEnabled: boolean;
  taskHandlerService: TaskService;
  saveButton: string;
  searchTask: SearchTask;
  options: Options = {
    floor: 0,
    ceil: 30
  };
  constructor(taskHandlerService: TaskService) {
    this.tasks = new Array<Task>();
    this.task = new Task();
    this.searchTask = new SearchTask();
    this.addTaskEnabled = false;
    this.taskHandlerService = taskHandlerService;
   }

  ngOnInit() {
    console.log('initialize');
    this.taskHandlerService.getAllTasks().subscribe(tasksList => this.tasks = tasksList);
  }



  onSubmit() {
    if (this.saveButton === 'Save')
    {
      this.tasks.push(this.task);
      this.taskHandlerService.postTask(this.task);
    } else {
      this.taskHandlerService.updateTask(this.task);
    }
    this.addTaskEnabled = false;
  }

  onClick(task: Task) {
    this.taskHandlerService.deleteTask(task.task);
    this.tasks = this.tasks.filter(taskEntry => task.id !== taskEntry.id);
  }

  filterTasks() {
    this.taskHandlerService.getAllTasks().subscribe(taskList => this.postFilter(taskList))
  }

  postFilter(taskList: Array<Task>){
    this.tasks = taskList;
    if (this.searchTask.task)  {
      this.tasks = this.tasks.filter(taskEntry => this.searchTask.task === taskEntry.task);
      }
    if (this.searchTask.parentTask)  {
      this.tasks = this.tasks.filter(taskEntry => this.searchTask.parentTask === taskEntry.parentTask);
    }
    if (this.searchTask.startpriority)  {
      this.tasks = this.tasks.filter(taskEntry => +this.searchTask.startpriority <= +taskEntry.priority);
    }
    if (this.searchTask.endpriority)  {
      this.tasks = this.tasks.filter(taskEntry => +this.searchTask.endpriority >= +taskEntry.priority);
    }
    if (this.searchTask.startDate)  {

      this.tasks = this.tasks.filter(taskEntry => this.searchTask.startDate <= taskEntry.startDate);
    }
    if (this.searchTask.endDate)  {
      this.tasks = this.tasks.filter(taskEntry => this.searchTask.endDate >= taskEntry.endDate);
    }
  }


  onAdd() {
    console.log('on add invoked');
    this.task = new Task();
    this.saveButton = 'Save';
    this.addTaskEnabled = true;
  }

  onView() {
    console.log('on add invoked');
    this.task = new Task();
    this.saveButton = 'Save';
    this.addTaskEnabled = false;
    console.log('initialize view');
    this.taskHandlerService.getAllTasks().subscribe(tasksList => this.tasks = tasksList);
  }

  onUpdate(task: Task) {
    this.saveButton = 'Update';
    this.task = task;
    this.addTaskEnabled = true;
    console.log('on update invoked');
  }

}
