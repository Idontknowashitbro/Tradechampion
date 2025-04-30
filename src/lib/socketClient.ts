// Mock Socket.IO client for real-time updates
class SocketClient {
  private handlers: Map<string, Array<(data: any) => void>> = new Map();
  private connected: boolean = false;

  // Initialize socket connection - use mock implementation
  public init(token: string): void {
    console.log('Mock socket initialized with token:', token);
    
    // Simulate a delayed connect event
    setTimeout(() => {
      this.connected = true;
      console.log('Mock socket connected');
      
      // Notify any connect handlers
      const handlers = this.handlers.get('connect') || [];
      handlers.forEach(handler => handler(null));
    }, 500);
  }

  // Disconnect socket
  public disconnect(): void {
    if (this.connected) {
      this.connected = false;
      console.log('Mock socket disconnected');
      
      // Notify any disconnect handlers
      const handlers = this.handlers.get('disconnect') || [];
      handlers.forEach(handler => handler(null));
    }
  }

  // Add event handler
  public on(event: string, handler: (data: any) => void): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    
    this.handlers.get(event)?.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(event) || [];
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    };
  }

  // Connect to cTrader - simulate success after delay
  public connectCTrader(data: { accountId: string, accessToken: string, challengeEntryId: number }): void {
    console.log('Mock connect cTrader:', data);
    
    // Simulate a successful connection after a delay
    setTimeout(() => {
      this.emit('notification', {
        type: 'connection',
        title: 'Connected Successfully',
        message: 'Your cTrader account has been connected.',
        timestamp: new Date().toISOString()
      });
    }, 2000);
  }

  // Disconnect from cTrader
  public disconnectCTrader(): void {
    console.log('Mock disconnect cTrader');
    
    // Simulate a successful disconnection notification
    setTimeout(() => {
      this.emit('notification', {
        type: 'connection',
        title: 'Disconnected',
        message: 'Your cTrader account has been disconnected.',
        timestamp: new Date().toISOString()
      });
    }, 1000);
  }

  // Check if socket is connected
  public isConnected(): boolean {
    return this.connected;
  }
  
  // Mock socket with null fields to satisfy type checking
  public get socket(): any {
    return {
      connected: this.connected,
      emit: (event: string, data: any) => this.emit(event, data)
    };
  }
  
  // Emit an event to handlers
  private emit(event: string, data: any): void {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }
}

// Create singleton instance
const socketClient = new SocketClient();

export default socketClient; 