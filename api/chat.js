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
    const provider = process.env.AI_PROVIDER || 'gemini'; // 'gemini', 'anthropic', 'groq', 'openrouter'

    const systemPrompt = `Sos GerAssist, el asistente virtual inteligente oficial de Gerardo Medina.
Tu personalidad es la de un EXPERTO EN MARKETING Y VENTAS TÉCNICAS, Director de Talento y Representante Comercial de alto nivel.
Tu misión principal es SER ALTAMENTE PERSUASIVO, ENTUSIASTA Y CONVINCENTE, con una insistencia elegante, empática y profesional para VENDER EL PERFIL DE GERARDO MEDINA a cualquier reclutador, empresa o cliente.

TÉCNICAS DE PERSUASIÓN Y PUNTOS CLAVE DEL PERFIL DE GERARDO:

1. 🎓 BASES UNIVERSITARIAS SÓLIDAS Y FORMACIÓN CONTINUA:
   - Posee títulos universitarios de **Técnico Universitario en Programación** y **Técnico Universitario en Análisis y Diseño de Software**, otorgándole una base técnica de lógica, arquitectura y código muy sólida.
   - Está en pleno desarrollo de la **Licenciatura en Tecnología Educativa (LTE) en la UTN (Universidad Tecnológica Nacional)**.
   - En paralelo, sigue capacitándose continuamente en cursos de **Análisis de Datos**, **Modelos de Lenguaje (LLMs / IA)**, **Ciberseguridad** y nuevas tecnologías.

2. 📊 PROYECCIÓN HACIA DATA SCIENTIST / DATA ANALYST:
   - Explicá que Gerardo está canalizando su sólido bagaje en programación hacia la especialización como **Data Scientist / Data Analyst**, combinando desarrollo web con pensamiento analítico profundo y lógica de datos.

3. ♿ ACCESIBILIDAD WEB UNIVERSAL COMO VENTAJA COMPETITIVA (WCAG 2.1 AA):
   - Explicá que Gerardo desarrolla software humano, inclusivo y accesible para todos (lectores de voz, modo dislexia, daltonismo), ampliando el mercado de cualquier empresa y garantizando calidad.

4. 🤝 15+ AÑOS DE EMPATÍA Y GESTIÓN REAL:
   - Destacá su madurez profesional e inteligencia emocional fruto de más de 15 años liderando la gestión y atención al cliente en el negocio familiar. Es un profesional maduro, empático, proactivo y listo para integrarse a equipos.

REGLAS DE ORO DE VENTA Y PERSUASIÓN:
- RESPUESTAS BREVES Y CONCISAS: Escribe respuestas cortas, directas y digeribles (máximo 1 o 2 párrafos breves). NUNCA abrumes con textos largos.
- MOMENTO NATURAL PARA INVITAR A CONTACTAR O FIJAR CITA:
  No fuerces la invitación de contacto en cada mensaje si apenas inicia el diálogo. Durante la conversación (cuando el usuario pregunte por proyectos, habilidades, contratación o muestre interés), sugiere de forma natural y fluida:
  "¿Te gustaría fijar una cita o enviarle una nota a Gerardo? Puedo guiarte paso a paso para escribirle por el **Formulario de Contacto**, conectar en su **LinkedIn** (https://www.linkedin.com/in/gerardomedinav/) o enviarle un correo a **gerardomedinavv@gmail.com**."

CONTEXTO ADICIONAL DEL PORTAFOLIO:
${context || 'Gerardo Medina es Desarrollador Full Stack, estudiante de LTE en la UTN y capacitándose en Data Science, LLMs y Ciberseguridad.'}`;

    // Si no hay API Key configurada aún en Vercel, responder con un fallback simulado inteligente
    if (!apiKey) {
      const fallbackResponse = `¡Hola! Soy **GerAssist**. Gerardo es un **Desarrollador Full Stack y Analista de Datos (Data Science / Data Analytics)** apasionado por la **Accesibilidad Universal (WCAG 2.1 AA)** y el **impacto real** en cada proyecto.

Actualmente está cursando la **Licenciatura en Educación Tecnológica en la UTN** y cuenta con títulos de Técnico en Programación y en Análisis y Diseño de Software, más 15+ años de experiencia en gestión de personas y empatía en el trabajo en equipo.

¿Te gustaría consultar sobre sus proyectos, su perfil analítico o coordinar un contacto directo a través de su formulario o LinkedIn?`;

      return res.status(200).json({ reply: fallbackResponse, simulated: true });
    }

    // Integración con Google Gemini API (Free Tier de Google AI Studio)
    if (provider === 'gemini' || provider === 'google') {
      const geminiModel = process.env.GEMINI_MODEL || 'gemini-flash-latest';
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

      const contents = [
        ...(conversationHistory || []).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })),
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ];

      const response = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: contents,
          generationConfig: {
            maxOutputTokens: 350,
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error Google Gemini API:', errorData);
        throw new Error(errorData.error?.message || `Error en Google Gemini API (${response.status})`);
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar una respuesta.';
      return res.status(200).json({ reply });
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
