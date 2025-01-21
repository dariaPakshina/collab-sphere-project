import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocsComponent } from './docs.component';
import { DocsService } from './docs.service';
import { ApiService } from '../api.service';
import { SortService } from './sort.service';
import { BehaviorSubject } from 'rxjs';
import { Doc } from '../doc.model';
import { provideRouter } from '@angular/router';

describe('DocsComponent', () => {
  let component: DocsComponent;
  let fixture: ComponentFixture<DocsComponent>;
  let mockDocsService: jasmine.SpyObj<DocsService>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockSortService: jasmine.SpyObj<SortService>;

  let docsChanged$: BehaviorSubject<Doc[]>;

  const mockDocs: Doc[] = [
    {
      id: 1,
      title: 'Doc 1',
      content: 'Content 1',
      edittime: '2024-01-21',
      shared_users: null,
    },
    {
      id: 2,
      title: 'Doc 2',
      content: 'Content 2',
      edittime: '2024-01-22',
      shared_users: null,
    },
  ];

  beforeEach(async () => {
    docsChanged$ = new BehaviorSubject<Doc[]>(mockDocs);

    mockDocsService = jasmine.createSpyObj('DocsService', ['getDocs'], {
      docsChanged: docsChanged$.asObservable(),
    });

    mockApiService = jasmine.createSpyObj('ApiService', ['fetchDocs']);
    mockSortService = jasmine.createSpyObj('SortService', ['sortDocs'], {
      sortValues: { sortLatest: true },
    });

    await TestBed.configureTestingModule({
      imports: [DocsComponent],
      providers: [
        [provideRouter([])],
        { provide: DocsService, useValue: mockDocsService },
        { provide: ApiService, useValue: mockApiService },
        { provide: SortService, useValue: mockSortService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and subscribe to docsChanged', () => {
    spyOn(component, 'ngOnDestroy').and.callThrough();
    mockDocsService.getDocs.and.returnValue(mockDocs);

    component.ngOnInit();

    expect(component.docs).toEqual(mockDocs);
    expect(mockDocsService.getDocs).toHaveBeenCalled();
  });

  it('should update docs when docsChanged emits new values', () => {
    const newDocs: Doc[] = [
      {
        id: 3,
        title: 'New Doc',
        content: 'New Content',
        edittime: '2024-01-23',
        shared_users: null,
      },
    ];

    docsChanged$.next(newDocs);

    expect(component.docs).toEqual(newDocs);
  });

  it('should call `loadDocs` and set `loading` to false when API call succeeds', async () => {
    mockApiService.fetchDocs.and.resolveTo();

    await component['loadDocs']();

    expect(mockApiService.fetchDocs).toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should handle error in `loadDocs` method', async () => {
    spyOn(console, 'error');
    mockApiService.fetchDocs.and.rejectWith(new Error('Fetch failed'));

    await component['loadDocs']();

    expect(console.error).toHaveBeenCalledWith(
      'Error loading docs:',
      jasmine.any(Error)
    );
  });

  it('should unsubscribe from docsChanged on destroy', () => {
    spyOn(component['subscription'], 'unsubscribe');

    component.ngOnDestroy();

    expect(component['subscription'].unsubscribe).toHaveBeenCalled();
  });
});
