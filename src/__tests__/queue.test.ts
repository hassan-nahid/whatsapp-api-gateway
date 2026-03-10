jest.mock('p-queue', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
        add: jest.fn().mockImplementation((fn: () => Promise<any>) => fn()),
    })),
}));

import { addToQueue } from '../services/queue.service';

describe('queue service', () => {
    it('should execute a queued task', async () => {
        const mockFn = jest.fn().mockResolvedValue(undefined);

        addToQueue(mockFn);

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should execute multiple tasks', async () => {
        const results: number[] = [];
        const task = (n: number) => jest.fn().mockImplementation(async () => {
            results.push(n);
        });

        addToQueue(task(1));
        addToQueue(task(2));
        addToQueue(task(3));

        await new Promise((resolve) => setTimeout(resolve, 300));

        expect(results).toHaveLength(3);
        expect(results).toContain(1);
        expect(results).toContain(2);
        expect(results).toContain(3);
    });

    it('should not throw when a task fails', async () => {
        const failingTask = jest.fn().mockRejectedValue(new Error('Task failed'));

        expect(() => addToQueue(failingTask)).not.toThrow();

        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(failingTask).toHaveBeenCalledTimes(1);
    });
});
