export interface Doc {
  id: number;
  title: string;
  edittime: string;
  content: string;
}

export class Doc {
  public id: number;
  public title: string;
  public edittime: string;
  public content: string;

  constructor(id: number, title: string, edittime: string, content: string) {
    this.id = id;
    this.title = title;
    this.edittime = edittime;
    this.content = content;
  }
}
