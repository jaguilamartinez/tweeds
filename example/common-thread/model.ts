export interface Contributor {
  name: string;
  kind: 'human' | 'agent';
}

export interface ActivityItem {
  id: string;
  actor: Contributor;
  action: string;
  detail?: string;
  /** Human-readable time, for example “09:41” or “Yesterday”. */
  time: string;
  /** Optional machine-readable ISO date/time. */
  dateTime?: string;
  version?: string;
}

export type ArtifactStatus = 'draft' | 'in-review' | 'accepted';

export interface Artifact {
  id: string;
  title: string;
  description: string;
  version: string;
  status: ArtifactStatus;
  contributors: Contributor[];
  activity: ActivityItem[];
}

export const artifactStatusLabels: Readonly<Record<ArtifactStatus, string>> = {
  draft: 'Draft',
  'in-review': 'In review',
  accepted: 'Accepted',
};
