import Anthropic from '@anthropic-ai/sdk'
import toml from 'smol-toml'
import systemPrompt from '../prompts/schedule.toml?raw'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
})

const SYSTEM_PROMPT = toml.parse(systemPrompt).system.prompt

export async function parseScheduleFromMessage(userMessage) {

  const today = new Date().toISOString().split('T')[0]

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: `오늘 날짜: ${today}\n사용자 입력: ${userMessage}`,
      },
    ],
  })

  const raw = response.content[0].text.trim()
  const jsonStr = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const parsed = JSON.parse(jsonStr)

  parsed.schedules = (parsed.schedules || []).map(s => ({
    ...s,
    id: s.id && /^[0-9a-f-]{36}$/i.test(s.id) ? s.id : crypto.randomUUID(),
  }))

  return parsed
}
