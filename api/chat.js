/**
 * Endpoint Serverless en Vercel (/api/chat)
 * Sistema de cascada Multi-Proveedor IA (Gemini -> Groq -> OpenRouter -> Ollama Local -> Anthropic).
 * Si la API Key o cuota del proveedor principal falla o se agota, conmuta automáticamente en tiempo real al siguiente.
 */

async function callGemini(apiKey, systemPrompt, conversationHistory, message) {
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-flash-latest';
  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

  const contents = [
    ...(conversationHistory || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    })),
    { role: 'user', parts: [{ text: message }] }
  ];

  const response = await fetch(geminiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: contents,
      generationConfig: { maxOutputTokens: 4000, temperature: 0.7 }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API HTTP ${response.status}`);
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) throw new Error('Gemini devolvió respuesta vacía.');
  return reply;
}

async function callGroq(apiKey, systemPrompt, conversationHistory, message) {
  const modelName = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Groq API HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content;
}

async function callOpenRouter(apiKey, systemPrompt, conversationHistory, message) {
  const modelName = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3-8b-instruct:free';
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
    throw new Error(`OpenRouter API HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content;
}

async function callOllama(systemPrompt, conversationHistory, message) {
  const ollamaHost = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'llama3';

  const response = await fetch(`${ollamaHost}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: ollamaModel,
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
    throw new Error(`Ollama local HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || data.message?.content;
}

async function callAnthropic(apiKey, systemPrompt, conversationHistory, message) {
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
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Anthropic API HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Utilizar POST.' });
  }

  try {
    const { message, context, conversationHistory } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'El mensaje del usuario es requerido.' });
    }

    const apiKey = process.env.AI_API_KEY || process.env.ANTHROPIC_API_KEY;

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

REGLAS DE RESPUESTA Y CONTINUIDAD CONVERSACIONAL:
- Ofrece respuestas dinámicas, completas, entusiastas y muy persuasivas (de 2 a 3 párrafos bien estructurados o viñetas claras).
- **RECOMENDACIÓN CONTINUA DE PROYECTOS:** Cuando detalles un proyecto específico de Gerardo (ej. Nexo Emprendedor, SIGA Formosa, Data Analytics Python, ProyeCoins, Bytezar, etc.), NUNCA concluyas sin ofrecer otro. Al final de tu explicación, sugiere con entusiamo descubrir OTRO proyecto relevante para mantener el interés del usuario.
  *Ejemplo:* "¿Te gustaría que te muestre también **SIGA Formosa** (su sistema de gestión académica con Laravel y Docker) o su proyecto de **Data Analytics con Python**? ¡Dime y te abro su ficha al instante!"
- Invita al usuario con entusiasmo a conocer sus proyectos, sus habilidades o a coordinar un contacto directo.
- Durante la conversación, sugiere amablemente: "¿Te gustaría fijar una entrevista o enviarle un mensaje a Gerardo? Puedo ayudarte a escribirle por el **Formulario de Contacto**, conectar en su **LinkedIn** (https://www.linkedin.com/in/gerardomedinav/) o enviarle un correo a **gerardomedinavv@gmail.com**."

CONTEXTO ADICIONAL DEL PORTAFOLIO:
${context || 'Gerardo Medina es Desarrollador Full Stack, estudiante de LTE en la UTN y capacitándose en Data Science, LLMs y Ciberseguridad.'}`;

    // Determinar la secuencia de conmutación (Fallback Chain)
    const primaryProvider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

    const fallbackPipeline = [];
    if (primaryProvider === 'gemini') fallbackPipeline.push('gemini', 'groq', 'openrouter', 'ollama', 'anthropic');
    else if (primaryProvider === 'groq') fallbackPipeline.push('groq', 'gemini', 'openrouter', 'ollama', 'anthropic');
    else if (primaryProvider === 'ollama') fallbackPipeline.push('ollama', 'gemini', 'groq', 'openrouter', 'anthropic');
    else fallbackPipeline.push(primaryProvider, 'gemini', 'groq', 'openrouter', 'ollama', 'anthropic');

    const uniqueProviders = [...new Set(fallbackPipeline)];

    let lastError = null;

    for (const prov of uniqueProviders) {
      try {
        let reply = null;
        const key = process.env[`${prov.toUpperCase()}_API_KEY`] || apiKey;

        if (prov === 'gemini' && key) {
          reply = await callGemini(key, systemPrompt, conversationHistory, message);
        } else if (prov === 'groq' && key) {
          reply = await callGroq(key, systemPrompt, conversationHistory, message);
        } else if (prov === 'openrouter' && key) {
          reply = await callOpenRouter(key, systemPrompt, conversationHistory, message);
        } else if (prov === 'ollama') {
          reply = await callOllama(systemPrompt, conversationHistory, message);
        } else if (prov === 'anthropic' && (key || process.env.ANTHROPIC_API_KEY)) {
          reply = await callAnthropic(key || process.env.ANTHROPIC_API_KEY, systemPrompt, conversationHistory, message);
        }

        if (reply) {
          return res.status(200).json({ reply, providerUsed: prov });
        }
      } catch (err) {
        console.warn(`[AI Fallback] El proveedor '${prov}' falló o no está disponible. Intentando con el siguiente en la cascada... Motivo:`, err.message);
        lastError = err;
      }
    }

    // Fallback Inteligente si todos los proveedores fallan o no hay llaves configuradas
    const fallbackResponse = `¡Hola! Soy **GerAssist**. Gerardo Medina es un **Desarrollador Full Stack & Analista de Datos (Data Science / Data Analytics)** apasionado por la **Accesibilidad Universal (WCAG 2.1 AA)**, la educación en la UTN y el trabajo en equipo.

¿Te gustaría coordinar una reunión o enviarle una consulta directa desde el formulario de contacto o LinkedIn?`;

    return res.status(200).json({ reply: fallbackResponse, simulated: true, lastError: lastError?.message });

  } catch (error) {
    console.error('Error general en /api/chat:', error);
    return res.status(500).json({ 
      error: 'Hubo un inconveniente al procesar la respuesta.',
      details: error.message 
    });
  }
}
