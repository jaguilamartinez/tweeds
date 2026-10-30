/** Content for the Common Thread example. It is not part of the UI package. */
import type { Artifact, Contributor } from './model';

export const projectQuestion = 'How do we track, understand and evolve things created by humans and intelligent agents together?';

export const maya: Contributor = { name: 'Maya Chen', kind: 'human' };
export const researchAgent: Contributor = { name: 'Research agent', kind: 'agent' };

export function createInitialArtifacts(): Artifact[] {
  return [
    {
      id: 'brief', title: 'Design brief', version: '0.3', status: 'in-review',
      description: 'A shared starting point for tracing decisions, contributions and changes.',
      contributors: [maya, researchAgent], activity: [
        { id: 'b1', actor: maya, action: 'Set the question', detail: 'Keep a useful record of what changed, who contributed and why.', time: '09:12', version: '0.1' },
        { id: 'b2', actor: researchAgent, action: 'Drafted the first brief', detail: 'Compared three approaches: activity history, artifact lineage and decision records.', time: '09:18', version: '0.2' },
        { id: 'b3', actor: maya, action: 'Requested a clearer scope', detail: 'Focus the first experiment on one artifact and its decisions.', time: '09:31', version: '0.2' },
        { id: 'b4', actor: researchAgent, action: 'Submitted a revised brief', detail: 'Added explicit human review and a source for each contribution. Ready for review.', time: '09:43', version: '0.3' },
      ],
    },
    {
      id: 'decisions', title: 'Decision log', version: '0.2', status: 'accepted',
      description: 'Three early decisions about attribution, review and version history.',
      contributors: [maya, researchAgent], activity: [
        { id: 'd1', actor: researchAgent, action: 'Collected open decisions', detail: 'Extracted the questions still unresolved in the design brief.', time: '10:04', version: '0.1' },
        { id: 'd2', actor: maya, action: 'Recorded the review decision', detail: 'People accept versions. Agents can propose changes and explain their sources.', time: '10:16', version: '0.2' },
        { id: 'd3', actor: maya, action: 'Accepted this version', detail: 'Use this record as the starting point for the next prototype.', time: '10:21', version: '0.2' },
      ],
    },
  ];
}
