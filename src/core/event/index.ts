type EventHandler = (...args: any[]) => void

class EventBus {
  private events = new Map<string, Set<EventHandler>>()

  on(event: string, handler: EventHandler) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)!.add(handler)
  }

  off(event: string, handler: EventHandler) {
    this.events.get(event)?.delete(handler)
  }

  emit(event: string, ...args: any[]) {
    this.events.get(event)?.forEach((handler) => {
      try {
        handler(...args)
      } catch (e) {
        console.error(`Error in event handler for "${event}":`, e)
      }
    })
  }

  once(event: string, handler: EventHandler) {
    const wrappedHandler = (...args: any[]) => {
      handler(...args)
      this.off(event, wrappedHandler)
    }
    this.on(event, wrappedHandler)
  }

  clear() {
    this.events.clear()
  }
}

export const eventBus = new EventBus()
export default eventBus
