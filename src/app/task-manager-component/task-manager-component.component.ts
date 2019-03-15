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
  parentTask: Task;
  addTaskEnabled: boolean;
  taskHandlerService: TaskService;
  saveButton: string;
  searchTask: SearchTask;
  errorMessage: string;
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

    this.taskHandlerService.getAllTasks().subscribe(tasksList => this.tasks = tasksList);
  }



  onSubmit() {
    this.errorMessage='';
    if (this.saveButton === 'Save')
    {

      if (this.task.parentTask){
        this.taskHandlerService.getTask(this.task.parentTask).subscribe(parentTask=>this.handlePostAdd(parentTask));
      }
      else{
        this.tasks.push(this.task);
        this.taskHandlerService.postTask(this.task);
        this.addTaskEnabled = false;
      }


    } else {
      this.addTaskEnabled = false;
      this.taskHandlerService.updateTask(this.task);
    }

  }

  handlePostAdd(parentTask: Task) {
      if(parentTask){
        this.tasks.push(this.task);
        this.taskHandlerService.postTask(this.task);
        this.addTaskEnabled = false;
      }
      else{
        this.errorMessage='Parent Task Not found';
        throw Error('Parent Task Not found');
      }
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
    this.errorMessage='';

    this.task = new Task();
    this.saveButton = 'Save';
    this.addTaskEnabled = true;
  }

  onView() {

    this.task = new Task();
    this.saveButton = 'Save';
    this.addTaskEnabled = false;

    this.taskHandlerService.getAllTasks().subscribe(tasksList => this.tasks = tasksList);
  }

  onUpdate(task: Task) {
    this.errorMessage='';
    this.saveButton = 'Update';
    this.task = task;
    this.addTaskEnabled = true;

  }

}
