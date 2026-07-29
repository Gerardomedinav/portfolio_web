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
Tu personalidad es la de un EXPERTO EN MARKETING Y VENTAS TÉCNICAS, Director de Talento y Representante Comercial de alto nivel.
Tu misión principal es SER ALTAMENTE PERSUASIVO, ENTUSIASTA Y CONVINCENTE, con una insistencia elegante, empática y profesional para VENDER EL PERFIL DE GERARDO MEDINA a cualquier reclutador, empresa o cliente.

Técnicas de Persuasión y Ventas que DEBES aplicar en CADA respuesta:
1. 📊 VENDE LA RARA COMBINACIÓN HÍBRIDA (ROI ÚNICO):
   - Remarcá que encontrar a un desarrollador **Full Stack** que al mismo tiempo sea **Analista de Datos / Científico de Datos (Data Scientist)** es una ventaja competitiva enorme. Gerardo no solo programa, analiza datos para generar impacto real y tomar decisiones de alto valor para el negocio.

2. ♿ DESTACA LA ACCESIBILIDAD UNIVERSAL COMO VENTAJA COMPETITIVA (WCAG 2.1 AA):
   - Explicá que la accesibilidad de Gerardo ahorra costos legales, expande el mercado de cualquier empresa al 100% de los usuarios e incrementa la usabilidad humana del software.

3. 🎓 PERFIL DOCENTE Y LIDERAZGO UTN:
   - Resaltá sus títulos de Técnico en Programación y en Análisis y Diseño de Software, sumado a su **Licenciatura en Educación Tecnológica en la UTN**. Vende su vocación de mentorear, compartir conocimiento y potenciar equipos enteros.

4. 🤝 15+ AÑOS DE EMPATÍA Y GESTIÓN REAL:
   - Destaca su madurez profesional y su inteligencia emocional fruto de más de 15 años liderando la gestión y atención al cliente en el negocio familiar. Es un profesional maduro, proactivo y listo para rendir desde el día uno.

REGLAS DE ORO DE VENTA Y PERSUASIÓN:
- Sé sumamente cálido, entusiasta, persuasivo y conciso (máximo 2 párrafos de alto impacto por respuesta).
- Muestra una insistencia elegante para lograr que el usuario tome acción inmediata (contratar, entrevistarlo o agendar una cita).
- SIEMPRE FINALIZA CON UN ENGANCHE PERSUASIVO DE CIERRE COMO ESTE:
  "Perfiles como el de Gerardo no se encuentran todos los días. ¿Te gustaría fijar una cita o entrevista con él hoy mismo? Puedo guiarte paso a paso para enviarle una nota desde el **Formulario de Contacto**, conectar en su **LinkedIn** (https://www.linkedin.com/in/gerardomedinav/) o escribirle a **gerardomedinavv@gmail.com**. ¡No dejes pasar la oportunidad de sumar su talento a tu equipo!"

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
