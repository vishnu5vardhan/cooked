const OPENAI_URL = 'https://api.openai.com/v1/responses';

export async function structuredResponse<T>(name: string, instructions: string, input: unknown, schema: Record<string, unknown>, signal?: AbortSignal, image?: string): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured.');
  const qualityStage = name === 'website_evidence' || name === 'website_roast_repair' || name === 'roast_quality';
  const model = qualityStage ? process.env.OPENAI_QUALITY_MODEL || 'gpt-4.1' : process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  const started = Date.now();
  const response = await fetch(OPENAI_URL, {
    method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, store: false, ...(model.startsWith('gpt-5') ? {reasoning: {effort: 'minimal'}} : {}), max_output_tokens: name === 'roast_quality' ? 400 : 1800, instructions, input: image ? [{ role: 'user', content: [{ type: 'input_text', text: JSON.stringify(input) }, { type: 'input_image', image_url: image }] }] : JSON.stringify(input), text: { format: { type: 'json_schema', name, strict: true, schema } } }),
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(30_000)]) : AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`OpenAI analysis failed (${response.status}).`);
  const body = await response.json() as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  // Raw Responses API payloads expose output text in message content. SDK helpers add
  // `output_text`, but the dependency-free server path must support the native shape too.
  const outputText = body.output_text ?? body.output
    ?.flatMap((item) => item.content ?? [])
    .find((item) => item.type === 'output_text')?.text;
  if (!outputText) throw new Error('OpenAI returned no structured output.');
  console.info(JSON.stringify({event: 'model_stage', stage: name, durationMs: Date.now() - started}));
  return JSON.parse(outputText) as T;
}
