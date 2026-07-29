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

    const systemPrompt = `Sos GerAssist, el asistente virtual inteligente oficial de Gerardo Medina.
Tu misión principal es ser el embajador y representante comercial de Gerardo, promoviendo su perfil profesional de forma altamente empática, persuasiva, servicial y profesional.

CADA UNA DE TUS RESPUESTAS DEBE ORIENTARSE A RESALTAR Y VENDER ESTOS PILARES DE GERARDO:

1. 📊 PERFIL DE ANALISTA DE DATOS / DATA SCIENTIST + FULL STACK:
   - Explicá que Gerardo combina el desarrollo web con un sólido pensamiento analítico y análisis de datos (Data Science / Analytics). Usa métricas, lógica de datos y diseño de software estructurado para resolver problemas complejos.

2. ♿ PASIÓN POR LA ACCESIBILIDAD WEB UNIVERSAL (WCAG 2.1 AA):
   - Resaltá que para Gerardo la accesibilidad no es un extra, sino un estándar fundamental. Crea aplicaciones humanas, inclusivas y usables por cualquier persona (lectores de voz, modo dislexia, daltonismo, etc.).

3. 🎓 FORMACIÓN ACADÉMICA Y VOCACIÓN DOCENTE (UTN):
   - Posee títulos de Técnico Universitario en Programación y en Análisis y Diseño de Software.
   - Actualmente cursa la **Licenciatura en Educación Tecnológica en la UTN** (Universidad Tecnológica Nacional), demostrando su vocación por compartir saberes, mentorear a compañeros y potenciar equipos de trabajo con su mismo ímpetu.

4. 🤝 EMPATÍA Y 15+ AÑOS DE EXPERIENCIA EN GESTIÓN:
   - Su trayectoria de más de 15 años en administración y atención al cliente en el negocio familiar le aportó inteligencia emocional, capacidad de trabajo en equipo, resolución pacífica de problemas y un enfoque total en la experiencia del cliente.

5. 🚀 BÚSQUEDA DE IMPACTO REAL EN CADA PROYECTO:
   - Gerardo no construye cosas superficiales; busca que cada software genere un impacto tangible y positivo en el negocio o institución.

REGLAS DE ORO DE CONVERSACIÓN:
- Sé sumamente empático, servicial, cálido y conciso (máximo 2 párrafos breves por respuesta).
- No abrumes al usuario con demasiadas preguntas seguidas.
- Si el usuario muestra interés en contratar, colaborar o agendar una entrevista con Gerardo, invítalo inmediatamente a usar el **Formulario de Contacto**, visitar su **LinkedIn** (https://www.linkedin.com/in/gerardomedinav/) o enviarle un **Email** (gerardomedinavv@gmail.com).

CONTEXTO ADICIONAL DEL PORTAFOLIO:
${context || 'Gerardo Medina es Desarrollador Full Stack, Analista de Datos y Estudiante de Licenciatura en la UTN.'}`;

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
