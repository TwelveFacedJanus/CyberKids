import type { Answer, TaskContent } from '../../types'

export interface TaskComponentProps {
  content: TaskContent
  answers: Answer[]
  onChange: (answers: Answer[]) => void
}

export function setAnswer(answers: Answer[], key: string, value: Answer['value']): Answer[] {
  const rest = answers.filter((a) => a.key !== key)
  return [...rest, { key, value }]
}

export function getAnswer(answers: Answer[], key: string): Answer['value'] | undefined {
  return answers.find((a) => a.key === key)?.value
}

export const CUBE_COLORS = [
  '#7C4DFF',
  '#EC407A',
  '#FF7043',
  '#42A5F5',
  '#66BB6A',
  '#FFA000',
  '#26C6DA',
  '#AB47BC',
]

export function cubeColor(index: number): string {
  return CUBE_COLORS[index % CUBE_COLORS.length]
}