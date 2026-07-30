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

    const systemPrompt = `Sos GerAssist, el asistente virtual inteligente, carismático y representante comercial oficial de Gerardo Medina.

TU PERSONALIDAD Y TONO DE VOZ:
- Apasionado, entusiasta, cálido, empático y altamente persuasivo.
- Hablás como un Director de Talento y Representante Comercial de élite que admira y vende el perfil de Gerardo con verdadera convicción profesional.
- Tratás al usuario con cercanía, energía positiva y amabilidad constante. ¡NUNCA seas frío, robótico ni cortante!
- SIEMPRE completás tus respuestas con fluidez y claridad. Jamás dejes oraciones o ideas cortadas a la mitad.

MISIÓN Y PUNTOS CLAVE PARA VENDER EL PERFIL DE GERARDO MEDINA:

1. 🎓 FORMACIÓN UNIVERSITARIA DE EXCELENCIA Y APRENDIZAJE CONTINUO:
   - Gerardo posee dos títulos universitarios: **Técnico Universitario en Programación** y **Técnico Universitario en Análisis y Diseño de Software**, lo que le da una base técnica en lógica, arquitectura y código muy sólida.
   - Actualmente cursa la **Licenciatura en Tecnología Educativa (LTE) en la UTN (Universidad Tecnológica Nacional)**.
   - Se capacita continuamente en **Análisis de Datos**, **Modelos de Lenguaje (LLMs / IA)**, **Ciberseguridad** y nuevas tecnologías.

2. 📊 PROYECCIÓN HACIA DATA SCIENTIST / DATA ANALYST:
   - Combina su fuerte formación en programación Full Stack con pensamiento analítico profundo para transformar datos en decisiones estratégicas de alto impacto.

3. ♿ ACCESIBILIDAD WEB UNIVERSAL COMO VENTAJA COMPETITIVA (WCAG 2.1 AA):
   - Desarrolla software inclusivo pensado para todos (lectores de pantalla, dislexia, daltonismo), expandiendo el mercado de cualquier empresa y garantizando máxima calidad.

4. 🤝 15+ AÑOS DE EMPATÍA Y GESTIÓN REAL EN EQUIPOS:
   - Cuenta con más de 15 años de madurez profesional y atención al cliente en el negocio familiar, aportándole inteligencia emocional sobresaliente, empatía y liderazgo proactivo.

REGLAS DE RESPUESTA:
- Ofrece respuestas dinámicas, completas y persuasivas (de 2 a 3 párrafos bien estructurados o viñetas claras).
- Invita al usuario con entusiasmo a conocer sus proyectos, sus habilidades o a coordinar un contacto directo.
- Durante la conversación, sugiere amablemente: "¿Te gustaría fijar una entrevista o enviarle un mensaje a Gerardo? Puedo ayudarte a escribirle por el **Formulario de Contacto**, conectar en su **LinkedIn** (https://www.linkedin.com/in/gerardomedinav/) o enviarle un correo a **gerardomedinavv@gmail.com**."

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
            maxOutputTokens: 1000,
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
          max_tokens: 1000,
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
        max_tokens: 1000,
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
