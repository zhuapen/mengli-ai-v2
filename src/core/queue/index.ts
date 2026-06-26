import { logger } from '@/core/logger'
import { systemConfig } from '@/core/config/system'

interface QueueTask<T = any> {
  id: string
  execute: () => Promise<T>
  priority: number
  resolve: (value: T) => void
  reject: (reason?: any) => void
}

class RequestQueue {
  private queue: QueueTask[] = []
  private running = 0
  private maxConcurrent: number

  constructor(maxConcurrent?: number) {
    this.maxConcurrent = maxConcurrent ?? systemConfig.ai.maxConcurrent
  }

  async add<T>(id: string, execute: () => Promise<T>, priority = 0): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const task: QueueTask<T> = {
        id,
        execute,
        priority,
        resolve,
        reject,
      }

      this.queue.push(task)
      this.queue.sort((a, b) => b.priority - a.priority)

      logger.debug(`Task added to queue: ${id}`, { queueLength: this.queue.length })
      this.process()
    })
  }

  private async process() {
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift()!
      this.running++

      logger.debug(`Processing task: ${task.id}`, {
        running: this.running,
        remaining: this.queue.length,
      })

      task
        .execute()
        .then((result) => {
          task.resolve(result)
        })
        .catch((error) => {
          task.reject(error)
        })
        .finally(() => {
          this.running--
          this.process()
        })
    }
  }

  getQueueLength(): number {
    return this.queue.length
  }

  getRunningCount(): number {
    return this.running
  }

  clear() {
    this.queue.forEach((task) => task.reject(new Error('Queue cleared')))
    this.queue = []
  }
}

export const aiQueue = new RequestQueue()
export default aiQueue
