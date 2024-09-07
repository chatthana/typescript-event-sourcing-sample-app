import { JobStatus } from '@src/domain/status';

export class JobQueryResponseModel {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly status: JobStatus,
    public readonly version: number
  ) {}
}
