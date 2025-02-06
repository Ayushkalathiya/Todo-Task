
export interface Task {

  id: number;

  title: string;

  description?: string;

  projectId?: number;

  categoryId?: number;

  priority: string;

  dueDate: string;

  completed: boolean;

  createdAt: string;

  updatedAt: string;

}


  
  export type Project = {
    id: number
    name: string
    description?: string
    status: string
  }
  
  export type Category = {
    id: number
    name: string
    projectId: number
  }
  
  