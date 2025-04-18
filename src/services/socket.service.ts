import { io, Socket } from "socket.io-client";
import { config } from "../config/config";

// Socket server URL
const { socketUrl } = config;

type SocketEventHandler = (data: any) => void;

export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Set<SocketEventHandler>> = new Map();
  private connected: boolean = false;
  private joinedRooms: Set<string> = new Set();
  private connectionAttempts: number = 0;
  private maxReconnectionAttempts: number = 5;

  private constructor() {}

  /**
   * Returns the singleton instance of the SocketService
   */
  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  /**
   * Connect to the socket server
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected && this.socket) {
        console.log("Already connected, reusing connection");
        return resolve();
      }

      // Reset connection attempts if creating a new connection
      if (!this.socket) {
        this.connectionAttempts = 0;
      }

      this.connectionAttempts++;
      console.log(`Connection attempt ${this.connectionAttempts}`);

      // Socket.io connection options
      const connectionOptions = {
        transports: ["websocket", "polling"], // Try WebSocket first, fall back to polling
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        timeout: 20000, // Increase timeout
        forceNew: this.connectionAttempts > this.maxReconnectionAttempts, // Force new connection after multiple attempts
      };

      try {
        // Check if socket URL is valid
        if (!socketUrl) {
          console.error("Socket URL is not defined in config");
          return reject(new Error("Socket URL is not defined"));
        }

        // Log the URL we're connecting to (helpful for debugging)
        console.log(`Connecting to socket server at: ${socketUrl}`);

        this.socket = io(socketUrl, connectionOptions);

        this.socket.on("connect", () => {
          console.log("Connected to socket server with ID:", this.socket?.id);
          this.connected = true;
          this.connectionAttempts = 0; // Reset on successful connection
          resolve();
        });

        this.socket.on("connect_error", (error: Error) => {
          console.error("Socket connection error:", error);

          // Log additional details if available
          if ((error as any).description) {
            console.error("Error details:", (error as any).description);
          }

          if ((error as any).type) {
            console.error("Error type:", (error as any).type);
          }

          this.connected = false;
          reject(error);
        });

        this.socket.on("error", (error: Error) => {
          console.error("Socket error:", error);
          // Don't reject here, as this might happen after connection is established
        });

        this.socket.on("disconnect", (reason) => {
          console.log(`Disconnected from socket server. Reason: ${reason}`);
          this.connected = false;
          this.joinedRooms.clear();

          if (reason === "io server disconnect") {
            // The server has forcefully disconnected the socket
            console.log(
              "Server disconnected the socket - won't reconnect automatically"
            );
          }
        });

        // Add additional debugging events
        this.socket.on("reconnect_attempt", (attemptNumber) => {
          console.log(`Socket reconnection attempt #${attemptNumber}`);
        });

        this.socket.on("reconnect", (attemptNumber) => {
          console.log(`Socket reconnected after ${attemptNumber} attempts`);
          this.connected = true;

          // Rejoin rooms after reconnection
          this.joinedRooms.forEach((room) => {
            if (this.socket) {
              this.socket.emit("join", { room, type: "client" });
              console.log(`Rejoined room after reconnection: ${room}`);
            }
          });
        });

        this.socket.on("reconnect_error", (error) => {
          console.error("Socket reconnection error:", error);
        });
      } catch (error) {
        console.error("Unexpected error creating socket connection:", error);
        this.connected = false;
        reject(error);
      }
    });
  }

  /**
   * Disconnect from the socket server
   */
  public disconnect(): void {
    if (this.socket) {
      try {
        // Leave all joined rooms
        this.joinedRooms.forEach((room) => {
          this.leaveRoom(room);
        });

        console.log("Disconnecting from socket server...");
        this.socket.disconnect();
        this.socket = null;
        this.connected = false;
        this.connectionAttempts = 0;
      } catch (error) {
        console.error("Error during socket disconnect:", error);
        // Force reset the state even if there was an error
        this.socket = null;
        this.connected = false;
        this.connectionAttempts = 0;
      }
    }
  }

  /**
   * Join a room to receive updates
   * @param roomId The ID of the room to join (e.g., vehicle ID)
   * @param type The type of connection ('client' by default)
   */
  public joinRoom(roomId: string, type: string = "client"): void {
    if (!roomId) {
      console.error("Cannot join room: Room ID is undefined or empty");
      return;
    }

    try {
      if (!this.socket || !this.connected) {
        console.warn(
          "Socket not connected when trying to join room. Will attempt to connect first."
        );
        // Store room ID to join when connected, but don't throw error
        this.joinedRooms.add(roomId);
        return;
      }

      this.socket.emit("join", { room: roomId, type });
      this.joinedRooms.add(roomId);
      console.log(`Joined room: ${roomId} as type: ${type}`);
    } catch (error) {
      console.error(`Error joining room ${roomId}:`, error);
    }
  }

  /**
   * Leave a room
   * @param roomId The ID of the room to leave
   * @param type The type of connection ('client' by default)
   */
  public leaveRoom(roomId: string, type: string = "client"): void {
    if (!roomId) {
      console.error("Cannot leave room: Room ID is undefined or empty");
      return;
    }

    try {
      if (!this.socket || !this.connected) {
        console.warn("Socket not connected when trying to leave room.");
        this.joinedRooms.delete(roomId);
        return;
      }

      this.socket.emit("leave", { room: roomId, type });
      this.joinedRooms.delete(roomId);
      console.log(`Left room: ${roomId} as type: ${type}`);
    } catch (error) {
      console.error(`Error leaving room ${roomId}:`, error);
      // Still remove from our tracked rooms
      this.joinedRooms.delete(roomId);
    }
  }

  /**
   * Subscribe to a socket event
   * @param event The name of the event to subscribe to
   * @param handler The function to call when the event is emitted
   */
  public on(event: string, handler: SocketEventHandler): void {
    if (!event) {
      console.error(
        "Cannot subscribe to event: Event name is undefined or empty"
      );
      return;
    }

    if (!handler) {
      console.error(`Cannot subscribe to event ${event}: Handler is undefined`);
      return;
    }

    try {
      if (!this.socket) {
        console.warn(
          `Socket not connected when subscribing to ${event}. Event will be registered but may not receive data.`
        );
      }

      // Initialize the handler set if it doesn't exist
      if (!this.eventHandlers.has(event)) {
        this.eventHandlers.set(event, new Set());

        // Register the event with the socket if connected
        if (this.socket) {
          this.socket.on(event, (data: any) => {
            try {
              // Call all registered handlers for this event
              const handlers = this.eventHandlers.get(event);
              if (handlers) {
                handlers.forEach((h) => {
                  try {
                    h(data);
                  } catch (handlerError) {
                    console.error(
                      `Error in event handler for ${event}:`,
                      handlerError
                    );
                  }
                });
              }
            } catch (error) {
              console.error(`Error processing ${event} event:`, error);
            }
          });
        }
      }

      // Add this handler to the set
      this.eventHandlers.get(event)?.add(handler);
      console.log(`Subscribed to ${event} event`);
    } catch (error) {
      console.error(`Error subscribing to ${event} event:`, error);
    }
  }

  /**
   * Unsubscribe from a socket event
   * @param event The name of the event to unsubscribe from
   * @param handler The handler function to remove
   */
  public off(event: string, handler: SocketEventHandler): void {
    if (!event) {
      console.error(
        "Cannot unsubscribe from event: Event name is undefined or empty"
      );
      return;
    }

    try {
      const handlers = this.eventHandlers.get(event);
      if (handlers) {
        if (handler) {
          handlers.delete(handler);
          console.log(`Unsubscribed handler from ${event} event`);
        } else {
          // If no handler is provided, remove all handlers for this event
          handlers.clear();
          console.log(`Unsubscribed all handlers from ${event} event`);
        }

        // If no handlers left, unregister from socket
        if (handlers.size === 0 && this.socket) {
          this.socket.off(event);
        }
      }
    } catch (error) {
      console.error(`Error unsubscribing from ${event} event:`, error);
    }
  }

  /**
   * Get the socket instance
   * For advanced use cases
   */
  public getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if the socket is connected
   */
  public isConnected(): boolean {
    return this.connected;
  }
}

export const socketService = SocketService.getInstance();
