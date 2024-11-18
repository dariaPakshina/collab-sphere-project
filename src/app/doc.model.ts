export interface Doc {
  title: string;
  edittime: string;
  content: string;
}

export class Doc {
  public title: string;
  public edittime: string;
  public content: string;

  constructor(title: string, edittime: string, content: string) {
    this.title = title;
    this.edittime = edittime;
    this.content = content;
  }
}
