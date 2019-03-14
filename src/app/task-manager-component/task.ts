export class Task {
  id: string;
  task: string;
  priority: string;
  parentTask: string;
  startDate: Date;
  endDate: string;
  constructor() {
    this.priority = '10';
   }

}
