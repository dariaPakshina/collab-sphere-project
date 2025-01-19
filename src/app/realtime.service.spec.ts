import { TestBed } from '@angular/core/testing';

import { RealtimeService } from './realtime.service';
import { provideRouter } from '@angular/router';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from './auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('RealtimeService', () => {
  let service: RealtimeService;
  let mockSupabase: jasmine.SpyObj<SupabaseClient>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSnackbar: jasmine.SpyObj<MatSnackBar>;
  let mockChannel: jasmine.SpyObj<any>;

  beforeEach(() => {
    mockSupabase = jasmine.createSpyObj('SupabaseClient', [
      'rpc',
      'from',
      'removeChannel',
    ]);
    mockSupabase.rpc.and.returnValue(
      Promise.resolve({ data: {}, error: null }) as any
    );
    mockSupabase.from.and.returnValue({
      select: jasmine.createSpy().and.returnValue({
        eq: jasmine.createSpy().and.returnValue({
          single: jasmine
            .createSpy()
            .and.returnValue(
              Promise.resolve({ data: { user_id: 'hostId' }, error: null })
            ),
        }),
      }),
    } as any);

    mockAuthService = jasmine.createSpyObj('AuthService', ['fetchUserName']);
    mockAuthService.fetchUserName.and.returnValue(Promise.resolve('TestUser'));

    mockSnackbar = jasmine.createSpyObj('MatSnackBar', ['open']);

    mockChannel = jasmine.createSpyObj('Channel', [
      'track',
      'send',
      'unsubscribe',
    ]);
    mockChannel.track.and.returnValue(Promise.resolve());
    mockChannel.send.and.returnValue(Promise.resolve());
    mockChannel.unsubscribe.and.returnValue(Promise.resolve());

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        RealtimeService,
        { provide: SupabaseClient, useValue: mockSupabase },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackbar },
      ],
    });

    service = TestBed.inject(RealtimeService);
    service.channel = mockChannel;
    service.userRole = 'host';
    service.userIDHost = 'hostId';
    service.userIDShared = 'sharedId';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('trackChannel', () => {
    it('should track presence and log success', async () => {
      await service.trackChannel();
      expect(mockChannel.track).toHaveBeenCalledWith({ userId: 'hostId' });
    });

    it('should handle error when tracking fails', async () => {
      mockChannel.track.and.returnValue(Promise.reject('Tracking error'));
      await service.trackChannel();
      expect(service.sharingMode).toBeFalse();
      expect(mockSnackbar.open).toHaveBeenCalledWith(
        'Error: failed to share',
        'Ok'
      );
    });
  });

  describe('shareDocument', () => {
    // it('should share document and initialize channel', async () => {
    //   spyOn(service, 'initChannel').and.returnValue(Promise.resolve());
    //   await service.shareDocument(1, 'sharedUserId');
    //   expect(service.sharingMode).toBeTrue();
    //   expect(service.docID).toEqual(1);
    //   expect(service.initChannel).toHaveBeenCalledWith(1);
    // });

    it('should handle error when sharing fails', async () => {
      mockSupabase.rpc.and.returnValue(
        Promise.resolve({ error: 'Sharing failed', data: null }) as any
      );
      await service.shareDocument(1, 'sharedUserId');
      expect(service.sharingMode).toBeFalse();
      expect(mockSnackbar.open).toHaveBeenCalledWith(
        'Error: failed to share',
        'Ok'
      );
    });
  });

  describe('fetchHostIdForDoc', () => {
    // it('should return hostId', async () => {
    //   const hostId = await service.fetchHostIdForDoc(1);
    //   expect(hostId).toBe('hostId');
    // });

    it('should handle error when fetching hostId fails', async () => {
      mockSupabase.from.and.returnValue({
        select: jasmine.createSpy().and.returnValue({
          eq: jasmine.createSpy().and.returnValue({
            single: jasmine
              .createSpy()
              .and.returnValue(Promise.resolve({ error: 'Fetching failed' })),
          }),
        }),
      } as any);

      const hostId = await service.fetchHostIdForDoc(1);
      expect(hostId).toEqual('');
      expect(mockSnackbar.open).toHaveBeenCalledWith(
        'Error: failed to share',
        'Ok'
      );
    });
  });

  describe('sendCursorPos', () => {
    it('should send cursor position if user role exists', () => {
      service.sendCursorPos({ start: 0, end: 5 });
      expect(mockChannel.send).toHaveBeenCalledWith({
        type: 'broadcast',
        event: 'cursor-pos',
        payload: {
          userId: 'hostId',
          role: 'host',
          position: { start: 0, end: 5 },
        },
      });
    });

    it('should log error if user role is undefined', () => {
      spyOn(console, 'error');
      service.userRole = undefined as any;
      service.sendCursorPos({ start: 0, end: 5 });
      expect(console.error).toHaveBeenCalledWith(
        'User role is not determined. Cannot send cursor position.'
      );
    });
  });

  describe('sendTextUpdate', () => {
    it('should send text update', () => {
      service.userRole = 'shared';
      service.userIDShared = 'sharedId';
      service.sendTextUpdate('Hello World');
      expect(mockChannel.send).toHaveBeenCalledWith({
        type: 'broadcast',
        event: 'text-update',
        payload: { userId: 'sharedId', content: 'Hello World' },
      });
    });
  });

  describe('unshare', () => {
    it('should send unshare event and remove channel', async () => {
      spyOn(service, 'removeChannel').and.returnValue(Promise.resolve());
      mockChannel.send.and.returnValue(Promise.resolve());
      mockChannel.unsubscribe.and.returnValue(Promise.resolve());
      await service.unshare();
      expect(mockChannel.send).toHaveBeenCalledWith({
        type: 'broadcast',
        event: 'host-unshared',
        payload: { message: 'Sharing is stopped' },
      });
      expect(mockChannel.unsubscribe).toHaveBeenCalled();
    });

    it('should remove channel and clear shared_users', async () => {
      spyOn(service, 'clearSharedUsers').and.returnValue(Promise.resolve());
      await service.removeChannel();
      expect(service.channel).toBeNull();
      expect(service.sharingMode).toBeFalse();
      expect(service.clearSharedUsers).toHaveBeenCalled();
    });
  });
});
