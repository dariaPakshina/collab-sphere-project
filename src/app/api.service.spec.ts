import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { DocsService } from './docs/docs.service';
import { NgZone } from '@angular/core';
import { of, Subject } from 'rxjs';
import { Doc } from './doc.model';

describe('ApiService', () => {
  let service: ApiService;
  // let mockDocsService: jasmine.SpyObj<DocsService>;
  // let mockSupabase: any;

  beforeEach(() => {
    // mockDocsService = jasmine.createSpyObj('DocsService', [
    //   'setDocs',
    //   'deleteDoc',
    //   'deleteDocs',
    //   'updateDoc',
    // ]);

    // mockDocsService.docsChanged = new Subject<Doc[]>();
    // mockDocsService.docsChanged$ = mockDocsService.docsChanged.asObservable();

    // mockDocsService.docChanged = new Subject<Doc>();
    // mockDocsService.docChanged$ = mockDocsService.docChanged.asObservable();

    // mockDocsService.deleteAction = new Subject<void>();
    // mockDocsService.deleteAction$ = mockDocsService.deleteAction.asObservable();

    // // mockDocsService.getDocs = jasmine.createSpy().and.returnValue(of([]));

    // mockSupabase = {
    //   auth: {
    //     getUser: jasmine
    //       .createSpy()
    //       .and.returnValue(
    //         Promise.resolve({ data: { user: { id: 'user123' } } })
    //       ),
    //   },
    //   from: jasmine.createSpy().and.callFake(() => ({
    //     insert: jasmine
    //       .createSpy()
    //       .and.returnValue(Promise.resolve({ data: {}, error: null })),
    //     select: jasmine.createSpy().and.callFake(() => ({
    //       eq: jasmine.createSpy().and.returnValue(
    //         Promise.resolve({
    //           data: [{ id: 1, title: 'Test Doc' }],
    //           error: null,
    //         })
    //       ),
    //     })),
    //     delete: jasmine.createSpy().and.callFake(() => ({
    //       eq: jasmine
    //         .createSpy()
    //         .and.returnValue(Promise.resolve({ error: null })),
    //       in: jasmine
    //         .createSpy()
    //         .and.returnValue(Promise.resolve({ error: null })),
    //     })),
    //     update: jasmine
    //       .createSpy()
    //       .and.returnValue(Promise.resolve({ error: null })),
    //   })),
    // };

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        // { provide: DocsService, useValue: mockDocsService },
        // {
        //   provide: NgZone,
        //   useValue: { runOutsideAngular: (fn: Function) => fn() },
        // },
      ],
    });
    service = TestBed.inject(ApiService);
    // service.supabase = mockSupabase;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // describe('getUserId', () => {
  //   it('should get user ID', async () => {
  //     const userId = await service.getUserId();
  //     expect(userId).toBe('user123');
  //     expect(service.userId).toBe('user123');
  //   });

  //   it('should return "" on error', async () => {
  //     mockSupabase.auth.getUser.and.returnValue(Promise.reject());
  //     const userId = await service.getUserId();
  //     expect(userId).toBe('');
  //     expect(service.userId).toBe('');
  //   });
  // });

  // describe('postDoc', () => {
  //   it('should post a new document', async () => {
  //     spyOn(service, 'getUserId').and.returnValue(Promise.resolve('user123'));
  //     await service.postDoc(
  //       'Test Title',
  //       '2024-01-01T12:00:00Z',
  //       'Test Content'
  //     );
  //     expect(mockSupabase.from).toHaveBeenCalledWith('docs');
  //     expect(mockSupabase.from().insert).toHaveBeenCalledWith({
  //       title: 'Test Title',
  //       edittime: '2024-01-01T12:00:00Z',
  //       content: 'Test Content',
  //       user_id: 'user123',
  //     });
  //   });

  //   it('should not post if userId is missing', async () => {
  //     spyOn(service, 'getUserId').and.returnValue(Promise.resolve(''));
  //     await service.postDoc(
  //       'Test Title',
  //       '2024-01-01T12:00:00Z',
  //       'Test Content'
  //     );
  //     expect(mockSupabase.from().insert).not.toHaveBeenCalled();
  //   });
  // });

  // describe('fetchDocs', () => {
  //   it('should fetch documents', async () => {
  //     spyOn(service, 'getUserId').and.returnValue(Promise.resolve('user123'));
  //     const testDocs = [
  //       {
  //         id: 1,
  //         title: 'Test Doc',
  //         edittime: '2024-01-01T12:00:00Z',
  //         content: 'Test Content',
  //         shared_users: null,
  //       },
  //     ];
  //     await service.fetchDocs().then(() => {
  //       mockDocsService.docsChanged.next(testDocs);

  //       mockDocsService.docsChanged$.subscribe((docs) => {
  //         expect(docs.length).toBeGreaterThan(0);
  //         expect(docs).toEqual(testDocs);
  //       });
  //     });
  //     expect(mockSupabase.from).toHaveBeenCalledWith('docs');
  //     expect(mockSupabase.from().select).toHaveBeenCalled();
  //     expect(mockDocsService.setDocs).toHaveBeenCalled();
  //   });

  //   it('should not fetch documents if userId is missing', async () => {
  //     spyOn(service, 'getUserId').and.returnValue(Promise.resolve(''));
  //     await service.fetchDocs();
  //     expect(mockSupabase.from().select).not.toHaveBeenCalled();
  //   });
  // });

  // describe('fetchDoc', () => {
  //   it('should fetch a document', async () => {
  //     const testDoc = {
  //       id: 1,
  //       title: 'Test Doc',
  //       edittime: '2024-01-01T12:00:00Z',
  //       content: 'Test Content',
  //       shared_users: null,
  //     };
  //     await service.fetchDoc(1);
  //     expect(mockSupabase.from).toHaveBeenCalledWith('docs');
  //     expect(mockSupabase.from().select).toHaveBeenCalled();
  //     expect(mockDocsService.setDocs).toHaveBeenCalled();

  //     mockDocsService.docChanged.next(testDoc);

  //     mockDocsService.docChanged$.subscribe((doc) => {
  //       expect(doc).toEqual(testDoc);
  //     });
  //   });

  //   it('should handle error when fetching fails', async () => {
  //     // spyOn(service, 'fetchDoc').and.returnValue(Promise.reject())
  //     spyOn(console, 'error');
  //     mockSupabase.from().select().eq.and.returnValue(Promise.reject());
  //     await service.fetchDoc(1);
  //     expect(console.error).toHaveBeenCalled();
  //   });
  // });

  // describe('getID and getIDs', () => {
  //   it('should store id when passed', () => {
  //     service.getID(5);
  //     expect(service.index).toEqual(1);
  //   });
  //   it('should store ids when passed and call deleteDocs', () => {
  //     spyOn(service, 'deleteDocs');
  //     service.getIDs(10);
  //     expect(service.indices).toContain(10);
  //     expect(service.deleteDocs).toHaveBeenCalled();
  //   });
  // });

  // describe('deleteDoc', () => {
  //   it('should delete a document and reload the page', async () => {
  //     spyOn(window.location, 'reload');
  //     service.index = 1;
  //     await service.deleteDoc();
  //     expect(mockDocsService.deleteDoc).toHaveBeenCalledWith(1);
  //     expect(mockSupabase.from).toHaveBeenCalledWith('docs');
  //     expect(window.location.reload).toHaveBeenCalled();
  //   });

  //   it('should handle error if deleting fails', async () => {
  //     spyOn(console, 'error');
  //     mockSupabase.from().delete().eq.and.returnValue(Promise.reject());
  //     expect(console.error).toHaveBeenCalled();
  //   });
  // });

  // describe('deleteDocs', () => {
  //   it('should delete docs and reload the page', async () => {
  //     spyOn(window.location, 'reload');
  //     service.indices = [1, 2, 3];
  //     await service.deleteDocs();
  //     expect(mockDocsService.deleteDocs).toHaveBeenCalledWith([1, 2, 3]);
  //     expect(mockSupabase.from().delete().in).toHaveBeenCalledWith(
  //       'id',
  //       [1, 2, 3]
  //     );
  //     expect(window.location.reload).toHaveBeenCalled();
  //   });

  //   it('should handle error if indices[] is empty', async () => {
  //     service.indices = [];
  //     await service.deleteDocs();
  //     expect(mockSupabase.from().delete().in).not.toHaveBeenCalled();
  //   });
  // });

  // describe('updateDoc', () => {
  //   it('should update a document and call DocsService.updateDo', async () => {
  //     service.index = 1;
  //     await service.updateDoc(
  //       'Updated Title',
  //       '2024-01-02T12:00:00Z',
  //       'Updated Content'
  //     );
  //     expect(mockSupabase.from).toHaveBeenCalledWith('docs');
  //     expect(mockSupabase.from().update).toHaveBeenCalledWith({
  //       id: 1,
  //       title: 'Updated Title',
  //       edittime: '2024-01-02T12:00:00Z',
  //       content: 'Updated Content',
  //       shared_users: null,
  //     });

  //     expect(mockDocsService.updateDoc).toHaveBeenCalledWith(1, {
  //       id: 1,
  //       title: 'Updated Title',
  //       edittime: '2024-01-02T12:00:00Z',
  //       content: 'Updated Content',
  //       shared_users: null,
  //     });
  //   });
  // });
});
