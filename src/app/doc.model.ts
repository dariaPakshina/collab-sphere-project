export interface Doc {
  id: number;
  title: string;
  edittime: string;
  content: string;
  shared_users: string[] | null;
}

// document model

export class Doc {
  public id: number;
  public title: string;
  public edittime: string;
  public content: string;
  public shared_users: string[] | null;

  constructor(
    id: number,
    title: string,
    edittime: string,
    content: string,
    shared_users: string[] | null
  ) {
    this.id = id;
    this.title = title;
    this.edittime = edittime;
    this.content = content;
    this.shared_users = shared_users;
  }
}
