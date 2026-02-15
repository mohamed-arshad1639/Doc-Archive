import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TrashViewComponent } from './trash-view.component';
import { Router } from '@angular/router';
import { StorageService } from '../../core/services/storage.service';
import { SearchService } from '../../core/services/search.service';
import { of, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { AsyncPipe } from '@angular/common';

describe('TrashViewComponent', () => {
  let component: TrashViewComponent;
  let fixture: ComponentFixture<TrashViewComponent>;
  let mockStorageService: any;
  let mockSearchService: any;
  let mockRouter: any;
  let viewModeSubject: BehaviorSubject<any>;

  beforeEach(waitForAsync(() => {
    // Mock Search Service
    viewModeSubject = new BehaviorSubject({ viewMode: 'grid' });
    mockSearchService = {
      criteria$: viewModeSubject.asObservable(),
      criteriaSignal: () => ({ viewMode: 'grid' }) // Mock signal if accessed directly
    };

    // Mock Storage Service
    mockStorageService = jasmine.createSpyObj('StorageService', ['getTrashItems', 'restoreFolder', 'restoreDocument', 'permanentlyDeleteFolder', 'permanentlyDeleteDocument']);
    mockStorageService.getTrashItems.and.returnValue(Promise.resolve({
      folders: [
        { id: 1, name: 'Deleted Folder 1', parentId: null, createdAt: new Date() }
      ],
      documents: [
        { id: 101, name: 'Deleted Doc 1.pdf', type: 'pdf', size: 1024, folderId: null, createdAt: new Date() }
      ]
    }));
    mockStorageService.refresh$ = of(null);

    // Mock Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [TrashViewComponent, AsyncPipe],
      providers: [
        { provide: StorageService, useValue: mockStorageService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load trash items on init', async () => {
    await fixture.whenStable(); // Wait for async getTrashItems
    expect(mockStorageService.getTrashItems).toHaveBeenCalled();
    expect(component.folders.length).toBe(1);
    expect(component.documents.length).toBe(1);
  });

  it('should display Grid view by default', async () => {
    viewModeSubject.next({ viewMode: 'grid' });
    fixture.detectChanges();
    await fixture.whenStable();

    // Check for grid container class
    const gridContainer = fixture.debugElement.query(By.css('.grid.grid-cols-2'));
    expect(gridContainer).toBeTruthy();
    
    // Check for table (should NOT exist)
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeFalsy();
  });

  it('should switch to List view when service emits "list"', async () => {
    viewModeSubject.next({ viewMode: 'list' });
    fixture.detectChanges();
    await fixture.whenStable();

    // Check for table (should exist)
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();

    // Check that grid container is gone (for docs)
    // Note: Folders might still use a specialized list layout, but docs definitely use a table
    const docTableRows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(docTableRows.length).toBeGreaterThan(0);
  });

  it('should navigate back to home on "Back" button click', () => {
    // Ensure we are at root level (no currentFolder) to see the Back button
    component.currentFolder = null;
    fixture.detectChanges();

    const backButton = fixture.debugElement.query(By.css('button[class*="rounded-full"] svg[viewBox="0 0 24 24"]')).parent; 
    // The selector above targets the button containing the specific SVG (the back arrow)
    // or we can look for the (click)="goBack()" binding if we could see template linkage, 
    // but identifying by unique icon or position is reliable for DOM tests.
    // In our template: <button (click)="goBack()" ...> <svg ... path d="M19 12H5"... /> </button>
    // Let's assume the first button in header when !currentFolder is the back button (since "Trash" text is also there)
    
    // Actually, looking at the template:
    // @if (currentFolder) { ... } @else { <div class="flex..."><button (click)="goBack()">...</button> ... }
    
    if (backButton) {
      backButton.triggerEventHandler('click', null);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    } else {
      fail('Back button not found');
    }
  });

  it('should navigate up (close folder) when clicking breadcrumb in subfolder view', async () => {
    // Simulate opening a folder
    const folder = { id: 1, name: 'Subfolder', parentId: null, createdAt: new Date(), path: '/Subfolder' };
    component.openFolder(folder);
    fixture.detectChanges();

    expect(component.currentFolder).toBe(folder);

    // Find the breadcrumb "Trash >" span
    const breadcrumbSpan = fixture.debugElement.query(By.css('span.cursor-pointer'));
    expect(breadcrumbSpan.nativeElement.textContent).toContain('Trash >');

    // Click it
    breadcrumbSpan.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.currentFolder).toBeNull();
  });
});
