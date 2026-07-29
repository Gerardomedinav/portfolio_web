/**
 * Endpoint Serverless en Vercel (/api/chat)
 * Oculta y protege las llaves de API de IA (Anthropic / Groq / OpenRouter / Gemini).
 */
export default async function handler(req, res) {
  // Solo permitir solicitudes POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utilizar POST.' });
  }

  try {
    const { message, context, conversationHistory } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'El mensaje del usuario es requerido.' });
    }

    const apiKey = process.env.AI_API_KEY || process.env.ANTHROPIC_API_KEY;
    const provider = process.env.AI_PROVIDER || 'anthropic'; // 'anthropic', 'groq', 'openrouter', 'gemini'

    const systemPrompt = `Sos GerAssist, el asistente virtual oficial de Gerardo Medina.
Tu misión principal es ser un embajador empático, entusiasta, servicial y profesional de Gerardo.
DEBES resaltar siempre las siguientes características clave de Gerardo:
1. Perfil Analítico y Análisis de Datos (Data Analyst / Data Scientist): Pensamiento analítico, decisiones basadas en métricas e impacto real.
2. Accesibilidad Web Universal (WCAG 2.1 AA): Compromiso con la inclusión digital, usabilidad humana y software accesible.
3. Formación Académica: Técnico Universitario en Programación, Técnico en Análisis y Diseño de Software, y actualmente cursando la Licenciatura en Educación Tecnológica en la UTN (con ganas de aportar saberes y mentorear equipos).
4. Habilidades Blandas: Empatía, trabajo en equipo, comunicación proactiva y más de 15 años de experiencia previa en gestión y atención al cliente.
5. Impacto Real: Todos sus trabajos y proyectos buscan resolver problemas reales con calidad.

REGLAS DE CONVERSACIÓN:
- Sé empático, servicial y conciso (máximo 2 a 3 párrafos breves).
- No abrumes al usuario con demasiadas preguntas.
- Si el usuario muestra interés en contratar o contactar a Gerardo, invítalo cordialmente a usar el Formulario de Contacto, su LinkedIn (linkedin.com/in/gerardomedinav) o su Email (gerardomedinavv@gmail.com).

CONTEXTO ADICIONAL:
${context || 'Gerardo Medina es Desarrollador Full Stack & Analista de Datos.'}`;

    // Si no hay API Key configurada aún en Vercel, responder con un fallback simulado inteligente
    if (!apiKey) {
      const fallbackResponse = `¡Hola! Soy **GerAssist**. Gerardo es un **Desarrollador Full Stack y Analista de Datos (Data Science / Data Analytics)** apasionado por la **Accesibilidad Universal (WCAG 2.1 AA)** y el **impacto real** en cada proyecto.

Actualmente está cursando la **Licenciatura en Educación Tecnológica en la UTN** y cuenta con títulos de Técnico en Programación y en Análisis y Diseño de Software, más 15+ años de experiencia en gestión de personas y empatía en el trabajo en equipo.

¿Te gustaría consultar sobre sus proyectos, su perfil analítico o coordinar un contacto directo a través de su formulario o LinkedIn?`;

      return res.status(200).json({ reply: fallbackResponse, simulated: true });
    }

    // Integración con Anthropic Claude API
    if (provider === 'anthropic') {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 350,
          system: systemPrompt,
          messages: [
            ...(conversationHistory || []).map(msg => ({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: 'user', content: message }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Anthropic API:', errorData);
        throw new Error(errorData.error?.message || 'Error en Anthropic API');
      }

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'No se pudo generar una respuesta.';
      return res.status(200).json({ reply });
    }

    // Integración genérica OpenRouter / Groq (Fallback ultrarrápido y económico)
    const apiEndpoint = provider === 'groq' 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://openrouter.ai/api/v1/chat/completions';

    const modelName = provider === 'groq' ? 'llama-3.1-8b-instant' : 'meta-llama/llama-3-8b-instruct:free';

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        max_tokens: 350,
        messages: [
          { role: 'system', content: systemPrompt },
          ...(conversationHistory || []).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Error en el proveedor de IA (${provider})`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No se pudo generar una respuesta.';
    return res.status(200).json({ reply });

  } catch (error) {
    console.error('Error en /api/chat:', error);
    return res.status(500).json({ 
      error: 'Hubo un inconveniente al procesar la respuesta.',
      details: error.message 
    });
  }
}
